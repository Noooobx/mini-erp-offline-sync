require("dotenv").config({ path: "./server/.env" });
const pool = require("./server/src/db/db");

async function check() {
  try {
    const outbox = await pool.query("SELECT * FROM outbox;");
    console.log("Outbox:", outbox.rows);
  } catch(e) {
    console.log(e.message);
  } finally { pool.end(); }
}
check();
