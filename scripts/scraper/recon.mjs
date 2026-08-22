// Cuarta pasada: marcadores.rfef.es/pnfg/?accion=1 es el portal público real
// (redirige desde resultados.rfef.es). Es una página de menú ("CONSULTAR POR
// COMPETICIONES"), sin desplegables todavía — hay que entrar en Fútbol >
// Masculino y buscar División de Honor Juvenil Grupo 7 desde ahí,
// capturando las peticiones AJAX por el camino (la URL usa "pnfg", el mismo
// patrón que los escudos de FFCV, así que puede compartir plataforma).
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

await page.goto('https://marcadores.rfef.es/pnfg/?accion=1', { waitUntil: 'networkidle', timeout: 30000 })

const enlaces = await page.$$eval('a', (els) =>
  els.map((el) => ({ texto: el.textContent.trim(), href: el.href })).filter((e) => e.texto)
)
log('enlaces en la página de menú', enlaces.slice(0, 80))

// Buscamos un enlace que lleve a "Fútbol" masculino (no fútbol sala/playa)
const enlaceFutbol = enlaces.find(
  (e) => /f.tbol/i.test(e.texto) && !/sala|playa/i.test(e.texto) && /masculin/i.test(e.texto)
)
log('enlace fútbol masculino elegido', enlaceFutbol)

if (enlaceFutbol) {
  await page.goto(enlaceFutbol.href, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) =>
    log('error navegando a fútbol masculino', e.message)
  )
  log('tras entrar en fútbol masculino - url', page.url())

  const selects2 = await page.$$eval('select', (els) =>
    els.map((el) => ({
      id: el.id,
      name: el.name,
      options: [...el.options].slice(0, 60).map((o) => ({ value: o.value, text: o.textContent.trim() })),
    }))
  )
  log('selects tras entrar en fútbol masculino', selects2)

  const textoVisible = await page.evaluate(() => document.body.innerText.slice(0, 1500))
  log('texto visible', textoVisible)
}

log('peticiones no-estáticas capturadas', peticiones)

await browser.close()
console.log('\n=== FIN RECON 4 ===')
