// Añade a PLANTILLAS los 16 equipos de DH7 (ninguno tenía plantilla previa),
// con la convocatoria real de jornada 1 (RFEF).
import { readFileSync, writeFileSync } from 'node:fs'

const convocatorias = JSON.parse(readFileSync('scripts/scraper/salida-dh7-convocatorias.json', 'utf8'))
let src = readFileSync('src/data/plantillas.js', 'utf8')

function formatearBloque(jugadores) {
  const items = jugadores.map((n) => `"${n}"`)
  const lineas = []
  for (let i = 0; i < items.length; i += 4) {
    lineas.push('    ' + items.slice(i, i + 4).join(', ') + ',')
  }
  return lineas.join('\n')
}

const bloques = Object.entries(convocatorias)
  .map(([id, jugadores]) => `  "${id}": [\n${formatearBloque([...jugadores].sort())}\n  ],`)
  .join('\n')

const comentario = '\n  // División de Honor Juvenil Grupo 7 (RFEF): convocatoria real de jornada 1.\n'

src = src.replace(/\n}\n\nexport function plantillaEquipo/, `${comentario}${bloques}\n}\n\nexport function plantillaEquipo`)

writeFileSync('src/data/plantillas.js', src)
console.log('Añadidos', Object.keys(convocatorias).length, 'equipos de DH7')
