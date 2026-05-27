import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],

  server: {
    host: "0.0.0.0",
    port: 3000,

    // Replace this if ngrok gives a new URL
    allowedHosts: ["grandly-work-gigantic.ngrok-free.dev"],

    proxy: {
      '/api': {
        target: 'http://localhost:8096',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:8096',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  esbuild: {
    drop: ['console', 'debugger'],
  },

  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {

            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor-react';
            }

            if (
              id.includes('gsap') ||
              id.includes('framer-motion') ||
              id.includes('aos')
            ) {
              return 'vendor-animation';
            }

            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }

            return 'vendor-core';
          }
        }
      }
    }
  }
})