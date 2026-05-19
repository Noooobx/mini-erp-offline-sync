const dashboardService = require("../services/dashboard.service");

/**
 * Aggregates summary statistics for the frontend dashboard application.
 * Reaches out to multiple database tables via the dashboard service.
 */
const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return res.json(stats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

module.exports = {
  getDashboardStats,
};