import { equiposPorGrupo } from '../data/equipos.js'
import { jornadasDeGrupo } from './fixtures.js'
import { RESULTADOS, idPartido } from '../data/resultados.js'

/**
 * Recorre todos los partidos con resultado cargado de un grupo y ejecuta
 * `alEvento` por cada evento (gol, tarjeta...) de cada acta.
 */
function recorrerEventos(grupo, alEvento) {
  const jornadas = jornadasDeGrupo(grupo)
  if (!jornadas) return
  for (const jornada of jornadas) {
    for (const [local, visitante] of jornada.partidos) {
      const partido = RESULTADOS[idPartido(grupo, jornada.numero, local, visitante)]
      if (!partido) continue
      for (const evento of partido.eventos) alEvento(evento)
    }
  }
}

/**
 * Goles de cada jugador de un grupo, a partir de los eventos "gol" guardados
 * en resultados.js. Solo se cuentan los partidos que ya tienen resultado
 * cargado.
 *
 * Nota: la fuente oficial (FFCV) no publica asistencias en el acta pública
 * del partido, así que esa estadística no se puede calcular sin inventar
 * datos — no se incluye aquí a propósito.
 */
function golesPorJugador(grupo) {
  const mapa = new Map() // `${equipoId}__${jugador}` -> { jugador, equipoId, goles }
  recorrerEventos(grupo, (evento) => {
    if (evento.tipo !== 'gol') return
    const clave = `${evento.equipoId}__${evento.jugador}`
    if (!mapa.has(clave)) mapa.set(clave, { jugador: evento.jugador, equipoId: evento.equipoId, goles: 0 })
    mapa.get(clave).goles++
  })
  return [...mapa.values()].sort((a, b) => b.goles - a.goles || a.jugador.localeCompare(b.jugador))
}

/**
 * Trofeo Pichichi: ranking de máximos goleadores del grupo (todos los
 * equipos mezclados). Devuelve el top `topN`.
 */
export function pichichiDeGrupo(grupo, topN = 10) {
  return golesPorJugador(grupo).slice(0, topN)
}

/**
 * Ranking de porteros por promedio de goles encajados por partido (de menor
 * a mayor, el mejor primero), a partir del portero titular anotado en cada
 * partido de resultados.js. Si un portero fue titular en varios partidos
 * suma partidos y goles encajados en todos ellos.
 *
 * Es el criterio del Trofeo Zamora: menos goles encajados por partido, no
 * el número total de partidos jugados.
 */
export function ranquingPorteros(grupo) {
  const porPortero = new Map() // `${equipoId}__${nombre}` -> { nombre, equipoId, partidos, golesEncajados }
  const jornadas = jornadasDeGrupo(grupo)
  if (!jornadas) return []

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

/**
 * Ranking de tarjetas del grupo (todos los equipos mezclados), a partir de
 * los eventos "tarjeta_amarilla" / "tarjeta_roja" de resultados.js. Ordenado
 * por rojas y luego amarillas, de más a menos. Devuelve el top `topN`.
 */
export function tarjetasDeGrupo(grupo, topN = 10) {
  const mapa = new Map() // `${equipoId}__${jugador}` -> { jugador, equipoId, amarillas, rojas }
  recorrerEventos(grupo, (evento) => {
    if (evento.tipo !== 'tarjeta_amarilla' && evento.tipo !== 'tarjeta_roja') return
    const clave = `${evento.equipoId}__${evento.jugador}`
    if (!mapa.has(clave)) mapa.set(clave, { jugador: evento.jugador, equipoId: evento.equipoId, amarillas: 0, rojas: 0 })
    const fila = mapa.get(clave)
    if (evento.tipo === 'tarjeta_amarilla') fila.amarillas++
    else fila.rojas++
  })

  return [...mapa.values()]
    .sort((a, b) => b.rojas - a.rojas || b.amarillas - a.amarillas || a.jugador.localeCompare(b.jugador))
    .slice(0, topN)
}
