import { useEffect, useState } from 'react'

export default function BotonVolverArriba() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="volver-arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      ↑
    </button>
  )
}
