// Sustituye las 8 entradas dh-g7__j1__* (solo marcador) de resultados.js por
// las versiones completas con eventos (gol, tarjeta_amarilla) y porteros,
// generadas por procesar-dh7.mjs a partir de las actas reales de RFEF.
import { readFileSync, writeFileSync } from 'node:fs'

const datosDh7 = JSON.parse(readFileSync('scripts/scraper/salida-dh7-eventos.json', 'utf8'))
let src = readFileSync('src/data/resultados.js', 'utf8')

function jsEvento(e) {
  return `{ tipo: ${JSON.stringify(e.tipo)}, minuto: ${e.minuto}, jugador: ${JSON.stringify(e.jugador)}, equipoId: ${JSON.stringify(e.equipoId)} }`
}

const lineas = src.split('\n')
for (let i = 0; i < lineas.length; i++) {
  const linea = lineas[i]
  const id = Object.keys(datosDh7).find((id) => linea.trim().startsWith(`"${id}":`))
  if (!id) continue
  const datos = datosDh7[id]
  const { golesLocal, golesVisitante } = datos.resultado
  const eventos = datos.eventos.map(jsEvento).join(', ')
  const local = datos.porteroLocal ? JSON.stringify(datos.porteroLocal) : 'null'
  const visitante = datos.porteroVisitante ? JSON.stringify(datos.porteroVisitante) : 'null'
  lineas[i] = `  "${id}": { resultado: { golesLocal: ${golesLocal}, golesVisitante: ${golesVisitante} }, eventos: [${eventos}], porteros: { local: ${local}, visitante: ${visitante} } },`
}
src = lineas.join('\n')

writeFileSync('src/data/resultados.js', src)
console.log('Actualizadas', Object.keys(datosDh7).length, 'entradas de dh-g7')
