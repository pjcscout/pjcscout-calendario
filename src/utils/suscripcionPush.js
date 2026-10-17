// Validación de suscripciones Web Push recibidas del cliente (datos no confiables).
// Solo se aceptan endpoints HTTPS de los servicios push de los navegadores:
// web-push hace un POST a ese endpoint, así que uno arbitrario sería un SSRF.

export const MAX_BYTES_PETICION = 4096
export const MAX_SUSCRIPCIONES_POR_EQUIPO = 500

const HOSTS_PUSH_EXACTOS = new Set(['fcm.googleapis.com', 'web.push.apple.com'])
const SUFIJOS_PUSH = ['.push.services.mozilla.com', '.notify.windows.com', '.push.apple.com']

const BASE64_URL = /^[A-Za-z0-9_-]+={0,2}$/

export function endpointPushValido(endpoint) {
  if (typeof endpoint !== 'string' || endpoint.length > 1024) return false
  let url
  try {
    url = new URL(endpoint)
  } catch {
    return false
  }
  if (url.protocol !== 'https:') return false
  if (url.username || url.password || url.port) return false
  const host = url.hostname.toLowerCase()
  return HOSTS_PUSH_EXACTOS.has(host) || SUFIJOS_PUSH.some((s) => host.endsWith(s))
}

function claveValida(valor, maxLen) {
  return typeof valor === 'string' && valor.length > 0 && valor.length <= maxLen && BASE64_URL.test(valor)
}

// Devuelve una suscripción saneada (solo endpoint y keys) o null si no es válida.
export function sanearSuscripcion(subscription) {
  if (!subscription || typeof subscription !== 'object') return null
  if (!endpointPushValido(subscription.endpoint)) return null
  const { p256dh, auth } = subscription.keys ?? {}
  if (!claveValida(p256dh, 128) || !claveValida(auth, 48)) return null
  return { endpoint: subscription.endpoint, keys: { p256dh, auth } }
}
