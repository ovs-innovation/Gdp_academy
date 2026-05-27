const express = require("express");
const {
  createPageContent,
  getAllPageContent,
  getPageContentBySlug,
  getPageContentById,
  updatePageContent,
  deletePageContent,
} = require("../controllers/pageContentController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");
const { optionalVerifyToken } = require("../middlewares/optionalAuthMiddleware.js");

const router = express.Router();

// Public
router.get("/", getAllPageContent);
// Public (admins with token see drafts too)
router.get("/slug/:slug", optionalVerifyToken, getPageContentBySlug);
router.get("/:id", getPageContentById);

// Admin only
router.post("/", verifyToken, isAdmin, createPageContent);
router.put("/:id", verifyToken, isAdmin, updatePageContent);
router.delete("/:id", verifyToken, isAdmin, deletePageContent);

module.exports = router;
