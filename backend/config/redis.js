import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

/**
 * Environment variables
 */
const {
  REDIS_HOST = "localhost",
  REDIS_PORT = 6379,
  REDIS_USERNAME = "default",
  REDIS_PASSWORD
} = process.env;

let client;

/**
 * Initialize Redis connection
 */
export async function initRedis() {
  if (client) return client;

  try {
    client = createClient({
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
        connectTimeout: 5000 // 5 seconds timeout
      }
    });

    client.on("ready", () => {
      console.log("Redis connected ✅");
    });

    client.on("error", (err) => {
      console.error("Redis error ❌:", err.message);
    });

    await client.connect();
    return client;
  } catch (err) {
    console.warn("⚠️ Redis connection failed. Features requiring caching will be skipped.");
    console.warn("Reason:", err.message);
    client = null;
    return null;
  }
}

/**
 * Get active Redis client
 */
export function getRedisClient() {
  if (!client) {
    // Return a dummy client for development to prevent crashes
    return {
      get: async () => null,
      setEx: async () => null,
      del: async () => null,
      on: () => {},
      quit: async () => {}
    };
  }
  return client;
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedis() {
  if (client) {
    await client.quit();
    client = null;
    console.log("Redis connection closed");
  }
}
