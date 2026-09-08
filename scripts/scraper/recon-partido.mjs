// Reconocimiento temporal 6: usar la URL real de ficha de partido que
// encontró el usuario navegando a mano:
//   https://ffcv.es/competiciones/partidos/partido.php?cod_partido=<codacta>
// Pestañas: Información del partido / Clasificación / Plantillas /
// Alineaciones / Cronología. Vemos qué datos estructurados hay en cada una
// (goleadores+minuto, tarjetas, sustituciones, convocatoria, minutos jugados).
import { chromium } from 'playwright'

const CODACTA_EJEMPLO = '26470658' // C.D. Acero 0-1 Crevillente Deportivo, tercera-vi jornada 1

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

page.on('response', (res) => {
  if (res.status() >= 300 && res.status() < 400) {
    console.log('REDIRECT', res.status(), res.url(), '->', res.headers()['location'])
  }
})
page.on('framenavigated', (frame) => {
  if (frame === page.mainFrame()) console.log('NAVEGACION a', frame.url())
})

// Primero visitamos la app (no un .php suelto) para que cargue el shell/JS y
// tengamos cookies de sesión, igual que haría un navegador real siguiendo
// enlaces internos en vez de pegar la URL directamente.
await page.goto('https://ffcv.es/competiciones/', { waitUntil: 'networkidle', timeout: 20000 })
await page.waitForTimeout(1000)

const url = `https://ffcv.es/competiciones/partidos/partido.php?cod_partido=${CODACTA_EJEMPLO}#cronologia`
console.log('Navegando a:', url)
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })
await page.waitForTimeout(3000)
console.log('URL final:', page.url())
console.log('Titulo:', await page.title())

for (const pestana of ['Cronología', 'Alineaciones', 'Plantillas', 'Información del partido']) {
  try {
    const tab = page.getByText(pestana, { exact: true }).first()
    await tab.click({ timeout: 5000 })
    await page.waitForTimeout(1500)
    console.log(`\n=== Pestaña: ${pestana} (texto visible) ===`)
    const texto = await page.evaluate(() => document.body.innerText)
    console.log(texto.slice(0, 4000))
  } catch (e) {
    console.log(`--- ${pestana} ERROR: ${e.message} ---`)
  }
}

// Cronología: intentar sacar estructura por iconos/clases (gol, tarjeta, sustitución).
try {
  const tab = page.getByText('Cronología', { exact: true }).first()
  await tab.click({ timeout: 5000 })
  await page.waitForTimeout(1500)
  const html = await page.evaluate(() => {
    const posibles = document.querySelectorAll('[class*="cronolog"], [class*="event"], [class*="timeline"]')
    return Array.from(posibles)
      .slice(0, 5)
      .map((el) => el.outerHTML.slice(0, 500))
  })
  console.log('\n=== Cronología: HTML de contenedores candidatos ===')
  console.log(JSON.stringify(html, null, 2))
} catch (e) {
  console.log('ERROR estructura cronologia:', e.message)
}

await browser.close()
