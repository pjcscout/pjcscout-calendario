// Reconocimiento (temporal): ficha de un partido de DH7 en RFEF, para ver si
// las alineaciones/convocatorias (nombres, no dígitos) se pueden leer como
// texto normal, a diferencia del marcador que usa una fuente ofuscada.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const URL = 'https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpPartido?cod_primaria=1000120&CodActa=70694242'

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 900, height: 1400 },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)

const texto = await page.locator('body').innerText()
writeFileSync('recon-dh7-acta.txt', texto)

// Busca pestañas/enlaces tipo "Alineaciones", "Convocatoria", "Plantillas"...
const enlaces = await page.locator('a').evaluateAll((els) =>
  els.map((e) => ({ texto: e.textContent?.trim(), href: e.getAttribute('href') })).filter((e) => e.texto)
)
writeFileSync('recon-dh7-acta-enlaces.json', JSON.stringify(enlaces, null, 2))

await browser.close()
console.log('OK, texto len:', texto.length, 'enlaces:', enlaces.length)
