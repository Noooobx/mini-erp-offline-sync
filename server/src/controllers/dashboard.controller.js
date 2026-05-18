const dashboardService =
  require(
    "../services/dashboard.service"
  );

const getDashboardStats =
  async (req, res) => {

    try {

      const stats =
        await dashboardService
          .getDashboardStats();

      return res.json(stats);

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error:
          "Failed to fetch dashboard stats",
      });
    }
  };

module.exports = {
  getDashboardStats,
};