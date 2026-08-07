import webpush from 'web-push'
import { getStore } from '@netlify/blobs'
import { EQUIPOS, GRUPOS } from '../../src/data/equipos.js'
import { tieneCalendario } from '../../src/utils/fixtures.js'
import { fixturesDeEquipo } from '../../src/utils/fixtures.js'
import { idPartido } from '../../src/data/resultados.js'
import { HORARIOS } from '../../src/data/horarios.js'

const VAPID_PUBLIC_KEY =
  'BD-9Ju_lmoruECOYwNjcw3nGT5rvQ4IdB4IGXU_y97xLo-rvY23qWFK9n8w0NMkQm0VEUx6CO5Nc5UPqBhYFwhY'

function hoyEnMadrid() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })
}

export default async () => {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT, VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)

  const hoy = hoyEnMadrid()
  const store = getStore('suscripciones-push')
  let enviados = 0

  for (const grupoId of Object.keys(GRUPOS)) {
    if (!tieneCalendario(grupoId)) continue

    const equiposDelGrupo = EQUIPOS.filter((e) => e.grupo === grupoId)
    for (const equipo of equiposDelGrupo) {
      const fixtures = fixturesDeEquipo(equipo.nombre, grupoId)
      const partidoDeHoy = fixtures?.find((f) => !f.bye && f.fecha === hoy)
      if (!partidoDeHoy) continue

      const suscripciones = await store.get(equipo.id, { type: 'json' })
      if (!suscripciones?.length) continue

      const local = partidoDeHoy.esLocal ? equipo.nombre : partidoDeHoy.rival
      const visitante = partidoDeHoy.esLocal ? partidoDeHoy.rival : equipo.nombre
      const clave = idPartido(grupoId, partidoDeHoy.jornada, local, visitante)
      const hora = HORARIOS[clave]?.hora

      const cuerpo = hora
        ? `${equipo.nombre} vs ${partidoDeHoy.rival} hoy a las ${hora} (${partidoDeHoy.esLocal ? 'Local' : 'Fuera'})`
        : `${equipo.nombre} vs ${partidoDeHoy.rival} hoy (${partidoDeHoy.esLocal ? 'Local' : 'Fuera'}). Hora aún sin confirmar.`

      const payload = JSON.stringify({
        titulo: '⚽ Partido hoy',
        cuerpo,
        url: `/equipo/${equipo.id}`,
      })

      const supervivientes = []
      for (const suscripcion of suscripciones) {
        try {
          await webpush.sendNotification(suscripcion, payload)
          supervivientes.push(suscripcion)
          enviados++
        } catch (error) {
          if (error.statusCode !== 404 && error.statusCode !== 410) {
            supervivientes.push(suscripcion)
          }
        }
      }
      await store.setJSON(equipo.id, supervivientes)
    }
  }

  return new Response(JSON.stringify({ ok: true, enviados }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}

export const config = {
  schedule: '0 7 * * *',
}
