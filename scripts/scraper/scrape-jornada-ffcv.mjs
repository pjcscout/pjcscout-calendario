// Scraper (temporal, se borra tras usarlo) para la jornada indicada en la
// env var JORNADA (por defecto 2) de las 7 categorías FFCV: para cada
// partido ya jugado, entra de verdad (clic, no URL directa) a su ficha y
// saca goleadores+minuto, tarjetas+minuto, sustituciones (dorsal+minuto) y
// las alineaciones (titulares+suplentes con dorsal) de ambos equipos.
// Basado en el pipeline que ya funcionó para jornada 1 (scrape-jornada1-detalle.mjs
// + scrape-visitante-alineacion3.mjs), fusionado en un único paso por partido.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const JORNADA = process.env.JORNADA || '2'

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  return res.json()
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const resultadoFinal = {}
const errores = []

async function irAJornada(indexUrl) {
  await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
  await page.waitForTimeout(1500)
  try {
    await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
  } catch {}
  await page.getByText(`J.${JORNADA}`, { exact: true }).first().click({ timeout: 8000 })
  await page.waitForTimeout(1800)
}

for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  resultadoFinal[grupo] = []
  const jornadaUrl = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=${JORNADA}&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const jornadaData = await fetchJson(jornadaUrl)
  const partidosJugados = jornadaData.partidos.filter((p) => p.estado === '1')

  const indexUrl = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`

  for (const partido of partidosJugados) {
    let exito = false
    for (let intento = 1; intento <= 3 && !exito; intento++) {
      try {
        await irAJornada(indexUrl)
        await page.getByText(partido.local, { exact: true }).first().click({ timeout: 8000 })
        await page.waitForTimeout(2000)
        if (!page.url().includes('partido.php')) throw new Error('no llegó a partido.php')

        await page.waitForTimeout(500)
        const cronologia = await page.evaluate(() => {
          const goleadores = Array.from(document.querySelectorAll('#goleadores-inline .goleadores-side')).map((lado) => ({
            lado: lado.classList.contains('left') ? 'local' : 'visitante',
            goles: Array.from(lado.querySelectorAll('.gol-item')).map((it) => ({
              jugador: it.querySelector('.gol-nombre')?.textContent?.trim() || '',
              minuto: it.querySelector('.gol-min')?.textContent?.trim() || '',
            })),
          }))

          const eventos = Array.from(document.querySelectorAll('.timeline-item')).map((item) => {
            const lado = item.classList.contains('left') ? 'local' : 'visitante'
            const minuto = item.querySelector('.tl-min')?.textContent?.trim() || ''
            const tarjeta = item.querySelector('.tl-card')
            if (tarjeta) {
              const jugador = item.querySelector('.tl-player')?.textContent?.trim() || ''
              const color = tarjeta.classList.contains('yellow') ? 'amarilla' : tarjeta.classList.contains('red') ? 'roja' : 'desconocida'
              return { tipo: 'tarjeta', color, lado, minuto, jugador }
            }
            const chipIn = item.querySelector('.sub-chip.in')
            const chipOut = item.querySelector('.sub-chip.out')
            if (chipIn && chipOut) {
              return {
                tipo: 'sustitucion',
                lado,
                minuto,
                entra: { jugador: chipIn.querySelector('.tl-player')?.textContent?.trim() || '', dorsal: chipIn.querySelector('.tl-dorsal')?.textContent?.trim() || '' },
                sale: { jugador: chipOut.querySelector('.tl-player')?.textContent?.trim() || '', dorsal: chipOut.querySelector('.tl-dorsal')?.textContent?.trim() || '' },
              }
            }
            return { tipo: 'otro', lado, minuto, texto: item.textContent.trim().slice(0, 100) }
          })

          return { goleadores, eventos }
        })

        await page.getByText('Alineaciones', { exact: true }).first().click({ timeout: 5000 })
        await page.waitForTimeout(1200)
        const alineacionesTexto = await page.evaluate(() => document.body.innerText)

        const nombreVisitanteEsc = escapeRegex(partido.visitante.trim())
        const candidatos = await page.getByText(new RegExp('^' + nombreVisitanteEsc + '\\s*\\(')).all()
        let alineacionesVisitanteTexto = ''
        if (candidatos.length > 0) {
          await candidatos[0].click({ timeout: 5000 })
          await page.waitForTimeout(1200)
          alineacionesVisitanteTexto = await page.evaluate(() => document.body.innerText)
        }

        resultadoFinal[grupo].push({
          local: partido.local,
          visitante: partido.visitante,
          codacta: partido.codacta,
          resultado: partido.resultado,
          cronologia,
          alineacionesTexto,
          alineacionesVisitanteTexto,
        })
        console.log(`OK: ${grupo} - ${partido.local} vs ${partido.visitante}`)
        exito = true
      } catch (e) {
        console.log(`Fallo intento ${intento}: ${grupo} - ${partido.local} vs ${partido.visitante}: ${e.message}`)
        await page.waitForTimeout(2000)
      }
    }
    if (!exito) errores.push({ grupo, partido: `${partido.local} vs ${partido.visitante}` })
  }
  console.log(`Grupo ${grupo}: ${resultadoFinal[grupo].length} partidos procesados de ${partidosJugados.length} jugados.`)
}

writeFileSync(`jornada${JORNADA}-detalle.json`, JSON.stringify({ resultadoFinal, errores }, null, 2))
console.log('\nErrores:', errores.length)
console.log(JSON.stringify(errores, null, 2))

await browser.close()
