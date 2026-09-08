// Procesa las actas de jornada 1 de DH7 (recon-dh7-todas-actas.json) y genera
// eventos reales (gol, tarjeta_amarilla/roja) + portero titular + convocados,
// igual que procesar-jornada1.mjs hace para las categorías FFCV.
import { readFileSync, writeFileSync } from 'node:fs'
import { equiposPorGrupo } from '../../src/data/equipos.js'
import { idPartido } from '../../src/data/resultados.js'

const actas = JSON.parse(readFileSync('scripts/scraper/recon-dh7-todas-actas.json', 'utf8'))

// Alias por el lado RFEF -> id del equipo (nombres abreviados que no son
// substring uno del otro tras compactar, p.ej. "FC Cartagena" vs el nombre
// largo oficial "FUTBOL CLUB CARTAGENA SAD").
const ALIAS_RFEF = {
  'fccartagena': 'dh7-cartagena',
}

function nombreCortoDe(nombreRfef) {
  const equipos = equiposPorGrupo('dh-g7')
  const compacto = (t) =>
    t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '')
  const cp = compacto(nombreRfef)
  if (ALIAS_RFEF[cp]) return equipos.find((eq) => eq.id === ALIAS_RFEF[cp])
  return equipos.find((eq) => cp.includes(compacto(eq.nombre)) || compacto(eq.nombre).includes(cp))
}

