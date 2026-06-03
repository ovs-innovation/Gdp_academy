const Program = require("../models/programModel.js");
const mongoose = require("mongoose");
const Category = require("../models/danceStyleModel.js");
const { notifyWorkshopClassEmails } = require("../utils/emailService.js");

const {
  normalizeLanguageValue,
  getLanguageValue,
  transformLanguageFields,
} = require("../utils/languageHelper.js");

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const ensureProgramSlug = async (courseDoc) => {
  if (!courseDoc) return;
  const currentSlug = getLanguageValue(courseDoc.slug);
  if (currentSlug) return;

  const nameValue = getLanguageValue(courseDoc.name);
  const baseSlug = slugify(nameValue);
  if (!baseSlug) return;

  let slugValue = baseSlug;
  let counter = 1;
  while (
    await Program.findOne({
      "slug.en": slugValue,
      _id: { $ne: courseDoc._id },
    })
  ) {
    slugValue = `${baseSlug}-${counter}`;
    counter++;
  }

  courseDoc.slug = { en: slugValue };
  await courseDoc.save();
};

const mutableProgramFields = [
  "category",
  "danceStyle",
  "level",
  "duration",
  "durationUnit",
  "image",
  "thumbnail",
  "previewVideo",
  "galleryImages",
  "price",
  "discountPrice",
  "currency",
  "curriculum",
  "benefits",
  "faqs",
  "recordedClasses",
  "workshopDate",
  "workshopTime",
  "workshopEndTime",
  "zoomLink",
  "workshopBanner",
  "status",
  "type",
  "metadata",
];

const buildProgramPayload = (body) => {
  const payload = {};
  for (const field of mutableProgramFields) {
    if (body[field] !== undefined) {
      payload[field] =
        field === "workshopDate" && body[field]
          ? new Date(body[field])
          : body[field];
    }
  }

  if (body.DanceStyle !== undefined && body.danceStyle === undefined) {
    payload.danceStyle = body.DanceStyle;
    payload.category = body.DanceStyle;
  }

  if (body.danceStyle !== undefined && body.category === undefined) {
    payload.category = body.danceStyle;
  }

  if (body.workshopBanner && !payload.image) {
    payload.image = body.workshopBanner;
  }

  return payload;
};

const toProgramDto = (course) => {
  const courseObj = course.toObject ? course.toObject() : course;
  courseObj.name = getLanguageValue(courseObj.name);
  courseObj.description = getLanguageValue(courseObj.description);
  courseObj.slug = getLanguageValue(courseObj.slug);
  courseObj.DanceStyle = courseObj.danceStyle || courseObj.category || "";
  return courseObj;
};

/**
 * Create a new course (Admin only)
 */
const createProgram = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.id;
    const role = req.user.role;

    const normalizedName = normalizeLanguageValue(name);
    const normalizedDescription = normalizeLanguageValue(description);
    const nameValue = getLanguageValue(normalizedName);

    const existing = await Program.findOne({
      $or: [
        { "name.en": { $regex: new RegExp(`^${nameValue}$`, "i") } },
        { name: { $regex: new RegExp(`^${nameValue}$`, "i") } },
      ],
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Program with this name already exists" });
    }

    // Teachers can only create pending courses
    let courseStatus = "active";
    if (role === "teacher") {
      courseStatus = "pending";
    }

    const course = await Program.create({
      ...buildProgramPayload(req.body),
      name: normalizedName,
      description: normalizedDescription,
      status: courseStatus,
      createdBy,
    });
    await course.populate("createdBy", "name email");
    const courseObj = toProgramDto(course);

    if (course.type === "workshop" && course.status === "active") {
      notifyWorkshopClassEmails(course.toObject(), { action: "published" }).catch(
        (err) => console.warn("Workshop email notify:", err.message),
      );
    }

    res.status(201).json({ course: courseObj });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all courses (Admin)
 */
const getPrograms = async (req, res, next) => {
  try {
    const { status, search, category, type } = req.query;
    const query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      let categoryDoc;

      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryDoc = await Category.findById(category);
      } else {
        categoryDoc = await Category.findOne({ "slug.en": category });
      }

      if (categoryDoc) {
        const categoryName = getLanguageValue(categoryDoc.name);
        query.$or = [
          { category: categoryName },
          { "category.en": categoryName },
        ];
      }
    }

    if (search) {
      const searchQuery = {
        $or: [
          { "name.en": { $regex: search, $options: "i" } },
          { "description.en": { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };

      if (query.$or) {
        query.$and = [{ $or: query.$or }, searchQuery];
        delete query.$or;
      } else {
        Object.assign(query, searchQuery);
      }
    }

    const courses = await Program.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    // Backfill slug for older records created before slug existed
    for (const c of courses) {
      // eslint-disable-next-line no-await-in-loop
      await ensureProgramSlug(c);
    }

    const coursesData = courses.map(toProgramDto);

    res.json({
      courses: coursesData,
      Programs: coursesData,
      programs: coursesData,
      count: coursesData.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single course by ID or slug
 */
const getProgramById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course;

    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await Program.findById(id).populate("createdBy", "name email");
    } else {
      course = await Program.findOne({ "slug.en": id }).populate(
        "createdBy",
        "name email",
      );
    }

    if (!course) {
      return res.status(404).json({ message: "Program not found" });
    }

    await ensureProgramSlug(course);

    const courseObj = toProgramDto(course);
    res.json({ course: courseObj, Program: courseObj, program: courseObj });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a course (Admin only)
 */
const updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const { name, description } = req.body;
    const course = await Program.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Program not found" });
    }

    if (name !== undefined) {
      const normalizedName = normalizeLanguageValue(name);
      const nameValue = getLanguageValue(normalizedName);
      const currentNameValue = getLanguageValue(course.name);

      if (nameValue !== currentNameValue) {
        const existing = await Program.findOne({
          $or: [
            { "name.en": { $regex: new RegExp(`^${nameValue}$`, "i") } },
            { name: { $regex: new RegExp(`^${nameValue}$`, "i") } },
          ],
          _id: { $ne: id },
        });
        if (existing) {
          return res
            .status(409)
            .json({ message: "Program with this name already exists" });
        }
      }
      course.name = normalizedName;
    }

    if (description !== undefined)
      course.description = normalizeLanguageValue(description);
    Object.assign(course, buildProgramPayload(req.body));

    const wasActiveWorkshop =
      course.type === "workshop" && course.status === "active";

    await course.save();
    await course.populate("createdBy", "name email");
    const courseObj = toProgramDto(course);

    if (wasActiveWorkshop) {
      notifyWorkshopClassEmails(course.toObject(), { action: "updated" }).catch(
        (err) => console.warn("Workshop email notify:", err.message),
      );
    }

    res.json({ course: courseObj });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a course (Admin only)
 */
const deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Program.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Program not found" });
    }

    await course.deleteOne();
    res.json({ success: true, message: "Program deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Aliases for compatibility with student/public routes
const getCourses = getPrograms;
const getCourseById = getProgramById;

module.exports = {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  // aliases
  getCourses,
  getCourseById,
};
