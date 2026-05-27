const express = require("express");
const {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  reorderFAQs,
} = require("../controllers/faqController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// Public
router.get("/", getAllFAQs);
router.get("/:id", getFAQById);

// Admin only
router.post("/", verifyToken, isAdmin, createFAQ);
router.put("/reorder", verifyToken, isAdmin, reorderFAQs);
router.put("/:id", verifyToken, isAdmin, updateFAQ);
router.delete("/:id", verifyToken, isAdmin, deleteFAQ);

module.exports = router;
