// Añade las entradas RESULTADOS de la jornada N (env JORNADA, FFCV) y de la
// jornada actual de DH7 a resultados.js, sin tocar las jornadas anteriores
// que ya hubiera. DH7 lleva su propio número de jornada porque puede ir
// desincronizada de las categorías FFCV (ver scrape-jornada-dh7.mjs).
import { readFileSync, writeFileSync } from 'node:fs'
import { jornadasDeGrupo } from '../../src/utils/fixtures.js'

const JORNADA = parseInt(process.env.JORNADA, 10)
if (!JORNADA) throw new Error('Falta la env var JORNADA (número de jornada)')

const hoy = new Date().toISOString().slice(0, 10)
const jornadaDh7 = jornadasDeGrupo('dh-g7')
  .filter((j) => j.fecha <= hoy)
  .at(-1)?.numero

const eventosFfcv = JSON.parse(readFileSync(`scripts/scraper/salida-eventos-j${JORNADA}.json`, 'utf8'))
const eventosDh7 = jornadaDh7 ? JSON.parse(readFileSync(`scripts/scraper/salida-dh7-eventos-j${jornadaDh7}.json`, 'utf8')) : {}

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

console.log('Añadidas', nuevasLineas.length, 'entradas a resultados.js')
console.log('  FFCV jornada', JORNADA, ':', Object.keys(eventosFfcv).length, '- DH7 jornada', jornadaDh7, ':', Object.keys(eventosDh7).length)
