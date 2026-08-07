import { useState } from 'react'
import { esFavorito, alternarFavorito } from '../utils/favoritos.js'

export default function BotonFavorito({ equipoId }) {
  const [favorito, setFavorito] = useState(() => esFavorito(equipoId))

  return (
    <button
      type="button"
      className={`boton-favorito ${favorito ? 'boton-favorito--activo' : ''}`}
      onClick={() => setFavorito(alternarFavorito(equipoId).includes(equipoId))}
      aria-pressed={favorito}
      aria-label={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      title={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      {favorito ? '★' : '☆'}
    </button>
  )
}
