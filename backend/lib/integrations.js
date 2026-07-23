/**
 * Integration mode: demo until API keys are configured.
 * Set INTEGRATION_MODE=live to prefer live gateways when keys exist.
 */

const has = (...keys) => keys.every((k) => Boolean(process.env[k]?.trim()));

const getIntegrationStatus = () => {
  const razorpay = has("RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET");
  const phonepe = has(
    "PHONEPE_CLIENT_ID",
    "PHONEPE_CLIENT_SECRET",
    "PHONEPE_CLIENT_VERSION",
  );
  const zoom = has("ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET");
  const s3Bucket =
    process.env.AWS_S3_BUCKET_NAME?.trim() ||
    process.env.AWS_S3_BUCKET?.trim();
  const recording = has(
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
  ) && Boolean(s3Bucket);

  const forceDemo = (process.env.INTEGRATION_MODE || "demo").toLowerCase() === "demo";
  const paymentLive = !forceDemo && (razorpay || phonepe);

  return {
    mode: paymentLive || (!forceDemo && zoom) ? "live" : "demo",
    payment: {
      razorpay,
      phonepe,
      live: paymentLive,
      demo: !paymentLive,
    },
    zoom: {
      configured: zoom,
      demo: !zoom || forceDemo,
    },
    recording: {
      configured: recording,
      demo: !recording || forceDemo,
    },
  };
};

const isDemoMode = () => getIntegrationStatus().payment.demo;

module.exports = {
  getIntegrationStatus,
  isDemoMode,
};
