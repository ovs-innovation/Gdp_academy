const { z } = require("zod");

/**
 * Validation schemas for Booking operations
 */

const createBookingSchema = z.object({
  availabilityId: z.string().min(1, "Availability ID is required"),
  languageId: z.string().min(1, "Language ID is required"), // Required to identify which language the student wants
  studentNotes: z.string().optional().default(""),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]),
  cancellationReason: z.string().optional(),
});

const updateBookingMeetingSchema = z.object({
  meetingType: z.enum(["zoom", "google_meet", "teams", "custom"]).optional(),
  meetingUrl: z.string().url().optional(),
  meetingId: z.string().optional(),
  meetingPassword: z.string().optional(),
});

module.exports = {
  createBookingSchema,
  updateBookingStatusSchema,
  updateBookingMeetingSchema,
};
