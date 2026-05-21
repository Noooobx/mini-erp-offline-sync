const productService = require("../services/product.service");

/**
 * Retrieves the full active catalog of products.
 */
const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.user.shopId);
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

/**
 * Adds a new product to the inventory database.
 * Returns a 400 if the barcode already exists.
 */
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user.shopId);
    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    // Catches PostgreSQL unique constraint errors like a duplicate barcode
    if (error.code === "23505") { 
      return res.status(400).json({ error: "Product with this barcode already exists" });
    }
    return res.status(500).json({ error: "Failed to create product" });
  }
};

/**
 * Updates an existing product's details in the inventory database.
 */
const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user.shopId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Product with this barcode already exists" });
    }
    return res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * Triggers a soft-delete (sets is_deleted FLAG to TRUE) on a product.
 */
const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.shopId);
    return res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};