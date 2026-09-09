// Genera HTML real (no solo metaetiquetas) para la home, cada página de
// equipo, de jugador y de clasificación, usando react-dom/server contra el
// bundle SSR generado por "vite build --ssr src/entry-server.jsx --outDir
// dist-server" (paso previo en npm run build).
//
// Por qué hace falta: esta app es una SPA. Sin esto, dist/equipo/<id>/index.html
// solo tenía <div id="root"></div> vacío — los buscadores y los bots que no
// ejecutan JavaScript no veían ningún contenido real (ni el <h1>, ni el
// calendario, ni la clasificación), solo las metaetiquetas de Open Graph.
// Ahora el HTML servido ya trae el contenido completo; el mismo archivo
// arranca la SPA con normalidad para un usuario real, que no nota diferencia.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { EQUIPOS, GRUPOS } from '../src/data/equipos.js'
import { tieneCalendario } from '../src/utils/fixtures.js'
import { plantillaEquipo } from '../src/data/plantillas.js'
import { renderInicio, renderEquipo, renderClasificacion, renderJugador } from '../dist-server/entry-server.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const siteUrl = 'https://calendario.pjcscout.es'

const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

// La home es una SPA pura (Inicio.jsx no renderiza nada hasta el useEffect
// que decide si redirige al equipo guardado): sin esto dist/index.html se
// servía con <div id="root"></div> vacío, igual que le pasaba antes a las
// páginas de equipo y jugador.
writeFileSync(join(distDir, 'index.html'), insertarContenido(template, renderInicio()))
console.log('prerender: home generada con contenido real')

function escapeHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceMeta(html, selectorAttr, selectorValue, newContent) {
  const re = new RegExp(
    `(<meta[^>]*${selectorAttr}=["']${selectorValue}["'][^>]*content=["'])[^"']*(["'][^>]*>)`
  )
  return html.replace(re, `$1${escapeHtml(newContent)}$2`)
}

function insertarContenido(html, contenidoHtml) {
  return html.replace('<div id="root"></div>', `<div id="root">${contenidoHtml}</div>`)
}

function insertarJsonLd(html, datos) {
  const script = `<script type="application/ld+json">${JSON.stringify(datos)}</script>`
  return html.replace('</head>', `${script}\n  </head>`)
}

function breadcrumb(pasos) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: pasos.map(([name, item], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item,
    })),
  }
}

let generatedEquipos = 0
for (const equipo of EQUIPOS) {
  const grupo = GRUPOS[equipo.grupo]
  const titulo = `${equipo.nombre} · ${grupo.nombre} · PJC Scout`
  const descripcion = tieneCalendario(equipo.grupo)
    ? `Calendario completo de ${equipo.nombre} en ${grupo.nombre} ${grupo.subnombre}, temporada ${grupo.temporada}. Jornada a jornada, gratis.`
    : `${equipo.nombre} en ${grupo.nombre} ${grupo.subnombre}, temporada ${grupo.temporada}. PJC Scout.`
  const imagenAbsoluta = `${siteUrl}/escudos/${equipo.id}.png`
  const urlAbsoluta = `${siteUrl}/equipo/${equipo.id}`

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(titulo)}</title>`)
  html = replaceMeta(html, 'name', 'description', descripcion)
  html = replaceMeta(html, 'property', 'og:title', titulo)
  html = replaceMeta(html, 'property', 'og:description', descripcion)
  html = replaceMeta(html, 'property', 'og:image', imagenAbsoluta)
  html = replaceMeta(html, 'property', 'og:url', urlAbsoluta)
  html = replaceMeta(html, 'name', 'twitter:title', titulo)
  html = replaceMeta(html, 'name', 'twitter:description', descripcion)
  html = replaceMeta(html, 'name', 'twitter:image', imagenAbsoluta)
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${urlAbsoluta}" />`
  )
  html = insertarContenido(html, renderEquipo(equipo))
  html = insertarJsonLd(html, {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: equipo.nombre,
    sport: 'Soccer',
    url: urlAbsoluta,
    logo: imagenAbsoluta,
    memberOf: {
      '@type': 'SportsOrganization',
      name: `${grupo.nombre} ${grupo.subnombre}`.trim(),
    },
  })
  html = insertarJsonLd(
    html,
    breadcrumb([
      ['Inicio', `${siteUrl}/`],
      [equipo.nombre, urlAbsoluta],
    ])
  )

  const outDir = join(distDir, 'equipo', equipo.id)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  generatedEquipos++
}
console.log(`prerender: generadas ${generatedEquipos} páginas de equipo con contenido real`)

