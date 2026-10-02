// Reconocimiento temporal: vuelca el HTML (ya renderizado, con navegador de
// verdad porque la RFEF exige aceptar cookies antes de servir contenido)
// de la página de jornada de la RFEF para DH7, para ver el formato exacto
// del onmouseover con fecha/hora/lugar de cada partido.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

const JORNADA = process.env.JORNADA || '4'
const { codPrimaria, codCompeticion, codGrupo } = COMPETICION_RFEF_DH_G7

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const jornadaUrl = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=${codPrimaria}&CodCompeticion=${codCompeticion}&CodGrupo=${codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=${JORNADA}`
await page.goto(jornadaUrl, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)

const html = await page.content()
writeFileSync('recon-horarios-dh7.html', html)
console.log('Guardado, longitud:', html.length)

const matches = [...html.matchAll(/showhint\(([^;]*?)\)(?=["'])/g)].slice(0, 5)
console.log('Ejemplos de showhint encontrados:', matches.length)
for (const m of matches) console.log(m[0].slice(0, 400))

await browser.close()
