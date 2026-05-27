const express = require("express");
const {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} = require("../../controllers/courseController.js");
const { verifyToken } = require("../../middlewares/authMiddleware.js");
const {
  requirePermission,
} = require("../../middlewares/permissionMiddleware.js");
const { validateRequest } = require("../../middlewares/validateRequest.js");
const {
  createCourseSchema,
  updateCourseSchema,
} = require("../../validations/courseValidation.js");

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken);

// Create program (Admin only)
router.post(
  "/",
  requirePermission("programs.create"),
  validateRequest(createCourseSchema),
  createProgram,
);

// Get all programs (Admin)
router.get("/", requirePermission("programs.view"), getPrograms);

// Get single program (Admin)
router.get("/:id", requirePermission("programs.view"), getProgramById);

// Update program (Admin only)
router.patch(
  "/:id",
  requirePermission("programs.edit"),
  validateRequest(updateCourseSchema),
  updateProgram,
);

// Delete program (Admin only)
router.delete("/:id", requirePermission("programs.delete"), deleteProgram);

module.exports = router;
