import { useEffect, useState } from "react";

const ProductModal = ({ isOpen, onClose, onSubmit, selectedProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    price: "",
    stock_qty: "",
  });

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        barcode: selectedProduct.barcode || "",
        price: selectedProduct.price || "",
        stock_qty: selectedProduct.stock_qty || "",
      });
    } else {
      setFormData({
        name: "",
        barcode: "",
        price: "",
        stock_qty: "",
      });
    }
  }, [selectedProduct]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-sm">Product Management</p>

            <h2 className="text-2xl font-semibold mt-1">
              {selectedProduct ? "Edit Product" : "Create Product"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
          />

          <input
            type="text"
            name="barcode"
            placeholder="Barcode"
            value={formData.barcode}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              min="0"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
            />

            <input
              type="number"
              name="stock_qty"
              min="0"
              placeholder="Stock Quantity"
              value={formData.stock_qty}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium"
            >
              {selectedProduct ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
