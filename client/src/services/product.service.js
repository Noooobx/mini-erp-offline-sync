import db, { addToOutbox, generateId } from "../db";
import { scheduleSync } from "./syncWorker";

// 1. GET PRODUCTS
export const getProducts = async () => {
  // Filter out locally soft-deleted products before returning to UI
  return await db.products.filter((p) => !p.is_deleted).toArray();
};

// 2. CREATE PRODUCT
export const createProduct = async (productData) => {
  // Generate a UUID for offline creation
  const newProduct = {
    ...productData,
    id: generateId(),
    price: Number(productData.price || 0),
    stock_qty: Number(productData.stock_qty || 0),
    is_deleted: false,
    updated_at: new Date().toISOString(),
  };

  // Persist to local database to update UI optimistically
  await db.products.add(newProduct);

  // Queue creation event for remote synchronization
  await addToOutbox("CREATE", "products", newProduct);
  scheduleSync();

  return newProduct;
};

// 3. EDIT PRODUCT
export const updateProduct = async (id, updateData) => {
  const updatedProduct = {
    ...updateData,
    id,
    price: Number(updateData.price || 0),
    stock_qty: Number(updateData.stock_qty || 0),
    updated_at: new Date().toISOString(),
  };

  // Apply updates locally
  await db.products.put(updatedProduct);

  // Queue update event for remote synchronization
  await addToOutbox("UPDATE", "products", updatedProduct);
  scheduleSync();

  return updatedProduct;
};

// 4. DELETE PRODUCT
export const deleteProduct = async (id) => {
  // Implement local soft delete to maintain referential integrity before sync
  const product = await db.products.get(id);
  if (!product) return;

  const deletedProduct = {
    ...product,
    is_deleted: true, // Flag as soft-deleted to conditionally render out of UI
    updated_at: new Date().toISOString(),
  };

  // Persist soft delete locally
  await db.products.put(deletedProduct);

  // Queue hard delete for remote synchronization
  await addToOutbox("DELETE", "products", { id });
  scheduleSync();
};
