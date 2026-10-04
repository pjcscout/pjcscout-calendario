// Junta las imágenes de resultados-<liga>-jornadaN.png ya generadas en
// scripts/graficas/salida/ (por generar-imagenes.mjs) en un único vídeo
// corto tipo carrusel (~45s en total, repartidos entre las ligas).
import { existsSync, readFileSync } from 'node:fs'
import { generarVideoCarrusel } from './video-carrusel.mjs'

const DIR_SALIDA = 'scripts/graficas/salida'

// Mismo orden que generar-datos.mjs; se salta cualquier liga sin imagen esa
// jornada (sin partidos jugados todavía, o la categoría no existe esa semana).
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

// Cada liga lleva su propio número de jornada (DH7 puede ir desincronizada
// de las categorías FFCV), así que se lee de datos-resultados.json en vez
// de asumir un único JORNADA para todas.
const datosResultados = JSON.parse(readFileSync('scripts/graficas/datos-resultados.json', 'utf8'))

const archivos = ORDEN.filter((g) => datosResultados.grupos[g])
  .map((g) => `${DIR_SALIDA}/resultados-${g}-jornada${datosResultados.grupos[g].jornada}.png`)
  .filter((f) => existsSync(f))

generarVideoCarrusel(archivos, `${DIR_SALIDA}/resultados.mp4`)
