#!/usr/bin/env python3
"""
Gera src/data/geo.json: onde ficam os IPs dos hosts do shopify (coleta de 12/10) e
quanto cada fonte do subfinder acerta (nomes que resolvem no DNS em 17/11).

Lê  <projeto>/shopify.json                               coleta de 12/10 (grupos e IPs)
    <projeto>/coletas/2026-11-12/subfinder_shopify.jsonl fonte de cada nome
    <projeto>/coletas/2026-11-17/dnsx_shopify.jsonl      dnsx -a -cname -resp -json desses nomes
    ~/.cache/geo/dbip-city.mmdb e dbip-asn.mmdb          DB-IP lite (CC BY 4.0), edição 2026-11

Uso (o módulo maxminddb está no venv de ~/.cache/geo):
    ~/.cache/geo/venv/bin/python tools/dados_geo.py --projeto ..
"""
import argparse
import collections
import json
import os

import maxminddb

AQUI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(AQUI)
PROJETO_PADRAO = os.path.expanduser("~/Área de trabalho/Mestrado/LIAA")
GEO = os.path.expanduser("~/.cache/geo")

# Nome curto de quem opera cada ASN (o DB-IP traz a razão social completa).
OPERADOR = [
    ("cloudflare", "Cloudflare"),
    ("google", "Google Cloud"),
    ("amazon", "Amazon (CloudFront)"),
    ("sendgrid", "Twilio SendGrid"),
    ("shopify", "Shopify"),
    ("fastly", "Fastly"),
]


def operador(org):
    o = (org or "").lower()
    for chave, nome in OPERADOR:
        if chave in o:
            return nome
    return org or "desconhecido"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--projeto", default=PROJETO_PADRAO)
    p = ap.parse_args().projeto

    exp = json.load(open(os.path.join(p, "shopify.json"), encoding="utf-8"))
    cidade = maxminddb.open_database(os.path.join(GEO, "dbip-city.mmdb"))
    asn = maxminddb.open_database(os.path.join(GEO, "dbip-asn.mmdb"))

    # Cada grupo do M1 aponta para um conjunto de IPs; um host responde por todos eles.
    hosts_por_ip = collections.Counter()
    sem_http_por_ip = collections.Counter()
    for g in exp["hosts"]:
        for i in g["ipx"]:
            hosts_por_ip[i] += g["n"]
            if not g.get("http"):
                sem_http_por_ip[i] += g["n"]

    lugares = {}
    por_operador = collections.defaultdict(lambda: {"ips": 0, "paises": set()})
    for i, reg in enumerate(exp["ips"]):
        c = cidade.get(reg["ip"]) or {}
        a = asn.get(reg["ip"]) or {}
        loc = c.get("location", {})
        lat, lon = round(loc.get("latitude", 0), 2), round(loc.get("longitude", 0), 2)
        nome_cidade = (c.get("city", {}).get("names", {}) or {}).get("en", "")
        pais = c.get("country", {}).get("iso_code", "")
        op = operador(a.get("autonomous_system_organization"))
        por_operador[op]["ips"] += 1
        por_operador[op]["paises"].add(pais)
        chave = (lat, lon)
        l = lugares.setdefault(chave, {"lat": lat, "lon": lon, "cidade": nome_cidade, "pais": pais,
                                       "ips": 0, "hosts": 0, "sem_resposta": 0, "operadores": set()})
        l["ips"] += 1
        l["hosts"] = max(l["hosts"], hosts_por_ip[i])  # o mesmo host aponta para vários IPs do lugar
        l["sem_resposta"] = max(l["sem_resposta"], sem_http_por_ip[i])
        l["operadores"].add(op)

    pontos = sorted(lugares.values(), key=lambda l: -l["hosts"])
    for l in pontos:
        l["operadores"] = sorted(l["operadores"])
        l["respondeu"] = l["sem_resposta"] == 0

    # Acurácia por fonte: quantos nomes de cada fonte ainda resolvem (A ou CNAME) no DNS.
    resolve = set()
    dnsx = os.path.join(p, "coletas", "2026-11-17", "dnsx_shopify.jsonl")
    for linha in open(dnsx, encoding="utf-8"):
        d = json.loads(linha)
        if d.get("a") or d.get("cname"):
            resolve.add(d["host"])
    por_fonte = collections.defaultdict(lambda: [0, 0])
    so_uma = collections.defaultdict(lambda: [0, 0])
    total = [0, 0]
    sf = os.path.join(p, "coletas", "2026-11-12", "subfinder_shopify.jsonl")
    vistos = {}
    for linha in open(sf, encoding="utf-8"):
        d = json.loads(linha)
        vistos.setdefault(d["host"], set()).update(d.get("sources", []))
    for host, fontes in vistos.items():
        ok = host in resolve
        total[0] += 1
        total[1] += ok
        for f in fontes:
            por_fonte[f][0] += 1
            por_fonte[f][1] += ok
        if len(fontes) == 1:
            f = next(iter(fontes))
            so_uma[f][0] += 1
            so_uma[f][1] += ok
    multi = [v for h, v in vistos.items() if len(v) >= 2]
    multi_ok = sum(1 for h, v in vistos.items() if len(v) >= 2 and h in resolve)

    saida = {
        "coleta_ips": exp["meta"]["ts"],
        "base_geo": "DB-IP lite 2026-11 (CC BY 4.0)",
        "total_ips": len(exp["ips"]),
        "total_hosts": sum(g["n"] for g in exp["hosts"]),
        "sem_resposta": sum(g["n"] for g in exp["hosts"] if not g.get("http")),
        "pontos": pontos,
        "operadores": sorted(
            ({"operador": k, "ips": v["ips"], "paises": sorted(v["paises"])} for k, v in por_operador.items()),
            key=lambda o: -o["ips"]),
        "acuracia": {
            "resolucao": "2026-11-17",
            "nomes": total[0],
            "resolvem": total[1],
            "por_fonte": sorted(
                ({"fonte": f, "nomes": n, "resolvem": r, "so_esta": so_uma[f][0], "so_esta_resolvem": so_uma[f][1]}
                 for f, (n, r) in por_fonte.items()), key=lambda x: -x["nomes"]),
            "em_2_ou_mais": {"nomes": len(multi), "resolvem": multi_ok},
        },
    }
    out = os.path.join(SITE, "src", "data", "geo.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(saida, f, ensure_ascii=False, indent=1)
    print("gravado", out)
    print(json.dumps({k: saida[k] for k in ("total_ips", "total_hosts", "sem_resposta", "operadores", "acuracia")},
                     ensure_ascii=False, indent=1))
    for l in pontos:
        print(l["cidade"], l["pais"], l["ips"], l["hosts"], l["sem_resposta"], l["operadores"])


if __name__ == "__main__":
    main()
