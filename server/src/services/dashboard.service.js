const pool = require("../db/db");

/**
 * Calculates essential business metrics for the front-page Dashboard.
 * Queries against sales, products, and customers to generate a live snapshot.
 * @returns {Object} JSON object containing summary metrics.
 */
const getDashboardStats = async (shopId) => {
  // 1. Calculate today's total revenue pool
  // COALESCE ensures we return 0 instead of 'null' if there are zero sales today
  const todaySalesResult = await pool.query(
    `
    SELECT
      COALESCE(
        SUM(total_amount),
        0
      ) AS today_sales
    FROM sales
    WHERE DATE(created_at) = CURRENT_DATE AND shop_id = $1
    `,
    [shopId]
  );

  // 2. Tally total unique products in the system
  const productsResult = await pool.query(
    `
    SELECT COUNT(*) AS total_products
    FROM products
    WHERE is_deleted = FALSE AND shop_id = $1
    `,
    [shopId]
  );

  // 3. Highlight items that are running dangerously low on inventory (< 10)
  const lowStockResult = await pool.query(
    `
    SELECT COUNT(*) AS low_stock
    FROM products
    WHERE stock_qty < 10 AND is_deleted = FALSE AND shop_id = $1
    `,
    [shopId]
  );

  // 4. Calculate overall historical customer reach
  const customersResult = await pool.query(
    `
    SELECT COUNT(*) AS total_customers
    FROM customers
    WHERE is_deleted = FALSE AND shop_id = $1
    `,
    [shopId]
  );

  // Combine and format the data as native JS Numbers to prevent PostgreSQL returning BIGINT strings
  return {
    todaySales: Number(todaySalesResult.rows[0].today_sales),
    totalProducts: Number(productsResult.rows[0].total_products),
    lowStock: Number(lowStockResult.rows[0].low_stock),
    totalCustomers: Number(customersResult.rows[0].total_customers),
  };
};

module.exports = {
  getDashboardStats,
};