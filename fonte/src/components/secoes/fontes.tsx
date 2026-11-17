import geo from "@/data/geo.json";
import { fontesSecao as F, type LinhaId } from "@/content/site";
import { Rolavel, Secao, Sub } from "@/components/linha/secao";
import { fmt } from "@/lib/base";

const corLinha: Record<LinhaId, string> = {
  pipeline: "var(--linha-pipeline)",
  fontes: "var(--linha-fontes)",
  rodadas: "var(--linha-rodadas)",
  obra: "var(--obra)",
};
const corNivel: Record<string, string> = {
  Alta: "text-tinta font-black",
  Média: "text-tinta font-semibold",
  Baixa: "text-suave font-semibold",
  "n/d": "text-suave font-normal",
  "n/a": "text-suave font-normal",
  Indeterminada: "text-tinta-2 font-semibold italic",
};

/** Intervalo de Wilson a 95% para uma proporção n/d. */
function wilson(n: number, d: number): [number, number] {
  const z = 1.96;
  const p = n / d;
  const den = 1 + (z * z) / d;
  const centro = (p + (z * z) / (2 * d)) / den;
  const meia = (z * Math.sqrt((p * (1 - p)) / d + (z * z) / (4 * d * d))) / den;
  return [centro - meia, centro + meia];
}
const faixaRend = (v: number) => (v >= 0.8 ? "Alta" : v >= 0.4 ? "Média" : "Baixa");

/** Rendimento com numerador, denominador e intervalo; a nota só vale se o intervalo inteiro cai numa faixa. */
function Rendimento({ r }: { r: (typeof F.scorecard)[number]["rend"] }) {
  if (!r) return <Nivel v={["n/d", "sem referência externa"]} />;
  if (r.trivial) return <Nivel v={["n/a", "pontua todo CVE publicado"]} />;
  const n = r.n!;
  const d = r.d!;
  const pct = `${fmt((100 * n) / d, 1)}%`;
  if (r.limiteInferior) return <Nivel v={["Indeterminada", `≥ ${pct} (${fmt(n)} de ${fmt(d)}, limite inferior)`]} />;
  const [lo, hi] = wilson(n, d);
  const nivel = faixaRend(lo) === faixaRend(hi) ? faixaRend(lo) : "Indeterminada";
  return <Nivel v={[nivel, `${pct} (${fmt(n)} de ${fmt(d)}; IC ${fmt(100 * lo, 1)} a ${fmt(100 * hi, 1)}%)`]} />;
}

function Nivel({ v }: { v: string[] }) {
  return (
    <td className="px-3 py-3 align-top">
      <span className={`font-sinal font-extrabold ${corNivel[v[0]] ?? ""}`}>{v[0]}</span>
      {v[1] ? <span className="block text-sm text-suave">{v[1]}</span> : null}
    </td>
  );
}

