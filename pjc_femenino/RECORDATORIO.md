# Recordatorio: cómo regenerar la serie PJC Femenino sin ayuda

Todo el proceso es un comando. Si algún día no tienes créditos, copia y pega esto en una terminal con Python 3.10 o superior.

## 1. Preparar el entorno (una sola vez)

```bash
cd pjc_femenino
pip install -r requirements.txt
```

## 2. Generar los episodios

Todos de una vez:

```bash
python generar.py
```

Solo algunos (por ejemplo, el 3 y el 7):

```bash
python generar.py 3 7
```

Resultado en la carpeta `salida/`:
- `epNN.png`: imagen de 1080x1350 px lista para subir.
- `epNN.txt`: texto de la publicación, con comprobación automática de máximo 600 caracteres y 5 hashtags.

Los datos se descargan solos de StatsBomb Open Data. Hace falta conexión a internet.

## 3. Qué hay en cada archivo

| Archivo | Para qué sirve |
|---|---|
| `calendario.md` | Fechas, tipo de gráfico, partido y `match_id` de cada episodio |
| `textos.md` | Los 16 textos listos para copiar |
| `episodios.py` | Configuración de cada episodio: partido, jugadora y texto. Aquí se cambia todo |
| `pjc_series.py` | Los 6 tipos de gráfico (red de pases, tiros xG, presiones, conducciones, mapa de pases, 360) |
| `pjc_template.py` | Plantilla visual idéntica en toda la serie: colores, tipografía, logos, cabecera y pie |
| `assets/` | Logo PJC y logo Hudl StatsBomb en PNG transparente |

## 4. Añadir un episodio nuevo

1. Comprueba que la competición y la temporada existen en [competitions.json](https://github.com/statsbomb/open-data/blob/master/data/competitions.json).
2. Busca el `match_id` en `data/matches/{competition_id}/{season_id}.json` del mismo repositorio.
3. Copia un bloque de `episodios.py`, cambia `n`, `fecha`, `match`, `team` o `player`, y redacta `gancho`, `dato`, `idea` y `pregunta`.
4. Ejecuta `python generar.py N`.

Tipos disponibles: `red`, `tiros`, `presion`, `conduccion`, `pases`, `360`. No repitas el mismo tipo en dos semanas seguidas.

## 5. Reglas fijas de la serie

- Formato 1080x1350 px (4:5), fondo oscuro, un solo mensaje por gráfico.
- Cabecera: "PJC FEMENINO" y número de episodio. Esquina: logo PJC.
- Pie: "Datos:" con el logo de StatsBomb. En el texto: "Datos extraídos de StatsBomb."
- Texto: máximo 600 caracteres, gancho en la primera línea, una idea táctica sencilla, pregunta final, 5 hashtags, sin emojis.
- Carruseles: máximo 5 diapositivas.
- La tanda de penaltis se excluye de todos los gráficos.

## 6. Paleta de marca (sacada del logo)

- Fondo `#0E100F`
- Dorado `#BB9447`
- Crema `#F4F3EE`
- Gris de apoyo `#9A9A92`
- Tipografía: Inter. En tu equipo, cambia `plt.rcParams["font.family"]` en `pjc_template.py` si tu marca usa otra.

## 7. Si algo falla

- Error de red: comprueba la conexión y repite el comando. Los datos están en `raw.githubusercontent.com`.
- Una etiqueta se pisa con otra: cambia el partido o la jugadora en `episodios.py`.
- El texto supera 600 caracteres: el script lo avisa. Acorta `idea` o `dato` en `episodios.py`.
