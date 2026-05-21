const pool = require("../db/db");

/**
 * Retrieves all active customer profiles from the database.
 * Explicitly filters out soft-deleted records.
 * @returns {Array} List of customer objects.
 */
const getAllCustomers = async (shopId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM customers
    WHERE is_deleted = FALSE AND shop_id = $1
    ORDER BY created_at DESC
    `,
    [shopId]
  );

  return result.rows;
};

/**
 * Inserts a new customer record.
 * Generates an error automatically if unique constraints (like phone) are violated.
 * @returns {Object} The newly created customer.
 */
const createCustomer = async ({ name, phone, address }, shopId) => {
  const result = await pool.query(
    `
    INSERT INTO customers
    (name, phone, address, shop_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, phone, address, shopId]
  );

  return result.rows[0];
};

/**
 * Mutates an existing customer's basic contact details based on their ID.
 * Refreshes the updated_at timestamp natively.
 * @returns {Object} The updated customer.
 */
const updateCustomer = async (id, { name, phone, address }, shopId) => {
  const result = await pool.query(
    `
    UPDATE customers
    SET
      name = $1,
      phone = $2,
      address = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 AND shop_id = $5
    RETURNING *
    `,
    [name, phone, address, id, shopId]
  );

  return result.rows[0];
};

/**
 * Soft deletes a customer by flagging is_deleted to TRUE.
 * Ensures historical sales records for this customer do not crash due to foreign key constraints.
 */
const deleteCustomer = async (id, shopId) => {
  await pool.query(
    `
    UPDATE customers
    SET is_deleted = TRUE
    WHERE id = $1 AND shop_id = $2
    `,
    [id, shopId]
  );
};

module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};