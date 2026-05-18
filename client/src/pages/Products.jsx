import { useEffect, useState } from "react";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {" "}
            Products{" "}
          </h1>{" "}
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">
            {" "}
            Manage products and inventory{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {" "}
          <input
            type="text"
            placeholder="Search products..."
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-700 w-full sm:w-64"
          />{" "}
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
          >
            {" "}
            Add Product{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />{" "}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedProduct={selectedProduct}
      />{" "}
    </div>
  );
};
export default Products;
