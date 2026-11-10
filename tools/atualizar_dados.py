#!/usr/bin/env python3
"""
Atualiza data/experimento.js a partir dos resultados do M3/M4.

Lê   <projeto>/results/execucoes.csv           (1 linha por execução do M3)
     <projeto>/results/humano/*.json            (baseline humano, se existir)
     <projeto>/results/avaliacao_cega_*.csv     (julgamentos cegos, se existir)
Grava data/experimento.js  (window.EXPERIMENTO = {...})

Usar .js em vez de .json deixa o site funcionar também aberto direto do disco
(file://), sem servidor — útil na apresentação.

Uso:
    python3 tools/atualizar_dados.py                  # projeto = pasta-mãe do site
    python3 tools/atualizar_dados.py --projeto ~/LIAA
"""
import argparse
import csv
import glob
import json
import os
import statistics as st
from datetime import datetime

AQUI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(AQUI)

ALVOS = {  # domínio no CSV -> nome curto exibido
    "juice-shop.herokuapp.com": "juice-shop",
    "shopify.com": "shopify",
    "testasp.vulnweb.com": "testasp",
    "testaspnet.vulnweb.com": "testaspnet",
}
MODELOS = {"llama": "Llama 3.1 8B", "qwen": "Qwen 2.5 7B"}
PROMPTS = {"fewshot": "few-shot", "cot": "chain-of-thought"}
RUNS = 20


def resumo(linhas):
    if not linhas:
        return None
    lat = [float(l["latencia_s"]) for l in linhas]
    hip = [int(l["n_hipoteses"]) for l in linhas]
    dp = lambda xs: st.stdev(xs) if len(xs) > 1 else 0.0
    return {
        "n": len(linhas),
        "lat_med": round(st.mean(lat), 1),
        "lat_dp": round(dp(lat), 1),
        "hip_med": round(st.mean(hip), 2),
        "hip_min": min(hip),
        "hip_max": max(hip),
        "hip_tot": sum(hip),
        "erros": sum(int(l["n_erros_formato"]) for l in linhas),
        "tin": int(linhas[0]["tokens_in"]),
        "tout_med": round(st.mean(int(l["tokens_out"]) for l in linhas)),
        "hip_por_run": hip,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--projeto", default=os.path.dirname(SITE))
    a = ap.parse_args()
    res = os.path.join(a.projeto, "results")

    linhas = []
    csv_path = os.path.join(res, "execucoes.csv")
    if os.path.exists(csv_path):
        with open(csv_path, newline="", encoding="utf-8") as f:
            linhas = [l for l in csv.DictReader(f) if l["modelo"] in MODELOS]

    celulas = []
    for dom, alvo in ALVOS.items():
        for m in MODELOS:
            for p in PROMPTS:
                sel = [l for l in linhas if l["alvo"] == dom and l["modelo"] == m and l["prompt"] == p]
                # a mesma execução pode ter sido retomada: fica a última por run
                por_run = {int(l["run"]): l for l in sel}
                sel = [por_run[k] for k in sorted(por_run)]
                celulas.append({"alvo": alvo, "modelo": m, "prompt": p,
                                "feitas": min(len(sel), RUNS), "resumo": resumo(sel)})

    humano = []
    for fp in sorted(glob.glob(os.path.join(res, "humano", "*.json"))):
        try:
            d = json.load(open(fp, encoding="utf-8"))
            humano.append({"alvo": os.path.basename(fp)[:-5],
                           "n_hip": len(d.get("hipoteses", [])),
                           "tempo_s": d.get("tempo_total_s")})
        except (OSError, ValueError):
            pass

    avaliacao = []
    for fp in sorted(glob.glob(os.path.join(res, "avaliacao_cega_*.csv"))):
        with open(fp, newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        julg = [r for r in rows if (r.get("veredito") or "").strip()]
        avaliacao.append({"alvo": os.path.basename(fp)[15:-4],
                          "itens": len(rows), "julgados": len(julg)})

    tss = sorted(l["ts"] for l in linhas)
    dados = {
        "gerado_em": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "runs": RUNS,
        "planejado": RUNS * len(celulas),
        "feitas": sum(c["feitas"] for c in celulas),
        "alvos": list(ALVOS.values()),
        "modelos": MODELOS,
        "prompts": PROMPTS,
        "inicio": tss[0] if tss else None,
        "ultima": tss[-1] if tss else None,
        "hip_total": sum(int(l["n_hipoteses"]) for l in linhas),
        "lat_media_s": round(st.mean(float(l["latencia_s"]) for l in linhas), 1) if linhas else None,
        "erros_formato": sum(int(l["n_erros_formato"]) for l in linhas),
        "celulas": celulas,
        "humano": humano,
        "avaliacao_cega": avaliacao,
    }
    os.makedirs(os.path.join(SITE, "data"), exist_ok=True)
    out = os.path.join(SITE, "data", "experimento.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Gerado por tools/atualizar_dados.py — não editar à mão.\n")
        f.write("window.EXPERIMENTO = ")
        json.dump(dados, f, ensure_ascii=False, indent=1)
        f.write(";\n")
    print(f"{out}: {dados['feitas']}/{dados['planejado']} execuções, "
          f"{dados['hip_total']} hipóteses, gerado {dados['gerado_em']}")


if __name__ == "__main__":
    main()
