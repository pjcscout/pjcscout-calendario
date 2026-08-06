import { formatearFecha } from '../utils/fecha.js'

const SITIO = 'https://calendario.pjcscout.es'

export default function CompartirProximoPartido({ equipo, partido }) {
  const { dia, fecha } = formatearFecha(partido.fecha)
  const lugar = partido.esLocal ? 'en casa' : 'fuera'
  const texto =
    `⚽ Próximo partido de ${equipo.nombre}: ${dia} ${fecha} vs ${partido.rival} (${lugar}).\n` +
    `Calendario completo: ${SITIO}/equipo/${equipo.id}`
  const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(texto)}`

  return (
    <div className="temporada__compartir">
      <div>
        <p className="temporada__compartir-etiqueta">Próximo partido</p>
        <p className="temporada__compartir-texto">
          {dia} {fecha} · {partido.esLocal ? 'Local' : 'Fuera'} vs {partido.rival}
        </p>
      </div>
      <a
        className="temporada__compartir-boton"
        href={urlWhatsapp}
        target="_blank"
        rel="noreferrer"
      >
        Compartir por WhatsApp
      </a>
    </div>
  )
}
