const crypto = require("crypto");

/** Lazy-load ESM recording service so app starts without Zoom/AWS keys. */
const loadRecordingService = async () => {
  try {
    return await import("../services/recordingService.js");
  } catch (err) {
    console.warn("Recording service unavailable (demo mode):", err.message);
    return null;
  }
};

const verifyWebhookSignature = (requestBody, signature, timestamp) => {
  const webhookSecret = process.env.ZOOM_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn(
      "⚠️  ZOOM_WEBHOOK_SECRET not set - webhook validation disabled",
    );
    return true;
  }

  const message = `v0:${timestamp}:${requestBody}`;
  const hashForVerify = crypto
    .createHmac("sha256", webhookSecret)
    .update(message)
    .digest("hex");

  const expectedSignature = `v0=${hashForVerify}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
};

const handleZoomWebhook = async (req, res, next) => {
  try {
    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`\n📨 Zoom webhook received: ${event}`);

    if (event === "endpoint.url_validation") {
      const plainToken = payload.plainToken;
      const encryptedToken = crypto
        .createHmac("sha256", process.env.ZOOM_WEBHOOK_SECRET || "")
        .update(plainToken)
        .digest("hex");

      console.log("✓ Webhook URL validation successful");

      return res.status(200).json({
        plainToken,
        encryptedToken,
      });
    }

    const signature = req.headers["x-zm-signature"];
    const timestamp = req.headers["x-zm-request-timestamp"];
    const rawBody = JSON.stringify(req.body);

    if (signature && timestamp) {
      const isValid = verifyWebhookSignature(rawBody, signature, timestamp);
      if (!isValid) {
        console.error("✗ Invalid webhook signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    if (event === "recording.completed") {
      const meetingId = payload.object?.id || payload.object?.uuid;

      if (!meetingId) {
        console.error("✗ No meeting ID in webhook payload");
        return res.status(400).json({ error: "Missing meeting ID" });
      }

      console.log(`✓ Processing recording for meeting: ${meetingId}`);

      loadRecordingService().then((svc) => {
        if (!svc?.processRecordingByMeetingId) {
          console.log("ℹ️  Recording skipped — service not configured (demo mode)");
          return;
        }
        return svc.processRecordingByMeetingId(String(meetingId));
      }).then((success) => {
        if (success) {
          console.log(`✅ Recording processed for meeting ${meetingId}`);
        } else if (success === false) {
          console.log(`⚠️  Recording pending for meeting ${meetingId}`);
        }
      }).catch((error) => {
        console.error(`✗ Recording failed for meeting ${meetingId}:`, error.message);
      });

      return res.status(200).json({ message: "Webhook received" });
    }

    console.log(`ℹ️  Unhandled webhook event: ${event}`);
    return res.status(200).json({ message: "Event ignored" });
  } catch (error) {
    console.error("✗ Webhook error:", error.message);
    return res.status(200).json({ message: "Error logged" });
  }
};

const manualTriggerRecording = async (req, res, next) => {
  try {
    const { meetingId, bookingId } = req.body;

    if (!meetingId && !bookingId) {
      return res.status(400).json({
        error: "Either meetingId or bookingId is required",
      });
    }

    console.log(
      `\n🔧 Manual trigger: meetingId=${meetingId}, bookingId=${bookingId}`,
    );

    const svc = await loadRecordingService();
    if (!svc) {
      return res.status(200).json({
        message: "Recording service not configured (demo mode). Add AWS/Zoom keys when ready.",
        success: false,
        mode: "demo",
      });
    }

    let success;
    if (meetingId) {
      success = await svc.processRecordingByMeetingId(String(meetingId));
    } else {
      const Booking = require("../models/bookingModel.js");
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      const mid = booking.meeting?.meetingId || booking.meetingId;
      success = await svc.processRecording(bookingId, mid);
    }

    if (success) {
      return res.status(200).json({
        message: "Recording processed successfully",
        success: true,
      });
    } else {
      return res.status(202).json({
        message: "Recording processing pending or failed",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleZoomWebhook,
  manualTriggerRecording,
};
