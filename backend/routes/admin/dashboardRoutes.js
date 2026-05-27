const express = require("express");
const {
  getDashboardStats,
} = require("../../controllers/admin/dashboardController.js");
const { verifyToken } = require("../../middlewares/authMiddleware.js");
const {
  requirePermission,
} = require("../../middlewares/permissionMiddleware.js");

const router = express.Router();

router.get(
  "/stats",
  verifyToken,
  requirePermission("dashboard.view"),
  getDashboardStats,
);

module.exports = router;
