const CLAVE = 'pjc-historial'
const MAXIMO = 3

export function obtenerHistorial() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function registrarVisita(id) {
  const historial = [id, ...obtenerHistorial().filter((visto) => visto !== id)].slice(0, MAXIMO)
  localStorage.setItem(CLAVE, JSON.stringify(historial))
  return historial
}
