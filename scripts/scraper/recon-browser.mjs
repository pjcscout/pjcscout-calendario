// Reconocimiento temporal 5: usar un navegador real (Playwright/Chromium) para
// ver si la página de resultados de FFCV enlaza a un "acta" con goleadores, y
// si RFEF (DH7) renderiza su jornada tras aceptar el aviso de cookies vía JS.
// Se borra después de usarlo.
import { chromium } from 'playwright'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

const browser = await chromium.launch()
const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' })

const cfg = COMPETICIONES_FFCV['tercera-vi']

console.log('=== FFCV: página humana de resultados (varias rutas candidatas) ===')
const rutasFfcv = [
  `https://ffcv.es/competiciones/resultados.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=1`,
  `https://ffcv.es/competiciones/partidos.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=1`,
  `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`,
  `https://ffcv.es/competiciones/`,
]
for (const url of rutasFfcv) {
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    console.log(`--- ${url} -> status ${res?.status()} url final: ${page.url()} ---`)
    const enlacesActa = await page.$$eval('a', (as) =>
      as
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && /acta/i.test(h))
        .slice(0, 10)
    )
    console.log('enlaces con "acta":', JSON.stringify(enlacesActa))
    const textoVisible = await page.evaluate(() => document.body.innerText.slice(0, 800))
    console.log('texto visible (800 chars):', textoVisible)
  } catch (e) {
    console.log(`--- ${url} ERROR: ${e.message} ---`)
  }
}

console.log('\n=== RFEF DH-G7: jornada 1 con navegador real ===')
{
  const url = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=${COMPETICION_RFEF_DH_G7.codCompeticion}&CodGrupo=${COMPETICION_RFEF_DH_G7.codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=1`
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    console.log(`status ${res?.status()}, url final: ${page.url()}`)
    // Intentar aceptar cualquier aviso de cookies visible.
    for (const texto of ['Aceptar', 'ACEPTAR', 'Accept', 'De acuerdo', 'Aceptar todas']) {
      const boton = page.getByText(texto, { exact: false }).first()
      if (await boton.count()) {
        await boton.click({ timeout: 3000 }).catch(() => {})
        await page.waitForTimeout(1000)
        break
      }
    }
    await page.waitForTimeout(1500)
    const textoVisible = await page.evaluate(() => document.body.innerText.slice(0, 3000))
    console.log('texto visible tras intentar aceptar cookies:', textoVisible)
  } catch (e) {
    console.log('ERROR', e.message)
  }
}

await browser.close()
