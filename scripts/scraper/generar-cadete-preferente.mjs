// Genera src/data/calendarioCadetePreferenteG3.js a partir de
// recon-cadete-pref-calendario.json (30 jornadas descargadas de la API
// pública de la FFCV para Cadete Preferente Grupo III, temporada 2026-2027).
import { readFileSync, writeFileSync } from 'node:fs'

const jornadas = JSON.parse(readFileSync('scripts/scraper/recon-cadete-pref-calendario.json', 'utf8'))

// Nombre oficial FFCV (con comillas simples 'A'/'B') -> nombre normalizado
// para equipos.js (con comillas dobles escapadas, como el resto de la app).
function normalizarNombre(nombreFfcv) {
  return nombreFfcv.replace(/'([AB])'/, '"$1"')
}

function fechaIso(ddmmyyyy) {
  const [d, m, y] = ddmmyyyy.split('/')
  return `${y}-${m}-${d}`
}

const JORNADAS = jornadas.map(({ jornada, datos }) => {
  const fechaMasTemprana = datos.partidos.map((p) => p.fecha).sort((a, b) => {
    const [da, ma, ya] = a.split('/').map(Number)
    const [db, mb, yb] = b.split('/').map(Number)
    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db)
  })[0]
  return {
    numero: jornada,
    fecha: fechaIso(fechaMasTemprana),
    partidos: datos.partidos.map((p) => [normalizarNombre(p.local), normalizarNombre(p.visitante)]),
  }
})

const contenido = `// Calendario real: Lliga Preferent Cadet (Cadete Preferente), Grupo III
// (16 equipos, ida y vuelta). Fuente: API pública de la FFCV.
// Cada partido es [equipoLocal, equipoVisitante] usando el campo \`nombre\`
// real de equipos.js.

export const JORNADAS = ${JSON.stringify(JORNADAS, null, 2)}
`

writeFileSync('src/data/calendarioCadetePreferenteG3.js', contenido)
console.log('Generadas', JORNADAS.length, 'jornadas')

// Volcado de equipos únicos (nombre normalizado), para construir las
// entradas de equipos.js a mano.
const nombres = new Set()
for (const j of JORNADAS) for (const [l, v] of j.partidos) { nombres.add(l); nombres.add(v) }
console.log([...nombres].sort().join('\n'))
