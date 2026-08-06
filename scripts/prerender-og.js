// Genera dist/equipo/<id>/index.html por cada equipo, con su propio
// Open Graph (título, descripción y escudo como og:image).
//
// Por qué hace falta: esta app es una SPA sin servidor. Los bots que generan
// la vista previa al compartir un enlace (WhatsApp, Telegram, Facebook...) no
// ejecutan JavaScript, así que cambiar el <head> desde React (como hace
// EquipoPage.jsx para la pestaña del propio usuario) no vale para eso: hace
// falta HTML ya generado con las etiquetas correctas antes de que llegue el bot.
// Netlify sirve estos ficheros estáticos directamente si la ruta coincide
// (/equipo/roda-a -> dist/equipo/roda-a/index.html), y un usuario real recibe
// el mismo HTML, que arranca la SPA con React Router con normalidad.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { EQUIPOS, GRUPOS } from '../src/data/equipos.js'
import { tieneCalendario } from '../src/utils/fixtures.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const siteUrl = 'https://calendario.pjcscout.es'

const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

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

let generated = 0
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

  const outDir = join(distDir, 'equipo', equipo.id)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  generated++
}

console.log(`prerender-og: generadas ${generated} páginas en dist/equipo/<id>/index.html`)
