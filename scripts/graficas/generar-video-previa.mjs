// Junta las imágenes de previa-<liga>-jornadaN.png ya generadas en
// scripts/graficas/salida/ (por generar-imagenes-previa.mjs) en un único
// vídeo corto tipo carrusel, con transición de fundido entre cada liga.
// Necesita ffmpeg en el PATH (con libx264 y el filtro xfade — el ffmpeg de
// los runners de GitHub Actions ya lo trae; en este entorno de desarrollo
// hace falta `apt-get install -y ffmpeg`, porque el ffmpeg que trae
// Playwright preinstalado es una build mínima solo para grabar vídeo del
// navegador, sin libx264 ni xfade).
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const DIR_SALIDA = 'scripts/graficas/salida'
const ANCHO = 1080
const ALTO = 1350
const FONDO = '0xfaf7ee'
const DUR_SLIDE = 3.2
const DUR_TRANSICION = 0.4

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

if (archivos.length < 2) {
  console.log('Menos de 2 ligas con previa esta semana, no se genera vídeo.')
  process.exit(0)
}

const inputs = archivos.flatMap((f) => ['-loop', '1', '-t', String(DUR_SLIDE), '-i', f])

const pads = archivos.map((_, i) => `[${i}:v]pad=${ANCHO}:${ALTO}:0:(${ALTO}-ih)/2:color=${FONDO}[p${i}]`)

let cadena = ''
let etiquetaAnterior = 'p0'
let offset = DUR_SLIDE - DUR_TRANSICION
for (let i = 1; i < archivos.length; i++) {
  const etiquetaSalida = i === archivos.length - 1 ? 'vout' : `v${i}`
  cadena += `[${etiquetaAnterior}][p${i}]xfade=transition=fade:duration=${DUR_TRANSICION}:offset=${offset.toFixed(2)}[${etiquetaSalida}]; `
  etiquetaAnterior = etiquetaSalida
  offset += DUR_SLIDE - DUR_TRANSICION
}

const filterComplex = [...pads, cadena.replace(/; $/, '')].join('; ')
const salida = `${DIR_SALIDA}/previa.mp4`
rmSync(salida, { force: true })

execFileSync(
  'ffmpeg',
  [
    '-y',
    ...inputs,
    '-filter_complex', filterComplex,
    '-map', '[vout]',
    '-r', '30',
    '-pix_fmt', 'yuv420p',
    '-c:v', 'libx264',
    '-crf', '20',
    '-movflags', '+faststart',
    salida,
  ],
  { stdio: 'inherit' }
)

console.log('Vídeo generado:', salida, `(${archivos.length} ligas)`)
