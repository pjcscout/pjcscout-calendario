import { useState } from 'react'
import { obtenerTema, alternarTema } from '../utils/tema.js'

export default function BotonTema() {
  const [tema, setTema] = useState(() => obtenerTema())

  return (
    <button
      type="button"
      className="boton-tema"
      onClick={() => setTema(alternarTema())}
      aria-label={tema === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={tema === 'light' ? 'Modo oscuro' : 'Modo claro'}
    >
      {tema === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
