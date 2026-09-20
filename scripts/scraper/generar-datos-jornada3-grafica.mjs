// Genera un JSON limpio con los resultados de jornada 3 (7 categorías FFCV)
// ya cruzados con equipos.js (id, nombre bonito, escudo), listo para
// alimentar la gráfica de Instagram. Uso local, no CI.
import { readFileSync, writeFileSync } from 'node:fs'
import { equiposPorGrupo, GRUPOS } from '../../src/data/equipos.js'

const data = JSON.parse(readFileSync('jornada3-estado.json', 'utf8'))

function slug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
const compacto = (texto) => slug(texto).replace(/-/g, '')

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

const resultado = {}
const sinMapear = []

for (const [grupo, partidos] of Object.entries(data.ffcv)) {
  const jugados = partidos.filter((p) => p.estado === '1')
  resultado[grupo] = {
    nombre: GRUPOS[grupo].nombre,
    subnombre: GRUPOS[grupo].subnombre,
    partidos: [],
  }
  for (const p of jugados) {
    const eqLocal = nombreCortoDe(grupo, p.local)
    const eqVisitante = nombreCortoDe(grupo, p.visitante)
    if (!eqLocal || !eqVisitante) {
      sinMapear.push({ grupo, local: p.local, visitante: p.visitante })
      continue
    }
    const [golesLocal, golesVisitante] = p.resultado.split('-').map((n) => parseInt(n.trim(), 10))
    resultado[grupo].partidos.push({
      localId: eqLocal.id,
      localNombre: eqLocal.nombre,
      visitanteId: eqVisitante.id,
      visitanteNombre: eqVisitante.nombre,
      golesLocal,
      golesVisitante,
    })
  }
}

writeFileSync('scripts/scraper/datos-jornada3-grafica.json', JSON.stringify(resultado, null, 2))
console.log('Grupos:', Object.keys(resultado).length)
for (const [g, d] of Object.entries(resultado)) console.log(` ${g}: ${d.partidos.length} partidos`)
console.log('Sin mapear:', sinMapear.length, JSON.stringify(sinMapear))
