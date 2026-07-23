const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db.js");
const { startExchangeRateJob, stopExchangeRateJob } = require("./jobs/exchangeRateJob.js");
const { ensureDefaultRoles } = require("./controllers/roleController.js");
const { ensureDefaultAdmin } = require("./lib/ensureDefaultAdmin.js");
const { initEmailTransport } = require("./lib/emailTransport.js");

/**
 * Production-safe startup — depends ONLY on:
 * - process.env
 * - backend source under this package
 * - installed npm packages
 *
 * Never import monorepo-root scripts (../scripts/*). Those files are outside the
 * Docker build context (backend/) and crash the process after every CI/CD deploy.
 */
const PORT = Number(process.env.PORT) || 8096;
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the existing backend process or set a different PORT.`,
    );
    process.exit(1);
  }
  console.error("Server failed to start:");
  console.error(error);
  process.exit(1);
});

const initializeServices = async () => {
  console.log("Initializing services...");
  if (!process.env.MONGO_URI?.trim()) {
    throw new Error(
      "MONGO_URI is not set — refusing to start without persistent database.",
    );
  }

  await connectDB(process.env.MONGO_URI);
  await ensureDefaultRoles();
  console.log("Default roles ensured ✅");
  await ensureDefaultAdmin();
  await initEmailTransport();
  startExchangeRateJob();
  console.log("All services initialized successfully 🚀");
};

const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  stopExchangeRateJob();

  await new Promise((resolve) => {
    server.close(resolve);
  });

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }

  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

const startServer = async () => {
  try {
    await initializeServices();
    server.listen(PORT, HOST, () => {
      console.log(`GDP Backend listening on ${HOST}:${PORT}`);
      console.log(`Health: http://${HOST === "0.0.0.0" ? "127.0.0.1" : HOST}:${PORT}/health`);
    });
  } catch (error) {
    console.error("Critical Failure during service initialization ❌:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
