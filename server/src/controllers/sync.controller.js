const syncService = require("../services/sync.service");

let isPushSyncRunning = false;

/**
 * Handles GET /sync/pull?since=2023-10-25T14:30:00Z
 */

const pullSync = async (req, res) => {
  try {
    // If no 'since' timestamp is provided, default to pulling everything from the beginning of time
    const since = req.query.since || new Date(0).toISOString();
    
    // Ask the service to get all data modified after that time for this specific shop
    const changes = await syncService.pullChanges(since, req.user.shopId);
    
    return res.json(changes);
  } catch (error) {
    console.error("Pull Sync Error:", error);
    return res.status(500).json({ error: "Failed to pull changes" });
  }
};

/**
 * Handles POST /sync/push
 * Expects { events: [ { action: 'UPDATE', table: 'products', data: {...}, timestamp: '...' } ] }
 */
const pushSync = async (req, res) => {
  const { events } = req.body;

  try {
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: "Invalid outbox events array" });
    }

    if (isPushSyncRunning) {
      return res.status(202).json({
        message: "Sync already running",
        succeededEventIds: [],
        failedEvents: [],
      });
    }

    isPushSyncRunning = true;

    // Hand the outbox events to the service for processing securely under this shopId and userId
    const result = await syncService.processPushEvents(events, req.user.shopId, req.user.userId);
    
    return res.json({
      message: "Sync Push Processed",
      ...result,
    });
  } catch (error) {
    console.error("CRITICAL PUSH SYNC ERROR:", error.message);
    console.error("Error Detail:", error.detail || "No detail available");
    console.error("Failed Events Sample:", events?.slice(0, 3) || []);
    return res.status(500).json({ 
      error: "Failed to process push events",
      details: error.message 
    });
  } finally {
    isPushSyncRunning = false;
  }
};

module.exports = {
  pullSync,
  pushSync
};
