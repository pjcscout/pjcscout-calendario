import { chromium } from 'playwright'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

const browser = await chromium.launch()
const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' })

console.log('=== RFEF DH-G7: pestañas Goleadores y Porteros ===')
{
  const base = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=${COMPETICION_RFEF_DH_G7.codCompeticion}&CodGrupo=${COMPETICION_RFEF_DH_G7.codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=1`
  await page.goto(base, { waitUntil: 'networkidle', timeout: 20000 })

  for (const nombrePestana of ['Goleadores', 'Porteros']) {
    try {
      const enlace = page.getByText(nombrePestana, { exact: true }).first()
      await enlace.click({ timeout: 5000 })
      await page.waitForTimeout(1500)
      console.log(`--- ${nombrePestana}: url=${page.url()} ---`)
      const texto = await page.evaluate(() => document.body.innerText)
      console.log(texto.slice(0, 3000))
      console.log('...(fin, longitud total ' + texto.length + ')')
    } catch (e) {
      console.log(`--- ${nombrePestana} ERROR: ${e.message} ---`)
    }
  }

  // Intentar sacar la tabla de Goleadores en HTML estructurado, no solo texto.
  try {
    const enlace = page.getByText('Goleadores', { exact: true }).first()
    await enlace.click({ timeout: 5000 })
    await page.waitForTimeout(1500)
    const filas = await page.$$eval('table tr', (trs) =>
      trs.slice(0, 30).map((tr) => Array.from(tr.querySelectorAll('td,th')).map((td) => td.innerText.trim()))
    )
    console.log('Filas de tabla (Goleadores):', JSON.stringify(filas))
  } catch (e) {
    console.log('ERROR tabla goleadores:', e.message)
  }
}

console.log('\n=== FFCV: pestaña RANKINGS ===')
{
  const cfg = COMPETICIONES_FFCV['tercera-vi']
  const url = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`
  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
  try {
    const enlace = page.getByText('RANKINGS', { exact: true }).first()
    await enlace.click({ timeout: 5000 })
    await page.waitForTimeout(2000)
    console.log('url tras click RANKINGS:', page.url())
    const texto = await page.evaluate(() => document.body.innerText)
    console.log(texto.slice(0, 3000))
  } catch (e) {
    console.log('ERROR RANKINGS:', e.message)
  }

  console.log('\n--- FFCV: pestaña PARTIDOS, buscar enlaces reales de partido/acta ---')
  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(1500)
  const hrefsTodos = await page.$$eval('a', (as) => as.map((a) => a.getAttribute('href')).filter(Boolean))
  const hrefsUnicos = [...new Set(hrefsTodos)].filter((h) => !h.startsWith('#') && !h.startsWith('javascript'))
  console.log('Todos los hrefs (no anclas):', JSON.stringify(hrefsUnicos.slice(0, 60)))

  // A veces los partidos usan onclick en vez de <a href>, buscar elementos clicables por texto de equipo.
  const bodyTxt = await page.evaluate(() => document.body.innerText)
  console.log('\nTexto pestaña PARTIDOS (2500 chars):', bodyTxt.slice(0, 2500))
}

await browser.close()
