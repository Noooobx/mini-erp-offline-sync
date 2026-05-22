import api from "./api";
import db from "../db";
import toast from "react-hot-toast";

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
        }

        if (pushResponse.data?.failedEvents?.length > 0) {
           pushResponse.data.failedEvents.forEach(event => {
             let friendlyMsg = "Some offline changes couldn't be saved due to invalid data.";
             if (event.error.toLowerCase().includes("negative")) friendlyMsg = "Wait, we can't accept negative quantities!";
             if (event.error.toLowerCase().includes("duplicate")) friendlyMsg = "This item appears to already exist.";
             
             toast.error(friendlyMsg, { duration: 5000 });
           });
           const failedIds = pushResponse.data.failedEvents.map(e => e.id);
           await db.outbox.bulkDelete(failedIds);
        }
      } catch (error) {
        pushFailed = true;
        toast.error("Could not reach servers to sync your latest changes.", { duration: 3000 });
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
    // Only show pull errors if they are not explicitly aborted generic errors
  } finally {
    isSyncing = false;
    if (queuedSync) {
      queuedSync = false;
      scheduleSync();
    }
  }
};
