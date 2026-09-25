// Fusiona en horarios.js la fecha+hora confirmada de la próxima jornada de
// cada categoría, a partir de horarios-proxima-jornada.json (generado por
// scrape-horarios-ffcv.mjs, que ya lleva el número de jornada de cada
// categoría porque no siempre coinciden entre sí). Solo añade partidos con
// hora confirmada — si la FFCV todavía no la ha publicado para alguno, se
// deja fuera (nunca se inventa una hora, como pide el propio comentario de
// horarios.js).
import { readFileSync, writeFileSync } from 'node:fs'
import { equiposPorGrupo } from '../../src/data/equipos.js'
import { idPartido } from '../../src/data/resultados.js'
import { HORARIOS } from '../../src/data/horarios.js'

const datos = JSON.parse(readFileSync('horarios-proxima-jornada.json', 'utf8'))

function slug(t) {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
const compacto = (t) => slug(t).replace(/-/g, '')
const ALIAS = {
  'Fundación Valencia': ['fundacio vcf', 'fundacion vcf'],
  'Jove Español': ['español de san vicente', 'espanol de san vicente'],
}
function nombreCortoDe(grupo, nombreFfcv) {
  const equipos = equiposPorGrupo(grupo)
  const cp = compacto(nombreFfcv)
  for (const eq of equipos) {
    const candidatos = [compacto(eq.nombre), ...(ALIAS[eq.nombre] || []).map(compacto)]
    if (candidatos.some((c) => cp.includes(c))) return eq
  }
  return null
}

// La FFCV da la fecha como DD/MM/AAAA; el resto del sitio usa AAAA-MM-DD
// (ver calendario.js), así que se normaliza aquí antes de guardarla.
function fechaIso(ddmmaaaa) {
  const [d, m, a] = ddmmaaaa.split('/')
  return `${a}-${m}-${d}`
}

const total = structuredClone(HORARIOS)
let añadidos = 0
const sinMapear = []

for (const [grupo, { jornada, partidos }] of Object.entries(datos)) {
  for (const p of partidos) {
    if (!p.hora || !p.fecha) continue
    const eqLocal = nombreCortoDe(grupo, p.local)
    const eqVisitante = nombreCortoDe(grupo, p.visitante)
    if (!eqLocal || !eqVisitante) {
      sinMapear.push(`${grupo}: ${p.local} vs ${p.visitante}`)
      continue
    }
    const id = idPartido(grupo, jornada, eqLocal.nombre, eqVisitante.nombre)
    total[id] = { fecha: fechaIso(p.fecha), hora: p.hora }
    añadidos++
  }
}

const cuerpo = Object.entries(total)
  .map(([id, h]) => `  ${JSON.stringify(id)}: { fecha: ${JSON.stringify(h.fecha)}, hora: ${JSON.stringify(h.hora)} },`)
  .join('\n')

const contenido = `// Hora confirmada de cada partido, separada de resultados.js. La FFCV no
// publica la hora en el PDF de calendario de la temporada (por eso
// calendarioExport.js genera eventos de día completo), pero sí la confirma
// normalmente el miércoles previo a cada fin de semana en su web de
// resultados — salvo que el partido se aplace, que es un caso aparte.
//
// Se va rellenando semana a semana con scrape-horarios-ffcv.mjs +
// aplicar-horarios.mjs. Mientras una jornada no tenga entrada aquí,
// cualquier aviso/recordatorio debe hablar solo del día, nunca inventar una
// hora.
//
// @type {Record<string, { fecha: string, hora: string }>} indexado por idPartido(...)
export const HORARIOS = {
${cuerpo}
}
`

writeFileSync('src/data/horarios.js', contenido)
console.log('Horarios añadidos:', añadidos, '- total acumulado:', Object.keys(total).length)
if (sinMapear.length) console.log('Sin mapear:', sinMapear)
