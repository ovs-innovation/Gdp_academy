const mediaUpload = require("../utils/mediaUploadConfig.js");

/** Multer wrapper — surfaces file-type/size errors as JSON instead of crashing. */
const handleMediaUpload = (req, res, next) => {
  mediaUpload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "File upload rejected",
      });
    }
    next();
  });
};

module.exports = { handleMediaUpload };
