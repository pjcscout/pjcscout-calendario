// Ficha de equipo (campo, dirección, equipación) para los equipos de Lliga Comunitat,
// extraída de los PDFs oficiales de calendario de la FFCV (sección "Datos de interés").
// Solo existe para los equipos donde la federación publica esta información; el resto
// de categorías no tienen ficha todavía.

export const FICHAS = {
  "llcsud-thader": {
    campo: "Campo Mpal. de Rojales F-11 - Hierba Natural (HN)",
    direccion: "P.º de Bo Astrom N? 101, 24, 03170, Rojales, (Alicante)",
    primera: { camiseta: "Azul", pantalon: "Negro", medias: "Azules" },
    segunda: { camiseta: "Verde", pantalon: "Blanco", medias: "Blancas" },
  },
  "llcsud-almoradi-a": {
    campo: "Estadio Mpal. Sadrian F-11 Almoradí - Hierba Artificial (HA)",
    direccion: "Polideportivo Sadrián, C. Gaviotas, 1, 03160, Almoradí, (Alicante)",
    primera: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
    segunda: { camiseta: "Rosa", pantalon: "Rosa", medias: "Rosa" },
  },
  "llcsud-calpe": {
    campo: "Campo Mpal. de Calpe F-11 - Hierba Artificial (HA)",
    direccion: "Av. Casanova, 4U, 03710, Calpe, (Alicante)",
    primera: { camiseta: "VERDE", pantalon: "NEGRO", medias: "NEGRAS" },
    segunda: { camiseta: "Rosa", pantalon: "Blanco", medias: "Blancas" },
  },
  "llcsud-novelda-a": {
    campo: "Campo Mpal. La Magdalena F-11 Novelda - Hierba Natural (HN)",
    direccion: "Av. Pérez Galdós, 7, 03660, Novelda, (Alicante)",
    primera: { camiseta: "Blanca", pantalon: "Blanco", medias: "Verdes" },
    segunda: null,
  },
  "llcsud-redovan-a": {
    campo: "Campo Mpal. Antonio Pascual Gil F-11 - Hierba Artificial (HA)",
    direccion: "Diseminado los Cuartos, 77, 03370, Redován, (Alicante)",
    primera: null,
    segunda: null,
  },
  "llcsud-olimpic": {
    campo: "Campo Futbol Mpal. La Murta F-11 Xativa - Hierba Artificial (HA)",
    direccion: "Avda. de La Murta, s/n,, 46800, Xàtiva, (Valencia)",
    primera: { camiseta: "BLANCA", pantalon: "BLANCO", medias: "BLANCAS" },
    segunda: { camiseta: "Naranja", pantalon: "Naranja", medias: "Naranja" },
  },
  "llcsud-tavernes-valldigna": {
    campo: "Poliesportiu Mpal. de Tavernes Valldigna F-11 - Hierba Artificial (HA)",
    direccion: "Carrer Metge Paco Valiente, s/n,, 46760, Tavernes De La Valldigna, (Valencia)",
    primera: null,
    segunda: null,
  },
  "llcsud-alberic": {
    campo: "Estadio Mpal. Manolo Sanchis F-11 Alberic - Hierba Artificial (HA)",
    direccion: "Avda. La Marquesa, s/n, , 46260, Alberic, (Valencia)",
    primera: { camiseta: "Blanca", pantalon: "Negro", medias: "Blancas" },
    segunda: { camiseta: "Granate", pantalon: "Granate", medias: "Granate" },
  },
  "llcsud-javea": {
    campo: "Camp D' Esport Mpal. Javea F-11 - Hierba Artificial (HA)",
    direccion: "Carrer del Molí de la Safranera, 4, 03737, Jávea, (Alicante)",
    primera: { camiseta: "1", pantalon: "1", medias: "1" },
    segunda: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
  },
  "llcsud-benidorm-a": {
    campo: "Estadio Mpal. Guillermo Amor F-11 Benidorm - Hierba Artificial (HA)",
    direccion: "Avda. Ciudad Deportiva, 21, 03502, Benidorm, (Alicante)",
    primera: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
    segunda: { camiseta: "Blanca", pantalon: "Blanco", medias: "Blancas" },
  },
  "llcsud-independiente-alicante-a": {
    campo: "Campo Mpal. Antonio Solana Anexo F-11 - Hierba Artificial (HA)",
    direccion: "Calle Barítono Paco Latorre, 6, 03015, Alicante, (Alicante)",
    primera: { camiseta: "Azul", pantalon: "Blanco", medias: "Azules" },
    segunda: { camiseta: "Amarilla", pantalon: "Amarilla", medias: "Amarillas" },
  },
  "llcsud-santa-pola": {
    campo: "Estadio Mpal. Manolo Macia F-11 Santa Pola - Hierba Natural (HN)",
    direccion: "Av. Albacete, 10, 03130, Santa Pola, (Alicante)",
    primera: null,
    segunda: { camiseta: "Negra", pantalon: "Negro", medias: "Negras" },
  },
  "llcsud-gandia-a": {
    campo: "Estadi Guillermo Olagüe F-11 Gandia - Hierba Artificial (HA)",
    direccion: "Avda. del Esports, s/n,, 46701, Gandia, (Valencia)",
    primera: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
    segunda: { camiseta: "Roja", pantalon: "Rojo", medias: "Rojas" },
  },
  "llcsud-alzira": {
    campo: "Estadio Luis Suñer Pico F-11 Alzira - Hierba Natural (HN)",
    direccion: "Carrer de la U.D. Alzira, 1,, 46600, Alzira, (Valencia)",
    primera: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
    segunda: { camiseta: "Blanca", pantalon: "-", medias: "-" },
  },
  "llcsud-rayo-ibense-a": {
    campo: "Estadio Mpal. Francisco Vilaplana Mariel F-11 Ibi - Hierba Artificial (HA)",
    direccion: "Calle Sevilla, 6, 03440, Ibi, (Alicante)",
    primera: null,
    segunda: { camiseta: "Negra", pantalon: "Negro", medias: "Negras" },
  },
  "llcsud-beniganim": {
    campo: "Campo Mpal. de Fútbol de Beniganim F-11 - Hierba Artificial (HA) Dirección campo: Camino de la Suerte, 21, 46830, Benigánim, (Valencia)",
    direccion: "Camino de la Suerte, 21, 46830, Benigánim, (Valencia)",
    primera: { camiseta: "Blanca y roja", pantalon: "Blanco", medias: "Blancas" },
    segunda: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
  },
  "llcnord-silla": {
    campo: "Polideportivo Mpal. Vicente Morera F-11 Silla - Hierba Artificial (HA)",
    direccion: "Avenida Gandia, s/n,, 46460, Silla, (Valencia)",
    primera: { camiseta: "Blanca", pantalon: "Blanco", medias: "Blancas" },
    segunda: { camiseta: "Verde", pantalon: "Verde", medias: "Verdes" },
  },
  "llcnord-almazora-a": {
    campo: "Campo Mpal. Jose Manuel Pesudo F-11 Almassora - Hierba Artificial (HA)",
    direccion: "Calle Pla del Calvari, s/n, 12550, Almazora, (Castellón)",
    primera: { camiseta: "Blanco y negro", pantalon: "Negro", medias: "Negro" },
    segunda: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
  },
  "llcnord-ribarroja-a": {
    campo: "Campo Futbol Mpal. Roberto Gil F-11 Riba-roja - Hierba Artificial (HA)",
    direccion: "Poligono Nº 62, 289,, 46190, Riba-Roja De Túria, (Valencia)",
    primera: { camiseta: "Roja", pantalon: "Marino", medias: "Marino" },
    segunda: { camiseta: "Azul", pantalon: "Negro", medias: "Azules" },
  },
  "llcnord-massanassa": {
    campo: "Polideportivo Mpal. D'Esports Massanassa F-11 - Hierba Artificial (HA) Dirección campo: Calle del Poliesportiu, 0 s/n, 46470, Massanassa, (Valencia)",
    direccion: "Calle del Poliesportiu, 0 s/n, 46470, Massanassa, (Valencia)",
    primera: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
    segunda: { camiseta: "Blanca", pantalon: "Blanco", medias: "Blancas" },
  },
  "llcnord-odisea-a": {
    campo: "Ciudad Dptva. Facsa Castellón F-11 Campo 1 - Hierba Artificial (HA)",
    direccion: "Cuadra Colomera, 9, 12004, Castellón De La Plana, (Castellón)",
    primera: { camiseta: "Negra", pantalon: "Negro", medias: "Negras" },
    segunda: { camiseta: "Blanquiazul", pantalon: "Azul", medias: "Azules" },
  },
  "llcnord-alcora": {
    campo: "Campo Mpal. El Saltador F-11 L`Alcora - Hierba Artificial (HA)",
    direccion: "Carrer Concordia, 31, 12110, Alcora (L'), (Castellón)",
    primera: { camiseta: "Roja", pantalon: "Azul", medias: "Azul" },
    segunda: { camiseta: "Azul", pantalon: "Azul", medias: "Azul" },
  },
  "llcnord-recambios-colon-a": {
    campo: "Campo Mpal. El Perdiguer F-11 Aldaia - Hierba Artificial (HA) Dirección campo: Calle Pintor Segrelles, 2, 46960, Aldaia, (Valencia)",
    direccion: "Calle Pintor Segrelles, 2, 46960, Aldaia, (Valencia)",
    primera: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
    segunda: { camiseta: "Verde", pantalon: "Verde", medias: "Verdes" },
  },
  "llcnord-manises-a": {
    campo: "Polideportivo Mpal. de Manises F-11 Campo 1 - Hierba Artificial (HA)",
    direccion: "Carrer dels Esports, s/n, , 46940, Manises, (Valencia)",
    primera: { camiseta: "Azul", pantalon: "Azul", medias: "Azules" },
    segunda: { camiseta: "Blanca", pantalon: "Negro", medias: "Negras" },
  },
  "llcnord-aldaia-a": {
    campo: "Polideportivo Mpal. Aldaia F-11 - Hierba Artificial (HA)",
    direccion: "Calle Joaquin Blume, s/n, 46960, Aldaia, (Valencia)",
    primera: { camiseta: "Roja", pantalon: "Rojo", medias: "Rojas" },
    segunda: { camiseta: "Blanca", pantalon: "Negro", medias: "Negras" },
  },
  "llcnord-alqueries-a": {
    campo: "Instalaciones Dptvas. Alquerias F-11 Campo 1 - Hierba Artificial (HA)",
    direccion: "Camino La Regenta, s/n, 12539, Alquerías Del Niño Perdido, (Castellón)",
    primera: null,
    segunda: null,
  },
  "llcnord-paiporta": {
    campo: "Campo de Fútbol Mpal. El Terrer F-11 Paiporta - Hierba Artificial (HA)",
    direccion: "C. Literat Azorín, 3, 46200, Paiporta, (Valencia)",
    primera: { camiseta: "Azul", pantalon: "Blanco", medias: "Azul" },
    segunda: { camiseta: "Naranja", pantalon: "Blanco", medias: "Naranja" },
  },
  "llcnord-la-luz-xirivella-a": {
    campo: "Campo Mpal. Barrio La Luz F-11 Valencia - Hierba Artificial (HA)",
    direccion: "C. Veinticinco Abril, 1A, L'Olivereta, 46950, Xirivella, (Valencia)",
    primera: { camiseta: "Granate", pantalon: "Azul", medias: "Granates" },
    segunda: { camiseta: "Verde", pantalon: "Verde", medias: "Verde" },
  },
  "llcnord-onda-a": {
    campo: "Campo Mpal. Enrique Saura Gil F-11 Onda - Hierba Artificial (HA)",
    direccion: "Calle Torrechiva, 2, 12200, Onda, (Castellón)",
    primera: { camiseta: "Roja", pantalon: "Azul", medias: "Rojas" },
    segunda: { camiseta: "Azul", pantalon: "-", medias: "Azules" },
  },
  "llcnord-burriana-a": {
    campo: "Campo Mpal. Joan B. Planelles Marco F-11 Burriana - Hierba Artificial (HA)",
    direccion: "Camí Artana, s/n, 12530, Burriana, (Castellón)",
    primera: null,
    segunda: null,
  },
  "llcnord-at-quart-a": {
    campo: "Campos Mpales. La Moleta F-11 Vall d`Uxó Campo A - Hierba Artificial (HA)",
    direccion: "Ronda Enrique Marco Zaragoza, 5, 12600, Vall D'Uixó (La), (Castellón)",
    primera: null,
    segunda: { camiseta: "-", pantalon: "Negro", medias: "Negras" },
  },
  "llcnord-nou-jove-castello-a": {
    campo: "Campo Mpal. Agustin Sancho Benlloch F-11 - Hierba Artificial (HA)",
    direccion: "Calle Llibertat, s/n, 12181, Benlloch, (Castellón)",
    primera: { camiseta: "Blanca", pantalon: "Blanco", medias: "Blanco" },
    segunda: { camiseta: "Roja", pantalon: "Rojo", medias: "Rojas" },
  },
}

export function fichaEquipo(id) {
  return FICHAS[id] || null
}
