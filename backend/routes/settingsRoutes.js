const express = require('express');
const router = express.Router();

const { getSettings, updateSettings } = require('../controllers/settingsController');
const { noStoreCache } = require('../middlewares/noStoreCache.js');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const { isAdmin } = require('../middlewares/roleMiddleware.js');

// Retrieve current site settings
router.get('/', noStoreCache, getSettings);

// Update site settings (admin only)
router.put('/', verifyToken, isAdmin, updateSettings);

module.exports = router;
