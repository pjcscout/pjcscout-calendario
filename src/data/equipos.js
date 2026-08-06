// Datos reales de equipos: Tercera Federación Grupo VI, División de Honor Juvenil Grupo 7,
// Lliga Comunitat (Grup Sud y Grup Nord), Cadete Autonómico y Liga Nacional.
// Los escudos se sirven en local desde /public/escudos/<id>.png — ya no se hotlinkea a Google Drive.
// Cadete Autonómico y Liga Nacional aún no tienen calendario (ver src/utils/fixtures.js).

export const GRUPOS = {
  'tercera-vi': { id: 'tercera-vi', nombre: 'Tercera Federación', subnombre: 'Grupo VI', temporada: '2026-2027' },
  'dh-g7': { id: 'dh-g7', nombre: 'División de Honor Juvenil', subnombre: 'Grupo 7', temporada: '2026-2027' },
  'llc-sud': { id: 'llc-sud', nombre: 'Lliga Comunitat', subnombre: 'Grup Sud', temporada: '2026-2027' },
  'llc-nord': { id: 'llc-nord', nombre: 'Lliga Comunitat', subnombre: 'Grup Nord', temporada: '2026-2027' },
  'cadete-autonomico': { id: 'cadete-autonomico', nombre: 'Cadete Autonómico', subnombre: '', temporada: '2026-2027' },
  'liga-nacional': { id: 'liga-nacional', nombre: 'Liga Nacional', subnombre: 'Juvenil', temporada: '2026-2027' },
}

