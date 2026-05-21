import db, { addToOutbox, generateId } from "../db";

// 1. GET SALES
export const getSales = async () => {
  return await db.sales.toArray();
};

export const getSaleById = async (id) => {
  return await db.sales.get(id);
};

// 2. CREATE A SALE INVOICE (With Line Items!)
export const createSale = async (payload) => {
  const saleId = generateId();
  const timestamp = new Date().toISOString();
  
  // A - Create the Master Sale entry representing the invoice receipt
  const newSale = {
    id: saleId,
    customer_id: payload.customer_id,
    user_id: payload.user_id,
    total_amount: payload.items.reduce((total, item) => total + (item.quantity * item.price), 0),
    created_at: timestamp
  };

  // B - Add the master sale to Dexie and the Outbox
  await db.sales.add(newSale);
  await addToOutbox('CREATE', 'sales', newSale);

  // C - Loop through all the purchased cart items
  for (const item of payload.items) {
    const saleItem = {
      id: generateId(),
      sale_id: saleId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.quantity * item.price
    };
    
    // Add each line item to Dexie and the Outbox individually
    await db.sale_items.add(saleItem);
    await addToOutbox('CREATE', 'sale_items', saleItem);

    // D - Deduct the stock_qty locally so your UI remains magically
    // accurate even before the background courier syncs with the server!
    const product = await db.products.get(item.product_id);
    if (product) {
      const updatedProduct = {
        ...product,
        stock_qty: product.stock_qty - item.quantity,
        updated_at: timestamp
      };
      await db.products.put(updatedProduct);
      // Sync stock deduction to the server — without this, stock bounces back on next pull!
      await addToOutbox('UPDATE', 'products', updatedProduct);
    }
  }

  return newSale;
};