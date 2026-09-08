// Junta salida-minutos-ffcv.json (+ salida-minutos-dh7.json si existe) y
// genera src/data/minutosJugados.js.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const minutosFfcv = JSON.parse(readFileSync('scripts/scraper/salida-minutos-ffcv.json', 'utf8'))
const minutosDh7 = existsSync('scripts/scraper/salida-minutos-dh7.json')
  ? JSON.parse(readFileSync('scripts/scraper/salida-minutos-dh7.json', 'utf8'))
  : {}

const todos = { ...minutosFfcv, ...minutosDh7 }

function jsBloque(jugadores) {
  const items = Object.entries(jugadores)
    .sort((a, b) => b[1] - a[1])
    .map(([nombre, minutos]) => `${JSON.stringify(nombre)}: ${minutos}`)
  const lineas = []
  for (let i = 0; i < items.length; i += 3) {
    lineas.push('    ' + items.slice(i, i + 3).join(', ') + ',')
  }
  return lineas.join('\n')
}

const cuerpo = Object.entries(todos)
  .map(([equipoId, jugadores]) => `  ${JSON.stringify(equipoId)}: {\n${jsBloque(jugadores)}\n  },`)
  .join('\n')

const contenido = `// Minutos jugados por cada convocado, calculados a partir de las
// alineaciones (titulares/suplentes con dorsal) y las sustituciones
// (entra/sale con dorsal y minuto) de las actas oficiales de cada partido.
//
// Por ahora solo hay datos de jornada 1. Cuando se añadan más jornadas hay
// que sumar los minutos nuevos a los que ya hubiera aquí, no sustituirlos.
//
// @type {Record<string, Record<string, number>>} equipoId -> nombreJugador -> minutos
export const MINUTOS_JUGADOS = {
${cuerpo}
}

export function minutosJugadosEquipo(equipoId) {
  return MINUTOS_JUGADOS[equipoId] || null
}
`

writeFileSync('src/data/minutosJugados.js', contenido)
console.log('Generado src/data/minutosJugados.js con', Object.keys(todos).length, 'equipos')
