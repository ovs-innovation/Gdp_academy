const Blog = require("../models/blogModel.js");

// Create blog post
const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      metadata,
      status,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      featuredImage,
      category: category || "General",
      tags: tags || [],
      metadata: metadata || {},
      status: status || "draft",
      author: req.user?.id,
      publishedAt: status === "published" ? new Date() : null,
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog: await blog.populate("author", "name email"),
    });
  } catch (error) {
    next(error);
  }
};

// Get all blogs with pagination
const getAllBlogs = async (req, res, next) => {
  try {
    const {
      status = "published",
      category,
      page = 1,
      limit = 10,
      search,
    } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate("author", "name email")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    return res.json({
      blogs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by slug
const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: "published" }).populate(
      "author",
      "name email",
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    return res.json(blog);
  } catch (error) {
    next(error);
  }
};

// Get single blog by ID
const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.json(blog);
  } catch (error) {
    next(error);
  }
};

// Update blog
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      metadata,
      status,
    } = req.body;

    let blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (featuredImage) blog.featuredImage = featuredImage;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (metadata) blog.metadata = metadata;
    if (status) {
      blog.status = status;
      if (status === "published" && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    await blog.save();
    blog = await blog.populate("author", "name email");

    return res.json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// Delete blog
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get related blogs
const getRelatedBlogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 3 } = req.query;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const relatedBlogs = await Blog.find({
      _id: { $ne: id },
      $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
      status: "published",
    })
      .limit(Number(limit))
      .sort({ publishedAt: -1 });

    return res.json(relatedBlogs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
};
