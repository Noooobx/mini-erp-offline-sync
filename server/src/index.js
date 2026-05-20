require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const productRoutes = require("./routes/product.routes");
const customerRoutes = require("./routes/customer.routes");
const saleRoutes = require("./routes/sale.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const syncRoutes = require("./routes/sync.routes");

// Initialize core Express server application
const app = express();

// --- Global Middleware Setup ---
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Automatically parse incoming JSON API bodies

// --- Endpoint Routing Setup ---
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/sales", saleRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/sync", syncRoutes);


/**
 * Root health-check endpoint.
 * Very useful for automated load balancers (like AWS or Render) to verify the server is alive.
 * It also pings the DB to confirm the database handshake is active.
 */
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.json({
      message: "Mini ERP Backend Running",
      database: result.rows[0].current_database,
    });
  } catch (error) {
    console.error("Error fetching database info:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Configure dynamic port resolving (useful for Heroku/Render)
const PORT = process.env.PORT || 5000;

// Ignite the server on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

