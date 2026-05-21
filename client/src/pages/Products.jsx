import { useState, useMemo } from "react";
// EXPLANATION: We import the beautiful toast popup library
import { toast, Toaster } from "react-hot-toast";
import { useLiveQuery } from "dexie-react-hooks";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import db from "../db";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

const Products = () => {
  // useLiveQuery automatically re-renders whenever Dexie data changes (including from background sync!)
  const products = useLiveQuery(
    () => db.products.filter(p => !p.is_deleted).toArray(),
    [],
    [] // default value while loading
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // EXPLANATION: We memorize the heavy array looping!
  const inStockCount = useMemo(() => {
    return products.filter((item) => item.stock_qty > 0).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((item) => item.stock_qty <= 0).length;
  }, [products]);

  const inventoryValue = useMemo(() => {
    return products.reduce((total, item) => total + item.price * item.stock_qty, 0);
  }, [products]);



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
      setIsLoading(true);
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
        toast.success("Product updated!");
      } else {
        await createProduct(formData);
        toast.success("Product created!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* EXPLANATION: We mount the Toaster invisible component so the popups have a place to render */}
      <Toaster position="top-right" />

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
                className="bg-white text-black hover:bg-zinc-200 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap disabled:opacity-50"
                disabled={isLoading}
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
              <h2 className="text-2xl font-semibold mt-2">{inStockCount}</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">Out of Stock</p>
              <h2 className="text-2xl font-semibold mt-2">{outOfStockCount}</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">Inventory Value</p>
              <h2 className="text-2xl font-semibold mt-2">₹{inventoryValue}</h2>
            </div>
          </div>
        </div>

        {/* EXPLANATION: If isLoading is true, we show a friendly loading text! Otherwise we show the table. */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-zinc-400 text-lg animate-pulse">
              Loading Inventory...
            </p>
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

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
