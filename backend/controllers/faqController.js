const FAQ = require("../models/faqModel.js");

// Create FAQ (admin only)
const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    return res.status(201).json({ message: "FAQ created", faq });
  } catch (err) {
    next(err);
  }
};

// Get all FAQs (public, can filter by status)
const getAllFAQs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const faqs = await FAQ.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await FAQ.countDocuments(query);

    return res.json({
      faqs,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// Get single FAQ by ID (public)
const getFAQById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);

    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    return res.json({ faq });
  } catch (err) {
    next(err);
  }
};

// Update FAQ (admin only)
const updateFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await FAQ.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "FAQ not found" });

    return res.json({ message: "FAQ updated", faq: updated });
  } catch (err) {
    next(err);
  }
};

// Delete FAQ (admin only) – hard delete
const deleteFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FAQ.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "FAQ not found" });

    return res.json({ message: "FAQ deleted" });
  } catch (err) {
    next(err);
  }
};

// Reorder FAQs (admin only) – expect array of {id, order}
const reorderFAQs = async (req, res, next) => {
  try {
    const { faqs } = req.body;

    if (!Array.isArray(faqs)) {
      return res.status(400).json({ message: "faqs must be an array" });
    }

    for (const { id, order } of faqs) {
      await FAQ.findByIdAndUpdate(id, { order });
    }

    return res.json({ message: "FAQs reordered" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  reorderFAQs,
};
