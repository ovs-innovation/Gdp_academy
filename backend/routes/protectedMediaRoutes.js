const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware.js");
const { streamProtectedLesson } = require("../controllers/protectedMediaController.js");

const router = express.Router();

router.get("/program/:programId/lesson/:lessonIndex", authenticateToken, streamProtectedLesson);

module.exports = router;
