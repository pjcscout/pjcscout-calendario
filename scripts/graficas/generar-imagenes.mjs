// Renderiza, a partir de scripts/graficas/datos-resultados.json y
// datos-clasificacion.json (generados por generar-datos.mjs), una imagen de
// resultados por cada liga y una de clasificación por cada liga —ambas por
// separado, como pidió el usuario—, usando los escudos reales servidos en
// public/escudos.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { chromium } from 'playwright'

const JORNADA = parseInt(process.env.JORNADA, 10)
if (!JORNADA) throw new Error('Falta la env var JORNADA (número de jornada)')

const DIR_SALIDA = 'scripts/graficas/salida'
const TMP_HTML_RESULTADOS = 'public/_tmp-grafica-resultados.html'
const TMP_HTML_CLASIFICACION = 'public/_tmp-grafica-clasificacion.html'

mkdirSync(DIR_SALIDA, { recursive: true })

const datosResultados = JSON.parse(readFileSync('scripts/graficas/datos-resultados.json', 'utf8'))
const datosClasificacion = JSON.parse(readFileSync('scripts/graficas/datos-clasificacion.json', 'utf8'))

const plantillaResultadosLiga = readFileSync('scripts/graficas/plantilla-resultados-liga.html', 'utf8')
const plantillaClasificacion = readFileSync('scripts/graficas/plantilla-clasificacion.html', 'utf8')

// En GitHub Actions, `npx playwright install --with-deps chromium` deja el
// binario que playwright espera y no hace falta indicar la ruta. En este
// entorno de desarrollo el chromium preinstalado vive en otra ruta/versión.
const rutaChromium = process.env.PLAYWRIGHT_CHROMIUM_PATH
const browser = await chromium.launch(rutaChromium ? { executablePath: rutaChromium } : {})
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } })

// --- Resultados: una imagen independiente por cada liga ---
for (const [grupoId, datos] of Object.entries(datosResultados.grupos)) {
  const datosGrupo = { ...datos, jornada: datosResultados.jornada, fechaTexto: datosResultados.fechaTexto }
  const html = plantillaResultadosLiga.replace('__GRUPO__', JSON.stringify(datosGrupo))
  writeFileSync(TMP_HTML_RESULTADOS, html)
  await page.setViewportSize({ width: 1080, height: 1080 })
  await page.goto(`file://${process.cwd()}/${TMP_HTML_RESULTADOS}`)
  await page.waitForTimeout(300)
  const alto = await page.evaluate(() => document.body.scrollHeight)
  await page.setViewportSize({ width: 1080, height: alto })
  await page.screenshot({ path: `${DIR_SALIDA}/resultados-${grupoId}-jornada${JORNADA}.png` })
  console.log('Resultados:', grupoId, '->', `resultados-${grupoId}-jornada${JORNADA}.png`)
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
