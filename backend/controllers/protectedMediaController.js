const path = require("path");
const fs = require("fs");
const Program = require("../models/programModel.js");
const Booking = require("../models/bookingModel.js");
const isAdminRole = (role) => role === "admin" || role === "super_admin";

const hasProgramAccess = async (userId, role, programId) => {
  if (isAdminRole(role)) return true;
  const paidBooking = await Booking.findOne({
    studentId: userId,
    courseId: programId,
    paymentStatus: "paid",
    status: { $in: ["scheduled", "completed"] },
  }).lean();
  return Boolean(paidBooking);
};

const resolveLocalUploadPath = (videoUrl) => {
  if (!videoUrl || typeof videoUrl !== "string") return null;
  if (!videoUrl.startsWith("/uploads/")) return null;
  const relative = videoUrl.replace(/^\/uploads\//, "");
  const filePath = path.join(__dirname, "..", "uploads", relative);
  if (!fs.existsSync(filePath)) return null;
  return filePath;
};

/**
 * Stream a recorded lesson only for enrolled students or admins.
 * External CDN URLs redirect after access check (no public hotlink bypass).
 */
const streamProtectedLesson = async (req, res, next) => {
  try {
    const { programId, lessonIndex } = req.params;
    const index = Number.parseInt(lessonIndex, 10);
    if (Number.isNaN(index) || index < 0) {
      return res.status(400).json({ message: "Invalid lesson index" });
    }

    const program = await Program.findById(programId).lean();
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const allowed = await hasProgramAccess(req.user.id, req.user.role, programId);
    if (!allowed) {
      return res.status(403).json({
        message: "Access denied. Enroll in this program to watch recorded lessons.",
      });
    }

    const lessons = program.recordedClasses || [];
    const lesson = lessons[index];
    if (!lesson?.videoUrl) {
      return res.status(404).json({ message: "Lesson video not found" });
    }

    const videoUrl = lesson.videoUrl;
    const localPath = resolveLocalUploadPath(videoUrl);
    if (localPath) {
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");
      return res.sendFile(localPath);
    }

    if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) {
      res.setHeader("Cache-Control", "private, no-store");
      return res.redirect(videoUrl);
    }

    return res.status(404).json({ message: "Video file unavailable" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  streamProtectedLesson,
  hasProgramAccess,
};
