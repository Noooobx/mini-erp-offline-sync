const saleService = require("../services/sale.service");

/**
 * Creates a new sale order.
 * Expects customer_id, user_id, and an array of items in the request body.
 */
const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale(req.body);
    return res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    if (
      error.message === "Product not found" ||
      error.message.includes("out of stock") ||
      error.message === "Sale must contain at least one item"
    ) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to create sale" });
  }
};

/**
 * Fetches all sales from the database.
 */
const getSales = async (req, res) => {
  try {
    const sales = await saleService.getSales();
    return res.json(sales);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch sales" });
  }
};

/**
 * Fetches a specific sale by its ID, including all purchased line-items.
 */
const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    return res.json(sale);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch sale" });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
};


