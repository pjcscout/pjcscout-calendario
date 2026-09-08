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

// Alias manuales solo para el cruce de nombres (no se guardan en ningún
// fichero de datos): casos donde el nombre corto interno no es un simple
// acortamiento del nombre oficial FFCV, sino otra forma reconocida del mismo
// club (confirmado al construir fichas.js/equipos.js para estas categorías).
const ALIAS = {
  'Fundación Valencia': ['fundacio vcf', 'fundacion vcf'],
  'Jove Español': ['español de san vicente', 'espanol de san vicente'],
}

function slug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
// Forma "compacta" (sin guiones) para que "C.F." y "CF" se comparen igual.
const compacto = (texto) => slug(texto).replace(/-/g, '')

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  return res.json()
}

const resultado = {}
const sinEmparejar = []
const crudo = {}

for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  const jornada1 = JORNADAS_POR_GRUPO[grupo].find((j) => j.numero === 1)
  if (!jornada1) continue

  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=1&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const data = await get(url)
  crudo[grupo] = data.partidos

  for (const partidoLocal of jornada1.partidos) {
    const [cLocal, cVisitante] = partidoLocal
    const candidatosLocal = [compacto(cLocal), ...(ALIAS[cLocal] || []).map(compacto)]
    const candidatosVisitante = [compacto(cVisitante), ...(ALIAS[cVisitante] || []).map(compacto)]

    const match = data.partidos.find((p) => {
      const cpLocal = compacto(p.local)
      const cpVisitante = compacto(p.visitante)
      return (
        candidatosLocal.some((c) => cpLocal.includes(c)) &&
        candidatosVisitante.some((c) => cpVisitante.includes(c))
      )
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

import { writeFileSync } from 'node:fs'
writeFileSync(
  new URL('../../resultados-j1-import.json', import.meta.url),
  JSON.stringify({ resultado, sinEmparejar }, null, 2)
)
console.log(`Total partidos importados: ${Object.keys(resultado).length}`)
console.log('Sin emparejar:', JSON.stringify(sinEmparejar))
console.log('Escrito en resultados-j1-import.json')
