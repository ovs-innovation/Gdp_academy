const express = require("express");
const { getStatus } = require("../controllers/integrationsController.js");

const router = express.Router();

router.get("/status", getStatus);

module.exports = router;
