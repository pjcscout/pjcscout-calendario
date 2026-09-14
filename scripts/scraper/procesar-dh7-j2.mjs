// Procesa las actas de jornada 2 de DH7 (jornada2-dh7-actas.json) y genera
// eventos reales (gol, tarjeta_amarilla/roja) + portero titular + convocados,
// igual que procesar-dh7.mjs hace para jornada 1.
import { readFileSync, writeFileSync } from 'node:fs'
import { equiposPorGrupo } from '../../src/data/equipos.js'
import { idPartido } from '../../src/data/resultados.js'

const JORNADA = 2
const actas = JSON.parse(readFileSync('jornada2-dh7-actas.json', 'utf8'))

const ALIAS_RFEF = {
  fccartagena: 'dh7-cartagena',
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

function extraerConvocados(lineas, idxInicio, idxFin) {
  const jugadores = []
  for (let i = idxInicio + 1; i < idxFin; i++) {
    const m = lineas[i].match(/^(\d+)\t+(.+,.+)$/)
    if (m) jugadores.push({ dorsal: m[1], nombreRfef: m[2].trim() })
  }
  return jugadores
}

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

  const idxGoles = lineas.indexOf('Goles')
  const idxFinGoles = lineas.findIndex((l, i) => i > idxGoles && l.startsWith('Gol '))
  const goles = []
  for (let i = idxGoles + 1; i < idxFinGoles; i++) {
    const trasTab = lineas[i].split('\t').pop()
    const m = trasTab.match(/^\((\d+)'(?:\+\d+)?\)\s*(.+)$/)
    if (m) goles.push({ minuto: parseInt(m[1], 10), jugador: m[2].trim() })
  }

  const idxTitularesA = lineas.indexOf('Titulares')
  const idxSuplentesA = lineas.indexOf('Suplentes', idxTitularesA)
  const idxTitularesB = lineas.indexOf('Titulares', idxSuplentesA)
  const idxSuplentesB = lineas.indexOf('Suplentes', idxTitularesB)
  const idxTarjetasA = lineas.indexOf('Tarjetas', idxSuplentesA)
  const idxTarjetasBInicio = lineas.indexOf('Tarjetas', idxSuplentesB)
  const idxIncidencias = lineas.indexOf('INCIDENCIAS', idxTarjetasBInicio)

  const idxCuerpoTecnicoA = lineas.indexOf('Cuerpo Técnico', idxSuplentesA)
  const idxCuerpoTecnicoB = lineas.indexOf('Cuerpo Técnico', idxSuplentesB)

  const convocadosA = extraerConvocados(lineas, idxTitularesA, idxSuplentesA)
  const suplentesA = extraerConvocados(lineas, idxSuplentesA, idxCuerpoTecnicoA)
  const convocadosB = extraerConvocados(lineas, idxTitularesB, idxSuplentesB)
  const suplentesB = extraerConvocados(lineas, idxSuplentesB, idxCuerpoTecnicoB)

  const tarjetasA = idxTarjetasA !== -1 ? extraerTarjetas(lineas, idxTarjetasA, idxTitularesB) : []
  const tarjetasB = idxTarjetasBInicio !== -1 ? extraerTarjetas(lineas, idxTarjetasBInicio, idxIncidencias !== -1 ? idxIncidencias : lineas.length) : []

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

  const id = idPartido('dh-g7', JORNADA, eqLocal.nombre, eqVisitante.nombre)
  resultadosDh7[id] = {
    resultado: { golesLocal, golesVisitante },
    eventos,
    porteroLocal: convocadosA[0] ? formatearNombre(convocadosA[0].nombreRfef) : null,
    porteroVisitante: convocadosB[0] ? formatearNombre(convocadosB[0].nombreRfef) : null,
  }

  convocatoriasDh7[eqLocal.id] = [...convocadosA, ...suplentesA].map((j) => formatearNombre(j.nombreRfef))
  convocatoriasDh7[eqVisitante.id] = [...convocadosB, ...suplentesB].map((j) => formatearNombre(j.nombreRfef))
}

writeFileSync('scripts/scraper/salida-dh7-eventos-j2.json', JSON.stringify(resultadosDh7, null, 2))
writeFileSync('scripts/scraper/salida-dh7-convocatorias-j2.json', JSON.stringify(convocatoriasDh7, null, 2))

console.log('Partidos procesados:', Object.keys(resultadosDh7).length, '/ 8')
for (const [id, d] of Object.entries(resultadosDh7)) {
  console.log(id, d.resultado, '- eventos:', d.eventos.length, '- portero local:', d.porteroLocal, '- portero visit:', d.porteroVisitante)
}
console.log('Equipos con convocatoria:', Object.keys(convocatoriasDh7).length, '/ 16')
