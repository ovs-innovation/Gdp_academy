// vite.config.ts
import { defineConfig } from "file:///C:/Users/drist/Gdp_academy/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/drist/Gdp_academy/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import legacy from "file:///C:/Users/drist/Gdp_academy/frontend/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/drist/Gdp_academy/frontend/vite.config.ts";
var __dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
function getBackendTarget() {
  if (process.env.VITE_BACKEND_URL) {
    return process.env.VITE_BACKEND_URL.replace(/\/$/, "");
  }
  const backendEnv = resolve(__dirname, "../backend/.env");
  if (existsSync(backendEnv)) {
    const port = readFileSync(backendEnv, "utf8").match(/^PORT=(\d+)/m)?.[1];
    if (port) return `http://127.0.0.1:${port}`;
  }
  return "http://127.0.0.1:8096";
}
var backendTarget = getBackendTarget();
var vite_config_default = defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"]
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 3e3,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: backendTarget,
        changeOrigin: true,
        secure: false
      },
      "/uploads": {
        target: backendTarget,
        changeOrigin: true,
        secure: false
      }
    }
  },
  esbuild: {
    drop: ["console", "debugger"]
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkcmlzdFxcXFxHZHBfYWNhZGVteVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZHJpc3RcXFxcR2RwX2FjYWRlbXlcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2RyaXN0L0dkcF9hY2FkZW15L2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5J1xuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmNvbnN0IF9fZGlybmFtZSA9IGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKVxuXG4vKiogQWx3YXlzIG1hdGNoIGJhY2tlbmQvLmVudiBQT1JUIHNvIHByb3h5IG5ldmVyIHBvaW50cyBhdCB3cm9uZyBwb3J0ICovXG5mdW5jdGlvbiBnZXRCYWNrZW5kVGFyZ2V0KCk6IHN0cmluZyB7XG4gIGlmIChwcm9jZXNzLmVudi5WSVRFX0JBQ0tFTkRfVVJMKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MuZW52LlZJVEVfQkFDS0VORF9VUkwucmVwbGFjZSgvXFwvJC8sICcnKVxuICB9XG4gIGNvbnN0IGJhY2tlbmRFbnYgPSByZXNvbHZlKF9fZGlybmFtZSwgJy4uL2JhY2tlbmQvLmVudicpXG4gIGlmIChleGlzdHNTeW5jKGJhY2tlbmRFbnYpKSB7XG4gICAgY29uc3QgcG9ydCA9IHJlYWRGaWxlU3luYyhiYWNrZW5kRW52LCAndXRmOCcpLm1hdGNoKC9eUE9SVD0oXFxkKykvbSk/LlsxXVxuICAgIGlmIChwb3J0KSByZXR1cm4gYGh0dHA6Ly8xMjcuMC4wLjE6JHtwb3J0fWBcbiAgfVxuICByZXR1cm4gJ2h0dHA6Ly8xMjcuMC4wLjE6ODA5Nidcbn1cblxuY29uc3QgYmFja2VuZFRhcmdldCA9IGdldEJhY2tlbmRUYXJnZXQoKVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbGVnYWN5KHtcbiAgICAgIHRhcmdldHM6IFsnZGVmYXVsdHMnLCAnbm90IElFIDExJ11cbiAgICB9KVxuICBdLFxuXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBhbGxvd2VkSG9zdHM6IHRydWUsXG5cbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogYmFja2VuZFRhcmdldCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgICcvdXBsb2Fkcyc6IHtcbiAgICAgICAgdGFyZ2V0OiBiYWNrZW5kVGFyZ2V0LFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5cbiAgZXNidWlsZDoge1xuICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICB9LFxuXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUyxTQUFTLG9CQUFvQjtBQUNsVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsWUFBWSxvQkFBb0I7QUFDekMsU0FBUyxTQUFTLGVBQWU7QUFDakMsU0FBUyxxQkFBcUI7QUFMeUosSUFBTSwyQ0FBMkM7QUFPeE8sSUFBTSxZQUFZLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBR3hELFNBQVMsbUJBQTJCO0FBQ2xDLE1BQUksUUFBUSxJQUFJLGtCQUFrQjtBQUNoQyxXQUFPLFFBQVEsSUFBSSxpQkFBaUIsUUFBUSxPQUFPLEVBQUU7QUFBQSxFQUN2RDtBQUNBLFFBQU0sYUFBYSxRQUFRLFdBQVcsaUJBQWlCO0FBQ3ZELE1BQUksV0FBVyxVQUFVLEdBQUc7QUFDMUIsVUFBTSxPQUFPLGFBQWEsWUFBWSxNQUFNLEVBQUUsTUFBTSxjQUFjLElBQUksQ0FBQztBQUN2RSxRQUFJLEtBQU0sUUFBTyxvQkFBb0IsSUFBSTtBQUFBLEVBQzNDO0FBQ0EsU0FBTztBQUNUO0FBRUEsSUFBTSxnQkFBZ0IsaUJBQWlCO0FBR3ZDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxZQUFZLFdBQVc7QUFBQSxJQUNuQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osY0FBYztBQUFBLElBRWQsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxFQUM5QjtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsY0FBYztBQUFBLElBQ2QsdUJBQXVCO0FBQUEsRUFDekI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
