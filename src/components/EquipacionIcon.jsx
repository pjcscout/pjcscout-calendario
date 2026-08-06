import { colorHex } from '../utils/colores.js'

const BORDE = '#6b6b63'

function relleno(color, id) {
  if (!color) return '#3a3a38'
  if (Array.isArray(color)) return `url(#${id})`
  return color
}

// Silueta simple de camiseta + pantalón + medias, coloreada con los colores
// reales de la equipación. Cuando un color no es fiable (vacío, "-", "1",
// no reconocido) se pinta en gris neutro en vez de inventar un color. Todas
// las piezas llevan un contorno fino, para que un color oscuro (p.ej. negro)
// no desaparezca sobre el fondo oscuro de la web.
export default function EquipacionIcon({ camiseta, pantalon, medias, etiqueta }) {
  const idCamiseta = `camiseta-${camiseta ?? 'x'}`.replace(/\s+/g, '')
  const colorCamiseta = colorHex(camiseta)
  const colorPantalon = relleno(colorHex(pantalon))
  const colorMedias = relleno(colorHex(medias))

  return (
    <svg
      className="equipacion-icon"
      width="34"
      height="40"
      viewBox="0 0 34 40"
      role="img"
      aria-label={etiqueta}
    >
      {Array.isArray(colorCamiseta) && (
        <linearGradient id={idCamiseta} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colorCamiseta[0]} />
          <stop offset="50%" stopColor={colorCamiseta[0]} />
          <stop offset="50%" stopColor={colorCamiseta[1]} />
          <stop offset="100%" stopColor={colorCamiseta[1]} />
        </linearGradient>
      )}
      {/* medias */}
      <rect x="9" y="30" width="4" height="9" rx="1" fill={colorMedias} stroke={BORDE} strokeWidth={0.5} />
      <rect x="21" y="30" width="4" height="9" rx="1" fill={colorMedias} stroke={BORDE} strokeWidth={0.5} />
      {/* pantalón */}
      <path
        d="M8 22 H26 V31 Q26 33 24 33 H18.5 V26 H15.5 V33 H10 Q8 33 8 31 Z"
        fill={colorPantalon}
        stroke={BORDE}
        strokeWidth={0.5}
      />
      {/* camiseta */}
      <path
        d="M12 3 L4 7 L7 13 L10 11.5 V24 Q10 26 12 26 H22 Q24 26 24 24 V11.5 L27 13 L30 7 L22 3
           Q17 6 12 3 Z"
        fill={relleno(colorCamiseta, idCamiseta)}
        stroke={BORDE}
        strokeWidth={0.6}
      />
    </svg>
  )
}
