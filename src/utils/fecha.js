const FORMATO_DIA_MES = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' })
const FORMATO_DIA_SEMANA = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })

export function formatearFecha(fechaISO) {
  const fecha = new Date(`${fechaISO}T12:00:00`)
  const diaSemana = FORMATO_DIA_SEMANA.format(fecha).replace('.', '')
  const diaMes = FORMATO_DIA_MES.format(fecha).replace('.', '')
  return {
    dia: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1),
    fecha: diaMes,
  }
}
