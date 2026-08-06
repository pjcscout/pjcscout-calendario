// Script de reconocimiento (no forma parte todavía del pipeline diario).
// Objetivo: descargar páginas candidatas del portal de resultados de la FFCV
// para poder inspeccionar su estructura real y localizar los IDs de
// competición/grupo de cada una de nuestras categorías. Se ejecuta desde
// GitHub Actions (con internet real) y guarda el HTML crudo como artefacto,
// ya que este entorno de desarrollo no tiene acceso general a internet.

import { writeFile, mkdir } from 'node:fs/promises'

const SALIDA = 'recon-output'
await mkdir(SALIDA, { recursive: true })

const candidatos = [
  { nombre: 'ffcv-home', url: 'https://ffcv.es/wp/' },
  { nombre: 'isquad-root', url: 'https://resultadosffcv.isquad.es/' },
  { nombre: 'isquad-clasificacion-ejemplo', url: 'https://resultadosffcv.isquad.es/clasificacion.php?id_temp=19&id_modalidad=33327&id_competicion=900436033&id_torneo=900436038' },
]

for (const { nombre, url } of candidatos) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PJCScoutBot/1.0)' },
    })
    const texto = await res.text()
    await writeFile(`${SALIDA}/${nombre}.html`, texto, 'utf-8')
    console.log(`${nombre}: HTTP ${res.status}, ${texto.length} bytes guardados`)
  } catch (err) {
    console.log(`${nombre}: ERROR ${err.message}`)
    await writeFile(`${SALIDA}/${nombre}.error.txt`, String(err.stack || err), 'utf-8')
  }
}
