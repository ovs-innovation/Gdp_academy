import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const __dirname = dirname(fileURLToPath(import.meta.url))

const NEGOTIATED_PNGS = new Set([
  'dance.png',
  'combo.png',
  'anubhav.png',
  'onlineclass.png',
  'svc-hiphop.png',
  'svc-stage.png',
])

function negotiatePng(publicDir: string) {
  return function negotiatePngMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const pathname = decodeURIComponent((req.url || '').split('?')[0] || '')
    const name = pathname.replace(/^\/+/, '')
    if (!NEGOTIATED_PNGS.has(name)) return next()

    const accept = String(req.headers.accept || '')
    const ext = accept.includes('image/avif')
      ? '.avif'
      : accept.includes('image/webp')
        ? '.webp'
        : ''
    if (!ext) return next()

    const file = resolve(publicDir, name.replace(/\.png$/i, ext))
    if (!existsSync(file)) return next()

    const type = ext === '.avif' ? 'image/avif' : 'image/webp'
    res.statusCode = 200
    res.setHeader('Content-Type', type)
    res.setHeader('Content-Length', statSync(file).size)
    res.setHeader('Vary', 'Accept')
    res.setHeader('Cache-Control', 'no-cache')
    createReadStream(file).pipe(res)
  }
}

function negotiatePngPlugin() {
  return {
    name: 'negotiate-png',
    configureServer(server: { config: { publicDir: string }; middlewares: { use: (fn: ReturnType<typeof negotiatePng>) => void } }) {
      server.middlewares.use(negotiatePng(server.config.publicDir))
    },
    configurePreviewServer(server: { config: { publicDir: string }; middlewares: { use: (fn: ReturnType<typeof negotiatePng>) => void } }) {
      server.middlewares.use(negotiatePng(server.config.publicDir))
    },
  }
}

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
    negotiatePngPlugin(),
    react(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],

  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: true,

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
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['swiper', 'react-toastify'],
        },
      },
    },
  }
})
