import { describe, expect, it } from 'vitest'
import { EQUIPOS, equiposPorGrupo } from '../data/equipos.js'
import { JORNADAS as JORNADAS_TERCERA_VI } from '../data/calendario.js'
import { JORNADAS as JORNADAS_DH7 } from '../data/calendarioDH7.js'
import { JORNADAS as JORNADAS_LLC_SUD } from '../data/calendarioLLCSud.js'
import { JORNADAS as JORNADAS_LLC_NORD } from '../data/calendarioLLCNord.js'
import { JORNADAS as JORNADAS_LIGA_NACIONAL } from '../data/calendarioLigaNacional.js'

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

const CALENDARIOS_CON_ARCHIVO = [
  { grupo: 'tercera-vi', archivo: 'calendario.js', etiqueta: 'Tercera Federación', jornadas: JORNADAS_TERCERA_VI },
  { grupo: 'dh-g7', archivo: 'calendarioDH7.js', etiqueta: 'División de Honor Juvenil', jornadas: JORNADAS_DH7 },
  { grupo: 'llc-sud', archivo: 'calendarioLLCSud.js', etiqueta: 'Lliga Comunitat Amateur Sud', jornadas: JORNADAS_LLC_SUD },
  { grupo: 'llc-nord', archivo: 'calendarioLLCNord.js', etiqueta: 'Lliga Comunitat Amateur Nord', jornadas: JORNADAS_LLC_NORD },
  { grupo: 'liga-nacional', archivo: 'calendarioLigaNacional.js', etiqueta: 'Liga Nacional Juvenil', jornadas: JORNADAS_LIGA_NACIONAL },
]

describe('consistencia entre los calendarios y equipos.js', () => {
  for (const { grupo, archivo, etiqueta, jornadas } of CALENDARIOS_CON_ARCHIVO) {
    it(`todo nombre de equipo usado en ${archivo} (${etiqueta}) existe en equipos.js`, () => {
      const nombresEquipos = new Set(equiposPorGrupo(grupo).map((e) => e.nombre))
      const nombresCalendario = nombresUsadosEn(jornadas)

      for (const nombre of nombresCalendario) {
        expect(nombresEquipos.has(nombre), `"${nombre}" aparece en ${archivo} pero no existe en equipos.js`).toBe(true)
      }
    })

    it(`cada jornada de ${archivo} (${etiqueta}) tiene el número correcto de partidos`, () => {
      const numEquipos = equiposPorGrupo(grupo).length
      const partidosPorJornada = Math.floor(numEquipos / 2)
      for (const jornada of jornadas) {
        expect(
          jornada.partidos.length,
          `Jornada ${jornada.numero} de ${archivo} tiene ${jornada.partidos.length} partidos, se esperaban ${partidosPorJornada}`
        ).toBe(partidosPorJornada)
      }
    })
  }

  it('no hay equipos duplicados en equipos.js', () => {
    const ids = EQUIPOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
