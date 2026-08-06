// Script de reconocimiento (no forma parte todavía del pipeline diario).
// Objetivo: descargar páginas candidatas del portal de resultados de la FFCV
// e imprimir en los logs de la propia ejecución los enlaces/fragmentos que
// contengan palabras clave de nuestras competiciones, para poder localizar
// los IDs de competición/grupo reales sin necesidad de bajar el HTML entero
// (este entorno de desarrollo no tiene acceso general a internet, pero sí
// puede leer los logs de GitHub Actions).

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
]

function extraerLineasConEnlaces(html, contexto = 60) {
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
  { nombre: 'ffcv-home', url: 'https://ffcv.es/wp/' },
  { nombre: 'isquad-root', url: 'https://resultadosffcv.isquad.es/' },
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
    for (const e of enlaces.slice(0, 60)) console.log(`  - ${e}`)
    if (enlaces.length === 0) {
      console.log('primeros 500 caracteres del body para inspección manual:')
      const bodyStart = texto.indexOf('<body')
      console.log(texto.slice(bodyStart, bodyStart + 500).replace(/\s+/g, ' '))
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`)
  }
}
