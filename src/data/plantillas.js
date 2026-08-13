// Plantillas de jugadores (solo nombres, sin dorsales) por equipo.
//
// Fuente: SIEMPRE la federación que corresponde a la competición del equipo
// - FFCV para Tercera Federación, Lliga Comunitat Amateur (Nord/Sud), Liga Nacional
//   Juvenil, Lliga Comunitat Juvenil (Nord/Sud) y Cadete Autonómico.
// - RFEF para División de Honor Juvenil Grupo 7.
// Nunca se mezclan fuentes entre categorías y nunca se completa un hueco por suposición.
//
// A propósito NO se guardan dorsales, solo el nombre tal y como lo publica la fuente oficial.
// Vacío hasta que la federación correspondiente publique la plantilla de cada equipo.
//
// @type {Record<string, string[]>}
export const PLANTILLAS = {}

export function plantillaEquipo(id) {
  return PLANTILLAS[id] || null
}
