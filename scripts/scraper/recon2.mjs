// Reconocimiento temporal: comprobar qué datos de la jornada 1 hay
// disponibles en las APIs de FFCV y RFEF, y si incluyen goleadores/asistencias
// (no solo el resultado final). Se borra después de usarlo.
import { COMPETICIONES_FFCV, COD_TEMPORADA_2026_2027 } from '../../src/data/competicionesFfcv.js'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  return { status: res.status, text: await res.text() }
}

console.log('=== FFCV: resultados jornada 1 por grupo ===')
for (const [grupo, cfg] of Object.entries(COMPETICIONES_FFCV)) {
  const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${COD_TEMPORADA_2026_2027}&cod_competicion=${cfg.codCompeticion}&cod_grupo=${cfg.codGrupo}&cod_jornada=1&grupo_nombre=${encodeURIComponent(cfg.nombreGrupo)}&competicion_nombre=x`
  try {
    const { status, text } = await get(url)
    console.log(`--- ${grupo} (status ${status}) ---`)
    console.log(text.slice(0, 4000))
  } catch (e) {
    console.log(`--- ${grupo} ERROR ---`, e.message)
  }
}

console.log('\n=== RFEF DH-G7: jornada 1 ===')
{
  const url = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=${COMPETICION_RFEF_DH_G7.codCompeticion}&CodGrupo=${COMPETICION_RFEF_DH_G7.codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=1`
  try {
    const { status, text } = await get(url)
    console.log(`status ${status}, length ${text.length}`)
    console.log(text.slice(0, 6000))
  } catch (e) {
    console.log('ERROR', e.message)
  }
}

console.log('\n=== FFCV: intentar localizar endpoint de acta / goleadores ===')
{
  // Probar variantes habituales de nombre de endpoint para el acta de un partido.
  const candidatos = [
    'https://ffcv.es/competiciones/api/partidos/acta_data.php',
    'https://ffcv.es/competiciones/api/partidos/detalle_partido_data.php',
  ]
  for (const c of candidatos) {
    try {
      const { status, text } = await get(c)
      console.log(`--- ${c} (status ${status}) ---`)
      console.log(text.slice(0, 500))
    } catch (e) {
      console.log(`--- ${c} ERROR ---`, e.message)
    }
  }
}
