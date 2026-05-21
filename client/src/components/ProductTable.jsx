import { useState } from "react";
import ProductRow from "./ProductRow";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">Product Inventory</h2>

        <p className="text-zinc-500 text-sm mt-1">
          View and manage all available products.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-zinc-800 text-zinc-500 text-sm bg-zinc-950/40">
            <tr>
              <th className="text-left p-4 font-medium">Product</th>

              <th className="text-left p-4 font-medium">Barcode</th>

              <th className="text-left p-4 font-medium">Price</th>

              <th className="text-left p-4 font-medium">Stock</th>

              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-zinc-800 bg-zinc-950/20">
          <p className="text-zinc-500 text-sm text-center sm:text-left">
            Showing <span className="font-medium text-zinc-300">{startIndex + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(startIndex + ITEMS_PER_PAGE, products.length)}</span> of <span className="font-medium text-zinc-300">{products.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
            >
              Previous
            </button>
            <span className="text-zinc-400 text-sm px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
