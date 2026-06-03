const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

let client = null;

/**
 * Returns Razorpay client when keys exist; otherwise null (demo mode).
 */
const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    return null;
  }
  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return client;
};

module.exports = getRazorpayClient;
