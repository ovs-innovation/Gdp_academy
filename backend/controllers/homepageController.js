const crypto = require("crypto");
const zlib = require("zlib");
const SiteSettings = require("../models/siteSettings.js");
const Settings = require("../models/settingsModel.js");
const CMS = require("../models/cmsModel.js");
const PageContent = require("../models/pageContentModel.js");
const FAQ = require("../models/faqModel.js");
const { readFeaturedTestimonials } = require("./testimonialController.js");
const { sanitizeLogoUrl } = require("../utils/siteLogo.js");
const {
  CONTACT_SLUG,
  resolvePublicContactInfo,
} = require("../utils/contactSync.js");
const { withPublicCache } = require("../utils/publicCache.js");

const HOMEPAGE_CACHE_TTL_MS = 5 * 60 * 1000;
const HOMEPAGE_CACHE_KEY = "homepage";

function publicDoc(doc) {
  if (!doc) return null;
  const plain = { ...doc };
  delete plain.__v;
  delete plain.updatedBy;
  return plain;
}

async function readSiteSettings() {
  const settings = await SiteSettings.findOne().lean();
  const contact = await resolvePublicContactInfo();
  if (!settings) {
    return {
      logoUrl: "",
      navLinks: [],
      footerLinks: [],
      footerText: "© 2024 Garima Dance Production. All rights reserved.",
      socialLinks: [],
      metaTitle: "Garima Dance Production",
      metaDescription: "Learn the art of dance with Garima Dance Production",
      canonicalUrl: "",
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
    };
  }
  const merged = publicDoc(settings);
  merged.logoUrl = sanitizeLogoUrl(merged.logoUrl);
  merged.phone = contact.phone || merged.phone || "";
  merged.email = contact.email || merged.email || "";
  merged.address = contact.address || merged.address || "";
  return merged;
}

async function readContactPage() {
  const page = await PageContent.findOne({ slug: CONTACT_SLUG, status: "published" })
    .select("slug title content metaTitle metaDescription canonicalUrl status")
    .lean();
  if (!page) return null;
  const contact = await resolvePublicContactInfo();
  page.content = {
    ...(page.content || {}),
    phone: contact.phone || page.content?.phone,
    email: contact.email || page.content?.email,
    address: contact.address || page.content?.address,
  };
  return publicDoc(page);
}

async function readHomepage() {
  const [siteSettings, appSettingsDoc, services, home, contact, faqs, testimonials] =
    await Promise.all([
      readSiteSettings(),
      Settings.getSettings(),
      CMS.find({ section: "services", isActive: true })
        .select("-__v -updatedBy")
        .sort({ "content.order": 1, createdAt: 1 })
        .lean(),
      PageContent.findOne({ slug: "home", status: "published" }).select("-__v").lean(),
      readContactPage(),
      FAQ.find({ status: "published" })
        .select("question answer order status")
        .sort({ order: 1, createdAt: -1 })
        .limit(20)
        .lean(),
      readFeaturedTestimonials(6),
    ]);

  const appSettings = publicDoc(
    appSettingsDoc && typeof appSettingsDoc.toObject === "function"
      ? appSettingsDoc.toObject()
      : appSettingsDoc,
  );

  return {
    siteSettings,
    appSettings,
    services: services.map(publicDoc),
    home: publicDoc(home),
    contact,
    faqs: faqs.map(publicDoc),
    testimonials,
  };
}

function sendHomepage(req, res, body) {
  const json = JSON.stringify(body);
  const etag = `"${crypto.createHash("sha1").update(json).digest("hex")}"`;
  res.setHeader("ETag", etag);
  res.setHeader("Cache-Control", "public, max-age=300");
  res.setHeader("Vary", "Accept-Encoding");

  if (req.headers["if-none-match"] === etag) {
    return res.status(304).end();
  }

  const raw = Buffer.from(json);
  const accept = String(req.headers["accept-encoding"] || "");
  if (/\bbr\b/.test(accept) && raw.length >= 1024) {
    const compressed = zlib.brotliCompressSync(raw, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 },
    });
    if (compressed.length < raw.length) {
      res.setHeader("Content-Encoding", "br");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Length", compressed.length);
      return res.status(200).end(compressed);
    }
  }

  return res.status(200).json(body);
}

const getHomepage = async (req, res, next) => {
  try {
    const body = await withPublicCache(HOMEPAGE_CACHE_KEY, HOMEPAGE_CACHE_TTL_MS, readHomepage);
    sendHomepage(req, res, body);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHomepage,
};
