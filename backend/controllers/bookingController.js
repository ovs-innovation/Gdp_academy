const Booking = require("../models/bookingModel.js");
const mongoose = require("mongoose");

/**
 * Booking Controller (Mocked / Offline CMS version)
 * Handles legacy booking routes without requiring Teacher/Availability models.
 */

const createBooking = async (req, res, next) => {
  try {
    res.status(201).json({
      message:
        "Online bookings are currently handled by the studio administration.",
      booking: null,
    });
  } catch (err) {
    next(err);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    // Return empty bookings since GDP Studio operates on direct class enrollment
    res.json({ bookings: [], count: 0 });
  } catch (err) {
    next(err);
  }
};

const getTeacherBookings = async (req, res, next) => {
  try {
    res.json({ bookings: [], count: 0 });
  } catch (err) {
    next(err);
  }
};

const getBooking = async (req, res, next) => {
  try {
    res.status(404).json({ message: "Booking not found" });
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    next(err);
  }
};

const updateMeetingDetails = async (req, res, next) => {
  try {
    res.json({ message: "Meeting details updated successfully" });
  } catch (err) {
    next(err);
  }
};

const rescheduleBooking = async (req, res, next) => {
  try {
    res
      .status(400)
      .json({ message: "Rescheduling is managed directly by administration." });
  } catch (err) {
    next(err);
  }
};

const getAvailableSlots = async (req, res, next) => {
  try {
    res.json({ availabilities: [] });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getTeacherBookings,
  getBooking,
  updateBookingStatus,
  updateMeetingDetails,
  rescheduleBooking,
  getAvailableSlots,
};
