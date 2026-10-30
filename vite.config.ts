import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH force le sous-chemin ; sur GitLab Pages, il se déduit de l'URL réelle du site.
function resolveBase() {
  const { BASE_PATH, CI_PAGES_URL } = process.env
  const base = BASE_PATH ?? (CI_PAGES_URL ? new URL(CI_PAGES_URL).pathname : '/')
  return base.endsWith('/') ? base : `${base}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: resolveBase(),
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
