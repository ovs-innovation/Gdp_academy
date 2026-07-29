const express = require("express");
const {
  uploadMedia,
  getCloudinaryUploadSignature,
} = require("../controllers/mediaController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");
const { handleMediaUpload } = require("../middlewares/handleMediaUpload.js");

const router = express.Router();

router.post("/upload", verifyToken, isAdmin, handleMediaUpload, uploadMedia);
/** Admin-only: signed direct upload to Cloudinary (large videos up to 1GB). */
router.get(
  "/cloudinary-sign",
  verifyToken,
  isAdmin,
  getCloudinaryUploadSignature,
);

module.exports = router;
