// Reintento de los partidos que fallaron por timeout de red simple en la
// pasada final (page.goto Timeout), con más margen de tiempo entre reintentos.
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  return res.json()
}

const previo = JSON.parse(readFileSync('jornada1-detalle.json', 'utf8'))
const resultadoFinal = previo.resultadoFinal
const erroresPrevios = previo.errores
const erroresNuevos = []

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const partidosPorGrupo = {}
for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=1&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const data = await fetchJson(url)
  partidosPorGrupo[grupo] = data.partidos.filter((p) => p.estado === '1')
}

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

for (const fallo of erroresPrevios) {
  const grupo = fallo.grupo
  const cfg = COMPETICIONES_FFCV[grupo]
  const partido = partidosPorGrupo[grupo]?.find((p) => `${p.local} vs ${p.visitante}` === fallo.partido)
  if (!partido) {
    erroresNuevos.push({ ...fallo, error: 'no se encontró el partido en la relectura de la API' })
    continue
  }
  if (resultadoFinal[grupo]?.some((p) => p.codacta === partido.codacta)) continue

  let exito = false
  for (let intento = 1; intento <= 3 && !exito; intento++) {
    try {
      const indexUrl = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`
      await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await page.waitForTimeout(1500)
      try {
        await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
      } catch {}
      await page.getByText('J.1', { exact: true }).first().click({ timeout: 10000 })
      await page.waitForTimeout(2000)
      await page.getByText(partido.local.trim(), { exact: false }).first().click({ timeout: 10000 })
      await page.waitForTimeout(2200)

      if (!page.url().includes('partido.php')) {
        throw new Error('no llegó a partido.php')
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
      console.log(`OK (intento ${intento}): ${grupo} - ${fallo.partido}`)
      exito = true
    } catch (e) {
      console.log(`Fallo intento ${intento} para ${fallo.partido}: ${e.message}`)
      await page.waitForTimeout(3000)
    }
  }
  if (!exito) {
    erroresNuevos.push({ grupo, partido: fallo.partido, error: 'fallo tras 3 intentos' })
  }
}

writeFileSync('jornada1-detalle.json', JSON.stringify({ resultadoFinal, errores: erroresNuevos }, null, 2))
console.log('\nTotal errores tras reintento 2:', erroresNuevos.length)
console.log(JSON.stringify(erroresNuevos, null, 2))

await browser.close()
