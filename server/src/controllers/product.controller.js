const productService = require("../services/product.service");

const getProducts = async (req, res) => {
  try {
    const products =
      await productService.getAllProducts();

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product =
      await productService.createProduct(
        req.body
      );

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product =
      await productService.updateProduct(
        req.params.id,
        req.body
      );

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update product",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(
      req.params.id
    );

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete product",
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};