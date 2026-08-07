import { getStore } from '@netlify/blobs'
import { EQUIPOS } from '../../src/data/equipos.js'

const IDS_VALIDOS = new Set(EQUIPOS.map((e) => e.id))

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'json_invalido' }), { status: 400 })
  }

  const { equipoId, subscription, desuscribir } = body ?? {}

  if (!equipoId || !IDS_VALIDOS.has(equipoId)) {
    return new Response(JSON.stringify({ ok: false, error: 'equipo_desconocido' }), { status: 400 })
  }
  if (!subscription?.endpoint) {
    return new Response(JSON.stringify({ ok: false, error: 'suscripcion_invalida' }), { status: 400 })
  }

  const store = getStore('suscripciones-push')
  const actuales = (await store.get(equipoId, { type: 'json' })) ?? []

  const sinEsta = actuales.filter((s) => s.endpoint !== subscription.endpoint)
  const nuevas = desuscribir ? sinEsta : [...sinEsta, subscription]

  await store.setJSON(equipoId, nuevas)

  return new Response(JSON.stringify({ ok: true, total: nuevas.length }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
