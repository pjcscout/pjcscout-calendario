// Pasada final: recarga fresca por partido (lo que dio 0 errores) pero
// clicando explícitamente la pestaña Cronología antes de leer los eventos
// (en la pasada anterior no estaba activa por defecto y salió vacía).
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  return res.json()
}

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const resultadoFinal = {}
const errores = []

async function extraerCronologia() {
  try {
    await page.getByText('Cronología', { exact: true }).first().click({ timeout: 5000 })
    await page.waitForTimeout(1200)
  } catch (e) {
    return { goleadores: [], eventos: [], errorTab: e.message }
  }
  return page.evaluate(() => {
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
}

for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  resultadoFinal[grupo] = []
  const jornadaUrl = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=1&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const jornadaData = await fetchJson(jornadaUrl)
  const partidosJugados = jornadaData.partidos.filter((p) => p.estado === '1')
  const indexUrl = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`

  for (const partido of partidosJugados) {
    try {
      await page.goto(indexUrl, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForTimeout(1000)
      try {
        await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
      } catch {}
      await page.getByText('J.1', { exact: true }).first().click({ timeout: 8000 })
      await page.waitForTimeout(1500)
      await page.getByText(partido.local.trim(), { exact: false }).first().click({ timeout: 10000 })
      await page.waitForTimeout(1800)

      if (!page.url().includes('partido.php')) {
        errores.push({ grupo, partido: `${partido.local} vs ${partido.visitante}`, error: 'no llegó a partido.php' })
        continue
      }

      const cronologia = await extraerCronologia()

      let alineacionesTexto = ''
      try {
        await page.getByText('Alineaciones', { exact: true }).first().click({ timeout: 5000 })
        await page.waitForTimeout(900)
        alineacionesTexto = await page.evaluate(() => document.body.innerText)
      } catch {}

      let plantillasTexto = ''
      try {
        await page.getByText('Plantillas', { exact: true }).first().click({ timeout: 5000 })
        await page.waitForTimeout(900)
        plantillasTexto = await page.evaluate(() => document.body.innerText)
      } catch {}

      resultadoFinal[grupo].push({
        local: partido.local,
        visitante: partido.visitante,
        codacta: partido.codacta,
        resultado: partido.resultado,
        cronologia,
        alineacionesTexto,
        plantillasTexto,
      })
      console.log(`OK: ${grupo} - ${partido.local} vs ${partido.visitante} (eventos: ${cronologia.eventos.length})`)
    } catch (e) {
      errores.push({ grupo, partido: `${partido.local} vs ${partido.visitante}`, error: e.message })
    }
  }
}

writeFileSync('jornada1-detalle.json', JSON.stringify({ resultadoFinal, errores }, null, 2))
console.log('\nErrores:', errores.length)
console.log(JSON.stringify(errores, null, 2))

await browser.close()
