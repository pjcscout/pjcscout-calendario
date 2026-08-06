// Resultados y eventos de partido, separados a propósito del calendario
// (partido "programado") de calendario.js / calendarioDH7.js.
//
// Esto existe vacío desde ya para que, cuando lleguen los primeros resultados
// reales, solo haga falta rellenar este fichero (o sustituirlo por una
// consulta a Supabase u otro backend) sin tocar nada de la lógica de
// fixtures.js ni de los componentes que ya consumen `resultado`/`eventos`.

/**
 * @typedef {Object} EventoPartido
 * @property {'gol'|'tarjeta_amarilla'|'tarjeta_roja'|'sustitucion'} tipo
 * @property {number} minuto
 * @property {string} jugador
 * @property {string} equipoId
 */

/**
 * @typedef {Object} ResultadoPartido
 * @property {number} golesLocal
 * @property {number} golesVisitante
 */

/**
 * Identificador estable de un partido: grupo + jornada + enfrentamiento.
 * No depende de IDs de base de datos porque calendario.js/calendarioDH7.js
 * siguen siendo datos estáticos; el día que se migre a un backend, este id
 * se sustituye por la clave primaria real sin cambiar la forma de los datos.
 */
export function idPartido(grupo, numeroJornada, nombreLocal, nombreVisitante) {
  const slug = (texto) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  return `${grupo}__j${numeroJornada}__${slug(nombreLocal)}__${slug(nombreVisitante)}`
}

/**
 * Resultados conocidos, indexados por idPartido(...). Vacío hasta que
 * arranque la temporada. Cada entrada: { resultado: ResultadoPartido, eventos: EventoPartido[] }
 * @type {Record<string, { resultado: ResultadoPartido, eventos: EventoPartido[] }>}
 */
export const RESULTADOS = {}
