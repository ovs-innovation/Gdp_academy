import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initRedis } from "./config/redis.js";
import { startExchangeRateJob } from "./jobs/exchangeRateJob.js";
import { ensureDefaultRoles } from "./controllers/roleController.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize all services sequentially
const initializeServices = async () => {
  try {
    console.log("Initializing services...");
    
    // 1. Connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    
    // 2. Ensure Roles exist
    await ensureDefaultRoles();
    console.log("Default roles ensured ✅");
    
    // 3. Initialize Redis
    await initRedis();
    
    // 4. Start Cron Jobs
    startExchangeRateJob();
    
    console.log("All services initialized successfully 🚀");
  } catch (error) {
    console.error("Critical Failure during service initialization ❌:");
    console.error(error);
    // In production, you might not want to exit immediately, but for dev it's better to know.
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeServices();
  server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
};

startServer();
