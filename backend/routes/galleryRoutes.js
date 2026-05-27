const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { authorize } = require("../middlewares/permissionMiddleware.js");
const {
  createGallery,
  getAllGalleries,
  getGalleryById,
  getGalleryByCategory,
  updateGallery,
  addGalleryItem,
  removeGalleryItem,
  deleteGallery,
} = require("../controllers/galleryController.js");

const router = express.Router();

// Public
router.get("/", getAllGalleries);
router.get("/category/:category", getGalleryByCategory);
router.get("/:id", getGalleryById);

// Admin only
router.post("/", verifyToken, authorize("admin"), createGallery);
router.put("/:id", verifyToken, authorize("admin"), updateGallery);
router.post("/:id/items", verifyToken, authorize("admin"), addGalleryItem);
router.delete(
  "/:id/items/:itemId",
  verifyToken,
  authorize("admin"),
  removeGalleryItem,
);
router.delete("/:id", verifyToken, authorize("admin"), deleteGallery);

module.exports = router;
