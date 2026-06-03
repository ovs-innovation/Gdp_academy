const crypto = require("crypto");
const { getIntegrationStatus } = require("../lib/integrations.js");

/**
 * Create or resolve a Zoom meeting link.
 * Uses manual link from admin, live Zoom API when configured, otherwise demo link.
 */
const createMeeting = async ({
  topic = "GDP Live Session",
  startTime,
  durationMinutes = 60,
  manualZoomLink,
}) => {
  if (manualZoomLink?.trim()) {
    return {
      provider: "zoom",
      mode: "manual",
      joinUrl: manualZoomLink.trim(),
      startUrl: manualZoomLink.trim(),
      meetingId: "manual",
      password: "",
    };
  }

  const status = getIntegrationStatus();
  const preferLiveZoom =
    status.zoom.configured &&
    (process.env.INTEGRATION_MODE || "demo").toLowerCase() !== "demo";

  if (preferLiveZoom) {
    try {
      const { createZoomMeeting } = await import("./zoomService.js");
      const meeting = await createZoomMeeting({
        topic,
        startTimeUTC: startTime || new Date().toISOString(),
        durationMinutes,
      });
      return {
        provider: "zoom",
        mode: "live",
        joinUrl: meeting.join_url,
        startUrl: meeting.start_url,
        meetingId: String(meeting.id),
        password: meeting.password || "",
      };
    } catch (err) {
      console.warn("Zoom live API failed, using demo link:", err.message);
    }
  }

  const suffix = crypto.randomBytes(3).toString("hex");
  return {
    provider: "zoom",
    mode: "demo",
    joinUrl: `https://zoom.us/j/00000000000?pwd=demo-gdp-${suffix}`,
    startUrl: `https://zoom.us/s/00000000000?pwd=demo-gdp-${suffix}`,
    meetingId: `demo-gdp-${suffix}`,
    password: "gdp123",
    message:
      "Demo Zoom link — add ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET for live meetings.",
  };
};

module.exports = { createMeeting };
