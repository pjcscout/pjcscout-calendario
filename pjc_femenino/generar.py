"""Genera los episodios de PJC Femenino. Uso:  python generar.py        (todos)
                                               python generar.py 3 7    (solo los episodios 3 y 7)"""
import sys, os, re
from pjc_series import TIPOS, num
from pjc_template import guardar
from episodios import EPISODIOS, BASE
from PIL import Image

os.makedirs("salida/redes", exist_ok=True); os.makedirs("salida/tiktok", exist_ok=True)
sel = {int(a) for a in sys.argv[1:]} or {e["n"] for e in EPISODIOS}
resumen = []
for c in EPISODIOS:
    if c["n"] not in sel: continue
    try:
        fig, s = TIPOS[c["tipo"]](c, c["n"])
        s["k"] = s.get("k", ""); s["fwd"] = s.get("fwd", ""); s["lng"] = s.get("lng", ""); s["ok"] = s.get("ok", ""); s["linea"] = s.get("linea", "")
        g = c["gancho"].format(**s); d = c["dato"].format(**s)
        d = d.replace("rival(es)", "rival" if s["k"] == 1 else "rivales")
        texto = f"{g}\n\n{d}\n\nIdea para tu equipo: {c['idea']}\n\n{c['pregunta']}\n\nDatos extraídos de StatsBomb.\n{BASE} {c['tags']}"
        tags = re.findall(r"#\w+", texto)
        assert len(texto) <= 600, f"Ep {c['n']}: {len(texto)} caracteres"
        assert len(tags) == 5, f"Ep {c['n']}: {len(tags)} hashtags"
        guardar(fig, f"salida/ep{c['n']:02d}.png"); open(f"salida/ep{c['n']:02d}.txt", "w").write(texto + "\n")
        # versiones por red
        last = c["tags"].split()[-1]; gtxt = g.strip(); dtxt = d.strip()
        tiktok = f"{gtxt}\n\n{c['pregunta']}\n\nDatos: StatsBomb\n{BASE} {c['tags']}"
        x = f"{gtxt} {dtxt}\n\n{c['pregunta']}\nDatos: StatsBomb #PJCFemenino {last}"
        if len(x) > 280: x = f"{gtxt}\n\n{c['pregunta']}\nDatos: StatsBomb #PJCFemenino {last}"
        assert len(x) <= 280, f"Ep {c['n']} X: {len(x)}"
        idea = c["idea"][0].upper() + c["idea"][1:]
        linkedin = (f"{gtxt}\n\n{dtxt}\n\nAplicación al fútbol base: {idea}\n\n{c['pregunta']}\n\n"
                    f"Datos extraídos de StatsBomb.\n#PJCScout #AnalisisTactico #FutbolBase {last}")
        for nom, tx in (("tiktok", tiktok), ("x", x), ("linkedin", linkedin)):
            open(f"salida/redes/ep{c['n']:02d}_{nom}.txt", "w").write(tx + "\n")
        # imagen vertical 9:16 para TikTok: la pieza 4:5 sobre el mismo fondo, con margen para la interfaz
        im = Image.open(f"salida/ep{c['n']:02d}.png").convert("RGB"); lienzo = Image.new("RGB", (1080, 1920), (14, 16, 15))
        lienzo.paste(im, (0, 230)); lienzo.save(f"salida/tiktok/ep{c['n']:02d}_916.png")
        resumen.append((c["n"], c["fecha"], len(texto), f"OK x:{len(x)}"))
    except Exception as e:
        resumen.append((c["n"], c["fecha"], 0, f"ERROR {type(e).__name__}: {e}"))
for r in resumen: print(*r, sep=" | ")
