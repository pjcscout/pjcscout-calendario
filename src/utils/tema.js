const CLAVE = 'pjc-tema'
const COLOR_TEMA = { dark: '#0E100F', light: '#FAF7EE' }

export function obtenerTema() {
  return localStorage.getItem(CLAVE) === 'light' ? 'light' : 'dark'
}

function aplicarMetaThemeColor(tema) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_TEMA[tema])
}

export function alternarTema() {
  const nuevo = obtenerTema() === 'light' ? 'dark' : 'light'
  localStorage.setItem(CLAVE, nuevo)
  document.documentElement.setAttribute('data-theme', nuevo)
  aplicarMetaThemeColor(nuevo)
  return nuevo
}
