import { useEffect, useState } from 'react'
import SelectorEquipo from './components/SelectorEquipo.jsx'
import Temporada from './components/Temporada.jsx'
import { EQUIPOS } from './data/equipos.js'

const CLAVE_EQUIPO_ELEGIDO = 'pjc-equipo-elegido'

export default function App() {
  const [equipo, setEquipo] = useState(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const idGuardado = localStorage.getItem(CLAVE_EQUIPO_ELEGIDO)
    if (idGuardado) {
      const encontrado = EQUIPOS.find((e) => e.id === idGuardado)
      if (encontrado) setEquipo(encontrado)
    }
    setListo(true)
  }, [])

  if (!listo) return null

  return (
    <div className="app">
      {equipo ? (
        <Temporada
          equipo={equipo}
          onCambiar={() => {
            setEquipo(null)
            localStorage.removeItem(CLAVE_EQUIPO_ELEGIDO)
          }}
        />
      ) : (
        <SelectorEquipo
          onElegir={(e) => {
            setEquipo(e)
            localStorage.setItem(CLAVE_EQUIPO_ELEGIDO, e.id)
          }}
        />
      )}
      <footer className="app__footer">
        <a href="https://www.pjcscout.es" target="_blank" rel="noreferrer">
          PJC Scout & Analytics
        </a>
        <span>·</span>
        <span>Datos: FFCV</span>
      </footer>
    </div>
  )
}
