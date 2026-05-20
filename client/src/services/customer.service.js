import db, { addToOutbox, generateId } from "../db";

// 1. GET CUSTOMERS
export const getCustomers = async () => {
  // We only return customers that haven't been 'soft deleted' locally
  return await db.customers.filter(c => !c.is_deleted).toArray();
};

// 2. CREATE CUSTOMER
export const createCustomer = async (customerData) => {
  // A - Instantly generate a UUID offline
  const newCustomer = {
    ...customerData,
    id: generateId(),
    is_deleted: false,
    updated_at: new Date().toISOString()
  };

  // B - Save to Local Database (so the React UI updates instantly)
  await db.customers.add(newCustomer);

  // C - Put the 'CREATE' letter in the Outbox
  await addToOutbox('CREATE', 'customers', newCustomer);

  return newCustomer;
};

// 3. EDIT CUSTOMER
export const updateCustomer = async (id, updateData) => {
  const updatedCustomer = {
    ...updateData,
    id,
    updated_at: new Date().toISOString()
  };

  // A - Update locally 
  await db.customers.put(updatedCustomer);

  // B - Log to Outbox for when internet reconnects
  await addToOutbox('UPDATE', 'customers', updatedCustomer);

  return updatedCustomer;
};

// 4. DELETE CUSTOMER
export const deleteCustomer = async (id) => {
  // When offline, we do not physically delete records. We do a "Soft Delete" locally.
  const customer = await db.customers.get(id);
  if (!customer) return;
  
  const deletedCustomer = {
    ...customer,
    is_deleted: true, // We hide it!
    updated_at: new Date().toISOString()
  };
  
  // A - Soft delete locally (React filters it out)
  await db.customers.put(deletedCustomer);
  
  // B - Tell the Outbox to send the hard server DELETE later
  await addToOutbox('DELETE', 'customers', { id });
};