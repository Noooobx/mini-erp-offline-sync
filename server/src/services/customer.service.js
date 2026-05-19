const pool = require("../db/db");

/**
 * Retrieves all active customer profiles from the database.
 * Explicitly filters out soft-deleted records.
 * @returns {Array} List of customer objects.
 */
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

/**
 * Inserts a new customer record.
 * Generates an error automatically if unique constraints (like phone) are violated.
 * @returns {Object} The newly created customer.
 */
const createCustomer = async ({ name, phone, address }) => {
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

/**
 * Mutates an existing customer's basic contact details based on their ID.
 * Refreshes the updated_at timestamp natively.
 * @returns {Object} The updated customer.
 */
const updateCustomer = async (id, { name, phone, address }) => {
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

/**
 * Soft deletes a customer by flagging is_deleted to TRUE.
 * Ensures historical sales records for this customer do not crash due to foreign key constraints.
 */
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