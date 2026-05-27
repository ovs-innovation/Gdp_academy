const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  rescheduleBooking,
  getAvailableSlots,
} = require("../../controllers/bookingController.js");
const { verifyToken } = require("../../middlewares/authMiddleware.js");
const { validateRequest } = require("../../middlewares/validateRequest.js");
const {
  createBookingSchema,
  updateBookingStatusSchema,
} = require("../../validations/bookingValidation.js");

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get available slots for a teacher-course
router.get("/available-slots/:teacherCourseId", getAvailableSlots);

// Create booking (student books a slot)
router.post("/", validateRequest(createBookingSchema), createBooking);

// Get student's bookings
router.get("/my-bookings", getMyBookings);

// Get single booking
router.get("/:id", getBooking);

// Update booking status (cancel, etc.)
router.patch(
  "/:id/status",
  validateRequest(updateBookingStatusSchema),
  updateBookingStatus,
);

// Reschedule booking
router.post("/:id/reschedule", rescheduleBooking);

module.exports = router;
