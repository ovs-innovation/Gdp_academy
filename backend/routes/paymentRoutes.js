const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const {
  createCheckoutPaymentIntent,
  createDemoCheckout,
  verifyCheckout,
  stripeWebhook,
  createFreeBooking,
  getPaymentMode,
} = require("../controllers/paymentController.js");

const router = express.Router();

router.get("/mode", getPaymentMode);

router.post("/checkout/payment-intent", verifyToken, createCheckoutPaymentIntent);
router.post("/checkout/create-order", verifyToken, createDemoCheckout);
router.post("/checkout/verify", verifyToken, verifyCheckout);
router.post("/checkout/free-booking", verifyToken, createFreeBooking);

router.post("/stripe/webhook", stripeWebhook);

module.exports = router;
