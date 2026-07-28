const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");

// ──────────────────────────────────────────────────────────────────────────────
// Profile-photo upload → Cloudinary "gdp-profiles" folder
// Falls back to memoryStorage when Cloudinary env-vars are absent.
// ──────────────────────────────────────────────────────────────────────────────
const cloudConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const storage = cloudConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "gdp-profiles",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
        // Overwrite the same public_id on re-upload so old versions are cleaned up
        overwrite: true,
      },
    })
  : multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = file.originalname.split(".").pop().toLowerCase();
    const mimeOk = /image\/(jpeg|jpg|png|webp|gif)/i.test(file.mimetype);
    if (mimeOk && allowed.test(ext)) return cb(null, true);
    cb(new Error("Only image files (JPG, PNG, WebP, GIF) are allowed"));
  },
});

module.exports = upload;
