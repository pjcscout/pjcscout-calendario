import { createHash } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { EQUIPOS } from '../../src/data/equipos.js'
import { MAX_BYTES_PETICION, MAX_SUSCRIPCIONES_POR_EQUIPO, sanearSuscripcion } from '../../src/utils/suscripcionPush.js'
import { consumirCupo } from '../../src/utils/limiteTasa.js'

const IDS_VALIDOS = new Set(EQUIPOS.map((e) => e.id))
const LIMITE = { max: 10, ventanaMs: 60_000 }

function respuesta(status, error) {
  return new Response(JSON.stringify(error ? { ok: false, error } : { ok: true }), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function mismoOrigen(req) {
  const origen = req.headers.get('origin')
  if (!origen) return true
  try {
    return new URL(origen).host === new URL(req.url).host
  } catch {
    return false
  }
}

// Limitación best-effort por IP (hash, no se guarda la IP en claro).
async function dentroDelLimite(ip) {
  if (!ip) return true
  const store = getStore('limite-suscripciones')
  const clave = createHash('sha256').update(ip).digest('hex').slice(0, 32)
  const { permitido, registro } = consumirCupo(await store.get(clave, { type: 'json' }), Date.now(), LIMITE)
  await store.setJSON(clave, registro)
  return permitido
}

export default async (req, context) => {
  if (req.method !== 'POST') return respuesta(405, 'method_not_allowed')

  if (!mismoOrigen(req)) return respuesta(403, 'origen_no_permitido')

  if (!(await dentroDelLimite(context?.ip))) return respuesta(429, 'demasiadas_peticiones')

  const texto = await req.text()
  if (texto.length > MAX_BYTES_PETICION) return respuesta(413, 'peticion_demasiado_grande')

  let body
  try {
    body = JSON.parse(texto)
  } catch {
    return respuesta(400, 'json_invalido')
  }

  const { equipoId, subscription, desuscribir } = body ?? {}

  if (typeof equipoId !== 'string' || !IDS_VALIDOS.has(equipoId)) return respuesta(400, 'equipo_desconocido')

  const limpia = sanearSuscripcion(subscription)
  if (!limpia) return respuesta(400, 'suscripcion_invalida')

  const store = getStore('suscripciones-push')
  const actuales = (await store.get(equipoId, { type: 'json' })) ?? []

  const sinEsta = actuales.filter((s) => s.endpoint !== limpia.endpoint)
  if (!desuscribir && sinEsta.length >= MAX_SUSCRIPCIONES_POR_EQUIPO) return respuesta(409, 'limite_suscripciones')

  const nuevas = desuscribir ? sinEsta : [...sinEsta, limpia]
  await store.setJSON(equipoId, nuevas)

  return new Response(JSON.stringify({ ok: true, total: nuevas.length }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
