const GalleryItem = require("../models/galleryItemModel.js");

// Create gallery item (admin only)
const createGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json({ message: "Gallery item created", item });
  } catch (err) {
    next(err);
  }
};

// Get all gallery items (public – filter by status/type)
const getAllGalleryItems = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    const skip = (page - 1) * limit;
    const items = await GalleryItem.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await GalleryItem.countDocuments(query);
    res.json({ items, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// Get single gallery item by ID
const getGalleryItemById = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Gallery item not found" });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

// Update gallery item (admin only)
const updateGalleryItem = async (req, res, next) => {
  try {
    const updated = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated)
      return res.status(404).json({ message: "Gallery item not found" });
    res.json({ message: "Gallery item updated", item: updated });
  } catch (err) {
    next(err);
  }
};

// Delete gallery item (admin only)
const deleteGalleryItem = async (req, res, next) => {
  try {
    const deleted = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Gallery item not found" });
    res.json({ message: "Gallery item deleted" });
  } catch (err) {
    next(err);
  }
};

// Reorder gallery items (admin only) – expect array of { id, order }
const reorderGalleryItems = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items))
      return res.status(400).json({ message: "items must be an array" });
    for (const { id, order } of items) {
      await GalleryItem.findByIdAndUpdate(id, { order });
    }
    res.json({ message: "Gallery items reordered" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems,
};
