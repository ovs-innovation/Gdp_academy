const express = require("express");
const {
  getBookingRecording,
  listAllRecordings,
  getRecordingStats,
} = require("../controllers/recordingController.js");
const { authenticateToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.get("/:id/recording", authenticateToken, getBookingRecording);
router.get("/", authenticateToken, isAdmin, listAllRecordings);
router.get("/stats", authenticateToken, isAdmin, getRecordingStats);

module.exports = router;
