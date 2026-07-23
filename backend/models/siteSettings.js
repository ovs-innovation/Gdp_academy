const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, trim: true },
    whatsappNumber: { type: String, trim: true },

    navLinks: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          href: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },

    footerLinks: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          href: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },

    footerText: { type: String, trim: true },

    footerTagline: { type: String, trim: true },

    brandLine1: { type: String, trim: true, default: "Garima" },
    brandLine2: { type: String, trim: true, default: "Dance" },
    brandLine3: { type: String, trim: true, default: "Productions" },

    headerCtaLabel: { type: String, trim: true, default: "Join Studio" },
    headerCtaUrl: { type: String, trim: true, default: "/login" },

    footerServiceLinks: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          href: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },

    socialLinks: {
      type: [
        {
          platform: { type: String, required: true, trim: true },
          url: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },

    // Announcement Bar
    announcementBar: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: "" },
      buttonLabel: { type: String, default: "" },
      buttonUrl: { type: String, default: "" },
      backgroundColor: { type: String, default: "#060606" },
      textColor: { type: String, default: "#FFFFFF" },
    },

    // Hero Videos
    heroVideos: [
      {
        url: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],

    // Generic CMS Sections
    cmsSections: {
      type: Map,
      of: new mongoose.Schema(
        {
          sectionTitle: String,
          sectionSubtitle: String,
          featuredItems: Array,
          ctaLabel: String,
          ctaUrl: String,
          isVisible: { type: Boolean, default: true },
          displayOrder: { type: Number, default: 0 },
        },
        { _id: false },
      ),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
