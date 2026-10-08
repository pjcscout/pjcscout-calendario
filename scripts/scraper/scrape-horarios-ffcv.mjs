// Descarga fecha+hora confirmada de la PRÓXIMA jornada (por fecha, no por un
// número fijo) de cada una de las 7 categorías FFCV, directamente de la API
// de resultados (el mismo endpoint que usa scrape-jornada-ffcv.mjs, que ya
// trae "fecha" y "hora" para partidos todavía no jugados).
//
// La API de la FFCV exige una sesión de navegador válida: un fetch() suelto
// (sin visitar antes el index) devuelve {"sesion_ok":"0"} en vez del listado
// de partidos (mismo problema que scrape-jornada-ffcv.mjs). Por eso se abre
// un navegador, se visita el index de cada grupo y se pide el JSON desde
// dentro del propio navegador, para que viaje con esa misma sesión.
//
// Cada categoría calcula su propia "próxima jornada" por fecha en vez de
// recibir un número fijo por fuera, porque no siempre coinciden entre sí
// (ver generar-datos-previa.mjs, que hace el mismo cálculo).
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'
import { jornadasDeGrupo } from '../../src/utils/fixtures.js'

const hoy = new Date().toISOString().slice(0, 10)

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

async function fetchJsonConSesion(url, indexUrl, intentos = 5) {
  let ultimoError
  for (let intento = 1; intento <= intentos; intento++) {
    try {
      await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
      await page.waitForTimeout(1000)
      try {
        await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
      } catch {}
      const texto = await page.evaluate(async (u) => {
        const res = await fetch(u, { credentials: 'include' })
        return await res.text()
      }, url)
      const json = JSON.parse(texto)
      if (json?.sesion_ok === '0') throw new Error(`sesión no válida: ${texto.slice(0, 200)}`)
      return json
    } catch (e) {
      ultimoError = e
      console.log(`Respuesta no válida (intento ${intento}/${intentos}), reintentando en 30s:`, e.message)
      await new Promise((r) => setTimeout(r, 30000))
    }
  }
  throw new Error(`Respuesta no válida de ${url}: ${ultimoError.message}`)
}

const salida = {}
try {
  for (const grupo of Object.keys(COMPETICIONES_FFCV)) {
    const siguiente = jornadasDeGrupo(grupo).find((j) => j.fecha >= hoy)
    if (!siguiente) continue // temporada terminada para esta categoría

    const cfg = COMPETICIONES_FFCV[grupo]
    const indexUrl = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`
    const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=${siguiente.numero}&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`

    let data
    try {
      data = await fetchJsonConSesion(url, indexUrl)
    } catch (e) {
      console.log(`Grupo ${grupo}: no se pudo obtener el listado de partidos, se salta este grupo. ${e.message}`)
      continue
    }
    if (!Array.isArray(data?.partidos)) {
      console.log(`Grupo ${grupo}: respuesta sin "partidos" (${JSON.stringify(data).slice(0, 200)}), se salta este grupo.`)
      continue
    }

    salida[grupo] = {
      jornada: siguiente.numero,
      partidos: data.partidos.map((p) => ({
        local: p.local,
        visitante: p.visitante,
        fecha: p.fecha,
        hora: p.hora,
      })),
    }
  }
} finally {
  await browser.close()
}

writeFileSync('horarios-proxima-jornada.json', JSON.stringify(salida, null, 2))
console.log('Horarios volcados:', Object.entries(salida).map(([g, d]) => `${g} (j${d.jornada})`).join(', '))
