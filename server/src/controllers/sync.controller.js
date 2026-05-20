const syncService = require("../services/sync.service");

/**
 * Handles GET /sync/pull?since=2023-10-25T14:30:00Z
 */

const pullSync = async (req, res) => {
  try {
    // If no 'since' timestamp is provided, default to pulling everything from the beginning of time
    const since = req.query.since || new Date(0).toISOString();
    
    // Ask the service to get all data modified after that time
    const changes = await syncService.pullChanges(since);
    
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
  try {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: "Invalid outbox events array" });
    }

    // Hand the outbox events to the service for processing
    await syncService.processPushEvents(events);
    
    return res.json({ message: "Sync Push Successful" });
  } catch (error) {
    console.error("Push Sync Error:", error);
    return res.status(500).json({ error: "Failed to process push events" });
  }
};

module.exports = {
  pullSync,
  pushSync
};