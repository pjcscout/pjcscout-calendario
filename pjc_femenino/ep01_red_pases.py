"""PJC Femenino · Ep. 1 · Red de pases de España en la final de la Eurocopa 2025."""
import warnings; warnings.filterwarnings("ignore")
import itertools, collections
import numpy as np, pandas as pd
from statsbombpy import sb
from pjc_template import *

MATCH_ID, TEAM = 4020846, "Spain Women's"   # Eurocopa 2025 · final · Inglaterra 1-1 España
CORTO = {"Catalina Thomas Coll Lluch": "Cata Coll", "Ona Batlle Pascual": "Batlle", "Irene Paredes Hernandez": "Paredes",
         "Laia Aleixandri López": "Aleixandri", "Olga  Carmona García": "Carmona", "Patricia Guijarro Gutiérrez": "Guijarro",
         "Aitana Bonmati Conca": "Bonmatí", "Alexia Putellas Segura": "Alexia", "Athenea del Castillo Belvide": "Athenea",
         "María Francesca Caldentey Oliver": "Caldentey", "Esther Gonzalez Rodríguez": "Esther"}

ev = sb.events(match_id=MATCH_ID)
ev = ev[ev.period <= 4]                                   # sin tanda de penaltis
lineup = ev[(ev.type == "Starting XI") & (ev.team == TEAM)].iloc[0].tactics["lineup"]
titulares = {l["player"]["name"] for l in lineup}
primer_cambio = ev[(ev.type == "Substitution") & (ev.team == TEAM)].sort_values(["period", "minute"]).iloc[0]
tope = primer_cambio.minute if primer_cambio.period == 2 else 45   # minuto del 1.er cambio (70')

p = ev[(ev.type == "Pass") & (ev.team == TEAM) & (ev.pass_outcome.isna()) & (ev.period <= 2) &
       ((ev.period == 1) | (ev.minute < tope)) & ev.player.isin(titulares) & ev.pass_recipient.isin(titulares)].copy()
p[["x", "y"]] = pd.DataFrame(p.location.tolist(), index=p.index)

pos = p.groupby("player")[["x", "y"]].mean()
n_pases = p.groupby("player").size()
enlaces = collections.Counter(tuple(sorted(t)) for t in zip(p.player, p.pass_recipient))
top3 = enlaces.most_common(3)
print("Pases completos entre titulares:", len(p), "| hasta el minuto", tope)
print("Top enlaces:", top3)
dorsal = {l["player"]["name"]: l["jersey_number"] for l in lineup}
der = [("Ona Batlle Pascual","Aitana Bonmati Conca"),("Irene Paredes Hernandez","Ona Batlle Pascual")]
suma_der = sum(enlaces[tuple(sorted(k))] for k in der)
total = sum(enlaces.values())
print("derecha",suma_der,"de",total, round(100*suma_der/total,1))

fig, ax, pitch, full = canvas(1, "El enlace más usado de\nEspaña fue por la derecha",
                              f"Red de pases de España · Final Eurocopa 2025 · hasta el minuto {tope}")
mx = max(enlaces.values())
top_pairs = {k for k, _ in top3}
for (a, b), n in enlaces.items():
    if n < 4: continue
    es_top = (a, b) in top_pairs
    pitch.lines(pos.x[a], pos.y[a], pos.x[b], pos.y[b], lw=1 + 9 * n / mx, color=GOLD if es_top else CREAM,
                alpha=0.95 if es_top else 0.18, zorder=2, ax=ax)
OFF_NOMBRE = {"Aitana Bonmati Conca": (-8.5, 4.2), "Ona Batlle Pascual": (0, 6.3), "Irene Paredes Hernandez": (-1, 6.3),
              "Laia Aleixandri López": (0, -6.3)}
for j, v in pos.iterrows():
    top_j = any(j in k for k in top_pairs)
    pitch.scatter(v.x, v.y, s=520 + n_pases[j] * 6, color=BG, edgecolors=GOLD if top_j else CREAM, linewidth=2.6, zorder=4, ax=ax)
    ax.text(v.x, v.y, str(dorsal[j]), color=GOLD if top_j else CREAM, fontsize=px(24), fontweight="bold", ha="center", va="center", zorder=5)
    if j in OFF_NOMBRE:
        dx, dy = OFF_NOMBRE[j]
        ax.text(v.x + dx, v.y + dy, CORTO[j], color=CREAM, fontsize=px(23), fontweight="semibold", ha="center", va="center", zorder=5,
                bbox=dict(boxstyle="round,pad=0.15", fc=BG, ec="none", alpha=0.85))
OFF_CUENTA = {("Aitana Bonmati Conca", "Ona Batlle Pascual"): (7.5, 0.5), ("Irene Paredes Hernandez", "Ona Batlle Pascual"): (-2, 6.5),
              ("Irene Paredes Hernandez", "Laia Aleixandri López"): (-6.5, 0)}
for (a, b), n in top3:
    dx, dy = OFF_CUENTA.get((a, b), (0, -3))
    ax.text((pos.x[a] + pos.x[b]) / 2 + dx, (pos.y[a] + pos.y[b]) / 2 + dy, str(n), color=GOLD, fontsize=px(26), fontweight="bold",
            ha="center", va="center", zorder=6, bbox=dict(boxstyle="round,pad=0.25", fc=BG, ec=GOLD, lw=1.4))
ax.annotate("", xy=(112, 3), xytext=(88, 3), arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.6))
ax.text(100, 7, "ataque", color=MUTED, fontsize=px(17), ha="center")
full.text(54, 1124, f"Batlle - Bonmatí: {enlaces[tuple(sorted(der[0]))]} pases  ·  Paredes - Batlle: {enlaces[tuple(sorted(der[1]))]}", color=GOLD, fontsize=px(36), fontweight="bold", va="center")
full.text(54, 1178, "Grosor = pases entre dos jugadoras. Posición = media de sus pases (dorsales).", color=MUTED, fontsize=px(22), va="center")
full.text(54, 1222, "Pases completos entre titulares, sin la tanda de penaltis.", color=MUTED, fontsize=px(22), va="center")
guardar(fig, "ep01_red_pases.png")
