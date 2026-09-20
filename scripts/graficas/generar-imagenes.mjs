// Renderiza, a partir de scripts/graficas/datos-resultados.json y
// datos-clasificacion.json (generados por generar-datos.mjs), la gráfica de
// resultados (una imagen única con las 8 ligas apiladas, partida en trozos
// de máximo ~4000px de alto porque SendUserFile rechaza PNGs muy altos) y
// una gráfica de clasificación por cada liga (por separado, como pidió el
// usuario), usando los escudos reales servidos en public/escudos.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { chromium } from 'playwright'

const JORNADA = parseInt(process.env.JORNADA, 10)
if (!JORNADA) throw new Error('Falta la env var JORNADA (número de jornada)')

const ALTO_MAXIMO = 4000
const DIR_SALIDA = 'scripts/graficas/salida'
const TMP_HTML_RESULTADOS = 'public/_tmp-grafica-resultados.html'
const TMP_HTML_CLASIFICACION = 'public/_tmp-grafica-clasificacion.html'

mkdirSync(DIR_SALIDA, { recursive: true })

const datosResultados = JSON.parse(readFileSync('scripts/graficas/datos-resultados.json', 'utf8'))
const datosClasificacion = JSON.parse(readFileSync('scripts/graficas/datos-clasificacion.json', 'utf8'))

const plantillaResultados = readFileSync('scripts/graficas/plantilla-resultados.html', 'utf8')
const plantillaClasificacion = readFileSync('scripts/graficas/plantilla-clasificacion.html', 'utf8')

// En GitHub Actions, `npx playwright install --with-deps chromium` deja el
// binario que playwright espera y no hace falta indicar la ruta. En este
// entorno de desarrollo el chromium preinstalado vive en otra ruta/versión.
const rutaChromium = process.env.PLAYWRIGHT_CHROMIUM_PATH
const browser = await chromium.launch(rutaChromium ? { executablePath: rutaChromium } : {})
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } })

// --- Resultados: una única imagen con las 8 ligas, partida si hace falta ---
const htmlResultados = plantillaResultados
  .replace('__JORNADA__', String(JORNADA))
  .replace('__FECHA__', datosResultados.fechaTexto)
  .replace('__DATOS__', JSON.stringify(datosResultados))
writeFileSync(TMP_HTML_RESULTADOS, htmlResultados)
await page.goto(`file://${process.cwd()}/${TMP_HTML_RESULTADOS}`)
await page.waitForTimeout(300)
const alturaTotal = await page.evaluate(() => document.body.scrollHeight)
await page.setViewportSize({ width: 1080, height: alturaTotal })

if (alturaTotal <= ALTO_MAXIMO) {
  await page.screenshot({ path: `${DIR_SALIDA}/resultados-jornada${JORNADA}.png` })
  console.log('Resultados: 1 imagen ->', `resultados-jornada${JORNADA}.png`, `(${alturaTotal}px)`)
} else {
  const numPartes = Math.ceil(alturaTotal / ALTO_MAXIMO)
  const altoPorParte = Math.ceil(alturaTotal / numPartes)
  for (let i = 0; i < numPartes; i++) {
    const y = i * altoPorParte
    const alto = Math.min(altoPorParte, alturaTotal - y)
    await page.screenshot({
      path: `${DIR_SALIDA}/resultados-jornada${JORNADA}-parte${i + 1}.png`,
      clip: { x: 0, y, width: 1080, height: alto },
    })
  }
  console.log('Resultados:', numPartes, 'imágenes (altura total', alturaTotal, 'px)')
}

// --- Clasificación: una imagen independiente por cada liga ---
for (const [grupoId, datos] of Object.entries(datosClasificacion)) {
  const html = plantillaClasificacion.replace('__GRUPO__', JSON.stringify(datos))
  writeFileSync(TMP_HTML_CLASIFICACION, html)
  await page.setViewportSize({ width: 1080, height: 1080 })
  await page.goto(`file://${process.cwd()}/${TMP_HTML_CLASIFICACION}`)
  await page.waitForTimeout(300)
  const alto = await page.evaluate(() => document.body.scrollHeight)
  await page.setViewportSize({ width: 1080, height: alto })
  await page.screenshot({ path: `${DIR_SALIDA}/clasificacion-${grupoId}-jornada${JORNADA}.png` })
  console.log('Clasificación:', grupoId, '->', `clasificacion-${grupoId}-jornada${JORNADA}.png`)
}

await browser.close()
rmSync(TMP_HTML_RESULTADOS, { force: true })
rmSync(TMP_HTML_CLASIFICACION, { force: true })
