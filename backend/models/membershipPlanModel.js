const mongoose = require("mongoose");

const membershipPlanSchema = new mongoose.Schema(
  {
    title: { type: mongoose.Schema.Types.Mixed, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD", uppercase: true },
    duration: { type: Number, required: true }, // e.g., number of months
    durationUnit: { type: String, enum: ["month", "year"], default: "month" },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MembershipPlan", membershipPlanSchema);
