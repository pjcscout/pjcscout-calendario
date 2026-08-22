// Sexta pasada: en NPortada?CodPortada=1000181 hay un <select> con la opción
// "Division de Honor Juvenil" (confirmado en la 5ª pasada). Hace falta:
//  1) leer todas las opciones del select (value = cod_competicion, texto)
//  2) seleccionar "Division de Honor Juvenil" para disparar su onchange
//     (WDBuscarGrupos_..., que llama a /pnfg/NPcd/NFG_CmpResultados_POR_Grupos)
//  3) capturar esa respuesta para sacar los grupos y encontrar "Grupo 7"
import { chromium } from 'playwright'

function log(seccion, datos) {
  console.log(`\n=== ${seccion} ===`)
  console.log(typeof datos === 'string' ? datos : JSON.stringify(datos, null, 2))
}

const browser = await chromium.launch()
const page = await browser.newPage()
const respuestasGrupos = []
page.on('response', async (res) => {
  const url = res.url()
  if (/NFG_CmpResultados_POR_Grupos/i.test(url)) {
    try {
      const body = await res.text()
      respuestasGrupos.push({ url, body })
    } catch {}
  }
})

await page.goto('https://marcadores.rfef.es/pnfg/NPortada?CodPortada=1000181', {
  waitUntil: 'networkidle',
  timeout: 30000,
})

const selects = await page.$$eval('select', (els) =>
  els.map((el) => ({
    id: el.id,
    name: el.name,
    onchange: el.getAttribute('onchange'),
    options: [...el.options].map((o) => ({ value: o.value, text: o.textContent.trim() })),
  }))
)
log('selects en la página', selects)

const selectCompeticion = selects.find((s) =>
  s.options.some((o) => o.text === 'Division de Honor Juvenil')
)
log('select de competición identificado', selectCompeticion ? { id: selectCompeticion.id, onchange: selectCompeticion.onchange } : null)

if (selectCompeticion) {
  const opcionJuvenil = selectCompeticion.options.find((o) => o.text === 'Division de Honor Juvenil')
  log('opción Division de Honor Juvenil', opcionJuvenil)

  await page.selectOption(`#${selectCompeticion.id}`, opcionJuvenil.value).catch((e) =>
    log('error al seleccionar en el <select> por id', e.message)
  )
  await page.waitForTimeout(3000)

  log('respuestas de NFG_CmpResultados_POR_Grupos', respuestasGrupos)
}

await browser.close()
console.log('\n=== FIN RECON 6 ===')
