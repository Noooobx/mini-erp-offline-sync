import { useState } from "react";

const SalesTable = ({ saleItems, onQuantityChange, onRemove }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(saleItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSaleItems = saleItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">Sale Items</h2>

        <p className="text-zinc-500 text-sm mt-1">
          Products added to the current invoice.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-zinc-800 text-zinc-500 text-sm bg-zinc-950/40">
            <tr>
              <th className="text-left p-4 font-medium">Product</th>

              <th className="text-left p-4 font-medium">Price</th>

              <th className="text-left p-4 font-medium">Quantity</th>

              <th className="text-left p-4 font-medium">Subtotal</th>

              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSaleItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/20"
              >
                <td className="p-4 font-medium whitespace-nowrap">
                  {item.name}
                </td>

                <td className="p-4 whitespace-nowrap">₹{item.price}</td>

                <td className="p-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(item.id, e.target.value)}
                    className="w-24 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 outline-none focus:border-zinc-700"
                  />
                </td>

                <td className="p-4 font-medium whitespace-nowrap">
                  ₹{item.price * item.quantity}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {saleItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-10 text-zinc-500">
                  No products added to the sale.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-zinc-800 bg-zinc-950/20">
          <p className="text-zinc-500 text-sm text-center sm:text-left">
            Showing <span className="font-medium text-zinc-300">{startIndex + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(startIndex + ITEMS_PER_PAGE, saleItems.length)}</span> of <span className="font-medium text-zinc-300">{saleItems.length}</span> results
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

export default SalesTable;
