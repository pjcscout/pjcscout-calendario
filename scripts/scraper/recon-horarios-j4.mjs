// Reconocimiento temporal: vuelca la respuesta cruda de la API de la FFCV
// para la jornada 4 de las 7 categorías, para ver si trae hora de cada
// partido (además de goles/estado). Se borra tras usarlo.
import { writeFileSync } from 'node:fs'
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'

const salida = {}
for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=4&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  salida[grupo] = await res.json()
}
writeFileSync('recon-horarios-j4.json', JSON.stringify(salida, null, 2))
console.log('Volcado listo')
