import { fontesSecao as F, type LinhaId } from "@/content/site";
import { Rolavel, Secao, Sub } from "@/components/linha/secao";

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
};

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

  return (
    <Secao id="fontes" titulo={F.titulo} linha="fontes" intro={<p>{F.intro}</p>}>
      <Sub>{F.origensTitulo}</Sub>
      <Rolavel rotulo="Tipos de origem dos dados">
        <table className="w-full min-w-[36rem] max-w-[60rem] border-collapse">
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Origem</th>
              <th scope="col" className="px-3 py-2">Fonte</th>
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
                <td className="px-3 py-3 text-tinta-2">{o.texto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>

      <Sub>{F.scorecardTitulo}</Sub>
      <Rolavel rotulo="Scorecard das fontes">
        <table className="w-full min-w-[44rem] max-w-[64rem] border-collapse">
          <caption className="pb-3 text-left text-[0.95rem] text-suave">{F.scorecardLegenda}</caption>
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Fonte</th>
              <th scope="col" className="px-3 py-2">Rendimento</th>
              <th scope="col" className="px-3 py-2">Frescor</th>
              <th scope="col" className="px-3 py-2">Verificabilidade</th>
              <th scope="col" className="px-3 py-2">Origem</th>
            </tr>
          </thead>
          <tbody>
            {F.scorecard.map((s) => (
              <tr key={s.fonte} className="border-b border-fio">
                <th scope="row" className="px-3 py-3 text-left align-top font-sinal font-extrabold">{s.fonte}</th>
                <Nivel v={s.rend} />
                <Nivel v={s.fresc} />
                <Nivel v={s.verif} />
                <td className="px-3 py-3 align-top text-tinta-2">{s.origem}</td>
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
              return (
                <tr key={f.fonte} className="border-b border-fio">
                  <th scope="row" className="px-3 py-2.5 text-left font-sinal font-extrabold">{f.fonte}</th>
                  {[f.r, f.a, f.o, f.e].map((v, i) => (
                    <td key={i} className="num px-3 py-2.5 text-center">{v}</td>
                  ))}
                  <td className={`num px-3 py-2.5 font-sinal font-extrabold ${corNivel[faixa(t)]}`}>
                    {t} {faixa(t)}
                  </td>
                  <td className="px-3 py-2.5 text-suave">{f.antes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Rolavel>

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

      {/* A troca assumida fica isolada por espaço, longe dos resultados. */}
      <div className="mt-28 max-w-[46rem] border-y-[3px] border-tinta py-8">
        <h3 className="font-sinal text-2xl font-black">{F.tensaoTitulo}</h3>
        <p className="mt-3 text-lg leading-relaxed text-tinta-2">{F.tensao}</p>
      </div>
    </Secao>
  );
}
