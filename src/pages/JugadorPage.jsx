import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { EQUIPOS, GRUPOS } from '../data/equipos.js'
import { plantillaEquipo } from '../data/plantillas.js'
import { estadisticasJugador } from '../utils/estadisticasJugador.js'
import { establecerCanonical } from '../utils/seo.js'
import FichaJugador from '../components/FichaJugador.jsx'

export default function JugadorPage() {
  const { equipoId, nombre: nombreCodificado } = useParams()
  const navigate = useNavigate()
  const equipo = EQUIPOS.find((e) => e.id === equipoId)
  const nombre = nombreCodificado ? decodeURIComponent(nombreCodificado) : ''
  const enPlantilla = equipo ? (plantillaEquipo(equipo.id) || []).includes(nombre) : false

  useEffect(() => {
    if (!equipo || !enPlantilla) return
    const grupo = GRUPOS[equipo.grupo]
    const titulo = `${nombre} · ${equipo.nombre} · PJC Scout`
    document.title = titulo
    establecerCanonical(`/equipo/${equipo.id}/jugador/${encodeURIComponent(nombre)}`)

    const descripcion = `Ficha de ${nombre} (${equipo.nombre}, ${grupo.nombre} ${grupo.subnombre}): minutos jugados, goles y tarjetas de la temporada, gratis.`
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((el) => el.setAttribute('content', descripcion))
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]')
      .forEach((el) => el.setAttribute('content', titulo))
  }, [equipo, enPlantilla, nombre])

  if (!equipo || !enPlantilla) return <Navigate to={equipo ? `/equipo/${equipo.id}` : '/'} replace />

  const grupo = GRUPOS[equipo.grupo]
  const { goles, tarjetas, minutos } = estadisticasJugador(equipo.grupo, equipo.id, nombre)

  return (
    <FichaJugador
      equipo={equipo}
      nombre={nombre}
      grupo={grupo}
      goles={goles}
      tarjetas={tarjetas}
      minutos={minutos}
      onVolver={() => navigate(-1)}
    />
  )
}
