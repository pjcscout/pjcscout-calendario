// Genera enlaces/archivos para añadir un partido al calendario del usuario
// (Google Calendar, Apple Calendar, Outlook...). No conocemos la hora exacta
// de cada partido (la FFCV solo publica la fecha), así que se crean como
// eventos de día completo en vez de inventar una hora.

function comprimirFecha(fechaISO) {
  return fechaISO.replaceAll('-', '')
}

function diaSiguiente(fechaISO) {
  const fecha = new Date(`${fechaISO}T12:00:00`)
  fecha.setDate(fecha.getDate() + 1)
  return fecha.toISOString().slice(0, 10)
}

export function urlGoogleCalendar({ titulo, fechaISO, detalles, ubicacion }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: titulo,
    dates: `${comprimirFecha(fechaISO)}/${comprimirFecha(diaSiguiente(fechaISO))}`,
    details: detalles ?? '',
    location: ubicacion ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function escaparICS(texto) {
  return texto.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
}

export function generarICS({ titulo, fechaISO, detalles, ubicacion }) {
  const ahora = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PJC Scout//Mi Calendario//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${comprimirFecha(fechaISO)}-${Math.random().toString(36).slice(2)}@pjcscout.es`,
    `DTSTAMP:${ahora}`,
    `DTSTART;VALUE=DATE:${comprimirFecha(fechaISO)}`,
    `DTEND;VALUE=DATE:${comprimirFecha(diaSiguiente(fechaISO))}`,
    `SUMMARY:${escaparICS(titulo)}`,
    `DESCRIPTION:${escaparICS(detalles ?? '')}`,
    `LOCATION:${escaparICS(ubicacion ?? '')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function descargarICS({ titulo, fechaISO, detalles, ubicacion }) {
  const contenido = generarICS({ titulo, fechaISO, detalles, ubicacion })
  const blob = new Blob([contenido], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = 'partido.ics'
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)
  URL.revokeObjectURL(url)
}
