const pool = require("../db/db");

/**
 * Retrieves all valid items from the product inventory.
 * Excludes soft-deleted products so they don't appear in the storefront.
 * @returns {Array} List of product objects.
 */
const getAllProducts = async (shopId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE is_deleted = FALSE AND shop_id = $1
    ORDER BY updated_at DESC
    `,
    [shopId]
  );

  return result.rows;
};

/**
 * Integrates a new product into the database ledger.
 * @returns {Object} The recently created product record.
 */
const createProduct = async ({ name, barcode, price, stock_qty }, shopId) => {
  if (Number(price) < 0) throw new Error("Price cannot be negative");
  if (Number(stock_qty) < 0) throw new Error("Stock quantity cannot be negative");

  const result = await pool.query(
    `
    INSERT INTO products
    (name, barcode, price, stock_qty, shop_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, barcode, price, stock_qty, shopId]
  );

  return result.rows[0];
};

/**
 * Updates an inventory item's core details (such as price or direct stock adjustments).
 * @returns {Object} The newly updated product.
 */
const updateProduct = async (id, { name, barcode, price, stock_qty }, shopId) => {
  if (Number(price) < 0) throw new Error("Price cannot be negative");
  if (Number(stock_qty) < 0) throw new Error("Stock quantity cannot be negative");

  const result = await pool.query(
    `
    UPDATE products
    SET
      name = $1,
      barcode = $2,
      price = $3,
      stock_qty = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND shop_id = $6
    RETURNING *
    `,
    [name, barcode, price, stock_qty, id, shopId]
  );

  return result.rows[0];
};

/**
 * Gracefully soft-deletes a product, ensuring that past historical sales referencing this product ID stay intact.
 */
const deleteProduct = async (id, shopId) => {
  // Soft-deletion ensures relational integrity with the sale_items table
  await pool.query(
    `
    UPDATE products
    SET is_deleted = TRUE
    WHERE id = $1 AND shop_id = $2
    `,
    [id, shopId]
  );
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};