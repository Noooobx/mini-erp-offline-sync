const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

async function test() {
  try {
    const event = {
      table: "products",
      action: "INSERT",
      timestamp: new Date().toISOString(),
      data: {
        id: uuidv4(),
        name: "Test Sync Product",
        barcode: "TEST-002",
        price: 99.99,
        stock_qty: 10
      }
    };
    console.log("Sending event...");
    const res = await axios.post("http://localhost:5000/sync/push", { events: [event] });
    console.log("Response:", res.data);
  } catch (e) {
    console.error("Error Status:", e.response ? e.response.status : "No Response");
    console.error("Error Data:", e.response ? e.response.data : e.message);
  }
}
test();
