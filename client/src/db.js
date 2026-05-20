import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

// 1. Initialize the Local Offline Database
const db = new Dexie("MiniERpDatabase");

// 2. Define the structural schema (the tables).
// In Dexie, you don't list every single column. You only list the Primary Key ('id')
// and any columns you plan to quickly search/filter by.
db.version(2).stores({
  products: "id, name, stock_qty",
  customers: "id, name",
  sales: "id, created_at",
  sale_items: "id, sale_id",

  // The Outbox uses '++id' to automatically assign integers (1, 2, 3).
  // This is critical because it forces outbox events to stay perfectly chronological!
  outbox: "++id, table, action, timestamp",
});

// 3. Create a powerful helper function to write to the Outbox easily.
// We export this so we can reuse it anywhere in your React app.
export const addToOutbox = async (action, table, data) => {
  await db.outbox.add({
    action,
    table,
    data,
    timestamp: new Date().toISOString(), // Tags the exact millisecond the user clicked the button
  });
};

// 4. We export a handy ID generator so the frontend can make UUIDs instantly
export const generateId = () => uuidv4();

export default db;
