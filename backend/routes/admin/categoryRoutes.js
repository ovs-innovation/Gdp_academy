const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/categoryController.js");
const { verifyToken } = require("../../middlewares/authMiddleware.js");
const {
  requirePermission,
} = require("../../middlewares/permissionMiddleware.js");
const { validateRequest } = require("../../middlewares/validateRequest.js");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../../validations/categoryValidation.js");

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all categories
router.get("/", requirePermission("categories.view"), getCategories);

// Get single category
router.get("/:id", requirePermission("categories.view"), getCategory);

// Create category
router.post(
  "/",
  requirePermission("categories.create"),
  validateRequest(createCategorySchema),
  createCategory,
);

// Update category
router.patch(
  "/:id",
  requirePermission("categories.edit"),
  validateRequest(updateCategorySchema),
  updateCategory,
);

// Delete category
router.delete("/:id", requirePermission("categories.delete"), deleteCategory);

module.exports = router;
