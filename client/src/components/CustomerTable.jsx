import { useState } from "react";
import CustomerRow from "./CustomerRow";

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = customers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">Customer Directory</h2>

        <p className="text-zinc-500 text-sm mt-1">
          View and manage customer records.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-zinc-800 text-zinc-500 text-sm bg-zinc-950/40">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>

              <th className="text-left p-4 font-medium">Phone</th>

              <th className="text-left p-4 font-medium">Address</th>

              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((customer) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800 bg-zinc-950/20">
          <p className="text-zinc-500 text-sm">
            Showing <span className="font-medium text-zinc-300">{startIndex + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(startIndex + ITEMS_PER_PAGE, customers.length)}</span> of <span className="font-medium text-zinc-300">{customers.length}</span> results
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

export default CustomerTable;
