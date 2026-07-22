import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { existsSync, readFileSync } from "node:fs";
import { componentTagger } from "lovable-tagger";

function getBackendTarget(): string {
  if (process.env.VITE_BACKEND_URL) {
    return process.env.VITE_BACKEND_URL.replace(/\/$/, "");
  }
  const backendEnv = path.resolve(__dirname, "../backend/.env");
  if (existsSync(backendEnv)) {
    const port = readFileSync(backendEnv, "utf8").match(/^PORT=(\d+)/m)?.[1];
    if (port) return `http://127.0.0.1:${port}`;
  }
  return "http://127.0.0.1:8096";
}

const backendTarget = getBackendTarget();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-flags-select"],
  },
}));