export function Fontes() {
  const total = (f: (typeof F.reguaFontes)[number]) => f.r + f.a + f.o + f.e;
  const faixa = (t: number) => (t >= 6 ? "Alta" : t >= 3 ? "Média" : "Baixa");
  // Teto pedido pela crítica: R ou E igual a 0 limita a nota a Média.
  const nota = (f: (typeof F.reguaFontes)[number]) => {
    const n = faixa(total(f));
    return n === "Alta" && (f.r === 0 || f.e === 0) ? "Média" : n;
  };
  const A = geo.acuracia;
  const pctA = (a: number, b: number) => `${fmt((100 * a) / b, 1)}%`;

  return (
    <Secao id="fontes" titulo={F.titulo} linha="fontes" intro={<p>{F.intro}</p>}>
      <Sub>{F.origensTitulo}</Sub>
      <Rolavel rotulo="Tipos de origem dos dados">
        <table className="w-full min-w-[50rem] max-w-[72rem] border-collapse">
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Origem</th>
              <th scope="col" className="px-3 py-2">Fonte</th>
              <th scope="col" className="px-3 py-2">Contato com o alvo</th>
              <th scope="col" className="px-3 py-2">Natureza do dado</th>
              <th scope="col" className="px-3 py-2">O que significa</th>
            </tr>
          </thead>
          <tbody>
            {F.origens.map((o) => (
              <tr key={o.origem} className="border-b border-fio">
                <th scope="row" className="px-3 py-3 text-left font-sinal font-extrabold">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-3.5 rounded-full border-[3px] bg-papel" style={{ borderColor: corLinha[o.linha] }} />
                    {o.origem}
                  </span>
                </th>
                <td className="px-3 py-3 font-mono text-sm">{o.fonte}</td>
                <td className="px-3 py-3 text-tinta">{o.contato}</td>
                <td className="px-3 py-3 text-tinta">{o.natureza}</td>
                <td className="px-3 py-3 text-tinta-2">{o.texto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
      <p className="medida mt-3 text-sm text-suave">{F.origensNota}</p>

      <Sub>{F.scorecardTitulo}</Sub>
      <Rolavel rotulo="Scorecard das fontes">
        <table className="w-full min-w-[56rem] max-w-[76rem] border-collapse">
          <caption className="pb-3 text-left text-[0.95rem] text-suave">{F.scorecardLegenda}</caption>
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Fonte</th>
              <th scope="col" className="px-3 py-2">Rendimento</th>
              <th scope="col" className="px-3 py-2">Frescor</th>
              <th scope="col" className="px-3 py-2">Verificabilidade</th>
              <th scope="col" className="px-3 py-2">Contato</th>
              <th scope="col" className="px-3 py-2">Mudou com a crítica</th>
            </tr>
          </thead>
          <tbody>
            {F.scorecard.map((s) => (
              <tr key={s.fonte} className="border-b border-fio">
                <th scope="row" className="px-3 py-3 text-left align-top font-sinal font-extrabold">{s.fonte}</th>
                <Rendimento r={s.rend} />
                <Nivel v={s.fresc} />
                <Nivel v={[faixa(s.verif), `${s.verif} de 8`]} />
                <td className="px-3 py-3 align-top text-tinta-2">{s.contato}</td>
                <td className="max-w-[18rem] px-3 py-3 align-top text-sm leading-snug text-suave">{s.mudou || "nada"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
      <p className="medida mt-3 text-sm text-suave">{F.scorecardNota}</p>

      <dl className="mt-10 grid max-w-[64rem] gap-x-12 gap-y-6 md:grid-cols-2">
        {F.eixos.map((e) => (
          <div key={e.nome}>
            <dt className="font-sinal text-lg font-extrabold">{e.nome}</dt>
            <dd className="mt-1 leading-relaxed text-tinta-2">{e.texto}</dd>
          </div>
        ))}
      </dl>

      <Sub>{F.achadosTitulo}</Sub>
      <ul className="mt-4 max-w-[60rem]">
        {F.achados.map((a) => (
          <li key={a.valor} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-5 border-b border-fio py-4 md:grid-cols-[8.5rem_minmax(0,1fr)]">
            <span className="num font-sinal text-3xl font-black md:text-4xl">{a.valor}</span>
            <span className="medida leading-relaxed text-tinta-2">{a.texto}</span>
          </li>
        ))}
      </ul>

      <Sub>{F.reguaTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{F.reguaIntro}</p>
      <Rolavel rotulo="Critérios da régua de verificabilidade">
        <table className="w-full min-w-[46rem] max-w-[64rem] border-collapse text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Critério</th>
              <th scope="col" className="px-3 py-2">0</th>
              <th scope="col" className="px-3 py-2">1</th>
              <th scope="col" className="px-3 py-2">2</th>
            </tr>
          </thead>
          <tbody>
            {F.reguaCriterios.map((c) => (
              <tr key={c.nome} className="border-b border-fio align-top">
                <th scope="row" className="w-[24%] px-3 py-3 text-left">
                  <span className="flex items-baseline gap-2 font-sinal font-extrabold">
                    <span aria-hidden className="inline-grid size-7 shrink-0 place-items-center rounded-full bg-tinta text-sm text-papel">{c.letra}</span>
                    {c.nome}
                  </span>
                  <span className="block text-sm font-normal text-suave">{c.pergunta}</span>
                </th>
                {c.n.map((t) => (
                  <td key={t} className="px-3 py-3 text-tinta-2">{t}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
      <Rolavel rotulo="Fontes na régua nova">
        <table className="w-full min-w-[36rem] max-w-[48rem] border-collapse">
          <caption className="pb-3 text-left text-[0.95rem] text-suave">{F.reguaNota}</caption>
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Fonte</th>
              <th scope="col" className="px-3 py-2 text-center">R</th>
              <th scope="col" className="px-3 py-2 text-center">A</th>
              <th scope="col" className="px-3 py-2 text-center">O</th>
              <th scope="col" className="px-3 py-2 text-center">E</th>
              <th scope="col" className="px-3 py-2">Total</th>
              <th scope="col" className="px-3 py-2">Antes (0 a 3)</th>
            </tr>
          </thead>
          <tbody>
            {F.reguaFontes.map((f) => {
              const t = total(f);
              const nv = nota(f);
              return (
                <tr key={f.fonte} className="border-b border-fio">
                  <th scope="row" className="px-3 py-2.5 text-left font-sinal font-extrabold">{f.fonte}</th>
                  {[f.r, f.a, f.o, f.e].map((v, i) => (
                    <td key={i} className="num px-3 py-2.5 text-center">{v}</td>
                  ))}
                  <td className={`num px-3 py-2.5 font-sinal font-extrabold ${corNivel[nv]}`}>
                    {t} {nv}
                    {nv !== faixa(t) ? <span className="block text-xs font-semibold text-suave">{F.reguaTeto}</span> : null}
                  </td>
                  <td className="px-3 py-2.5 text-suave">{f.antes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Rolavel>

      <Sub>{F.porTipoTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{F.porTipoIntro}</p>
      <Rolavel rotulo="Técnica de verificação por tipo de fonte">
        <table className="w-full min-w-[60rem] max-w-[76rem] border-collapse text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Tipo de fonte</th>
              <th scope="col" className="px-3 py-2">Técnica que confere o dado</th>
              <th scope="col" className="px-3 py-2">Regra: conta como verificado se…</th>
              <th scope="col" className="px-3 py-2">Nível</th>
            </tr>
          </thead>
          <tbody>
            {F.porTipo.map((t) => (
              <tr key={t.tipo} className="border-b border-fio align-top">
                <th scope="row" className="w-[19%] px-3 py-3 text-left">
                  <span className="block font-sinal font-extrabold leading-tight">{t.tipo}</span>
                  <span className="mt-1 block font-mono text-xs font-normal text-suave">{t.fontes}</span>
                </th>
                <td className="w-[30%] px-3 py-3 leading-relaxed text-tinta-2">{t.tecnica}</td>
                <td className="px-3 py-3 leading-relaxed text-tinta-2">{t.regra}</td>
                <td className={`px-3 py-3 font-sinal font-extrabold ${corNivel[t.nivel]}`}>{t.nivel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>

      <Sub>{F.acuraciaTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{F.acuraciaTexto}</p>
      <Rolavel rotulo="Acurácia de cada fonte do subfinder">
        <table className="w-full min-w-[40rem] max-w-[60rem] border-collapse text-[0.95rem]">
          <caption className="pb-3 text-left text-[0.95rem] text-suave">
            Resolvem: o nome devolve endereço (A) ou apelido (CNAME) no DNS em {A.resolucao.split("-").reverse().join("/")}. Coluna da direita: só os nomes que nenhuma outra fonte viu.
          </caption>
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Fonte</th>
              <th scope="col" className="px-3 py-2 text-right">Nomes</th>
              <th scope="col" className="px-3 py-2 text-right">Resolvem hoje</th>
              <th scope="col" className="px-3 py-2 text-right">Só desta fonte: resolvem</th>
            </tr>
          </thead>
          <tbody>
            {A.por_fonte.map((f) => (
              <tr key={f.fonte} className="border-b border-fio">
                <th scope="row" className="px-3 py-2.5 text-left font-sinal font-extrabold">{f.fonte}</th>
                <td className="num px-3 py-2.5 text-right">{fmt(f.nomes)}</td>
                <td className="num px-3 py-2.5 text-right font-sinal font-bold">
                  {pctA(f.resolvem, f.nomes)} <span className="font-normal text-suave">({fmt(f.resolvem)})</span>
                </td>
                <td className="num px-3 py-2.5 text-right text-tinta-2">
                  {f.so_esta ? `${pctA(f.so_esta_resolvem, f.so_esta)} de ${fmt(f.so_esta)}` : "nenhum"}
                </td>
              </tr>
            ))}
            <tr className="border-b-2 border-tinta">
              <th scope="row" className="px-3 py-2.5 text-left font-sinal font-extrabold">vistos por 2 fontes ou mais</th>
              <td className="num px-3 py-2.5 text-right">{fmt(A.em_2_ou_mais.nomes)}</td>
              <td className="num px-3 py-2.5 text-right font-sinal font-bold">
                {pctA(A.em_2_ou_mais.resolvem, A.em_2_ou_mais.nomes)} <span className="font-normal text-suave">({fmt(A.em_2_ou_mais.resolvem)})</span>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </Rolavel>
      <p className="medida mt-4 leading-relaxed text-tinta-2">{F.acuraciaLeitura}</p>

      <Sub>{F.medirTitulo}</Sub>
      <ul className="medida mt-4 grid gap-3">
        {F.medir.map((m) => (
          <li key={m.texto} className="flex items-start gap-3 leading-relaxed text-tinta-2">
            <span
              className={`mt-0.5 shrink-0 rounded-[3px] px-2 py-0.5 font-sinal text-xs font-extrabold ${m.estado === "medido" ? "bg-tinta text-papel" : "border border-dashed border-obra-texto text-obra-texto"}`}
            >
              {m.estado}
            </span>
            <span>{m.texto}</span>
          </li>
        ))}
      </ul>

      <Sub id="critica">{F.criticaTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{F.criticaIntro}</p>
      <p className="medida mt-2 font-mono text-xs leading-relaxed text-suave">{F.criticaMetodo}</p>
      <ol className="mt-6 max-w-[64rem]">
        {F.critica.map((c, i) => (
          <li key={c.ponto} className="grid gap-x-8 gap-y-2 border-b border-fio py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="leading-relaxed">
              <span className="mr-2 font-mono text-sm text-suave">{i + 1}</span>
              <b className="font-sinal font-extrabold">{c.ponto}</b>
            </p>
            <p className="flex items-start gap-3 leading-relaxed text-tinta-2">
              <span
                className={`mt-0.5 w-[4.75rem] shrink-0 rounded-[3px] py-0.5 text-center font-sinal text-xs font-extrabold ${c.estado === "proposto" ? "border border-dashed border-obra-texto text-obra-texto" : "bg-tinta text-papel"}`}
              >
                {c.estado}
              </span>
              <span>{c.resposta}</span>
            </p>
          </li>
        ))}
      </ol>
      <p className="medida mt-6 leading-relaxed text-tinta-2">{F.criticaDiscordo}</p>
      <p className="medida mt-3 font-sinal font-bold">{F.criticaSempre}</p>

      {/* A troca assumida fica isolada por espaço, longe dos resultados. */}
      <div className="mt-28 max-w-[46rem] border-y-[3px] border-tinta py-8">
        <h3 className="font-sinal text-2xl font-black">{F.tensaoTitulo}</h3>
        <p className="mt-3 text-lg leading-relaxed text-tinta-2">{F.tensao}</p>
      </div>
    </Secao>
  );
}
