const pool = require("../db/db");

const getAllProducts = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE is_deleted = FALSE
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

const createProduct = async ({
  name,
  barcode,
  price,
  stock_qty,
}) => {
  const result = await pool.query(
    `
    INSERT INTO products
    (name, barcode, price, stock_qty)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, barcode, price, stock_qty]
  );

  return result.rows[0];
};

const updateProduct = async (
  id,
  { name, barcode, price, stock_qty }
) => {
  const result = await pool.query(
    `
    UPDATE products
    SET
      name = $1,
      barcode = $2,
      price = $3,
      stock_qty = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
    `,
    [name, barcode, price, stock_qty, id]
  );

  return result.rows[0];
};

const deleteProduct = async (id) => {
  await pool.query(
    `
    UPDATE products
    SET is_deleted = TRUE
    WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};