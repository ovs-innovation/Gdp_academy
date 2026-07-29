const cloudinary = require("../utils/cloudinary.js");

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // When using multer-storage-cloudinary, the URL is in req.file.path
    // and the resource type is in req.file.resource_type (or infer from mimetype).
    const url = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;
    const isVideo = /^video\//i.test(req.file.mimetype);

    res.status(201).json({
      message: "File uploaded successfully",
      url,
      type: isVideo ? "video" : "image",
      publicId: req.file.filename, // Cloudinary public_id
      size: req.file.size,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Signed params so the admin browser can upload directly to Cloudinary.
 * Required for large videos (up to 1GB) — avoids Hostinger/nginx body limits on the API.
 */
const getCloudinaryUploadSignature = async (req, res, next) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(503).json({
        message:
          "Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    const resourceType =
      String(req.query.resourceType || req.body?.resourceType || "image").toLowerCase() ===
      "video"
        ? "video"
        : "image";
    const folder =
      (typeof req.query.folder === "string" && req.query.folder.trim()) ||
      (typeof req.body?.folder === "string" && req.body.folder.trim()) ||
      (resourceType === "video" ? "gdp-videos" : "gdp-media");

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    res.status(200).json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      resourceType,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadMedia, getCloudinaryUploadSignature };
