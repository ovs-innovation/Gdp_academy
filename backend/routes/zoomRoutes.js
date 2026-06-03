const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");
const {
  listLiveSessions,
  ensureWorkshopZoomLink,
} = require("../controllers/zoomSessionsController.js");

const router = express.Router();

router.get("/sessions", listLiveSessions);
router.post(
  "/workshops/:id/ensure-link",
  authenticateToken,
  isAdmin,
  ensureWorkshopZoomLink,
);

module.exports = router;
