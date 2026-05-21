require('dotenv').config();
const { processPushEvents } = require('./src/services/sync.service');
const pool = require('./src/db/db');

async function test() {
  const shopId = await pool.query("SELECT id FROM shops LIMIT 1");
  const sid = shopId.rows[0].id;
  const userId = await pool.query("SELECT id FROM users LIMIT 1");
  const uid = userId.rows[0].id;
  
  const payload = [
    {
      id: "test-event-1",
      table: "sales",
      action: "INSERT",
      timestamp: new Date().toISOString(),
      data: {
        id: "77777777-7777-7777-7777-777777777777",
        customer_id: null,
        user_id: null,
        total_amount: 100
      }
    },
    {
      id: "test-event-2",
      table: "sale_items",
      action: "INSERT",
      timestamp: new Date().toISOString(),
      data: {
        id: "88888888-8888-8888-8888-888888888888",
        sale_id: "77777777-7777-7777-7777-777777777777",
        product_id: null, 
        quantity: 1,
        unit_price: 100,
        subtotal: 100
      }
    }
  ];
  
  const result = await processPushEvents(payload, sid, uid);
  console.log("Push result:", JSON.stringify(result, null, 2));
  process.exit(0);
}
test();
