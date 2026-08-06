import { describe, expect, it } from 'vitest'
import { EQUIPOS, equiposPorGrupo } from '../data/equipos.js'
import { JORNADAS as JORNADAS_TERCERA_VI } from '../data/calendario.js'
import { JORNADAS as JORNADAS_DH7 } from '../data/calendarioDH7.js'

function nombresUsadosEn(jornadas) {
  const nombres = new Set()
  for (const jornada of jornadas) {
    for (const [local, visitante] of jornada.partidos) {
      nombres.add(local)
      nombres.add(visitante)
    }
  }
  return nombres
}

describe('consistencia entre calendario.js/calendarioDH7.js y equipos.js', () => {
  it('todo nombre de equipo usado en calendario.js (Tercera Federación) existe en equipos.js', () => {
    const nombresEquipos = new Set(equiposPorGrupo('tercera-vi').map((e) => e.nombre))
    const nombresCalendario = nombresUsadosEn(JORNADAS_TERCERA_VI)

    for (const nombre of nombresCalendario) {
      expect(nombresEquipos.has(nombre), `"${nombre}" aparece en calendario.js pero no existe en equipos.js`).toBe(true)
    }
  })

  it('todo nombre de equipo usado en calendarioDH7.js (División de Honor Juvenil) existe en equipos.js', () => {
    const nombresEquipos = new Set(equiposPorGrupo('dh-g7').map((e) => e.nombre))
    const nombresCalendario = nombresUsadosEn(JORNADAS_DH7)

    for (const nombre of nombresCalendario) {
      expect(nombresEquipos.has(nombre), `"${nombre}" aparece en calendarioDH7.js pero no existe en equipos.js`).toBe(true)
    }
  })

  it('no hay equipos duplicados en equipos.js', () => {
    const ids = EQUIPOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
