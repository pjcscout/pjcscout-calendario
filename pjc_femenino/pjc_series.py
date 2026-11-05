"""Motor de gráficos PJC Femenino: 6 tipos de visual sobre StatsBomb Open Data."""
import warnings; warnings.filterwarnings("ignore")
import collections, json, math, urllib.request
import numpy as np, pandas as pd
from statsbombpy import sb
from matplotlib.colors import LinearSegmentedColormap
from pjc_template import *

ES = {"Spain Women's": "España", "England Women's": "Inglaterra", "Sweden Women's": "Suecia", "France Women's": "Francia",
      "Netherlands Women's": "Países Bajos", "Portugal Women's": "Portugal", "Barcelona WFC": "Barcelona",
      "Madrid CFF": "Madrid CFF", "Portland Thorns": "Portland Thorns", "Hoffenheim W": "Hoffenheim", "Germany Women's": "Alemania"}
ACENTOS = {"Bonmati": "Bonmatí", "Paredes": "Paredes", "Gonzalez": "González", "Alexia": "Alexia"}
OVERRIDE = {"Cata Coll": "Cata Coll", "Alexia Putellas": "Alexia", "Patri Guijarro": "Guijarro", "Irene Hernandez": "Paredes",
            "Mariona Caldentey": "Caldentey", "Dominique Johanna Anna Petrone Janssen": "Janssen"}
SPANISH = {"Spain Women's", "Barcelona WFC", "Madrid CFF", "Real Madrid CF W", "Atletico Madrid W"}
_cache = {}


def _ev(match):
    if match not in _cache:
        e = sb.events(match_id=match)
        lu = sb.lineups(match_id=match)
        nick = {}
        for team, df in lu.items():
            for r in df.itertuples():
                nick[r.player_name] = (r.player_nickname if isinstance(r.player_nickname, str) else None)
                if team in SPANISH: nick["_es_" + r.player_name] = True
        _cache[match] = (e[e.period <= 4].copy(), nick, e)   # sin tanda de penaltis
    return _cache[match]


def corto(name, nick):
    n = nick.get(name)
    base = n or name
    if base in OVERRIDE: return OVERRIDE[base]
    p = base.split()
    out = p[-1] if (n or len(p) <= 2 or not nick.get("_es_" + name)) else p[1]
    return ACENTOS.get(out, out)


def num(x, d=1): return f"{x:.{d}f}".replace(".", ",")


def tm_es(t): return ES.get(t, t)


def _xy(df, col):
    a = np.array(df[col].tolist(), dtype=float)
    return a[:, 0], a[:, 1]


