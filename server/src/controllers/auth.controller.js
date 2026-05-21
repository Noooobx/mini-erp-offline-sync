const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-mini-erp-key";

const register = async (req, res) => {
  const { email, password, shopName } = req.body;

  try {
    if (!email || !password || !shopName) {
      return res.status(400).json({ error: "Email, password, and shop name are required" });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Check if user already exists
      const userCheck = await client.query("SELECT id FROM users WHERE email = $1", [email]);
      if (userCheck.rows.length > 0) {
        throw new Error("Email already registered");
      }

      // Create a Shop for the User
      const shopResult = await client.query(
        "INSERT INTO shops (name) VALUES ($1) RETURNING id",
        [shopName],
      );
      const shopId = shopResult.rows[0].id;

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create User
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, shop_id) VALUES ($1, $2, $3) RETURNING id, shop_id",
        [email, passwordHash, shopId],
      );
      const user = userResult.rows[0];

      await client.query("COMMIT");

      // Issue JWT
      const token = jwt.sign({ userId: user.id, shopId: user.shop_id }, JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.status(201).json({ token, shop_id: user.shop_id, message: "Registration successful" });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to register" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT id, password_hash, shop_id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, shopId: user.shop_id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.json({ token, shop_id: user.shop_id, message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "failed to login" });
  }
};

module.exports = {
  register,
  login,
};
