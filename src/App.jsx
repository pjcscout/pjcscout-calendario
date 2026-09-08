import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import EquipoPage from './pages/EquipoPage.jsx'
import ClasificacionPage from './pages/ClasificacionPage.jsx'
import JugadorPage from './pages/JugadorPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/equipo/:id" element={<EquipoPage />} />
          <Route path="/equipo/:equipoId/jugador/:nombre" element={<JugadorPage />} />
          <Route path="/clasificacion/:grupo" element={<ClasificacionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
