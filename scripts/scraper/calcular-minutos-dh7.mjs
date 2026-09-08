// Calcula minutos jugados por convocado de jornada 1 en DH7, a partir de las
// actas (titulares/suplentes con dorsal + sustituciones con dorsal y minuto).
import { readFileSync, writeFileSync } from 'node:fs'
import { equiposPorGrupo } from '../../src/data/equipos.js'

const actas = JSON.parse(readFileSync('scripts/scraper/recon-dh7-todas-actas.json', 'utf8'))

const ALIAS_RFEF = { fccartagena: 'dh7-cartagena' }
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

// "Sustituciones": bloques de "<dorsalEntra>\t<nombreEntra>" seguidos, unas
// líneas después, de "<dorsalSale>" y "(min') <nombreSale>".
function extraerSustituciones(lineas, idxInicio, idxFin) {
  const subs = []
  let i = idxInicio + 1
  while (i < idxFin) {
    const mEntra = lineas[i].match(/^(\d+)\t+(.+,.+)$/)
    if (!mEntra) {
      i++
      continue
    }
    let j = i + 1
    let dorsalSale = null
    let minuto = null
    while (j < idxFin && minuto === null) {
      if (dorsalSale === null && /^\d+$/.test(lineas[j])) dorsalSale = lineas[j]
      const mMin = lineas[j].match(/^\((\d+)'(?:\+\d+)?\)/)
      if (mMin) minuto = parseInt(mMin[1], 10)
      j++
      // Una nueva sustitución empieza si encontramos otro "dorsal\tnombre" antes de cerrar esta.
      if (j < idxFin && /^(\d+)\t+(.+,.+)$/.test(lineas[j]) && minuto === null) break
    }
    if (dorsalSale !== null && minuto !== null) {
      subs.push({ dorsalEntra: mEntra[1], dorsalSale, minuto: Math.min(minuto, 90) })
    }
    i = j
  }
  return subs
}

const MINUTOS = {}

for (const [codActa, textoBruto] of Object.entries(actas)) {
  const texto = textoBruto.replace(/ /g, ' ')
  const lineas = texto.split('\n').map((l) => l.trim())

  const [nombreLocalRfef, nombreVisitanteRfef] = texto
    .split('\n')
    .find((l) => l.includes('\t\t'))
    .split('\t\t')
    .map((s) => s.trim())
  const eqLocal = nombreCortoDe(nombreLocalRfef)
  const eqVisitante = nombreCortoDe(nombreVisitanteRfef)
  if (!eqLocal || !eqVisitante) continue

  const idxTitularesA = lineas.indexOf('Titulares')
  const idxSuplentesA = lineas.indexOf('Suplentes', idxTitularesA)
  const idxTitularesB = lineas.indexOf('Titulares', idxSuplentesA)
  const idxSuplentesB = lineas.indexOf('Suplentes', idxTitularesB)
  const idxCuerpoTecnicoA = lineas.indexOf('Cuerpo Técnico', idxSuplentesA)
  const idxCuerpoTecnicoB = lineas.indexOf('Cuerpo Técnico', idxSuplentesB)
  const idxSustA = lineas.indexOf('Sustituciones', idxCuerpoTecnicoA)
  const idxTarjetasA = lineas.indexOf('Tarjetas', idxSustA)
  const idxSustB = lineas.indexOf('Sustituciones', idxCuerpoTecnicoB)
  const idxTarjetasB = lineas.indexOf('Tarjetas', idxSustB)

  const titularesA = extraerConvocados(lineas, idxTitularesA, idxSuplentesA)
  const suplentesA = extraerConvocados(lineas, idxSuplentesA, idxCuerpoTecnicoA)
  const titularesB = extraerConvocados(lineas, idxTitularesB, idxSuplentesB)
  const suplentesB = extraerConvocados(lineas, idxSuplentesB, idxCuerpoTecnicoB)
  const sustA = idxSustA !== -1 ? extraerSustituciones(lineas, idxSustA, idxTarjetasA !== -1 ? idxTarjetasA : lineas.length) : []
  const sustB = idxSustB !== -1 ? extraerSustituciones(lineas, idxSustB, idxTarjetasB !== -1 ? idxTarjetasB : lineas.length) : []

  for (const [eq, titulares, suplentes, sustituciones] of [
    [eqLocal, titularesA, suplentesA, sustA],
    [eqVisitante, titularesB, suplentesB, sustB],
  ]) {
    const porDorsal = new Map()
    for (const t of titulares) porDorsal.set(t.dorsal, { nombreRfef: t.nombreRfef, entrada: 0, salida: 90 })
    for (const s of suplentes) porDorsal.set(s.dorsal, { nombreRfef: s.nombreRfef, entrada: null, salida: null })

    for (const sub of sustituciones) {
      const entra = porDorsal.get(sub.dorsalEntra)
      if (entra) {
        entra.entrada = sub.minuto
        entra.salida = 90
      }
      const sale = porDorsal.get(sub.dorsalSale)
      if (sale) sale.salida = sub.minuto
    }

    if (!MINUTOS[eq.id]) MINUTOS[eq.id] = {}
    for (const { nombreRfef, entrada, salida } of porDorsal.values()) {
      if (entrada === null) continue
      MINUTOS[eq.id][formatearNombre(nombreRfef)] = Math.max(0, salida - entrada)
    }
  }
}

writeFileSync('scripts/scraper/salida-minutos-dh7.json', JSON.stringify(MINUTOS, null, 2))
console.log('Equipos con minutos DH7:', Object.keys(MINUTOS).length, '/ 16')
console.log(JSON.stringify(MINUTOS['dh7-elche'], null, 2))
