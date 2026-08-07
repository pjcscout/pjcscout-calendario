const CLAVE = 'pjc-favoritos'

export function obtenerFavoritos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function esFavorito(id) {
  return obtenerFavoritos().includes(id)
}

export function alternarFavorito(id) {
  const favoritos = obtenerFavoritos()
  const nuevos = favoritos.includes(id)
    ? favoritos.filter((favoritoId) => favoritoId !== id)
    : [...favoritos, id]
  localStorage.setItem(CLAVE, JSON.stringify(nuevos))
  return nuevos
}
