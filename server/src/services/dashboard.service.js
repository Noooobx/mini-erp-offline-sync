const pool = require("../db/db");

const getDashboardStats =
  async () => {

    const todaySalesResult =
      await pool.query(
        `
        SELECT
          COALESCE(
            SUM(total_amount),
            0
          ) AS today_sales
        FROM sales
        WHERE DATE(created_at)
        = CURRENT_DATE
        `
      );

    const productsResult =
      await pool.query(
        `
        SELECT COUNT(*)
        AS total_products
        FROM products
        `
      );

    const lowStockResult =
      await pool.query(
        `
        SELECT COUNT(*)
        AS low_stock
        FROM products
        WHERE stock_qty < 10
        `
      );

    const customersResult =
      await pool.query(
        `
        SELECT COUNT(*)
        AS total_customers
        FROM customers
        `
      );

    return {
      todaySales:
        Number(
          todaySalesResult
            .rows[0]
            .today_sales
        ),

      totalProducts:
        Number(
          productsResult
            .rows[0]
            .total_products
        ),

      lowStock:
        Number(
          lowStockResult
            .rows[0]
            .low_stock
        ),

      totalCustomers:
        Number(
          customersResult
            .rows[0]
            .total_customers
        ),
    };
  };

module.exports = {
  getDashboardStats,
};