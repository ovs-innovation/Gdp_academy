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

const connectDB = async (uri) => {
  const mongoUri = resolveMongoUri(uri);
  assertPersistentUri(mongoUri);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.connection.on("disconnected", () => {
    console.error(
      "❌ MongoDB disconnected. Fix Atlas/network and restart the backend.",
    );
  });

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
    });

    const { host, name } = mongoose.connection;
    console.log("MongoDB Connected Successfully ✅");
    console.log(`   Database: ${name} | Host: ${host}`);
    console.log("   Storage: PERSISTENT — data survives restarts until you delete manually");
    console.log("   Auto-delete: only OTP codes expire (login security); all other data is kept");
    return mongoose.connection;
  } catch (err) {
    console.error("❌ FATAL: Cannot connect to MongoDB. Server will NOT start.");
    console.error(
      "   In-memory fallback is disabled — no data will be saved to RAM.",
    );
    console.error("   Reason:", err.message);
    console.error("");
    console.error("   Fix:");
    console.error("   1. Set MONGO_URI in backend/.env");
    console.error(
      "   2. Atlas → Network Access → whitelist your IP (or 0.0.0.0/0 for dev)",
    );
    console.error("   3. Verify database user, password, and database name");
    throw err;
  }
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
