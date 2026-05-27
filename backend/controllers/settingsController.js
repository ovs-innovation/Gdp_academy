const Settings = require("../models/settingsModel.js");

const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ settings });
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
