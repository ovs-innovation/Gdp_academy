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
      required: false,
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
  const cleaned = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  return cleaned || `blog-${Date.now()}`;
};

blogSchema.pre("validate", async function (next) {
  if (typeof this.title === "string") {
    this.title = { en: this.title };
  }
  if (typeof this.excerpt === "string") {
    this.excerpt = { en: this.excerpt };
  }
  if (typeof this.content === "string") {
    this.content = { en: this.content };
  }

  if (!this.slug || this.isModified("title")) {
    const titleValue = this.title?.en || this.title || "untitled-blog";
    let baseSlug = generateSlug(titleValue);
    let slugValue = baseSlug;

    let counter = 1;
    const Blog = this.constructor;
    while (await Blog.findOne({ slug: slugValue, _id: { $ne: this._id } })) {
      slugValue = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slugValue;
  }

  if (typeof next === "function") next();
});

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });

module.exports = mongoose.model("Blog", blogSchema);
