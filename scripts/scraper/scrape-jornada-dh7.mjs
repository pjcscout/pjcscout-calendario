// Scraper (temporal, se borra tras usarlo) para la jornada indicada en la
// env var JORNADA (por defecto 2) de DH7 (RFEF): saca los CodActa de la
// página de jornada y descarga el texto completo de cada acta.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

const JORNADA = process.env.JORNADA || '2'
const { codPrimaria, codCompeticion, codGrupo } = COMPETICION_RFEF_DH_G7

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const jornadaUrl = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=${codPrimaria}&CodCompeticion=${codCompeticion}&CodGrupo=${codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=${JORNADA}`
await page.goto(jornadaUrl, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)

const enlaces = await page.evaluate(() => [...document.querySelectorAll('a[href*="CodActa="]')].map((a) => a.getAttribute('href')))
const codActas = [...new Set(enlaces.map((href) => new URL(href, 'https://marcadores.rfef.es').searchParams.get('CodActa')))].filter(Boolean)
console.log('CodActa encontrados:', codActas.length, codActas)

const resultado = {}
for (const codActa of codActas) {
  const url = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpPartido?cod_primaria=${codPrimaria}&CodActa=${codActa}`
  let ok = false
  for (let intento = 1; intento <= 3 && !ok; intento++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(1000)
      resultado[codActa] = await page.locator('body').innerText()
      console.log('OK', codActa, resultado[codActa].length)
      ok = true
    } catch (e) {
      console.log('Fallo intento', intento, codActa, e.message)
      await page.waitForTimeout(2000)
    }
  }
}

await browser.close()
writeFileSync(`jornada${JORNADA}-dh7-actas.json`, JSON.stringify(resultado))
console.log('listo,', Object.keys(resultado).length, 'actas descargadas')
