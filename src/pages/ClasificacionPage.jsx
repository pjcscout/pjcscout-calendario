import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { GRUPOS, escudoUrl } from '../data/equipos.js'
import { clasificacionDeGrupo } from '../utils/clasificacion.js'

export default function ClasificacionPage() {
  const { grupo: grupoId } = useParams()
  const navigate = useNavigate()
  const grupo = GRUPOS[grupoId]
  const tabla = grupo ? clasificacionDeGrupo(grupoId) : null

  useEffect(() => {
    if (!grupo) return
    document.title = `Clasificación · ${grupo.nombre} ${grupo.subnombre} · PJC Scout`
  }, [grupo])

  if (!grupo || !tabla) return <Navigate to="/" replace />

  return (
    <div className="clasificacion">
      <button className="temporada__volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h1 className="clasificacion__titulo">Clasificación</h1>
      <p className="clasificacion__meta">
        {grupo.nombre} {grupo.subnombre} · {grupo.temporada}
      </p>

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
            </tr>
          </thead>
          <tbody>
            {tabla.map((fila, indice) => (
              <tr key={fila.equipo.id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tabla.every((fila) => fila.pj === 0) && (
        <p className="clasificacion__aviso">
          La clasificación se irá completando jornada a jornada en cuanto arranque la liga.
        </p>
      )}
    </div>
  )
}
