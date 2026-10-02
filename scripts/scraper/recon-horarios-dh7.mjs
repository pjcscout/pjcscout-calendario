// Reconocimiento temporal: vuelca el HTML crudo de la página de jornada de
// la RFEF para DH7, para ver el formato exacto del onmouseover con
// fecha/hora/lugar de cada partido.
import { writeFileSync } from 'node:fs'
import { COMPETICION_RFEF_DH_G7, COD_TEMPORADA_RFEF_2026_2027 } from '../../src/data/competicionRfef.js'

const JORNADA = process.env.JORNADA || '4'
const url = `https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada?cod_primaria=1000120&CodCompeticion=${COMPETICION_RFEF_DH_G7.codCompeticion}&CodGrupo=${COMPETICION_RFEF_DH_G7.codGrupo}&CodTemporada=${COD_TEMPORADA_RFEF_2026_2027}&CodJornada=${JORNADA}`
const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
const html = await res.text()
writeFileSync('recon-horarios-dh7.html', html)
console.log('Guardado, longitud:', html.length)

const matches = [...html.matchAll(/showhint\(([^)]*)\)/g)].slice(0, 5)
console.log('Ejemplos de showhint encontrados:', matches.length)
for (const m of matches) console.log(m[0].slice(0, 300))
