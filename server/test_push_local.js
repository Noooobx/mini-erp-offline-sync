require('dotenv').config();
const syncService = require('./src/services/sync.service');

const testEvents = [
  {
    action: "CREATE",
    table: "products",
    data: {
      id: "12345678-1234-1234-1234-123456789012",
      name: "Wireless Mouse",
      price: 2000,
      stock_qty: 20,
      barcode: "1029",
      is_deleted: false
    },
    timestamp: new Date().toISOString()
  }
];

syncService.processPushEvents(testEvents)
  .then(() => console.log("Success"))
  .catch(err => console.error("Caught error:", err.message));
