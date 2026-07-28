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

module.exports = { uploadMedia };
