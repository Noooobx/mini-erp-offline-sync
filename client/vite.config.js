import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // This tells it to cache ALL your graphics and code!
      },
      manifest: {
        name: 'Mini ERP Offline',
        short_name: 'MiniERP',
        description: 'Offline-First ERP System',
        theme_color: '#000000',
        background_color: '#000000',
        display: "standalone" // This makes it look like a real mobile app (no browser search bar)
      }
    })
  ]
})