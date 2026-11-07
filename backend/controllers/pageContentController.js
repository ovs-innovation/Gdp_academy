const mongoose = require("mongoose");
const PageContent = require("../models/pageContentModel.js");
const {
  withPublicCache,
  invalidatePublicCache,
} = require("../utils/publicCache.js");
const {
  CONTACT_SLUG,
  resolvePublicContactInfo,
  syncSiteSettingsFromContactPage,
} = require("../utils/contactSync.js");

const PAGE_CONTENT_CACHE_TTL_MS = 5_000;

function bustPageCache(slug) {
  if (slug) invalidatePublicCache(`page:${slug}`);
  invalidatePublicCache("homepage");
}

// Create page content (admin only)
const createPageContent = async (req, res, next) => {
  try {
    const page = await PageContent.create(req.body);
    bustPageCache(page.slug);
    await syncSiteSettingsFromContactPage(page);
    res.status(201).json({ message: "Page content created", page });
  } catch (err) {
    next(err);
  }
};

// Get all page content records (admin – include drafts; public – only published)
const getAllPageContent = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const pages = await PageContent.find(query)
      .sort({ order: 1, slug: 1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await PageContent.countDocuments(query);
    res.json({ pages, total, pages_count: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// Get page content by slug (public — published only unless admin)
const getPageContentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isAdmin =
      req.user &&
      (req.user.role === "admin" || req.user.role === "super_admin");

    if (isAdmin) {
      const query = { slug };
      const page = await PageContent.findOne(query);
      if (!page) return res.status(404).json({ message: "Page not found" });
      return res.json({ page });
    }

    const body = await withPublicCache(`page:${slug}`, PAGE_CONTENT_CACHE_TTL_MS, async () => {
      const page = await PageContent.findOne({ slug, status: "published" }).lean();
      if (!page) return null;
      if (slug === CONTACT_SLUG) {
        const contact = await resolvePublicContactInfo();
        page.content = {
          ...(page.content || {}),
          phone: contact.phone || page.content?.phone,
          email: contact.email || page.content?.email,
          address: contact.address || page.content?.address,
        };
      }
      return { page };
    });

    if (!body) return res.status(404).json({ message: "Page not found" });
    res.json(body);
  } catch (err) {
    next(err);
  }
};

// Helper to resolve whether param is ObjectId or slug
const resolvePageFilter = (identifier) => {
  const isObjectId =
    mongoose.Types.ObjectId.isValid(identifier) &&
    String(new mongoose.Types.ObjectId(identifier)) === identifier;
  return isObjectId ? { _id: identifier } : { slug: identifier };
};

// Get page content by ID or slug (admin)
const getPageContentById = async (req, res, next) => {
  try {
    const filter = resolvePageFilter(req.params.id);
    const page = await PageContent.findOne(filter);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({ page });
  } catch (err) {
    next(err);
  }
};

// Update page content by ID or slug (admin only, upserts if document does not exist yet)
const updatePageContent = async (req, res, next) => {
  try {
    const filter = resolvePageFilter(req.params.id);
    const existing = await PageContent.findOne(filter).select("slug").lean();

    const updateBody = { ...req.body };
    // If updating by slug and body has no slug, ensure slug is set
    if (!filter._id && !updateBody.slug) {
      updateBody.slug = req.params.id;
    }

    const updated = await PageContent.findOneAndUpdate(
      filter,
      updateBody,
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true },
    );
    if (!updated) return res.status(404).json({ message: "Page not found" });
    bustPageCache(existing?.slug);
    bustPageCache(updated.slug);
    await syncSiteSettingsFromContactPage(updated);
    res.json({ message: "Page content updated", page: updated });
  } catch (err) {
    next(err);
  }
};

// Delete page content (admin only)
const deletePageContent = async (req, res, next) => {
  try {
    const filter = resolvePageFilter(req.params.id);
    const deleted = await PageContent.findOneAndDelete(filter);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
    bustPageCache(deleted.slug);
    res.json({ message: "Page content deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPageContent,
  getAllPageContent,
  getPageContentBySlug,
  getPageContentById,
  updatePageContent,
  deletePageContent,
};
