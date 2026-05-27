const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: { en: "" },
    },
    image: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

testimonialSchema.pre("save", function (next) {
  if (typeof this.message === "string") {
    this.message = { en: this.message };
  }
  next();
});

testimonialSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
