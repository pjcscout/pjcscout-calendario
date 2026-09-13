// Reconocimiento (temporal): explora ffcv.es/competiciones/ para encontrar
// cómo se filtra por categoría/competición (dropdowns, buscador...).
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const browser = await chromium.launch()
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

const resultado = {}

await page.goto('https://ffcv.es/competiciones/', { waitUntil: 'domcontentloaded', timeout: 45000 })
await page.waitForTimeout(2000)

resultado.url = page.url()
resultado.texto = await page.locator('body').innerText()
resultado.selects = await page.evaluate(() =>
  [...document.querySelectorAll('select')].map((s) => ({
    id: s.id,
    name: s.name,
    options: [...s.options].slice(0, 5).map((o) => ({ value: o.value, text: o.textContent.trim() })),
    totalOptions: s.options.length,
  }))
)
await page.screenshot({ path: 'recon-cadete-preferente.png', fullPage: false })

writeFileSync('recon-cadete-preferente.json', JSON.stringify(resultado, null, 2))
await browser.close()
console.log('OK, url final:', resultado.url, 'texto len:', resultado.texto.length, 'selects:', resultado.selects.length)
