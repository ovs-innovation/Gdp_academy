const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db.js");
const { startExchangeRateJob, stopExchangeRateJob } = require("./jobs/exchangeRateJob.js");
const { ensureDefaultRoles } = require("./controllers/roleController.js");
const { ensureDefaultAdmin } = require("./lib/ensureDefaultAdmin.js");
const { initEmailTransport } = require("./lib/emailTransport.js");
const { printDevNetworkGuide, getLanAddresses } = require("../scripts/lan-urls.cjs");
const { readBackendPort } = require("../scripts/dev-backend-url.cjs");

const PORT = Number(process.env.PORT) || readBackendPort();
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the existing backend process or set a different PORT in backend/.env.`,
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
      "MONGO_URI is not set in backend/.env — refusing to start without persistent database.",
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
      console.log(`Server running on http://localhost:${PORT}`);
      const ips = getLanAddresses();
      if (ips.length) {
        ips.forEach((ip) => console.log(`  LAN API:  http://${ip}:${PORT}/api/health`));
      }
      printDevNetworkGuide({ frontend: 3000, admin: 8080, backend: PORT });
    });
  } catch (error) {
    console.error("Critical Failure during service initialization ❌:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
