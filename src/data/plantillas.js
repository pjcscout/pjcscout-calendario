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
export const PLANTILLAS = {
  // Lliga Comunitat Amateur Sud
  "llcsud-thader": [
    "Francisco Tremiño Aldeguer", "Pablo Torres Vegara", "Francisco J Romero Gomez", "Jose Perez Muñoz",
    "Sergio Raul Perez Losa", "Serhiy Palamar", "Kamal Mammaoui Zouhair", "Robin Valdemar Lindberg",
    "José Luis Jiménez Sarango", "Sebastian Gelardo Vegara", "Lloyd A Dummett", "Diego Corral Bernabeu",
    "Juan Canals Jacobo", "Javier Berenguer Fidalgo", "Felipe Andreu Carbonell",
  ],
  "llcsud-redovan-a": [
    "Daniel Romero Castro", "Andrew Quintana Castilho", "Victor Piñon Bobes", "Borja Mula Ruiz",
    "Iker Lopez Irles", "Javier Llor Igualada",
  ],
  "llcsud-olimpic": [
    "Santiago Villanueva Castello", "Carles Vidal Escamilla", "Alex Tormo Sanchis", "Jean Carlos Riascos Rodriguez",
    "Jorge Revert Navarro", "Luis Ramon Pardo", "Jose Miguel Perez Ruiz", "Yeray Pastor Such", "Raúl Mollá Pardo",
    "Marc Grau Vidal", "Hector Gonzalez Garcia", "Sergio Garcia Giner", "Javier Domenech Diaz", "Alex Diaz Moltó",
    "Javier Comas Part", "Victor Atienza Lujan", "Miguel Aracil Perez", "Sergi Aparicio Llorens",
  ],
  "llcsud-novelda-a": [
    "Javier Sanchez Carrasco", "Michael Andres Romero Higuera", "Manuel Rocamora Ortuño", "Jesus Prieto Paya",
    "German Portela Ignacio", "Edgar Palomares Amoros", "Alexandro Murcia Saez", "Adrian Moya Gimenez",
    "Aaron Mora Borbalás", "Pau Martinez Silvestre", "Jose M Martinez Carratala", "Luis Cayetano Martin Sastre",
    "Alejandro Marcano Sierra", "Eduardo José Julian Alarcon", "Carlos Espuch Gimenez", "Antonio Diez Canicio",
    "Paul Burgada Candela", "Helios Brotons Cespedes", "José Elio Arregoces Meza", "David Arenas Torres",
  ],
  "llcsud-rayo-ibense-a": [
    "Guillermo Sánchez Jordá", "Alejandro Sánchez Jordá", "Victor Poveda Castellar", "Oscar Poveda Castellar",
    "Hugo Oliver Cobas", "Bryan Xavier Murillo Monserrate", "Sergio Mullor Ripoll", "Joao Pedro Martins Dos Santos",
    "Navar Marti González", "Hugo Ladron De Guevara Lopez", "Hector Juan Ibañez", "Angel Guerrero Alaves",
    "Raúl Giménez Garcia", "Victor Garcia Vilaplana", "Francisco J Garcia Milan", "Jose Daniel Frances Ospina",
  ],
  "llcsud-javea": [
    "Eduardo Serrano Romero", "Luca Ruiz Diaz Lopez", "Juan M Ruano Ponzo", "Joan Pedro Monserrat",
    "Jhon Julian Ochoa Silva", "Aldo Oldrich Michan Martinez", "Francisco Jose Holmos Romero", "Izan Gregori Toquero",
    "Jordi Gregori Moratalla", "Antonio Granados Navarro", "Maximiliano Hernan Godoy", "Adrian Gil Bolufer",
    "Joan Estevan Moreno", "Lucas Manuel Destefano", "Felipe Del Rio", "Nicolás De Sanfelix Romero",
    "Pablo Cloquell Mulet", "Juan Luis Castro Baeza", "Yunior Paolo Ayala Benitez",
  ],
  "llcsud-independiente-alicante-a": [
    "Hugo Such Alvarez", "Francisco Simón Martinez", "José Javier Serrano Oliva", "Juan Felipe Rebolledo Lopez",
    "Sergio Noales Tortosa", "Carlos Mora Arias", "Adrian Lopez Cobo", "Alejandro Lledo Meseguer",
    "Kaleth Santiago Gutierrez Arias", "Héctor Camps Barberá", "Alejandro Azorin Giner",
  ],
  "llcsud-beniganim": [
    "Juan Vicente Vilar Tormo", "Alberto Sanchis Fayos", "Javier Pons Ferrer", "Alejandro Peiró Sisternes",
    "Francisco Javier Oltra Ferrús", "Josep Moscardó Escrivá", "Jorge Monzó Mestre", "Kevin Llario Garcia",
    "Ramon Gonzalez Escribano", "Izan Gomez Mora", "Alex Gascó Puertos", "Santiago Escobar Monsalve",
    "Aaron Cardos Martinez", "Diego Cambra Tornero", "Borislav Boikov Borisov", "Joan Benavent Vañó",
    "Marcos Albelda Muñoz",
  ],
  "llcsud-benidorm-a": [
    "Denzel Robert Alejandro", "Erik Ortega Moreno", "Serigne Arona Ndoye", "Victor Martinez Botella",
    "Patricio Valentin Margara Escudero", "Alvaro Lopez Sanchez", "Marcos Guillen Mora", "Jorge Andres Gomez Barrios",
    "Hugo Garcia Segura", "Alejandro De Los Santos Lopez", "Jheider Andres Cuesta Gonzalez", "Angel Cobo Santos",
    "Hector Cario Costa", "Fernando Catalin Arcana", "Davi Santana Alexandre",
  ],
  "llcsud-gandia-a": [
    "Eric Ribes Sanchez", "Pablo Olivares Sanz", "Enric Moreno Fuster", "Daniel Monzo Cervera", "Marc Molla Gomar",
    "Josep Marcilla Vercher", "Ivan Gimenez Soler", "Marc Escrivá Maño", "Anoun Diakite Watt",
    "Vicent Company Gregori", "Nicolás Cháfer Garcia", "Ivan Catala Melo", "Miguel Blasco Vercher",
    "Oscar Bertó Ramirez", "Alvaro Bernaldez Raja", "Jorge Benitez Morant", "Mouhamadou Bamba Lo",
    "Andres Almiñana Llorca",
  ],
  "llcsud-alberic": [
    "Rafael Quilis Fortuño", "Gerard Ortells Merino", "Angus Morillo Segui", "Cristian Martinez Liberato",
    "Adrian Llobregat Cucarella", "Marc Ferrer Lladosa", "Jeronimo Ferrando Ferri", "Roberto Fernandez Garrido",
    "Francisco España Sanchez", "Kevin Dasi Daza", "Juan Andres Costa Zurita", "Nicolas Cabanes Carpio",
    "Pablo Bonet Barberan", "Adam Arguigue Safsafi",
  ],
  "llcsud-alzira": [
    "Josep Vidal Asco", "Alvaro Traver Navarrete", "Juan Soria Rodriguez", "Joan Sabater Serrano",
    "Adria Sabater Olivas", "Vicente Marcos Navarrete Machado", "Miguel Navalon Bono", "Eusebio Monzo Alfonso",
    "Javier Lopez Oliveira", "Carles Llario Moscardo", "Martin Ezequiel Garcia Basta", "Vicent Fluixa Tarrazona",
    "Iván Jesús Ferrer Cesar", "Alaa Driouich Malki", "Ivan Dominguez Aviles", "Llorenç Casas Soler",
    "German Blay Lopez",
  ],
  "llcsud-calpe": [
    "Jean Carlo Viveros Torres", "Alejandro Vergillos Gonzalez", "Pablo Terol Lloret", "Jaime Rogles Berenguer",
    "Adrián Prieto Ayala", "Roberto Pérez Kerke", "Javier Lopez Sebastian", "Adrian Grigore Huides",
    "Gregorio Javier Gonzalez Fernandez", "David Alejandro Garcia Ramirez", "Luis Garcia Lozano",
    "Miguel Angel Galiana Diaz", "Fernando Gabriel Di Iorio", "Pablo M Crespo Luna", "Thiago Enrique Bedoya Velez",
  ],

  // Lliga Comunitat Amateur Nord
  "llcnord-recambios-colon-a": [
    "Aaron Viera Muñoz", "Aaron Valero Samper", "Alvaro Sospedra Castillo", "Pau Ruiz Candela",
    "Ignacio Pastor San Jerónimo", "Atanas Zdravkov Kardashev", "Daniel Iglesias Contreras", "Hector Guillem Valles",
    "Christian Gonzalez Dominguez", "Iker Sebastian Duran Campos", "Aboubacar Diarra", "Javier Borja Fuentes",
    "Nazar Bobylov", "Erik Alonso Mandingorra", "Iker Alcacer Fuentes",
  ],
  "llcnord-ribarroja-a": [
    "David Vargas Ortega", "Martin Jacinto Turegano Akuse", "Daniel Sanfeliu Gradoli", "Jesus Roiz Piñera",
    "Ignacio Pages Yarza", "Chiedozie Alexander Ozo Udeze", "Joshua Odinakachukwu Ofojetu Osayande",
    "Luca Toni Novo Guillot", "Josue Lumbreras Torres", "Alex Ibañez Lopez", "Sami Hsiba Talaero",
    "Nathan Fernandez Mora", "Vicent Candel De Lara", "Daniel Bou Seron", "Angel Babasasa Poco",
    "Sergi Asensi Diaz", "Pablo Alcaide Marco",
  ],
  "llcnord-burriana-a": [
    "Vicente Uso Ballesteros", "Pepe Segura Lopez", "Alejandro Rubio Flor", "Javier Rodenas Adsuara",
    "Alejandro Rios Misas", "Manuel Reyes Heredia", "Oscar Prats Catala", "Enrique Oliver Granell",
    "Isaac Oliva Lopez", "Orlando Andres Muresan", "Alex Marques Petit", "Juan Lopez Romero", "Nacho Lopez Ferrer",
    "Robert Garcia Sellares", "Naim Beltrán Gálvez", "Adrián Beltrán Gálvez", "Alejandro Aparisi Gallen",
    "Julio Aleixandre Penelas",
  ],
  "llcnord-la-luz-xirivella-a": [
    "Sergio Sisternas Perez", "Hector Santafosta Serna", "David Navarro Castillo", "Mario Molla Carbonell",
    "Ruben Martinez Esteve", "Daniel Gomez Garcia", "Ramon Fernandez Miko", "Arnau Cortijo Aguilar",
    "Rubén Cañadas Santos", "Sami Bousba Mimouni", "Sergio Alfaro Vicente",
  ],
  "llcnord-odisea-a": [
    "Mohamed Zaitouni", "Ariel Antonio Valladares Montiel", "Tumisho Meshack Kgotule Tsagae", "Saibou Sillah",
    "Alejandro Ripolles Cebrian", "Santiago Ramirez Blandon", "Adrian Puig Valls", "Carlos Pons Reboll",
    "Alejandro Perez Fernández", "Aidan Ronaldo Ortiz", "Antonio Maestre Martinez", "Farouk Idrissa",
    "Saúl Hurtado Gumbau", "Alvaro Hidalgo Manzano", "Wainer Gonzalez Mina", "Iker Gomez Egaña",
    "Oscar Shimelis Gil Luis", "Pablo Garcia Renau", "Andres Fernandez Moya", "Tomas Desimone",
  ],
  "llcnord-at-quart-a": [
    "Mohammed Ziani", "Cesar Gabriel Velazquez Mateo", "Manuel Utrilla Robles", "Luciano Nicolas Tuo",
    "Adrian Sujar Cost", "Pablo Sanchez Beato Gallego", "Francisco Javier Penades Sancho",
    "Sebastian Pandura Gutiérrez", "Miguel Oltra Gonzalez", "Diego Nohales Moreno", "Pablo Morgado Blanco",
    "Giovanni Monsieur Diaz", "Borja Mir Sanjose", "Carlos Mendo Fidelis", "Emilio Marti Navarro",
    "Javier Fuster Lazaro", "David Catalán González", "Pau Aguilo Mir",
  ],
  "llcnord-aldaia-a": [
    "Juan Felipe Valencia Agudelo", "Miguel Angel Tatay Soler", "Rafael Tarrega Sierra", "David Saugar Barbera",
    "Carlos Sanjuan Delgado", "Alejandro Ruiz Perez", "Hector Ruiz Hernandez", "Jordi Ramon Calabuig",
    "Sergio Muñoz Cordero", "Borja Montes Ortiz", "Hugo Molina Roig", "Pablo Hernandez Garrido",
    "Ruben Gimenez Nuñez", "Manuel Garcia Sancho", "Jorge Garcia Arroyo", "Marcos Chumillas González",
    "Alvaro Chaparro Ribes", "Francisco Angel Apostol",
  ],
  "llcnord-alcora": [
    "Ruben Vicente Flor", "Izan Velasco Garcia", "Josefrancisco Uroz Ibañez", "Daniel Sanchez Fernandez",
    "Oscar Piñón Bayo", "Manel Pinardell Duque", "Julen Palanques Aragon", "Daniel Moros Sanz",
    "Victor Mateos Selma", "Jorge Mallol Traver", "Gaizka Julian Guillamon", "Ruben Flos Exposito",
    "Daniel Flor Madrigal", "Sergio Fabregat Chiva", "Carlos Corma Nicolas", "Carlos Carrasco Gimeno",
    "Alex Caravaca Garcia", "Pau Barrachina Pitarch", "Juan Bachero Beltran", "Ivan Aviles Celades",
    "Albert Andreu Bachero",
  ],
  "llcnord-alqueries-a": [
    "Damian Sanchez Abellon", "Yerson Stiven Ramirez Aristizabal", "Germán Perez Escorihuela",
    "Victor Peña Sahuquillo", "David Pastor Torrella", "Raúl Palmer Pérez", "Carlos Navarro Martinez",
    "Izan Morcillo Flores", "Sergi Montoliu Peirats", "Alejandro Molés Benages", "Alberto Miro Hernandez",
    "Cristian Mingarro Fernandez", "Alejandro Lopez Navarro", "Juan Llopis Pastor", "David Hueso Pastor",
    "Ivan Fandos Codina", "Rafael Dolz Cortes", "Miguel Crouseilles Estrada", "Angel Conrado Chumillas Martinez",
    "Noah Castello Mollon", "Nacho Calleja Garcia",
  ],

  // Liga Nacional Juvenil
  "liganac-villarreal": [
    "Jorge Zarceño Gonzalez", "Unai Sole Del Marco", "Sergio Serrano Acosta", "Xavi Royo Mendez",
    "Hugo Romero Martinez", "Saul Perez Izquier", "Iker Perez Espinosa", "Hugo Peña Rubio",
    "Jeronimo Peña Agudelo", "Pablo Osene Ondo Ela", "Mansour Ndiaye Mbengue", "Bruno Muro Agenjo",
    "Pol Mancheño Carretero", "Ruben Luengo Cordero", "Younes Izlane Fennouch", "Alejandro Galindo Clausell",
    "Jesus Espejo Gallego", "Abass Luc Diarrassouba Traore", "Javier Ceballos Guiscafre", "Eric Bures Bonet",
    "Victor Bivol", "Anton Babchuk",
  ],
  "liganac-torrent": [
    "Hugo Vidal Lopez", "Ivan Tevar Da Silva", "Pablo Satorres Castellon", "Luca Placenave Pezzarini",
    "Diego Neria Lopez", "Martin Matamala Embela", "Diego Martinez Cabaleiro", "Daniel Lopez Requena",
    "Carlos Lopez Moratalla", "Hugo Iborra Jimenez", "Hector Goltran Gomez Zanon", "Marcos Gimenez Maestre",
    "Raul Gil Heredia", "Mateo Garcia Miquel", "Juan De Vicente Espinosa", "Jordi Albert Aparicio",
    "Hugo Albert Aparicio", "David Abella Llopis",
  ],
  "liganac-valencia": [
    "Isaac Sunyer Cebrian", "Hugo Romero Montero", "Manuel Patilla Reyes", "Luis Lacasa Molina",
    "Héctor Ferriz Fayos", "Mario Ferri Ferri", "Hector Fernandez Falcó", "Petar Plamenov Blagoev",
    "David Alcover Bocero",
  ],
  "liganac-san-pedro": [
    "Bruno Salvador Viñas", "Lucas Bryan Purcarea Jecu", "Victor Peris Escrig", "Unai Paulano Ibañez",
    "Aaron Navalon Garcia", "Alberto Museros Andreu", "Omar Macias Balaguer", "Angel Liberos Peña",
    "Javier Jordan Mancebo", "Eduardo Jimenez Rajadell", "Alex Hernandez Nacher", "Hugo Gonzalez Barrionuevo",
    "Carlos Gomez Tudela", "Mikel Gomez Moreno", "Sergi Felip Guanter", "Pau Del Aguila Hernandez",
    "Angel Beltrán Sánchez", "Juan Vicente Bedia Marquez", "Iker Balaguer Cobos", "Victor Angles Ortega",
    "Manuel Amare Barbera", "Diego Amador Moreno", "Santiago Alfaro Zarzo",
  ],
  "liganac-tavernes-blanques": [
    "Mark Vera Melendez", "Adrian Valero Fernandez", "Daniel Tatay Cano", "Luis Peces Poveda",
    "Pablo Miñana Aparisi", "Felix Mendiz Sanchez", "Lucas Martinez Lopez", "Marc Martin Montolio",
    "Hugo Martin Madrid", "Saturnino Lujan Mari", "Jorge Igual Moscardo", "Sviatoslav Hrechyn",
    "Aidan Hammad Navarro", "Jorge Gonzalez Richarte", "Oscar Diaz Gomez", "Alfonso De Grandis Hu",
    "Sento Bueno Marzal", "Antonio Bordonau Trillo Figueroa", "Julen Araujo Criado", "Jorge Abarca Ferrandis",
  ],
  "liganac-roda": [
    "Jose Luis Zambrano Casanova", "Vicent Vilalta Segarra", "Martin Valerio Barreda", "Rodrigo Salvador Cano",
    "Valentin Martinez Guijarro", "Alvaro Hernandez Sojo", "Carlos Gonzalez Ayala", "Oscar Gomez Rodriguez",
    "Carlos Gil Sendra", "Javier Ferruses Piquer", "Alvaro Ferrero Castañer", "Javier Esteve Martinez",
    "Adam El Halabi Centelles", "Jeremy Alexander Corrales Sanchez", "Houssam Chebani Barbar",
    "Arnau Calas Romero", "Yllhan Cadarsi", "Pau Bru Lluch", "Marcos Vicente Aguilar Fortalet",
  ],
  "liganac-rumbo": [
    "Qinhao Zhang", "Alejandro Sierra Garcia", "Mario Sevilla Sanchez", "Guillermo Navarro Valverde",
    "Hugo Lopez Calatayud", "Iker Hurtado Sibaute", "Tomas Lautaro Encina", "Alvaro Ballester Mora",
    "Angel Jireh Amate Contreras", "David Jose Alises Albelda",
  ],
  "liganac-moncadense": [
    "Jorge Subiela Ivars", "Mario Soriano Villora", "Miguel Soria Fernandez", "Ivan Simarro Devis",
    "Josep Sancho Berja", "Victor Saez Raga", "Samuel Saenz Pascual", "Adrian Ruiz Palomares",
    "Francisco Jose Puchades Alfonso", "Borja Pelayo Sancanuto", "Sergi Peirats Vivas",
    "Jonathan Chidera Onyesoh", "Pau Mateu Guillem", "Alejandro Martinez Alcazar", "Jorge Juan Perdiz",
    "Adrian Burdeus Palero", "David Alexandru Botea", "Pablo Albarracin Bosca",
  ],
  "liganac-levante": [
    "Pablo Tido Navas", "Ignacio Sureda Vilar", "Marc Santos Gavilan", "Hugo Peinado Llopis",
    "Fran Orduña Espinosa", "Matias Ordinas Sánchez", "Unai Juarrero Segovia", "Samuel Guersif Amador",
    "Daniel Geraldo Fabian", "Eric Garcia Perez", "Ruben Florencio Garcia", "Bruno Ferrandis Peris",
    "Joan Durá Requena", "Iustin Gabriel Alexandrescu", "Samuel Ocaña Moreno", "Hector Montero Rodriguez",
    "Alejandro López Sánchez-Ferragut", "Xavier Laroche", "Bruno Just Ferriols",
  ],
  "liganac-la-nucia": [
    "Daniel Velasquez Arias", "Pablo Vaya Cuquerella", "Pol Soria Fornes", "Jose Ruiz Guillen",
    "Kiko Riera Arques", "Miguel Requena Carrillo", "George Lazar Fornali", "Iñaki Jorda Rodriguez",
    "Lucas Hidalgo Campus", "Antonio Ovidiu Harastasan", "Victor Galdon Muñoz", "Victor Crisostomo Moñino",
    "Nicolas Aznar Rodriguez",
  ],
  "liganac-san-jose": [
    "Alvaro Selva De Les", "Daniel Ruiz Girbes", "Juan Roman Giner", "Xavy Alexander Rios Crespo",
    "Lucas Novoa Quintana", "Daniel Muñoz Ochando", "Adrian Mengual Tarazona", "Maxim Margaix Perez",
    "Samuel Marco Sanchez", "Pablo March Tos", "Facundo Agustin Lopez Pennisi", "Tomas Jakaitis",
    "Gerard Hervas Tordera", "Pablo Guerra Martinez", "Lucas Gomez Collado", "Nicolas Gimenez Mota",
    "Sergio Gil Calisalvo", "Raul Ferrando Reina", "Asier Cocera Galiano", "Hugo Catala Domenech",
    "Natxo Caballero Perez", "Gonzalo Aguilar Blaya",
  ],
  "liganac-alboraya": [
    "Héctor Villanueva Murcia", "Alvaro Simarro Orts", "Sergi San Julian Gonzalez", "Ezequiel Rinaudo Gallego",
    "Juan Pablo Pina Poveda", "Marcos Millán Rubio", "Mario Herrero Serra", "Carlos Herrero Fernandez",
    "Gabriel Gomez Hidalgo Sanchez", "Ignacio Ferrandis Espiago", "Sergio Fernandez Ruiz",
    "Mariano Escudero Ruano", "Alvaro Escriva Verdes", "Bernat Del Toro Signes", "Marcos De Tomas Morella",
    "Jorge De La Fuente Flores", "Nacho Seydou De Julián López", "Marcos Contreras Avendaño",
    "Daniel Berrocal Verdejo", "Tarek Aparisi Vaquero", "Manuel Angulo Elia", "Angel Andres Carmona",
    "Ivan Aguilar Año", "Iker Adame Caceres",
  ],
  "liganac-alzira": [
    "Daniel Zorrilla Gascón", "Marc Romero Gonzalez", "Roberto Ramirez Alapont", "Iker Pascual Vidal",
    "Unai Palop Estarlich", "Xavi Oltra Canet", "Joan Martinez Torres", "Josep Marti Malonda",
    "Andres Gimeno Tomas", "Daniel Galdon Muñoz", "Hugo Climent Sanchez", "Angel David Catala Lluberes",
    "Bruno Braquehais Villalba", "Ilias Azahaf Charabi", "Marc Arcis Mari",
  ],
  "liganac-elche": [
    "Gonzalo Quilez Villaescusa", "Pablo Muñoz Esteve", "Nacho Gilabert Garcia", "Carlos Fajardo Serrano",
    "Justino Delgado Escorza",
  ],
  "liganac-castellon": [
    "Gabriel Zatic Golovco", "Eladio Silvestre Silvestre", "Naim Aurelio Ruiz Ali", "Antonio Roqueta Alonso",
    "Marcos Romera Rodriguez", "Rodrigo Pallares Garcia", "Mauro Mollá Micó", "Lucas Martinavarro Torres",
    "Ruben Marin Ribes", "Jesus Lopez Carreño", "Peter Alexander Holguin Vasco", "Manuel Gozalbo Bort",
    "Dani Gil Insa", "Pablo Forner Merlos", "Pau Forcadell Mascaros", "Alvaro Fernandez Cañes",
    "Santiago Echeverry Isaza", "Hector Cañada Breva", "Marcos Angulo Diez", "Nicolas Alexandru Anghel",
    "Jaume Alonso Tena",
  ],
  "liganac-elda-union": [
    "Mateo Peralta", "Ruben Lopez Maestro", "Rodrigo Garcia Navarro", "Tomas Cook",
    "Hector Octavio Burnham Murillo", "Dario Berenguer Monzo",
  ],

  // Liga Autonómica Cadete
  "cadete-villarreal": [
    "Alvaro Tarraso Perez", "Aaron Ruiz Sanchez", "Eric Rodriguez Casas", "Leo Rico Albert", "Luca Reina Ruiz",
    "Mario Pinazo Trujillo", "Victor Pardo Pastor", "Gael Palomar Medina", "Izan Muñoz Garcia", "Jaume Mas Salom",
    "Arturo Marinez Azorin", "Victor Maestra Rodriguez", "Pablo Lopez Argüello", "Neville Winston Knowles III",
    "Ruben Herrera Gonzalez", "Alejandro Garcia Carcelen", "Balla Dembele Kamissoko", "Eduardo De Haro Hernández",
    "Guillermo Cuartero Calavia", "Josue Caballero Cerdeña", "Pablo Bayo Guerrero", "Marc Ascoz Gil",
  ],
  "cadete-torre-levante": [
    "Javier Villaescusa Mas", "Asier Vega Lozano", "Miguel Sanz Pedro", "Jacob Regalado Pechuan",
    "Ximo Nieto-Guerrero Cuesta", "Jorge Monteagudo Navarro", "Marc Marti Olaya", "Victor Gimenez Mesado",
    "Antonio Delgado Almendros", "Jose Contelles Zarzo", "Oke Carrasco Calvillo", "Nicolas Calderon Gutierrez",
    "Alejandro Bonfiglio Fuentes", "Gonzalo Bolinches Ruiz", "Mihail Kevin Balta", "Farouk Aouane Qatfaoui",
  ],
  "cadete-patacona": [
    "Izan Vicente Alos", "Raul Toboso Nicolau", "Roberto Nicolas Stirbu Moldovan", "Eric Pacha Hernández",
    "Daniel Nuñez Najera", "Bruno Navarro Valverde", "Angel Navarro Michelena", "Rafa Montes Garcia",
    "Hugo Machi Olcina", "Nicolas Gomis Dominguez", "Carlos Gomez Pallardo", "Nicolas Diaz Lorenzo",
    "Cristian Cuco Moscardo", "Pau Carrasco Cantero", "Diego Borrajo De Orozco Maldonado", "Victor Blanco Lorente",
    "Marco Alpuente Blazquez",
  ],
  "cadete-primer-toque": [
    "Pere Tomas Ribes", "Marcos Santamaria Albert", "Hernan Sanchez Pascual", "Javier Sanchez Martinez",
    "Diego Sanchez Alvaro", "Marc Rojano Rubio", "Vicent Roda Barbera", "Dario Picher Aguilella",
    "Pol Pablo Vericat", "Mohammed Ousrout Khannouss", "Marc Monfort Noguera", "Marc Menezo Perez",
    "Javier Lafuente Perez", "Pau Enrique Fuster", "Hugo Carrasquer Orenga", "Jose David Barreda Galiana",
    "Ayoub Ammou El Hafydy",
  ],
  "cadete-levante": [
    "Hugo Vita Maset", "Unai Saez Vallejo", "Aythami Rodriguez Suárez", "Ivan Rodriguez Paris",
    "Daniel Pedrajas Abril", "Marco Nevot Cervera", "Alejandro Miró Andrés", "Diago Miranda Rodriguez",
    "Manuel Matamoros Nuñez", "Alejandro Lujan Forment", "Steven Chiemela Igbojionu Ajuzie",
    "Tristán Guardiola Gómez", "Asier Gomez Diaz", "Ivan Galan Redko", "Alejandro Flores Inclan",
    "Esteban Ferrer Sánchez", "Hector Noel Clair Perez", "Alvaro Castellanos Anaya", "Daniel Calvente De Jesús",
    "Aaron Aroba Santos", "Alejandro Arnau Franco", "Lucas Alcala Cardoso",
  ],
  "cadete-elda-union": [
    "Aitor Tomas Benitez", "Javier Terol Almiñana", "Sergio Simon Iñigo", "Angel Rodriguez Palao",
    "Alejandro Ponsoda Vallcanera", "Marc Peñaranda Ruiz", "David Penalva Alfonso", "Marc Navarro Pla",
    "Agustin Lozano Herrera", "Diego Leiva Ucles", "Enzo Lazaro Galvan", "Victor Ibáñez Garcia",
    "Daniel Gil Garcia", "Luca Mateo Daza", "Pablo Barrantes Mira", "Iker Bañon Aracil", "Pablo Alarcon Vera",
  ],
  "cadete-alboraya": [
    "Hugo Villaescusa Cabrera", "Xavi Verdu Planells", "Arnau Ribera Rangel", "Joel Patiño Martinez",
    "Nicolas Morillas Ubach", "Leo Morales Oliva", "Hugo Martinez Boluda", "Hugo Iturbide Andres",
    "Cayetano Garcia Villar", "Cayetano Garcia Soriano", "Carles Garcia Guerrero", "Gonzalo Escorihuela Prieto",
    "Jorge De Jaime Blasco", "Diego Boso Brunet", "Adrian Blanco Martinez", "Vicente Bayarri Baldovi",
    "Ruben Alonso Camin",
  ],
  "cadete-scd-intangco": [
    "Izan Sanchez Cofrade", "Gonzalo Ruiz Pagan", "Martin Perez Llopis", "Hector Perez Duran",
    "Adam Parres Rahim", "Cruz Muñoz Castello", "Fran Moya Romero", "Oscar Moral Sanchez", "Iker Milan Giménez",
    "Eloy Mañogil Dolz", "Martin Limorte Riquelme", "Luca Eric Goian", "Juan Gil Iborra",
    "David Garcia Escudero", "Eric Galvez Buitrago", "Sergio Gadea Atencia", "Diego Cotarelo Alvarez",
    "Hugo Cobeño German", "Lucas Andres Pico", "Hector Amoros Fernandez",
  ],
  "cadete-la-nucia": [
    "David Zahonero Cantizano", "Mihai Nicusor Titiriga", "Pere Terol Orozco", "Vicent Signes Mas",
    "Daniel Sanchez Andreu", "Joaquin Rodriguez Muñoz", "Victor Perez Sepulveda", "Thiago Benjamin Malvezzi Quiroga",
    "Ignacio Lozano Cortes", "Daniel Abraham Goudsmit", "Toni Garcia Segura", "Gonzalo Beltran Gomez",
    "Dario Barreto Redondo",
  ],
  "cadete-kelme": [
    "Jayden Lucas Williams", "Pablo Soler Lumbreras", "Pablo Sanchez Ortega", "Hector Saez Anton",
    "Edgar Ramirez Chulia", "Mario Parodi Caceres", "Mario Navarro Terol", "David Navarro Cerdá",
    "David Moya Salmon", "Diego Molina Rojo", "Miguel Molina Martinez", "Bosko Martic", "Jonathan Felix Martinez",
    "Antonio Tihomir Dachev", "Joel Clos Arjona", "Gonzalo Celdran Garre", "Ruben Castello Perez",
    "Pedro Carreño Noguera", "Angel Belmonte Risueño", "Luca Giuseppe Annunziata Tomas",
    "Lucas Matias Alonso Romero", "David Aleman Alonso",
  ],
  "cadete-castellon": [
    "Jorge Vidal Tarazona", "Andreu Viciedo Rodrigo", "Diego Vicente Herrero", "Gonzalo Tabares Saborit",
    "Daniel Santacruz Santacruz", "Asier Sanchez Langa", "Joel Rodriguez Paris", "Aitor Rivera Leal",
    "Antonio Ramos Gomez", "Otto Planagumà Bagan", "Hugo Peris Escrig", "Eric Peris Escrig",
    "Marc Marza Gasulla", "Bruno Fernandez Garrido", "Nianake Diarra", "Marc Cervera Calpe",
    "Jose Cabañas Nayach", "Max Franciszek Bednorz",
  ],
  "cadete-san-jose": [
    "Anton Cristian Terhes Ardelean", "Hugo Tarraso Perez", "Carlos Sierra Arnal", "Victor Serrano Talamantes",
    "Wilter Job Sanchez Rodriguez", "Santiago Pinedo Nóbile", "Daniel Molina Viñes", "Marc Miralles Serrano",
    "Gonzalo Mascarell Marti", "Enrique Lurbe De Vicente", "Luis Lopez Rosa", "Pablo Lopez Almarcha",
    "David Javaloyes Marco", "Carles Guanter Sanchez", "Marc Gómez Casinos", "Juan Jose Gil Calisalvo",
    "Adrián Civera Gallach", "David Ciobotaru", "Lucas Amoros Tello", "Bruno Aguilar Baya",
  ],

  // Lliga Comunitat Juvenil Sud
  "llcjuvsud-tavernes-valldigna": [
    "Marc Torres Benavent", "David Ruiz Blasco", "Luis Perez Gascon", "David Marques Luna", "Iker Ferrer Beltran",
    "Vicent Chover Melo", "Juan Manuel Chiva Morant", "Arnau Castro Nicolas", "Alex Brines Ferrer",
    "Andres Borull Cuadros", "Arnau Ahullo Muñoz",
  ],
  "llcjuvsud-olimpic": [
    "Rafael Vila Sifre", "Hugo Tormos Gomis", "Iker Tomas Nova", "Abel Tamayo Canut", "Josue Soler Ramon",
    "Daniel Serradell Perales", "Bruno Sanfelix Vercher", "Andres Felipe Molina Campo", "Abel Martinez",
    "Joan Llobell Martinez", "Victor Jorques Jorques", "Aaron Gomez Olivares", "Ivan Gandia Navalon",
    "Hugo Flores Sancho", "Jose Estrada Presencia", "Victor Chorques Grau", "Pablo Ignacio Caballero Llacer",
    "Alvaro Pelayo Blach Segura", "Joan Albelda Ribero",
  ],
  "llcjuvsud-orihuela": [
    "Roberto Vivancos Muñoz", "David Vaca Durendez", "Jose Vicente Torregrosa Molino", "Nacho Rodriguez Ubeda",
    "Arturo Rodriguez Botella", "Rafael Rodenas Rodriguez", "José Manuel Rocamora Rodriguez",
    "Victor Rocamora Diaz", "Mario Riquelme Zaplana", "Nicolas Reina Hernandez", "Leandro Monzillo Ghiglia",
    "Samuel Alassane Konate Mbeti", "Javier Gomez Bravo", "Jesus Christian Conesa Chirila",
    "Alexander Baeza Goralskiy",
  ],
  "llcjuvsud-benidorm": [
    "Nicolay Filipov Todorov", "Matias Sulbaran Sanchez", "David Myumyun Rahim", "Pablo Llinares Llorca",
    "Aleix Llinares Llorca", "Maximo Jara Torres", "Xavi Hernandez Pinto", "Pavel Genov Zhelyazkov",
    "Alberto Rafael Dominguez Sanchez", "Pablo Del Estal Alarcon", "Kai Anthony Rodrigues De Groot",
    "Lucas Andrei Cucerzan", "Miguel Cabrera Morcillo", "Rayan Boumlik Abouach", "Hugo Banuls Cayon",
    "Oscar Aranega Gallardo", "Alex Ambach", "Diego Alonso Sorribes",
  ],
  "llcjuvsud-kelme": [
    "Mauro Valero Molina", "Nicolas Sebastian Tumini", "David Stefan Sasu", "Cristian Santonja Berenguer",
    "Mario Sanchez Moreno", "Pau Sagasta Mateo", "Alejandro Navarro Navarro", "Daniel Martinez Berenguer",
    "Eric Marin Rodriguez", "Luca Ioan Maier", "Oscar Garcia Ortin", "Hugo Garcia Llorente", "Raul Diaz Verdu",
    "Arnau Davalos Ortin", "Xavi Cardos Belda", "Ivan Manuel Cañizares Pucheta", "Sergio Campos Bonete",
    "Luka Bibileishvili Mamaladze", "Iroito Biacho Bueicheku", "Pedro Berenguer Rodriguez",
  ],
  "llcjuvsud-eldense": [
    "Armando Rubio Martinez", "Hugo Rico Poveda", "Aaron Piñero Mondejar", "Pablo Gomez Ballester",
    "Robert Ionut Alexandru Cristescu",
  ],
  "llcjuvsud-la-nucia": [
    "Izan Ros Soler", "Jairo Reus Avella", "Lukas Mercapide Faccio", "Hector Martinez Galipienso",
    "Alvaro Lacalle Lopez", "Hugo Gonzalez Alvarez", "Jorge Carrasco Carratalá", "Marwan Benaboura Morales",
    "Eduard Beniamin Arjoca",
  ],
  "llcjuvsud-catral-castrum": [
    "Pablo Vitaloni Pedauye", "Antonio Vazquez Molina", "Lionel Rodriguez Piñero", "Joel Roca Cerda",
    "Carlos Najar Perez", "Unai Martinez Vidal", "Ivan Khodatay", "Yassin Jarmouni Chouari",
    "Juan Jose Gutierrez Idarraga", "Luis Miguel Gimenez Asin", "Marouane Dahbani Bergad",
    "Juan Sebastian Berrio Lopez",
  ],
  "llcjuvsud-aldaya": [
    "Pablo Vela Pozo", "Iker Vaca Parra", "Arturo Tarazona Calaforra", "Javier Santervás Monleón",
    "Saul Rojas Quiroz", "Jesus Antonio Rodriguez Uzcategui", "Alvaro Paños Monton", "Rodrigo Navarro Gallego",
    "Khalil Maghrab Gourji", "Miquel Hernandez Martinez", "Javier Gimenez Cervera", "Bautista Garvin Cardozo",
    "Jose Ignacio Garcia Vera", "Marc Gallego Martinez", "Nacho Fernandez Alfaro", "David Cayetano Muñoz",
    "Angel Castillo Garcia", "Hector Ardid Gomez",
  ],
  "llcjuvsud-scd-intangco": [
    "Adrian Sanz Garcia", "Aitor Rodriguez Bobada Palomera", "Jose Joaquin Muñoz Albiñana", "Pablo Mazon Valero",
    "Feliciano Martinez Mesples", "Javier Barrie Anaya", "Iker Baeza Ruiz", "Altair Alonso Mateu",
  ],

  // Lliga Comunitat Juvenil Nord
  "llcjuvnord-villarreal": [
    "Hugo Zoroa Domingo", "Raul Estephano Varzaru Varzaru", "Pablo Tortajada Balaguer", "Manolo Rubert Colonques",
    "Franklin Chinedu Okolie Okolie", "David Navarro Cruz", "Ian Mendez Untiveros", "Kaiyuan Liu",
    "Yago Lapuente Martin", "Salim Khassanov", "Darlington Oghosa Izekor Osazuwa", "Adrian Gregori Villanueva",
    "Hector Garcia Vaca", "Dennis Adrian Ene", "Gabriel Duarte Santacruz", "Daniil Didenko Rohava",
    "Adrian Diaz Fuentes", "Adrian Cantalapiedra Cocho", "Jesús Caballero Huguet", "Andres Borras Maestre",
    "Nahuel Abadia Garcia",
  ],
  "llcjuvnord-torre-levante": [
    "Alberto Villalba Uceda", "Gaspar Vasseur Gómez", "Alejandro San Jeronimo Perez", "Victor Montijano Gadea",
    "Hector Martinez Collado", "Mansur Lucha-A Belda", "Jorge Lopez Melendez", "Izan Llorens Balaguer",
    "Antonio Jimenez Notario", "Oliver Gimenez Del Pino", "Oscar Garcia Chiner", "Andreu Gallardo Salavert",
    "Ruben Fortea Martinez", "Nicolas Cardoso Castaño", "Fabian Alejandro Camacho Guerra",
    "Marvin Santiago Caicedo Obregon", "Mario Blesa Peiró", "Yasser Benlatreche",
  ],
  "llcjuvnord-patacona": [
    "Marc Valiente Gallart", "Carlos Rangel Ferrer", "Alejandro Palmer Hernando", "Borja Morales Diaz",
    "Jose Maria Matias Gorbe", "Nicolás Martin Muria", "Izan Martin Martinez", "Daniel Lopez Argandoña",
    "Guillermo Gil Sanchez", "Alvaro Gargallo Belchi", "Dennys Garcia Lopez", "Mario Garcia Ferrando",
    "Antonio Gallur Valencia", "Lucas Ferrandis Paredes", "Alvaro Cordero Pastor", "Julio Casero Girona",
    "Andrea Cafarelli Piccolo", "Rayan Bououd Mazouz", "Marco Antonio Barba Hernandez",
  ],
  "llcjuvnord-primer-toque": [
    "Antonio Varella Hernandez", "Ian Michael Sperschneider Arango", "Ayman Sbaii", "Carlos Sanchez Beltran",
    "Abderrahman Ounajar Oumadine", "Marcos Nuñez Gual", "Jordi Mata Flor", "Dennis Manzanet Garcia",
    "Moise Otniel Floarea", "Fran Fernandez Traver", "Marc Climent Alcon", "Amr Chelli El Hadri",
    "Juan Sebastian Caicedo Viveros", "Xavi Bullon Ondoño", "Pablo Blazquez Soria", "Alessio Barbosa Garcia",
    "Pedro Arrizabalaga Martinez", "Bilal Aboussaid El Hamdaoui",
  ],
  "llcjuvnord-col-salgui": [
    "Carlos Vidal Ferriols", "Saul Valera Montesinos", "Fabio Aurelio Ruggeri Perez", "Ivan Romero Tur",
    "Pau Pujada Celda", "Hugo Perez Palacios", "Marcos Monleon Gomez", "Andres Miro Andres",
    "Alvaro Llinares Barata", "Alex Aleksander Jurczykowski", "Jesus Miguel Judez Montero",
    "Alvaro Gomez Pastrana Ivars", "Miguel Exposito Juan", "Ian Destre Roda", "Luciano Cubells Ruiz",
    "Pedro Cortes Blasco", "Aday Atienzar Afonso", "Carlos Andreu Gil", "Marcos Abalos Cañada",
  ],
  "llcjuvnord-massamagrell": [
    "Guillem Uso Alcover", "Manuel Tajuidje Pérez", "Adrian Sanfelix Rojo", "Jaime Romero Arias",
    "Santiago Peco Ortiz", "Ignacio Parreño Mir", "Daniel Palanca Feito", "Julian Hugo Oyarzun",
    "Alex Marzal Martinez", "Pau Marqués Jiménez", "Anton Korolevskiy Pogozheva", "David Gonzalez Belert",
    "Francisco Garcia Cantero", "Izan Corman Tarazona", "Jaylin Arnold Christie", "Albert Carceller Barbera",
    "David Barranco Peris", "Isaac Barba Silla", "Pablo Ariño Palanca", "Enrique Alcover Soler",
  ],
  "llcjuvnord-historics-valencia": [
    "Lev Tibeikin", "Ramos Marc De Fez", "Aitor Fernandez Aragones", "Ezekiel Chigozie Edwin Festus",
    "Alejandro Calvo Calipienso", "Joel Balaguer Delgado", "Pablo Aviles Saez",
  ],
  "llcjuvnord-manises": [
    "Jaime Treviño Perez", "Hugo Torres Navarro", "Javier Sevillano Aparicio", "Izan Saiz Escobar",
    "David Ruiz Sanchez", "Salvador Rives Gonzalez", "Hugo Pastor Femenia", "Sergio Ortiz Campos",
    "Enzo Moreton Soriano", "Alvaro Mateo Canovas", "Alejandro Grau Barcenas", "Isidro Fernandez Monedero",
    "Guilherme Colomino Mota", "Pablo Aliaga Ortega", "Alejandro Aliaga Ortega", "Hugo Albiach Serrano",
  ],
  "llcjuvnord-cf-cracks": [
    "Sebastian Ioan Varga Bacaran", "Savelii Syniato", "Platon Shangin", "Carlos Rodriguez Aragon",
    "Alejandro Perez Maras", "Rodrigo Gijón Martinez", "Javi Garrido Cortes", "Nicolas Dapcich Ferrando",
    "Jorge Benavent Cervera", "Esam Baddour", "Carlos Amores Kotlewski", "Alvaro Alfonso Bueso",
  ],
  "llcjuvnord-san-jose": [
    "Alejandro Vidal Castillo", "Alejandro Urbina Rubio", "Enzo Soldado Millan", "Pablo Siñuela Lara",
    "Alberto Serrano Sanz", "Sergio Sanz Navarro", "Angel Roselló Soler", "Luca Alessandro Pinedo",
    "Pablo Paniagua Sibaute", "Pablo Olcina Aparicio", "Mateo Navarro Pizcueta", "Leo Lozano Sendra",
    "Marc Llopes Inarejos", "Boyu Li Lin", "Jose Miguel Huesa Oliver", "Rafael Hernandez Claramunt",
    "Hugo Castillo Garcia", "Aitor Cano Gutierrez", "Daniel Alcaina Bonet",
  ],
  "llcjuvnord-cdf-canet": [
    "Marcos Vicente Garcia", "Xavi Salvador Granell", "Aitor Murillo Soria", "Alejandro David Julia Zalvez",
    "Gines Gil Agüera", "Pau Bernet Sanchez", "Samuel Amoraga Garcia",
  ],
  "llcjuvnord-alboraya": [
    "Leonardo Zeka Valencia", "He Xie", "Mario Villavicencio Fernández", "Hugo Turegano Perales",
    "Hugo Tarazona Mateos", "Javier Soriano Perez",
  ],
  "llcjuvnord-burriana-salesianos": [
    "Vladislav Zbrozhek", "Albert Vines Cerezo", "Alvaro Vila Diaz", "David Rubert Morano", "Marc Roca Gari",
    "Matteo Morra Climent", "Victor Mesado Vicente", "Dani Hernandez Ballester", "Jordi Gonzalez Lopez",
    "Guillem Gimenez Llopis", "David Gil Ibañez", "Miguel Galera Sanz", "Alvaro Fuentes Segura",
    "Marcos Espada Sanchez", "Eduardo Aurelian Ciutacu", "Mario Casino Esteve", "Pablo Cabrera Gilabert",
    "Matias Eros Budassi Sellart", "Alexandre Alemany Torrat", "Marcelo Albert Guinot", "Jorge Agustina Llopis",
  ],
  "llcjuvnord-betera": [
    "Guillem Vazquez Sahuquillo", "Raul Romero Civera", "Mykhailo Posternak", "Jose Antonio Peña Hernandez",
    "Hugo Jose Morte Garcia", "Marc Lozano Rodrigo", "Adrian Cervera Balaguer", "Daniel Bosque Diaz",
    "Marc Bosch Campos", "Hugo Armiñana Santamaria", "Iker Argandoña Roch", "David Aparisi Martinez",
    "Hugo Alabau Rodrigo",
  ],
  "llcjuvnord-acero": [
    "Elias Zamora", "Abel Martinez Vaquero", "Hector Martin Baron", "Aaron Madrid Garcia", "Jorge Lopez Vila",
    "Alejandro De Haro Rodriguez", "Saul Clemente Rambla",
  ],
}

export function plantillaEquipo(id) {
  return PLANTILLAS[id] || null
}
