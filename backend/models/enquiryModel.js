const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    whatsappConsent: {
      type: Boolean,
      default: false,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      default: null,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      default: null,
    },
    source: {
      type: String,
      enum: ["program", "workshop", "contact_form", "general"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

enquirySchema.index({ email: 1, createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ source: 1, createdAt: -1 });
enquirySchema.index({ assignedTo: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);
