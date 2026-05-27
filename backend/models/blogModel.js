const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: { en: "" },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: mongoose.Schema.Types.Mixed,
      default: { en: "" },
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: { en: "" },
    },
    featuredImage: {
      url: String,
      alt: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    metadata: {
      seoTitle: String,
      seoDescription: String,
      seoKeywords: [String],
    },
  },
  { timestamps: true },
);

const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

blogSchema.pre("save", async function (next) {
  if (typeof this.title === "string") {
    this.title = { en: this.title };
  }
  if (typeof this.excerpt === "string") {
    this.excerpt = { en: this.excerpt };
  }
  if (typeof this.content === "string") {
    this.content = { en: this.content };
  }

  if (this.isNew || this.isModified("title")) {
    const titleValue = this.title?.en || this.title;
    let slugValue = generateSlug(titleValue);

    let counter = 1;
    const Blog = this.constructor;
    while (await Blog.findOne({ slug: slugValue, _id: { $ne: this._id } })) {
      slugValue = `${generateSlug(titleValue)}-${counter}`;
      counter++;
    }
    this.slug = slugValue;
  }

  next();
});

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });

module.exports = mongoose.model("Blog", blogSchema);
