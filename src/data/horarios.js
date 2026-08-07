// Hora confirmada de cada partido, separada de resultados.js. La FFCV no
// publica la hora en el PDF de calendario de la temporada (por eso
// calendarioExport.js genera eventos de día completo), pero sí la confirma
// normalmente el miércoles previo a cada fin de semana en su web de
// resultados — salvo que el partido se aplace, que es un caso aparte.
//
// Vacío hasta que el scraper (previsto) la vaya rellenando semana a semana.
// Mientras una jornada no tenga entrada aquí, cualquier aviso/recordatorio
// debe hablar solo del día, nunca inventar una hora.
//
// @type {Record<string, { hora: string }>} indexado por idPartido(...)
export const HORARIOS = {}
