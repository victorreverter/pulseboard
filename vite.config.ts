import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isGhp = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGhp ? '/pulseboard/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/espn': {
        target: 'https://site.api.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/espn/, ''),
      },
      '/api/core-espn': {
        target: 'http://sports.core.api.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/core-espn/, ''),
      },
    },
  },
})
