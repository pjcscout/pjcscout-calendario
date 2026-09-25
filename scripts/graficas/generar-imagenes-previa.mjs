// Renderiza, a partir de scripts/graficas/datos-previa.json (generado por
// generar-datos-previa.mjs), una imagen de previa por cada liga que tenga
// partidos el próximo fin de semana —por separado, igual que resultados y
// clasificación—, usando los escudos reales servidos en public/escudos.
//
// Va en un script aparte de generar-imagenes.mjs porque la previa no tiene
// un único número de JORNADA para las 8 competiciones (cada liga lleva su
// propio calendario y puede llevar un número de jornada distinto).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { chromium } from 'playwright'

const DIR_SALIDA = 'scripts/graficas/salida'
const TMP_HTML_PREVIA = 'public/_tmp-grafica-previa.html'

mkdirSync(DIR_SALIDA, { recursive: true })

const datosPrevia = JSON.parse(readFileSync('scripts/graficas/datos-previa.json', 'utf8'))
const plantillaPrevia = readFileSync('scripts/graficas/plantilla-previa-liga.html', 'utf8')

const rutaChromium = process.env.PLAYWRIGHT_CHROMIUM_PATH
const browser = await chromium.launch(rutaChromium ? { executablePath: rutaChromium } : {})
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } })

for (const [grupoId, datos] of Object.entries(datosPrevia)) {
  const html = plantillaPrevia.replace('__GRUPO__', JSON.stringify(datos))
  writeFileSync(TMP_HTML_PREVIA, html)
  await page.setViewportSize({ width: 1080, height: 1080 })
  await page.goto(`file://${process.cwd()}/${TMP_HTML_PREVIA}`)
  await page.waitForTimeout(300)
  const alto = await page.evaluate(() => document.body.scrollHeight)
  await page.setViewportSize({ width: 1080, height: alto })
  await page.screenshot({ path: `${DIR_SALIDA}/previa-${grupoId}-jornada${datos.jornada}.png` })
  console.log('Previa:', grupoId, '->', `previa-${grupoId}-jornada${datos.jornada}.png`)
}

await browser.close()
rmSync(TMP_HTML_PREVIA, { force: true })
