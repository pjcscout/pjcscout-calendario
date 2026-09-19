// Comprobación rápida (temporal, se borra tras usarla): para cada categoría
// FFCV mira el campo "estado" de cada partido de la jornada indicada (env
// JORNADA, por defecto 3) y cuenta cuántos ya están jugados. Para DH7 (RFEF)
// hace lo mismo leyendo el HTML de la página de jornada (el marcador solo
// sale relleno cuando el acta está cerrada).
import { chromium } from 'playwright'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

const JORNADA = process.env.JORNADA || '3'

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

console.log(`=== Jornada ${JORNADA} — FFCV ===`)
for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=${JORNADA}&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })
  const data = await page.evaluate(() => JSON.parse(document.body.innerText))
  const jugados = data.partidos.filter((p) => p.estado === '1')
  console.log(`${grupo}: ${jugados.length}/${data.partidos.length} jugados`)
  for (const p of jugados) {
    console.log(`  ✅ ${p.local} ${p.resultado} ${p.visitante} (fecha: ${p.fecha})`)
  }
  for (const p of data.partidos.filter((p) => p.estado !== '1')) {
    console.log(`  ⏳ ${p.local} vs ${p.visitante} (fecha: ${p.fecha}, estado: ${p.estado})`)
  }
}

console.log(`\n=== Jornada ${JORNADA} — DH7 (RFEF) ===`)
const { codPrimaria, codCompeticion, codGrupo } = COMPETICION_RFEF_DH_G7
const jornadaUrl = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=${codPrimaria}&CodCompeticion=${codCompeticion}&CodGrupo=${codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=${JORNADA}`
await page.goto(jornadaUrl, { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(1000)
const dh7Texto = await page.locator('body').innerText()
console.log(dh7Texto.slice(0, 3000))

await browser.close()
