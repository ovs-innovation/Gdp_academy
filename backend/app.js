const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { errorHandler } = require("./middlewares/errorHandler.js");

// Route imports (CommonJS)
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const roleRoutes = require("./routes/roleRoutes.js");
const settingsRoutes = require("./routes/settingsRoutes.js");
const studentProfileRoutes = require("./routes/studentProfileRoutes.js");
const adminCourseRoutes = require("./routes/admin/courseRoutes.js");
const adminCategoryRoutes = require("./routes/admin/categoryRoutes.js");
const adminPaymentRoutes = require("./routes/admin/paymentRoutes.js");
const adminDashboardRoutes = require("./routes/admin/dashboardRoutes.js");
const studentCourseRoutes = require("./routes/student/courseRoutes.js");
const studentCategoryRoutes = require("./routes/student/categoryRoutes.js");
const publicCourseRoutes = require("./routes/student/publicCourseRoutes.js");
const studentBookingRoutes = require("./routes/student/bookingRoutes.js");
const currencyRoutes = require("./routes/currencyRoutes.js");
const translationRoutes = require("./routes/translationRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const enquiryRoutes = require("./routes/enquiryRoutes.js");
const cmsRoutes = require("./routes/cmsRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");
const galleryRoutes = require("./routes/galleryRoutes.js");
const testimonialRoutes = require("./routes/testimonialRoutes.js");

// New CMS routes
const faqRoutes = require("./routes/faqRoutes.js");
const galleryItemRoutes = require("./routes/galleryItemRoutes.js");
const membershipPlanRoutes = require("./routes/membershipPlanRoutes.js");
const contactMessageRoutes = require("./routes/contactMessageRoutes.js");
const pageContentRoutes = require("./routes/pageContentRoutes.js");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes.js");
const mediaRoutes = require("./routes/mediaRoutes.js");
const webhookRoutes = require("./routes/webhookRoutes.js");
const recordingRoutes = require("./routes/recordingRoutes.js");
const protectedMediaRoutes = require("./routes/protectedMediaRoutes.js");
const integrationsRoutes = require("./routes/integrationsRoutes.js");
const zoomRoutes = require("./routes/zoomRoutes.js");
const { getDbHealth } = require("./config/db.js");
const { requirePersistentDb } = require("./middlewares/requireDbMiddleware.js");

const app = express();

dotenv.config();

// DB connection is handled in server.js (do not connect here — avoids double-connect race)

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors());

// IMPORTANT FIX
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads — ensure directory exists
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  const db = getDbHealth();
  const status = db.ok ? 200 : 503;
  res.status(status).json({
    status: db.ok ? "ok" : "unavailable",
    database: db,
    message: db.ok
      ? "Connected to persistent MongoDB"
      : "Database not connected — fix MONGO_URI / Atlas IP whitelist before saving data",
  });
});

// Block all API traffic until MongoDB is connected (data must never be "lost" to RAM)
app.use("/api", requirePersistentDb);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/student-profiles", studentProfileRoutes);
app.use("/api/admin/programs", adminCourseRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/courses", studentCourseRoutes);
app.use("/api/public/categories", studentCategoryRoutes);
app.use("/api/public/courses", publicCourseRoutes);
app.use("/api/bookings", studentBookingRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/translate", translationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialRoutes);

// New CMS routes mounting
app.use("/api/faqs", faqRoutes);
app.use("/api/gallery-items", galleryItemRoutes);
app.use("/api/membership-plans", membershipPlanRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/page-contents", pageContentRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/protected-media", protectedMediaRoutes);
app.use("/api/integrations", integrationsRoutes);
app.use("/api/zoom", zoomRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
