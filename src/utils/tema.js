const CLAVE = 'pjc-tema'

export function obtenerTema() {
  return localStorage.getItem(CLAVE) === 'light' ? 'light' : 'dark'
}

export function alternarTema() {
  const nuevo = obtenerTema() === 'light' ? 'dark' : 'light'
  localStorage.setItem(CLAVE, nuevo)
  document.documentElement.setAttribute('data-theme', nuevo)
  return nuevo
}
