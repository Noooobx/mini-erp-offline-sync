import db, { addToOutbox, generateId } from "../db";
import { scheduleSync } from "./syncWorker";

// 1. GET CUSTOMERS
export const getCustomers = async () => {
  // Filter out locally soft-deleted records before returning to UI
  return await db.customers.filter(c => !c.is_deleted).toArray();
};

// 2. CREATE CUSTOMER
export const createCustomer = async (customerData) => {
  // Generate a UUID for offline creation
  const newCustomer = {
    ...customerData,
    id: generateId(),
    is_deleted: false,
    updated_at: new Date().toISOString()
  };

  // Persist to local database to update UI optimistically
  await db.customers.add(newCustomer);

  // Queue creation event for remote synchronization
  await addToOutbox('CREATE', 'customers', newCustomer);
  scheduleSync();

  return newCustomer;
};

// 3. EDIT CUSTOMER
export const updateCustomer = async (id, updateData) => {
  const updatedCustomer = {
    ...updateData,
    id,
    updated_at: new Date().toISOString()
  };

  // Apply updates locally
  await db.customers.put(updatedCustomer);

  // Queue update event for remote synchronization
  await addToOutbox('UPDATE', 'customers', updatedCustomer);
  scheduleSync();

  return updatedCustomer;
};

// 4. DELETE CUSTOMER
export const deleteCustomer = async (id) => {
  // Implement local soft delete to maintain referential integrity before sync
  const customer = await db.customers.get(id);
  if (!customer) return;
  
  const deletedCustomer = {
    ...customer,
    is_deleted: true, // Flag as soft-deleted to conditionally render out of UI
    updated_at: new Date().toISOString()
  };
  
  // Persist soft delete locally
  await db.customers.put(deletedCustomer);
  
  // Queue hard delete for remote synchronization
  await addToOutbox('DELETE', 'customers', { id });
  scheduleSync();
};