// Descarga fecha+hora confirmada de la próxima jornada de DH7 (RFEF) y la
// añade a horarios-proxima-jornada.json (si ya existe, de scrape-horarios-ffcv.mjs;
// si no, lo crea), para que aplicar-horarios.mjs la fusione junto con las 7
// categorías FFCV. Hace falta navegador de verdad: la RFEF exige aceptar
// cookies antes de servir contenido, un fetch() normal no basta.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { chromium } from 'playwright'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'
import { jornadasDeGrupo } from '../../src/utils/fixtures.js'

const hoy = new Date().toISOString().slice(0, 10)
const siguiente = jornadasDeGrupo('dh-g7').find((j) => j.fecha >= hoy)

const SALIDA = 'horarios-proxima-jornada.json'
const total = existsSync(SALIDA) ? JSON.parse(readFileSync(SALIDA, 'utf8')) : {}

if (!siguiente) {
  console.log('DH7: temporada terminada, no hay próxima jornada.')
  writeFileSync(SALIDA, JSON.stringify(total, null, 2))
  process.exit(0)
}

const { codPrimaria, codCompeticion, codGrupo } = COMPETICION_RFEF_DH_G7
const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const jornadaUrl = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=${codPrimaria}&CodCompeticion=${codCompeticion}&CodGrupo=${codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=${siguiente.numero}`
await page.goto(jornadaUrl, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)

// Cada partido es un <table width="100%"> dentro de #divResultados_, con el
// equipo local (.font_widgetL h4), fecha+hora (dos <span class="horario">)
// y el equipo visitante (.font_widgetV h4), en ese orden.
const partidos = await page.evaluate(() => {
  const contenedor = document.querySelector('#divResultados_')
  if (!contenedor) return []
  return [...contenedor.querySelectorAll('table[width="100%"]')]
    .map((tabla) => {
      const local = tabla.querySelector('.font_widgetL h4')?.textContent.replace(/\s+/g, ' ').trim()
      const visitante = tabla.querySelector('.font_widgetV h4')?.textContent.replace(/\s+/g, ' ').trim()
      const horarios = [...tabla.querySelectorAll('.horario')].map((s) => s.textContent.trim())
      return { local, visitante, fecha: horarios[0] || null, hora: horarios[1] || null }
    })
    .filter((p) => p.local && p.visitante)
})

await browser.close()

// La RFEF da la fecha como DD-MM-AAAA; aplicar-horarios.mjs espera el mismo
// formato DD/MM/AAAA que ya usa el bloque de la FFCV.
total['dh-g7'] = {
  jornada: siguiente.numero,
  partidos: partidos.map((p) => ({ ...p, fecha: p.fecha ? p.fecha.replace(/-/g, '/') : null })),
}

writeFileSync(SALIDA, JSON.stringify(total, null, 2))
console.log('DH7 jornada', siguiente.numero, '-', partidos.length, 'partidos con horario')
