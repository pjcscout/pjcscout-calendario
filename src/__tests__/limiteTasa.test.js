import { describe, expect, it } from 'vitest'
import { consumirCupo } from '../utils/limiteTasa.js'

const OPC = { max: 3, ventanaMs: 60_000 }

describe('consumirCupo', () => {
  it('permite hasta el máximo y rechaza la siguiente', () => {
    let reg = null
    for (let i = 0; i < 3; i++) {
      const r = consumirCupo(reg, 1000, OPC)
      expect(r.permitido).toBe(true)
      reg = r.registro
    }
    expect(consumirCupo(reg, 2000, OPC).permitido).toBe(false)
  })

  it('reinicia el contador al acabar la ventana', () => {
    const r = consumirCupo({ t: 0, n: 99 }, 61_000, OPC)
    expect(r.permitido).toBe(true)
    expect(r.registro).toEqual({ t: 61_000, n: 1 })
  })
})
