// IDs internos de la API pública de la FFCV (ffcv.es/competiciones/api/...),
// obtenidos por reconocimiento el 22/08/2026 llamando directamente a
// api/filtros/grupos_fetch.php?cod_competicion=<cod> para cada competición.
// No hace falta simular clics en los desplegables: con estos IDs se puede
// llamar directamente a la API de resultados y clasificación.
//
// Ejemplos de endpoints (cod_temporada=22 es la 2026-2027):
//   Resultados de una jornada:
//     https://ffcv.es/competiciones/api/partidos/resultados_por_grupo_jornada_data.php
//       ?cod_temporada=22&cod_competicion=<codCompeticion>&cod_grupo=<codGrupo>
//       &cod_jornada=<n>&grupo_nombre=<...>&competicion_nombre=<...>
//   Clasificación:
//     https://ffcv.es/competiciones/api/clasificaciones/clasificaciones_ajax.php
//       ?cod_grupo=<codGrupo>&cod_jornada=<n>
//
// RFEF (grupo "dh-g7", División de Honor Juvenil Grupo 7) no está aquí porque
// usa una plataforma distinta (marcadores.rfef.es/pnfg/...) con sus propios
// IDs — ver src/data/competicionRfef.js.
export const COMPETICIONES_FFCV = {
  'tercera-vi': { codCompeticion: '905431604', codGrupo: '905431605', nombreGrupo: 'GRUP - VI' },
  'llc-nord': { codCompeticion: '905431821', codGrupo: '905431822', nombreGrupo: 'Grup Nord' },
  'llc-sud': { codCompeticion: '905431821', codGrupo: '905431823', nombreGrupo: 'Grup Sud' },
  'llc-juv-nord': { codCompeticion: '905431546', codGrupo: '905431547', nombreGrupo: 'Nord' },
  'llc-juv-sud': { codCompeticion: '905431546', codGrupo: '905431548', nombreGrupo: 'Sud' },
  'cadete-autonomico': { codCompeticion: '905431885', codGrupo: '905431886', nombreGrupo: 'Grup - Únic' },
  'liga-nacional': { codCompeticion: '905431878', codGrupo: '905431879', nombreGrupo: 'Grup - VIII' },
}

export const COD_TEMPORADA_2026_2027 = '22'
