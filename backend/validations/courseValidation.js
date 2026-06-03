const { z } = require("zod");
const { imageSchema } = require("./mediaUrlSchema.js");

const nameSchema = z.any().refine(
  (val) => {
    if (typeof val === "string") {
      return val.trim().length > 0;
    }
    if (typeof val === "object" && val !== null) {
      return Object.keys(val).length > 0 && typeof val.en === "string";
    }
    return false;
  },
  {
    message: "Name must be a non-empty string or language object with 'en' key",
  },
);

const descriptionSchema = z
  .any()
  .refine(
    (val) => {
      if (val === undefined || val === null) return true;
      if (typeof val === "string") return true;
      if (typeof val === "object" && val !== null) {
        return Object.keys(val).length > 0;
      }
      return false;
    },
    { message: "Description must be a string or language object" },
  )
  .optional();

const createCourseSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema,
    category: z.string().optional().default(""),
    danceStyle: z.string().optional().default(""),
    image: imageSchema,
    thumbnail: imageSchema,
    previewVideo: z.string().optional().default(""),
    galleryImages: z.array(z.string()).optional().default([]),
    level: z
      .enum(["beginner", "intermediate", "advanced", "all_levels"])
      .optional()
      .default("all_levels"),
    duration: z.number().optional().default(0),
    durationUnit: z
      .enum(["weeks", "months", "hours"])
      .optional()
      .default("weeks"),
    price: z.number().optional().default(0),
    discountPrice: z.number().optional().default(0),
    currency: z.string().optional().default("USD"),
    curriculum: z.array(z.any()).optional().default([]),
    benefits: z.array(z.any()).optional().default([]),
    faqs: z.array(z.any()).optional().default([]),
    recordedClasses: z.array(z.any()).optional().default([]),
    workshopDate: z.union([z.string(), z.date()]).optional(),
    workshopTime: z.string().optional().default(""),
    workshopEndTime: z.string().optional().default(""),
    zoomLink: z.string().optional().default(""),
    workshopBanner: z.string().optional().default(""),
    metadata: z.any().optional(),
    status: z
      .enum(["active", "inactive", "pending"])
      .optional()
      .default("active"),
    type: z.enum(["program", "workshop"]).optional().default("program"),
  })
  .passthrough();

const updateCourseSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema,
    category: z.string().optional(),
    danceStyle: z.string().optional(),
    image: imageSchema,
    thumbnail: imageSchema,
    previewVideo: z.string().optional(),
    galleryImages: z.array(z.string()).optional(),
    level: z
      .enum(["beginner", "intermediate", "advanced", "all_levels"])
      .optional(),
    duration: z.number().optional(),
    durationUnit: z.enum(["weeks", "months", "hours"]).optional(),
    price: z.number().optional(),
    discountPrice: z.number().optional(),
    currency: z.string().optional(),
    curriculum: z.array(z.any()).optional(),
    benefits: z.array(z.any()).optional(),
    faqs: z.array(z.any()).optional(),
    recordedClasses: z.array(z.any()).optional(),
    workshopDate: z.union([z.string(), z.date()]).optional(),
    workshopTime: z.string().optional(),
    workshopEndTime: z.string().optional(),
    zoomLink: z.string().optional(),
    workshopBanner: z.string().optional(),
    metadata: z.any().optional(),
    status: z.enum(["active", "inactive", "pending"]).optional(),
    type: z.enum(["program", "workshop"]).optional(),
  })
  .passthrough();

module.exports = { createCourseSchema, updateCourseSchema };
