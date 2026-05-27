const Testimonial = require("../models/testimonialModel.js");

// Create testimonial
const createTestimonial = async (req, res, next) => {
  try {
    const { name, position, message, image, rating, courseId, userId } =
      req.body;

    if (!name || !message) {
      return res.status(400).json({
        message: "Name and message are required",
      });
    }

    const testimonial = await Testimonial.create({
      name,
      position,
      message,
      image,
      rating: rating || 5,
      courseId,
      userId,
      isActive: true,
    });

    return res.status(201).json({
      message: "Testimonial created successfully",
      testimonial: await testimonial
        .populate("courseId", "name")
        .populate("userId", "name email"),
    });
  } catch (error) {
    next(error);
  }
};

// Get all testimonials
const getAllTestimonials = async (req, res, next) => {
  try {
    const { isActive = true, page = 1, limit = 10, courseId } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (isActive !== undefined && isActive !== "all")
      query.isActive = isActive === "true" || isActive === true;
    if (courseId) query.courseId = courseId;

    const testimonials = await Testimonial.find(query)
      .populate("courseId", "name")
      .populate("userId", "name email")
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Testimonial.countDocuments(query);

    return res.json({
      testimonials,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

// Get featured testimonials
const getFeaturedTestimonials = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const testimonials = await Testimonial.find({ isActive: true })
      .populate("courseId", "name")
      .populate("userId", "name email")
      .sort({ order: 1, createdAt: -1 })
      .limit(Number(limit));

    return res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// Get testimonial by ID
const getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id)
      .populate("courseId", "name")
      .populate("userId", "name email");

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    return res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

// Update testimonial
const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      position,
      message,
      image,
      rating,
      courseId,
      isActive,
      order,
    } = req.body;

    let testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    if (name) testimonial.name = name;
    if (position) testimonial.position = position;
    if (message) testimonial.message = message;
    if (image) testimonial.image = image;
    if (rating) testimonial.rating = rating;
    if (courseId) testimonial.courseId = courseId;
    if (isActive !== undefined) testimonial.isActive = isActive;
    if (order !== undefined) testimonial.order = order;

    await testimonial.save();
    testimonial = await testimonial
      .populate("courseId", "name")
      .populate("userId", "name email");

    return res.json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    return res.json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Reorder testimonials
const reorderTestimonials = async (req, res, next) => {
  try {
    const { testimonials } = req.body;

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({
        message: "Testimonials must be an array",
      });
    }

    for (const item of testimonials) {
      await Testimonial.findByIdAndUpdate(item.id, { order: item.order });
    }

    return res.json({
      message: "Testimonials reordered successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
};
