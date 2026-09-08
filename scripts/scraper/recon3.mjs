// Reconocimiento temporal 3: localizar el endpoint de "acta" (goleadores,
// asistencias, tarjetas) de FFCV usando un codacta real, y sortear el aviso
// de cookies de RFEF. Se borra después de usarlo.
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

async function get(url, opts = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', ...opts.headers }, ...opts })
  return { status: res.status, text: await res.text(), headers: Object.fromEntries(res.headers.entries()) }
}

const CODACTA = '26470655' // At. Saguntino 2-1 Levante U.D. 'B', tercera-vi jornada 1

console.log('=== FFCV: candidatos de endpoint de acta (codacta real) ===')
const candidatos = [
  `https://ffcv.es/competiciones/api/partidos/acta_partido_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/api/partidos/ver_acta_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/api/actas/acta_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/api/actas/acta_partido_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/api/partidos/goles_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/api/partidos/goleadores_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/api/partidos/detalle_acta_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/api/partidos/partido_data.php?codacta=${CODACTA}`,
  `https://ffcv.es/competiciones/acta/${CODACTA}`,
  `https://ffcv.es/competiciones/ver-acta/${CODACTA}`,
]
for (const url of candidatos) {
  try {
    const { status, text } = await get(url)
    console.log(`--- ${url} (status ${status}, len ${text.length}) ---`)
    if (status === 200) console.log(text.slice(0, 1500))
  } catch (e) {
    console.log(`--- ${url} ERROR ---`, e.message)
  }
}

console.log('\n=== RFEF DH-G7: reintentar con cabeceras de navegador + cookie ===')
{
  const url = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=${COMPETICION_RFEF_DH_G7.codCompeticion}&CodGrupo=${COMPETICION_RFEF_DH_G7.codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=1`
  try {
    const { status, text } = await get(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Cookie': 'cookie_consent=1; cookieconsent_status=dismiss; CookieConsent=true',
      },
    })
    console.log(`status ${status}, length ${text.length}`)
    console.log(text.slice(0, 6000))
  } catch (e) {
    console.log('ERROR', e.message)
  }
}
console.log('\n=== RFEF: portada para ver si redirige o hay enlace directo a jornada ===')
{
  try {
    const { status, text, headers } = await get('https://marcadores.rfef.es/pnfg/NPortada?CodPortada=1000181')
    console.log(`status ${status}, length ${text.length}`)
    console.log(JSON.stringify(headers))
    console.log(text.slice(0, 1500))
  } catch (e) {
    console.log('ERROR', e.message)
  }
}
