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
  await page.waitForTimeout(500)
} catch {}

console.log('=== Texto completo tras cargar (jornada por defecto) ===')
console.log(await page.evaluate(() => document.body.innerText))

console.log('\n=== Buscando elemento clicable "J.1" ===')
const candidatosJ1 = await page.locator('text=/^J\\.1$/').all()
console.log('Coincidencias exactas /^J.1$/:', candidatosJ1.length)
const candidatosJ1b = await page.getByText('J.1').all()
console.log('Coincidencias getByText("J.1") (parcial):', candidatosJ1b.length)
for (let i = 0; i < candidatosJ1b.length; i++) {
  const txt = await candidatosJ1b[i].innerText().catch(() => '(err)')
  console.log(`  [${i}] "${txt}"`)
}

if (candidatosJ1b.length > 0) {
  await candidatosJ1b[0].click({ timeout: 5000 }).catch((e) => console.log('click error:', e.message))
  await page.waitForTimeout(2000)
}

console.log('\n=== Texto completo tras intentar clicar J.1 ===')
console.log(await page.evaluate(() => document.body.innerText))

await browser.close()
