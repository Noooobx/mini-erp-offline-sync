import { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";
import db from "../db";

import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customer.service";

const Customers = () => {
  const customers = useLiveQuery(
    () => db.customers.filter(c => !c.is_deleted).toArray(),
    [],
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this customer?");
    if (!confirmDelete) return;
    try {
      await deleteCustomer(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-zinc-500 text-sm uppercase tracking-wide">
                CRM
              </p>

              <h1 className="text-3xl font-bold mt-1">Customers</h1>

              <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                Manage customer information and records.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search customers..."
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-700 w-full sm:w-72"
              />

              <button
                onClick={handleAdd}
                className="bg-white text-black hover:bg-zinc-200 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap"
              >
                Add Customer
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">Total Customers</p>

              <h2 className="text-2xl font-semibold mt-2">
                {customers.length}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">With Phone</p>

              <h2 className="text-2xl font-semibold mt-2">{customers.filter(c => c.phone).length}</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">With Address</p>

              <h2 className="text-2xl font-semibold mt-2">{customers.filter(c => c.address).length}</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-500 text-sm">Active Records</p>

              <h2 className="text-2xl font-semibold mt-2">
                {customers.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Table */}
        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          selectedCustomer={selectedCustomer}
        />
      </div>
    </div>
  );
};

export default Customers;
