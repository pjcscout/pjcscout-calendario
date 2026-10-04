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

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// La FFCV ha empezado a mostrar anuncios interstitial de pantalla completa
// (Google "Vignette", se ve por el fragmento #google_vignette en la URL)
// tras navegar, que tapan la página varios segundos e interceptan cualquier
// clic. Se intenta cerrarlos con los botones de cierre habituales y, si no
// aparece ninguno, simplemente se espera a que se cierren solos.
async function esquivarAnuncio() {
  const selectoresCierre = [
    '#dismiss-button',
    '[aria-label="Close ad"]',
    '[aria-label="Cerrar anuncio"]',
    '[aria-label="Saltar anuncio"]',
    '.dismiss-button',
    '.ns-anchor-close-button',
  ]
  for (const sel of selectoresCierre) {
    try {
      await page.locator(sel).first().click({ timeout: 1500 })
      await page.waitForTimeout(500)
    } catch {}
  }
  await page.waitForTimeout(4000)
}

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

// La API de la FFCV exige una sesión de navegador válida: un fetch() suelto
// (sin haber visitado antes el index) devuelve {"sesion_ok":"0"} en vez del
// listado de partidos. Por eso se visita primero el index (que establece la
// sesión/cookies) y se pide el JSON desde dentro del propio navegador, para
// que viaje con esa misma sesión. También reintenta ante el "modo
// degradación" ocasional (503, cuerpo de texto en vez de JSON).
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

const resultadoFinal = {}
const errores = []

async function irAJornada(indexUrl) {
  await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
  await page.waitForTimeout(1500)
  try {
    await page.getByText('Rechazar', { exact: true }).first().click({ timeout: 3000 })
  } catch {}
  await esquivarAnuncio()
  await page.getByText(`J.${JORNADA}`, { exact: true }).first().click({ timeout: 20000 })
  await page.waitForTimeout(1800)
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 })
  } catch {}
  await esquivarAnuncio()
}

try {
for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  resultadoFinal[grupo] = []
  const indexUrl = `https://ffcv.es/competiciones/index.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}`
  const jornadaUrl = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=${JORNADA}&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  let jornadaData
  try {
    jornadaData = await fetchJsonConSesion(jornadaUrl, indexUrl)
  } catch (e) {
    console.log(`Grupo ${grupo}: no se pudo obtener el listado de partidos, se salta este grupo. ${e.message}`)
    errores.push({ grupo, partido: '(listado de la jornada)', error: e.message })
    continue
  }
  if (!Array.isArray(jornadaData?.partidos)) {
    console.log(`Grupo ${grupo}: respuesta sin "partidos" (${JSON.stringify(jornadaData).slice(0, 200)}), se salta este grupo.`)
    errores.push({ grupo, partido: '(listado de la jornada)', error: 'respuesta sin "partidos"' })
    continue
  }
  const partidosJugados = jornadaData.partidos.filter((p) => p.estado === '1')

  for (const partido of partidosJugados) {
    let exito = false
    for (let intento = 1; intento <= 3 && !exito; intento++) {
      try {
        await irAJornada(indexUrl)
        await page.getByText(partido.local, { exact: true }).first().click({ timeout: 25000 })
        await page.waitForTimeout(2000)
        await esquivarAnuncio()
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

        await page.getByText('Alineaciones', { exact: true }).first().click({ timeout: 20000 })
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
        try {
          const extracto = await page.evaluate(() => document.body.innerText.slice(0, 400))
          console.log(`  Diagnóstico: url=${page.url()} | texto="${extracto.replace(/\s+/g, ' ')}"`)
        } catch {}
        await page.waitForTimeout(2000)
      }
    }
    if (!exito) errores.push({ grupo, partido: `${partido.local} vs ${partido.visitante}` })
  }
  console.log(`Grupo ${grupo}: ${resultadoFinal[grupo].length} partidos procesados de ${partidosJugados.length} jugados.`)
}
} finally {
  // Guarda lo conseguido hasta el momento aunque un grupo posterior haya
  // fallado del todo (p. ej. la FFCV entra en modo degradación a mitad de
  // la jornada) — mejor una jornada parcial que perderlo todo por un grupo.
  writeFileSync(`jornada${JORNADA}-detalle.json`, JSON.stringify({ resultadoFinal, errores }, null, 2))
  console.log('\nErrores:', errores.length)
  console.log(JSON.stringify(errores, null, 2))
  await browser.close()
}