let generatedJugadores = 0
for (const equipo of EQUIPOS) {
  const grupo = GRUPOS[equipo.grupo]
  const plantilla = plantillaEquipo(equipo.id) || []
  const equipoUrl = `${siteUrl}/equipo/${equipo.id}`

  for (const nombre of plantilla) {
    const titulo = `${nombre} · ${equipo.nombre} · PJC Scout`
    const descripcion = `Ficha de ${nombre} (${equipo.nombre}, ${grupo.nombre} ${grupo.subnombre}): minutos jugados, goles y tarjetas de la temporada, gratis.`
    const urlAbsoluta = `${equipoUrl}/jugador/${encodeURIComponent(nombre)}`

    let html = template
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(titulo)}</title>`)
    html = replaceMeta(html, 'name', 'description', descripcion)
    html = replaceMeta(html, 'property', 'og:title', titulo)
    html = replaceMeta(html, 'property', 'og:description', descripcion)
    html = replaceMeta(html, 'property', 'og:url', urlAbsoluta)
    html = replaceMeta(html, 'name', 'twitter:title', titulo)
    html = replaceMeta(html, 'name', 'twitter:description', descripcion)
    html = html.replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${urlAbsoluta}" />`
    )
    html = insertarContenido(html, renderJugador(equipo, nombre))
    html = insertarJsonLd(html, {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: nombre,
      url: urlAbsoluta,
      memberOf: {
        '@type': 'SportsTeam',
        name: equipo.nombre,
        url: equipoUrl,
      },
    })
    html = insertarJsonLd(
      html,
      breadcrumb([
        ['Inicio', `${siteUrl}/`],
        [equipo.nombre, equipoUrl],
        [nombre, urlAbsoluta],
      ])
    )

    const outDir = join(distDir, 'equipo', equipo.id, 'jugador', nombre)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), html)
    generatedJugadores++
  }
}
console.log(`prerender: generadas ${generatedJugadores} páginas de jugador con contenido real`)

let generatedClasificaciones = 0
for (const grupoId of Object.keys(GRUPOS)) {
  if (!tieneCalendario(grupoId)) continue
  const grupo = GRUPOS[grupoId]
  const titulo = `Clasificación · ${grupo.nombre} ${grupo.subnombre} · PJC Scout`
  const descripcion = `Clasificación completa de ${grupo.nombre} ${grupo.subnombre}, temporada ${grupo.temporada}. Puntos, goles y racha de cada equipo, gratis.`
  const urlAbsoluta = `${siteUrl}/clasificacion/${grupoId}`

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(titulo)}</title>`)
  html = replaceMeta(html, 'name', 'description', descripcion)
  html = replaceMeta(html, 'property', 'og:title', titulo)
  html = replaceMeta(html, 'property', 'og:description', descripcion)
  html = replaceMeta(html, 'property', 'og:url', urlAbsoluta)
  html = replaceMeta(html, 'name', 'twitter:title', titulo)
  html = replaceMeta(html, 'name', 'twitter:description', descripcion)
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${urlAbsoluta}" />`
  )
  html = insertarContenido(html, renderClasificacion(grupoId))
  html = insertarJsonLd(
    html,
    breadcrumb([
      ['Inicio', `${siteUrl}/`],
      [`Clasificación ${grupo.nombre} ${grupo.subnombre}`.trim(), urlAbsoluta],
    ])
  )

  const outDir = join(distDir, 'clasificacion', grupoId)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  generatedClasificaciones++
}
console.log(`prerender: generadas ${generatedClasificaciones} páginas de clasificación con contenido real`)

const rutas = ['/']
for (const equipo of EQUIPOS) {
  rutas.push(`/equipo/${equipo.id}`)
  for (const nombre of plantillaEquipo(equipo.id) || []) {
    rutas.push(`/equipo/${equipo.id}/jugador/${encodeURIComponent(nombre)}`)
  }
}
for (const grupoId of Object.keys(GRUPOS)) {
  if (tieneCalendario(grupoId)) rutas.push(`/clasificacion/${grupoId}`)
}

// Sin <lastmod>: no tenemos fecha real de modificación por página y un valor
// que siempre es "hoy" (la fecha de build) es una señal que Google acaba
// ignorando o penalizando por poco fiable.
const urlset = rutas.map((ruta) => `  <url><loc>${siteUrl}${ruta}</loc></url>`).join('\n')
writeFileSync(
  join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`
)
console.log(`prerender: generado sitemap.xml con ${rutas.length} URLs`)
