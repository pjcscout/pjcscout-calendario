const VAPID_PUBLIC_KEY =
  'BD-9Ju_lmoruECOYwNjcw3nGT5rvQ4IdB4IGXU_y97xLo-rvY23qWFK9n8w0NMkQm0VEUx6CO5Nc5UPqBhYFwhY'
const CLAVE_LOCAL = 'pjc-avisos'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

function obtenerActivos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_LOCAL) ?? '[]')
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

function marcarLocal(equipoId, activo) {
  const activos = obtenerActivos().filter((id) => id !== equipoId)
  localStorage.setItem(CLAVE_LOCAL, JSON.stringify(activo ? [...activos, equipoId] : activos))
}

export function avisosActivos(equipoId) {
  return obtenerActivos().includes(equipoId)
}

export function soportaNotificaciones() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function activarAvisos(equipoId) {
  const permiso = await Notification.requestPermission()
  if (permiso !== 'granted') return false

  const registro = await navigator.serviceWorker.ready
  const subscription =
    (await registro.pushManager.getSubscription()) ??
    (await registro.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }))

  const respuesta = await fetch('/.netlify/functions/guardar-suscripcion', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ equipoId, subscription: subscription.toJSON() }),
  })
  if (!respuesta.ok) return false

  marcarLocal(equipoId, true)
  return true
}

export async function desactivarAvisos(equipoId) {
  const registro = await navigator.serviceWorker.ready
  const subscription = await registro.pushManager.getSubscription()

  if (subscription) {
    await fetch('/.netlify/functions/guardar-suscripcion', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ equipoId, subscription: subscription.toJSON(), desuscribir: true }),
    })
  }

  marcarLocal(equipoId, false)
  return true
}