function propio(palabra) {
  return palabra
    .toLowerCase()
    .split(/([\s'-])/)
    .map((p) => (p.length && /[a-záéíóúñ]/.test(p[0]) ? p[0].toUpperCase() + p.slice(1) : p))
    .join('')
}

function formatearNombre(apellidosComa) {
  const idx = apellidosComa.indexOf(',')
  if (idx === -1) return propio(apellidosComa.trim())
  const apellidos = apellidosComa.slice(0, idx).trim()
  const nombre = apellidosComa.slice(idx + 1).trim()
  return `${propio(nombre)} ${propio(apellidos)}`.replace(/\s+/g, ' ').trim()
}

// Extrae, de un bloque "Titulares\n<dorsal>\t\t<APELLIDOS, NOMBRE>\n...\nSuplentes",
// la lista { dorsal, nombreRfef } de titulares o suplentes.
function extraerConvocados(lineas, idxInicio, idxFin) {
  const jugadores = []
  for (let i = idxInicio + 1; i < idxFin; i++) {
    const m = lineas[i].match(/^(\d+)\t+(.+,.+)$/)
    if (m) jugadores.push({ dorsal: m[1], nombreRfef: m[2].trim() })
  }
  return jugadores
}

// Tarjetas de un bloque: líneas "(min') NOMBRE" tras la etiqueta "Tarjetas".
function extraerTarjetas(lineas, idxTarjetas, idxFin) {
  const tarjetas = []
  for (let i = idxTarjetas + 1; i < idxFin; i++) {
    const m = lineas[i].match(/^\((\d+)'(?:\+\d+)?\)\s*(.+)$/)
    if (m) tarjetas.push({ minuto: parseInt(m[1], 10), jugador: m[2].trim() })
  }
  return tarjetas
}

const resultadosDh7 = {}
const convocatoriasDh7 = {}

for (const [codActa, textoBruto] of Object.entries(actas)) {
  // La RFEF usa espacios de no separación (U+00A0) en vez de espacios
  // normales en varios sitios (p.ej. "Gol   G. Penalti...").
  const texto = textoBruto.replace(/ /g, ' ')
  const lineas = texto.split('\n').map((l) => l.trim())

  const [nombreLocalRfef, nombreVisitanteRfef] = texto
    .split('\n')
    .find((l) => l.includes('\t\t'))
    .split('\t\t')
    .map((s) => s.trim())

  const eqLocal = nombreCortoDe(nombreLocalRfef)
  const eqVisitante = nombreCortoDe(nombreVisitanteRfef)
  if (!eqLocal || !eqVisitante) {
    console.log('SIN MAPEAR', codActa, nombreLocalRfef, nombreVisitanteRfef)
    continue
  }

  // Goles: "    - \t(min') NOMBRE" entre "Goles" y " Gol     G. Penalti..."
  const idxGoles = lineas.indexOf('Goles')
  const idxFinGoles = lineas.findIndex((l, i) => i > idxGoles && l.startsWith('Gol '))
  // La celda antes del tabulador marca a qué columna pertenece el gol (normal,
  // de penalti o en propia puerta) con un número o un guion — no hace falta
  // distinguirlas aquí, así que se ignora todo lo que hay antes del último tab.
  const goles = []
  for (let i = idxGoles + 1; i < idxFinGoles; i++) {
    const trasTab = lineas[i].split('\t').pop()
    const m = trasTab.match(/^\((\d+)'(?:\+\d+)?\)\s*(.+)$/)
    if (m) goles.push({ minuto: parseInt(m[1], 10), jugador: m[2].trim() })
  }

  // Dos bloques Titulares (local, visitante).
  const idxTitularesA = lineas.indexOf('Titulares')
  const idxSuplentesA = lineas.indexOf('Suplentes', idxTitularesA)
  const idxTitularesB = lineas.indexOf('Titulares', idxSuplentesA)
  const idxSuplentesB = lineas.indexOf('Suplentes', idxTitularesB)
  const idxTarjetasA = lineas.indexOf('Tarjetas', idxSuplentesA)
  const idxTarjetasBInicio = lineas.indexOf('Tarjetas', idxSuplentesB)
  const idxIncidencias = lineas.indexOf('INCIDENCIAS', idxTarjetasBInicio)

  // "Suplentes" termina en "Cuerpo Técnico" — más allá viene el staff y,
  // en "Sustituciones", los mismos dorsales reaparecen (habría duplicados).
  const idxCuerpoTecnicoA = lineas.indexOf('Cuerpo Técnico', idxSuplentesA)
  const idxCuerpoTecnicoB = lineas.indexOf('Cuerpo Técnico', idxSuplentesB)

  const convocadosA = extraerConvocados(lineas, idxTitularesA, idxSuplentesA)
  const suplentesA = extraerConvocados(lineas, idxSuplentesA, idxCuerpoTecnicoA)
  const convocadosB = extraerConvocados(lineas, idxTitularesB, idxSuplentesB)
  const suplentesB = extraerConvocados(lineas, idxSuplentesB, idxCuerpoTecnicoB)

  const tarjetasA = idxTarjetasA !== -1 ? extraerTarjetas(lineas, idxTarjetasA, idxTitularesB) : []
  const tarjetasB = idxTarjetasBInicio !== -1 ? extraerTarjetas(lineas, idxTarjetasBInicio, idxIncidencias !== -1 ? idxIncidencias : lineas.length) : []

  // Atribuir cada gol al equipo cuyo XI (titulares+suplentes) contiene a ese jugador.
  const nombresA = new Set([...convocadosA, ...suplentesA].map((j) => j.nombreRfef))
  const nombresB = new Set([...convocadosB, ...suplentesB].map((j) => j.nombreRfef))
  const eventos = []
  for (const g of goles) {
    const equipoId = nombresA.has(g.jugador) ? eqLocal.id : nombresB.has(g.jugador) ? eqVisitante.id : null
    if (!equipoId) {
      console.log('GOL SIN EQUIPO', codActa, g.jugador)
      continue
    }
    eventos.push({ tipo: 'gol', minuto: g.minuto, jugador: formatearNombre(g.jugador), equipoId })
  }
  // El bloque "Tarjetas" del acta mezcla jugadores y cuerpo técnico/delegados;
  // solo interesan los jugadores (los que están en la lista de convocados).
  for (const t of tarjetasA) {
    if (!nombresA.has(t.jugador)) continue
    eventos.push({ tipo: 'tarjeta_amarilla', minuto: t.minuto, jugador: formatearNombre(t.jugador), equipoId: eqLocal.id })
  }
  for (const t of tarjetasB) {
    if (!nombresB.has(t.jugador)) continue
    eventos.push({ tipo: 'tarjeta_amarilla', minuto: t.minuto, jugador: formatearNombre(t.jugador), equipoId: eqVisitante.id })
  }

  const golesLocal = eventos.filter((e) => e.tipo === 'gol' && e.equipoId === eqLocal.id).length
  const golesVisitante = eventos.filter((e) => e.tipo === 'gol' && e.equipoId === eqVisitante.id).length

  // Portero titular = primer jugador listado en "Titulares" (convención del acta).
  const id = idPartido('dh-g7', 1, eqLocal.nombre, eqVisitante.nombre)
  resultadosDh7[id] = {
    resultado: { golesLocal, golesVisitante },
    eventos,
    porteroLocal: convocadosA[0] ? formatearNombre(convocadosA[0].nombreRfef) : null,
    porteroVisitante: convocadosB[0] ? formatearNombre(convocadosB[0].nombreRfef) : null,
  }

  convocatoriasDh7[eqLocal.id] = [...convocadosA, ...suplentesA].map((j) => formatearNombre(j.nombreRfef))
  convocatoriasDh7[eqVisitante.id] = [...convocadosB, ...suplentesB].map((j) => formatearNombre(j.nombreRfef))
}

writeFileSync('scripts/scraper/salida-dh7-eventos.json', JSON.stringify(resultadosDh7, null, 2))
writeFileSync('scripts/scraper/salida-dh7-convocatorias.json', JSON.stringify(convocatoriasDh7, null, 2))

console.log('Partidos procesados:', Object.keys(resultadosDh7).length, '/ 8')
for (const [id, d] of Object.entries(resultadosDh7)) {
  console.log(id, d.resultado, '- eventos:', d.eventos.length, '- portero local:', d.porteroLocal, '- portero visit:', d.porteroVisitante)
}
console.log('Equipos con convocatoria:', Object.keys(convocatoriasDh7).length, '/ 16')
