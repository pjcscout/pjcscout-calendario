import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../data/resultados.js', async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, RESULTADOS: {} }
})

const { RESULTADOS, idPartido } = await import('../data/resultados.js')
const { clasificacionDeGrupo } = await import('../utils/clasificacion.js')

function fijarResultado(jornada, local, visitante, golesLocal, golesVisitante) {
  RESULTADOS[idPartido('tercera-vi', jornada, local, visitante)] = {
    resultado: { golesLocal, golesVisitante },
    eventos: [],
  }
}

afterEach(() => {
  for (const clave of Object.keys(RESULTADOS)) delete RESULTADOS[clave]
})

describe('clasificacionDeGrupo', () => {
  it('sin resultados, todos los equipos tienen 0 partidos jugados y sin racha', () => {
    const tabla = clasificacionDeGrupo('tercera-vi')
    expect(tabla.every((fila) => fila.pj === 0)).toBe(true)
    expect(tabla.every((fila) => fila.racha.length === 0)).toBe(true)
  })

  it('calcula puntos, goles y racha a partir de resultados reales', () => {
    fijarResultado(1, 'At. Saguntino', 'Levante U.D. "B"', 2, 1)
    fijarResultado(2, 'Ontinyent 1931 C.F.', 'At. Saguntino', 3, 1)
    fijarResultado(3, 'At. Saguntino', 'Villarreal C.F. "C"', 1, 1)

    const tabla = clasificacionDeGrupo('tercera-vi')
    const saguntino = tabla.find((fila) => fila.equipo.nombre === 'At. Saguntino')

    expect(saguntino.pj).toBe(3)
    expect(saguntino.pg).toBe(1)
    expect(saguntino.pe).toBe(1)
    expect(saguntino.pp).toBe(1)
    expect(saguntino.gf).toBe(4)
    expect(saguntino.gc).toBe(5)
    expect(saguntino.pts).toBe(4)
    expect(saguntino.racha).toEqual(['V', 'D', 'E'])
  })

  it('la racha se recorta a los últimos 5 partidos, de más antiguo a más reciente', () => {
    fijarResultado(1, 'At. Saguntino', 'Levante U.D. "B"', 2, 1)
    fijarResultado(2, 'Ontinyent 1931 C.F.', 'At. Saguntino', 3, 1)
    fijarResultado(3, 'At. Saguntino', 'Villarreal C.F. "C"', 1, 1)
    fijarResultado(4, 'Crevillente Deportivo', 'At. Saguntino', 0, 2)
    fijarResultado(5, 'At. Saguntino', 'C.D. Utiel', 3, 0)
    fijarResultado(6, 'S.C. Torrevieja C.F. "A"', 'At. Saguntino', 2, 0)

    const tabla = clasificacionDeGrupo('tercera-vi')
    const saguntino = tabla.find((fila) => fila.equipo.nombre === 'At. Saguntino')

    expect(saguntino.racha).toEqual(['D', 'E', 'V', 'V', 'D'])
  })

  it('ordena por puntos, luego diferencia de goles, luego goles a favor', () => {
    fijarResultado(1, 'At. Saguntino', 'Levante U.D. "B"', 5, 0)

    const tabla = clasificacionDeGrupo('tercera-vi')
    expect(tabla[0].equipo.nombre).toBe('At. Saguntino')
    expect(tabla[0].pts).toBe(3)
    expect(tabla[0].dg).toBe(5)
  })

  it('devuelve null para un grupo sin calendario', () => {
    expect(clasificacionDeGrupo('grupo-inexistente')).toBeNull()
  })
})
