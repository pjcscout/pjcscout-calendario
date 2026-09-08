import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const detalle = JSON.parse(readFileSync('jornada1-detalle.json', 'utf8'))

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const pendientes = []
for (const [grupo, partidos] of Object.entries(detalle.resultadoFinal)) {
  for (const p of partidos) {
    if (!p.alineacionesVisitanteTexto || !p.alineacionesVisitanteTexto.includes('Titulares')) {
      pendientes.push({ grupo, partido: p })
    }
  }
}
console.log('Pendientes:', pendientes.length)

const errores = []
for (const { grupo, partido } of pendientes) {
  const cfg = COMPETICIONES_FFCV[grupo]
  const indexUrl = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`
  let exito = false
  for (let intento = 1; intento <= 3 && !exito; intento++) {
    try {
      await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
      await page.waitForTimeout(1500)
      try {
        await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
      } catch {}
      await page.getByText('J.1', { exact: true }).first().click({ timeout: 8000 })
      await page.waitForTimeout(2000)
      await page.getByText(partido.local.trim(), { exact: false }).first().click({ timeout: 10000 })
      await page.waitForTimeout(2000)
      if (!page.url().includes('partido.php')) throw new Error('no llegó a partido.php')

      await page.getByText('Alineaciones', { exact: true }).first().click({ timeout: 5000 })
      await page.waitForTimeout(1200)

      const nombreVisitanteEsc = escapeRegex(partido.visitante.trim())
      const candidatos = await page.getByText(new RegExp('^' + nombreVisitanteEsc + '\\s*\\(')).all()
      console.log(`  candidatos toggle: ${candidatos.length}`)
      if (candidatos.length === 0) throw new Error('no se encontró el toggle del visitante')
      await candidatos[0].click({ timeout: 5000 })
      await page.waitForTimeout(1200)
      const texto = await page.evaluate(() => document.body.innerText)
      if (!texto.includes('Titulares')) throw new Error('sin Titulares tras clicar toggle')

      partido.alineacionesVisitanteTexto = texto
      console.log(`OK: ${grupo} - ${partido.local} vs ${partido.visitante}`)
      exito = true
    } catch (e) {
      console.log(`Fallo intento ${intento}: ${grupo} - ${partido.local} vs ${partido.visitante}: ${e.message}`)
      await page.waitForTimeout(2500)
    }
  }
  if (!exito) errores.push({ grupo, partido: `${partido.local} vs ${partido.visitante}` })
}

writeFileSync('jornada1-detalle.json', JSON.stringify(detalle, null, 2))
console.log('\nErrores finales:', errores.length)
console.log(JSON.stringify(errores, null, 2))

await browser.close()
