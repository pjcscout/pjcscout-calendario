import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { GRUPOS, buscarEquipoPorNombre, escudoUrl } from '../data/equipos.js'
import { fixturesDeEquipo } from '../utils/fixtures.js'
import { fichaEquipo } from '../data/fichas.js'
import { formatearFecha } from '../utils/fecha.js'
import { urlMapa } from '../utils/mapa.js'
import EquipacionIcon from './EquipacionIcon.jsx'
import CompartirProximoPartido from './CompartirProximoPartido.jsx'
import BotonFavorito from './BotonFavorito.jsx'
import BotonVolverArriba from './BotonVolverArriba.jsx'
import { descargarCalendarioPDF } from '../utils/calendarioPdf.js'
import { descargarCalendarioCSV } from '../utils/calendarioCsv.js'

function resultadoDelEquipo(f) {
  const golesEquipo = f.esLocal ? f.resultado.golesLocal : f.resultado.golesVisitante
  const golesRival = f.esLocal ? f.resultado.golesVisitante : f.resultado.golesLocal
  if (golesEquipo > golesRival) return 'victoria'
  if (golesEquipo < golesRival) return 'derrota'
  return 'empate'
}

export default function Temporada({ equipo, onCambiar }) {
  const hoy = new Date().toISOString().slice(0, 10)
  const grupo = GRUPOS[equipo.grupo]
  const ficha = fichaEquipo(equipo.id)

  const fixtures = useMemo(() => fixturesDeEquipo(equipo.nombre, equipo.grupo), [equipo])

  const indiceProxima = useMemo(() => {
    const i = fixtures.findIndex((f) => !f.bye && f.fecha >= hoy)
    return i === -1 ? fixtures.length - 1 : i
  }, [fixtures, hoy])

  const jugadas = fixtures.filter((f) => !f.bye && f.fecha < hoy).length
  const totalJornadas = fixtures.filter((f) => !f.bye).length

  const racha = useMemo(
    () =>
      fixtures
        .filter((f) => !f.bye && f.resultado)
        .map((f) => resultadoDelEquipo(f)[0].toUpperCase())
        .slice(-5),
    [fixtures]
  )

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
          <BotonFavorito equipoId={equipo.id} />
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
        {racha.length > 0 && (
          <div className="temporada__racha">
            <span className="temporada__racha-etiqueta">Racha</span>
            {racha.map((r, i) => (
              <span key={i} className={`racha-punto racha-punto--${r.toLowerCase()}`}>
                {r}
              </span>
            ))}
          </div>
        )}
        <div className="temporada__acciones-header">
          <Link className="temporada__clasificacion-link" to={`/clasificacion/${equipo.grupo}`}>
            Ver clasificación →
          </Link>
          <button
            type="button"
            className="temporada__pdf-link"
            onClick={() => descargarCalendarioPDF({ equipo, grupo, fixtures })}
          >
            Descargar PDF
          </button>
          <button
            type="button"
            className="temporada__pdf-link"
            onClick={() => descargarCalendarioCSV({ equipo, fixtures })}
          >
            Descargar Excel
          </button>
        </div>
      </header>

      {!fixtures[indiceProxima]?.bye && (
        <CompartirProximoPartido equipo={equipo} partido={fixtures[indiceProxima]} ficha={ficha} />
      )}

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
                {f.resultado ? (
                  <span className={`jornada__marcador jornada__marcador--${resultadoDelEquipo(f)}`}>
                    {f.resultado.golesLocal}-{f.resultado.golesVisitante}
                  </span>
                ) : yaJugada ? (
                  <span className="jornada__pendiente">—</span>
                ) : (
                  <span className="jornada__vs">vs</span>
                )}
              </span>
              {f.eventos?.some((e) => e.tipo === 'gol') && (
                <span className="jornada__goleadores">
                  {f.eventos
                    .filter((e) => e.tipo === 'gol')
                    .map((e, i) => (
                      <span key={i}>
                        ⚽ {e.jugador} {e.minuto}'
                      </span>
                    ))}
                </span>
              )}
            </li>
          )
        })}
      </ol>

      {ficha && (
        <div className="temporada__ficha">
          <h2 className="temporada__ficha-titulo">Sobre el equipo</h2>
          {ficha.campo && (
            <p className="temporada__ficha-linea">
              <strong>Campo:</strong> {ficha.campo}
            </p>
          )}
          {ficha.direccion && (
            <p className="temporada__ficha-linea">
              <strong>Dirección:</strong>{' '}
              <a href={urlMapa(ficha.direccion)} target="_blank" rel="noreferrer">
                {ficha.direccion}
              </a>
            </p>
          )}
          {(ficha.primera || ficha.segunda) && (
            <div className="temporada__ficha-equipaciones">
              {ficha.primera && (
                <div className="temporada__ficha-equipacion">
                  <EquipacionIcon {...ficha.primera} etiqueta="1ª equipación" />
                  <p className="temporada__ficha-linea">
                    <strong>1ª equipación:</strong> camiseta {ficha.primera.camiseta}, pantalón{' '}
                    {ficha.primera.pantalon}, medias {ficha.primera.medias}
                  </p>
                </div>
              )}
              {ficha.segunda && (
                <div className="temporada__ficha-equipacion">
                  <EquipacionIcon {...ficha.segunda} etiqueta="2ª equipación" />
                  <p className="temporada__ficha-linea">
                    <strong>2ª equipación:</strong> camiseta {ficha.segunda.camiseta}, pantalón{' '}
                    {ficha.segunda.pantalon}, medias {ficha.segunda.medias}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="temporada__stats-teaser">
        <span className="temporada__stats-icono" aria-hidden="true">▲</span>
        <div>
          <p className="temporada__stats-titulo">Estadísticas de jugadores</p>
          <p className="temporada__stats-texto">
            Goles, asistencias y minutos se irán activando jornada a jornada en cuanto arranque la liga.
          </p>
        </div>
      </div>

      <BotonVolverArriba />
    </div>
  )
}
