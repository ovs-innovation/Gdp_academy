const express = require("express");
const {
  convertCurrency,
  getExchangeRatesController,
} = require("../controllers/currencyController.js");

const router = express.Router();

// Get exchange rates (cached from Redis)
router.get("/exchange-rates", getExchangeRatesController);

// Convert currency
router.post("/convert", convertCurrency);

module.exports = router;
