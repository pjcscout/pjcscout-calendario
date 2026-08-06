// Traduce los nombres de color en español que aparecen en las fichas FFCV
// (fichas.js) a valores hexadecimales, para poder dibujar el icono de la
// equipación. Cuando el nombre es un marcador sin información real (p.ej.
// "-" o "1", tal cual aparecen en algunos PDFs de origen) o no lo
// reconocemos, devolvemos null en vez de inventar un color.

const COLORES = {
  azul: '#0A5FA8',
  azules: '#0A5FA8',
  blanca: '#FFFFFF',
  blanco: '#FFFFFF',
  blancas: '#FFFFFF',
  blancos: '#FFFFFF',
  roja: '#C81E2C',
  rojo: '#C81E2C',
  rojas: '#C81E2C',
  rojos: '#C81E2C',
  negra: '#111111',
  negro: '#111111',
  negras: '#111111',
  negros: '#111111',
  amarilla: '#F7D117',
  amarillo: '#F7D117',
  amarillas: '#F7D117',
  verde: '#1E7A3C',
  verdes: '#1E7A3C',
  naranja: '#F07C1E',
  granate: '#6D1B2E',
  granates: '#6D1B2E',
  rosa: '#E85D9C',
  marino: '#16305C',
}

const COMPUESTOS = {
  blanquiazul: ['#FFFFFF', '#0A5FA8'],
  'blanca y roja': ['#FFFFFF', '#C81E2C'],
  'blanco y negro': ['#FFFFFF', '#111111'],
}

function normalizar(nombre) {
  return nombre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/**
 * Devuelve el/los color(es) hex de un nombre de color en español.
 * - Un color reconocido → string hex.
 * - Un color compuesto reconocido (p.ej. "Blanquiazul") → [hex, hex].
 * - Sin dato fiable (vacío, "-", "1", no reconocido) → null.
 */
export function colorHex(nombre) {
  if (!nombre) return null
  const clave = normalizar(nombre)
  if (COMPUESTOS[clave]) return COMPUESTOS[clave]
  if (COLORES[clave]) return COLORES[clave]
  return null
}
