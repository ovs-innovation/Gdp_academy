const PageContent = require("../models/pageContentModel.js");
const SiteSettings = require("../models/siteSettings.js");
const { invalidatePublicCache } = require("./publicCache.js");

const CONTACT_SLUG = "contact";
const CONTACT_FIELDS = ["phone", "email", "address"];

const GDP_DEFAULTS = {
  phone: "+91 78384 16907",
  email: "Gdp.info2019@gmail.com",
  address:
    "K-6, near SANDISH MEDICAL, Sector-12, Block-K, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009",
};

const PLACEHOLDER_PHONES = new Set(["+91 98765 43210", "9876543210", "919876543210"]);
const PLACEHOLDER_EMAILS = new Set([
  "hello@gdpstudio.com",
  "hello@gdpacademy.com",
  "info@gdpacademy.com",
]);
const PLACEHOLDER_ADDRESSES = new Set([
  "123 creative rhythm way, dance arts district, new delhi, india",
]);

function isPlaceholder(field, value) {
  const v = String(value || "").trim();
  if (!v) return true;
  const lower = v.toLowerCase();
  if (field === "phone") {
    const digits = v.replace(/\D/g, "");
    return PLACEHOLDER_PHONES.has(v) || digits === "919876543210";
  }
  if (field === "email") return PLACEHOLDER_EMAILS.has(lower);
  if (field === "address") return PLACEHOLDER_ADDRESSES.has(lower);
  return false;
}

function pickContactField(field, ...values) {
  for (const raw of values) {
    const v = typeof raw === "string" ? raw.trim() : "";
    if (v && !isPlaceholder(field, v)) return v;
  }
  return GDP_DEFAULTS[field] || "";
}

/** Merge phone/email/address from site-settings + contact page (site-settings wins). */
async function resolvePublicContactInfo() {
  const [settings, contactPage] = await Promise.all([
    SiteSettings.findOne().lean(),
    PageContent.findOne({ slug: CONTACT_SLUG, status: "published" }).lean(),
  ]);

  const pageContent = contactPage?.content || {};

  return {
    phone: pickContactField("phone", settings?.phone, pageContent.phone),
    email: pickContactField("email", settings?.email, pageContent.email),
    address: pickContactField("address", settings?.address, pageContent.address),
  };
}

function bustContactCaches() {
  invalidatePublicCache("site-settings");
  invalidatePublicCache(`page:${CONTACT_SLUG}`);
}

/** After site-settings save — mirror contact fields onto contact page. */
async function syncContactPageFromSiteSettings(settingsDoc) {
  if (!settingsDoc) return;

  const patch = {};
  for (const key of CONTACT_FIELDS) {
    if (settingsDoc[key]?.trim()) patch[key] = settingsDoc[key].trim();
  }
  if (!Object.keys(patch).length) return;

  let page = await PageContent.findOne({ slug: CONTACT_SLUG });
  if (!page) {
    page = await PageContent.create({
      slug: CONTACT_SLUG,
      title: "Contact",
      content: patch,
      status: "published",
    });
  } else {
    page.content = { ...(page.content || {}), ...patch };
    page.markModified("content");
    await page.save();
  }
  bustContactCaches();
}

/** After contact page save — mirror contact fields onto site-settings. */
async function syncSiteSettingsFromContactPage(pageDoc) {
  if (!pageDoc || pageDoc.slug !== CONTACT_SLUG) return;

  const patch = {};
  for (const key of CONTACT_FIELDS) {
    const val = pageDoc.content?.[key]?.trim?.();
    if (val) patch[key] = val;
  }
  if (!Object.keys(patch).length) return;

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(patch);
  } else {
    Object.assign(settings, patch);
    await settings.save();
  }
  bustContactCaches();
}

module.exports = {
  CONTACT_SLUG,
  CONTACT_FIELDS,
  resolvePublicContactInfo,
  syncContactPageFromSiteSettings,
  syncSiteSettingsFromContactPage,
  bustContactCaches,
};
