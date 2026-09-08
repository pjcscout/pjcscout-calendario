// Aplica salida-completar-plantillas.json sobre src/data/plantillas.js:
//  - Añade como nueva entrada cada equipo sin plantilla previa cuya
//    convocatoria de jornada 1 tenga un tamaño de plantilla plausible
//    (>=14 jugadores; por debajo de eso lo más probable es que el scrape de
//    esa alineación concreta se haya cortado, así que no se escribe nada
//    en vez de guardar una plantilla claramente incompleta).
//  - Añade a las plantillas ya existentes los jugadores convocados que
//    falten (nunca borra nada de lo que ya había).
import { readFileSync, writeFileSync } from 'node:fs'

const { equiposNuevos: todosLosNuevos, equiposAmpliados } = JSON.parse(
  readFileSync('scripts/scraper/salida-completar-plantillas.json', 'utf8')
)
// Por debajo de 14 convocados lo más probable es que el scrape de esa
// alineación concreta se cortara a medias, no que el equipo tenga de verdad
// una plantilla tan corta: se descartan en vez de guardar algo incompleto.
const equiposNuevos = todosLosNuevos.filter((e) => e.jugadores.length >= 14)
const descartados = todosLosNuevos.filter((e) => e.jugadores.length < 14)
if (descartados.length) {
  console.log('Descartados por pocos convocados (scrape incompleto):', descartados.map((e) => `${e.id}(${e.jugadores.length})`).join(', '))
}

let src = readFileSync('src/data/plantillas.js', 'utf8')

function formatearBloque(jugadores) {
  // Igual que el resto del fichero: comillas dobles, ~4 nombres por línea.
  const items = jugadores.map((n) => `"${n}"`)
  const lineas = []
  for (let i = 0; i < items.length; i += 4) {
    lineas.push('    ' + items.slice(i, i + 4).join(', ') + ',')
  }
  return lineas.join('\n')
}

// 1) Ampliar equipos existentes: inserta los nombres nuevos justo antes del
//    corchete de cierre de su array.
for (const { id, añadidos } of equiposAmpliados) {
  const re = new RegExp(`("${id}":\\s*\\[[\\s\\S]*?)(\\n?\\s*\\],)`)
  const m = src.match(re)
  if (!m) {
    console.log('AVISO: no se encontró el array de', id, 'para ampliarlo')
    continue
  }
  const nuevosItems = añadidos.map((n) => `"${n}"`)
  const lineasNuevas = []
  for (let i = 0; i < nuevosItems.length; i += 4) {
    lineasNuevas.push('    ' + nuevosItems.slice(i, i + 4).join(', ') + ',')
  }
  const insercion = ',\n' + lineasNuevas.join('\n')
  // Quita la coma final que ya hubiera antes del cierre y añade la nuestra.
  const cuerpoSinComaFinal = m[1].replace(/,\s*$/, '')
  src = src.replace(m[0], cuerpoSinComaFinal + insercion + m[2])
}

// 2) Añadir equipos nuevos (Tercera Federación, principalmente) al final del
//    objeto PLANTILLAS, agrupados bajo un comentario.
const nuevosBloques = equiposNuevos
  .map(
    ({ id, jugadores }) =>
      `  "${id}": [\n${formatearBloque(jugadores)}\n  ],`
  )
  .join('\n')

const comentario =
  '\n  // Tercera Federación y otros equipos sin plantilla previa: convocatoria\n' +
  '  // real de jornada 1 (FFCV), no la plantilla completa del club.\n'

src = src.replace(/\n}\n\nexport function plantillaEquipo/, `${comentario}${nuevosBloques}\n}\n\nexport function plantillaEquipo`)

writeFileSync('src/data/plantillas.js', src)
console.log('Ampliados:', equiposAmpliados.length, '· Nuevos:', equiposNuevos.length)
