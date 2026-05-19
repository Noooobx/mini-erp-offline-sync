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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-zinc-500 text-sm uppercase tracking-wide">
                Inventory
              </p>

              <h1 className="text-3xl font-bold mt-1">Products</h1>

              <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                Manage products, pricing, and inventory stock.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-700 w-full sm:w-72"
              />

              <button
                onClick={handleAdd}
                className="bg-white text-black hover:bg-zinc-200 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap"
              >
                Add Product
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">Total Products</p>

              <h2 className="text-2xl font-semibold mt-2">{products.length}</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">In Stock</p>

              <h2 className="text-2xl font-semibold mt-2">
                {products.filter((item) => item.stock_qty > 0).length}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">Out of Stock</p>

              <h2 className="text-2xl font-semibold mt-2">
                {products.filter((item) => item.stock_qty <= 0).length}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">Inventory Value</p>

              <h2 className="text-2xl font-semibold mt-2">
                ₹
                {products.reduce(
                  (total, item) => total + item.price * item.stock_qty,
                  0,
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* Table */}
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          selectedProduct={selectedProduct}
        />
      </div>
    </div>
  );
};

export default Products;
