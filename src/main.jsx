import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import '@fontsource/barlow-condensed/500.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/barlow-condensed/800.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import './styles/index.css'

// Registro explícito del Service Worker: sin esto, vite-plugin-pwa cae en un
// registro mínimo (solo `navigator.serviceWorker.register(...)`) que no
// comprueba nunca si hay una versión nueva. Como esta es una SPA que nunca
// hace una navegación real (todo es routing por cliente), el navegador
// tampoco vuelve a comprobarlo por su cuenta: una pestaña abierta podía
// quedarse días viendo datos viejos aunque hubiera despliegues nuevos. Con
// `immediate: true` + `registerType: 'autoUpdate'` (en vite.config.js), en
// cuanto detecta una versión nueva activada recarga la página sola; el
// intervalo fuerza además la comprobación aunque la pestaña lleve rato abierta.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    setInterval(() => registration.update(), 60 * 1000)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
