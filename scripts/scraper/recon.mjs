// Quinta pasada: la portada (accion=1) ya usa AJAX ("obtener(...)") para
// cargar paneles de competición, y trae un enlace directo a
// "CONSULTAR POR COMPETICIONES" (NPortada?CodPortada=1000181), que debería
// listar todas las categorías (incluida División de Honor Juvenil) con sus
// grupo_categoria/cod_competicion/cod_grupo. Vamos directamente ahí y
// volcamos todo el árbol de enlaces + peticiones AJAX, buscando "Juvenil".
import { chromium } from 'playwright'

function log(seccion, datos) {
  console.log(`\n=== ${seccion} ===`)
  console.log(typeof datos === 'string' ? datos : JSON.stringify(datos, null, 2))
}

const browser = await chromium.launch()
const page = await browser.newPage()
const peticiones = []
page.on('request', (req) => {
  const url = req.url()
  if (/\.(js|css|png|jpg|jpeg|svg|woff2?|ico|gif)(\?|$)/i.test(url)) return
  peticiones.push(`${req.method()} ${url}`)
})
page.on('response', async (res) => {
  const url = res.url()
  if (/NPcd\/NFG_CMP_Paneles|obtener/i.test(url) || res.request().method() === 'POST') {
    try {
      const body = await res.text()
      if (/juvenil/i.test(body)) {
        log(`RESPUESTA con "Juvenil" - ${url}`, body.slice(0, 4000))
      }
    } catch {}
  }
})

await page.goto('https://marcadores.rfef.es/pnfg/NPortada?CodPortada=1000181', {
  waitUntil: 'networkidle',
  timeout: 30000,
})
log('url tras cargar CONSULTAR POR COMPETICIONES', page.url())

const enlaces = await page.$$eval('a', (els) =>
  els.map((el) => ({ texto: el.textContent.trim(), href: el.href })).filter((e) => e.texto)
)
log('enlaces en la página', enlaces)

const textoVisible = await page.evaluate(() => document.body.innerText.slice(0, 3000))
log('texto visible', textoVisible)

// Buscamos cualquier elemento (no solo <a>) cuyo texto mencione "Juvenil"
const elementosJuvenil = await page.$$eval('*', (els) =>
  els
    .filter((el) => el.children.length === 0 && /juvenil/i.test(el.textContent || ''))
    .slice(0, 40)
    .map((el) => ({
      tag: el.tagName,
      texto: el.textContent.trim().slice(0, 200),
      onclick: el.getAttribute('onclick'),
      href: el.getAttribute('href'),
    }))
)
log('elementos que mencionan "Juvenil"', elementosJuvenil)

log('peticiones no-estáticas capturadas', peticiones)

await browser.close()
console.log('\n=== FIN RECON 5 ===')
