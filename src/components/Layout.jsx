import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app">
      <Outlet />
      <footer className="app__footer">
        <a href="https://www.pjcscout.es" target="_blank" rel="noreferrer">
          PJC Scout & Analytics
        </a>
        <span>·</span>
        <span>Datos: FFCV</span>
      </footer>
    </div>
  )
}
