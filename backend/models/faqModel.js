const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.Mixed, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FAQ", faqSchema);
