const pool = require("../db/db");

const getAllCustomers = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM customers
    WHERE is_deleted = FALSE
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

const createCustomer = async ({
  name,
  phone,
  address,
}) => {
  const result = await pool.query(
    `
    INSERT INTO customers
    (name, phone, address)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [name, phone, address]
  );

  return result.rows[0];
};

const updateCustomer = async (
  id,
  { name, phone, address }
) => {
  const result = await pool.query(
    `
    UPDATE customers
    SET
      name = $1,
      phone = $2,
      address = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
    `,
    [name, phone, address, id]
  );

  return result.rows[0];
};

const deleteCustomer = async (id) => {
  await pool.query(
    `
    UPDATE customers
    SET is_deleted = TRUE
    WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};