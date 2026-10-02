// Junta las imágenes de previa-<liga>-jornadaN.png ya generadas en
// scripts/graficas/salida/ (por generar-imagenes-previa.mjs) en un único
// vídeo corto tipo carrusel (~45s en total, repartidos entre las ligas).
import { existsSync, readFileSync } from 'node:fs'
import { generarVideoCarrusel } from './video-carrusel.mjs'

const DIR_SALIDA = 'scripts/graficas/salida'

// Mismo orden que generar-datos-previa.mjs; se salta cualquier liga cuya
// imagen no exista esta semana (p. ej. División de Honor si no juega, o
// cualquier otra que no tuviera partidos).
const ORDEN = [
  'tercera-vi',
  'liga-nacional',
  'cadete-autonomico',
  'llc-nord',
  'llc-sud',
  'llc-juv-nord',
  'llc-juv-sud',
  'dh-g7',
]

const datosPrevia = JSON.parse(readFileSync('scripts/graficas/datos-previa.json', 'utf8'))
const jornadaPorGrupo = Object.fromEntries(Object.entries(datosPrevia).map(([g, d]) => [g, d.jornada]))

const archivos = ORDEN.filter((g) => jornadaPorGrupo[g] !== undefined)
  .map((g) => `${DIR_SALIDA}/previa-${g}-jornada${jornadaPorGrupo[g]}.png`)
  .filter((f) => existsSync(f))

generarVideoCarrusel(archivos, `${DIR_SALIDA}/previa.mp4`)
