import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import EquipoPage from './pages/EquipoPage.jsx'
import ClasificacionPage from './pages/ClasificacionPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/equipo/:id" element={<EquipoPage />} />
          <Route path="/clasificacion/:grupo" element={<ClasificacionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
