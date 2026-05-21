import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSales } from "../services/sale.service";
import { getCustomers } from "../services/customer.service";
import SaleDetailModal from "../components/SaleDetailModal";

const SalesHistory = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const salesData = await getSales();
        const customersData = await getCustomers();
        
        // Sort sales recursively newest first
        salesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setSales(salesData);
        setCustomers(customersData);
      } catch (e) {
        console.error("Error loading sales history:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSales = sales.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getCustomerName = (customerId) => {
    if (!customerId) return "Walk-in Customer";
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-zinc-500 text-sm">Retrieving invoice records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        <div className="flex items-center justify-between mb-6">
           <div>
              <p className="text-zinc-500 text-sm uppercase tracking-wide">Invoices</p>
              <h1 className="text-3xl font-bold mt-1">Sales History</h1>
           </div>
           
           <button 
             onClick={() => navigate('/sales')}
             className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition"
           >
             ← Back to POS
           </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mt-6 shadow-xl">
           <div className="px-5 py-4 border-b border-zinc-800">
             <h2 className="text-lg font-semibold">Ledger</h2>
             <p className="text-zinc-500 text-sm mt-1">Click on any invoice to view detailed purchased line items.</p>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full min-w-[760px]">
               <thead className="border-b border-zinc-800 text-zinc-500 text-sm bg-zinc-950/40">
                 <tr>
                   <th className="text-left p-4 font-medium">Date & Time</th>
                   <th className="text-left p-4 font-medium">Invoice ID</th>
                   <th className="text-left p-4 font-medium">Customer</th>
                   <th className="text-right p-4 font-medium">Total Amount</th>
                   <th className="text-right p-4 font-medium">Action</th>
                 </tr>
               </thead>
               <tbody>
                  {paginatedSales.map(sale => (
                     <tr key={sale.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                       <td className="p-4 whitespace-nowrap text-sm text-zinc-300">
                          {new Date(sale.created_at).toLocaleString()}
                       </td>
                       <td className="p-4 text-xs font-mono text-zinc-500">
                          #{sale.id.split('-')[0]}
                       </td>
                       <td className="p-4 font-medium">
                          {getCustomerName(sale.customer_id)}
                       </td>
                       <td className="p-4 text-right font-medium text-emerald-400">
                          ₹{sale.total_amount}
                       </td>
                       <td className="p-4 text-right">
                          <button 
                             onClick={() => setSelectedSale(sale)}
                             className="px-3 py-1 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-semibold transition"
                          >
                            View Receipt
                          </button>
                       </td>
                     </tr>
                  ))}
                  {sales.length === 0 && (
                     <tr>
                        <td colSpan="5" className="p-10 text-center text-zinc-500">
                           No sales records found. Time to ring up a customer!
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
                Showing <span className="font-medium text-zinc-300">{startIndex + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(startIndex + ITEMS_PER_PAGE, sales.length)}</span> of <span className="font-medium text-zinc-300">{sales.length}</span> records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                  Previous
                </button>
                <span className="text-zinc-400 text-sm px-2">Page {currentPage} of {totalPages}</span>
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
      </div>
      
      {/* Modal Injection */}
      {selectedSale && (
        <SaleDetailModal 
           sale={selectedSale} 
           onClose={() => setSelectedSale(null)} 
        />
      )}
    </div>
  );
};

export default SalesHistory;
