// Reconocimiento (temporal): reintenta capturar las Alineaciones (ambos
// lados) de los partidos que fallaron la primera vez, ahora que ya sabemos
// su cod_partido exacto. Reutiliza el flujo de navegación real (cookies,
// Jornada 1, clic en el marcador) que ya funcionó para los otros 54 partidos.
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const PARTIDOS = [
  { grupo: 'llc-nord', codTemporada: '22', codCompeticion: '30', codGrupo: '1', local: 'L\'Alcora', codPartido: '26471076' },
  { grupo: 'llc-nord', codTemporada: '22', codCompeticion: '30', codGrupo: '1', local: 'Nou Jove Castelló', codPartido: '26471078' },
]

const browser = await chromium.launch()
const resultado = {}

for (const p of PARTIDOS) {
  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  })
  try {
    // Ir a la ficha del partido directamente por URL con hash de alineaciones;
    // si redirige (guard de la SPA), reintentar por el flujo de clics.
    await page.goto(`https://ffcv.es/competiciones/partidos/partido.php?cod_partido=${p.codPartido}#alineaciones`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    })
    await page.waitForTimeout(1500)

    if (page.url().includes('/wp/')) {
      resultado[p.codPartido] = { error: 'redirigido a wp/, hace falta navegación por clic' }
      await page.close()
      continue
    }

    await page.getByText('Alineaciones', { exact: true }).first().click()
    await page.waitForTimeout(1000)
    const local = await page.locator('body').innerText()

    // Cambiar al equipo visitante (toggle "<Equipo> (formación)").
    const toggles = await page.locator('a, button, div').filter({ hasText: /\(\d-\d/ }).all()
    if (toggles.length >= 2) {
      await toggles[1].click()
      await page.waitForTimeout(1000)
    }
    const visitante = await page.locator('body').innerText()

    resultado[p.codPartido] = { local, visitante }
    console.log('OK', p.codPartido, local.length, visitante.length)
  } catch (e) {
    resultado[p.codPartido] = { error: String(e) }
    console.log('ERROR', p.codPartido, String(e).slice(0, 200))
  }
  await page.close()
}

await browser.close()
writeFileSync('recon-alineaciones-pendientes.json', JSON.stringify(resultado))
console.log('listo')
