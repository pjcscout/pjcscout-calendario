// Segunda pasada de reconocimiento: ahora que sabemos que ffcv.es/competiciones
// expone una API AJAX limpia por parámetros (cod_competicion, cod_grupo,
// cod_jornada...), la llamamos directamente (fetch, sin navegador) para:
// 1) encontrar los grupos (Sud/Nord, etc.) de cada competición que usamos
// 2) ver la forma real de la respuesta de resultados y clasificación
// Y exploramos rfef.isquad.es con más profundidad, ya que la primera pasada
// no encontró ningún <select> en la carga inicial.
import { chromium } from 'playwright'

async function fetchTexto(url) {
  try {
    const res = await fetch(url, {
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'User-Agent': 'Mozilla/5.0' },
    })
    const texto = await res.text()
    return { status: res.status, texto }
  } catch (e) {
    return { status: 'ERROR', texto: e.message }
  }
}

function log(seccion, datos) {
  console.log(`\n=== ${seccion} ===`)
  console.log(typeof datos === 'string' ? datos : JSON.stringify(datos, null, 2))
}

// --- FFCV: grupos de cada competición que usamos ---
const COMPETICIONES_FFCV = {
  'tercera-federacion': 905431604,
  'lliga-comunitat': 905431821,
  'lliga-comunitat-juvenil': 905431546,
  'lliga-autonomica-cadet': 905431885,
  'liga-nacional-juvenil': 905431878,
}

for (const [nombre, cod] of Object.entries(COMPETICIONES_FFCV)) {
  const { status, texto } = await fetchTexto(
    `https://ffcv.es/competiciones/api/filtros/grupos_fetch.php?cod_competicion=${cod}`
  )
  log(`FFCV grupos - ${nombre} (cod_competicion=${cod}) [status ${status}]`, texto.slice(0, 3000))
}

// --- FFCV: forma real de resultados y clasificación (Tercera Federación Grupo VI) ---
const urlResultados =
  'https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php' +
  '?cod_temporada=22&cod_competicion=905431604&cod_grupo=905431605&cod_jornada=1' +
  '&grupo_nombre=GRUP+-+VI&competicion_nombre=Tercera+Federaci%C3%B3n'
const resResultados = await fetchTexto(urlResultados)
log(`FFCV resultados jornada 1 [status ${resResultados.status}]`, resResultados.texto.slice(0, 4000))

const urlClasificacion =
  'https://ffcv.es/competiciones/api/clasificaciones/clasificaciones_ajax.php?cod_grupo=905431605&cod_jornada=1'
const resClasif = await fetchTexto(urlClasificacion)
log(`FFCV clasificación jornada 1 [status ${resClasif.status}]`, resClasif.texto.slice(0, 4000))

// --- RFEF: exploración más profunda con navegador ---
const browser = await chromium.launch()
const page = await browser.newPage()
const peticiones = []
page.on('request', (req) => {
  const url = req.url()
  if (/\.(js|css|png|jpg|jpeg|svg|woff2?|ico)(\?|$)/i.test(url)) return
  peticiones.push(`${req.method()} ${url}`)
})

await page.goto('https://rfef.isquad.es/indexcompeticiones.php', { waitUntil: 'networkidle', timeout: 30000 })

const enlaces = await page.$$eval('a', (els) =>
  els.map((el) => ({ texto: el.textContent.trim(), href: el.href })).filter((e) => e.texto || e.href)
)
log('RFEF - enlaces en la página', enlaces.slice(0, 60))

const botones = await page.$$eval('button, input[type=button], input[type=submit]', (els) =>
  els.map((el) => ({ texto: el.textContent?.trim() || el.value, id: el.id }))
)
log('RFEF - botones', botones)

const textoVisible = await page.evaluate(() => document.body.innerText.slice(0, 2000))
log('RFEF - texto visible del body', textoVisible)

log('RFEF - peticiones tras networkidle', peticiones)

await browser.close()
console.log('\n=== FIN RECON 2 ===')
