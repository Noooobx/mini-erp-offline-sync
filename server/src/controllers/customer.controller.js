const customerService = require(
  "../services/customer.service"
);

const getCustomers = async (req, res) => {
  try {
    const customers =
      await customerService.getAllCustomers();

    res.json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch customers",
    });
  }
};

const createCustomer = async (req, res) => {
  try {
    const customer =
      await customerService.createCustomer(
        req.body
      );

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create customer",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer =
      await customerService.updateCustomer(
        req.params.id,
        req.body
      );

    res.json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update customer",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(
      req.params.id
    );

    res.json({
      message: "Customer deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete customer",
    });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};