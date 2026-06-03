/**
 * Single source for API URL in dev — reads backend/.env PORT (default 8096).
 */
const fs = require("fs");
const path = require("path");

const DEFAULT_PORT = 8096;

function readBackendPort() {
  const envPath = path.join(__dirname, "..", "backend", ".env");
  if (!fs.existsSync(envPath)) return DEFAULT_PORT;

  const match = fs.readFileSync(envPath, "utf8").match(/^PORT=(\d+)\s*$/m);
  return match ? Number(match[1]) : DEFAULT_PORT;
}

function getBackendUrl() {
  if (process.env.VITE_BACKEND_URL) {
    return process.env.VITE_BACKEND_URL.replace(/\/$/, "");
  }
  const port = readBackendPort();
  return `http://127.0.0.1:${port}`;
}

module.exports = { getBackendUrl, readBackendPort, DEFAULT_PORT };
