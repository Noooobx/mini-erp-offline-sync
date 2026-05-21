const pool = require("../db/db");

/**
 * PULL ENDPOINT HUB
 * Retrieves all database entries updated after the requested client timestamp.
 */
const pullChanges = async (since, shopId) => {
  const products = await pool.query(
    "SELECT * FROM products WHERE updated_at > $1 AND shop_id = $2",
    [since, shopId],
  );
  const customers = await pool.query(
    "SELECT * FROM customers WHERE updated_at > $1 AND shop_id = $2",
    [since, shopId],
  );
  const sales = await pool.query("SELECT * FROM sales WHERE created_at > $1 AND shop_id = $2", [
    since, shopId
  ]);

  // Resolve related sale_items for newly created sales within the sync interval.
  const saleItems = await pool.query(
    `
    SELECT sale_items.* 
    FROM sale_items 
    JOIN sales ON sale_items.sale_id = sales.id 
    WHERE sales.created_at > $1 AND sales.shop_id = $2
  `,
    [since, shopId],
  );

  // Capture exact server transaction timestamp to establish the client's next iteration cursor
  const timestampResult = await pool.query("SELECT CURRENT_TIMESTAMP as time");
  const serverTimestamp = timestampResult.rows[0].time;

  return {
    serverTimestamp,
    products: products.rows,
    customers: customers.rows,
    sales: sales.rows,
    saleItems: saleItems.rows,
  };
};

/**
 * PUSH ENDPOINT HUB
 * Processes queued outbox mutation events directly from the client.
 * Implements deterministic conflict resolution enforcing Data Integrity and Multi-Tenant Isolation.
 */
const processPushEvents = async (events, shopId, userId) => {
  const succeededEventIds = [];
  const failedEvents = [];
  const tablePriority = {
    products: 0,
    customers: 1,
    sales: 2,
    sale_items: 3,
  };

  events.sort((a, b) => {
    const priorityDiff = (tablePriority[a.table] ?? 99) - (tablePriority[b.table] ?? 99);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const { action, table, data, timestamp } = event;
    const eventId = event.id;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query("SET LOCAL statement_timeout = '8000ms'");
      await client.query("SET LOCAL lock_timeout = '2000ms'");

      if (!["CREATE", "INSERT", "UPDATE", "UPSERT", "DELETE"].includes(action)) {
        throw new Error(`Unsupported sync action: ${action}`);
      }

      // Last-Write-Wins and Soft-Delete constraints
      if (table === "products" || table === "customers") {
        const result = await client.query(
          `SELECT updated_at, is_deleted FROM ${table} WHERE id = $1 AND shop_id = $2`,
          [data.id, shopId],
        );
        const currentRecord = result.rows[0];

        if (currentRecord) {
          if (currentRecord.is_deleted && action !== "DELETE") {
            await client.query("COMMIT");
            if (eventId !== undefined) succeededEventIds.push(eventId);
            continue;
          }
          if (new Date(currentRecord.updated_at) > new Date(timestamp)) {
            await client.query("COMMIT");
            if (eventId !== undefined) succeededEventIds.push(eventId);
            continue;
          }
        }
      }

      if (table === "products") {
        if (action === "DELETE") {
          await client.query(
            `UPDATE products SET is_deleted = TRUE, updated_at = $1 WHERE id = $2 AND shop_id = $3`,
            [timestamp, data.id, shopId],
          );
        } else {
          await client.query(
            `
              INSERT INTO products (id, name, barcode, price, stock_qty, is_deleted, updated_at, shop_id)
              VALUES ($1, $2, $3, $4, $5, FALSE, $6, $7)
              ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                barcode = EXCLUDED.barcode,
                price = EXCLUDED.price,
                stock_qty = EXCLUDED.stock_qty,
                updated_at = EXCLUDED.updated_at,
                is_deleted = FALSE,
                shop_id = EXCLUDED.shop_id
            `,
            [
              data.id,
              data.name,
              data.barcode,
              data.price,
              data.stock_qty,
              timestamp,
              shopId,
            ],
          );
        }
      } else if (table === "customers") {
        if (action === "DELETE") {
          await client.query(
            `UPDATE customers SET is_deleted = TRUE, updated_at = $1 WHERE id = $2 AND shop_id = $3`,
            [timestamp, data.id, shopId],
          );
        } else {
          await client.query(
            `
              INSERT INTO customers (id, name, phone, address, is_deleted, updated_at, shop_id)
              VALUES ($1, $2, $3, $4, FALSE, $5, $6)
              ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                updated_at = EXCLUDED.updated_at,
                is_deleted = FALSE,
                shop_id = EXCLUDED.shop_id
            `,
            [data.id, data.name, data.phone, data.address, timestamp, shopId],
          );
        }
      } else if (table === "sales") {
        await client.query(
          `
            INSERT INTO sales (id, customer_id, user_id, total_amount, created_at, shop_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
          `,
          [
            data.id,
            data.customer_id,
            userId,
            data.total_amount,
            timestamp,
            shopId,
          ],
        );
      } else if (table === "sale_items") {
        await client.query(
          `
            INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price, subtotal)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
          `,
          [
            data.id,
            data.sale_id,
            data.product_id,
            data.quantity,
            data.unit_price,
            data.subtotal,
          ],
        );
      } else {
        throw new Error(`Unsupported sync table: ${table}`);
      }

      await client.query("COMMIT");
      if (eventId !== undefined) succeededEventIds.push(eventId);
    } catch (eventError) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError.message);
      }
      if (eventId !== undefined) {
        failedEvents.push({
          id: eventId,
          table,
          action,
          error: eventError.message,
        });
      }
    } finally {
      client.release();
    }
  }

  return { succeededEventIds, failedEvents };
};

module.exports = {
  pullChanges,
  processPushEvents,
};
