// Reconocimiento temporal 6d: la SPA de FFCV redirige a inicio si se entra
// directamente por URL al partido (sin estado de navegación interna). Hay
// que llegar clicando de verdad: index -> PARTIDOS -> "Ver detalles" del
// partido concreto -> pestañas Cronología/Alineaciones/Plantillas.
import { chromium } from 'playwright'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const cfg = COMPETICIONES_FFCV['tercera-vi']
// C.D. Acero 0-1 Crevillente Deportivo, jornada 1, codacta 26470658
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

// Rechazar el banner de cookies si aparece, para que no tape nada.
try {
  await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
} catch {}

// Buscar el bloque del partido por nombre de los dos equipos y clicar su
// "Ver detalles" (puede haber varios, cada partido tiene el suyo).
const bloque = page.locator(`text=${EQUIPO_LOCAL}`).locator('xpath=ancestor::*[.//text()[contains(., "Ver detalles")]][1]')
console.log('Bloques candidatos con', EQUIPO_LOCAL, ':', await page.locator(`text=${EQUIPO_LOCAL}`).count())

// Alternativa más simple y robusta: recorrer todos los "Ver detalles" y
// mirar el texto de su contenedor cercano hasta encontrar el que menciona
// ambos equipos.
const detalles = page.getByText('Ver detalles', { exact: true })
const total = await detalles.count()
console.log('Total "Ver detalles" en la página:', total)

let indiceElegido = -1
for (let i = 0; i < total; i++) {
  const contenedor = detalles.nth(i).locator('xpath=ancestor::*[position()<=6]')
  const texto = await contenedor.first().innerText().catch(() => '')
  if (texto.includes(EQUIPO_LOCAL) && texto.includes(EQUIPO_VISITANTE)) {
    indiceElegido = i
    console.log(`Match ${i} contiene ambos equipos. Texto: ${texto.slice(0, 200)}`)
    break
  }
}

if (indiceElegido === -1) {
  console.log('No se encontró el bloque exacto, probando el primero como fallback.')
  indiceElegido = 0
}

await detalles.nth(indiceElegido).click({ timeout: 10000 })
await page.waitForTimeout(2500)
console.log('URL tras clicar Ver detalles:', page.url())
console.log('Titulo:', await page.title())

for (const pestana of ['Cronología', 'Alineaciones', 'Plantillas', 'Información del partido']) {
  try {
    const tab = page.getByText(pestana, { exact: true }).first()
    await tab.click({ timeout: 5000 })
    await page.waitForTimeout(1500)
    console.log(`\n=== Pestaña: ${pestana} ===`)
    const texto = await page.evaluate(() => document.body.innerText)
    console.log(texto.slice(0, 4000))
  } catch (e) {
    console.log(`--- ${pestana} ERROR: ${e.message} ---`)
  }
}

await browser.close()