# ---------------------------------------------------------------- 1. RED DE PASES
def red_pases(c, ep):
    ev, nick, _ = _ev(c["match"]); T = c["team"]
    lineup = ev[(ev.type == "Starting XI") & (ev.team == T)].iloc[0].tactics["lineup"]
    tit = {l["player"]["name"] for l in lineup}; dors = {l["player"]["name"]: l["jersey_number"] for l in lineup}
    subs = ev[(ev.type == "Substitution") & (ev.team == T)].sort_values(["period", "minute"])
    if len(subs) and subs.iloc[0].period <= 2:
        s0 = subs.iloc[0]; tope = int(s0.minute); lim = (ev.period < s0.period) | ((ev.period == s0.period) & (ev.minute < tope))
    else:
        tope = 90; lim = ev.period <= 2
    p = ev[(ev.type == "Pass") & (ev.team == T) & ev.pass_outcome.isna() & lim & ev.player.isin(tit) & ev.pass_recipient.isin(tit)].copy()
    p["x"], p["y"] = _xy(p, "location")
    pos = p.groupby("player")[["x", "y"]].mean(); npas = p.groupby("player").size()
    enl = collections.Counter(tuple(sorted(t)) for t in zip(p.player, p.pass_recipient))
    top = enl.most_common(3); mx = top[0][1]
    (a1, b1), n1 = top[0]; (a2, b2), n2 = top[1]
    S = lambda x: corto(x, nick)
    s = dict(A=S(a1), B=S(b1), n1=n1, A2=S(a2), B2=S(b2), n2=n2, tope=tope, team=tm_es(T))
    titulo = c.get("titulo") or f"{s['A']} y {s['B']}:\nla pareja más conectada"
    fig, ax, pitch, full = canvas(ep, titulo, f"Red de pases · {c['comp']}")
    tp = {k for k, _ in top}
    for (a, b), n in enl.items():
        if n < 4: continue
        pitch.lines(pos.x[a], pos.y[a], pos.x[b], pos.y[b], lw=1 + 9 * n / mx, color=GOLD if (a, b) in tp else CREAM,
                    alpha=0.95 if (a, b) in tp else 0.18, zorder=2, ax=ax)
    for j, v in pos.iterrows():
        t = any(j in k for k in tp)
        pitch.scatter(v.x, v.y, s=520 + npas[j] * 6, color=BG, edgecolors=GOLD if t else CREAM, linewidth=2.6, zorder=4, ax=ax)
        ax.text(v.x, v.y, str(dors[j]), color=GOLD if t else CREAM, fontsize=px(24), fontweight="bold", ha="center", va="center", zorder=5)
    ocupados = [(v.x, v.y) for _, v in pos.iterrows()]
    def libre(cands, minimo):
        mejor, mejor_d = cands[0], -1
        for (x, y) in cands:
            if not (6 <= x <= 114 and 4 <= y <= 76): continue
            d = min(math.hypot(x - ox, y - oy) for ox, oy in ocupados)
            if d > mejor_d: mejor, mejor_d = (x, y), d
            if d >= minimo: ocupados.append((x, y)); return x, y
        ocupados.append(mejor); return mejor
    for j, v in pos.iterrows():
        if not any(j in k for k in tp): continue
        c_ = [(v.x + dx, v.y + dy) for dx, dy in [(0, -6.4), (0, 6.4), (-10, 0), (10, 0), (-9, -6), (9, -6), (-9, 6), (9, 6)]]
        x, y = libre(c_, 8)
        ax.text(x, y, S(j), color=CREAM, fontsize=px(23), fontweight="semibold", ha="center", va="center",
                zorder=5, bbox=dict(boxstyle="round,pad=0.15", fc=BG, ec="none", alpha=0.85))
    for (a, b), n in top[:2]:
        mxp, myp = (pos.x[a] + pos.x[b]) / 2, (pos.y[a] + pos.y[b]) / 2
        dx, dy = pos.x[b] - pos.x[a], pos.y[b] - pos.y[a]; L = math.hypot(dx, dy) or 1; nx, ny = -dy / L, dx / L
        c_ = [(mxp + nx * k, myp + ny * k) for k in (5, -5, 8, -8)]
        x, y = libre(c_, 7)
        ax.text(x, y, str(n), color=GOLD, fontsize=px(26), fontweight="bold", ha="center", va="center", zorder=6,
                bbox=dict(boxstyle="round,pad=0.25", fc=BG, ec=GOLD, lw=1.4))
    ax.annotate("", xy=(112, 3), xytext=(88, 3), arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.6))
    ax.text(100, 7, "ataque", color=MUTED, fontsize=px(17), ha="center")
    pie(full, f"{s['A']} - {s['B']}: {n1} pases  ·  {s['A2']} - {s['B2']}: {n2}",
        "Grosor = pases entre dos jugadoras. Posición = media de sus pases (dorsales).",
        f"Pases completos entre titulares hasta el min. {tope}, sin la tanda.")
    return fig, s


# ---------------------------------------------------------------- 2. MAPA DE TIROS xG
def tiros(c, ep):
    ev, nick, _ = _ev(c["match"]); T = c["team"]
    d = ev[(ev.type == "Shot") & (ev.team == T)]
    quien = tm_es(T)
    if c.get("player"):
        d = d[d.player == c["player"]]; quien = corto(c["player"], nick)
    d = d.copy(); d["x"], d["y"] = _xy(d, "location"); xg = d.shot_statsbomb_xg.fillna(0)
    goles = int((d.shot_outcome == "Goal").sum()); best = d.loc[xg.idxmax()]
    n = len(d); tx = xg.sum()
    s = dict(quien=quien, n=n, xg=num(tx), goles=goles, bmin=int(best.minute), bxg=num(best.shot_statsbomb_xg, 2),
             bpct=int(round(best.shot_statsbomb_xg * 100)), best=corto(best.player, nick), team=tm_es(T))
    fig, ax, pitch, full = canvas(ep, f"{quien}: {n} tiros\ny {num(tx)} xG", f"Mapa de tiros · {c['comp']}", modo="half", pitch_h=583)
    for r, x_ in zip(d.itertuples(), xg):
        gol = r.shot_outcome == "Goal"
        pitch.scatter(r.x, r.y, s=170 + x_ * 2600, color=GOLD if gol else CREAM, alpha=0.95 if gol else 0.16, zorder=3, ax=ax)
        pitch.scatter(r.x, r.y, s=170 + x_ * 2600, facecolors="none", edgecolors=CREAM if gol else MUTED, linewidth=2.2, zorder=4, ax=ax)
        if x_ >= 0.15:
            ax.text(r.y, r.x, num(x_, 2), color=BG if gol else CREAM, fontsize=px(17), fontweight="bold", ha="center", va="center", zorder=6)
    ax.set_ylim(72, 121)
    pie(full, f"Mejor ocasión: {s['best']}, min. {s['bmin']}, {s['bxg']} xG", "Círculo grande = más probabilidad de gol (xG). Dorado = gol.",
        "Incluye penaltis del partido; excluye la tanda de penaltis.")
    return fig, s


