// El intento anterior clicó el enlace de cabecera al club (misma texto, .first()
// se equivocó) en vez del selector de equipo DENTRO de la pestaña Alineaciones,
// que tiene formato "<Equipo> (1-4-4-2)". Usamos una regex que exige el
// paréntesis justo después del nombre para acertar el elemento correcto.
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const detalle = JSON.parse(readFileSync('jornada1-detalle.json', 'utf8'))

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const errores = []

for (const [grupo, partidos] of Object.entries(detalle.resultadoFinal)) {
  const cfg = COMPETICIONES_FFCV[grupo]
  const indexUrl = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`

  for (const partido of partidos) {
    let exito = false
    for (let intento = 1; intento <= 2 && !exito; intento++) {
      try {
        await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
        await page.waitForTimeout(1200)
        try {
          await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
        } catch {}
        await page.getByText('J.1', { exact: true }).first().click({ timeout: 8000 })
        await page.waitForTimeout(1500)
        await page.getByText(partido.local.trim(), { exact: false }).first().click({ timeout: 10000 })
        await page.waitForTimeout(1800)
        if (!page.url().includes('partido.php')) throw new Error('no llegó a partido.php')

        await page.getByText('Alineaciones', { exact: true }).first().click({ timeout: 5000 })
        await page.waitForTimeout(1000)

        const nombreVisitanteEsc = escapeRegex(partido.visitante.trim())
        const toggleVisitante = page.getByText(new RegExp('^' + nombreVisitanteEsc + '\\s*\\(')).first()
        await toggleVisitante.click({ timeout: 5000 })
        await page.waitForTimeout(1000)
        const texto = await page.evaluate(() => document.body.innerText)

        if (!texto.includes('Titulares')) throw new Error('no parece la alineación (sin "Titulares")')

        partido.alineacionesVisitanteTexto = texto
        console.log(`OK: ${grupo} - ${partido.local} vs ${partido.visitante}`)
        exito = true
      } catch (e) {
        console.log(`Fallo intento ${intento}: ${grupo} - ${partido.local} vs ${partido.visitante}: ${e.message}`)
        await page.waitForTimeout(2000)
      }
    }
    if (!exito) errores.push({ grupo, partido: `${partido.local} vs ${partido.visitante}` })
  }
}

writeFileSync('jornada1-detalle.json', JSON.stringify(detalle, null, 2))
console.log('\nErrores:', errores.length)
console.log(JSON.stringify(errores, null, 2))

await browser.close()
