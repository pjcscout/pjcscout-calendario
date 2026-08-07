import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BotonTema from './BotonTema.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const esPrimeraCarga = useRef(true)

  // Al cambiar de ruta en una SPA el navegador no anuncia nada nuevo por sí
  // solo: movemos el foco al contenido para que lectores de pantalla y
  // navegación por teclado se enteren de que la página ha cambiado.
  useEffect(() => {
    if (esPrimeraCarga.current) {
      esPrimeraCarga.current = false
      return
    }
    mainRef.current?.focus()
  }, [pathname])

  return (
    <div className="app">
      <BotonTema />
      <main ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="app__footer">
        <div className="app__footer-fila">
          <a href="https://www.pjcscout.es" target="_blank" rel="noreferrer">
            PJC Scout & Analytics
          </a>
          <span>·</span>
          <span>Datos: FFCV</span>
        </div>
        <div className="app__footer-legal">
          <a href="/legal/aviso-legal.html">Aviso legal</a>
          <span>·</span>
          <a href="/legal/privacidad.html">Privacidad</a>
          <span>·</span>
          <a href="/legal/cookies.html">Cookies</a>
        </div>
      </footer>
    </div>
  )
}
