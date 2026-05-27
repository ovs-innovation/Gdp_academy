const express = require("express");
const upload = require("../utils/multerConfig.js");
const {
  getMyProfile,
  updateMyProfile,
  uploadMyProfilePhoto,
  getStudentProfile,
  listStudentProfiles,
  updateStudentProfile,
  recalculateProgress,
  getCourseProgress,
  toggleWishlist,
  getWishlist,
} = require("../controllers/studentProfileController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { requirePermission } = require("../middlewares/permissionMiddleware.js");

const router = express.Router();

router.get("/wishlist", verifyToken, getWishlist);
router.post("/wishlist", verifyToken, toggleWishlist);
router.get("/me", verifyToken, getMyProfile);
router.patch("/me", verifyToken, updateMyProfile);
router.post("/me/photo", verifyToken, upload.single("photo"), uploadMyProfilePhoto);
router.get(
  "/:userId",
  verifyToken,
  requirePermission("students.view"),
  getStudentProfile,
);
router.get(
  "/",
  verifyToken,
  requirePermission("students.view"),
  listStudentProfiles,
);
router.patch(
  "/:userId",
  verifyToken,
  requirePermission("students.edit"),
  updateStudentProfile,
);
router.post(
  "/:userId/recalculate-progress",
  verifyToken,
  requirePermission("students.edit"),
  recalculateProgress,
);
router.get(
  "/:userId/course-progress",
  verifyToken,
  requirePermission("students.view"),
  getCourseProgress,
);

module.exports = router;
