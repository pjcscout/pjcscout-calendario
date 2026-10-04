// Junta las imágenes de clasificacion-<liga>-jornadaN.png ya generadas en
// scripts/graficas/salida/ (por generar-imagenes.mjs) en un único vídeo
// corto tipo carrusel (~45s en total, repartidos entre las ligas).
import { existsSync, readFileSync } from 'node:fs'
import { generarVideoCarrusel } from './video-carrusel.mjs'

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

// Cada liga lleva su propio número de jornada (DH7 puede ir desincronizada
// de las categorías FFCV), así que se lee de datos-clasificacion.json en
// vez de asumir un único JORNADA para todas.
const datosClasificacion = JSON.parse(readFileSync('scripts/graficas/datos-clasificacion.json', 'utf8'))

const archivos = ORDEN.filter((g) => datosClasificacion[g])
  .map((g) => `${DIR_SALIDA}/clasificacion-${g}-jornada${datosClasificacion[g].jornada}.png`)
  .filter((f) => existsSync(f))

generarVideoCarrusel(archivos, `${DIR_SALIDA}/clasificacion.mp4`)
