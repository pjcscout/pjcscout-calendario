import { describe, expect, it } from 'vitest'
import { endpointPushValido, sanearSuscripcion } from '../utils/suscripcionPush.js'

const KEYS = { p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM', auth: 'tBHItJI5svbpez7KI4CCXg' }

describe('endpointPushValido', () => {
  it('acepta los servicios push de los navegadores', () => {
    expect(endpointPushValido('https://fcm.googleapis.com/fcm/send/abc')).toBe(true)
    expect(endpointPushValido('https://updates.push.services.mozilla.com/wpush/v2/abc')).toBe(true)
    expect(endpointPushValido('https://web.push.apple.com/abc')).toBe(true)
    expect(endpointPushValido('https://wns2-par02p.notify.windows.com/w/?token=abc')).toBe(true)
  })

  it('rechaza http, hosts internos, dominios parecidos y credenciales', () => {
    expect(endpointPushValido('http://fcm.googleapis.com/x')).toBe(false)
    expect(endpointPushValido('https://169.254.169.254/latest/meta-data')).toBe(false)
    expect(endpointPushValido('https://localhost/x')).toBe(false)
    expect(endpointPushValido('https://fcm.googleapis.com.evil.com/x')).toBe(false)
    expect(endpointPushValido('https://evilnotify.windows.com.evil.io/x')).toBe(false)
    expect(endpointPushValido('https://user:pass@fcm.googleapis.com/x')).toBe(false)
    expect(endpointPushValido('https://fcm.googleapis.com:8443/x')).toBe(false)
    expect(endpointPushValido('no es una url')).toBe(false)
    expect(endpointPushValido(undefined)).toBe(false)
    expect(endpointPushValido('https://fcm.googleapis.com/' + 'a'.repeat(1100))).toBe(false)
  })
})

describe('sanearSuscripcion', () => {
  it('devuelve solo endpoint y keys', () => {
    const limpia = sanearSuscripcion({ endpoint: 'https://fcm.googleapis.com/fcm/send/abc', keys: KEYS, extra: 'x' })
    expect(limpia).toEqual({ endpoint: 'https://fcm.googleapis.com/fcm/send/abc', keys: KEYS })
  })

  it('rechaza claves ausentes o con formato inválido', () => {
    const endpoint = 'https://fcm.googleapis.com/fcm/send/abc'
    expect(sanearSuscripcion({ endpoint })).toBeNull()
    expect(sanearSuscripcion({ endpoint, keys: { p256dh: '<script>', auth: KEYS.auth } })).toBeNull()
    expect(sanearSuscripcion(null)).toBeNull()
  })
})
