const crypto = require("crypto");
const { getIntegrationStatus } = require("../lib/integrations.js");

const getRazorpayClient = () => {
  try {
    return require("../config/razorpay.js")();
  } catch {
    return null;
  }
};

/**
 * Create payment order — live Razorpay when keys exist, otherwise demo order.
 */
const createOrder = async ({
  amount,
  currency = "INR",
  purpose = "enrollment",
  referenceId,
  userId,
  notes = {},
}) => {
  const status = getIntegrationStatus();
  const amountPaise = Math.round(Number(amount) * 100) || 10000;

  if (status.payment.razorpay && status.payment.live) {
    const razorpay = getRazorpayClient();
    if (razorpay) {
      const receipt = `gdp_${referenceId || "ref"}_${Date.now()}`.slice(0, 40);
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency,
        receipt,
        notes: { purpose, referenceId: String(referenceId || ""), userId: String(userId || ""), ...notes },
      });
      return {
        mode: "razorpay",
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        purpose,
        referenceId,
      };
    }
  }

  const orderId = `demo_order_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  return {
    mode: "demo",
    orderId,
    amount: Number(amount) || amountPaise / 100,
    currency,
    purpose,
    referenceId,
    keyId: null,
    message:
      "Demo payment mode — payment will auto-complete. Add Razorpay/PhonePe keys for live checkout.",
  };
};

/**
 * Verify payment — demo always succeeds; live verifies Razorpay signature when configured.
 */
const verifyPayment = async ({
  orderId,
  paymentId,
  signature,
  mode,
}) => {
  if (mode === "razorpay" && getIntegrationStatus().payment.razorpay) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error("Razorpay secret missing");
    }
    const body = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== signature) {
      throw new Error("Invalid payment signature");
    }
    return {
      success: true,
      mode: "razorpay",
      orderId,
      paymentId,
    };
  }

  return {
    success: true,
    mode: "demo",
    orderId,
    paymentId: paymentId || `demo_pay_${Date.now()}`,
    message: "Demo payment confirmed. Live gateway activates when keys are added.",
  };
};

module.exports = {
  createOrder,
  verifyPayment,
};
