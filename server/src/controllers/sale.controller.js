const pool = require("../db/db");

const createSale = async ({
  customer_id,
  user_id,
  items,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let totalAmount = 0;

    // Calculate totals
    for (const item of items) {
      const productResult = await client.query(
        `
        SELECT *
        FROM products
        WHERE id = $1
        `,
        [item.product_id]
      );

      const product = productResult.rows[0];

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock_qty < item.quantity) {
        throw new Error(
          `${product.name} out of stock`
        );
      }

      totalAmount +=
        Number(product.price) * item.quantity;
    }

    // Create sale
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

    // Create sale items + reduce stock
    for (const item of items) {
      const productResult = await client.query(
        `
        SELECT *
        FROM products
        WHERE id = $1
        `,
        [item.product_id]
      );

      const product = productResult.rows[0];

      const subtotal =
        Number(product.price) * item.quantity;

      // Insert sale item
      await client.query(
        `
        INSERT INTO sale_items
        (
          sale_id,
          product_id,
          quantity,
          unit_price,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          sale.id,
          item.product_id,
          item.quantity,
          product.price,
          subtotal,
        ]
      );

      // Reduce stock
      await client.query(
        `
        UPDATE products
        SET stock_qty = stock_qty - $1
        WHERE id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    return sale;

  } catch (error) {
    await client.query("ROLLBACK");

    throw error;

  } finally {
    client.release();
  }
};

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

const getSaleById = async (id) => {
  const saleResult = await pool.query(
    `
    SELECT *
    FROM sales
    WHERE id = $1
    `,
    [id]
  );

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