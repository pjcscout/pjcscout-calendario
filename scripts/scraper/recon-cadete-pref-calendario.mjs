// Reconocimiento (temporal): descarga las 30 jornadas de Cadete Preferente
// Grupo III (temporada 2026-2027) con la API pública de la FFCV.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const COD_TEMPORADA = '22'
const COD_COMPETICION = '905431887'
const COD_GRUPO = '905431890'
const TOTAL_JORNADAS = 30

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})
await page.goto('https://ffcv.es/competiciones/', { waitUntil: 'domcontentloaded', timeout: 45000 })

const jornadas = await page.evaluate(
  async ({ codTemporada, codCompeticion, codGrupo, totalJornadas }) => {
    const salida = []
    for (let n = 1; n <= totalJornadas; n++) {
      const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=${codTemporada}&cod_competicion=${codCompeticion}&cod_grupo=${codGrupo}&cod_jornada=${n}`
      const res = await fetch(url)
      const datos = await res.json()
      salida.push({ jornada: n, datos })
    }
    return salida
  },
  { codTemporada: COD_TEMPORADA, codCompeticion: COD_COMPETICION, codGrupo: COD_GRUPO, totalJornadas: TOTAL_JORNADAS }
)

writeFileSync('recon-cadete-pref-calendario.json', JSON.stringify(jornadas))
await browser.close()
console.log('OK, jornadas descargadas:', jornadas.length)
console.log(JSON.stringify(jornadas[0], null, 2).slice(0, 2000))
