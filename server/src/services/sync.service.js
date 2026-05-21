const pool = require("../db/db");

/**
 * PULL COMMAND: The iPad asks the server "What changed?"
 * We grab everything where the updated_at timestamp is newer than what the iPad last saw.
 */
const pullChanges = async (since) => {
  const products = await pool.query(
    "SELECT * FROM products WHERE updated_at > $1",
    [since],
  );
  const customers = await pool.query(
    "SELECT * FROM customers WHERE updated_at > $1",
    [since],
  );
  const sales = await pool.query("SELECT * FROM sales WHERE created_at > $1", [
    since,
  ]);

  // Sale items don't have their own timestamp (they are tied to a sale),
  // so we use a JOIN to grab items belonging to newly created sales.
  const saleItems = await pool.query(
    `
    SELECT sale_items.* 
    FROM sale_items 
    JOIN sales ON sale_items.sale_id = sales.id 
    WHERE sales.created_at > $1
  `,
    [since],
  );

  // Get the database's exact current time to serve as the new baseline
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
 * PUSH COMMAND: The iPad gives the server a list of stored Outbox Events.
 * This is where we handle the crucial Conflict Resolution!
 */
const processPushEvents = async (events) => {
  const client = await pool.connect();

  try {
    // Start Transaction so if one event fails, they all gracefully fail without corrupting the DB
    await client.query("BEGIN");

    // Make sure we process the events in the exact chronological order they happened locally
    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    for (const event of events) {
      const { action, table, data, timestamp } = event;

      // --- 1. CONFLICT RESOLUTION CHECKS (Only needed for updatable tables like products/customers) ---
      if (table === "products" || table === "customers") {
        const result = await client.query(
          `SELECT updated_at, is_deleted FROM ${table} WHERE id = $1`,
          [data.id],
        );
        const currentRecord = result.rows[0];

        if (currentRecord) {
          // INTERVIEW TOPIC: Soft-Delete Precedence
          // If the server thinks this product is deleted, we IGNORE any incoming iPad updates for it.
          if (currentRecord.is_deleted && action !== "DELETE") {
            continue; // Skip out of this event and move to the next one
          }

          // INTERVIEW TOPIC: Last-Write-Wins
          // If the server's timestamp is NEWER than the iPad's timestamp, the server wins. We IGNORE the iPad.
          if (new Date(currentRecord.updated_at) > new Date(timestamp)) {
            continue; // Skip out of this event
          }
        }
      }

      // --- 2. EXECUTE THE EVENTS ---

      if (table === "products") {
        if (action === "DELETE") {
          // Soft Delete: We never drop the row, just flip the flag and update the timestamp
          await client.query(
            `UPDATE products SET is_deleted = TRUE, updated_at = $1 WHERE id = $2`,
            [timestamp, data.id],
          );
        } else {
          // --- CONFLICT RESOLUTION: DUPLICATE BARCODE ---
          // Since the user is offline, they might accidentally use a barcode that already exists 
          // on the server. If we let Postgres enforce the UNIQUE constraint, it will crash the entire sync!
          if (data.barcode) {
            const barcodeCheck = await client.query(
              `SELECT id FROM products WHERE barcode = $1 AND id != $2 AND is_deleted = FALSE`,
              [data.barcode, data.id]
            );
            if (barcodeCheck.rows.length > 0) {
              console.warn(`Duplicate barcode detected for offline item ${data.name}. Appending conflict suffix.`);
              data.barcode = `${data.barcode}-dup-${data.id.substring(0,4)}`;
            }
          }

          // UPSERT (Insert OR Update): If it doesn't exist, create it. If it DOES exist, overwrite it.
          await client.query(
            `
                INSERT INTO products (id, name, barcode, price, stock_qty, is_deleted, updated_at)
                VALUES ($1, $2, $3, $4, $5, FALSE, $6)
                ON CONFLICT (id) DO UPDATE SET
                  name = EXCLUDED.name,
                  barcode = EXCLUDED.barcode,
                  price = EXCLUDED.price,
                  stock_qty = EXCLUDED.stock_qty,
                  updated_at = EXCLUDED.updated_at,
                  is_deleted = FALSE
             `,
            [
              data.id,
              data.name,
              data.barcode,
              data.price,
              data.stock_qty,
              timestamp,
            ],
          );
        }
      } else if (table === "customers") {
        if (action === "DELETE") {
          await client.query(
            `UPDATE customers SET is_deleted = TRUE, updated_at = $1 WHERE id = $2`,
            [timestamp, data.id],
          );
        } else {
          await client.query(
            `
                INSERT INTO customers (id, name, phone, address, is_deleted, updated_at)
                VALUES ($1, $2, $3, $4, FALSE, $5)
                ON CONFLICT (id) DO UPDATE SET
                  name = EXCLUDED.name,
                  phone = EXCLUDED.phone,
                  address = EXCLUDED.address,
                  updated_at = EXCLUDED.updated_at,
                  is_deleted = FALSE
             `,
            [data.id, data.name, data.phone, data.address, timestamp],
          );
        }
      } else if (table === "sales") {
        // Sales are immutable (we just insert them, we don't update them)
        await client.query(
          `
             INSERT INTO sales (id, customer_id, user_id, total_amount, created_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO NOTHING
          `,
          [
            data.id,
            data.customer_id,
            data.user_id,
            data.total_amount,
            timestamp,
          ],
        );
      } else if (table === "sale_items") {
        // Like sales, sale_items are just inserted
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
      }
    }

    // Lock in the database changes!
    await client.query("COMMIT");
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("DATABASE TRANSACTION FAILED!");
    console.error("Error Detail:", error.detail || "None");
    console.error("Error Hint:", error.hint || "None");
    console.error("Error Code:", error.code || "None");
    throw error;
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  pullChanges,
  processPushEvents,
};
