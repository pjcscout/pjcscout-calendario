// Genera los datos (JSON) para la previa de la próxima jornada, una liga por
// slide, igual que resultados/clasificación. A diferencia de esos dos, aquí
// NO se puede usar un único número de JORNADA para las 8 competiciones: cada
// una lleva su propio calendario y no siempre coinciden (p. ej. División de
// Honor Juvenil puede saltarse un fin de semana mientras el resto juega, o
// Cadete Preferente arranca más tarde que las demás). Por eso cada liga
// calcula su propia "próxima jornada" por fecha, y una liga que no tenga
// partidos ese fin de semana simplemente no sale en la previa.
import { writeFileSync } from 'node:fs'
import { GRUPOS, equiposPorGrupo } from '../../src/data/equipos.js'
import { jornadasDeGrupo, tieneCalendario } from '../../src/utils/fixtures.js'
import { idPartido } from '../../src/data/resultados.js'
import { HORARIOS } from '../../src/data/horarios.js'

// Cadete Preferente Grupo III queda fuera de la previa a petición expresa
// del usuario (igual que ya se excluyó de la gráfica de resultados).
const ORDEN = [
  'tercera-vi',
  'liga-nacional',
  'cadete-autonomico',
  'llc-nord',
  'llc-sud',
  'llc-juv-nord',
  'llc-juv-sud',
  'dh-g7',
]

const MESES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]
function formatearFecha(fechaIso) {
  const [a, m, d] = fechaIso.split('-').map((n) => parseInt(n, 10))
  return `${d} ${MESES[m - 1]} ${a}`
}

const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
function formatearDiaCorto(fechaIso) {
  const [a, m, d] = fechaIso.split('-').map((n) => parseInt(n, 10))
  const fecha = new Date(Date.UTC(a, m - 1, d))
  return `${DIAS[fecha.getUTCDay()]} ${d}`
}

const hoy = new Date().toISOString().slice(0, 10)

// Primera pasada: la próxima jornada (por fecha) de cada liga.
const siguientesPorGrupo = {}
for (const grupoId of ORDEN) {
  if (!tieneCalendario(grupoId)) continue
  const siguiente = jornadasDeGrupo(grupoId).find((j) => j.fecha >= hoy)
  if (siguiente) siguientesPorGrupo[grupoId] = siguiente
}

// Una liga puede saltarse el próximo fin de semana (p. ej. División de Honor
// Juvenil) mientras las demás sí juegan: la previa es solo del fin de semana
// más cercano, así que se descarta cualquier liga cuya siguiente jornada caiga
// más adelante que esa fecha mínima.
const fechaMasProxima = Math.min(...Object.values(siguientesPorGrupo).map((j) => new Date(j.fecha).getTime()))

const gruposPrevia = {}
for (const [grupoId, siguiente] of Object.entries(siguientesPorGrupo)) {
  if (new Date(siguiente.fecha).getTime() !== fechaMasProxima) continue

  const partidos = []
  for (const [local, visitante] of siguiente.partidos) {
    const eqLocal = equiposPorGrupo(grupoId).find((e) => e.nombre === local)
    const eqVisitante = equiposPorGrupo(grupoId).find((e) => e.nombre === visitante)
    if (!eqLocal || !eqVisitante) continue
    const horario = HORARIOS[idPartido(grupoId, siguiente.numero, eqLocal.nombre, eqVisitante.nombre)]
    partidos.push({
      localId: eqLocal.id,
      localNombre: eqLocal.nombre,
      visitanteId: eqVisitante.id,
      visitanteNombre: eqVisitante.nombre,
      diaTexto: horario ? formatearDiaCorto(horario.fecha) : null,
      hora: horario?.hora ?? null,
    })
  }
  if (partidos.length === 0) continue

  gruposPrevia[grupoId] = {
    nombre: GRUPOS[grupoId].nombre,
    subnombre: GRUPOS[grupoId].subnombre,
    jornada: siguiente.numero,
    fechaTexto: formatearFecha(siguiente.fecha),
    partidos,
  }
}

writeFileSync('scripts/graficas/datos-previa.json', JSON.stringify(gruposPrevia, null, 2))
console.log('Previa generada (hoy:', hoy, ') - ligas con partidos esta semana:', Object.keys(gruposPrevia).length)
for (const [id, d] of Object.entries(gruposPrevia)) {
  console.log(' ', id, '-> jornada', d.jornada, '(', d.fechaTexto, ') -', d.partidos.length, 'partidos')
}
