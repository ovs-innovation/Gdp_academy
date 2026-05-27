/**
 * Payment Controller (Mocked / Offline CMS version)
 * Handles legacy checkout and stripe webhook routes without requiring Teacher/Availability/Pricing service.
 */

const createCheckoutPaymentIntent = async (req, res, next) => {
  try {
    res.json({
      clientSecret: "mock_secret",
      pricing: {},
      hold: null,
      teacher: { name: "Mock Coach" },
      course: { name: "Mock Course" },
    });
  } catch (err) {
    next(err);
  }
};

const stripeWebhook = async (req, res, next) => {
  try {
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

const createFreeBooking = async (req, res, next) => {
  try {
    res.json({
      success: true,
      bookingId: "mock_booking_id",
      message: "Free booking successful",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCheckoutPaymentIntent,
  stripeWebhook,
  createFreeBooking,
};
