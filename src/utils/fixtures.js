import { JORNADAS as JORNADAS_TERCERA_VI } from '../data/calendario.js'
import { JORNADAS as JORNADAS_DH7 } from '../data/calendarioDH7.js'
import { RESULTADOS, idPartido } from '../data/resultados.js'

const CALENDARIOS = {
  'tercera-vi': JORNADAS_TERCERA_VI,
  'dh-g7': JORNADAS_DH7,
}

/**
 * Devuelve, para un equipo y grupo dados, la lista de jornadas con su rival,
 * si juega en casa o fuera, si esa jornada descansa (número impar de equipos),
 * y el resultado/eventos si ya se han cargado en resultados.js (null/[] hasta
 * que arranque la liga).
 */
export function fixturesDeEquipo(nombreEquipo, grupo = 'tercera-vi') {
  const jornadas = CALENDARIOS[grupo] || CALENDARIOS['tercera-vi']
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
