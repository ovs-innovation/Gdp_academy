const mongoose = require("mongoose");

/** @returns {string} */
const resolveMongoUri = (uri) => (uri || process.env.MONGO_URI || "").trim();

/**
 * Reject missing or obviously non-persistent Mongo URIs.
 * In-memory fallback is intentionally disabled — data must survive restarts.
 */
const assertPersistentUri = (uri) => {
  if (!uri) {
    const err = new Error(
      "MONGO_URI is missing. Set it in backend/.env (MongoDB Atlas or local mongod).",
    );
    err.code = "MONGO_URI_MISSING";
    throw err;
  }

  const lower = uri.toLowerCase();
  if (
    lower.includes("memory") ||
    lower.startsWith("mongodb://127.0.0.1:0") ||
    lower.startsWith("mongodb://localhost:0")
  ) {
    const err = new Error(
      "MONGO_URI points to a non-persistent database. Use MongoDB Atlas or local mongod.",
    );
    err.code = "MONGO_URI_EPHEMERAL";
    throw err;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let disconnectListenerAttached = false;

const attachDisconnectListener = () => {
  if (disconnectListenerAttached) return;
  disconnectListenerAttached = true;
  mongoose.connection.on("disconnected", () => {
    console.error(
      "❌ MongoDB disconnected. Fix Atlas/network — backend will keep retrying on next request cycle / restart.",
    );
  });
};

/**
 * Connect with retries so transient Atlas / network blips don't kill the process on boot.
 */
const connectDB = async (uri, options = {}) => {
  const mongoUri = resolveMongoUri(uri);
  assertPersistentUri(mongoUri);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  attachDisconnectListener();

  const maxAttempts = Number(options.maxAttempts ?? process.env.MONGO_CONNECT_RETRIES ?? 8);
  const baseDelayMs = Number(options.baseDelayMs ?? 2000);

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: 10,
      });

      const { host, name } = mongoose.connection;
      console.log("MongoDB Connected Successfully ✅");
      console.log(`   Database: ${name} | Host: ${host}`);
      console.log(
        "   Storage: PERSISTENT — data survives restarts until you delete manually",
      );
      console.log(
        "   Auto-delete: only OTP codes expire (login security); all other data is kept",
      );
      return mongoose.connection;
    } catch (err) {
      lastError = err;
      console.error(
        `❌ MongoDB connect attempt ${attempt}/${maxAttempts} failed: ${err.message}`,
      );
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * attempt;
        console.error(`   Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  console.error("❌ FATAL: Cannot connect to MongoDB. Server will NOT start.");
  console.error(
    "   In-memory fallback is disabled — no data will be saved to RAM.",
  );
  console.error("   Reason:", lastError?.message);
  console.error("");
  console.error("   Fix:");
  console.error("   1. Set MONGO_URI in backend/.env");
  console.error(
    "   2. Atlas → Network Access → whitelist your VPS IP (or 0.0.0.0/0 for open access)",
  );
  console.error("   3. Verify database user, password, and database name");
  throw lastError;
};

const getDbHealth = () => {
  const conn = mongoose.connection;
  const connected = conn.readyState === 1;
  return {
    ok: connected,
    persistent: connected,
    database: conn.name || null,
    host: conn.host || null,
    readyState: conn.readyState,
  };
};

module.exports = connectDB;
module.exports.getDbHealth = getDbHealth;
module.exports.assertPersistentUri = assertPersistentUri;
