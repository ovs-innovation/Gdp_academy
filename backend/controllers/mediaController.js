const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = `/uploads/${req.file.filename}`;
    const isVideo = /^video\//i.test(req.file.mimetype);

    res.status(201).json({
      message: "File uploaded successfully",
      url,
      type: isVideo ? "video" : "image",
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadMedia };
