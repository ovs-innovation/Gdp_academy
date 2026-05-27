const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    title: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    canonicalUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PageContent", pageContentSchema);
