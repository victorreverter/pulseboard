import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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
