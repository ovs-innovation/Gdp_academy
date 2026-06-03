const Program = require("../models/programModel.js");
const { getLanguageValue } = require("../utils/languageHelper.js");
const { getIntegrationStatus } = require("../lib/integrations.js");

/**
 * Program recorded-lesson library (from admin uploads).
 * Video URLs are not exposed publicly — use protected-media stream when enrolled.
 */
const listLibrary = async (_req, res, next) => {
  try {
    const programs = await Program.find({
      type: "program",
      status: "active",
      "recordedClasses.0": { $exists: true },
    })
      .select("name image slug recordedClasses")
      .lean();

    const items = programs.map((p) => ({
      programId: p._id,
      title: getLanguageValue(p.name),
      slug: getLanguageValue(p.slug),
      image: p.image,
      lessonCount: (p.recordedClasses || []).length,
      lessons: (p.recordedClasses || []).map((lesson, index) => ({
        index,
        title: lesson.title || `Lesson ${index + 1}`,
        duration: lesson.duration || 0,
        hasVideo: Boolean(lesson.videoUrl?.trim()),
      })),
    }));

    res.json({
      programs: items,
      integrations: getIntegrationStatus(),
      message: getIntegrationStatus().recording.demo
        ? "Recordings use uploaded lesson videos. Cloud archive (AWS) activates when keys are added."
        : "Recording storage configured.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { listLibrary };
