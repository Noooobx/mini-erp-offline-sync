import { useEffect, useState } from "react";
import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customer.service";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);
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
      fetchCustomers();
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
      fetchCustomers();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      {" "}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {" "}
            Customers{" "}
          </h1>{" "}
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">
            {" "}
            Manage customers{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
        >
          {" "}
          Add Customer{" "}
        </button>{" "}
      </div>{" "}
      <CustomerTable
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />{" "}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedCustomer={selectedCustomer}
      />{" "}
    </div>
  );
};
export default Customers;
