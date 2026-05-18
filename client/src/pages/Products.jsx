import { useState, useEffect } from "react";
import { getProducts } from "../services/product.service";

const Products = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Products</h1>

          <p className="text-zinc-400 mt-1 text-sm sm:text-base">
            Manage products and inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-700 w-full sm:w-64"
          />

          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap">
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175">
            <thead className="border-b border-zinc-800 text-zinc-400 text-sm">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/30 transition"
                >
                  <td className="p-4">{product.name}</td>

                  <td className="p-4 text-zinc-400">{product.barcode}</td>

                  <td className="p-4">₹{product.price}</td>

                  <td className="p-4">{product.stock_qty}</td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm transition">
                        Edit
                      </button>

                      <button className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </thead>

            <tbody>
              <tr className="border-b border-zinc-800 hover:bg-zinc-800/30 transition">
                <td className="p-4">Rice</td>

                <td className="p-4 text-zinc-400">123456789</td>

                <td className="p-4">₹50</td>

                <td className="p-4">20</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm transition">
                      Edit
                    </button>

                    <button className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
