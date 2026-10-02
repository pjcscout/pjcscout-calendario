// Junta las imágenes de clasificacion-<liga>-jornadaN.png ya generadas en
// scripts/graficas/salida/ (por generar-imagenes.mjs) en un único vídeo
// corto tipo carrusel (~45s en total, repartidos entre las ligas).
import { existsSync } from 'node:fs'
import { generarVideoCarrusel } from './video-carrusel.mjs'

const JORNADA = parseInt(process.env.JORNADA, 10)
if (!JORNADA) throw new Error('Falta la env var JORNADA (número de jornada)')

const DIR_SALIDA = 'scripts/graficas/salida'

// Mismo orden que generar-datos.mjs; se salta cualquier liga sin clasificación
// todavía (temporada sin arrancar) o sin imagen esa jornada.
const ORDEN = [
  'tercera-vi',
  'liga-nacional',
  'cadete-autonomico',
  'cadete-pref-g3',
  'llc-nord',
  'llc-sud',
  'llc-juv-nord',
  'llc-juv-sud',
  'dh-g7',
]

const archivos = ORDEN.map((g) => `${DIR_SALIDA}/clasificacion-${g}-jornada${JORNADA}.png`).filter((f) => existsSync(f))

generarVideoCarrusel(archivos, `${DIR_SALIDA}/clasificacion.mp4`)
