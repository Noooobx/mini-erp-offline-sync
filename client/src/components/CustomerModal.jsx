import {
  useEffect,
  useState,
} from "react";

const CustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedCustomer,
}) => {
  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      address: "",
    });

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        name:
          selectedCustomer.name || "",
        phone:
          selectedCustomer.phone || "",
        address:
          selectedCustomer.address || "",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        address: "",
      });
    }
  }, [selectedCustomer]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
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
            <p className="text-zinc-500 text-sm">
              Customer Management
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              {selectedCustomer
                ? "Edit Customer"
                : "Create Customer"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-700 resize-none"
          />

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
              {selectedCustomer
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;