const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const productRoutes = require("./routes/product.routes");
const customerRoutes = require("./routes/customer.routes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/customers", customerRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
