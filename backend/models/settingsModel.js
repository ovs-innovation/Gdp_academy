const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "AdminHub" },
    siteUrl: { type: String, default: "https://adminhub.example.com" },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Boolean, default: false },
    ipWhitelist: { type: Boolean, default: false },
    themeColor: { type: String, default: "#1a73e8" },
    compactMode: { type: Boolean, default: false },

    /**
     * Platform fee percentage for bookings.
     *
     * WHY:
     * - Must be configurable (not hardcoded).
     * - Used by server-side pricing calculation (USD first), then converted for student currency.
     */
    platformFeePercent: { type: Number, default: 4, min: 0, max: 100 },

    // CMS Fields
    heroTitle: { type: String, default: "ELEVATE YOUR ARTISTRY" },
    heroSubtitle: {
      type: String,
      default:
        "Step into the world's most prestigious dance sanctuary. Where passion meets precision, and every move tells a story.",
    },
    aboutText: {
      type: String,
      default:
        "Garima Dance Production is a sanctuary for artists, where technique meets expression in a cinematic environment.",
    },
    finalCtaTitle: {
      type: String,
      default: "READY TO BEGIN YOUR TRANSFORMATION?",
    },
    finalCtaSubtitle: {
      type: String,
      default:
        "Join Garima Dance Production today and unlock your true artistic potential.",
    },
    whatsappNumber: { type: String, default: "1234567890" },
  },
  { timestamps: true },
);

settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
