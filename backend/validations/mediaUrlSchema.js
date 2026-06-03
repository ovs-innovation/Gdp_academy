const { z } = require("zod");

/** Accepts https URLs and local server paths from /api/media/upload */
const isValidMediaUrl = (val) => {
  if (val === undefined || val === null) return true;
  if (typeof val !== "string") return false;
  const trimmed = val.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("/uploads/")) return true;
  try {
    const u = new URL(trimmed);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const imageSchema = z
  .string()
  .refine(isValidMediaUrl, { message: "Invalid image URL" })
  .optional();

module.exports = { imageSchema, isValidMediaUrl };
