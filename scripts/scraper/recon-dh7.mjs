// Reconocimiento (temporal, se borra tras usarse): resultados de jornada 1
// de División de Honor Juvenil Grupo 7 (RFEF, marcadores.rfef.es).
// Vuelca el texto visible de la página de jornada 1 para poder parsear los
// marcadores en un segundo paso.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const URL =
  'https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=33836116&CodGrupo=33836123&CodTemporada=22&CodJornada=1'

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)

const texto = await page.locator('body').innerText()
const html = await page.content()

writeFileSync('recon-dh7-texto.txt', texto)
writeFileSync('recon-dh7-html.txt', html)

await browser.close()
console.log('OK, texto len:', texto.length, 'html len:', html.length)
