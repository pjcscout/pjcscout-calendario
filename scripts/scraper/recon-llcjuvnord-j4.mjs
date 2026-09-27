// Reconocimiento temporal: vuelca la respuesta cruda de la API de la FFCV
// para llc-juv-nord jornada 4, para ver si el partido Alboraya - Ath.
// Massamagrell existe de verdad o el calendario local está desactualizado.
import { writeFileSync } from 'node:fs'

const url = `https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php?cod_temporada=22&cod_competicion=905431546&cod_grupo=905431547&cod_jornada=4&grupo_nombre=${encodeURIComponent('Nord')}&competicion_nombre=x`
const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
const data = await res.json()
writeFileSync('recon-llcjuvnord-j4.json', JSON.stringify(data, null, 2))
console.log(JSON.stringify(data.partidos.map((p) => ({ local: p.local, visitante: p.visitante, estado: p.estado, resultado: p.resultado })), null, 2))
