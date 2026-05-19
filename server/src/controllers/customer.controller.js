const customerService = require("../services/customer.service");

/**
 * Retrieves all registered customers from the database.
 */
const getCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    return res.json(customers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch customers" });
  }
};

/**
 * Registers a new customer into the database.
 */
const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    return res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    // Catches PostgreSQL unique constraint errors like duplicate phone/email
    if (error.code === "23505") {
      return res.status(400).json({ error: "Customer with this info already exists" });
    }
    return res.status(500).json({ error: "Failed to create customer" });
  }
};

/**
 * Modifies existing standard details (like address or email) for a customer.
 */
const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    return res.json(customer);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Customer with this info already exists" });
    }
    return res.status(500).json({ error: "Failed to update customer" });
  }
};

/**
 * Deletes a customer registry via soft or hard delete depending on service setup.
 */
const deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    return res.json({ message: "Customer deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete customer" });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};