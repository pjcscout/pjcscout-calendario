import { JORNADAS as JORNADAS_TERCERA_VI } from '../data/calendario.js'
import { JORNADAS as JORNADAS_DH7 } from '../data/calendarioDH7.js'

const CALENDARIOS = {
  'tercera-vi': JORNADAS_TERCERA_VI,
  'dh-g7': JORNADAS_DH7,
}

/**
 * Devuelve, para un equipo y grupo dados, la lista de jornadas con su rival,
 * si juega en casa o fuera, o si esa jornada descansa (número impar de equipos).
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
    return { jornada: jornada.numero, fecha: jornada.fecha, rival, esLocal, resultado: null }
  })
}
