const express = require("express");
const {
  submitContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../controllers/contactMessageController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// Public – submit contact form
router.post("/", submitContactMessage);

// Admin only
router.get("/", verifyToken, isAdmin, getAllContactMessages);
router.get("/:id", verifyToken, isAdmin, getContactMessageById);
router.patch("/:id/status", verifyToken, isAdmin, updateContactMessageStatus);
router.delete("/:id", verifyToken, isAdmin, deleteContactMessage);

module.exports = router;
