// Script local (no CI): procesa jornada1-detalle.json y genera:
//  1. Las entradas RESULTADOS de jornada 1 con eventos reales (gol, tarjeta_amarilla,
//     tarjeta_roja) + el portero titular de cada equipo, listas para pegar en resultados.js.
//  2. Un volcado de las alineaciones (convocados con dorsal) de cada partido, para
//     contrastar a mano contra PLANTILLAS y ver si hay jugadores nuevos.
import { readFileSync, writeFileSync } from 'node:fs'
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

// Cada texto de "Alineaciones" (local o visitante, ya vienen por separado) tiene
// una sola sección Titulares/Suplentes con el formato:
// NOMBRE, APELLIDOS \n Posición \n [C|PT|PS] \n #Dorsal
function extraerPorteroTitular(alineacionTexto) {
  const lineas = alineacionTexto.split('\n').map((l) => l.trim())
  const idxTitulares = lineas.indexOf('Titulares')
  const idxSuplentes = lineas.indexOf('Suplentes')
  if (idxTitulares === -1) return null
  const fin = idxSuplentes !== -1 ? idxSuplentes : lineas.length
  for (let i = idxTitulares; i < fin; i++) {
    if (lineas[i] === 'Portero/a') return lineas[i - 1]
  }
  return null
}

// Convocados (con dorsal) de un texto de Alineaciones: junta Titulares + Suplentes.
function extraerConvocados(alineacionTexto) {
  const lineas = alineacionTexto.split('\n').map((l) => l.trim())
  const idxTitulares = lineas.indexOf('Titulares')
  const idxCuerpoTecnico = lineas.indexOf('Cuerpo técnico', idxTitulares)
  if (idxTitulares === -1) return []
  const fin = idxCuerpoTecnico !== -1 ? idxCuerpoTecnico : lineas.length
  const jugadores = []
  for (let i = idxTitulares; i < fin; i++) {
    if (/^#\d+$/.test(lineas[i])) {
      let j = i - 1
      while (j >= 0 && !lineas[j].includes(',') && lineas[j] !== '') j--
      if (j >= 0 && lineas[j].includes(',')) {
        jugadores.push({ nombreFfcv: lineas[j], dorsal: lineas[i].slice(1) })
      }
    }
  }
  return jugadores
}

const nuevasEntradas = {}
const convocatoriasVolcado = {} // grupo -> [ { local, visitante, convocadosLocal, convocadosVisitante } ]
const sinMapear = []
let porterosDetectados = 0

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
        // Un mismo jugador con varios goles en el partido viene junto, p.ej.
        // "80', 90'" o "29' (p), 45' (p)": un evento "gol" por cada minuto.
        for (const minutoTexto of g.minuto.split(',')) {
          eventos.push({ tipo: 'gol', minuto: minutoTexto.replace(/\(p\)/, '').trim(), jugador: g.jugador, equipoId })
        }
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

    const porteroLocal = p.alineacionesTexto ? extraerPorteroTitular(p.alineacionesTexto) : null
    const porteroVisitante = p.alineacionesVisitanteTexto ? extraerPorteroTitular(p.alineacionesVisitanteTexto) : null
    if (porteroLocal) porterosDetectados++
    if (porteroVisitante) porterosDetectados++

    nuevasEntradas[id] = {
      resultado: { golesLocal, golesVisitante },
      eventos,
      porteros: { local: porteroLocal, visitante: porteroVisitante },
    }

    convocatoriasVolcado[grupo].push({
      local: eqLocal.nombre,
      visitante: eqVisitante.nombre,
      localId: eqLocal.id,
      visitanteId: eqVisitante.id,
      convocadosLocal: p.alineacionesTexto ? extraerConvocados(p.alineacionesTexto) : [],
      convocadosVisitante: p.alineacionesVisitanteTexto ? extraerConvocados(p.alineacionesVisitanteTexto) : [],
    })
  }
}

writeFileSync('scripts/scraper/salida-eventos.json', JSON.stringify(nuevasEntradas, null, 2))
writeFileSync('scripts/scraper/salida-convocatorias.json', JSON.stringify(convocatoriasVolcado, null, 2))

console.log('Entradas de eventos generadas:', Object.keys(nuevasEntradas).length)
console.log('Porteros titulares detectados:', porterosDetectados, '/', Object.keys(nuevasEntradas).length * 2)
console.log('Sin mapear a equipos.js:', sinMapear.length)
console.log(JSON.stringify(sinMapear, null, 2))