# ---------------------------------------------------------------- 3. MAPA DE PRESIONES
def presiones(c, ep):
    ev, nick, _ = _ev(c["match"]); T = c["team"]
    d = ev[(ev.type == "Pressure") & (ev.team == T)].copy(); d["x"], d["y"] = _xy(d, "location")
    n = len(d); pct = int(round(100 * (d.x >= 60).mean())); alta = int(round(100 * (d.x >= 80).mean()))
    s = dict(team=tm_es(T), n=n, pct=pct, alta=alta)
    fig, ax, pitch, full = canvas(ep, f"{s['team']} presionó el {pct}%\nde las veces en campo rival", f"Mapa de presiones · {c['comp']}")
    cmap = LinearSegmentedColormap.from_list("pjc", [PANEL, "#5B4A25", GOLD])
    st = pitch.bin_statistic(d.x, d.y, statistic="count", bins=(12, 8)); pitch.heatmap(st, ax=ax, cmap=cmap, edgecolors=PANEL, zorder=1)
    pitch.scatter(d.x, d.y, s=26, color=CREAM, alpha=0.55, zorder=3, ax=ax)
    pitch.lines(60, 0, 60, 80, ax=ax, color=MUTED, lw=1.6, ls="--", zorder=2)
    ax.annotate("", xy=(112, 3), xytext=(88, 3), arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.6))
    ax.text(100, 7, "ataque", color=MUTED, fontsize=px(17), ha="center")
    pie(full, f"{n} presiones  ·  {alta}% en el último tercio", "Cada punto = una presión. Más dorado = más presiones en esa zona.",
        "Línea discontinua = medio campo. Sin la tanda de penaltis.")
    return fig, s


# ---------------------------------------------------------------- 4. CONDUCCIONES PROGRESIVAS
def conducciones(c, ep):
    ev, nick, _ = _ev(c["match"])
    d = ev[(ev.type == "Carry") & (ev.player == c["player"])].copy()
    d["x"], d["y"] = _xy(d, "location"); d["ex"], d["ey"] = _xy(d, "carry_end_location")
    d["gain"] = np.hypot(120 - d.x, 40 - d.y) - np.hypot(120 - d.ex, 40 - d.ey)
    p = d[(d.gain >= 10) & (d.ex > d.x)]
    nm = corto(c["player"], nick); n = len(p); best = p.loc[p.gain.idxmax()]
    s = dict(quien=nm, n=n, blen=int(round(best.gain)), bmin=int(best.minute), team=tm_es(d.team.iloc[0]))
    fig, ax, pitch, full = canvas(ep, f"{nm}: {n} conducciones\nprogresivas", f"Conducciones progresivas · {c['comp']}")
    pitch.arrows(p.x, p.y, p.ex, p.ey, ax=ax, color=GOLD, width=3.2, headwidth=4.5, headlength=4.5, alpha=0.9, zorder=3)
    pitch.scatter(p.x, p.y, s=70, color=CREAM, zorder=4, ax=ax)
    ax.annotate("", xy=(112, 3), xytext=(88, 3), arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.6))
    ax.text(100, 7, "ataque", color=MUTED, fontsize=px(17), ha="center")
    pie(full, f"La que más avanzó: {s['blen']} yardas, min. {s['bmin']}", "Progresiva = el balón se acerca 10 o más yardas a la portería.",
        "Punto = inicio de la conducción. Flecha = hasta dónde llega.")
    return fig, s


