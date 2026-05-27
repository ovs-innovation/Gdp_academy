const express = require('express');
const router = express.Router();

const { getSettings, updateSettings } = require('../controllers/settingsController');

// Retrieve current site settings
router.get('/', getSettings);

// Update site settings (expects JSON body with updated fields)
router.put('/', updateSettings);

module.exports = router;
