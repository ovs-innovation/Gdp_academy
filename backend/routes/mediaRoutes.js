const express = require("express");
const { uploadMedia } = require("../controllers/mediaController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");
const { handleMediaUpload } = require("../middlewares/handleMediaUpload.js");

const router = express.Router();

router.post("/upload", verifyToken, isAdmin, handleMediaUpload, uploadMedia);

module.exports = router;
