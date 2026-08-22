// Reconocimiento desechable: inspecciona cómo funcionan los desplegables de
// resultadosffcv.isquad.es y rfef.isquad.es (temporada -> modalidad ->
// competición -> grupo) para encontrar los IDs reales de nuestras 7
// competiciones. No hay URLs fijas por competición; hay que "usar" la web
// como lo haría una persona y capturar las peticiones AJAX que disparan los
// desplegables.
import { chromium } from 'playwright'

const SITIOS = [
  { nombre: 'FFCV', url: 'https://resultadosffcv.isquad.es/' },
  { nombre: 'RFEF', url: 'https://rfef.isquad.es/indexcompeticiones.php' },
]

function log(seccion, datos) {
  console.log(`\n=== ${seccion} ===`)
  console.log(typeof datos === 'string' ? datos : JSON.stringify(datos, null, 2))
}

const browser = await chromium.launch()

for (const sitio of SITIOS) {
  const page = await browser.newPage()
  const peticiones = []
  page.on('request', (req) => {
    const url = req.url()
    if (/\.(js|css|png|jpg|jpeg|svg|woff2?|ico)(\?|$)/i.test(url)) return
    peticiones.push(`${req.method()} ${url}`)
  })

  log(`${sitio.nombre} - cargando`, sitio.url)
  try {
    await page.goto(sitio.url, { waitUntil: 'networkidle', timeout: 30000 })
  } catch (e) {
    log(`${sitio.nombre} - ERROR al cargar`, e.message)
    await page.close()
    continue
  }

  log(`${sitio.nombre} - title/url final`, { title: await page.title(), url: page.url() })

  const iframes = await page.$$eval('iframe', (els) => els.map((el) => el.src))
  log(`${sitio.nombre} - iframes`, iframes)

  const selects = await page.$$eval('select', (els) =>
    els.map((el) => ({
      id: el.id,
      name: el.name,
      options: [...el.options].slice(0, 40).map((o) => ({ value: o.value, text: o.textContent.trim() })),
    }))
  )
  log(`${sitio.nombre} - selects en documento principal`, selects)

  // Si el contenido real vive en un iframe, repetimos ahí dentro.
  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue
    try {
      const selectsFrame = await frame.$$eval('select', (els) =>
        els.map((el) => ({
          id: el.id,
          name: el.name,
          options: [...el.options].slice(0, 40).map((o) => ({ value: o.value, text: o.textContent.trim() })),
        }))
      )
      if (selectsFrame.length) log(`${sitio.nombre} - selects en iframe ${frame.url()}`, selectsFrame)
    } catch {
      // frame cross-origin o no listo, ignorar
    }
  }

  log(`${sitio.nombre} - peticiones no-estáticas tras cargar`, peticiones)

  await page.close()
}

await browser.close()
console.log('\n=== FIN RECON ===')
