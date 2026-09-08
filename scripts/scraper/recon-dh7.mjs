// Reconocimiento (temporal, se borra tras usarse): resultados de jornada 1
// de División de Honor Juvenil Grupo 7 (RFEF, marcadores.rfef.es). Los
// marcadores se renderizan con una fuente de iconos ofuscada (clase "fa-N"
// que no se corresponde con el dígito real), así que no se pueden leer del
// texto/HTML: se hace una captura visual y se leen a mano.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const URL =
  'https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=33836116&CodGrupo=33836123&CodTemporada=22&CodJornada=1'

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 700, height: 1400 },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)

await page.screenshot({ path: 'recon-dh7.jpg', fullPage: true, type: 'jpeg', quality: 40 })

await browser.close()
console.log('OK, screenshot guardado')
