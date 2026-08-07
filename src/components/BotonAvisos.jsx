import { useEffect, useState } from 'react'
import {
  activarAvisos,
  avisosActivos,
  desactivarAvisos,
  esIOSSinInstalar,
  soportaNotificaciones,
} from '../utils/notificaciones.js'

export default function BotonAvisos({ equipoId }) {
  const [soportado, setSoportado] = useState(false)
  const [necesitaInstalarIOS, setNecesitaInstalarIOS] = useState(false)
  const [activo, setActivo] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setSoportado(soportaNotificaciones())
    setNecesitaInstalarIOS(esIOSSinInstalar())
    setActivo(avisosActivos(equipoId))
  }, [equipoId])

  if (necesitaInstalarIOS) {
    return (
      <p className="boton-avisos boton-avisos--aviso">
        📲 Para activar avisos en iPhone o iPad: toca <strong>Compartir</strong> →{' '}
        <strong>Añadir a pantalla de inicio</strong>, y abre la web desde ahí.
      </p>
    )
  }

  if (!soportado) return null

  const alternar = async () => {
    setCargando(true)
    try {
      const ok = activo ? await desactivarAvisos(equipoId) : await activarAvisos(equipoId)
      if (ok) setActivo(!activo)
    } catch {
      // Permiso denegado, sin soporte real en este navegador/perfil, etc.
      // El botón simplemente vuelve a su estado anterior.
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      type="button"
      className="boton-avisos"
      onClick={alternar}
      disabled={cargando}
      aria-pressed={activo}
    >
      {activo ? '🔔 Avisos activados' : '🔕 Avisarme el día del partido'}
    </button>
  )
}
