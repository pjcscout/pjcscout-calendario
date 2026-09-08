// Reconocimiento (temporal): saca los CodActa de los 8 partidos de jornada 1
// de DH7 desde la página de jornada (los enlaces "Ver acta" no tienen texto,
// son solo icono, así que hay que leer el href directamente).
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

const codActas = await page.evaluate(() => {
  const enlaces = [...document.querySelectorAll('a[href*="CodActa="]')]
  return enlaces.map((a) => a.getAttribute('href'))
})

writeFileSync('recon-dh7-codactas.json', JSON.stringify(codActas, null, 2))

await browser.close()
console.log('OK, encontrados', codActas.length, 'enlaces de acta')
console.log(JSON.stringify(codActas))
