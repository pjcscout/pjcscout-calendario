import { formatearFecha } from '../utils/fecha.js'
import { urlGoogleCalendar, descargarICS } from '../utils/calendarioExport.js'

const SITIO = 'https://calendario.pjcscout.es'

export default function CompartirProximoPartido({ equipo, partido, ficha }) {
  const { dia, fecha } = formatearFecha(partido.fecha)
  const lugar = partido.esLocal ? 'en casa' : 'fuera'
  const texto =
    `⚽ Próximo partido de ${equipo.nombre}: ${dia} ${fecha} vs ${partido.rival} (${lugar}).\n` +
    `Calendario completo: ${SITIO}/equipo/${equipo.id}`
  const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(texto)}`

  const titulo = partido.esLocal
    ? `${equipo.nombre} vs ${partido.rival}`
    : `${partido.rival} vs ${equipo.nombre}`
  const detalles = `Calendario completo: ${SITIO}/equipo/${equipo.id}`
  const ubicacion = partido.esLocal && ficha ? `${ficha.campo ?? ''} ${ficha.direccion ?? ''}`.trim() : ''

  const datosEvento = { titulo, fechaISO: partido.fecha, detalles, ubicacion }

  return (
    <div className="temporada__compartir">
      <div>
        <p className="temporada__compartir-etiqueta">Próximo partido</p>
        <p className="temporada__compartir-texto">
          {dia} {fecha} · {partido.esLocal ? 'Local' : 'Fuera'} vs {partido.rival}
        </p>
      </div>
      <div className="temporada__compartir-botones">
        <a
          className="temporada__compartir-boton"
          href={urlWhatsapp}
          target="_blank"
          rel="noreferrer"
        >
          Compartir por WhatsApp
        </a>
        <a
          className="temporada__compartir-boton temporada__compartir-boton--secundario"
          href={urlGoogleCalendar(datosEvento)}
          target="_blank"
          rel="noreferrer"
        >
          + Google Calendar
        </a>
        <button
          className="temporada__compartir-boton temporada__compartir-boton--secundario"
          onClick={() => descargarICS(datosEvento)}
        >
          + Apple / Outlook
        </button>
      </div>
    </div>
  )
}
