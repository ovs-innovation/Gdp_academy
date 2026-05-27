const express = require("express");
const {
  getAllPayments,
  getPaymentById,
  updatePayoutStatus,
} = require("../../controllers/admin/paymentController.js");
const { verifyToken } = require("../../middlewares/authMiddleware.js");
const {
  requirePermission,
} = require("../../middlewares/permissionMiddleware.js");

const router = express.Router();

router.get("/", verifyToken, requirePermission("users.view"), getAllPayments);
router.get(
  "/:id",
  verifyToken,
  requirePermission("users.view"),
  getPaymentById,
);
router.patch(
  "/:id/payout",
  verifyToken,
  requirePermission("users.edit"),
  updatePayoutStatus,
);

module.exports = router;
