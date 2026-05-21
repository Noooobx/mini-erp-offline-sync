import { useState, useEffect } from "react";
import { getSaleItemsBySaleId } from "../services/sale.service";
import { getProducts } from "../services/product.service";

const SaleDetailModal = ({ sale, onClose }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLineItems = async () => {
      try {
        const rawItems = await getSaleItemsBySaleId(sale.id);
        const productsList = await getProducts();
        
        // Join product names
        const enrichedItems = rawItems.map(item => {
          const matchedProduct = productsList.find(p => p.id === item.product_id);
          return {
            ...item,
            productName: matchedProduct ? matchedProduct.name : "Unknown Item"
          };
        });

        setItems(enrichedItems);
      } catch (e) {
        console.error("Failed to load invoice items:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLineItems();
  }, [sale]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <div>
            <h2 className="text-xl font-bold">Invoice Details</h2>
            <p className="text-zinc-500 text-sm mt-1">Transaction ID: {sale.id.slice(0, 8)}...</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-10">
              <svg className="animate-spin h-8 w-8 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 mb-6 text-sm flex justify-between">
                <div>
                  <p className="text-zinc-500">Date</p>
                  <p className="font-semibold">{new Date(sale.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500">Total Charged</p>
                  <p className="font-semibold text-emerald-400 text-lg">₹{sale.total_amount}</p>
                </div>
              </div>

              <h3 className="font-semibold mb-4 zinc-300">Purchased Items</h3>
              
              <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Item</th>
                      <th className="text-left py-3 px-4 font-medium">Qty</th>
                      <th className="text-left py-3 px-4 font-medium">Unit Price</th>
                      <th className="text-right py-3 px-4 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20">
                        <td className="py-3 px-4">{item.productName}</td>
                        <td className="py-3 px-4">{item.quantity}</td>
                        <td className="py-3 px-4">₹{item.unit_price}</td>
                        <td className="py-3 px-4 text-right font-medium">₹{item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaleDetailModal;
