import { useMemo, useState } from 'react'
import { GRUPOS, equiposPorGrupo, escudoUrl } from '../data/equipos.js'

export default function SelectorEquipo({ onElegir }) {
  const [busqueda, setBusqueda] = useState('')
  const [grupoId, setGrupoId] = useState('tercera-vi')
  const grupo = GRUPOS[grupoId]

  const equipos = useMemo(() => {
    const lista = equiposPorGrupo(grupoId)
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return lista
    return lista.filter(
      (equipo) =>
        equipo.nombre.toLowerCase().includes(texto) ||
        equipo.localidad.toLowerCase().includes(texto)
    )
  }, [busqueda, grupoId])

  return (
    <div className="selector">
      <div className="selector__intro">
        <span className="selector__eyebrow">PJC Scout · Gratis, siempre</span>
        <h1 className="selector__titulo">
          Elige tu equipo.
          <br />
          Ve toda la liga <span className="acento">de un vistazo</span>.
        </h1>
      </div>

      <div className="selector__categorias" role="group" aria-label="Categoría">
        {Object.values(GRUPOS).map((g) => (
          <button
            key={g.id}
            aria-pressed={g.id === grupoId}
            className={`selector__categoria ${g.id === grupoId ? 'selector__categoria--activa' : ''}`}
            onClick={() => setGrupoId(g.id)}
          >
            {g.subnombre ? `${g.nombre} ${g.subnombre}` : g.nombre}
          </button>
        ))}
      </div>

      <p className="selector__sub">
        {grupo.subnombre ? `${grupo.subnombre} — ` : ''}Temporada {grupo.temporada}
      </p>

      <input
        className="selector__buscador"
        type="text"
        placeholder="Busca tu equipo o tu localidad…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        aria-label="Buscar equipo"
      />

      <ul className="selector__lista">
        {equipos.map((equipo) => (
          <li key={equipo.id}>
            <button className="selector__equipo" onClick={() => onElegir(equipo)}>
              <img
                className="selector__escudo"
                src={escudoUrl(equipo)}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'inline-block'
                }}
              />
              <span
                className="selector__punto"
                style={{ background: equipo.color, display: 'none' }}
                aria-hidden="true"
              />
              <span className="selector__nombre">{equipo.nombre}</span>
              <span className="selector__localidad">{equipo.localidad}</span>
            </button>
          </li>
        ))}
        {equipos.length === 0 && (
          <li className="selector__vacio">
            No hay ningún equipo que coincida con &quot;{busqueda}&quot;.
          </li>
        )}
      </ul>
    </div>
  )
}
