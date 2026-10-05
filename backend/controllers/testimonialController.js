const mongoose = require("mongoose");
const Testimonial = require("../models/testimonialModel.js");
require("../models/userModel.js");
require("../models/programModel.js");

// Create testimonial
const createTestimonial = async (req, res, next) => {
  try {
    const {
      name,
      position,
      message,
      image,
      rating,
      courseId,
      userId,
      isActive,
      order,
    } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        message: "Name and message are required",
      });
    }

    const numRating = Number(rating);
    const numOrder = Number(order);

    const validCourseId =
      courseId && mongoose.Types.ObjectId.isValid(courseId) ? courseId : null;
    const validUserId =
      userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null;

    const testimonial = await Testimonial.create({
      name: String(name).trim(),
      position: position ? String(position).trim() : "",
      message,
      image: image ? String(image).trim() : "",
      rating: !isNaN(numRating) && numRating >= 1 && numRating <= 5 ? numRating : 5,
      courseId: validCourseId,
      userId: validUserId,
      isActive: isActive !== undefined ? (isActive === true || isActive === "true") : true,
      order: !isNaN(numOrder) ? numOrder : 0,
    });

    const populates = [];
    if (validCourseId) populates.push({ path: "courseId", select: "name" });
    if (validUserId) populates.push({ path: "userId", select: "name email" });
    if (populates.length > 0) {
      await testimonial.populate(populates);
    }

    return res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
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

    if (name) testimonial.name = String(name).trim();
    if (position !== undefined) testimonial.position = String(position).trim();
    if (message) testimonial.message = message;
    if (image !== undefined) testimonial.image = String(image).trim();
    if (rating !== undefined) {
      const numRating = Number(rating);
      if (!isNaN(numRating) && numRating >= 1 && numRating <= 5) {
        testimonial.rating = numRating;
      }
    }
    if (courseId !== undefined) {
      testimonial.courseId =
        courseId && mongoose.Types.ObjectId.isValid(courseId) ? courseId : null;
    }
    if (isActive !== undefined) {
      testimonial.isActive = isActive === true || isActive === "true";
    }
    if (order !== undefined) {
      const numOrder = Number(order);
      if (!isNaN(numOrder)) testimonial.order = numOrder;
    }

    await testimonial.save();

    const populates = [];
    if (testimonial.courseId) populates.push({ path: "courseId", select: "name" });
    if (testimonial.userId) populates.push({ path: "userId", select: "name email" });
    if (populates.length > 0) {
      await testimonial.populate(populates);
    }

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
