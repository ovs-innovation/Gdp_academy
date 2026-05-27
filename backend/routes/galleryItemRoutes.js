const express = require("express");
const {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems,
} = require("../controllers/galleryItemController.js");
const { uploadMedia } = require("../controllers/mediaController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");
const { handleMediaUpload } = require("../middlewares/handleMediaUpload.js");

const router = express.Router();

// Public
router.get("/", getAllGalleryItems);

// Admin upload (must be before /:id)
router.post("/upload", verifyToken, isAdmin, handleMediaUpload, uploadMedia);

router.get("/:id", getGalleryItemById);

// Admin only
router.post("/", verifyToken, isAdmin, createGalleryItem);
router.put("/reorder", verifyToken, isAdmin, reorderGalleryItems);
router.put("/:id", verifyToken, isAdmin, updateGalleryItem);
router.delete("/:id", verifyToken, isAdmin, deleteGalleryItem);

module.exports = router;
