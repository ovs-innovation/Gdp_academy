const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true, trim: true },
    caption: { type: mongoose.Schema.Types.Mixed },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GalleryItem", galleryItemSchema);
