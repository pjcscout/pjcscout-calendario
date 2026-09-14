import { GRUPOS, escudoUrl } from '../data/equipos.js'
import { clasificacionDeGrupo } from '../utils/clasificacion.js'
import { pichichiDeGrupo, ranquingPorteros, tarjetasDeGrupo } from '../utils/estadisticasJugadores.js'

/**
 * Clasificación general + Pichichi + Trofeo Zamora + clasificación de
 * tarjetas de un grupo. Se usa tanto en la página independiente
 * /clasificacion/:grupo como embebida en la ficha de cada equipo (ahí con
 * `equipoDestacadoId` para resaltar la fila del propio equipo).
 */
export default function ClasificacionLiga({ grupoId, equipoDestacadoId }) {
  const grupo = GRUPOS[grupoId]
  const tabla = grupo ? clasificacionDeGrupo(grupoId) : null
  if (!grupo || !tabla) return null

  const hayPartidosJugados = !tabla.every((fila) => fila.pj === 0)
  const pichichi = hayPartidosJugados ? pichichiDeGrupo(grupoId) : []
  const porteros = hayPartidosJugados ? ranquingPorteros(grupoId) : []
  const tarjetas = hayPartidosJugados ? tarjetasDeGrupo(grupoId) : []
  const equipoDe = (equipoId) => tabla.find((fila) => fila.equipo.id === equipoId)?.equipo

  return (
    <div className="clasificacion-liga">
      <div className="clasificacion__tabla-scroll">
        <table className="clasificacion__tabla">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" className="clasificacion__col-equipo">
                Equipo
              </th>
              <th scope="col">PJ</th>
              <th scope="col">PG</th>
              <th scope="col">PE</th>
              <th scope="col">PP</th>
              <th scope="col">GF</th>
              <th scope="col">GC</th>
              <th scope="col">DG</th>
              <th scope="col">Pts</th>
              <th scope="col">Racha</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((fila, indice) => (
              <tr key={fila.equipo.id} className={fila.equipo.id === equipoDestacadoId ? 'clasificacion__fila--propia' : ''}>
                <td>{indice + 1}</td>
                <td className="clasificacion__col-equipo">
                  <img
                    className="clasificacion__escudo"
                    src={escudoUrl(fila.equipo)}
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                  {fila.equipo.nombre}
                </td>
                <td>{fila.pj}</td>
                <td>{fila.pg}</td>
                <td>{fila.pe}</td>
                <td>{fila.pp}</td>
                <td>{fila.gf}</td>
                <td>{fila.gc}</td>
                <td>{fila.dg}</td>
                <td className="clasificacion__pts">{fila.pts}</td>
                <td>
                  <div className="clasificacion__racha">
                    {fila.racha.map((r, i) => (
                      <span key={i} className={`racha-punto racha-punto--${r.toLowerCase()}`}>
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hayPartidosJugados && (
        <p className="clasificacion__aviso">
          La clasificación se irá completando jornada a jornada en cuanto arranque la liga.
        </p>
      )}

      {pichichi.length > 0 && (
        <div className="clasificacion__estadisticas">
          <h3 className="clasificacion__estadisticas-titulo">🥇 Pichichi</h3>
          <p className="clasificacion__estadisticas-nota">
            Datos de las actas oficiales de la federación. No incluye asistencias: la fuente no las publica.
          </p>
          <div className="clasificacion__tabla-scroll">
            <table className="clasificacion__tabla">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Jugador</th>
                  <th scope="col" className="clasificacion__col-equipo">
                    Equipo
                  </th>
                  <th scope="col">Goles</th>
                </tr>
              </thead>
              <tbody>
                {pichichi.map((fila, indice) => {
                  const equipo = equipoDe(fila.equipoId)
                  return (
                    <tr key={`${fila.equipoId}__${fila.jugador}`} className={fila.equipoId === equipoDestacadoId ? 'clasificacion__fila--propia' : ''}>
                      <td>{indice + 1}</td>
                      <td>{fila.jugador}</td>
                      <td className="clasificacion__col-equipo">
                        {equipo && (
                          <img
                            className="clasificacion__escudo"
                            src={escudoUrl(equipo)}
                            alt=""
                            width={20}
                            height={20}
                            loading="lazy"
                          />
                        )}
                        {equipo?.nombre}
                      </td>
                      <td>{fila.goles}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {porteros.length > 0 && (
        <div className="clasificacion__estadisticas">
          <h3 className="clasificacion__estadisticas-titulo">🧤 Trofeo Zamora</h3>
          <p className="clasificacion__estadisticas-nota">Portero con mejor promedio de goles encajados por partido.</p>
          <div className="clasificacion__tabla-scroll">
            <table className="clasificacion__tabla">
              <thead>
                <tr>
                  <th scope="col">Portero</th>
                  <th scope="col" className="clasificacion__col-equipo">
                    Equipo
                  </th>
                  <th scope="col">PJ</th>
                  <th scope="col">GC</th>
                  <th scope="col">GC/partido</th>
                </tr>
              </thead>
              <tbody>
                {porteros.map((p) => {
                  const equipo = equipoDe(p.equipoId)
                  return (
                    <tr key={`${p.equipoId}__${p.nombre}`} className={p.equipoId === equipoDestacadoId ? 'clasificacion__fila--propia' : ''}>
                      <td>{p.nombre}</td>
                      <td className="clasificacion__col-equipo">
                        {equipo && (
                          <img
                            className="clasificacion__escudo"
                            src={escudoUrl(equipo)}
                            alt=""
                            width={20}
                            height={20}
                            loading="lazy"
                          />
                        )}
                        {equipo?.nombre}
                      </td>
                      <td>{p.partidos}</td>
                      <td>{p.golesEncajados}</td>
                      <td>{p.promedio.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tarjetas.length > 0 && (
        <div className="clasificacion__estadisticas">
          <h3 className="clasificacion__estadisticas-titulo">🟨 Clasificación de tarjetas</h3>
          <div className="clasificacion__tabla-scroll">
            <table className="clasificacion__tabla">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Jugador</th>
                  <th scope="col" className="clasificacion__col-equipo">
                    Equipo
                  </th>
                  <th scope="col">🟨</th>
                  <th scope="col">🟥</th>
                </tr>
              </thead>
              <tbody>
                {tarjetas.map((fila, indice) => {
                  const equipo = equipoDe(fila.equipoId)
                  return (
                    <tr key={`${fila.equipoId}__${fila.jugador}`} className={fila.equipoId === equipoDestacadoId ? 'clasificacion__fila--propia' : ''}>
                      <td>{indice + 1}</td>
                      <td>{fila.jugador}</td>
                      <td className="clasificacion__col-equipo">
                        {equipo && (
                          <img
                            className="clasificacion__escudo"
                            src={escudoUrl(equipo)}
                            alt=""
                            width={20}
                            height={20}
                            loading="lazy"
                          />
                        )}
                        {equipo?.nombre}
                      </td>
                      <td>{fila.amarillas}</td>
                      <td>{fila.rojas}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
