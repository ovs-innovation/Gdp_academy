const CMS = require("../models/cmsModel.js");
const { withPublicCache } = require("../utils/publicCache.js");

// Create or update CMS content
const saveCMS = async (req, res, next) => {
  try {
    const {
      key,
      section,
      title,
      description,
      content,
      images,
      videos,
      metadata,
      isActive,
    } = req.body;

    if (!key || !section) {
      return res.status(400).json({
        message: "Key and section are required",
      });
    }

    let cms = await CMS.findOne({ key });

    if (cms) {
      cms.section = section;
      if (title) cms.title = title;
      if (description) cms.description = description;
      if (content) cms.content = content;
      if (images) cms.images = images;
      if (videos) cms.videos = videos;
      if (metadata) cms.metadata = metadata;
      if (isActive !== undefined) cms.isActive = isActive;
      cms.updatedBy = req.user?.id;
      cms.publishedAt = new Date();
      await cms.save();
    } else {
      cms = await CMS.create({
        key,
        section,
        title: title || { en: "" },
        description: description || { en: "" },
        content: content || {},
        images: images || [],
        videos: videos || [],
        metadata: metadata || {},
        isActive: isActive !== undefined ? isActive : true,
        updatedBy: req.user?.id,
        publishedAt: new Date(),
      });
    }

    return res.status(201).json({
      message: "CMS content saved successfully",
      cms,
    });
  } catch (error) {
    next(error);
  }
};

// Get CMS content by key
const getCMSByKey = async (req, res, next) => {
  try {
    const { key } = req.params;

    const cms = await CMS.findOne({ key });

    if (!cms) {
      return res.status(404).json({
        message: "CMS content not found",
      });
    }

    return res.json(cms);
  } catch (error) {
    next(error);
  }
};

// Get CMS content by section
const getCMSBySection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const cmsContent = await withPublicCache(`cms-section:${section}`, 120_000, () =>
      CMS.find({
        section,
        isActive: true,
      })
        .sort({ "content.order": 1, createdAt: 1 })
        .lean(),
    );
    return res.json(cmsContent);
  } catch (error) {
    next(error);
  }
};

// Get all CMS content (Admin)
const getAllCMS = async (req, res, next) => {
  try {
    const { section, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (section) query.section = section;

    const cms = await CMS.find(query)
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CMS.countDocuments(query);

    return res.json({
      cms,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

// Delete CMS content
const deleteCMS = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cms = await CMS.findByIdAndDelete(id);

    if (!cms) {
      return res.status(404).json({
        message: "CMS content not found",
      });
    }

    return res.json({
      message: "CMS content deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveCMS,
  getCMSByKey,
  getCMSBySection,
  getAllCMS,
  deleteCMS,
};
