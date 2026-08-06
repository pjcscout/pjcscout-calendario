import { useMemo } from 'react'
import { GRUPOS, buscarEquipoPorNombre, escudoUrl } from '../data/equipos.js'
import { fixturesDeEquipo } from '../utils/fixtures.js'
import { formatearFecha } from '../utils/fecha.js'

export default function Temporada({ equipo, onCambiar }) {
  const hoy = new Date().toISOString().slice(0, 10)
  const grupo = GRUPOS[equipo.grupo]

  const fixtures = useMemo(() => fixturesDeEquipo(equipo.nombre, equipo.grupo), [equipo])

  const indiceProxima = useMemo(() => {
    const i = fixtures.findIndex((f) => !f.bye && f.fecha >= hoy)
    return i === -1 ? fixtures.length - 1 : i
  }, [fixtures, hoy])

  const jugadas = fixtures.filter((f) => !f.bye && f.fecha < hoy).length
  const totalJornadas = fixtures.filter((f) => !f.bye).length

  return (
    <div className="temporada">
      <header className="temporada__cabecera">
        <button className="temporada__volver" onClick={onCambiar}>
          ← Cambiar equipo
        </button>
        <div className="temporada__equipo">
          <img
            className="temporada__escudo"
            src={escudoUrl(equipo)}
            alt=""
            width={44}
            height={44}
          />
          <div>
            <h1 className="temporada__nombre">{equipo.nombre}</h1>
            <p className="temporada__meta">
              {grupo.nombre} · {grupo.subnombre} · {grupo.temporada}
            </p>
          </div>
        </div>
        <div className="temporada__progreso">
          <div className="temporada__progreso-barra">
            <div
              className="temporada__progreso-relleno"
              style={{ width: `${(jugadas / totalJornadas) * 100}%` }}
            />
          </div>
          <span className="temporada__progreso-texto">
            Jornada {Math.min(jugadas + 1, totalJornadas)} de {totalJornadas}
          </span>
        </div>
      </header>

      <ol className="temporada__linea" aria-label="Calendario completo de la temporada">
        {fixtures.map((f, indice) => {
          if (f.bye) {
            return (
              <li key={f.jornada} className="jornada jornada--descansa">
                <span className="jornada__numero">J{f.jornada}</span>
                <span className="jornada__descansa-texto">Jornada de descanso</span>
              </li>
            )
          }

          const { dia, fecha } = formatearFecha(f.fecha)
          const esProxima = indice === indiceProxima
          const yaJugada = f.fecha < hoy
          const rival = buscarEquipoPorNombre(f.rival, equipo.grupo)

          return (
            <li
              key={f.jornada}
              className={`jornada ${esProxima ? 'jornada--proxima' : ''} ${yaJugada ? 'jornada--jugada' : ''}`}
            >
              <span className="jornada__numero">J{f.jornada}</span>
              <span className="jornada__fecha">
                <span className="jornada__dia-semana">{dia}</span>
                <span className="jornada__dia-mes">{fecha}</span>
              </span>
              <span className={`jornada__condicion jornada__condicion--${f.esLocal ? 'local' : 'fuera'}`}>
                {f.esLocal ? 'Local' : 'Fuera'}
              </span>
              {rival ? (
                <img
                  className="jornada__escudo-rival"
                  src={escudoUrl(rival)}
                  alt=""
                  width={24}
                  height={24}
                  loading="lazy"
                />
              ) : (
                <span className="jornada__escudo-rival jornada__escudo-rival--vacio" aria-hidden="true" />
              )}
              <span className="jornada__rival">{f.rival}</span>
              <span className="jornada__resultado">
                {yaJugada ? (
                  <span className="jornada__pendiente">—</span>
                ) : (
                  <span className="jornada__vs">vs</span>
                )}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="temporada__stats-teaser">
        <span className="temporada__stats-icono" aria-hidden="true">▲</span>
        <div>
          <p className="temporada__stats-titulo">Estadísticas de jugadores</p>
          <p className="temporada__stats-texto">
            Goles, asistencias y minutos se irán activando jornada a jornada en cuanto arranque la liga.
          </p>
        </div>
      </div>
    </div>
  )
}
