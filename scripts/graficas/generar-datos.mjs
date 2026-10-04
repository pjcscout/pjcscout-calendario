// Genera los datos (JSON) para las gráficas de resultados y clasificación de
// la jornada N (env JORNADA), leyendo directamente resultados.js/calendario*.js
// vía clasificacion.js/fixtures.js — no depende de los ficheros crudos del
// scraper, así que puede volver a ejecutarse en cualquier momento tras la
// fusión de la jornada en el sitio.
import { writeFileSync } from 'node:fs'
import { GRUPOS, equiposPorGrupo } from '../../src/data/equipos.js'
import { RESULTADOS, idPartido } from '../../src/data/resultados.js'
import { jornadasDeGrupo, tieneCalendario } from '../../src/utils/fixtures.js'
import { clasificacionDeGrupo } from '../../src/utils/clasificacion.js'

const JORNADA = parseInt(process.env.JORNADA, 10)
if (!JORNADA) throw new Error('Falta la env var JORNADA (número de jornada)')

// DH7 puede ir desincronizada de las categorías FFCV (p. ej. si descansó un
// fin de semana), así que lleva su propio número de jornada en vez del
// JORNADA que se le pasa a las demás — igual que ya hace
// generar-datos-previa.mjs para la previa.
function jornadaDelGrupo(grupoId) {
  if (grupoId !== 'dh-g7') return JORNADA
  const hoy = new Date().toISOString().slice(0, 10)
  return jornadasDeGrupo('dh-g7')
    .filter((j) => j.fecha <= hoy)
    .at(-1)?.numero
}

const ORDEN = [
  'tercera-vi',
  'liga-nacional',
  'cadete-autonomico',
  'cadete-pref-g3',
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
function formatearFecha(fechasIso) {
  const fechas = [...new Set(fechasIso)].sort()
  if (fechas.length === 0) return ''
  const partes = fechas.map((f) => {
    const [a, m, d] = f.split('-').map((n) => parseInt(n, 10))
    return { dia: d, mes: m, anio: a }
  })
  const primero = partes[0]
  const ultimo = partes[partes.length - 1]
  if (primero.mes === ultimo.mes && primero.anio === ultimo.anio) {
    return primero.dia === ultimo.dia
      ? `${primero.dia} ${MESES[primero.mes - 1]} ${primero.anio}`
      : `${primero.dia} – ${ultimo.dia} ${MESES[primero.mes - 1]} ${primero.anio}`
  }
  return `${primero.dia} ${MESES[primero.mes - 1]} – ${ultimo.dia} ${MESES[ultimo.mes - 1]} ${ultimo.anio}`
}

// --- Resultados de la jornada ---
const gruposResultados = {}
const fechasEncontradas = []

for (const grupoId of ORDEN) {
  if (!tieneCalendario(grupoId)) continue
  const jornadaGrupo = jornadaDelGrupo(grupoId)
  if (!jornadaGrupo) continue
  const jornadas = jornadasDeGrupo(grupoId)
  const jornada = jornadas.find((j) => j.numero === jornadaGrupo)
  if (!jornada) continue

  const partidosJugados = []
  for (const [local, visitante] of jornada.partidos) {
    const info = RESULTADOS[idPartido(grupoId, jornadaGrupo, local, visitante)]
    if (!info?.resultado) continue
    const eqLocal = equiposPorGrupo(grupoId).find((e) => e.nombre === local)
    const eqVisitante = equiposPorGrupo(grupoId).find((e) => e.nombre === visitante)
    if (!eqLocal || !eqVisitante) continue
    const goles = (info.eventos || [])
      .filter((e) => e.tipo === 'gol')
      .sort((a, b) => parseInt(a.minuto, 10) - parseInt(b.minuto, 10))
    partidosJugados.push({
      localId: eqLocal.id,
      localNombre: eqLocal.nombre,
      visitanteId: eqVisitante.id,
      visitanteNombre: eqVisitante.nombre,
      golesLocal: info.resultado.golesLocal,
      golesVisitante: info.resultado.golesVisitante,
      goleadoresLocal: goles.filter((g) => g.equipoId === eqLocal.id).map((g) => ({ jugador: g.jugador, minuto: g.minuto })),
      goleadoresVisitante: goles.filter((g) => g.equipoId === eqVisitante.id).map((g) => ({ jugador: g.jugador, minuto: g.minuto })),
    })
  }
  if (partidosJugados.length === 0) continue

  if (jornada.fecha) fechasEncontradas.push(jornada.fecha)
  gruposResultados[grupoId] = {
    nombre: GRUPOS[grupoId].nombre,
    subnombre: GRUPOS[grupoId].subnombre,
    jornada: jornadaGrupo,
    partidos: partidosJugados,
  }
}

const datosResultados = {
  jornada: JORNADA,
  fechaTexto: formatearFecha(fechasEncontradas),
  grupos: gruposResultados,
}
writeFileSync('scripts/graficas/datos-resultados.json', JSON.stringify(datosResultados, null, 2))
console.log('Resultados jornada', JORNADA, '- ligas con partidos:', Object.keys(gruposResultados).length, Object.keys(gruposResultados))

// --- Clasificación tras la jornada (una por liga que ya haya arrancado) ---
const clasificaciones = {}
for (const grupoId of ORDEN) {
  if (!tieneCalendario(grupoId)) continue
  const tabla = clasificacionDeGrupo(grupoId)
  if (!tabla || !tabla.some((fila) => fila.pj > 0)) continue

  clasificaciones[grupoId] = {
    nombre: GRUPOS[grupoId].nombre,
    subnombre: GRUPOS[grupoId].subnombre,
    jornada: jornadaDelGrupo(grupoId) ?? JORNADA,
    fechaTexto: datosResultados.fechaTexto,
    tabla: tabla.map((fila) => ({
      id: fila.equipo.id,
      nombre: fila.equipo.nombre,
      pj: fila.pj,
      pg: fila.pg,
      pe: fila.pe,
      pp: fila.pp,
      dg: fila.dg,
      pts: fila.pts,
    })),
  }
}
writeFileSync('scripts/graficas/datos-clasificacion.json', JSON.stringify(clasificaciones, null, 2))
console.log('Clasificaciones generadas:', Object.keys(clasificaciones).length, Object.keys(clasificaciones))
