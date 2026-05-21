import api from "./api";
import db from "../db";

let isSyncing = false;
let queuedSync = false;

let debounceTimer = null;

export const scheduleSync = () => {
  if (!navigator.onLine) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    syncWithServer();
  }, 1000); // Debounce to prevent aggressive sync loops
};

export const syncWithServer = async () => {
  // Check network connectivity before initiating sync

  if (!navigator.onLine) return;
  if (isSyncing) {
    queuedSync = true;
    return;
  }

  isSyncing = true;

  try {
    let pushFailed = false;

    // ==========================================
    // 1. Push Synchronization Phase
    // ==========================================
    const outboxEvents = await db.outbox.orderBy('id').toArray();
    
    if (outboxEvents.length > 0) {
      try {
        const pushResponse = await api.post('/sync/push', { events: outboxEvents }, { timeout: 30000 });
        const succeededEventIds = pushResponse.data?.succeededEventIds || [];
        
        if (succeededEventIds.length > 0) {
          await db.outbox.bulkDelete(succeededEventIds);
          console.log(`Successfully pushed ${succeededEventIds.length}/${outboxEvents.length} events to server!`);
        }

        if (pushResponse.data?.failedEvents?.length > 0) {
           console.warn(`Failed specifically on ${pushResponse.data.failedEvents.length} events.`);
        }
      } catch (error) {
        pushFailed = true;
        console.error("Push sync failed.", error);
      }
    }

    // ==========================================
    // 2. Pull Synchronization Phase
    // ==========================================
    const lastSyncTime = localStorage.getItem('lastSyncTime') || new Date(0).toISOString();
    
    const response = await api.get(`/sync/pull?since=${lastSyncTime}`);
    const { serverTimestamp, products, customers, sales, saleItems } = response.data;
    
    // Hydrate local IndexedDB stores with server payloads
    if (products?.length > 0) await db.products.bulkPut(products);
    if (customers?.length > 0) await db.customers.bulkPut(customers);
    if (sales?.length > 0) await db.sales.bulkPut(sales);
    if (saleItems?.length > 0) await db.sale_items.bulkPut(saleItems);
    
    // Update successful sync timestamp to cursor threshold
    if (serverTimestamp) {
      localStorage.setItem('lastSyncTime', serverTimestamp);
    }
    
  } catch (error) {
    console.error("Background sync failed. It will retry automatically later.", error);
  } finally {
    isSyncing = false;
    if (queuedSync) {
      queuedSync = false;
      scheduleSync();
    }
  }
};
