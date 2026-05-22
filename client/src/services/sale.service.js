import db, { addToOutbox, generateId } from "../db";
import { scheduleSync } from "./syncWorker";

// 1. GET SALES
export const getSales = async () => {
  return await db.sales.toArray();
};

export const getSaleById = async (id) => {
  return await db.sales.get(id);
};

export const getSaleItemsBySaleId = async (saleId) => {
  return await db.sale_items.where("sale_id").equals(saleId).toArray();
};

// 2. Process sale invoice and line items
export const createSale = async (payload) => {
  const saleId = generateId();
  const timestamp = new Date().toISOString();
  
  // Pre-validate all items' stock quantities before creating the sale
  for (const item of payload.items) {
    const product = await db.products.get(item.product_id);
    if (!product) {
      throw new Error(`Product not found`);
    }
    if (product.stock_qty < item.quantity) {
      throw new Error(`"${product.name}" is out of stock (available: ${product.stock_qty})`);
    }
  }

  // Create the master sale record
  const newSale = {
    id: saleId,
    customer_id: payload.customer_id,
    user_id: payload.user_id,
    total_amount: payload.items.reduce((total, item) => total + (item.quantity * item.price), 0),
    created_at: timestamp
  };

  // Persist master sale locally and queue for remote synchronization
  await db.sales.add(newSale);
  await addToOutbox('CREATE', 'sales', newSale);

  // Process individual cart items
  for (const item of payload.items) {
    const saleItem = {
      id: generateId(),
      sale_id: saleId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.quantity * item.price
    };
    
    // Persist line item and queue for remote synchronization
    await db.sale_items.add(saleItem);
    await addToOutbox('CREATE', 'sale_items', saleItem);

    // Optimistically decrement local stock quantity
    const product = await db.products.get(item.product_id);
    if (product) {
      const updatedProduct = {
        ...product,
        stock_qty: product.stock_qty - item.quantity,
        updated_at: timestamp
      };
      await db.products.put(updatedProduct);
      // Queue stock update for remote synchronization
      await addToOutbox('UPDATE', 'products', updatedProduct);
    }
  }

  scheduleSync();
  return newSale;
};