import api from "./api"; // This is the Axios setup we fixed earlier
import db from "../db";  // This is your Dexie local database

export const syncWithServer = async () => {
  // SAFETY CHECK: If the browser's wifi is off, don't even try to sync. Just exit immediately.
  if (!navigator.onLine) return;

  try {
    // ==========================================
    // 1. PUSH: EMTPYING THE OUTBOX
    // ==========================================
    
    // Grab all pending letters from the metal mailbox, heavily relying on Chronological Order
    const outboxEvents = await db.outbox.orderBy('id').toArray();
    
    if (outboxEvents.length > 0) {
      // Send them to the backend endpoint we built in Phase 1
      await api.post('/sync/push', { events: outboxEvents });
      
      // If the server says OK (Code 200), we officially burn the letters in the physical outbox!
      const eventIds = outboxEvents.map(e => e.id);
      await db.outbox.bulkDelete(eventIds);
      
      console.log(`Successfully pushed ${outboxEvents.length} events to server!`);
    }

    // ==========================================
    // 2. PULL: GRABBING NEW DATA
    // ==========================================
    
    // We check Window LocalStorage to see when the last time we talked to the server was.
    // If we've never synced before, we default to the beginning of time (1970).
    const lastSyncTime = localStorage.getItem('lastSyncTime') || new Date(0).toISOString();
    
    // Ask the server for the Delta
    const response = await api.get(`/sync/pull?since=${lastSyncTime}`);
    const { products, customers, sales, saleItems } = response.data;
    
    // bulkPut will effortlessly dump all the new rows straight into your Dexie local database
    if (products.length > 0) await db.products.bulkPut(products);
    if (customers.length > 0) await db.customers.bulkPut(customers);
    if (sales.length > 0) await db.sales.bulkPut(sales);
    if (saleItems.length > 0) await db.sale_items.bulkPut(saleItems);
    
    // Finally, we log this exact moment to LocalStorage so we don't download these rows again tomorrow!
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    
  } catch (error) {
    // If the server crashes or the Wi-Fi drops mid-sync, we just quietly catch the error.
    // Because we haven't deleted the Outbox items yet, they will simply retry automatically on the next loop!
    console.error("Background sync failed. It will retry automatically later.", error);
  }
};