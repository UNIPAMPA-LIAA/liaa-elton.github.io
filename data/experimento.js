// Gerado por tools/atualizar_dados.py — não editar à mão.
window.EXPERIMENTO = {
 "gerado_em": "10/11/2026 15:09",
 "runs": 20,
 "planejado": 320,
 "feitas": 52,
 "alvos": [
  "juice-shop",
  "shopify",
  "testasp",
  "testaspnet"
 ],
 "modelos": {
  "llama": "Llama 3.1 8B",
  "qwen": "Qwen 2.5 7B"
 },
 "prompts": {
  "fewshot": "few-shot",
  "cot": "chain-of-thought"
 },
 "inicio": "2026-11-10T14:49:06",
 "ultima": "2026-11-10T15:09:27",
 "hip_total": 151,
 "lat_media_s": 23.8,
 "erros_formato": 0,
 "celulas": [
  {
   "alvo": "juice-shop",
   "modelo": "llama",
   "prompt": "fewshot",
   "feitas": 20,
   "resumo": {
    "n": 20,
    "lat_med": 18.3,
    "lat_dp": 4.5,
    "hip_med": 2.35,
    "hip_min": 2,
    "hip_max": 3,
    "hip_tot": 47,
    "erros": 0,
    "tin": 1811,
    "tout_med": 303,
    "hip_por_run": [
     2,
     3,
     3,
     3,
     2,
     2,
     2,
     3,
     2,
     2,
     3,
     2,
     2,
     3,
     2,
     3,
     2,
     2,
     2,
     2
    ]
   }
  },
  {
   "alvo": "juice-shop",
   "modelo": "llama",
   "prompt": "cot",
   "feitas": 20,
   "resumo": {
    "n": 20,
    "lat_med": 33.7,
    "lat_dp": 11.3,
    "hip_med": 3.85,
    "hip_min": 1,
    "hip_max": 9,
    "hip_tot": 77,
    "erros": 0,
    "tin": 608,
    "tout_med": 631,
    "hip_por_run": [
     8,
     6,
     3,
     5,
     1,
     3,
     4,
     3,
     3,
     5,
     4,
     3,
     3,
     3,
     3,
     9,
     3,
     1,
     2,
     5
    ]
   }
  },
  {
   "alvo": "juice-shop",
   "modelo": "qwen",
   "prompt": "fewshot",
   "feitas": 12,
   "resumo": {
    "n": 12,
    "lat_med": 16.2,
    "lat_dp": 5.6,
    "hip_med": 2.25,
    "hip_min": 2,
    "hip_max": 3,
    "hip_tot": 27,
    "erros": 0,
    "tin": 1882,
    "tout_med": 326,
    "hip_por_run": [
     2,
     3,
     2,
     2,
     2,
     3,
     2,
     2,
     2,
     3,
     2,
     2
    ]
   }
  },
  {
   "alvo": "juice-shop",
   "modelo": "qwen",
   "prompt": "cot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "shopify",
   "modelo": "llama",
   "prompt": "fewshot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "shopify",
   "modelo": "llama",
   "prompt": "cot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "shopify",
   "modelo": "qwen",
   "prompt": "fewshot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "shopify",
   "modelo": "qwen",
   "prompt": "cot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testasp",
   "modelo": "llama",
   "prompt": "fewshot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testasp",
   "modelo": "llama",
   "prompt": "cot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testasp",
   "modelo": "qwen",
   "prompt": "fewshot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testasp",
   "modelo": "qwen",
   "prompt": "cot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testaspnet",
   "modelo": "llama",
   "prompt": "fewshot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testaspnet",
   "modelo": "llama",
   "prompt": "cot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testaspnet",
   "modelo": "qwen",
   "prompt": "fewshot",
   "feitas": 0,
   "resumo": null
  },
  {
   "alvo": "testaspnet",
   "modelo": "qwen",
   "prompt": "cot",
   "feitas": 0,
   "resumo": null
  }
 ],
 "humano": [],
 "avaliacao_cega": []
};
