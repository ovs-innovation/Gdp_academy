const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 40);
    cb(null, `${safeBase}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const mediaUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|mp4|webm|mov|quicktime/;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const ok =
      allowed.test(ext) ||
      /^(image|video)\//i.test(file.mimetype);
    if (ok) return cb(null, true);
    cb(new Error("Only images (JPG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed"));
  },
});

module.exports = mediaUpload;
