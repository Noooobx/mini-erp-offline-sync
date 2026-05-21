import api from "./api"; // This is the Axios setup we fixed earlier
import db from "../db";  // This is your Dexie local database

export const syncWithServer = async () => {
  // SAFETY CHECK: If the browser's wifi is off, don't even try to sync. Just exit immediately.
  if (!navigator.onLine) return;

  try {
    // ==========================================
    // 0. RECONCILIATION: FIXING "STUCK" DATA
    // ==========================================
    // If the user has data in Dexie from BEFORE we added the Outbox, 
    // it will never sync because the Outbox is empty. We fix that here once.
    if (!localStorage.getItem("reconciliation_done_v2")) {
      console.log("Starting one-time data reconciliation (v2)...");
      
      const products = await db.products.toArray();
      const customers = await db.customers.toArray();
      const sales = await db.sales.toArray();
      
      const events = [];
      products.forEach(p => events.push({ action: 'CREATE', table: 'products', data: p, timestamp: p.updated_at || new Date().toISOString() }));
      customers.forEach(c => events.push({ action: 'CREATE', table: 'customers', data: c, timestamp: c.updated_at || new Date().toISOString() }));
      sales.forEach(s => events.push({ action: 'CREATE', table: 'sales', data: s, timestamp: s.created_at || new Date().toISOString() }));
      
      if (events.length > 0) {
        await db.outbox.bulkAdd(events);
        console.log(`Reconciled ${events.length} legacy items into the Outbox.`);
      }
      
      // For the time drift fix, force a full resync!
      localStorage.removeItem("lastSyncTime");
      
      localStorage.setItem("reconciliation_done_v2", "true");
    }

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
    const { serverTimestamp, products, customers, sales, saleItems } = response.data;
    
    // bulkPut will effortlessly dump all the new rows straight into your Dexie local database
    if (products?.length > 0) await db.products.bulkPut(products);
    if (customers?.length > 0) await db.customers.bulkPut(customers);
    if (sales?.length > 0) await db.sales.bulkPut(sales);
    if (saleItems?.length > 0) await db.sale_items.bulkPut(saleItems);
    
    // THE FIX: We must use the SERVER'S CLOCK as the single source of truth, NOT `new Date().toISOString()`.
    // If the phone's local clock is accidentally 5 mins fast, it skips records created by laptops with correct clocks.
    if (serverTimestamp) {
      localStorage.setItem('lastSyncTime', serverTimestamp);
    }
    
  } catch (error) {
    // If the server crashes or the Wi-Fi drops mid-sync, we just quietly catch the error.
    // Because we haven't deleted the Outbox items yet, they will simply retry automatically on the next loop!
    console.error("Background sync failed. It will retry automatically later.", error);
  }
};