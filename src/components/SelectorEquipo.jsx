import { useMemo, useState } from 'react'
import { EQUIPOS, GRUPOS, equiposPorGrupo, escudoUrl } from '../data/equipos.js'
import { obtenerFavoritos } from '../utils/favoritos.js'
import { obtenerHistorial } from '../utils/historial.js'
import { normalizarTexto } from '../utils/normalizarTexto.js'

function FilaEquipo({ equipo, onElegir }) {
  return (
    <li>
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
  )
}

export default function SelectorEquipo({ onElegir }) {
  const [busqueda, setBusqueda] = useState('')
  const [grupoId, setGrupoId] = useState('tercera-vi')
  const [favoritos] = useState(() => obtenerFavoritos())
  const [historial] = useState(() => obtenerHistorial())
  const grupo = GRUPOS[grupoId]

  const equiposFavoritos = useMemo(
    () => favoritos.map((id) => EQUIPOS.find((e) => e.id === id)).filter(Boolean),
    [favoritos]
  )

  const equiposRecientes = useMemo(
    () =>
      historial
        .map((id) => EQUIPOS.find((e) => e.id === id))
        .filter(Boolean)
        .filter((equipo) => !favoritos.includes(equipo.id)),
    [historial, favoritos]
  )

  const equipos = useMemo(() => {
    const lista = equiposPorGrupo(grupoId)
    const texto = normalizarTexto(busqueda.trim())
    if (!texto) return lista
    return lista.filter(
      (equipo) =>
        normalizarTexto(equipo.nombre).includes(texto) ||
        normalizarTexto(equipo.localidad).includes(texto)
    )
  }, [busqueda, grupoId])

  return (
    <div className="selector">
      <div className="selector__intro">
        <span className="selector__eyebrow">PJC Scout · Gratis, sin anuncios, siempre</span>
        <h1 className="selector__titulo">
          Tu equipo.
          <br />
          Toda la temporada <span className="acento">de un vistazo</span>.
        </h1>
      </div>

      {equiposFavoritos.length > 0 && (
        <div className="selector__favoritos">
          <p className="selector__favoritos-titulo">Tus equipos</p>
          <ul className="selector__lista">
            {equiposFavoritos.map((equipo) => (
              <FilaEquipo key={equipo.id} equipo={equipo} onElegir={onElegir} />
            ))}
          </ul>
        </div>
      )}

      {equiposRecientes.length > 0 && (
        <div className="selector__favoritos">
          <p className="selector__favoritos-titulo">Vistos recientemente</p>
          <ul className="selector__lista">
            {equiposRecientes.map((equipo) => (
              <FilaEquipo key={equipo.id} equipo={equipo} onElegir={onElegir} />
            ))}
          </ul>
        </div>
      )}

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
          <FilaEquipo key={equipo.id} equipo={equipo} onElegir={onElegir} />
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
