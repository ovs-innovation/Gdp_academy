const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/permissionMiddleware.js");
const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
} = require("../controllers/blogController.js");

const router = express.Router();

// Public
router.get("/", getAllBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id/related", getRelatedBlogs);
router.get("/:id", getBlogById);

// Admin only
router.post("/", verifyToken, authorize("admin"), createBlog);
router.put("/:id", verifyToken, authorize("admin"), updateBlog);
router.delete("/:id", verifyToken, authorize("admin"), deleteBlog);

module.exports = router;
