const PageContent = require("../models/pageContentModel.js");
const { withPublicCache } = require("../utils/publicCache.js");

// Create page content (admin only)
const createPageContent = async (req, res, next) => {
  try {
    const page = await PageContent.create(req.body);
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

    const body = await withPublicCache(`page:${slug}`, 120_000, async () => {
      const page = await PageContent.findOne({ slug, status: "published" }).lean();
      if (!page) return null;
      return { page };
    });

    if (!body) return res.status(404).json({ message: "Page not found" });
    res.json(body);
  } catch (err) {
    next(err);
  }
};

// Get page content by ID (admin)
const getPageContentById = async (req, res, next) => {
  try {
    const page = await PageContent.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({ page });
  } catch (err) {
    next(err);
  }
};

// Update page content (admin only)
const updatePageContent = async (req, res, next) => {
  try {
    const updated = await PageContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Page content updated", page: updated });
  } catch (err) {
    next(err);
  }
};

// Delete page content (admin only)
const deletePageContent = async (req, res, next) => {
  try {
    const deleted = await PageContent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
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
