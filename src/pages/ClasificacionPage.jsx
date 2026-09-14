import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { GRUPOS } from '../data/equipos.js'
import { clasificacionDeGrupo } from '../utils/clasificacion.js'
import { establecerCanonical } from '../utils/seo.js'
import ClasificacionLiga from '../components/ClasificacionLiga.jsx'

const SITIO = 'https://calendario.pjcscout.es'

export default function ClasificacionPage() {
  const { grupo: grupoId } = useParams()
  const navigate = useNavigate()
  const grupo = GRUPOS[grupoId]
  const tabla = grupo ? clasificacionDeGrupo(grupoId) : null
  const hayPartidosJugados = tabla ? !tabla.every((fila) => fila.pj === 0) : false

  useEffect(() => {
    if (!grupo) return
    document.title = `Clasificación · ${grupo.nombre} ${grupo.subnombre} · PJC Scout`
    establecerCanonical(`/clasificacion/${grupoId}`)
  }, [grupo, grupoId])

  if (!grupo || !tabla) return <Navigate to="/" replace />

  const textoWhatsapp =
    `📊 Clasificación de ${grupo.nombre} ${grupo.subnombre}:\n` +
    tabla
      .slice(0, 5)
      .map((fila, indice) => `${indice + 1}. ${fila.equipo.nombre} — ${fila.pts} pts`)
      .join('\n') +
    `\nTabla completa: ${SITIO}/clasificacion/${grupoId}`
  const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(textoWhatsapp)}`

  return (
    <div className="clasificacion">
      <button className="temporada__volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h1 className="clasificacion__titulo">Clasificación</h1>
      <p className="clasificacion__meta">
        {grupo.nombre} {grupo.subnombre} · {grupo.temporada}
      </p>

      {hayPartidosJugados && (
        <a
          className="temporada__compartir-boton clasificacion__compartir"
          href={urlWhatsapp}
          target="_blank"
          rel="noreferrer"
        >
          Compartir por WhatsApp
        </a>
      )}

      <ClasificacionLiga grupoId={grupoId} />
    </div>
  )
}
