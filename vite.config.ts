import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoStaticFilesPlugin } from './vite-plugins/seoStaticFiles.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl =
    env.VITE_SITE_URL ||
    (mode === 'production'
      ? 'https://readybikesshop.vitamina2work.com'
      : 'http://localhost:5173')

  return {
    plugins: [react(), tailwindcss(), seoStaticFilesPlugin(siteUrl)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    allowedHosts: true,
    host: true,
    port: 3000,
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  }
})
