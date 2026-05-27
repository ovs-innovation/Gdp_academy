const { StandardCheckoutClient, Env } = require("pg-sdk-node");
const dotenv = require("dotenv");

dotenv.config();

let clientInstance = null;

const getPhonePeClient = () => {
  if (clientInstance) return clientInstance;

  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION;
  if (!clientId || !clientSecret || !clientVersion) {
    throw new Error(
      "PhonePe credentials missing: ensure PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, PHONEPE_CLIENT_VERSION are set",
    );
  }
  const phonePeEnv =
    (process.env.PHONEPE_ENV || "SANDBOX").toUpperCase() === "PRODUCTION"
      ? Env.PRODUCTION
      : Env.SANDBOX;

  clientInstance = StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    phonePeEnv,
  );

  return clientInstance;
};

module.exports = getPhonePeClient;
