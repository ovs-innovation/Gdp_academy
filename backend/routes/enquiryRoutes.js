const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { requirePermission } = require("../middlewares/permissionMiddleware.js");
const {
  createEnquiry,
  getAllEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  getEnquiryStats,
} = require("../controllers/enquiryController.js");

const router = express.Router();

// Public
router.post("/", createEnquiry);

// Staff / admin with enquiry permissions
router.get("/", verifyToken, requirePermission("enquiries.view"), getAllEnquiries);
router.get("/stats", verifyToken, requirePermission("enquiries.view"), getEnquiryStats);
router.get("/:id", verifyToken, requirePermission("enquiries.view"), getEnquiry);
router.put("/:id", verifyToken, requirePermission("enquiries.edit"), updateEnquiryStatus);
router.delete("/:id", verifyToken, requirePermission("enquiries.delete"), deleteEnquiry);

module.exports = router;
