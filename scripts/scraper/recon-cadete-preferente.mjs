// Reconocimiento (temporal): encuentra el cod_competicion de "Lliga Preferent
// Cadet" (= Cadete Preferente), el cod_grupo de su Grupo III, y descarga el
// calendario completo de la temporada (todas las jornadas) para esa
// competición usando la API pública de la FFCV.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const COD_TEMPORADA = '22'

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

await page.goto('https://ffcv.es/competiciones/', { waitUntil: 'domcontentloaded', timeout: 45000 })
await page.waitForTimeout(1500)

const competiciones = await page.evaluate(() => {
  const sel = document.getElementById('sel-competicion')
  return sel ? [...sel.options].map((o) => ({ value: o.value, text: o.textContent.trim() })) : []
})

const competicionCadetePref = competiciones.find((c) => /preferent.*cadet|cadet.*preferent/i.test(c.text))

const resultado = { competiciones, competicionCadetePref }

if (competicionCadetePref) {
  const grupos = await page.evaluate(async (codCompeticion) => {
    const res = await fetch(`https://ffcv.es/competiciones/api/filtros/grupos_fetch.php?cod_competicion=${codCompeticion}`)
    return res.json()
  }, competicionCadetePref.value)
  resultado.grupos = grupos
}

writeFileSync('recon-cadete-preferente.json', JSON.stringify(resultado, null, 2))
await browser.close()
console.log('Competición Cadete Preferente:', JSON.stringify(competicionCadetePref))
console.log('Grupos:', JSON.stringify(resultado.grupos))
