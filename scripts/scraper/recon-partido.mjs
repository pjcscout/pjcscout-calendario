// Reconocimiento temporal 6e: seleccionar Jornada 1 explícitamente (la vista
// por defecto ya saltó a Jornada 2 porque hoy es posterior a J1), inspeccionar
// el DOM real de cada tarjeta de partido para clicar el "Ver detalles" correcto,
// y extraer Cronología/Alineaciones/Plantillas de un partido YA jugado.
import { chromium } from 'playwright'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const cfg = COMPETICIONES_FFCV['tercera-vi']
const EQUIPO_LOCAL = 'C.D. Acero'
const EQUIPO_VISITANTE = 'Crevillente Deportivo'

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const url = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`
await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
await page.waitForTimeout(1500)
try {
  await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
} catch {}

// Ir explícitamente a Jornada 1.
try {
  await page.getByText('J.1', { exact: true }).first().click({ timeout: 5000 })
  await page.waitForTimeout(1500)
  console.log('Click en J.1 hecho.')
} catch (e) {
  console.log('No se pudo clicar J.1:', e.message)
}

// Inspeccionar el DOM alrededor del primer "Ver detalles" para calibrar el
// contenedor correcto de cada tarjeta de partido.
const primerBoton = page.getByText('Ver detalles', { exact: true }).first()
for (const nivel of [1, 2, 3, 4]) {
  try {
    const html = await primerBoton
      .locator(`xpath=ancestor::*[position()=${nivel}]`)
      .first()
      .evaluate((el) => el.outerHTML.slice(0, 400))
    console.log(`--- ancestor nivel ${nivel} ---`)
    console.log(html)
  } catch (e) {
    console.log(`ancestor nivel ${nivel} error:`, e.message)
  }
}

// Recorrer cada "Ver detalles" mirando SOLO el texto de su tarjeta cercana
// (nivel 3, ajustar si el diagnóstico de arriba dice otra cosa).
const detalles = page.getByText('Ver detalles', { exact: true })
const total = await detalles.count()
console.log('\nTotal "Ver detalles" en Jornada 1:', total)

let indiceElegido = -1
for (let i = 0; i < total; i++) {
  const contenedor = detalles.nth(i).locator('xpath=ancestor::*[position()=3]')
  const texto = await contenedor.first().innerText().catch(() => '')
  console.log(`[${i}]`, texto.replace(/\n/g, ' | ').slice(0, 150))
  if (texto.includes(EQUIPO_LOCAL) && texto.includes(EQUIPO_VISITANTE)) {
    indiceElegido = i
  }
}

if (indiceElegido === -1) {
  console.log('\nNo se encontró el partido exacto por nivel 3, abortando extracción de pestañas.')
} else {
  console.log(`\nUsando índice ${indiceElegido}`)
  await detalles.nth(indiceElegido).click({ timeout: 10000 })
  await page.waitForTimeout(2500)
  console.log('URL tras clicar Ver detalles:', page.url())

  for (const pestana of ['Cronología', 'Alineaciones', 'Plantillas']) {
    try {
      const tab = page.getByText(pestana, { exact: true }).first()
      await tab.click({ timeout: 5000 })
      await page.waitForTimeout(1500)
      console.log(`\n=== Pestaña: ${pestana} ===`)
      const texto = await page.evaluate(() => document.body.innerText)
      console.log(texto.slice(0, 4500))
    } catch (e) {
      console.log(`--- ${pestana} ERROR: ${e.message} ---`)
    }
  }
}

await browser.close()
