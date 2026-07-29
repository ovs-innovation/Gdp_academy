const express = require('express');
const router = express.Router();

const { getSettings, updateSettings } = require('../controllers/settingsController');
const { noStoreCache } = require('../middlewares/noStoreCache.js');

// Retrieve current site settings
router.get('/', noStoreCache, getSettings);

// Update site settings (expects JSON body with updated fields)
router.put('/', updateSettings);

module.exports = router;
