const express = require("express");
const router = express.Router();
const { getHomepage } = require("../controllers/homepageController.js");

router.get("/", getHomepage);

module.exports = router;
