import db, { addToOutbox, generateId } from "../db";

// 1. GET PRODUCTS: Reads straight from the incredibly fast local browser database
export const getProducts = async () => {
  // We only return items that haven't been 'soft deleted' locally
  return await db.products.filter((p) => !p.is_deleted).toArray();
};

// 2. CREATE PRODUCT
export const createProduct = async (productData) => {
  // A - Instantly generate a UUID offline on the iPad
  const newProduct = {
    ...productData,
    id: generateId(),
    stock_qty: Number(productData.stock_qty || 0),
    is_deleted: false,
    updated_at: new Date().toISOString(),
  };

  // B - Save to Local Database (so the React UI updates instantly)
  await db.products.add(newProduct);

  // C - Secretly put a letter in the Outbox for the Courier to send to the server later!
  await addToOutbox("CREATE", "products", newProduct);

  return newProduct;
};

// 3. EDIT PRODUCT
export const updateProduct = async (id, updateData) => {
  const updatedProduct = {
    ...updateData,
    id,
    stock_qty: Number(updateData.stock_qty || 0),
    updated_at: new Date().toISOString(),
  };

  // A - Update locally
  await db.products.put(updatedProduct);

  // B - Log to Outbox
  await addToOutbox("UPDATE", "products", updatedProduct);

  return updatedProduct;
};

// 4. DELETE PRODUCT
export const deleteProduct = async (id) => {
  // When offline, we do not physically delete records. We do a "Soft Delete" locally.
  const product = await db.products.get(id);
  if (!product) return;

  const deletedProduct = {
    ...product,
    is_deleted: true, // We hide it!
    updated_at: new Date().toISOString(),
  };

  // A - Soft delete locally (React filters it out via getProducts)
  await db.products.put(deletedProduct);

  // B - Tell the Outbox to firmly DELETE it on the server when we get internet back
  await addToOutbox("DELETE", "products", { id });
};
