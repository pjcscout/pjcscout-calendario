import { escudoUrl } from '../data/equipos.js'

export default function FichaJugador({ equipo, nombre, grupo, goles, tarjetas, minutos, onVolver }) {
  return (
    <div className="jugador">
      <button className="temporada__volver" onClick={onVolver}>
        ← Volver
      </button>

      <header className="jugador__cabecera">
        <img className="jugador__escudo" src={escudoUrl(equipo)} alt="" width={40} height={40} />
        <div>
          <h1 className="jugador__nombre">{nombre}</h1>
          <p className="jugador__meta">
            {equipo.nombre} · {grupo.nombre} {grupo.subnombre}
          </p>
        </div>
      </header>

      <div className="jugador__resumen">
        <div className="jugador__stat">
          <span className="jugador__stat-numero">{minutos ?? '—'}</span>
          <span className="jugador__stat-etiqueta">Minutos jugados</span>
        </div>
        <div className="jugador__stat">
          <span className="jugador__stat-numero">{goles.length}</span>
          <span className="jugador__stat-etiqueta">Goles</span>
        </div>
        <div className="jugador__stat">
          <span className="jugador__stat-numero">{tarjetas.length}</span>
          <span className="jugador__stat-etiqueta">Tarjetas</span>
        </div>
      </div>

      {minutos == null && (
        <p className="jugador__aviso">Todavía no ha debutado esta temporada (o no fue convocado en jornada 1).</p>
      )}

      {goles.length > 0 && (
        <div className="jugador__seccion">
          <h2 className="jugador__seccion-titulo">Goles</h2>
          <ul className="jugador__lista">
            {goles.map((g, i) => (
              <li key={i} className="jugador__evento">
                <span className="jugador__evento-jornada">J{g.jornada}</span>
                <span className="jugador__evento-detalle">vs {g.rival}</span>
                <span className="jugador__evento-minuto">⚽ {g.minuto}'</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tarjetas.length > 0 && (
        <div className="jugador__seccion">
          <h2 className="jugador__seccion-titulo">Tarjetas</h2>
          <ul className="jugador__lista">
            {tarjetas.map((t, i) => (
              <li key={i} className="jugador__evento">
                <span className="jugador__evento-jornada">J{t.jornada}</span>
                <span className="jugador__evento-detalle">vs {t.rival}</span>
                <span className="jugador__evento-minuto">
                  {t.tipo === 'tarjeta_roja' ? '🟥' : '🟨'} {t.minuto}'
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="jugador__nota">
        No hay datos de asistencias: la fuente oficial no las publica en el acta pública del partido.
      </p>
    </div>
  )
}
