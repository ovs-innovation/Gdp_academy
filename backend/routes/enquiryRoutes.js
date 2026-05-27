const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/permissionMiddleware.js");
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

// Admin only
router.get("/", verifyToken, authorize("admin"), getAllEnquiries);
router.get("/stats", verifyToken, authorize("admin"), getEnquiryStats);
router.get("/:id", verifyToken, authorize("admin"), getEnquiry);
router.put("/:id", verifyToken, authorize("admin"), updateEnquiryStatus);
router.delete("/:id", verifyToken, authorize("admin"), deleteEnquiry);

module.exports = router;
