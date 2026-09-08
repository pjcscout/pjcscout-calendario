import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Routes, Route } from 'react-router-dom'
import Temporada from './components/Temporada.jsx'
import EquipoSinCalendario from './components/EquipoSinCalendario.jsx'
import FichaJugador from './components/FichaJugador.jsx'
import ClasificacionPage from './pages/ClasificacionPage.jsx'
import { tieneCalendario } from './utils/fixtures.js'
import { GRUPOS } from './data/equipos.js'
import { estadisticasJugador } from './utils/estadisticasJugador.js'

export function renderEquipo(equipo) {
  const Componente = tieneCalendario(equipo.grupo) ? Temporada : EquipoSinCalendario
  return renderToStaticMarkup(
    <StaticRouter location={`/equipo/${equipo.id}`}>
      <Componente equipo={equipo} onCambiar={() => {}} />
    </StaticRouter>
  )
}

export function renderJugador(equipo, nombre) {
  const grupo = GRUPOS[equipo.grupo]
  const { goles, tarjetas, minutos } = estadisticasJugador(equipo.grupo, equipo.id, nombre)
  return renderToStaticMarkup(
    <StaticRouter location={`/equipo/${equipo.id}/jugador/${encodeURIComponent(nombre)}`}>
      <FichaJugador
        equipo={equipo}
        nombre={nombre}
        grupo={grupo}
        goles={goles}
        tarjetas={tarjetas}
        minutos={minutos}
        onVolver={() => {}}
      />
    </StaticRouter>
  )
}

export function renderClasificacion(grupoId) {
  return renderToStaticMarkup(
    <StaticRouter location={`/clasificacion/${grupoId}`}>
      <Routes>
        <Route path="/clasificacion/:grupo" element={<ClasificacionPage />} />
      </Routes>
    </StaticRouter>
  )
}
