// Calcula qué jornada tocaría scrapear "hoy" para una categoría dada (env
// GRUPO, por defecto 'tercera-vi'): la de su calendario cuya fecha sea la
// más reciente que ya haya pasado (o sea hoy). Pensado para que la rutina
// automática de los domingos a las 22h sepa qué JORNADA pasarle al workflow
// sin tener que llevar la cuenta a mano — y, por separado, para DH7, que
// puede ir desincronizada de las categorías FFCV (p. ej. si descansa un
// fin de semana).
import { jornadasDeGrupo } from '../../src/utils/fixtures.js'

const GRUPO = process.env.GRUPO || 'tercera-vi'
const hoy = new Date().toISOString().slice(0, 10)

const jornadas = jornadasDeGrupo(GRUPO)
if (!jornadas) throw new Error(`Grupo desconocido: ${GRUPO}`)

let jornada = null
for (const j of jornadas) {
  if (j.fecha <= hoy) jornada = j.numero
}

if (jornada === null) {
  console.log('Todavía no ha empezado ninguna jornada (hoy:', hoy, ', grupo:', GRUPO, ')')
  process.exit(1)
}

console.log(jornada)
