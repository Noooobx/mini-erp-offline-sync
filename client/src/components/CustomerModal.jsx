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

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold">

            {selectedCustomer
              ? "Edit Customer"
              : "Add Customer"}

          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
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
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 outline-none focus:border-zinc-700"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 outline-none focus:border-zinc-700"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 outline-none focus:border-zinc-700"
          />

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
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