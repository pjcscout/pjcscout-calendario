import { getStore } from '@netlify/blobs'
import { EQUIPOS, GRUPOS } from '../../src/data/equipos.js'
import { fixturesDeEquipo, tieneCalendario } from '../../src/utils/fixtures.js'
import { fichaEquipo } from '../../src/data/fichas.js'
import { clasificacionDeGrupo } from '../../src/utils/clasificacion.js'

const LIMITE_DIARIO = 300
const MODELO = 'gemini-2.0-flash'

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

function construirContexto(equipoId) {
  const equipo = EQUIPOS.find((e) => e.id === equipoId)
  if (!equipo) return 'No se ha especificado ningún equipo.'

  const grupo = GRUPOS[equipo.grupo]
  const lineas = [
    `Equipo: ${equipo.nombre}`,
    `Categoría: ${grupo.nombre} ${grupo.subnombre} — Temporada ${grupo.temporada}`,
    `Localidad: ${equipo.localidad}`,
  ]

  if (!tieneCalendario(equipo.grupo)) {
    lineas.push('Esta categoría todavía no tiene calendario publicado.')
    return lineas.join('\n')
  }

  const hoy = hoyISO()
  const fixtures = fixturesDeEquipo(equipo.nombre, equipo.grupo) ?? []
  const proxima = fixtures.find((f) => !f.bye && f.fecha >= hoy)
  if (proxima) {
    lineas.push(
      `Próximo partido: jornada ${proxima.jornada}, ${proxima.fecha}, vs ${proxima.rival} (${proxima.esLocal ? 'local' : 'fuera'}).`
    )
  } else {
    lineas.push('No quedan partidos pendientes en el calendario.')
  }

  const jugados = fixtures.filter((f) => !f.bye && f.resultado)
  if (jugados.length > 0) {
    const ultimos = jugados.slice(-5)
    lineas.push(
      'Últimos resultados: ' +
        ultimos
          .map((f) => `J${f.jornada} vs ${f.rival}: ${f.resultado.golesLocal}-${f.resultado.golesVisitante}`)
          .join('; ')
    )
  } else {
    lineas.push('Todavía no hay resultados registrados para este equipo.')
  }

  const tabla = clasificacionDeGrupo(equipo.grupo)
  const fila = tabla?.find((f) => f.equipo.id === equipo.id)
  if (fila && fila.pj > 0) {
    const posicion = tabla.indexOf(fila) + 1
    lineas.push(
      `Clasificación: ${posicion}º puesto, ${fila.pts} puntos, ${fila.pj} partidos jugados (${fila.pg}G ${fila.pe}E ${fila.pp}P).`
    )
  }

  const ficha = fichaEquipo(equipo.id)
  if (ficha?.campo) lineas.push(`Campo: ${ficha.campo}.`)
  if (ficha?.direccion) lineas.push(`Dirección del campo: ${ficha.direccion}.`)

  return lineas.join('\n')
}

const INSTRUCCION_SISTEMA = `Eres el asistente de PJC Scout · Mi Calendario, una app de calendarios de fútbol base.
Respondes SOLO con la información que te doy en el contexto, en español, en 1-3 frases, tono cercano.
Si la respuesta no está en el contexto, di claramente que no tienes ese dato — nunca inventes fechas,
resultados, horas ni nombres de jugadores. No hables de temas ajenos al calendario del equipo.`

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), { status: 405 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ ok: false, error: 'no_configurado' }), { status: 503 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'json_invalido' }), { status: 400 })
  }

  const pregunta = (body?.pregunta ?? '').toString().trim().slice(0, 300)
  const equipoId = body?.equipoId
  if (!pregunta) {
    return new Response(JSON.stringify({ ok: false, error: 'pregunta_vacia' }), { status: 400 })
  }

  const store = getStore('ia-uso')
  const clave = hoyISO()
  const usoHoy = (await store.get(clave, { type: 'json' })) ?? 0
  if (usoHoy >= LIMITE_DIARIO) {
    return new Response(JSON.stringify({ ok: false, error: 'limite_diario_superado' }), { status: 429 })
  }

  const contexto = construirContexto(equipoId)

  const respuestaGemini = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: INSTRUCCION_SISTEMA }] },
        contents: [{ parts: [{ text: `Contexto:\n${contexto}\n\nPregunta: ${pregunta}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 200 },
      }),
    }
  )

  if (!respuestaGemini.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'error_ia' }), { status: 502 })
  }

  const datos = await respuestaGemini.json()
  const texto = datos?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

  await store.setJSON(clave, usoHoy + 1)

  if (!texto) {
    return new Response(JSON.stringify({ ok: false, error: 'sin_respuesta' }), { status: 502 })
  }

  return new Response(JSON.stringify({ ok: true, respuesta: texto }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
