import { equiposPorGrupo } from '../data/equipos.js'
import { jornadasDeGrupo } from './fixtures.js'
import { RESULTADOS, idPartido } from '../data/resultados.js'

/**
 * Clasificación de un grupo a partir de calendario.js/... + resultados.js.
 * Mientras resultados.js esté vacío (antes de que arranque la liga), todos
 * los equipos aparecen con 0 partidos jugados, en orden alfabético.
 * Devuelve null si el grupo no tiene calendario todavía.
 */
export function clasificacionDeGrupo(grupo) {
  const jornadas = jornadasDeGrupo(grupo)
  if (!jornadas) return null

  const tabla = new Map()
  for (const equipo of equiposPorGrupo(grupo)) {
    tabla.set(equipo.nombre, {
      equipo,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      pts: 0,
    })
  }

  for (const jornada of jornadas) {
    for (const [local, visitante] of jornada.partidos) {
      const partidoInfo = RESULTADOS[idPartido(grupo, jornada.numero, local, visitante)]
      if (!partidoInfo?.resultado) continue

      const filaLocal = tabla.get(local)
      const filaVisitante = tabla.get(visitante)
      if (!filaLocal || !filaVisitante) continue

      const { golesLocal, golesVisitante } = partidoInfo.resultado
      filaLocal.pj++
      filaVisitante.pj++
      filaLocal.gf += golesLocal
      filaLocal.gc += golesVisitante
      filaVisitante.gf += golesVisitante
      filaVisitante.gc += golesLocal

      if (golesLocal > golesVisitante) {
        filaLocal.pg++
        filaLocal.pts += 3
        filaVisitante.pp++
      } else if (golesLocal < golesVisitante) {
        filaVisitante.pg++
        filaVisitante.pts += 3
        filaLocal.pp++
      } else {
        filaLocal.pe++
        filaVisitante.pe++
        filaLocal.pts++
        filaVisitante.pts++
      }
    }
  }

  return [...tabla.values()]
    .map((fila) => ({ ...fila, dg: fila.gf - fila.gc }))
    .sort(
      (a, b) =>
        b.pts - a.pts ||
        b.dg - a.dg ||
        b.gf - a.gf ||
        a.equipo.nombre.localeCompare(b.equipo.nombre)
    )
}
