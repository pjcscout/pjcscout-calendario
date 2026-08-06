import { JORNADAS as JORNADAS_TERCERA_VI } from '../data/calendario.js'
import { JORNADAS as JORNADAS_DH7 } from '../data/calendarioDH7.js'
import { JORNADAS as JORNADAS_LLC_SUD } from '../data/calendarioLLCSud.js'
import { JORNADAS as JORNADAS_LLC_NORD } from '../data/calendarioLLCNord.js'
import { RESULTADOS, idPartido } from '../data/resultados.js'

const CALENDARIOS = {
  'tercera-vi': JORNADAS_TERCERA_VI,
  'dh-g7': JORNADAS_DH7,
  'llc-sud': JORNADAS_LLC_SUD,
  'llc-nord': JORNADAS_LLC_NORD,
  // 'cadete-autonomico' y 'liga-nacional' no tienen calendario todavía.
}

export function tieneCalendario(grupo) {
  return Boolean(CALENDARIOS[grupo])
}

/**
 * Devuelve, para un equipo y grupo dados, la lista de jornadas con su rival,
 * si juega en casa o fuera, si esa jornada descansa (número impar de equipos),
 * y el resultado/eventos si ya se han cargado en resultados.js (null/[] hasta
 * que arranque la liga). Si el grupo todavía no tiene calendario, devuelve null.
 */
export function fixturesDeEquipo(nombreEquipo, grupo) {
  const jornadas = CALENDARIOS[grupo]
  if (!jornadas) return null
  return jornadas.map((jornada) => {
    const partido = jornada.partidos.find(
      (p) => p[0] === nombreEquipo || p[1] === nombreEquipo
    )
    if (!partido) {
      return { jornada: jornada.numero, fecha: jornada.fecha, bye: true }
    }
    const esLocal = partido[0] === nombreEquipo
    const rival = esLocal ? partido[1] : partido[0]
    const partidoInfo = RESULTADOS[idPartido(grupo, jornada.numero, partido[0], partido[1])]
    return {
      jornada: jornada.numero,
      fecha: jornada.fecha,
      rival,
      esLocal,
      resultado: partidoInfo?.resultado ?? null,
      eventos: partidoInfo?.eventos ?? [],
    }
  })
}
