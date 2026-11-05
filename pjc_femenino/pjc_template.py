"""Plantilla visual PJC Femenino · 1080x1350 (4:5). Idéntica en toda la serie."""
import glob
import numpy as np
from PIL import Image
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
from mplsoccer import Pitch

# --- Marca PJC Scout (extraída del logo) ---
BG, GOLD, CREAM = "#0E100F", "#BB9447", "#F4F3EE"
MUTED, LINE, PANEL = "#9A9A92", "#3A3D38", "#151816"
W, H, DPI = 1080, 1350, 100
SERIE = "PJC FEMENINO"
WEB = "www.pjcscout.es"
LOGO = "assets/logo_pjc.png"

for f in glob.glob("/usr/share/fonts/opentype/inter/Inter-*.otf"):
    fm.fontManager.addfont(f)
plt.rcParams["font.family"] = "Inter"


def px(v):  # píxeles -> puntos
    return v * 72 / DPI


def _logo():
    return np.asarray(Image.open(LOGO).convert("RGBA"))


def canvas(ep, titulo, subtitulo, pitch_h=662):
    """Devuelve fig y eje del campo; el resto del diseño ya está colocado."""
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI, facecolor=BG)
    full = fig.add_axes([0, 0, 1, 1]); full.set_xlim(0, W); full.set_ylim(H, 0); full.axis("off")
    # cabecera: serie + episodio (izq) y logo (dcha)
    full.text(54, 78, SERIE, color=GOLD, fontsize=px(30), fontweight="bold", va="center")
    full.text(54, 122, f"EPISODIO {ep:02d}", color=MUTED, fontsize=px(22), fontweight="semibold", va="center")
    lg = _logo(); lh = 118; lw = lh * lg.shape[1] / lg.shape[0]
    full.imshow(lg, extent=(W - 54 - lw, W - 54, 40 + lh, 40), aspect="auto", zorder=5)
    full.set_xlim(0, W); full.set_ylim(H, 0)
    full.plot([54, W - 54], [172, 172], color=GOLD, lw=1.6)
    # titular (un solo mensaje) y subtítulo
    full.text(54, 262, titulo, color=CREAM, fontsize=px(58), fontweight="bold", va="center", linespacing=1.12)
    full.text(54, 372, subtitulo, color=MUTED, fontsize=px(25), va="center")
    # campo
    top = 418
    ax = fig.add_axes([54 / W, 1 - (top + pitch_h) / H, (W - 108) / W, pitch_h / H])
    pitch = Pitch(pitch_type="statsbomb", pitch_color=PANEL, line_color=LINE, linewidth=1.4, pad_left=1, pad_right=1, pad_top=1, pad_bottom=1)
    pitch.draw(ax=ax)
    # pie
    full.plot([54, W - 54], [1262, 1262], color=LINE, lw=1)
    full.text(54, 1300, "Datos: StatsBomb", color=CREAM, fontsize=px(24), fontweight="semibold", va="center")
    full.text(W - 54, 1300, WEB, color=MUTED, fontsize=px(24), va="center", ha="right")
    return fig, ax, pitch, full


def guardar(fig, ruta):
    fig.savefig(ruta, dpi=DPI, facecolor=BG)  # sin bbox_inches: 1080x1350 exactos
    plt.close(fig)
