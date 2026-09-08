import { equiposPorGrupo } from '../data/equipos.js'
import { jornadasDeGrupo } from './fixtures.js'
import { RESULTADOS, idPartido } from '../data/resultados.js'

/**
 * Máximo goleador de cada equipo de un grupo, a partir de los eventos "gol"
 * guardados en resultados.js. Solo se cuentan los partidos que ya tienen
 * resultado cargado. Devuelve un array (uno por equipo) ordenado igual que
 * equiposPorGrupo, cada uno con su lista de goleadores ordenada de más a
 * menos goles (empatados por orden alfabético).
 *
 * Nota: la fuente oficial (FFCV) no publica asistencias en el acta pública
 * del partido, así que esa estadística no se puede calcular sin inventar
 * datos — no se incluye aquí a propósito.
 */
export function pichichisPorEquipo(grupo) {
  const jornadas = jornadasDeGrupo(grupo)
  if (!jornadas) return []

  const golesPorJugador = new Map() // `${equipoId}__${jugador}` -> { jugador, equipoId, goles }
  for (const jornada of jornadas) {
    for (const [local, visitante] of jornada.partidos) {
      const partido = RESULTADOS[idPartido(grupo, jornada.numero, local, visitante)]
      if (!partido) continue
      for (const evento of partido.eventos) {
        if (evento.tipo !== 'gol') continue
        const clave = `${evento.equipoId}__${evento.jugador}`
        if (!golesPorJugador.has(clave)) {
          golesPorJugador.set(clave, { jugador: evento.jugador, equipoId: evento.equipoId, goles: 0 })
        }
        golesPorJugador.get(clave).goles++
      }
    }
  }

  return equiposPorGrupo(grupo).map((equipo) => {
    const goleadores = [...golesPorJugador.values()]
      .filter((g) => g.equipoId === equipo.id)
      .sort((a, b) => b.goles - a.goles || a.jugador.localeCompare(b.jugador))
    return { equipo, goleadores }
  })
}

/**
 * Ranking de porteros por promedio de goles encajados por partido (de menor
 * a mayor, el mejor primero), a partir del portero titular anotado en cada
 * partido de resultados.js. Si un portero fue titular en varios partidos
 * suma partidos y goles encajados en todos ellos.
 */
export function ranquingPorteros(grupo) {
  const jornadas = jornadasDeGrupo(grupo)
  if (!jornadas) return []

  const porPortero = new Map() // `${equipoId}__${nombre}` -> { nombre, equipoId, partidos, golesEncajados }
  for (const jornada of jornadas) {
    for (const [local, visitante] of jornada.partidos) {
      const partido = RESULTADOS[idPartido(grupo, jornada.numero, local, visitante)]
      if (!partido?.porteros) continue
      const { golesLocal, golesVisitante } = partido.resultado

      if (partido.porteros.local) {
        acumularPortero(porPortero, partido.porteros.local, buscarEquipoId(grupo, local), golesVisitante)
      }
      if (partido.porteros.visitante) {
        acumularPortero(porPortero, partido.porteros.visitante, buscarEquipoId(grupo, visitante), golesLocal)
      }
    }
  }

  return [...porPortero.values()]
    .map((p) => ({ ...p, promedio: p.golesEncajados / p.partidos }))
    .sort((a, b) => a.promedio - b.promedio || b.partidos - a.partidos || a.nombre.localeCompare(b.nombre))
}

function acumularPortero(mapa, nombre, equipoId, golesEncajados) {
  if (!equipoId) return
  const clave = `${equipoId}__${nombre}`
  if (!mapa.has(clave)) mapa.set(clave, { nombre, equipoId, partidos: 0, golesEncajados: 0 })
  const fila = mapa.get(clave)
  fila.partidos++
  fila.golesEncajados += golesEncajados
}

function buscarEquipoId(grupo, nombreEquipo) {
  return equiposPorGrupo(grupo).find((e) => e.nombre === nombreEquipo)?.id ?? null
}
