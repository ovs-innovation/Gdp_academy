const express = require("express");
const {
  getCourses,
  getCourseById,
} = require("../../controllers/courseController.js");

const router = express.Router();

router.get(
  "/",
  (req, res, next) => {
    req.query.status = "active";
    next();
  },
  getCourses,
);

// Dummy fallback for course teachers since teacher/instructor roles are eliminated
router.get("/:slug/teachers", (req, res) => {
  res.json({ teachers: [], count: 0 });
});

// Dummy fallback for availability since direct scheduling/bookings are disabled
router.get("/availability", (req, res) => {
  res.json({ availabilities: [], count: 0 });
});

router.get("/:id", getCourseById);

module.exports = router;
