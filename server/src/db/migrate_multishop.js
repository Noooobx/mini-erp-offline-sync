const pool = require("./db");

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    console.log("Creating shops and users tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Adding shop_id columns to business tables...");
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE CASCADE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE CASCADE;
      ALTER TABLE sales ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE CASCADE;
    `);

    console.log("Migrating existing data to a Default Shop...");
    // Check if a default shop exists
    const shopResult = await client.query(`SELECT id FROM shops WHERE name = 'Default Shop' LIMIT 1`);
    let defaultShopId;
    
    if (shopResult.rows.length === 0) {
      const newShop = await client.query(`
        INSERT INTO shops (name) VALUES ('Default Shop') RETURNING id
      `);
      defaultShopId = newShop.rows[0].id;
    } else {
      defaultShopId = shopResult.rows[0].id;
    }

    // Assign orphaned records
    await client.query(`UPDATE products SET shop_id = $1 WHERE shop_id IS NULL`, [defaultShopId]);
    await client.query(`UPDATE customers SET shop_id = $1 WHERE shop_id IS NULL`, [defaultShopId]);
    await client.query(`UPDATE sales SET shop_id = $1 WHERE shop_id IS NULL`, [defaultShopId]);

    // Now safely enforce NOT NULL
    console.log("Enforcing NOT NULL constraints safely...");
    await client.query(`ALTER TABLE products ALTER COLUMN shop_id SET NOT NULL`);
    await client.query(`ALTER TABLE customers ALTER COLUMN shop_id SET NOT NULL`);
    await client.query(`ALTER TABLE sales ALTER COLUMN shop_id SET NOT NULL`);

    await client.query("COMMIT");
    console.log("Migration successful!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
