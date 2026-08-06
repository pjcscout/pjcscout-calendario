// Script de reconocimiento (no forma parte todavía del pipeline diario).
// Objetivo: localizar los IDs de competición/grupo reales de cada una de
// nuestras categorías en el portal de resultados de la FFCV, imprimiendo en
// los logs de la propia ejecución los enlaces/fragmentos relevantes (este
// entorno de desarrollo no tiene acceso general a internet, pero sí puede
// leer los logs de GitHub Actions).

const PALABRAS_CLAVE = [
  'tercera federaci',
  'tercera ffcv',
  'grup vi',
  'grupo vi',
  'lliga comunitat',
  'liga comunitat',
  'cadete auton',
  'liga nacional juvenil',
  'preferente juvenil',
  'resultadosffcv',
  'isquad',
  'calendario',
  'clasificacion',
  'resultados',
  'competicion',
]

function extraerLineasConEnlaces(html) {
  const encontrados = new Set()
  const regexHref = /href=["']([^"']+)["'][^>]*>([^<]{0,120})/gi
  let m
  while ((m = regexHref.exec(html))) {
    const [, href, texto] = m
    const combinado = `${href} ${texto}`.toLowerCase()
    if (PALABRAS_CLAVE.some((k) => combinado.includes(k))) {
      encontrados.add(`${href} :: ${texto.trim()}`)
    }
  }
  return [...encontrados]
}

const candidatos = [
  { nombre: 'ffcv-noticia-tercera', url: 'https://ffcv.es/wp/blog/2026/08/este-es-el-grupo-vi-de-tercera-federacion-rfef-para-la-temporada-2026-2027/' },
  { nombre: 'ffcv-noticia-lliga-comunitat', url: 'https://ffcv.es/wp/blog/2026/08/estos-son-los-dos-grupos-de-lliga-comunitat-para-la-temporada-2026-2027/' },
  { nombre: 'isquad-hub', url: 'https://hub.isquad.es/isquad-futbol/' },
]

for (const { nombre, url } of candidatos) {
  console.log(`\n=== ${nombre} (${url}) ===`)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PJCScoutBot/1.0)' },
    })
    const texto = await res.text()
    console.log(`HTTP ${res.status}, ${texto.length} bytes`)
    const titulo = texto.match(/<title>([^<]*)<\/title>/i)
    if (titulo) console.log(`title: ${titulo[1]}`)
    const enlaces = extraerLineasConEnlaces(texto)
    console.log(`enlaces relevantes encontrados: ${enlaces.length}`)
    for (const e of enlaces.slice(0, 80)) console.log(`  - ${e}`)

    // Además, busca cualquier URL absoluta hacia isquad.es en el HTML (aunque
    // no vaya envuelta en un <a>, por si el enlace real está en un script/JSON).
    const regexIsquad = /https?:\/\/[^\s"'<>]*isquad\.es[^\s"'<>]*/gi
    const urlsIsquad = new Set(texto.match(regexIsquad) || [])
    if (urlsIsquad.size > 0) {
      console.log(`URLs isquad.es sueltas en el HTML: ${urlsIsquad.size}`)
      for (const u of [...urlsIsquad].slice(0, 40)) console.log(`  * ${u}`)
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`)
  }
}
