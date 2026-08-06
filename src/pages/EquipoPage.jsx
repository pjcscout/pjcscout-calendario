import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Temporada from '../components/Temporada.jsx'
import EquipoSinCalendario from '../components/EquipoSinCalendario.jsx'
import { EQUIPOS, GRUPOS } from '../data/equipos.js'
import { tieneCalendario } from '../utils/fixtures.js'
import { CLAVE_EQUIPO_ELEGIDO } from '../utils/almacenEquipo.js'

export default function EquipoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const equipo = EQUIPOS.find((e) => e.id === id)

  const hayCalendario = equipo ? tieneCalendario(equipo.grupo) : false

  useEffect(() => {
    if (!equipo) return
    localStorage.setItem(CLAVE_EQUIPO_ELEGIDO, equipo.id)

    const grupo = GRUPOS[equipo.grupo]
    const titulo = `${equipo.nombre} · ${grupo.nombre} · PJC Scout`
    document.title = titulo

    const descripcion = hayCalendario
      ? `Calendario completo de ${equipo.nombre} en ${grupo.nombre} ${grupo.subnombre}, temporada ${grupo.temporada}. Jornada a jornada, gratis.`
      : `${equipo.nombre} en ${grupo.nombre} ${grupo.subnombre}, temporada ${grupo.temporada}. PJC Scout.`
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((el) => el.setAttribute('content', descripcion))
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]')
      .forEach((el) => el.setAttribute('content', titulo))
  }, [equipo, hayCalendario])

  if (!equipo) return <Navigate to="/" replace />

  const onCambiar = () => {
    localStorage.removeItem(CLAVE_EQUIPO_ELEGIDO)
    navigate('/')
  }

  return hayCalendario ? (
    <Temporada equipo={equipo} onCambiar={onCambiar} />
  ) : (
    <EquipoSinCalendario equipo={equipo} onCambiar={onCambiar} />
  )
}
