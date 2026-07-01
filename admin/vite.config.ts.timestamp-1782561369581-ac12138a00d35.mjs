// vite.config.ts
import { defineConfig } from "file:///C:/Users/drist/Gdp_academy/admin/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/drist/Gdp_academy/admin/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { existsSync, readFileSync } from "node:fs";
import { componentTagger } from "file:///C:/Users/drist/Gdp_academy/admin/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\drist\\Gdp_academy\\admin";
function getBackendTarget() {
  if (process.env.VITE_BACKEND_URL) {
    return process.env.VITE_BACKEND_URL.replace(/\/$/, "");
  }
  const backendEnv = path.resolve(__vite_injected_original_dirname, "../backend/.env");
  if (existsSync(backendEnv)) {
    const port = readFileSync(backendEnv, "utf8").match(/^PORT=(\d+)/m)?.[1];
    if (port) return `http://127.0.0.1:${port}`;
  }
  return "http://127.0.0.1:8096";
}
var backendTarget = getBackendTarget();
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    dedupe: ["react", "react-dom"]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-flags-select"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkcmlzdFxcXFxHZHBfYWNhZGVteVxcXFxhZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZHJpc3RcXFxcR2RwX2FjYWRlbXlcXFxcYWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2RyaXN0L0dkcF9hY2FkZW15L2FkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG5mdW5jdGlvbiBnZXRCYWNrZW5kVGFyZ2V0KCk6IHN0cmluZyB7XHJcbiAgaWYgKHByb2Nlc3MuZW52LlZJVEVfQkFDS0VORF9VUkwpIHtcclxuICAgIHJldHVybiBwcm9jZXNzLmVudi5WSVRFX0JBQ0tFTkRfVVJMLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcclxuICB9XHJcbiAgY29uc3QgYmFja2VuZEVudiA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vYmFja2VuZC8uZW52XCIpO1xyXG4gIGlmIChleGlzdHNTeW5jKGJhY2tlbmRFbnYpKSB7XHJcbiAgICBjb25zdCBwb3J0ID0gcmVhZEZpbGVTeW5jKGJhY2tlbmRFbnYsIFwidXRmOFwiKS5tYXRjaCgvXlBPUlQ9KFxcZCspL20pPy5bMV07XHJcbiAgICBpZiAocG9ydCkgcmV0dXJuIGBodHRwOi8vMTI3LjAuMC4xOiR7cG9ydH1gO1xyXG4gIH1cclxuICByZXR1cm4gXCJodHRwOi8vMTI3LjAuMC4xOjgwOTZcIjtcclxufVxyXG5cclxuY29uc3QgYmFja2VuZFRhcmdldCA9IGdldEJhY2tlbmRUYXJnZXQoKTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IGJhY2tlbmRUYXJnZXQsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiL3VwbG9hZHNcIjoge1xyXG4gICAgICAgIHRhcmdldDogYmFja2VuZFRhcmdldCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGNvbXBvbmVudFRhZ2dlcigpXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJyZWFjdC1mbGFncy1zZWxlY3RcIl0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRSLFNBQVMsb0JBQW9CO0FBQ3pULE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxZQUFZLG9CQUFvQjtBQUN6QyxTQUFTLHVCQUF1QjtBQUpoQyxJQUFNLG1DQUFtQztBQU16QyxTQUFTLG1CQUEyQjtBQUNsQyxNQUFJLFFBQVEsSUFBSSxrQkFBa0I7QUFDaEMsV0FBTyxRQUFRLElBQUksaUJBQWlCLFFBQVEsT0FBTyxFQUFFO0FBQUEsRUFDdkQ7QUFDQSxRQUFNLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGlCQUFpQjtBQUM1RCxNQUFJLFdBQVcsVUFBVSxHQUFHO0FBQzFCLFVBQU0sT0FBTyxhQUFhLFlBQVksTUFBTSxFQUFFLE1BQU0sY0FBYyxJQUFJLENBQUM7QUFDdkUsUUFBSSxLQUFNLFFBQU8sb0JBQW9CLElBQUk7QUFBQSxFQUMzQztBQUNBLFNBQU87QUFDVDtBQUVBLElBQU0sZ0JBQWdCLGlCQUFpQjtBQUd2QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsSUFDQSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsRUFDL0I7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsb0JBQW9CO0FBQUEsRUFDdEQ7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
