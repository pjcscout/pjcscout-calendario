// Añade las entradas RESULTADOS de jornada 2 (FFCV + DH7) a resultados.js,
// sin tocar las de jornada 1 que ya había.
import { readFileSync, writeFileSync } from 'node:fs'

const eventosFfcv = JSON.parse(readFileSync('scripts/scraper/salida-eventos-j2.json', 'utf8'))
const eventosDh7 = JSON.parse(readFileSync('scripts/scraper/salida-dh7-eventos-j2.json', 'utf8'))

function jsString(texto) {
  return JSON.stringify(texto)
}

function jsEventoFfcv(e) {
  const minutoBruto = parseInt(String(e.minuto).replace("'", ''), 10)
  const minuto = minutoBruto > 120 ? 90 : minutoBruto
  return `{ tipo: ${jsString(e.tipo)}, minuto: ${minuto}, jugador: ${jsString(e.jugador)}, equipoId: ${jsString(e.equipoId)} }`
}

function jsEventoDh7(e) {
  return `{ tipo: ${jsString(e.tipo)}, minuto: ${e.minuto}, jugador: ${jsString(e.jugador)}, equipoId: ${jsString(e.equipoId)} }`
}

const nuevasLineas = []

for (const [id, datos] of Object.entries(eventosFfcv)) {
  const { golesLocal, golesVisitante } = datos.resultado
  const eventos = datos.eventos.map(jsEventoFfcv).join(', ')
  const local = datos.porteros?.local ? jsString(datos.porteros.local) : 'null'
  const visitante = datos.porteros?.visitante ? jsString(datos.porteros.visitante) : 'null'
  nuevasLineas.push(
    `  ${jsString(id)}: { resultado: { golesLocal: ${golesLocal}, golesVisitante: ${golesVisitante} }, eventos: [${eventos}], porteros: { local: ${local}, visitante: ${visitante} } },`
  )
}

for (const [id, datos] of Object.entries(eventosDh7)) {
  const { golesLocal, golesVisitante } = datos.resultado
  const eventos = datos.eventos.map(jsEventoDh7).join(', ')
  const local = datos.porteroLocal ? jsString(datos.porteroLocal) : 'null'
  const visitante = datos.porteroVisitante ? jsString(datos.porteroVisitante) : 'null'
  nuevasLineas.push(
    `  ${jsString(id)}: { resultado: { golesLocal: ${golesLocal}, golesVisitante: ${golesVisitante} }, eventos: [${eventos}], porteros: { local: ${local}, visitante: ${visitante} } },`
  )
}

const resultadosJs = readFileSync('src/data/resultados.js', 'utf8')
const idxCierre = resultadosJs.lastIndexOf('\n}')
if (idxCierre === -1) throw new Error('No se encontró el cierre del objeto RESULTADOS')

const nuevoContenido = resultadosJs.slice(0, idxCierre) + '\n' + nuevasLineas.join('\n') + resultadosJs.slice(idxCierre)
writeFileSync('src/data/resultados.js', nuevoContenido)

console.log('Añadidas', nuevasLineas.length, 'entradas de jornada 2 a resultados.js')
console.log('  FFCV:', Object.keys(eventosFfcv).length, '- DH7:', Object.keys(eventosDh7).length)
