import { useEffect, useMemo, useState, useContext } from "react";

import SalesTable from "../components/SalesTable";

import { getProducts } from "../services/product.service";

import { getCustomers } from "../services/customer.service";

import { createSale } from "../services/sale.service";
import { AuthContext } from "../context/AuthContext";

const Sales = () => {
  const { logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");

  const [saleItems, setSaleItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const customersData = await getCustomers();
        setProducts(productsData);
        setCustomers(customersData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = () => {
    const product = products.find((p) => p.id === selectedProduct);

    if (!product) return;

    const exists = saleItems.find((item) => item.id === product.id);

    if (exists) return;

    setSaleItems([
      ...saleItems,
      {
        ...product,
        quantity: 1,
      },
    ]);
  };

  const handleQuantityChange = (id, quantity) => {
    setSaleItems(
      saleItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Number(quantity),
            }
          : item,
      ),
    );
  };

  const handleRemove = (id) => {
    setSaleItems(saleItems.filter((item) => item.id !== id));
  };

  const totalAmount = useMemo(() => {
    return saleItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [saleItems]);

  const totalQuantity = useMemo(() => {
    return saleItems.reduce((total, item) => total + item.quantity, 0);
  }, [saleItems]);

  const handleCreateSale = async () => {
    try {
      const payload = {
        customer_id: selectedCustomer || null,

        user_id: "367d46d6-b597-46a0-885b-9d2be6427d2e",

        items: saleItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await createSale(payload);

      alert("Sale created");

      setSaleItems([]);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-zinc-500 text-sm">Preparing billing console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-500 text-sm uppercase tracking-wide">
                  Billing
                </p>

                <h1 className="text-3xl font-bold mt-1">Sales</h1>

                <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                  Create invoices and manage sales transactions.
                </p>
              </div>
              <button 
                onClick={logout}
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                Logout
              </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
              >
                <option value="">Walk-in Customer</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddProduct}
                className="bg-white text-black hover:bg-zinc-200 rounded-xl px-4 py-3 font-medium"
              >
                Add Product
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 min-w-0">
                <p className="text-zinc-500 text-sm">Items</p>

                <h2 className="text-2xl font-semibold mt-2 truncate">
                  {saleItems.length}
                </h2>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 min-w-0">
                <p className="text-zinc-500 text-sm">Quantity</p>

                <h2 className="text-2xl font-semibold mt-2 truncate">
                  {totalQuantity}
                </h2>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 min-w-0">
                <p className="text-zinc-500 text-sm">Customer</p>

                <h2 className="text-lg font-semibold mt-2 truncate">
                  {selectedCustomer
                    ? customers.find((c) => c.id === selectedCustomer)?.name
                    : "Walk-in"}
                </h2>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 min-w-0">
                <p className="text-zinc-500 text-sm">Total Amount</p>

                <h2 className="text-2xl font-semibold mt-2 truncate">₹{totalAmount}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <SalesTable
          saleItems={saleItems}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
        />

        {/* Footer */}
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-zinc-500 text-sm">Final Amount</p>

            <h2 className="text-3xl font-bold mt-1 truncate">₹{totalAmount}</h2>
          </div>

          <button
            onClick={handleCreateSale}
            disabled={saleItems.length === 0}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
