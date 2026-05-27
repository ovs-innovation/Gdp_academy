const express = require("express");
const {
  createMembershipPlan,
  getAllMembershipPlans,
  getMembershipPlanById,
  updateMembershipPlan,
  deleteMembershipPlan,
  reorderMembershipPlans,
} = require("../controllers/membershipPlanController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// Public
router.get("/", getAllMembershipPlans);
router.get("/:id", getMembershipPlanById);

// Admin only
router.post("/", verifyToken, isAdmin, createMembershipPlan);
router.put("/reorder", verifyToken, isAdmin, reorderMembershipPlans);
router.put("/:id", verifyToken, isAdmin, updateMembershipPlan);
router.delete("/:id", verifyToken, isAdmin, deleteMembershipPlan);

module.exports = router;
