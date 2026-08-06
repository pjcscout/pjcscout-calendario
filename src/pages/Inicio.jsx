import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SelectorEquipo from '../components/SelectorEquipo.jsx'
import { EQUIPOS } from '../data/equipos.js'
import { CLAVE_EQUIPO_ELEGIDO } from '../utils/almacenEquipo.js'

const TITULO_POR_DEFECTO = 'PJC Scout · Mi Calendario'
const DESCRIPCION_POR_DEFECTO =
  'Sigue a tu equipo jornada a jornada. Calendario completo de un vistazo, gratis, siempre.'

export default function Inicio() {
  const navigate = useNavigate()
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const idGuardado = localStorage.getItem(CLAVE_EQUIPO_ELEGIDO)
    const encontrado = idGuardado && EQUIPOS.find((e) => e.id === idGuardado)
    if (encontrado) {
      navigate(`/equipo/${encontrado.id}`, { replace: true })
      return
    }
    setListo(true)
  }, [navigate])

  useEffect(() => {
    // EquipoPage sobrescribe el título y las meta tags al ver un equipo;
    // si se vuelve al selector hay que devolverlos a los genéricos.
    if (!listo) return
    document.title = TITULO_POR_DEFECTO
    document
      .querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((el) => el.setAttribute('content', DESCRIPCION_POR_DEFECTO))
    document
      .querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]')
      .forEach((el) => el.setAttribute('content', TITULO_POR_DEFECTO))
  }, [listo])

  if (!listo) return null

  return (
    <SelectorEquipo
      onElegir={(equipo) => {
        localStorage.setItem(CLAVE_EQUIPO_ELEGIDO, equipo.id)
        navigate(`/equipo/${equipo.id}`)
      }}
    />
  )
}
