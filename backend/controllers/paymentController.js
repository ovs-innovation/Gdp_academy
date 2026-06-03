/**
 * Payment Controller — demo mode by default; live Razorpay when keys are configured.
 */

const { createOrder, verifyPayment } = require("../services/demoPaymentService.js");
const { getIntegrationStatus } = require("../lib/integrations.js");

const createCheckoutPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency, purpose, referenceId, courseId, programId } = req.body;
    const order = await createOrder({
      amount: amount || 999,
      currency: currency || "INR",
      purpose: purpose || "enrollment",
      referenceId: referenceId || programId || courseId,
      userId: req.user?.id,
      notes: { courseId, programId },
    });
    res.json({
      ...order,
      clientSecret: order.mode === "demo" ? "demo_secret" : null,
      integrations: getIntegrationStatus(),
    });
  } catch (err) {
    next(err);
  }
};

const createDemoCheckout = async (req, res, next) => {
  try {
    const { amount, currency, purpose, referenceId, programId, workshopId, planName } =
      req.body;
    const order = await createOrder({
      amount,
      currency,
      purpose: purpose || "membership",
      referenceId: referenceId || programId || workshopId || planName,
      userId: req.user?.id,
    });
    res.json({ success: true, order, integrations: getIntegrationStatus() });
  } catch (err) {
    next(err);
  }
};

const verifyCheckout = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, mode } = req.body;
    const result = await verifyPayment({ orderId, paymentId, signature, mode });
    res.json({
      ...result,
      integrations: getIntegrationStatus(),
    });
  } catch (err) {
    next(err);
  }
};

const stripeWebhook = async (req, res, next) => {
  try {
    res.json({ received: true, mode: "demo", message: "Stripe webhook stub — use Razorpay when configured." });
  } catch (err) {
    next(err);
  }
};

const createFreeBooking = async (req, res, next) => {
  try {
    res.json({
      success: true,
      mode: "demo",
      bookingId: `demo_booking_${Date.now()}`,
      message: "Demo booking confirmed. Live booking flow activates with payment keys.",
      integrations: getIntegrationStatus(),
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentMode = async (_req, res) => {
  res.json({
    integrations: getIntegrationStatus(),
  });
};

module.exports = {
  createCheckoutPaymentIntent,
  createDemoCheckout,
  verifyCheckout,
  stripeWebhook,
  createFreeBooking,
  getPaymentMode,
};
