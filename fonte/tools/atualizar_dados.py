#!/usr/bin/env python3
"""
Atualiza src/data/experimento.json a partir dos resultados do M3/M4.

Lê   <projeto>/results/execucoes.csv           (1 linha por execução do M3)
     <projeto>/results/humano/*.json            (baseline humano, se existir)
     <projeto>/results/avaliacao_cega_*.csv     (julgamentos cegos, se existir)
Grava src/data/experimento.json  (window.EXPERIMENTO = {...})

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
PROJETO_PADRAO = os.path.expanduser("~/Área de trabalho/Mestrado/LIAA")

ALVOS = {  # domínio no CSV -> nome curto exibido
    "juice-shop.herokuapp.com": "juice-shop",
    "shopify.com": "shopify",
    "testasp.vulnweb.com": "testasp",
    "testaspnet.vulnweb.com": "testaspnet",
}
MODELOS = {"llama": "Llama 3.1 8B", "qwen": "Qwen 2.5 7B"}
PROMPTS = {"fewshot": "few-shot", "cot": "chain-of-thought"}
RUNS = 20

# Preços em US$ por milhão de tokens (entrada, saída), consultados em 12/11/2026.
# Claude: tabela oficial da Anthropic. Llama e Qwen hospedados: mediana do
# OpenRouter (agregadores variam de ~0,02 a 0,20 US$/M).
PRECOS = {
    "llama_hosp": ("Llama 3.1 8B hospedado (OpenRouter)", 0.05, 0.08),
    "qwen_hosp": ("Qwen 2.5 7B hospedado (OpenRouter)", 0.10, 0.20),
    "haiku55": ("Claude Haiku 5.5", 0.10, 0.50),
    "sonnet55": ("Claude Sonnet 5.5", 2.00, 10.00),
    "sonnet46": ("Claude Sonnet 4.6", 3.00, 15.00),
    "opus55": ("Claude Opus 5.5", 4.00, 20.00),
}
# O tokenizador do Claude conta mais tokens para o mesmo texto. Fator medido no
# teste de fumaça de 03/11 (testaspnet): Sonnet ÷ Llama na entrada.
FATOR_CLAUDE = {"fewshot": round(3813 / 1995, 2), "cot": round(2019 / 792, 2)}
# Execução local: energia estimada (notebook i7-13620H sob carga, ~80 W).
WATTS = 80
RS_KWH = 0.90


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
    ap.add_argument("--projeto", default=PROJETO_PADRAO)
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

    # ---- comparação entre técnicas (modelo × prompt, os 4 alvos juntos) ----
    ultimas = {}
    for l in linhas:
        ultimas[(l["alvo"], l["modelo"], l["prompt"], l["run"])] = l
    ul = list(ultimas.values())
    tecnicas = []
    for m in MODELOS:
        for p in PROMPTS:
            s = [l for l in ul if l["modelo"] == m and l["prompt"] == p]
            if not s:
                continue
            hip = [int(l["n_hipoteses"]) for l in s]
            dps = []
            for dom in ALVOS:
                hs = [int(l["n_hipoteses"]) for l in s if l["alvo"] == dom]
                if len(hs) > 1:
                    dps.append(st.stdev(hs))
            tin = sum(int(l["tokens_in"]) for l in s)
            tout = sum(int(l["tokens_out"]) for l in s)
            lat = sum(float(l["latencia_s"]) for l in s)
            tecnicas.append({
                "modelo": m, "prompt": p, "n": len(s),
                "hip_med": round(st.mean(hip), 2),
                "dp_dentro_alvo": round(st.mean(dps), 2) if dps else None,
                "fora_faixa_pct": round(100 * sum(not 3 <= h <= 10 for h in hip) / len(hip), 1),
                "lat_med": round(lat / len(s), 1),
                "tin_med": round(tin / len(s)), "tout_med": round(tout / len(s)),
                "tin_tot": tin, "tout_tot": tout, "lat_tot": round(lat),
                "tok_por_hip": round(tout / max(1, sum(hip))),
                "erros": sum(int(l["n_erros_formato"]) for l in s),
            })

    # ---- custo estimado das mesmas execuções em cada opção ----
    custo = []
    if tecnicas:
        def usd(tin, tout, pin, pout):
            return tin / 1e6 * pin + tout / 1e6 * pout
        hosp = sum(usd(t["tin_tot"], t["tout_tot"], *PRECOS[t["modelo"] + "_hosp"][1:]) for t in tecnicas)
        custo.append({"opcao": "Llama e Qwen hospedados (as 320, tokens medidos)", "usd": round(hosp, 4),
                      "obs": "cada modelo pelo seu preço"})
        for k in ("haiku55", "sonnet55", "sonnet46", "opus55"):
            nome, pin, pout = PRECOS[k]
            v = sum(usd(t["tin_tot"] * FATOR_CLAUDE[t["prompt"]], t["tout_tot"], pin, pout) for t in tecnicas)
            custo.append({"opcao": f"{nome} (as 320, se não recusasse)", "usd": round(v, 2),
                          "obs": f"entrada × {FATOR_CLAUDE['fewshot']} (few-shot) e × {FATOR_CLAUDE['cot']} (CoT)"})
        horas = sum(t["lat_tot"] for t in tecnicas) / 3600
        kwh = horas * WATTS / 1000
        custo.append({"opcao": "Local, na máquina (energia)", "usd": 0.0, "brl": round(kwh * RS_KWH, 2),
                      "obs": f"{horas:.1f} h × {WATTS} W = {kwh:.2f} kWh a R$ {RS_KWH:.2f}/kWh"})

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
        "tecnicas": tecnicas,
        "custo": custo,
        "tokens_tot": {"entrada": sum(t["tin_tot"] for t in tecnicas), "saida": sum(t["tout_tot"] for t in tecnicas)},
        "precos": {k: {"nome": v[0], "entrada": v[1], "saida": v[2]} for k, v in PRECOS.items()},
        "fator_claude": FATOR_CLAUDE,
        "energia": {"watts": WATTS, "rs_kwh": RS_KWH},
        "humano": humano,
        "avaliacao_cega": avaliacao,
    }
    os.makedirs(os.path.join(SITE, "src", "data"), exist_ok=True)
    out = os.path.join(SITE, "src", "data", "experimento.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"{out}: {dados['feitas']}/{dados['planejado']} execuções, "
          f"{dados['hip_total']} hipóteses, gerado {dados['gerado_em']}")


if __name__ == "__main__":
    main()
