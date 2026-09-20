import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

const { codPrimaria, codCompeticion, codGrupo } = COMPETICION_RFEF_DH_G7
const browser = await chromium.launch()
const page = await browser.newPage()
const url = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=${codPrimaria}&CodCompeticion=${codCompeticion}&CodGrupo=${codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=3`
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(1000)

const html = await page.evaluate(() => {
  const el = document.querySelector('table') || document.body
  return el.outerHTML
})
writeFileSync('dh7-j3-raw.html', html)
console.log('guardado, longitud:', html.length)
await browser.close()