export const EQUIPOS = [
  { id: "saguntino", nombre: "At. Saguntino", grupo: "tercera-vi", localidad: "Sagunto", color: "#C81E2C" },
  { id: "atzeneta", nombre: "Atzeneta U.E. \"A\"", grupo: "tercera-vi", localidad: "Atzeneta d'Albaida", color: "#F07C1E" },
  { id: "levante-b", nombre: "Levante U.D. \"B\"", grupo: "tercera-vi", localidad: "Valencia", color: "#0A5FA8" },
  { id: "eldense-b", nombre: "C.D. Eldense \"B\"", grupo: "tercera-vi", localidad: "Elda", color: "#C81E2C" },
  { id: "ontinyent", nombre: "Ontinyent 1931 C.F.", grupo: "tercera-vi", localidad: "Ontinyent", color: "#FBF8EF" },
  { id: "torrent-a", nombre: "Torrent C.F. \"A\"", grupo: "tercera-vi", localidad: "Torrent", color: "#FBF8EF" },
  { id: "villarreal-c", nombre: "Villarreal C.F. \"C\"", grupo: "tercera-vi", localidad: "Vila-real", color: "#F7D117" },
  { id: "hercules-b", nombre: "Hércules C.F. \"B\"", grupo: "tercera-vi", localidad: "Alicante", color: "#0A5FA8" },
  { id: "crevillente", nombre: "Crevillente Deportivo", grupo: "tercera-vi", localidad: "Crevillent", color: "#0A5FA8" },
  { id: "valldeuxo-a", nombre: "U.D. Vall de Uxó \"A\"", grupo: "tercera-vi", localidad: "Vall d'Uixó", color: "#0A5FA8" },
  { id: "utiel", nombre: "C.D. Utiel", grupo: "tercera-vi", localidad: "Utiel", color: "#C81E2C" },
  { id: "acero", nombre: "C.D. Acero", grupo: "tercera-vi", localidad: "Sagunto", color: "#C81E2C" },
  { id: "torrevieja-a", nombre: "S.C. Torrevieja C.F. \"A\"", grupo: "tercera-vi", localidad: "Torrevieja", color: "#F7D117" },
  { id: "soneja", nombre: "C.D. Soneja", grupo: "tercera-vi", localidad: "Soneja", color: "#0A5FA8" },
  { id: "espanol-sv", nombre: "C.D. Español de San Vicente", grupo: "tercera-vi", localidad: "San Vicente del Raspeig", color: "#C81E2C" },
  { id: "roda-a", nombre: "C.D. Roda \"A\"", grupo: "tercera-vi", localidad: "Vila-real", color: "#C81E2C" },
  { id: "torrellano", nombre: "Athletic Club Torrellano", grupo: "tercera-vi", localidad: "Elche", color: "#6A1B7A" },
  { id: "bunol-a", nombre: "C.D. Buñol \"A\"", grupo: "tercera-vi", localidad: "Buñol", color: "#FBF8EF" },
  { id: "dh7-murcia-promises", nombre: "Murcia Promises Club de Fútbol", grupo: "dh-g7", localidad: "Murcia", color: "#0A5FA8" },
  { id: "dh7-real-murcia", nombre: "Real Murcia C.F.", grupo: "dh-g7", localidad: "Murcia", color: "#8E1B2E" },
  { id: "dh7-kelme", nombre: "Kelme C.F.", grupo: "dh-g7", localidad: "Elche", color: "#C81E2C" },
  { id: "dh7-elche", nombre: "Elche C.F.", grupo: "dh-g7", localidad: "Elche", color: "#0A5FA8" },
  { id: "dh7-san-francisco", nombre: "C.D. San Francisco", grupo: "dh-g7", localidad: "Palma", color: "#F7D117" },
  { id: "dh7-castellon", nombre: "C.D. Castellón", grupo: "dh-g7", localidad: "Castellón", color: "#0A5FA8" },
  { id: "dh7-cartagena", nombre: "FUTBOL CLUB CARTAGENA SAD", grupo: "dh-g7", localidad: "Cartagena", color: "#C81E2C" },
  { id: "dh7-roda", nombre: "C.D. Roda", grupo: "dh-g7", localidad: "Vila-real", color: "#C81E2C" },
  { id: "dh7-levante", nombre: "Levante U.D.", grupo: "dh-g7", localidad: "Valencia", color: "#0A5FA8" },
  { id: "dh7-patacona", nombre: "Patacona C.F.", grupo: "dh-g7", localidad: "Alboraia", color: "#F07C1E" },
  { id: "dh7-penya-arrabal", nombre: "PENYA ARRABAL", grupo: "dh-g7", localidad: "Palma", color: "#0A5FA8" },
  { id: "dh7-mallorca", nombre: "R.C.D. Mallorca", grupo: "dh-g7", localidad: "Palma", color: "#C81E2C" },
  { id: "dh7-torrent", nombre: "Torrent C.F.", grupo: "dh-g7", localidad: "Torrent", color: "#FBF8EF" },
  { id: "dh7-ucam", nombre: "UCAM Universidad Catolica de Murcia C.F.", grupo: "dh-g7", localidad: "Murcia", color: "#111111" },
  { id: "dh7-valencia", nombre: "Valencia C.F.", grupo: "dh-g7", localidad: "Valencia", color: "#F7D117" },
  { id: "dh7-villarreal", nombre: "Villarreal C.F.", grupo: "dh-g7", localidad: "Vila-real", color: "#F7D117" },

  // --- Lliga Comunitat, Grup Sud ---
  { id: "llcsud-thader", nombre: "C.D. Thader", grupo: "llc-sud", localidad: "Rojales", color: "#0A5FA8" },
  { id: "llcsud-almoradi-a", nombre: "C.D. Almoradí \"A\"", grupo: "llc-sud", localidad: "Almoradí", color: "#0A5FA8" },
  { id: "llcsud-calpe", nombre: "C.F.U.D. Calpe", grupo: "llc-sud", localidad: "Calpe", color: "#1E7A3C" },
  { id: "llcsud-novelda-a", nombre: "Novelda Unión C.F. Cableworld \"A\"", grupo: "llc-sud", localidad: "Novelda", color: "#FBF8EF" },
  { id: "llcsud-redovan-a", nombre: "F.B. Redován C.F. \"A\"", grupo: "llc-sud", localidad: "Redován", color: "#8a8a80" },
  { id: "llcsud-olimpic", nombre: "C.D. Olímpic", grupo: "llc-sud", localidad: "Xàtiva", color: "#FBF8EF" },
  { id: "llcsud-tavernes-valldigna", nombre: "C.F.U.E. Tavernes de la Valldigna", grupo: "llc-sud", localidad: "Tavernes De La Valldigna", color: "#8a8a80" },
  { id: "llcsud-alberic", nombre: "C.E. Alberic Sucemart", grupo: "llc-sud", localidad: "Alberic", color: "#FBF8EF" },
  { id: "llcsud-javea", nombre: "C.D.F. Jávea", grupo: "llc-sud", localidad: "Jávea", color: "#8a8a80" },
  { id: "llcsud-benidorm-a", nombre: "C.F. Benidorm \"A\"", grupo: "llc-sud", localidad: "Benidorm", color: "#0A5FA8" },
  { id: "llcsud-independiente-alicante-a", nombre: "C.F. Independiente Alicante \"A\"", grupo: "llc-sud", localidad: "Alicante", color: "#0A5FA8" },
  { id: "llcsud-santa-pola", nombre: "Santa Pola C.F.", grupo: "llc-sud", localidad: "Santa Pola", color: "#8a8a80" },
  { id: "llcsud-gandia-a", nombre: "C.F. Gandia \"A\"", grupo: "llc-sud", localidad: "Gandia", color: "#0A5FA8" },
  { id: "llcsud-alzira", nombre: "U.D. Alzira", grupo: "llc-sud", localidad: "Alzira", color: "#0A5FA8" },
  { id: "llcsud-rayo-ibense-a", nombre: "U.D. Rayo Ibense \"A\"", grupo: "llc-sud", localidad: "Ibi", color: "#8a8a80" },
  { id: "llcsud-beniganim", nombre: "Benigànim C.F.", grupo: "llc-sud", localidad: "Benigánim", color: "#FBF8EF" },

  // --- Lliga Comunitat, Grup Nord ---
  { id: "llcnord-silla", nombre: "Silla C.F.", grupo: "llc-nord", localidad: "Silla", color: "#FBF8EF" },
  { id: "llcnord-almazora-a", nombre: "C.D. Almazora \"A\"", grupo: "llc-nord", localidad: "Almazora", color: "#FBF8EF" },
  { id: "llcnord-ribarroja-a", nombre: "Ribarroja C.F. \"A\"", grupo: "llc-nord", localidad: "Riba-Roja De Túria", color: "#C81E2C" },
  { id: "llcnord-massanassa", nombre: "Massanassa C.F.", grupo: "llc-nord", localidad: "Massanassa", color: "#0A5FA8" },
  { id: "llcnord-odisea-a", nombre: "F.C. Odisea \"A\"", grupo: "llc-nord", localidad: "Castellón De La Plana", color: "#111111" },
  { id: "llcnord-alcora", nombre: "C.D. L'Alcora", grupo: "llc-nord", localidad: "Alcora (L')", color: "#C81E2C" },
  { id: "llcnord-recambios-colon-a", nombre: "C.F. Recambios Colón Catarroja \"A\"", grupo: "llc-nord", localidad: "Aldaia", color: "#0A5FA8" },
  { id: "llcnord-manises-a", nombre: "Manises C.F. \"A\"", grupo: "llc-nord", localidad: "Manises", color: "#0A5FA8" },
  { id: "llcnord-aldaia-a", nombre: "U.D. Aldaia C.F. \"A\"", grupo: "llc-nord", localidad: "Aldaia", color: "#C81E2C" },
  { id: "llcnord-alqueries-a", nombre: "Alqueries C.F. \"A\"", grupo: "llc-nord", localidad: "Alquerías Del Niño Perdido", color: "#8a8a80" },
  { id: "llcnord-paiporta", nombre: "Paiporta C.F.", grupo: "llc-nord", localidad: "Paiporta", color: "#0A5FA8" },
  { id: "llcnord-la-luz-xirivella-a", nombre: "C.F. At. Bº La Luz - Xirivella \"A\"", grupo: "llc-nord", localidad: "Xirivella", color: "#6A1B2E" },
  { id: "llcnord-onda-a", nombre: "C.D. Onda \"A\"", grupo: "llc-nord", localidad: "Onda", color: "#C81E2C" },
  { id: "llcnord-burriana-a", nombre: "C.D. Burriana \"A\"", grupo: "llc-nord", localidad: "Burriana", color: "#8a8a80" },
  { id: "llcnord-at-quart-a", nombre: "IDA C.F. At. Quart \"A\"", grupo: "llc-nord", localidad: "Vall D'Uixó (La)", color: "#8a8a80" },
  { id: "llcnord-nou-jove-castello-a", nombre: "C.F. Nou Jove Castelló \"A\"", grupo: "llc-nord", localidad: "Benlloch", color: "#FBF8EF" },

  // --- Cadete Autonómico (sin calendario todavía) ---
  { id: "cadete-celtic-elche", nombre: "Celtic Elche", grupo: "cadete-autonomico", localidad: "", color: "#8a8a80" },
  { id: "cadete-fundacion-valencia", nombre: "Fundación Valencia", grupo: "cadete-autonomico", localidad: "", color: "#8a8a80" },
  { id: "cadete-elda-union", nombre: "Elda Unión", grupo: "cadete-autonomico", localidad: "Elda", color: "#8a8a80" },
  { id: "cadete-scd-intangco", nombre: "SCD Intangco", grupo: "cadete-autonomico", localidad: "", color: "#8a8a80" },
  { id: "cadete-torre-levante", nombre: "CF Torre Levante", grupo: "cadete-autonomico", localidad: "", color: "#8a8a80" },
  { id: "cadete-primer-toque", nombre: "Primer Toque", grupo: "cadete-autonomico", localidad: "", color: "#8a8a80" },
  { id: "cadete-benidorm", nombre: "CF Benidorm", grupo: "cadete-autonomico", localidad: "", color: "#8a8a80" },
  { id: "cadete-san-jose", nombre: "San José", grupo: "cadete-autonomico", localidad: "", color: "#8a8a80" },
  { id: "cadete-la-nucia", nombre: "La Nucía", grupo: "cadete-autonomico", localidad: "la Nucia", color: "#8a8a80" },
  { id: "cadete-alboraya", nombre: "Alboraya", grupo: "cadete-autonomico", localidad: "Alboraia", color: "#8a8a80" },
  { id: "cadete-castellon", nombre: "Castellón", grupo: "cadete-autonomico", localidad: "Castellón de la Plana", color: "#8a8a80" },
  { id: "cadete-patacona", nombre: "Patacona", grupo: "cadete-autonomico", localidad: "Alboraia", color: "#8a8a80" },
  { id: "cadete-elche", nombre: "Elche", grupo: "cadete-autonomico", localidad: "Elche", color: "#8a8a80" },
  { id: "cadete-kelme", nombre: "Kelme", grupo: "cadete-autonomico", localidad: "Elche", color: "#8a8a80" },
  { id: "cadete-villarreal", nombre: "Villarreal", grupo: "cadete-autonomico", localidad: "Vila-real", color: "#8a8a80" },
  { id: "cadete-levante", nombre: "Levante", grupo: "cadete-autonomico", localidad: "Valencia", color: "#8a8a80" },
  { id: "cadete-valencia", nombre: "Valencia", grupo: "cadete-autonomico", localidad: "Valencia", color: "#8a8a80" },

  // --- Liga Nacional (sin calendario todavía) ---
  { id: "liganac-elda-union", nombre: "Elda Unión", grupo: "liga-nacional", localidad: "Elda", color: "#8a8a80" },
  { id: "liganac-san-pedro", nombre: "San Pedro", grupo: "liga-nacional", localidad: "", color: "#8a8a80" },
  { id: "liganac-tavernes-blanques", nombre: "Tavernes Blanques", grupo: "liga-nacional", localidad: "Tavernes Blanques", color: "#8a8a80" },
  { id: "liganac-rumbo", nombre: "Rumbo", grupo: "liga-nacional", localidad: "", color: "#8a8a80" },
  { id: "liganac-alzira", nombre: "Alzira", grupo: "liga-nacional", localidad: "Alzira", color: "#8a8a80" },
  { id: "liganac-san-jose", nombre: "San José", grupo: "liga-nacional", localidad: "", color: "#8a8a80" },
  { id: "liganac-la-nucia", nombre: "La Nucía", grupo: "liga-nacional", localidad: "la Nucia", color: "#8a8a80" },
  { id: "liganac-moncadense", nombre: "Moncadense", grupo: "liga-nacional", localidad: "Moncada", color: "#8a8a80" },
  { id: "liganac-alboraya", nombre: "Alboraya", grupo: "liga-nacional", localidad: "Alboraia", color: "#8a8a80" },
  { id: "liganac-jove-espanol", nombre: "Jove Español", grupo: "liga-nacional", localidad: "", color: "#8a8a80" },
  { id: "liganac-hercules", nombre: "Hércules", grupo: "liga-nacional", localidad: "Alicante", color: "#8a8a80" },
  { id: "liganac-castellon", nombre: "Castellón", grupo: "liga-nacional", localidad: "Castellón de la Plana", color: "#8a8a80" },
  { id: "liganac-elche", nombre: "Elche", grupo: "liga-nacional", localidad: "Elche", color: "#8a8a80" },
  { id: "liganac-torrent", nombre: "Torrent", grupo: "liga-nacional", localidad: "Torrent", color: "#8a8a80" },
  { id: "liganac-villarreal", nombre: "Villarreal", grupo: "liga-nacional", localidad: "Vila-real", color: "#8a8a80" },
  { id: "liganac-roda", nombre: "Roda", grupo: "liga-nacional", localidad: "Vila-real", color: "#8a8a80" },
  { id: "liganac-valencia", nombre: "Valencia", grupo: "liga-nacional", localidad: "Valencia", color: "#8a8a80" },
  { id: "liganac-levante", nombre: "Levante", grupo: "liga-nacional", localidad: "Valencia", color: "#8a8a80" },
]

export function equiposPorGrupo(grupo) {
  return EQUIPOS.filter((equipo) => equipo.grupo === grupo)
}

export function buscarEquipoPorNombre(nombre, grupo) {
  return EQUIPOS.find((equipo) => equipo.nombre === nombre && (!grupo || equipo.grupo === grupo))
}

// Escudo local (101/101 equipos tienen archivo real en /public/escudos).
export function escudoUrl(equipo) {
  return `/escudos/${equipo.id}.png`
}
