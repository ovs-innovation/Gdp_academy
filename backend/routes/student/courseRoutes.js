const express = require("express");
const { verifyToken } = require("../../middlewares/authMiddleware.js");
const Program = require("../../models/programModel.js");

const router = express.Router();

// All routes require authentication (students)
router.use(verifyToken);

// Get all active courses
router.get("/", async (req, res, next) => {
  try {
    const courses = await Program.find({ status: "active" });
    res.json({ courses, count: courses.length });
  } catch (err) {
    next(err);
  }
});

// Get languages available for a course (legacy fallback)
router.get("/:courseId/languages", (req, res) => {
  res.json({ languages: [], count: 0 });
});

// Get teachers for a course-language combination (legacy fallback)
router.get("/:courseId/teachers", (req, res) => {
  res.json({ teachers: [], count: 0 });
});

module.exports = router;
