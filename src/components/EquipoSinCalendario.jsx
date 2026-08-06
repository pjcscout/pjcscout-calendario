import { GRUPOS, escudoUrl } from '../data/equipos.js'
import { fichaEquipo } from '../data/fichas.js'

export default function EquipoSinCalendario({ equipo, onCambiar }) {
  const grupo = GRUPOS[equipo.grupo]
  const ficha = fichaEquipo(equipo.id)

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
              <strong>Dirección:</strong> {ficha.direccion}
            </p>
          )}
          {(ficha.primera || ficha.segunda) && (
            <div className="temporada__ficha-equipaciones">
              {ficha.primera && (
                <p className="temporada__ficha-linea">
                  <strong>1ª equipación:</strong> camiseta {ficha.primera.camiseta}, pantalón{' '}
                  {ficha.primera.pantalon}, medias {ficha.primera.medias}
                </p>
              )}
              {ficha.segunda && (
                <p className="temporada__ficha-linea">
                  <strong>2ª equipación:</strong> camiseta {ficha.segunda.camiseta}, pantalón{' '}
                  {ficha.segunda.pantalon}, medias {ficha.segunda.medias}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
