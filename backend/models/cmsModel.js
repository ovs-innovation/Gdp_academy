const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    section: {
      type: String,
      required: true,
      enum: [
        "hero",
        "about",
        "services",
        "testimonials",
        "faq",
        "footer",
        "general",
      ],
      index: true,
    },
    title: {
      type: mongoose.Schema.Types.Mixed,
      default: { en: "" },
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      default: { en: "" },
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    images: [
      {
        url: String,
        alt: String,
        order: { type: Number, default: 0 },
      },
    ],
    videos: [
      {
        url: String,
        title: String,
        order: { type: Number, default: 0 },
      },
    ],
    metadata: {
      seoTitle: String,
      seoDescription: String,
      seoKeywords: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

cmsSchema.pre("save", function (next) {
  if (typeof this.title === "string") {
    this.title = { en: this.title };
  }
  if (typeof this.description === "string") {
    this.description = { en: this.description };
  }
  next();
});

module.exports = mongoose.model("CMS", cmsSchema);
