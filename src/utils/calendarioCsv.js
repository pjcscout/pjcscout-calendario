import { formatearFecha } from './fecha.js'

function escaparCSV(texto) {
  const valor = String(texto ?? '')
  return /[",\n;]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor
}

export function descargarCalendarioCSV({ equipo, fixtures }) {
  const cabecera = ['Jornada', 'Fecha', 'Condición', 'Rival', 'Resultado']
  const filas = fixtures.map((f) => {
    if (f.bye) return [`J${f.jornada}`, '', 'Descanso', '', '']
    const { dia, fecha } = formatearFecha(f.fecha)
    const resultado = f.resultado ? `${f.resultado.golesLocal}-${f.resultado.golesVisitante}` : ''
    return [`J${f.jornada}`, `${dia} ${fecha}`, f.esLocal ? 'Local' : 'Fuera', f.rival, resultado]
  })

  const contenido = [cabecera, ...filas]
    .map((fila) => fila.map(escaparCSV).join(';'))
    .join('\r\n')

  const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `calendario-${equipo.id}.csv`
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)
  URL.revokeObjectURL(url)
}
