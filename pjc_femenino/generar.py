"""Genera los episodios de PJC Femenino. Uso:  python generar.py        (todos)
                                               python generar.py 3 7    (solo los episodios 3 y 7)"""
import sys, os, re
from pjc_series import TIPOS, num
from pjc_template import guardar
from episodios import EPISODIOS, BASE

os.makedirs("salida", exist_ok=True)
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
        resumen.append((c["n"], c["fecha"], len(texto), "OK"))
    except Exception as e:
        resumen.append((c["n"], c["fecha"], 0, f"ERROR {type(e).__name__}: {e}"))
for r in resumen: print(*r, sep=" | ")
