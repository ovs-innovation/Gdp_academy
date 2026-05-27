const express = require("express");
const {
  getSiteSettings,
  updateSiteSettings,
} = require("../controllers/siteSettingsController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// Public – anyone can read site settings for nav/footer
router.get("/", getSiteSettings);

// Admin only
router.put("/", verifyToken, isAdmin, updateSiteSettings);

module.exports = router;
