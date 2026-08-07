import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { GRUPOS, escudoUrl } from '../data/equipos.js'
import { clasificacionDeGrupo } from '../utils/clasificacion.js'
import { establecerCanonical } from '../utils/seo.js'

const SITIO = 'https://calendario.pjcscout.es'

export default function ClasificacionPage() {
  const { grupo: grupoId } = useParams()
  const navigate = useNavigate()
  const grupo = GRUPOS[grupoId]
  const tabla = grupo ? clasificacionDeGrupo(grupoId) : null
  const hayPartidosJugados = tabla ? !tabla.every((fila) => fila.pj === 0) : false

  useEffect(() => {
    if (!grupo) return
    document.title = `Clasificación · ${grupo.nombre} ${grupo.subnombre} · PJC Scout`
    establecerCanonical(`/clasificacion/${grupoId}`)
  }, [grupo, grupoId])

  if (!grupo || !tabla) return <Navigate to="/" replace />

  const textoWhatsapp =
    `📊 Clasificación de ${grupo.nombre} ${grupo.subnombre}:\n` +
    tabla
      .slice(0, 5)
      .map((fila, indice) => `${indice + 1}. ${fila.equipo.nombre} — ${fila.pts} pts`)
      .join('\n') +
    `\nTabla completa: ${SITIO}/clasificacion/${grupoId}`
  const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(textoWhatsapp)}`

  return (
    <div className="clasificacion">
      <button className="temporada__volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h1 className="clasificacion__titulo">Clasificación</h1>
      <p className="clasificacion__meta">
        {grupo.nombre} {grupo.subnombre} · {grupo.temporada}
      </p>

      {hayPartidosJugados && (
        <a
          className="temporada__compartir-boton clasificacion__compartir"
          href={urlWhatsapp}
          target="_blank"
          rel="noreferrer"
        >
          Compartir por WhatsApp
        </a>
      )}

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
    </div>
  )
}
