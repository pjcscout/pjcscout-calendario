// IDs de la RFEF (marcadores.rfef.es/pnfg/...) para "División de Honor
// Juvenil, Grupo 7" (grupo interno 'dh-g7'), obtenidos por reconocimiento
// el 22/08/2026:
//   1) NPortada?CodPortada=1000181 tiene un <select id="competiciones_sel_...">
//      con la opción "Division de Honor Juvenil" -> value = codCompeticion.
//   2) Al seleccionarla, la propia página pide (AJAX) la lista de grupos y
//      devuelve "Grupo 1".."Grupo 7" con sus IDs; Grupo 7 es el nuestro
//      (confirmado también porque aparece Torrent C.F. en su clasificación).
//
// A diferencia de la FFCV (API REST limpia en JSON), la RFEF no tiene una
// API pública en JSON: hay que pedir páginas HTML normales y parsear la
// tabla. Pero esas páginas SÍ son accesibles con una petición GET directa
// (sin cookies de sesión ni estado previo de formulario), así que tampoco
// hace falta un navegador automatizado para el scraper diario, solo un
// fetch() + parseo de HTML:
//
//   Clasificación (HTML):
//     https://marcadores.rfef.es/pnfg/NPcd/NFG_VisClasificacion
//       ?cod_primaria=1000120&codgrupo=<codGrupo>&codcompeticion=<codCompeticion>
//
//   Calendario/resultados por jornada (HTML, confirmar formato exacto de
//   parámetros al construir el scraper; probado a través de la portada):
//     https://marcadores.rfef.es/pnfg/NPcd/NFG_CmpJornada
//       ?cod_primaria=1000120&CodCompeticion=<codCompeticion>&CodGrupo=<codGrupo>
//       &CodTemporada=22&CodJornada=<n>
//
// El HTML de resultados incluye fecha/hora/lugar del partido en un atributo
// onmouseover ("showhint('<b>Fecha:</b> ...<br><b>Hora:</b> ...<br><b>Lugar:</b> ...'"),
// y el marcador solo aparece relleno cuando el acta está cerrada (durante el
// reconocimiento, jornada 1 aún no se había jugado, por eso salía "Acta no
// cerrada" y clasificación a 0 puntos en todos los equipos).
export const COMPETICION_RFEF_DH_G7 = {
  codPrimaria: '1000120',
  codCompeticion: '33836116',
  codGrupo: '33836123',
  nombreCompeticion: 'Division de Honor Juvenil',
  nombreGrupo: 'Grupo 7',
}

export const COD_TEMPORADA_RFEF_2026_2027 = '22'
