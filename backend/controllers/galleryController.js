const Gallery = require("../models/galleryModel.js");

// Create gallery
const createGallery = async (req, res, next) => {
  try {
    const { title, description, items, category } = req.body;

    if (!title || !items || items.length === 0) {
      return res.status(400).json({
        message: "Title and items are required",
      });
    }

    const sortedItems = items.sort((a, b) => a.order - b.order);

    const gallery = await Gallery.create({
      title,
      description,
      items: sortedItems,
      category: category || "General",
      uploadedBy: req.user?.id,
    });

    return res.status(201).json({
      message: "Gallery created successfully",
      gallery: await gallery.populate("uploadedBy", "name email"),
    });
  } catch (error) {
    next(error);
  }
};

// Get all galleries
const getAllGalleries = async (req, res, next) => {
  try {
    const { category, isActive = true, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (isActive !== undefined && isActive !== "all") {
      query.isActive = isActive === "true" || isActive === true;
    }
    if (category) query.category = category;

    const galleries = await Gallery.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Gallery.countDocuments(query);

    return res.json({
      galleries,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

// Get gallery by ID
const getGalleryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id).populate(
      "uploadedBy",
      "name email",
    );

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    return res.json(gallery);
  } catch (error) {
    next(error);
  }
};

// Get gallery by category
const getGalleryByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const galleries = await Gallery.find({
      category,
      isActive: true,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(galleries);
  } catch (error) {
    next(error);
  }
};

// Update gallery
const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, items, category, isActive } = req.body;

    let gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    if (title) gallery.title = title;
    if (description) gallery.description = description;
    if (items) {
      const sortedItems = items.sort((a, b) => a.order - b.order);
      gallery.items = sortedItems;
    }
    if (category) gallery.category = category;
    if (isActive !== undefined) gallery.isActive = isActive;

    await gallery.save();
    gallery = await gallery.populate("uploadedBy", "name email");

    return res.json({
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    next(error);
  }
};

// Add item to gallery
const addGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { url, type, alt, caption, order } = req.body;

    if (!url) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    gallery.items.push({
      url,
      type: type || "image",
      alt,
      caption,
      order: order || gallery.items.length,
    });

    await gallery.save();

    return res.json({
      message: "Item added to gallery successfully",
      gallery: await gallery.populate("uploadedBy", "name email"),
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from gallery
const removeGalleryItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    gallery.items = gallery.items.filter(
      (item) => item._id.toString() !== itemId,
    );

    await gallery.save();

    return res.json({
      message: "Item removed from gallery successfully",
      gallery: await gallery.populate("uploadedBy", "name email"),
    });
  } catch (error) {
    next(error);
  }
};

// Delete gallery
const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findByIdAndDelete(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    return res.json({
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGallery,
  getAllGalleries,
  getGalleryById,
  getGalleryByCategory,
  updateGallery,
  addGalleryItem,
  removeGalleryItem,
  deleteGallery,
};
