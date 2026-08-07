import { formatearFecha } from './fecha.js'

const MARGEN = 14
const ANCHO_PAGINA = 210
const ALTO_PAGINA = 297
const ALTO_LINEA = 7

export async function descargarCalendarioPDF({ equipo, grupo, fixtures }) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(equipo.nombre, MARGEN, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(110)
  doc.text(`${grupo.nombre} ${grupo.subnombre} · Temporada ${grupo.temporada}`, MARGEN, 25)

  let y = 38
  const columnas = [
    { titulo: 'Jorn.', x: MARGEN },
    { titulo: 'Fecha', x: MARGEN + 16 },
    { titulo: 'Cond.', x: MARGEN + 45 },
    { titulo: 'Rival', x: MARGEN + 65 },
    { titulo: 'Resultado', x: ANCHO_PAGINA - MARGEN - 25 },
  ]

  const dibujarCabecera = () => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(0)
    columnas.forEach((col) => doc.text(col.titulo, col.x, y))
    y += 3
    doc.setDrawColor(200)
    doc.line(MARGEN, y, ANCHO_PAGINA - MARGEN, y)
    y += 6
    doc.setFont('helvetica', 'normal')
  }

  dibujarCabecera()

  for (const f of fixtures) {
    if (y > ALTO_PAGINA - MARGEN) {
      doc.addPage()
      y = 20
      dibujarCabecera()
    }

    if (f.bye) {
      doc.setTextColor(150)
      doc.text(`J${f.jornada}`, columnas[0].x, y)
      doc.text('Jornada de descanso', columnas[1].x, y)
      y += ALTO_LINEA
      continue
    }

    const { dia, fecha } = formatearFecha(f.fecha)
    const resultado = f.resultado
      ? `${f.resultado.golesLocal}-${f.resultado.golesVisitante}`
      : '—'

    doc.setTextColor(0)
    doc.text(`J${f.jornada}`, columnas[0].x, y)
    doc.text(`${dia} ${fecha}`, columnas[1].x, y)
    doc.text(f.esLocal ? 'Local' : 'Fuera', columnas[2].x, y)
    doc.text(f.rival, columnas[3].x, y, { maxWidth: 70 })
    doc.text(resultado, columnas[4].x, y)
    y += ALTO_LINEA
  }

  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text('calendario.pjcscout.es', MARGEN, ALTO_PAGINA - 10)

  doc.save(`calendario-${equipo.id}.pdf`)
}
