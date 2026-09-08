// Calcula los minutos jugados por cada convocado de jornada 1 en las 7
// categorías FFCV, a partir de las alineaciones (titulares+suplentes con
// dorsal) y las sustituciones (entra/sale con dorsal y minuto) ya scrapeadas
// en jornada1-detalle.json.
import { readFileSync, writeFileSync } from 'node:fs'
import { equiposPorGrupo } from '../../src/data/equipos.js'

const { resultadoFinal } = JSON.parse(readFileSync('jornada1-detalle.json', 'utf8'))

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

// De un texto de "Alineaciones" (un solo equipo), separa Titulares y
// Suplentes en listas { dorsal, nombreFfcv }.
function extraerXI(alineacionTexto) {
  const lineas = alineacionTexto.split('\n').map((l) => l.trim())
  const idxTitulares = lineas.indexOf('Titulares')
  const idxSuplentes = lineas.indexOf('Suplentes')
  const idxCuerpoTecnico = lineas.indexOf('Cuerpo técnico', idxSuplentes)
  if (idxTitulares === -1 || idxSuplentes === -1) return { titulares: [], suplentes: [] }

  function jugadoresEnRango(inicio, fin) {
    const jugadores = []
    for (let i = inicio; i < fin; i++) {
      const m = lineas[i].match(/^#(\d+)$/)
      if (m) {
        let j = i - 1
        while (j >= 0 && !lineas[j].includes(',') && lineas[j] !== '') j--
        if (j >= 0 && lineas[j].includes(',')) jugadores.push({ dorsal: m[1], nombreFfcv: lineas[j] })
      }
    }
    return jugadores
  }

  return {
    titulares: jugadoresEnRango(idxTitulares, idxSuplentes),
    suplentes: jugadoresEnRango(idxSuplentes, idxCuerpoTecnico !== -1 ? idxCuerpoTecnico : lineas.length),
  }
}

const MINUTOS = {} // equipoId -> { nombreJugador: minutos }
const sinAlineacion = []

for (const [grupo, partidos] of Object.entries(resultadoFinal)) {
  for (const p of partidos) {
    const eqLocal = nombreCortoDe(grupo, p.local)
    const eqVisitante = nombreCortoDe(grupo, p.visitante)
    if (!eqLocal || !eqVisitante) continue

    for (const [lado, eq, texto] of [
      ['local', eqLocal, p.alineacionesTexto],
      ['visitante', eqVisitante, p.alineacionesVisitanteTexto],
    ]) {
      if (!texto) {
        sinAlineacion.push(`${grupo} ${p.local} vs ${p.visitante} (${lado})`)
        continue
      }
      const { titulares, suplentes } = extraerXI(texto)
      if (titulares.length === 0) {
        sinAlineacion.push(`${grupo} ${p.local} vs ${p.visitante} (${lado})`)
        continue
      }

      const minutosPorDorsal = new Map()
      for (const t of titulares) minutosPorDorsal.set(t.dorsal, { nombreFfcv: t.nombreFfcv, entrada: 0, salida: 90 })
      for (const s of suplentes) minutosPorDorsal.set(s.dorsal, { nombreFfcv: s.nombreFfcv, entrada: null, salida: null })

      for (const ev of p.cronologia.eventos) {
        if (ev.tipo !== 'sustitucion' || ev.lado !== lado) continue
        const minuto = Math.min(parseInt(ev.minuto.replace("'", ''), 10), 90)
        const entra = minutosPorDorsal.get(ev.entra.dorsal)
        if (entra) {
          entra.entrada = minuto
          entra.salida = 90
        }
        const sale = minutosPorDorsal.get(ev.sale.dorsal)
        if (sale) sale.salida = minuto
      }

      if (!MINUTOS[eq.id]) MINUTOS[eq.id] = {}
      for (const { nombreFfcv, entrada, salida } of minutosPorDorsal.values()) {
        if (entrada === null) continue // suplente que no llegó a jugar
        const nombre = formatearNombre(nombreFfcv)
        MINUTOS[eq.id][nombre] = Math.max(0, salida - entrada)
      }
    }
  }
}

writeFileSync('scripts/scraper/salida-minutos-ffcv.json', JSON.stringify(MINUTOS, null, 2))
console.log('Equipos con minutos calculados:', Object.keys(MINUTOS).length)
console.log('Sin alineación (', sinAlineacion.length, '):', sinAlineacion)
console.log(JSON.stringify(MINUTOS['saguntino'], null, 2))
