// Descarga fecha+hora confirmada de cada partido de la jornada N (env
// JORNADA) en las 7 categorías FFCV, directamente de la API de resultados
// (el mismo endpoint que usa scrape-jornada-ffcv.mjs, que ya trae "fecha" y
// "hora" para partidos todavía no jugados). No hace falta navegador: son
// llamadas fetch simples.
import { writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const JORNADA = process.env.JORNADA
if (!JORNADA) throw new Error('Falta la env var JORNADA (número de jornada)')

const salida = {}
for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=${JORNADA}&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const data = await res.json()
  salida[grupo] = data.partidos.map((p) => ({
    local: p.local,
    visitante: p.visitante,
    fecha: p.fecha,
    hora: p.hora,
  }))
}

writeFileSync(`jornada${JORNADA}-horarios.json`, JSON.stringify(salida, null, 2))
console.log('Horarios volcados para jornada', JORNADA)
