import { GRUPOS, escudoUrl } from '../data/equipos.js'

export default function EquipoSinCalendario({ equipo, onCambiar }) {
  const grupo = GRUPOS[equipo.grupo]

  return (
    <div className="sin-calendario">
      <button className="temporada__volver" onClick={onCambiar}>
        ← Cambiar equipo
      </button>
      <img
        className="sin-calendario__escudo"
        src={escudoUrl(equipo)}
        alt=""
        width={64}
        height={64}
      />
      <h1 className="sin-calendario__nombre">{equipo.nombre}</h1>
      <p className="sin-calendario__meta">
        {grupo.nombre} {grupo.subnombre} · {grupo.temporada}
      </p>
      <p className="sin-calendario__aviso">
        Todavía no tenemos el calendario de esta categoría. En cuanto esté disponible, verás aquí
        la temporada completa jornada a jornada, igual que en el resto de ligas.
      </p>
    </div>
  )
}
