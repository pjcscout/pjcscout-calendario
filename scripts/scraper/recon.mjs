// Script de reconocimiento (no forma parte todavía del pipeline diario).
const PALABRAS_CLAVE = [
  'tercera federaci', 'tercera ffcv', 'grup vi', 'grupo vi',
  'lliga comunitat', 'liga comunitat', 'cadete auton',
  'liga nacional juvenil', 'preferente juvenil',
  'resultadosffcv', 'isquad', 'calendario', 'clasificacion',
  'resultados', 'competicion',
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
  { nombre: 'ffcv-competiciones', url: 'https://ffcv.es/competiciones/' },
  { nombre: 'rfef-isquad-competiciones', url: 'https://rfef.isquad.es/indexcompeticiones.php' },
]

for (const { nombre, url } of candidatos) {
  console.log(`\n=== ${nombre} (${url}) ===`)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PJCScoutBot/1.0)' },
      redirect: 'follow',
    })
    const texto = await res.text()
    console.log(`HTTP ${res.status} (final url: ${res.url}), ${texto.length} bytes`)
    const titulo = texto.match(/<title>([^<]*)<\/title>/i)
    if (titulo) console.log(`title: ${titulo[1]}`)
    const enlaces = extraerLineasConEnlaces(texto)
    console.log(`enlaces relevantes encontrados: ${enlaces.length}`)
    for (const e of enlaces.slice(0, 80)) console.log(`  - ${e}`)
    if (enlaces.length === 0) {
      const bodyStart = texto.indexOf('<body')
      console.log('primeros 1000 caracteres del body:')
      console.log(texto.slice(bodyStart, bodyStart + 1000).replace(/\s+/g, ' '))
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`)
  }
}
