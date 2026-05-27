const express = require("express");
const {
  handleZoomWebhook,
  manualTriggerRecording,
} = require("../controllers/zoomWebhookController.js");
const { authenticateToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.post("/zoom", handleZoomWebhook);
router.post(
  "/zoom/manual-trigger",
  authenticateToken,
  isAdmin,
  manualTriggerRecording,
);

module.exports = router;
