import { chromium } from 'playwright'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const cfg = COMPETICIONES_FFCV['tercera-vi']

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
await page.getByText('J.1', { exact: true }).first().click({ timeout: 5000 })
await page.waitForTimeout(2000)
await page.getByText('C.D. Acero', { exact: true }).first().click({ timeout: 5000 })
await page.waitForTimeout(2000)

const tab = page.getByText('Cronología', { exact: true }).first()
await tab.click({ timeout: 5000 })
await page.waitForTimeout(1500)

console.log('=== HTML del contenedor de Cronología ===')
const html = await page.evaluate(() => {
  // Buscar el contenedor que tenga varios hijos con minutos "N'"
  const candidatos = Array.from(document.querySelectorAll('body *')).filter((el) => {
    const t = el.textContent || ''
    return /\d+'/.test(t) && el.children.length > 3 && el.children.length < 60
  })
  // Quedarnos con el más pequeño que aún contenga varios eventos (más específico).
  candidatos.sort((a, b) => a.innerHTML.length - b.innerHTML.length)
  return candidatos.slice(0, 3).map((el) => el.outerHTML)
})
for (const h of html) {
  console.log('--- candidato ---')
  console.log(h.slice(0, 6000))
  console.log('--- fin candidato (longitud total ' + h.length + ') ---\n')
}

await browser.close()
