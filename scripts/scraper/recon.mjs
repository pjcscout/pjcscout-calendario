// Séptima pasada: ya tenemos codcompeticion=33836116 (Division de Honor
// Juvenil) y codgrupo=33836123 (Grupo 7). Disparamos la búsqueda de
// resultados de una jornada (vía la función JS de la propia página, para
// conservar cookies/estado de sesión) y volcamos la respuesta real de
// NFG_CmpResultados_POR_Exe, para ver si trae marcador, jugadores, hora, etc.
import { chromium } from 'playwright'

function log(seccion, datos) {
  console.log(`\n=== ${seccion} ===`)
  console.log(typeof datos === 'string' ? datos : JSON.stringify(datos, null, 2))
}

const CODCOMPETICION = '33836116'
const CODGRUPO = '33836123'

const browser = await chromium.launch()
const page = await browser.newPage()
const respuestas = []
page.on('response', async (res) => {
  const url = res.url()
  if (/NFG_CmpResultados_POR_Exe|NFG_VisClasificacion/i.test(url)) {
    try {
      const body = await res.text()
      respuestas.push({ url, status: res.status(), body })
    } catch {}
  }
})

await page.goto('https://marcadores.rfef.es/pnfg/NPortada?CodPortada=1000181', {
  waitUntil: 'networkidle',
  timeout: 30000,
})

await page.selectOption('#competiciones_sel_10001810201', CODCOMPETICION)
await page.waitForTimeout(1500)
await page.selectOption('#grupo', CODGRUPO).catch((e) => log('error seleccionando grupo', e.message))
await page.waitForTimeout(2500)

log('respuestas de resultados/clasificación', respuestas)

// También probamos directamente la URL de clasificación con estos códigos
const urlClasificacion = `https://marcadores.rfef.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codgrupo=${CODGRUPO}&codcompeticion=${CODCOMPETICION}`
const resp = await page.goto(urlClasificacion, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => null)
if (resp) {
  const texto = await page.evaluate(() => document.body.innerText.slice(0, 2000))
  log('texto de NFG_VisClasificacion directa', texto)
}

await browser.close()
console.log('\n=== FIN RECON 7 ===')
