// Reconocimiento (temporal): busca en la web pública de la FFCV la
// competición "Cadete Preferente" y su Grupo III para la temporada
// 2026-2027 (cod_temporada=22), navegando los desplegables reales de
// ffcv.es/competiciones/index.php y leyendo los <option> resultantes.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const resultado = {}

await page.goto('https://ffcv.es/competiciones/index.php', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)

// Volcar todos los <select> con sus <option> tal cual están en el DOM inicial,
// para ver la estructura de filtros (temporada, categoría, competición...).
resultado.selects = await page.evaluate(() =>
  [...document.querySelectorAll('select')].map((s) => ({
    id: s.id,
    name: s.name,
    options: [...s.options].map((o) => ({ value: o.value, text: o.textContent.trim() })),
  }))
)

writeFileSync('recon-cadete-preferente.json', JSON.stringify(resultado, null, 2))
await browser.close()
console.log('OK, selects encontrados:', resultado.selects.length)
