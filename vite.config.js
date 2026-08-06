import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icons/pwa-192.png', 'icons/pwa-512.png', 'icons/maskable-512.png'],
      manifest: {
        lang: 'es',
        name: 'PJC Scout · Mi Calendario',
        short_name: 'Mi Calendario',
        description: 'Sigue a tu equipo de Tercera Federación y División de Honor Juvenil jornada a jornada, gratis.',
        theme_color: '#0E100F',
        background_color: '#0E100F',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
