// Reconocimiento (temporal): descarga el texto completo del acta de los 8
// partidos de jornada 1 de DH7 (goles, tarjetas, alineaciones/convocados).
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const CODACTAS = ['70694242', '70694238', '70694243', '70694239', '70694236', '70694241', '70694240', '70694237']

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const resultado = {}
for (const codActa of CODACTAS) {
  const url = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpPartido?cod_primaria=1000120&CodActa=${codActa}`
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1000)
  resultado[codActa] = await page.locator('body').innerText()
  console.log('OK', codActa, resultado[codActa].length)
}

await browser.close()
writeFileSync('recon-dh7-todas-actas.json', JSON.stringify(resultado))
console.log('listo')
