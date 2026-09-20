// Suma los minutos de jornada 3 (FFCV + DH7) a los que ya hubiera en
// minutosJugados.js, tal y como indica el propio comentario del fichero:
// las jornadas se acumulan, no se sustituyen.
import { readFileSync, writeFileSync } from 'node:fs'
import { MINUTOS_JUGADOS } from '../../src/data/minutosJugados.js'

const nuevosFfcv = JSON.parse(readFileSync('scripts/scraper/salida-minutos-ffcv-j3.json', 'utf8'))
const nuevosDh7 = JSON.parse(readFileSync('scripts/scraper/salida-minutos-dh7-j3.json', 'utf8'))
const nuevos = { ...nuevosFfcv, ...nuevosDh7 }

const total = structuredClone(MINUTOS_JUGADOS)
for (const [equipoId, jugadores] of Object.entries(nuevos)) {
  if (!total[equipoId]) total[equipoId] = {}
  for (const [nombre, minutos] of Object.entries(jugadores)) {
    total[equipoId][nombre] = (total[equipoId][nombre] || 0) + minutos
  }
}

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

const cuerpo = Object.entries(total)
  .map(([equipoId, jugadores]) => `  ${JSON.stringify(equipoId)}: {\n${jsBloque(jugadores)}\n  },`)
  .join('\n')

const contenido = `// Minutos jugados por cada convocado, calculados a partir de las
// alineaciones (titulares/suplentes con dorsal) y las sustituciones
// (entra/sale con dorsal y minuto) de las actas oficiales de cada partido.
//
// Jornadas acumuladas hasta ahora: 1, 2 y 3. Cuando se añadan más hay que sumar
// los minutos nuevos a los que ya hubiera aquí, no sustituirlos.
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
console.log('minutosJugados.js actualizado con', Object.keys(total).length, 'equipos (jornada 1 + 2 + 3 acumuladas)')
