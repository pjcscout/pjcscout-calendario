const SITIO = 'https://calendario.pjcscout.es'

export function establecerCanonical(ruta) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', `${SITIO}${ruta}`)
}
