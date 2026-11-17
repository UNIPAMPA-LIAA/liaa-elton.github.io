"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import dados from "@/data/experimento.json";
import { experimento as E } from "@/content/site";
import { Rolavel, Secao, Sub } from "@/components/linha/secao";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fmt } from "@/lib/base";

type Modelo = "llama" | "qwen";
type Prompt = "fewshot" | "cot";
type Combo = `${Modelo}:${Prompt}`;
const COMBOS: Combo[] = ["llama:fewshot", "llama:cot", "qwen:fewshot", "qwen:cot"];
const COR_MODELO: Record<Modelo, string> = { llama: "var(--tinta)", qwen: "var(--linha-fontes)" };
const nomeCurto = (c: Combo) => {
  const [m, p] = c.split(":") as [Modelo, Prompt];
  return `${m === "llama" ? "Llama" : "Qwen"} ${p === "cot" ? "CoT" : "few-shot"}`;
};
const preenchimento = (m: Modelo, p: Prompt) =>
  p === "cot"
    ? { backgroundImage: `repeating-linear-gradient(45deg, ${COR_MODELO[m]} 0 3px, transparent 3px 6px)`, border: `1.5px solid ${COR_MODELO[m]}` }
    : { background: COR_MODELO[m] };

export function Experimento() {
  const [sel, setSel] = useState<Combo | "todas">("todas");
  const reduzir = useReducedMotion();
  const aceso = (c: Combo) => sel === "todas" || sel === c;
  const transicao = reduzir ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

  const tecnicas = dados.tecnicas.map((t) => {
    const pr = (dados.precos as Record<string, { entrada: number; saida: number }>)[`${t.modelo}_hosp`];
    return { ...t, combo: `${t.modelo}:${t.prompt}` as Combo, custo1000: ((t.tin_med * pr.entrada + t.tout_med * pr.saida) / 1e6) * 1000 };
  });
  const maxHip = Math.max(...dados.celulas.flatMap((c) => c.resumo?.hip_por_run ?? [0]));

  const metricas: { k: keyof (typeof tecnicas)[number]; t: string; s: string; f: (v: number) => string }[] = [
    { k: "hip_med", t: "Hipóteses por execução", s: "média das 80 execuções", f: (v) => fmt(v, 2) },
    { k: "dp_dentro_alvo", t: "Variação no mesmo alvo", s: "desvio entre as 20 execuções, em hipóteses", f: (v) => fmt(v, 2) },
    { k: "fora_faixa_pct", t: "Fora da faixa de 3 a 10", s: "% das execuções que desobedeceram o prompt", f: (v) => `${fmt(v, 1)}%` },
    { k: "lat_med", t: "Tempo por execução", s: "segundos, CPU sem GPU", f: (v) => `${fmt(v, 1)} s` },
    { k: "tin_med", t: "Tokens de entrada", s: "por execução; o CoT não leva os exemplos", f: (v) => fmt(v) },
    { k: "tout_med", t: "Tokens de saída", s: "por execução", f: (v) => fmt(v) },
    { k: "tok_por_hip", t: "Tokens por hipótese", s: "saída dividida pelas hipóteses", f: (v) => fmt(v) },
    { k: "custo1000", t: "Custo se fosse hospedado", s: "US$ por mil execuções", f: (v) => `US$ ${fmt(v, 2)}` },
  ];

  const local = dados.custo.find((c) => "brl" in c) as { opcao: string; obs: string; brl: number } | undefined;
  const pagos = dados.custo.filter((c) => !("brl" in c));

  return (
    <Secao id="experimento" titulo={E.titulo} linha="pipeline" intro={<p>{E.intro}</p>}>
      <Sub>{E.modelosTitulo}</Sub>
      <Rolavel rotulo="Modelos do experimento">
        <table className="w-full min-w-[52rem] max-w-[72rem] border-collapse text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              {["Modelo", "Fabricante e licença", "Tamanho", "Janela nativa", "Janela usada", "Situação"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {E.modelos.map((m) => (
              <tr key={m.nome} className="border-b border-fio align-top">
                <th scope="row" className="px-3 py-3 text-left font-sinal font-extrabold">
                  <span className="flex items-center gap-2">
                    {m.fechada ? <EstacaoFechada /> : <span aria-hidden className="size-3.5 rounded-full" style={{ background: m.nome.startsWith("Llama") ? COR_MODELO.llama : COR_MODELO.qwen }} />}
                    {m.nome}
                  </span>
                </th>
                <td className="px-3 py-3 text-tinta-2">{m.fab}</td>
                <td className="px-3 py-3 text-tinta-2">{m.tam}</td>
                <td className="num px-3 py-3">{m.janela}</td>
                <td className="num px-3 py-3">{m.usada}</td>
                <td className={`px-3 py-3 ${m.fechada ? "font-semibold text-tinta" : "text-tinta-2"}`}>{m.situacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
      <p className="medida mt-4 leading-relaxed text-tinta-2">{E.recusa}</p>

      <Sub>{E.limitesTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{E.limitesIntro}</p>
      <Rolavel rotulo="Limites do experimento">
        <table className="w-full min-w-[40rem] max-w-[64rem] border-collapse text-[0.95rem]">
          <tbody>
            {E.limites.map((l) => (
              <tr key={l.nome} className="border-b border-fio align-top">
                <th scope="row" className="w-[22%] px-3 py-3 text-left font-sinal font-extrabold">{l.nome}</th>
                <td className="w-[16%] px-3 py-3 font-mono text-sm">{l.valor}</td>
                <td className="px-3 py-3 leading-relaxed text-tinta-2">{l.porque}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>

      {/* Token como custo e janela: três cartões curtos e o caminho em partes como uma linha de três estações. */}
      <div className="mt-14 max-w-[64rem] border-t-[3px] border-tinta pt-6">
        <h4 className="font-sinal text-xl font-black md:text-2xl">{E.tokensTitulo}</h4>
        <dl className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-3">
          {E.tokens.map((t) => (
            <div key={t.nome}>
              <dt className="font-sinal text-lg font-extrabold">{t.nome}</dt>
              <dd className="mt-1 leading-relaxed text-tinta-2">{t.texto}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 font-sinal text-lg font-extrabold">{E.partesTitulo}</p>
        <ol className="relative mt-5 grid gap-6 md:grid-cols-3 md:gap-0">
          <span aria-hidden className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-[6px] md:left-2 md:right-8 md:top-[11px] md:h-[6px] md:w-auto" style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--obra) 0 12px, transparent 12px 20px)" }} />
          {E.partes.map((p) => (
            <li key={p.n} className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 md:block md:pr-6">
              <span aria-hidden className="relative z-10 block size-7 rounded-full border-[5px] border-dashed border-obra bg-papel" />
              <div className="md:mt-3">
                <p className="font-sinal font-extrabold">
                  <span className="mr-2 font-mono text-sm text-suave">{p.n}</span>
                  {p.titulo}
                </p>
                <p className="mt-1 leading-relaxed text-tinta-2">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="medida mt-6 leading-relaxed text-tinta-2">{E.partesNota}</p>
      </div>

      {/* O seletor de linha: a mesma combinação acende na grade, nos painéis e no custo. */}
      <div className="sticky top-[6.25rem] z-20 -mx-2 mt-16 bg-papel/95 px-2 py-3 backdrop-blur-[2px] md:top-[7rem]">
        <p id="seletor-rotulo" className="font-sinal text-sm font-extrabold">{E.seletorRotulo}</p>
        <ToggleGroup
          aria-labelledby="seletor-rotulo"
          value={[sel]}
          onValueChange={(v) => setSel((v[0] as Combo | "todas") ?? "todas")}
          spacing={0}
          className="mt-2 grid w-full max-w-full grid-cols-2 gap-px rounded-[3px] border-2 border-tinta bg-tinta sm:grid-cols-5"
        >
          {(["todas", ...COMBOS] as const).map((c) => (
            <ToggleGroupItem
              key={c}
              value={c}
              className="h-11 w-full rounded-none bg-papel px-2 font-sinal text-sm font-bold first:col-span-2 sm:first:col-span-1 data-[pressed]:bg-tinta data-[pressed]:text-papel"
            >
              {c === "todas" ? "Todas" : nomeCurto(c)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="mt-2 text-sm text-suave">{E.seletorAjuda}</p>
      </div>

      <Sub>{E.gradeTitulo}</Sub>
      <p className="medida mt-3 text-tinta-2">
        Cada ponto é uma execução. O tamanho do ponto é o número de hipóteses que ela gerou, de 1 a {maxHip}: no few-shot os pontos saem parecidos; no chain-of-thought, variados.
      </p>
      <Rolavel rotulo="Grade das 320 execuções">
        <table className="w-full min-w-[46rem] max-w-[72rem] border-collapse">
          <thead>
            <tr className="border-b-2 border-tinta">
              <th scope="col" className="px-2 py-2 text-left font-sinal text-sm text-tinta-2">Alvo</th>
              {COMBOS.map((c) => (
                <th key={c} scope="col" className="px-2 py-2 text-left font-sinal text-sm text-tinta-2">{nomeCurto(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.alvos.map((alvo) => (
              <tr key={alvo} className="border-b border-fio">
                <th scope="row" className="px-2 py-3 text-left font-sinal font-extrabold">{alvo}</th>
                {COMBOS.map((c) => {
                  const [m, p] = c.split(":") as [Modelo, Prompt];
                  const cel = dados.celulas.find((x) => x.alvo === alvo && x.modelo === m && x.prompt === p);
                  const hs = cel?.resumo?.hip_por_run ?? [];
                  return (
                    <td key={c} className="px-2 py-3 align-middle">
                      <motion.div
                        animate={{ opacity: aceso(c) ? 1 : 0.18 }}
                        transition={transicao}
                        className="grid w-fit grid-cols-10 place-items-center gap-[3px]"
                        role="img"
                        aria-label={`${alvo}, ${nomeCurto(c)}: ${hs.length} execuções, hipóteses por execução ${hs.join(", ")}`}
                      >
                        {hs.map((h, i) => {
                          const d = 4 + (h / maxHip) * 10;
                          return <span key={i} className="block rounded-full" style={{ width: d, height: d, background: COR_MODELO[m] }} />;
                        })}
                      </motion.div>
                      <p className="mt-1 font-mono text-xs text-suave">{cel?.feitas ?? 0} de {dados.runs}</p>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
      <div className="mt-5 flex items-center gap-4 border-y border-fio py-3 font-sinal text-sm text-tinta-2">
        <EstacaoFechada />
        <span><b className="text-tinta">Claude Sonnet 5.5</b>: estação fechada. Recusou a tarefa no teste de fumaça de 03/11 e ficou fora da matriz.</span>
      </div>

      <Sub>{E.comparaTitulo}</Sub>
      <p className="medida mt-3 text-tinta-2">{E.comparaIntro}</p>
      <ComparaTecnicas />
      <p className="medida mt-4 text-sm leading-relaxed text-suave">{E.comparaNota}</p>

      <Sub>{E.resultadosTitulo}</Sub>
      <p className="medida mt-3 text-tinta-2">{E.resultadosIntro}</p>
      <div className="mt-8 grid max-w-[76rem] gap-x-12 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        {metricas.map((mt) => {
          const max = Math.max(...tecnicas.map((t) => Number(t[mt.k])));
          return (
            <figure key={String(mt.k)}>
              <figcaption>
                <span className="block font-sinal text-lg font-extrabold leading-tight">{mt.t}</span>
                <span className="block text-sm text-suave">{mt.s}</span>
              </figcaption>
              <ul className="mt-3 grid gap-2">
                {tecnicas.map((t) => {
                  const v = Number(t[mt.k]);
                  return (
                    <motion.li
                      key={t.combo}
                      animate={{ opacity: aceso(t.combo) ? 1 : 0.22 }}
                      transition={transicao}
                      className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 text-sm"
                    >
                      <span className="font-sinal font-semibold text-tinta-2">{nomeCurto(t.combo)}</span>
                      <span className="flex items-center gap-2">
                        <span aria-hidden className="block h-3.5 rounded-r-[3px]" style={{ width: `${(78 * v) / max}%`, ...preenchimento(t.modelo as Modelo, t.prompt as Prompt) }} />
                        <span className="num whitespace-nowrap font-sinal font-bold">{mt.f(v)}</span>
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </figure>
          );
        })}
      </div>

      <ul className="medida mt-12 grid gap-4">
        {E.leitura.map((l) => (
          <li key={l.titulo} className="leading-relaxed text-tinta-2">
            <b className="font-sinal font-extrabold text-tinta">{l.titulo}</b> {l.texto}
          </li>
        ))}
      </ul>
      <p className="medida mt-8 border-y border-dashed border-obra py-4 font-sinal font-semibold text-obra-texto">{E.avisoQualidade}</p>

      <Sub>{E.custoTitulo}</Sub>
      <p className="medida mt-3 text-tinta-2">
        As {dados.feitas} execuções usaram {fmt(dados.tokens_tot.entrada)} tokens de entrada e {fmt(dados.tokens_tot.saida)} de saída, contados pelo Ollama.
        Rodando na máquina, não houve conta de API, mas o custo não foi zero: foi a energia, na primeira linha.
      </p>
      <Rolavel rotulo="Custo das execuções">
        <table className="w-full min-w-[36rem] max-w-[56rem] border-collapse text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Opção</th>
              <th scope="col" className="px-3 py-2 text-right">Custo das {dados.feitas}</th>
              <th scope="col" className="px-3 py-2 text-right">Por execução</th>
            </tr>
          </thead>
          <tbody>
            {local ? (
              <tr className="border-b border-fio bg-painel">
                <th scope="row" className="px-3 py-3 text-left">
                  <span className="font-sinal font-extrabold">Local, como foi feito</span>
                  <span className="block text-sm font-normal text-suave">{local.obs.replace(/(\d)\.(\d)/g, "$1,$2")}</span>
                </th>
                <td className="num px-3 py-3 text-right font-sinal font-bold">R$ {fmt(local.brl, 2)}</td>
                <td className="px-3 py-3 text-right text-tinta-2">sem custo de API</td>
              </tr>
            ) : null}
            {pagos.map((c) => (
              <tr key={c.opcao} className="border-b border-fio">
                <th scope="row" className="px-3 py-3 text-left">
                  <span className="font-sinal font-extrabold">{c.opcao}</span>
                  <span className="block text-sm font-normal text-suave">{c.obs.replace(/(\d)\.(\d)/g, "$1,$2")}</span>
                </th>
                <td className="num px-3 py-3 text-right font-sinal font-bold">US$ {fmt(c.usd, c.usd < 1 ? 3 : 2)}</td>
                <td className="num px-3 py-3 text-right text-tinta-2">US$ {fmt(c.usd / dados.feitas, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
      <p className="medida mt-4 text-sm leading-relaxed text-suave">{E.custoNota}</p>
    </Secao>
  );
}

/** Estação fechada: o círculo de estação cortado, como no mapa quando a parada não atende. */
function EstacaoFechada() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" role="img" aria-label="estação fechada" className="shrink-0">
      <circle cx="11" cy="11" r="8" fill="var(--papel)" stroke="var(--linha-pipeline)" strokeWidth="3.5" />
      <path d="M4 18 L18 4" stroke="var(--linha-pipeline)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/** Few-shot contra CoT, com os dois modelos juntos (80 + 80 execuções por técnica). Tudo calculado dos dados. */
function ComparaTecnicas() {
  const precos = dados.precos as Record<string, { entrada: number; saida: number }>;
  const { watts, rs_kwh } = dados.energia;
  const fator = dados.fator_claude as Record<string, number>;
  const media = (p: string, f: (t: (typeof dados.tecnicas)[number]) => number) => {
    const ts = dados.tecnicas.filter((t) => t.prompt === p);
    return ts.reduce((a, t) => a + f(t) * t.n, 0) / ts.reduce((a, t) => a + t.n, 0);
  };
  const energiaExec = (t: (typeof dados.tecnicas)[number]) => ((t.lat_med * watts) / 3.6e6) * rs_kwh; // R$ por execução
  const linhas: { rot: string; nota: string; f: (p: string) => number; fmt: (v: number) => string}[] = [
    { rot: "Hipóteses por execução", nota: "média", f: (p) => media(p, (t) => t.hip_med), fmt: (v) => fmt(v, 2) },
    { rot: "Variação no mesmo alvo", nota: "desvio entre as 20 execuções", f: (p) => media(p, (t) => t.dp_dentro_alvo), fmt: (v) => fmt(v, 2) },
    { rot: "Fora da faixa de 3 a 10", nota: "% das execuções", f: (p) => media(p, (t) => t.fora_faixa_pct), fmt: (v) => `${fmt(v, 1)}%` },
    { rot: "Tempo por execução", nota: "CPU, sem GPU", f: (p) => media(p, (t) => t.lat_med), fmt: (v) => `${fmt(v, 1)} s` },
    { rot: "Tempo por hipótese", nota: "tempo ÷ hipóteses", f: (p) => media(p, (t) => t.lat_med) / media(p, (t) => t.hip_med), fmt: (v) => `${fmt(v, 1)} s` },
    { rot: "Tokens de saída", nota: "por execução", f: (p) => media(p, (t) => t.tout_med), fmt: (v) => fmt(v) },
    { rot: "Energia, por mil execuções", nota: "local, como foi feito", f: (p) => 1000 * media(p, energiaExec), fmt: (v) => `R$ ${fmt(v, 2)}` },
    { rot: "Energia, por mil hipóteses", nota: "local, como foi feito", f: (p) => (1000 * media(p, energiaExec)) / media(p, (t) => t.hip_med), fmt: (v) => `R$ ${fmt(v, 2)}` },
    { rot: "Hospedado, por mil execuções", nota: "Llama e Qwen no OpenRouter", f: (p) => 1000 * media(p, (t) => (t.tin_med * precos[`${t.modelo}_hosp`].entrada + t.tout_med * precos[`${t.modelo}_hosp`].saida) / 1e6), fmt: (v) => `US$ ${fmt(v, 3)}` },
    { rot: "Sonnet 5.5, por mil execuções", nota: "se não recusasse", f: (p) => 1000 * media(p, (t) => (t.tin_med * fator[p] * precos.sonnet55.entrada + t.tout_med * precos.sonnet55.saida) / 1e6), fmt: (v) => `US$ ${fmt(v, 2)}` },
  ];
  return (
    <Rolavel rotulo="Comparação entre few-shot e chain-of-thought">
      <table className="w-full min-w-[40rem] max-w-[56rem] border-collapse text-[0.95rem]">
        <thead>
          <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
            <th scope="col" className="px-3 py-2">Métrica</th>
            <th scope="col" className="px-3 py-2 text-right">Few-shot</th>
            <th scope="col" className="px-3 py-2 text-right">Chain-of-thought</th>
            <th scope="col" className="px-3 py-2 text-right">CoT ÷ few-shot</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => {
            const fs = l.f("fewshot");
            const cot = l.f("cot");
            return (
              <tr key={l.rot} className="border-b border-fio">
                <th scope="row" className="px-3 py-2.5 text-left">
                  <span className="font-sinal font-extrabold">{l.rot}</span>
                  <span className="block text-sm font-normal text-suave">{l.nota}</span>
                </th>
                <td className="num px-3 py-2.5 text-right">{l.fmt(fs)}</td>
                <td className="num px-3 py-2.5 text-right">{l.fmt(cot)}</td>
                <td className="num px-3 py-2.5 text-right font-sinal font-black">× {fmt(cot / fs, 1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Rolavel>
  );
}
