const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");

// ──────────────────────────────────────────────────────────────────────────────
// Cloudinary storage – images → gdp-media, videos → gdp-videos
// Falls back to memory storage only when Cloudinary env-vars are absent
// (so local dev without credentials still works, but uploads won't persist).
// ──────────────────────────────────────────────────────────────────────────────
const cloudConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const storage = cloudConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: async (_req, file) => {
        const isVideo = /^video\//i.test(file.mimetype);
        return {
          folder: isVideo ? "gdp-videos" : "gdp-media",
          resource_type: isVideo ? "video" : "image",
          // Keep a clean filename (strip timestamp injected by multer)
          public_id: `${Date.now()}-${file.originalname
            .replace(/[^a-zA-Z0-9.\-_]/g, "-")
            .replace(/\.[^/.]+$/, "")}`,
          // For images: auto quality + format; for video: passthrough
          ...(isVideo ? {} : { quality: "auto", fetch_format: "auto" }),
        };
      },
    })
  : multer.memoryStorage();

const mediaUpload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB (videos)
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|mp4|webm|mov|quicktime/;
    const ext = file.originalname
      .split(".")
      .pop()
      .toLowerCase();
    const ok = allowed.test(ext) || /^(image|video)\//i.test(file.mimetype);
    if (ok) return cb(null, true);
    cb(
      new Error(
        "Only images (JPG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed"
      )
    );
  },
});

module.exports = mediaUpload;
