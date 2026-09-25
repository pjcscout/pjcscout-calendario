// Descarga fecha+hora confirmada de la PRÓXIMA jornada (por fecha, no por un
// número fijo) de cada una de las 7 categorías FFCV, directamente de la API
// de resultados (el mismo endpoint que usa scrape-jornada-ffcv.mjs, que ya
// trae "fecha" y "hora" para partidos todavía no jugados). No hace falta
// navegador: son llamadas fetch simples.
//
// Cada categoría calcula su propia "próxima jornada" por fecha en vez de
// recibir un número fijo por fuera, porque no siempre coinciden entre sí
// (ver generar-datos-previa.mjs, que hace el mismo cálculo).
import { writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'
import { jornadasDeGrupo } from '../../src/utils/fixtures.js'

const hoy = new Date().toISOString().slice(0, 10)

const salida = {}
for (const grupo of Object.keys(COMPETICIONES_FFCV)) {
  const siguiente = jornadasDeGrupo(grupo).find((j) => j.fecha >= hoy)
  if (!siguiente) continue // temporada terminada para esta categoría

  const cfg = COMPETICIONES_FFCV[grupo]
  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=${siguiente.numero}&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const data = await res.json()
  salida[grupo] = {
    jornada: siguiente.numero,
    partidos: data.partidos.map((p) => ({
      local: p.local,
      visitante: p.visitante,
      fecha: p.fecha,
      hora: p.hora,
    })),
  }
}

writeFileSync('horarios-proxima-jornada.json', JSON.stringify(salida, null, 2))
console.log('Horarios volcados:', Object.entries(salida).map(([g, d]) => `${g} (j${d.jornada})`).join(', '))
