// Reconocimiento temporal 4: construir las entradas RESULTADOS de jornada 1
// para las 7 categorías FFCV, cruzando los nombres cortos que ya usan los
// calendarios locales (calendario*.js) con los nombres oficiales largos que
// devuelve la API pública de FFCV. Imprime el objeto listo para pegar en
// resultados.js. Se borra después de usarlo.
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'
import { idPartido } from '../../src/data/resultados.js'

import { JORNADAS as J_TERCERA } from '../../src/data/calendario.js'
import { JORNADAS as J_LLC_NORD } from '../../src/data/calendarioLLCNord.js'
import { JORNADAS as J_LLC_SUD } from '../../src/data/calendarioLLCSud.js'
import { JORNADAS as J_LLC_JUV_NORD } from '../../src/data/calendarioLLCJuvNord.js'
import { JORNADAS as J_LLC_JUV_SUD } from '../../src/data/calendarioLLCJuvSud.js'
import { JORNADAS as J_CADETE } from '../../src/data/calendarioCadete.js'
import { JORNADAS as J_LIGA_NACIONAL } from '../../src/data/calendarioLigaNacional.js'

const JORNADAS_POR_GRUPO = {
  'tercera-vi': J_TERCERA,
  'llc-nord': J_LLC_NORD,
  'llc-sud': J_LLC_SUD,
  'llc-juv-nord': J_LLC_JUV_NORD,
  'llc-juv-sud': J_LLC_JUV_SUD,
  'cadete-autonomico': J_CADETE,
  'liga-nacional': J_LIGA_NACIONAL,
}

function slug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  return res.json()
}

const resultado = {}
const sinEmparejar = []

for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  const jornada1 = JORNADAS_POR_GRUPO[grupo].find((j) => j.numero === 1)
  if (!jornada1) continue

  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=1&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const data = await get(url)

  for (const partidoLocal of jornada1.partidos) {
    const [cLocal, cVisitante] = partidoLocal
    const sLocal = slug(cLocal)
    const sVisitante = slug(cVisitante)

    const match = data.partidos.find((p) => {
      const sPLocal = slug(p.local)
      const sPVisitante = slug(p.visitante)
      return sPLocal.includes(sLocal) && sPVisitante.includes(sVisitante)
    })

    if (!match) {
      sinEmparejar.push({ grupo, cLocal, cVisitante })
      continue
    }
    if (match.estado !== '1') continue // acta no cerrada todavía

    const [golesLocal, golesVisitante] = match.resultado.split('-').map((n) => parseInt(n.trim(), 10))
    if (Number.isNaN(golesLocal) || Number.isNaN(golesVisitante)) continue

    const id = idPartido(grupo, 1, cLocal, cVisitante)
    resultado[id] = { resultado: { golesLocal, golesVisitante }, eventos: [] }
  }
}

console.log('=== RESULTADOS jornada 1 (pegar en resultados.js) ===')
console.log(JSON.stringify(resultado, null, 2))
console.log(`\nTotal partidos importados: ${Object.keys(resultado).length}`)
console.log('\n=== Sin emparejar (revisar manualmente) ===')
console.log(JSON.stringify(sinEmparejar, null, 2))
