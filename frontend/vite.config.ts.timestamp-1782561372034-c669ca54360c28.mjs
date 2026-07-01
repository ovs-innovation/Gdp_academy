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
    // Replace this if ngrok gives a new URL
    allowedHosts: ["grandly-work-gigantic.ngrok-free.dev"],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkcmlzdFxcXFxHZHBfYWNhZGVteVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZHJpc3RcXFxcR2RwX2FjYWRlbXlcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2RyaXN0L0dkcF9hY2FkZW15L2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knXHJcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ25vZGU6ZnMnXHJcbmltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcclxuXHJcbmNvbnN0IF9fZGlybmFtZSA9IGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKVxyXG5cclxuLyoqIEFsd2F5cyBtYXRjaCBiYWNrZW5kLy5lbnYgUE9SVCBzbyBwcm94eSBuZXZlciBwb2ludHMgYXQgd3JvbmcgcG9ydCAqL1xyXG5mdW5jdGlvbiBnZXRCYWNrZW5kVGFyZ2V0KCk6IHN0cmluZyB7XHJcbiAgaWYgKHByb2Nlc3MuZW52LlZJVEVfQkFDS0VORF9VUkwpIHtcclxuICAgIHJldHVybiBwcm9jZXNzLmVudi5WSVRFX0JBQ0tFTkRfVVJMLnJlcGxhY2UoL1xcLyQvLCAnJylcclxuICB9XHJcbiAgY29uc3QgYmFja2VuZEVudiA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vYmFja2VuZC8uZW52JylcclxuICBpZiAoZXhpc3RzU3luYyhiYWNrZW5kRW52KSkge1xyXG4gICAgY29uc3QgcG9ydCA9IHJlYWRGaWxlU3luYyhiYWNrZW5kRW52LCAndXRmOCcpLm1hdGNoKC9eUE9SVD0oXFxkKykvbSk/LlsxXVxyXG4gICAgaWYgKHBvcnQpIHJldHVybiBgaHR0cDovLzEyNy4wLjAuMToke3BvcnR9YFxyXG4gIH1cclxuICByZXR1cm4gJ2h0dHA6Ly8xMjcuMC4wLjE6ODA5NidcclxufVxyXG5cclxuY29uc3QgYmFja2VuZFRhcmdldCA9IGdldEJhY2tlbmRUYXJnZXQoKVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBsZWdhY3koe1xuICAgICAgdGFyZ2V0czogWydkZWZhdWx0cycsICdub3QgSUUgMTEnXVxuICAgIH0pXG4gIF0sXHJcblxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgICBwb3J0OiAzMDAwLFxyXG5cclxuICAgIC8vIFJlcGxhY2UgdGhpcyBpZiBuZ3JvayBnaXZlcyBhIG5ldyBVUkxcclxuICAgIGFsbG93ZWRIb3N0czogW1wiZ3JhbmRseS13b3JrLWdpZ2FudGljLm5ncm9rLWZyZWUuZGV2XCJdLFxyXG5cclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogYmFja2VuZFRhcmdldCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgJy91cGxvYWRzJzoge1xyXG4gICAgICAgIHRhcmdldDogYmFja2VuZFRhcmdldCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgZXNidWlsZDoge1xyXG4gICAgZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10sXHJcbiAgfSxcclxuXHJcbiAgYnVpbGQ6IHtcclxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVMsU0FBUyxvQkFBb0I7QUFDbFUsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixTQUFTLFlBQVksb0JBQW9CO0FBQ3pDLFNBQVMsU0FBUyxlQUFlO0FBQ2pDLFNBQVMscUJBQXFCO0FBTHlKLElBQU0sMkNBQTJDO0FBT3hPLElBQU0sWUFBWSxRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUd4RCxTQUFTLG1CQUEyQjtBQUNsQyxNQUFJLFFBQVEsSUFBSSxrQkFBa0I7QUFDaEMsV0FBTyxRQUFRLElBQUksaUJBQWlCLFFBQVEsT0FBTyxFQUFFO0FBQUEsRUFDdkQ7QUFDQSxRQUFNLGFBQWEsUUFBUSxXQUFXLGlCQUFpQjtBQUN2RCxNQUFJLFdBQVcsVUFBVSxHQUFHO0FBQzFCLFVBQU0sT0FBTyxhQUFhLFlBQVksTUFBTSxFQUFFLE1BQU0sY0FBYyxJQUFJLENBQUM7QUFDdkUsUUFBSSxLQUFNLFFBQU8sb0JBQW9CLElBQUk7QUFBQSxFQUMzQztBQUNBLFNBQU87QUFDVDtBQUVBLElBQU0sZ0JBQWdCLGlCQUFpQjtBQUd2QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxTQUFTLENBQUMsWUFBWSxXQUFXO0FBQUEsSUFDbkMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBR04sY0FBYyxDQUFDLHNDQUFzQztBQUFBLElBRXJELE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxNQUFNLENBQUMsV0FBVyxVQUFVO0FBQUEsRUFDOUI7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGNBQWM7QUFBQSxJQUNkLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
