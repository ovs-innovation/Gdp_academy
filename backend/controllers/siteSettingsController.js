const SiteSettings = require("../models/siteSettings.js");

// Get site settings (singleton) – public
const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Return sensible defaults if never configured
      settings = {
        logoUrl: "",
        navLinks: [],
        footerLinks: [],
        footerText: "© 2024 Garima Dance Production. All rights reserved.",
        socialLinks: [],
        metaTitle: "Garima Dance Production",
        metaDescription: "Learn the art of dance with Garima Dance Production",
        canonicalUrl: "",
      };
    }
    res.json({ settings });
  } catch (err) {
    next(err);
  }
};

// Update site settings (admin only) – upsert singleton
const updateSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ message: "Site settings updated", settings });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};
