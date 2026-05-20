const express = require("express");
const router = express.Router();
const syncController = require("../controllers/sync.controller");

// The iPad asks the server for new data
router.get("/pull", syncController.pullSync);

// The iPad sends its Outbox to the server
router.post("/push", syncController.pushSync);

module.exports = router;