# ---------------------------------------------------------------- 5. MAPA DE PASES (jugadora)
def mapa_pases(c, ep):
    ev, nick, _ = _ev(c["match"])
    d = ev[(ev.type == "Pass") & (ev.player == c["player"])].copy()
    d["x"], d["y"] = _xy(d, "location"); d["ex"], d["ey"] = _xy(d, "pass_end_location")
    ok = d.pass_outcome.isna(); n = len(d)
    fwd = int(round(100 * (d.pass_angle.abs() <= math.pi / 4).mean())); lng = int(round(100 * (d.pass_length >= 32).mean()))
    nm = corto(c["player"], nick)
    s = dict(quien=nm, n=n, ok=int(round(100 * ok.mean())), fwd=fwd, lng=lng, team=tm_es(d.team.iloc[0]))
    t = {"ok": f"{nm}: {n} pases,\n{s['ok']}% completados", "fwd": f"{nm}: {n} pases,\n{fwd}% hacia delante"}.get(c["modo"], f"{nm}: {n} pases,\n{lng}% largos")
    fig, ax, pitch, full = canvas(ep, t, f"Mapa de pases · {c['comp']}")
    pitch.arrows(d.x[~ok], d.y[~ok], d.ex[~ok], d.ey[~ok], ax=ax, color=MUTED, width=1.6, headwidth=4, headlength=4, alpha=0.5, zorder=2)
    pitch.arrows(d.x[ok], d.y[ok], d.ex[ok], d.ey[ok], ax=ax, color=GOLD, width=2.4, headwidth=4, headlength=4, alpha=0.85, zorder=3)
    ax.annotate("", xy=(112, 3), xytext=(88, 3), arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.6))
    ax.text(100, 7, "ataque", color=MUTED, fontsize=px(17), ha="center")
    pie(full, f"Completó el {s['ok']}% de sus pases", "Dorado = pase completo. Gris = pase fallado.",
        "Hacia delante = ángulo de 45º o menos. Largo = 32 yardas o más.")
    return fig, s


# ---------------------------------------------------------------- 6. DATOS 360
def f360(c, ep):
    ev, nick, _ = _ev(c["match"])
    g = ev[(ev.type == "Shot") & (ev.shot_outcome == "Goal") & (ev.player == c["player"]) & (ev.shot_type != "Penalty")]
    g = g[g.minute == c["minuto"]] if c.get("minuto") else g
    shot = g.iloc[0]
    url = f"https://raw.githubusercontent.com/statsbomb/open-data/master/data/three-sixty/{c['match']}.json"
    fr = next(f for f in json.loads(urllib.request.urlopen(url, timeout=120).read()) if f["event_uuid"] == shot["id"])
    sx, sy = shot.location; nm = corto(c["player"], nick)
    rivals = [p for p in fr["freeze_frame"] if not p["teammate"]]; mates = [p for p in fr["freeze_frame"] if p["teammate"] and not p["actor"]]
    def en_cono(p):  # rival entre el tirador y los palos
        x, y = p["location"]
        if x <= sx: return False
        t = (x - sx) / (120 - sx); lo, hi = sy + t * (36 - sy), sy + t * (44 - sy)
        return lo <= y <= hi
    cono = [p for p in rivals if en_cono(p)]; k = len(cono); solo_port = k == 1 and cono[0].get("keeper")
    linea = "solo la portera en su línea de tiro" if solo_port else ("ningún rival dentro de su cono de tiro" if k == 0 else f"{k} rival{'es' if k != 1 else ''} en su línea de tiro")
    s = dict(quien=nm, k=k, min=int(shot.minute), solo=bool(solo_port), vis=len(fr["freeze_frame"]), linea=linea)
    titulo = f"Solo la portera entre\n{nm} y el gol" if solo_port else (f"Así estaba el área\ncuando marcó {nm}" if k == 0 else f"{nm} marcó con {k}\nrival{'es' if k != 1 else ''} en su línea de tiro")
    fig, ax, pitch, full = canvas(ep, titulo, f"Datos 360 · {c['comp']} · min. {s['min']}", modo="half", pitch_h=583)
    pitch.polygon([np.array(fr["visible_area"]).reshape(-1, 2)], ax=ax, color=GOLD, alpha=0.07, zorder=1)
    pitch.polygon([np.array([[sx, sy], [120, 36], [120, 44]])], ax=ax, color=GOLD, alpha=0.22, zorder=2)
    ex, ey = shot.shot_end_location[:2]
    pitch.lines(sx, sy, ex, ey, ax=ax, color=GOLD, lw=3, zorder=3)
    for p in mates: pitch.scatter(*p["location"], s=300, color=GOLD, edgecolors=BG, linewidth=1.5, zorder=4, ax=ax)
    for p in rivals:
        pitch.scatter(*p["location"], s=300, color=BG, edgecolors=CREAM, linewidth=2.4, zorder=4, ax=ax)
        if p.get("keeper"): ax.text(p["location"][1], p["location"][0], "P", color=CREAM, fontsize=px(17), fontweight="bold", ha="center", va="center", zorder=6)
    pitch.scatter(sx, sy, s=520, color=GOLD, edgecolors=CREAM, linewidth=3, zorder=5, ax=ax)
    ax.set_ylim(72, 121)
    pie(full, f"{nm}, minuto {s['min']}: {s['vis']} jugadoras visibles", "Dorado = su equipo. Contorno blanco = rivales (P = portera).",
        "Zona dorada = línea de tiro. Solo se ven las jugadoras captadas por el vídeo.")
    return fig, s


TIPOS = {"red": red_pases, "tiros": tiros, "presion": presiones, "conduccion": conducciones, "pases": mapa_pases, "360": f360}
