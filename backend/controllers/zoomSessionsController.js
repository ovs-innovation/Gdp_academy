const Program = require("../models/programModel.js");
const { getLanguageValue } = require("../utils/languageHelper.js");
const { getIntegrationStatus } = require("../lib/integrations.js");
const { createMeeting } = require("../services/zoomMeetingService.js");

const formatWorkshopDate = (date) => {
  if (!date) return "TBD";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/**
 * Public live sessions list: active workshops + optional CMS fallback handled on frontend.
 */
const listLiveSessions = async (_req, res, next) => {
  try {
    const workshops = await Program.find({
      type: "workshop",
      status: "active",
    })
      .sort({ workshopDate: 1 })
      .lean();

    const sessions = await Promise.all(
      workshops.map(async (w) => {
        const title = getLanguageValue(w.name) || "Workshop";
        let joinUrl = w.zoomLink?.trim() || "";
        let mode = joinUrl ? "manual" : "pending";

        if (!joinUrl) {
          const meeting = await createMeeting({
            topic: title,
            startTime: w.workshopDate,
            durationMinutes: 90,
          });
          joinUrl = meeting.joinUrl;
          mode = meeting.mode;
        }

        return {
          id: w._id,
          title,
          date: formatWorkshopDate(w.workshopDate),
          time: w.workshopTime || "TBD",
          coach: w.danceStyle || w.category || "GDP Coach",
          joinUrl,
          mode,
          price: w.price,
        };
      }),
    );

    res.json({
      sessions,
      integrations: getIntegrationStatus(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: attach or refresh Zoom link for a workshop.
 */
const ensureWorkshopZoomLink = async (req, res, next) => {
  try {
    const workshop = await Program.findOne({
      _id: req.params.id,
      type: "workshop",
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const meeting = await createMeeting({
      topic: getLanguageValue(workshop.name),
      startTime: workshop.workshopDate,
      durationMinutes: 90,
      manualZoomLink: workshop.zoomLink,
    });

    if (!workshop.zoomLink?.trim() && meeting.joinUrl) {
      workshop.zoomLink = meeting.joinUrl;
      await workshop.save();
    }

    res.json({
      success: true,
      workshopId: workshop._id,
      zoomLink: workshop.zoomLink || meeting.joinUrl,
      mode: meeting.mode,
      meeting,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listLiveSessions,
  ensureWorkshopZoomLink,
};
