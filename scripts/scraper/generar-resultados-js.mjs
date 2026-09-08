// Lee salida-eventos.json (generado por procesar-jornada1.mjs) y regenera
// por completo el objeto RESULTADOS de src/data/resultados.js, añadiendo
// eventos reales (goles, tarjetas) y porteros titulares a los 58 partidos de
// jornada 1 que ya existían solo con el marcador.
import { readFileSync, writeFileSync } from 'node:fs'

const eventosPorPartido = JSON.parse(readFileSync('scripts/scraper/salida-eventos.json', 'utf8'))
const resultadosJs = readFileSync('src/data/resultados.js', 'utf8')

function jsString(texto) {
  return JSON.stringify(texto)
}

function jsEvento(e) {
  // La FFCV a veces publica un minuto centinela ("999'") para tarjetas
  // registradas tras el pitido final sin minuto real asociado.
  const minutoBruto = parseInt(String(e.minuto).replace("'", ''), 10)
  const minuto = minutoBruto > 120 ? 90 : minutoBruto
  return `{ tipo: ${jsString(e.tipo)}, minuto: ${minuto}, jugador: ${jsString(e.jugador)}, equipoId: ${jsString(e.equipoId)} }`
}

function jsPorteros(porteros) {
  if (!porteros) return ''
  const local = porteros.local ? jsString(porteros.local) : 'null'
  const visitante = porteros.visitante ? jsString(porteros.visitante) : 'null'
  return `, porteros: { local: ${local}, visitante: ${visitante} }`
}

const marcador = 'export const RESULTADOS = {'
const idxInicio = resultadosJs.indexOf(marcador)
if (idxInicio === -1) throw new Error('No se encontró el marcador export const RESULTADOS = { en resultados.js')
const cabecera = resultadosJs.slice(0, idxInicio)

const lineas = Object.entries(eventosPorPartido).map(([id, datos]) => {
  const { golesLocal, golesVisitante } = datos.resultado
  const eventos = datos.eventos.map(jsEvento).join(', ')
  return `  ${jsString(id)}: { resultado: { golesLocal: ${golesLocal}, golesVisitante: ${golesVisitante} }, eventos: [${eventos}]${jsPorteros(datos.porteros)} },`
})

const cuerpo = `${marcador}\n${lineas.join('\n')}\n}\n`

writeFileSync('src/data/resultados.js', cabecera + cuerpo)
console.log('resultados.js regenerado con', Object.keys(eventosPorPartido).length, 'partidos.')
