#!/usr/bin/env python3
"""
Gera data/coleta.js: o mapa de hosts do shopify e as fontes do subfinder.

Lê  <projeto>/shopify.json                               coleta de 12/10 (a do experimento)
    <projeto>/coletas/2026-11-03/shopify.json            recoleta de 03/11 (contagens do funil)
    <projeto>/coletas/2026-11-12/subfinder_shopify.jsonl subfinder -oJ -cs (fonte de cada nome)

Uso:
    python3 tools/dados_coleta.py --projeto ..
"""
import argparse
import collections
import json
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(AQUI)

# Fontes do subfinder v2.12 (subfinder -ls): sem chave, chave opcional e com chave.
SEM_CHAVE = ["anubis", "commoncrawl", "crtsh", "digitorus", "hudsonrock", "rapiddns",
             "sitedossier", "thc", "threatcrowd", "waybackarchive"]
CHAVE_OPCIONAL = ["hackertarget", "leakix", "reconeer"]
TOTAL_FONTES = 49
CHAVES_CONFIGURADAS = ["censys", "dnsdumpster", "virustotal"]  # provider-config.yaml (só nomes)

TIPO_FONTE = {
    "virustotal": "DNS passivo de empresa (proprietário)",
    "thc": "base pública de subdomínios",
    "crtsh": "Certificate Transparency (log público assinado)",
    "hackertarget": "DNS passivo (HackerTarget)",
    "dnsdumpster": "DNS passivo (projeto da HackerTarget)",
}


def classe(status):
    if status is None:
        return "sem"
    return "4xx" if 400 <= status < 500 else "outro"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--projeto", default=os.path.dirname(SITE))
    a = ap.parse_args()
    p = a.projeto

    exp = json.load(open(os.path.join(p, "shopify.json"), encoding="utf-8"))
    grupos = []
    for h in exp["hosts"]:
        http = h.get("http") or {}
        grupos.append({
            "n": h["n"],
            "status": http.get("status"),
            "titulo": http.get("title"),
            "classe": classe(http.get("status")),
            "ex": h.get("subs", [])[:3],
        })
    sem_http = [h for h in exp["hosts"] if not h.get("http")]

    rec = json.load(open(os.path.join(p, "coletas", "2026-11-03", "shopify.json"), encoding="utf-8"))
    st = rec["meta"]["stats"]

    nomes = {}
    sf = os.path.join(p, "coletas", "2026-11-12", "subfinder_shopify.jsonl")
    for linha in open(sf, encoding="utf-8"):
        r = json.loads(linha)
        nomes.setdefault(r["host"], set()).update(r["sources"])
    por_fonte = collections.Counter(s for v in nomes.values() for s in v)
    combos = collections.Counter(tuple(sorted(v)) for v in nomes.values())

    dados = {
        "mapa": {
            "coleta": exp["meta"]["ts"],
            "total": sum(g["n"] for g in grupos),
            "classes": {c: sum(g["n"] for g in grupos if g["classe"] == c) for c in ("4xx", "outro", "sem")},
            "grupos": grupos,
            "sem_http_exemplos": sem_http[0].get("subs", []) if sem_http else [],
        },
        "recoleta": {
            "coleta": rec["meta"]["ts"],
            "encontrados": st["subfinder"] - 1,  # sem o domínio principal, que o M1 acrescenta
            "resolvem": st["dnsx"] - 1,  # idem, sem o domínio principal
            "http": st["httpx"],
        },
        "subfinder": {
            "coleta": "2026-11-12",
            "total_fontes": TOTAL_FONTES,
            "sem_chave": SEM_CHAVE,
            "chave_opcional": CHAVE_OPCIONAL,
            "chaves_configuradas": CHAVES_CONFIGURADAS,
            "unicos": len(nomes),
            "em_2_ou_mais": sum(len(v) >= 2 for v in nomes.values()),
            "fontes": [{"fonte": f, "nomes": n, "exclusivos": sum(1 for v in nomes.values() if v == {f}),
                        "tipo": TIPO_FONTE.get(f, "")} for f, n in por_fonte.most_common()],
            "combinacoes": [{"fontes": list(c), "nomes": n} for c, n in combos.most_common()],
        },
    }
    os.makedirs(os.path.join(SITE, "data"), exist_ok=True)
    out = os.path.join(SITE, "data", "coleta.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Gerado por tools/dados_coleta.py — não editar à mão.\n")
        f.write("window.COLETA = ")
        json.dump(dados, f, ensure_ascii=False, indent=1)
        f.write(";\n")
    m = dados["mapa"]
    print(f"{out}: mapa {m['total']} hosts {m['classes']}; subfinder {len(nomes)} nomes únicos")


if __name__ == "__main__":
    main()
