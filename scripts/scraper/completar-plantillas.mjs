// Contrasta la convocatoria real de jornada 1 (salida-convocatorias.json,
// generado por procesar-jornada1.mjs) contra PLANTILLAS y:
//  - Para equipos SIN plantilla todavía (Tercera Federación), crea la
//    plantilla inicial con los convocados de jornada 1.
//  - Para equipos que YA tienen plantilla (de capturas de WhatsApp de
//    sesiones anteriores), añade los jugadores convocados que falten.
// Nunca borra nada de lo ya existente, solo añade.
import { readFileSync, writeFileSync } from 'node:fs'

const convocatorias = JSON.parse(readFileSync('scripts/scraper/salida-convocatorias.json', 'utf8'))
const plantillasJs = readFileSync('src/data/plantillas.js', 'utf8')

function propio(palabra) {
  return palabra
    .toLowerCase()
    .split(/([\s'-])/)
    .map((p) => (p.length && /[a-záéíóúñ]/.test(p[0]) ? p[0].toUpperCase() + p.slice(1) : p))
    .join('')
}

function formatearNombre(nombreFfcv) {
  const idx = nombreFfcv.indexOf(',')
  if (idx === -1) return propio(nombreFfcv.trim())
  const apellidos = nombreFfcv.slice(0, idx).trim()
  const nombre = nombreFfcv.slice(idx + 1).trim()
  return `${propio(nombre)} ${propio(apellidos)}`.replace(/\s+/g, ' ').trim()
}

function slugNombre(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]+/g, '')
}

// ¿Ya está esta persona en la plantilla existente? Compara por nombre+apellidos
// normalizados (sin acentos/mayúsculas/espacios) para no duplicar por variaciones
// de formato entre la fuente de las plantillas antiguas y la de FFCV.
function yaExiste(nombreNuevo, listaExistente) {
  const slugNuevo = slugNombre(nombreNuevo)
  return listaExistente.some((existente) => {
    const slugExistente = slugNombre(existente)
    return slugExistente === slugNuevo || slugExistente.includes(slugNuevo) || slugNuevo.includes(slugExistente)
  })
}

// Extrae, del código fuente de plantillas.js, el array actual de un equipo
// (o null si no existe todavía ninguna entrada para ese id).
function extraerArrayExistente(id) {
  const re = new RegExp(`"${id}":\\s*\\[([\\s\\S]*?)\\]`)
  const m = plantillasJs.match(re)
  if (!m) return null
  const nombres = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
  return nombres
}

const nuevosPorEquipo = {} // equipoId -> Set(nombre)
for (const partidos of Object.values(convocatorias)) {
  for (const p of partidos) {
    for (const [equipoId, convocados] of [
      [p.localId, p.convocadosLocal],
      [p.visitanteId, p.convocadosVisitante],
    ]) {
      if (!nuevosPorEquipo[equipoId]) nuevosPorEquipo[equipoId] = new Set()
      for (const c of convocados) {
        nuevosPorEquipo[equipoId].add(formatearNombre(c.nombreFfcv))
      }
    }
  }
}

const equiposNuevos = [] // { id, jugadores: [] } — no existían en PLANTILLAS
const equiposAmpliados = [] // { id, añadidos: [] } — ya existían, se añaden jugadores

for (const [equipoId, nombresSet] of Object.entries(nuevosPorEquipo)) {
  const existente = extraerArrayExistente(equipoId)
  const nombres = [...nombresSet].sort()
  if (existente === null) {
    equiposNuevos.push({ id: equipoId, jugadores: nombres })
  } else {
    const añadidos = nombres.filter((n) => !yaExiste(n, existente))
    if (añadidos.length > 0) equiposAmpliados.push({ id: equipoId, existente, añadidos })
  }
}

writeFileSync(
  'scripts/scraper/salida-completar-plantillas.json',
  JSON.stringify({ equiposNuevos, equiposAmpliados }, null, 2)
)

console.log('Equipos nuevos (sin plantilla previa):', equiposNuevos.length)
for (const e of equiposNuevos) console.log(' ', e.id, '-', e.jugadores.length, 'jugadores')
console.log('Equipos ampliados (ya tenían plantilla):', equiposAmpliados.length)
for (const e of equiposAmpliados) console.log(' ', e.id, '- añade', e.añadidos.length, ':', e.añadidos.join(', '))
