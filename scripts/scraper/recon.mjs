// Tercera pasada: rfef.isquad.es/indexcompeticiones.php resultó ser una
// pantalla de login ("Accede al sistema"), no el portal público de
// resultados. FFCV tenía resultadosffcv.isquad.es como portal público
// aparte del de gestión; probamos el mismo patrón de nombre para RFEF, y
// alternativas razonables.
import { chromium } from 'playwright'

const CANDIDATOS = [
  'https://resultadosrfef.isquad.es/',
  'https://rfef.isquad.es/',
  'https://competiciones.rfef.es/',
  'https://www.rfef.es/competiciones',
  'https://resultados.rfef.es/',
]

function log(seccion, datos) {
  console.log(`\n=== ${seccion} ===`)
  console.log(typeof datos === 'string' ? datos : JSON.stringify(datos, null, 2))
}

const browser = await chromium.launch()

for (const url of CANDIDATOS) {
  const page = await browser.newPage()
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    log(`${url}`, {
      status: res?.status(),
      urlFinal: page.url(),
      title: await page.title(),
    })
    const selects = await page.$$eval('select', (els) => els.length)
    const textoBody = await page.evaluate(() => document.body.innerText.slice(0, 400))
    log(`${url} - detalle`, { numSelects: selects, textoBody })
  } catch (e) {
    log(`${url} - ERROR`, e.message)
  }
  await page.close()
}

await browser.close()
console.log('\n=== FIN RECON 3 ===')
