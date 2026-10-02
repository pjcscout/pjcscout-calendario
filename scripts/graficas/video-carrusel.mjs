// Helper compartido: junta una lista de imágenes en un vídeo carrusel con
// transición de fundido entre cada una, ajustando el tiempo por slide para
// que el vídeo entero dure ~45s (tiempo para poder leer cada slide) sea
// cual sea el número de ligas esa semana. Necesita ffmpeg en el PATH, con
// libx264 y el filtro xfade (ver el paso dedicado en scrape-horarios.yml y
// scrape-jornada.yml — ni los runners de GitHub Actions ni este entorno de
// desarrollo lo traen instalado por defecto).
import { rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const ANCHO = 1080
const FONDO = '0xfaf7ee'
const DURACION_TOTAL = 45
const DUR_TRANSICION = 0.4

function altoDe(archivo) {
  const salida = execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=height',
    '-of', 'csv=p=0',
    archivo,
  ])
  return parseInt(salida.toString().trim(), 10)
}

export function generarVideoCarrusel(archivos, salida) {
  if (archivos.length < 2) {
    console.log('Menos de 2 slides, no se genera vídeo.')
    return
  }

  // El lienzo tiene que ser al menos tan alto como la slide más alta (si no,
  // ffmpeg falla al intentar "pad" con un tamaño menor que el de origen).
  // Siempre par, porque libx264 lo exige.
  const alto = Math.max(...archivos.map(altoDe)) + 1 & ~1

  // total = n*dur - (n-1)*transición  =>  dur = (total + (n-1)*transición) / n
  const n = archivos.length
  const durSlide = (DURACION_TOTAL + (n - 1) * DUR_TRANSICION) / n

  const inputs = archivos.flatMap((f) => ['-loop', '1', '-t', durSlide.toFixed(2), '-i', f])
  const pads = archivos.map((_, i) => `[${i}:v]pad=${ANCHO}:${alto}:0:(${alto}-ih)/2:color=${FONDO}[p${i}]`)

  let cadena = ''
  let etiquetaAnterior = 'p0'
  let offset = durSlide - DUR_TRANSICION
  for (let i = 1; i < n; i++) {
    const etiquetaSalida = i === n - 1 ? 'vout' : `v${i}`
    cadena += `[${etiquetaAnterior}][p${i}]xfade=transition=fade:duration=${DUR_TRANSICION}:offset=${offset.toFixed(2)}[${etiquetaSalida}]; `
    etiquetaAnterior = etiquetaSalida
    offset += durSlide - DUR_TRANSICION
  }

  const filterComplex = [...pads, cadena.replace(/; $/, '')].join('; ')
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

  console.log('Vídeo generado:', salida, `(${n} slides, ${durSlide.toFixed(2)}s/slide, ~${DURACION_TOTAL}s total)`)
}
