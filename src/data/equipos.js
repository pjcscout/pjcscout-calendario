// Datos reales de equipos (Tercera Federación Grupo VI y División de Honor Juvenil Grupo 7).
// Los escudos se sirven en local desde /public/escudos/<id>.png — ya no se hotlinkea a Google Drive.

export const GRUPOS = {
  'tercera-vi': { id: 'tercera-vi', nombre: 'Tercera Federación', subnombre: 'Grupo VI', temporada: '2026-2027' },
  'dh-g7': { id: 'dh-g7', nombre: 'División de Honor Juvenil', subnombre: 'Grupo 7', temporada: '2026-2027' },
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
]

export function equiposPorGrupo(grupo) {
  return EQUIPOS.filter((equipo) => equipo.grupo === grupo)
}

export function buscarEquipoPorNombre(nombre, grupo) {
  return EQUIPOS.find((equipo) => equipo.nombre === nombre && (!grupo || equipo.grupo === grupo))
}

// Escudo local (34/34 equipos tienen archivo real en /public/escudos).
export function escudoUrl(equipo) {
  return `/escudos/${equipo.id}.png`
}
