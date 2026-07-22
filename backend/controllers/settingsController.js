const Settings = require("../models/settingsModel.js");
const { withPublicCache } = require("../utils/publicCache.js");

const getSettings = async (req, res, next) => {
  try {
    const body = await withPublicCache("app-settings", 120_000, async () => {
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

    res.json({ settings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
