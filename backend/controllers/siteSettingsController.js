const SiteSettings = require("../models/siteSettings.js");
const { sanitizeLogoUrl } = require("../utils/siteLogo.js");
const { withPublicCache } = require("../utils/publicCache.js");

function toClientSettings(settings) {
  const doc =
    settings && typeof settings.toObject === "function"
      ? settings.toObject()
      : { ...settings };
  doc.logoUrl = sanitizeLogoUrl(doc.logoUrl);
  return doc;
}

// Get site settings (singleton) – public
const getSiteSettings = async (req, res, next) => {
  try {
    const body = await withPublicCache("site-settings", 120_000, async () => {
      let settings = await SiteSettings.findOne().lean();
      if (!settings) {
        return {
          settings: {
            logoUrl: "",
            navLinks: [],
            footerLinks: [],
            footerText: "© 2024 Garima Dance Production. All rights reserved.",
            socialLinks: [],
            metaTitle: "Garima Dance Production",
            metaDescription: "Learn the art of dance with Garima Dance Production",
            canonicalUrl: "",
          },
        };
      }
      return { settings: toClientSettings(settings) };
    });
    res.json(body);
  } catch (err) {
    next(err);
  }
};

// Update site settings (admin only) – upsert singleton
const updateSiteSettings = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if ("logoUrl" in body) {
      body.logoUrl = sanitizeLogoUrl(body.logoUrl);
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    res.json({ message: "Site settings updated", settings: toClientSettings(settings) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};
