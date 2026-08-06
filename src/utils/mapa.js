// Enlace a Google Maps para la dirección de un campo, sin depender de una
// API key: la búsqueda por texto de Maps ya geolocaliza direcciones españolas
// razonablemente bien.
export function urlMapa(direccion) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`
}
