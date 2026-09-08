import { equiposPorGrupo } from '../data/equipos.js'
import { jornadasDeGrupo } from './fixtures.js'
import { RESULTADOS, idPartido } from '../data/resultados.js'
import { minutosJugadosEquipo } from '../data/minutosJugados.js'

function normaliza(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/**
 * Los eventos de partido guardan el nombre abreviado tal cual lo publica la
 * federación ("M. Bonafe"), mientras que la Plantilla guarda el nombre
 * completo ("Marc Bonafe Ceita"). No hay un identificador común, así que se
 * cruzan por inicial del nombre + apellido para saber si son la misma persona.
 */
function esElMismoJugador(nombreAbreviado, nombreCompleto) {
  const partes = nombreAbreviado.trim().split(/\.\s*/)
  if (partes.length < 2) return normaliza(nombreAbreviado) === normaliza(nombreCompleto)
  const inicial = normaliza(partes[0])
  const apellido = normaliza(partes.slice(1).join(' '))
  const tokens = normaliza(nombreCompleto).split(/\s+/)
  if (!tokens[0] || tokens[0][0] !== inicial) return false
  const resto = tokens.slice(1).join(' ')
  return resto.includes(apellido) || (tokens[1] && apellido.includes(tokens[1]))
}

/**
 * Goles, tarjetas y minutos jugados de un jugador de la plantilla en la
 * temporada (por ahora, solo jornada 1). `nombreCompleto` debe ser tal cual
 * aparece en PLANTILLAS.
 */
export function estadisticasJugador(grupo, equipoId, nombreCompleto) {
  const jornadas = jornadasDeGrupo(grupo)
  const nombreEquipo = equiposPorGrupo(grupo).find((e) => e.id === equipoId)?.nombre
  const goles = []
  const tarjetas = []

  if (jornadas) {
    for (const jornada of jornadas) {
      for (const [local, visitante] of jornada.partidos) {
        const partido = RESULTADOS[idPartido(grupo, jornada.numero, local, visitante)]
        if (!partido) continue
        const rival = local === nombreEquipo ? visitante : local
        for (const evento of partido.eventos) {
          if (evento.equipoId !== equipoId) continue
          if (!esElMismoJugador(evento.jugador, nombreCompleto)) continue
          const entrada = { jornada: jornada.numero, minuto: evento.minuto, rival }
          if (evento.tipo === 'gol') goles.push(entrada)
          else if (evento.tipo === 'tarjeta_amarilla' || evento.tipo === 'tarjeta_roja') {
            tarjetas.push({ ...entrada, tipo: evento.tipo })
          }
        }
      }
    }
  }

  goles.sort((a, b) => a.jornada - b.jornada || a.minuto - b.minuto)
  tarjetas.sort((a, b) => a.jornada - b.jornada || a.minuto - b.minuto)

  const minutos = minutosJugadosEquipo(equipoId)?.[nombreCompleto] ?? null

  return { goles, tarjetas, minutos }
}
