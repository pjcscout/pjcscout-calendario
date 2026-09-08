// Script local (no CI): procesa jornada1-detalle.json y genera:
//  1. Las entradas RESULTADOS de jornada 1 con eventos reales (gol, tarjeta_amarilla,
//     tarjeta_roja) + el portero titular de cada equipo, listas para pegar en resultados.js.
//  2. Un volcado de nombres de la convocatoria (Plantillas) de cada partido, para
//     contrastar a mano contra PLANTILLAS y ver si hay jugadores nuevos.
import { readFileSync, writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV } from '../../src/data/competicionesFfcv.js'
import { equiposPorGrupo } from '../../src/data/equipos.js'
import { idPartido } from '../../src/data/resultados.js'

const { resultadoFinal } = JSON.parse(readFileSync('jornada1-detalle.json', 'utf8'))

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

// Extrae, de un texto de "Alineaciones", el/los porteros titulares de cada
// equipo. Formato: "<Equipo A> (form)" "<Equipo B> (form)" "<Equipo A>" "Titulares"
// NOMBRE \n POSICION \n [C|PT|PS] \n #N ... "Suplentes" ... "<Equipo B>" "Titulares" ...
function extraerPorterosTitulares(alineacionesTexto, nombreLocalFfcv, nombreVisitanteFfcv) {
  const lineas = alineacionesTexto.split('\n').map((l) => l.trim())
  const idxTitularesLocal = lineas.indexOf('Titulares')
  const idxSuplentesLocal = lineas.indexOf('Suplentes')
  const idxTitularesVisit = lineas.indexOf('Titulares', idxSuplentesLocal + 1)
  const idxSuplentesVisit = lineas.indexOf('Suplentes', idxTitularesVisit + 1)

  function porteroEnRango(inicio, fin) {
    for (let i = inicio; i < fin; i++) {
      if (lineas[i] === 'Portero/a') {
        // El nombre está 1 o 2 líneas antes (según si hay línea previa vacía).
        return lineas[i - 1]
      }
    }
    return null
  }

  const porteroLocal = idxTitularesLocal !== -1 && idxSuplentesLocal !== -1 ? porteroEnRango(idxTitularesLocal, idxSuplentesLocal) : null
  const porteroVisitante = idxTitularesVisit !== -1 && idxSuplentesVisit !== -1 ? porteroEnRango(idxTitularesVisit, idxSuplentesVisit) : null

  return { porteroLocal, porteroVisitante }
}

const nuevasEntradas = {}
const porterosPorPartido = [] // { grupo, equipoId, equipoNombre, porteroNombre, golesEncajados }
const convocatoriasVolcado = {} // grupo -> [ { local, visitante, plantillasTexto } ]
const sinMapear = []

for (const [grupo, partidos] of Object.entries(resultadoFinal)) {
  convocatoriasVolcado[grupo] = []
  for (const p of partidos) {
    const eqLocal = nombreCortoDe(grupo, p.local)
    const eqVisitante = nombreCortoDe(grupo, p.visitante)
    if (!eqLocal || !eqVisitante) {
      sinMapear.push({ grupo, local: p.local, visitante: p.visitante, eqLocal: !!eqLocal, eqVisitante: !!eqVisitante })
      continue
    }

    const [golesLocal, golesVisitante] = p.resultado.split('-').map((n) => parseInt(n.trim(), 10))
    const id = idPartido(grupo, 1, eqLocal.nombre, eqVisitante.nombre)

    const eventos = []
    for (const ladoInfo of p.cronologia.goleadores) {
      const equipoId = ladoInfo.lado === 'local' ? eqLocal.id : eqVisitante.id
      for (const g of ladoInfo.goles) {
        eventos.push({ tipo: 'gol', minuto: g.minuto, jugador: g.jugador, equipoId })
      }
    }
    for (const ev of p.cronologia.eventos) {
      if (ev.tipo !== 'tarjeta') continue
      const equipoId = ev.lado === 'local' ? eqLocal.id : eqVisitante.id
      eventos.push({
        tipo: ev.color === 'roja' ? 'tarjeta_roja' : 'tarjeta_amarilla',
        minuto: ev.minuto,
        jugador: ev.jugador,
        equipoId,
      })
    }

    nuevasEntradas[id] = { resultado: { golesLocal, golesVisitante }, eventos }

    const { porteroLocal, porteroVisitante } = extraerPorterosTitulares(p.alineacionesTexto, p.local, p.visitante)
    if (porteroLocal) {
      porterosPorPartido.push({ grupo, equipoId: eqLocal.id, equipoNombre: eqLocal.nombre, porteroNombre: porteroLocal, golesEncajados: golesVisitante })
    }
    if (porteroVisitante) {
      porterosPorPartido.push({ grupo, equipoId: eqVisitante.id, equipoNombre: eqVisitante.nombre, porteroNombre: porteroVisitante, golesEncajados: golesLocal })
    }

    convocatoriasVolcado[grupo].push({ local: eqLocal.nombre, visitante: eqVisitante.nombre, plantillasTexto: p.plantillasTexto })
  }
}

writeFileSync('scripts/scraper/salida-eventos.json', JSON.stringify(nuevasEntradas, null, 2))
writeFileSync('scripts/scraper/salida-porteros.json', JSON.stringify(porterosPorPartido, null, 2))
writeFileSync('scripts/scraper/salida-convocatorias.json', JSON.stringify(convocatoriasVolcado, null, 2))

console.log('Entradas de eventos generadas:', Object.keys(nuevasEntradas).length)
console.log('Porteros titulares detectados:', porterosPorPartido.length)
console.log('Sin mapear a equipos.js:', sinMapear.length)
console.log(JSON.stringify(sinMapear, null, 2))
