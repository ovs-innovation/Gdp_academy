const mongoose = require("mongoose");

/**
 * Reject API writes/reads when MongoDB is not connected.
 * Prevents silent failures where the admin UI appears to work but nothing is persisted.
 */
const requirePersistentDb = (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message:
      "Database not connected — data was NOT saved. Start the backend with a valid MONGO_URI (MongoDB Atlas or local mongod).",
    code: "DB_NOT_CONNECTED",
    persistent: false,
  });
};

module.exports = { requirePersistentDb };
