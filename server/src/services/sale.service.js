const pool = require("../db/db");

/**
 * Creates a complete sale transaction including calculating totals and updating stock.
 * Implements batch DB queries to avoid the N+1 performance bottleneck.
 */
const createSale = async ({ customer_id, user_id, items }) => {
  const client = await pool.connect();

  try {
    // Start transaction to ensure partial sales don't get stuck in the db
    await client.query("BEGIN");

    if (!items || items.length === 0) {
      throw new Error("Sale must contain at least one item");
    }

    const productIds = items.map((item) => item.product_id);

    // Batch query: We grab ALL products in a single database call using ANY($1)
    
    const productsResult = await client.query(
      `
      SELECT *
      FROM products
      WHERE id = ANY($1)
      `,
      [productIds]
    );

    // Create a dictionary of products for lightning-fast memory lookup
    const productsMap = {};
    for (const product of productsResult.rows) {
      productsMap[product.id] = product;
    }

    let totalAmount = 0;

    // Validate stock and calculate totals purely in server memory
    for (const item of items) {
      const product = productsMap[item.product_id];
      if (!product) {
        throw new Error("Product not found");
      }
      if (product.stock_qty < item.quantity) {
        throw new Error(`${product.name} out of stock`);
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    // Create main master record of the sale
    const saleResult = await client.query(
      `
      INSERT INTO sales
      (customer_id, user_id, total_amount)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [customer_id, user_id, totalAmount]
    );

    const sale = saleResult.rows[0];

    // Sub-loop: Create individual sale items & reduce stock 
    for (const item of items) {
      const product = productsMap[item.product_id];
      const subtotal = Number(product.price) * item.quantity;

      await client.query(
        `
        INSERT INTO sale_items
        (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [sale.id, item.product_id, item.quantity, product.price, subtotal]
      );

      await client.query(
        `
        UPDATE products
        SET stock_qty = stock_qty - $1
        WHERE id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    // Lock in the changes permanently
    await client.query("COMMIT");
    return sale;
  } catch (error) {
    // If anything fails (like stock outage), undo all database inserts immediately
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Always release the connection back to the database pool
    client.release();
  }
};

/**
 * Retrieves the full list of past sales, ordered by newest first.
 */
const getSales = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM sales
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

/**
 * Retrieves a single sale along with its detailed item breakdown.
 */
const getSaleById = async (id) => {
  const saleResult = await pool.query(
    `
    SELECT *
    FROM sales
    WHERE id = $1
    `,
    [id]
  );
  
  if (saleResult.rows.length === 0) return null;

  // Uses a JOIN to fetch both the item specifics AND the product's human-readable name in one go
  const itemsResult = await pool.query(
    `
    SELECT
      sale_items.*,
      products.name
    FROM sale_items
    JOIN products
    ON sale_items.product_id = products.id
    WHERE sale_id = $1
    `,
    [id]
  );

  return {
    sale: saleResult.rows[0],
    items: itemsResult.rows,
  };
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
};