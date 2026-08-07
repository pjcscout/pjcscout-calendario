import { useState } from 'react'

export default function ChatIA({ equipoId }) {
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const enviar = async (e) => {
    e.preventDefault()
    if (!pregunta.trim()) return
    setCargando(true)
    setError(null)
    setRespuesta(null)
    try {
      const res = await fetch('/.netlify/functions/preguntar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pregunta, equipoId }),
      })
      const datos = await res.json()
      if (!res.ok || !datos.ok) {
        setError(
          datos.error === 'no_configurado' || datos.error === 'limite_diario_superado'
            ? 'La IA no está disponible ahora mismo. Inténtalo más tarde.'
            : 'No he podido responder. Inténtalo de nuevo.'
        )
        return
      }
      setRespuesta(datos.respuesta)
    } catch {
      setError('No he podido conectar. Comprueba tu conexión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="chat-ia">
      <p className="temporada__stats-titulo">Pregunta lo que quieras</p>
      <form onSubmit={enviar} className="chat-ia__form">
        <input
          className="chat-ia__input"
          type="text"
          placeholder="¿Cuándo es el próximo partido?"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          maxLength={300}
        />
        <button type="submit" className="chat-ia__boton" disabled={cargando || !pregunta.trim()}>
          {cargando ? '…' : 'Preguntar'}
        </button>
      </form>
      {respuesta && <p className="chat-ia__respuesta">{respuesta}</p>}
      {error && <p className="chat-ia__error">{error}</p>}
    </div>
  )
}
