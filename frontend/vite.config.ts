import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Always match backend/.env PORT so proxy never points at wrong port */
function getBackendTarget(): string {
  if (process.env.VITE_BACKEND_URL) {
    return process.env.VITE_BACKEND_URL.replace(/\/$/, '')
  }
  const backendEnv = resolve(__dirname, '../backend/.env')
  if (existsSync(backendEnv)) {
    const port = readFileSync(backendEnv, 'utf8').match(/^PORT=(\d+)/m)?.[1]
    if (port) return `http://127.0.0.1:${port}`
  }
  return 'http://127.0.0.1:8096'
}

const backendTarget = getBackendTarget()

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
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: backendTarget,
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