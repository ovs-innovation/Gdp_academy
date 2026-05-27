const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: { en: "" },
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      default: { en: "" },
    },
    items: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video"],
          default: "image",
        },
        alt: String,
        caption: {
          type: mongoose.Schema.Types.Mixed,
          default: { en: "" },
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    category: {
      type: String,
      trim: true,
      default: "General",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

gallerySchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);
