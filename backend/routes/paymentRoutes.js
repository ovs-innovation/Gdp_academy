const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const {
  createCheckoutPaymentIntent,
  stripeWebhook,
  createFreeBooking,
} = require("../controllers/paymentController.js");

const router = express.Router();

// Authenticated checkout init
router.post(
  "/checkout/payment-intent",
  verifyToken,
  createCheckoutPaymentIntent,
);

// Free booking init
router.post("/checkout/free-booking", verifyToken, createFreeBooking);

// Stripe webhook (raw body is handled in app.js)
router.post("/stripe/webhook", stripeWebhook);

module.exports = router;
