const Settings = require("../models/settingsModel.js");
const {
  withPublicCache,
  invalidatePublicCache,
} = require("../utils/publicCache.js");

const APP_SETTINGS_CACHE_TTL_MS = 5_000;

const getSettings = async (req, res, next) => {
  try {
    const body = await withPublicCache("app-settings", APP_SETTINGS_CACHE_TTL_MS, async () => {
      const settings = await Settings.getSettings();
      return { settings };
    });
    res.json(body);
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    invalidatePublicCache("app-settings");
    res.json({ settings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
