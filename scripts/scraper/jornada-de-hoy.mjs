// Calcula qué jornada tocaría scrapear "hoy": la del calendario de
// Tercera Federación (grupo de referencia, ida y vuelta, una jornada por
// semana igual que el resto de categorías) cuya fecha sea la más reciente
// que ya haya pasado (o sea hoy). Pensado para que la rutina automática de
// los domingos a las 22h sepa qué JORNADA pasarle al workflow sin tener
// que llevar la cuenta a mano.
import { JORNADAS } from '../../src/data/calendario.js'

const hoy = new Date().toISOString().slice(0, 10)

let jornada = null
for (const j of JORNADAS) {
  if (j.fecha <= hoy) jornada = j.numero
}

if (jornada === null) {
  console.log('Todavía no ha empezado ninguna jornada (hoy:', hoy, ')')
  process.exit(1)
}

console.log(jornada)
