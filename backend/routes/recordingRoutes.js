const express = require("express");
const {
  getBookingRecording,
  listAllRecordings,
  getRecordingStats,
} = require("../controllers/recordingController.js");
const { listLibrary } = require("../controllers/recordingLibraryController.js");
const { authenticateToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.get("/library", listLibrary);
router.get("/stats", authenticateToken, isAdmin, getRecordingStats);
router.get("/", authenticateToken, isAdmin, listAllRecordings);
router.get("/:id/recording", authenticateToken, getBookingRecording);

module.exports = router;
