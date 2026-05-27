const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: { en: "" },
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      default: { en: "" },
    },
    category: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    danceStyle: {
      type: String,
      trim: true,
      default: "",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all_levels"],
      default: "all_levels",
    },
    duration: {
      type: Number,
      default: 0,
    },
    durationUnit: {
      type: String,
      enum: ["weeks", "months", "hours"],
      default: "weeks",
    },
    image: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    previewVideo: {
      type: String,
      default: "",
    },
    galleryImages: [String],
    slug: {
      type: mongoose.Schema.Types.Mixed,
      default: { en: "" },
    },
    price: {
      type: Number,
      default: 0,
      index: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    curriculum: [
      {
        title: {
          type: mongoose.Schema.Types.Mixed,
          default: { en: "" },
        },
        description: {
          type: mongoose.Schema.Types.Mixed,
          default: { en: "" },
        },
        order: Number,
      },
    ],
    benefits: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: { en: "" },
      },
    ],
    faqs: [
      {
        question: {
          type: mongoose.Schema.Types.Mixed,
          default: { en: "" },
        },
        answer: {
          type: mongoose.Schema.Types.Mixed,
          default: { en: "" },
        },
      },
    ],
    recordedClasses: [
      {
        title: String,
        videoUrl: String,
        duration: Number,
        order: Number,
      },
    ],
    // For workshops
    workshopDate: Date,
    workshopTime: String,
    workshopEndTime: String,
    zoomLink: String,
    workshopBanner: String,

    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
      index: true,
    },
    type: {
      type: String,
      enum: ["program", "workshop"],
      default: "program",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metadata: {
      seoTitle: String,
      seoDescription: String,
      seoKeywords: [String],
    },
    enrollmentCount: {
      type: Number,
      default: 0,
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

courseSchema.pre("save", async function (next) {
  if (typeof this.name === "string") {
    this.name = { en: this.name };
  }
  if (typeof this.description === "string") {
    this.description = { en: this.description };
  }

  if (typeof this.slug === "string") {
    this.slug = { en: this.slug };
  }

  if (this.isNew || this.isModified("name")) {
    const { getLanguageValue } = require("../utils/languageHelper.js");
    const nameValue = getLanguageValue(this.name);
    const currentSlugValue = getLanguageValue(this.slug);
    const baseSlug = generateSlug(nameValue);

    if (baseSlug) {
      let slugValue = baseSlug;
      let counter = 1;
      const Course = this.constructor;

      while (
        await Course.findOne({
          "slug.en": slugValue,
          _id: { $ne: this._id },
        })
      ) {
        slugValue = `${baseSlug}-${counter}`;
        counter++;
      }

      this.slug = { en: slugValue };
    }
  }

  next();
});

courseSchema.index({ status: 1, createdAt: -1 });
courseSchema.index({ "slug.en": 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Program", courseSchema);
