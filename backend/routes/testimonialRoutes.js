const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/permissionMiddleware.js");
const {
  createTestimonial,
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} = require("../controllers/testimonialController.js");

const router = express.Router();

// Public
router.get("/featured", getFeaturedTestimonials);
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);

// Admin only
router.post("/", verifyToken, authorize("admin"), createTestimonial);
router.put("/:id", verifyToken, authorize("admin"), updateTestimonial);
router.post("/reorder", verifyToken, authorize("admin"), reorderTestimonials);
router.delete("/:id", verifyToken, authorize("admin"), deleteTestimonial);

module.exports = router;
