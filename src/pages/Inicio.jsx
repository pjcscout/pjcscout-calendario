import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SelectorEquipo from '../components/SelectorEquipo.jsx'
import { EQUIPOS } from '../data/equipos.js'
import { CLAVE_EQUIPO_ELEGIDO } from '../utils/almacenEquipo.js'

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
