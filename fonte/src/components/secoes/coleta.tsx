import coletaDados from "@/data/coleta.json";
import { coleta } from "@/content/site";
import { Rolavel, Secao, Sub } from "@/components/linha/secao";
import { WaffleHosts } from "./waffle-hosts";
import { MapaFontes, MapaHosts } from "./mapas-coleta";
import { fmt } from "@/lib/base";

const TIPO: Record<string, string> = {
  virustotal: "DNS passivo de empresa, fechado",
  thc: "base pública de subdomínios",
  crtsh: "Certificate Transparency, log público assinado",
  hackertarget: "DNS passivo",
  dnsdumpster: "DNS passivo, projeto da HackerTarget",
};

export function Coleta() {
  const S = coletaDados.subfinder;
  const cfg = S.chaves_configuradas.length;
  const consultadas = S.sem_chave.length + S.chave_opcional.length + cfg;
  const cascata = [
    { n: S.total_fontes, t: "fontes que o subfinder conhece" },
    { n: S.total_fontes - consultadas, t: "exigem chave de acesso e não estavam configuradas", desvio: true },
    { n: consultadas, t: `consultadas: ${S.sem_chave.length} sem chave, ${S.chave_opcional.length} com chave opcional e ${cfg} com chave configurada` },
    { n: S.fontes.length, t: "devolveram nomes para o shopify.com" },
    { n: S.unicos, t: `nomes únicos depois de juntar tudo · coleta de ${S.coleta.slice(8, 10)}/${S.coleta.slice(5, 7)}`, fim: true },
  ];
  const maxF = Math.max(...S.fontes.map((f) => f.nomes));
  const nomesF = S.fontes.map((f) => f.fonte);
  const maxC = Math.max(...S.combinacoes.map((c) => c.nomes));
  const pct = (a: number, b: number) => fmt((100 * a) / b, 1);
  const vt = S.fontes.find((f) => f.fonte === "virustotal");
  const ct = S.fontes.find((f) => f.fonte === "crtsh");
  const R = coletaDados.recoleta;
  const M = coletaDados.mapa;

  return (
    <Secao id="coleta" titulo={coleta.titulo} linha="fontes" intro={<p>{coleta.intro}</p>}>
      <Sub>{coleta.fontesTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{coleta.fontesTexto}</p>

      {/* A cascata das fontes como uma linha azul, com o desvio das que pedem chave. */}
      <ol className="relative mt-8 grid gap-6 sm:grid-cols-5 sm:gap-0">
        <span aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-[7px] rounded-full bg-fontes sm:block" />
        {cascata.map((c) => (
          <li key={c.t} className="relative sm:pr-5">
            <span
              aria-hidden
              className={`relative z-10 block size-[29px] rounded-full border-[6px] bg-papel ${c.desvio ? "border-obra" : c.fim ? "border-tinta" : "border-fontes"}`}
              style={c.desvio ? { borderStyle: "dashed" } : undefined}
            />
            <p className="num mt-3 font-sinal text-3xl font-black">{fmt(c.n)}</p>
            <p className="mt-1 text-[0.95rem] leading-snug text-tinta-2">{c.t}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 max-w-[56rem]">
        <p className="font-sinal text-sm font-semibold text-tinta-2">
          <span aria-hidden className="mr-2 inline-block h-2.5 w-4 bg-fontes align-middle" /> só esta fonte viu
          <span
            aria-hidden
            className="ml-6 mr-2 inline-block h-2.5 w-4 border border-fontes align-middle"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--linha-fontes) 0 2px, transparent 2px 5px)" }}
          />
          outra fonte também viu
        </p>
        <ul className="mt-4 grid gap-3">
          {S.fontes.map((f) => {
            const comp = f.nomes - f.exclusivos;
            return (
              <li key={f.fonte} className="grid grid-cols-[8rem_minmax(0,1fr)_4.5rem] items-center gap-3 sm:grid-cols-[11rem_minmax(0,1fr)_5rem]">
                <span>
                  <b className="font-sinal font-extrabold">{f.fonte}</b>
                  <span className="block text-xs leading-tight text-suave">{TIPO[f.fonte] ?? ""}</span>
                </span>
                <span className="flex h-4 gap-[2px]" aria-hidden>
                  {f.exclusivos ? <span className="h-full bg-fontes" style={{ width: `${(100 * f.exclusivos) / maxF}%` }} /> : null}
                  {comp ? (
                    <span
                      className="h-full border border-fontes"
                      style={{ width: `${(100 * comp) / maxF}%`, backgroundImage: "repeating-linear-gradient(45deg, var(--linha-fontes) 0 2px, transparent 2px 6px)" }}
                    />
                  ) : null}
                </span>
                <span className="num text-right font-sinal font-bold">{fmt(f.nomes)}</span>
                <span className="sr-only">
                  {fmt(f.exclusivos)} só nesta fonte, {fmt(comp)} também em outra
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <Sub>{coleta.cruzaTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{coleta.cruzaTexto}</p>
      <Rolavel rotulo="Combinações de fontes do subfinder">
        <table className="w-full min-w-[34rem] max-w-[56rem] border-collapse text-[0.95rem]">
          <caption className="sr-only">Quantos nomes cada combinação de fontes encontrou (recoleta de 12/11/2026)</caption>
          <thead>
            <tr className="border-b-2 border-tinta">
              {nomesF.map((f) => (
                <th key={f} scope="col" className="px-2 py-2 text-center font-sinal text-xs font-bold text-tinta-2">
                  {f}
                </th>
              ))}
              <th scope="col" className="px-2 py-2 text-left font-sinal text-xs font-bold text-tinta-2">
                Nomes
              </th>
            </tr>
          </thead>
          <tbody>
            {S.combinacoes.map((c) => (
              <tr key={c.fontes.join("+")} className="border-b border-fio">
                {nomesF.map((f) => {
                  const on = c.fontes.includes(f);
                  return (
                    <td key={f} className="px-2 py-2 text-center">
                      <span
                        className={`inline-block size-3.5 rounded-full border-[2.5px] ${on ? "border-tinta bg-tinta" : "border-fio bg-papel"}`}
                        aria-label={on ? "sim" : "não"}
                        role="img"
                      />
                    </td>
                  );
                })}
                <td className="w-[45%] px-2 py-2">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="h-3 min-w-[2px] rounded-r-full bg-fontes" style={{ width: `${Math.max(0.4, (100 * c.nomes) / maxC)}%` }} />
                    <span className="num font-sinal font-bold">{fmt(c.nomes)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
      <ul className="medida mt-6 grid gap-2 text-tinta-2">
        <li>
          Só <b className="text-tinta">{fmt(S.em_2_ou_mais)}</b> dos {fmt(S.unicos)} nomes ({pct(S.em_2_ou_mais, S.unicos)}%) foram vistos por duas fontes ou mais.
        </li>
        {vt ? (
          <li>
            <b className="text-tinta">{fmt(vt.exclusivos)}</b> nomes ({pct(vt.exclusivos, S.unicos)}%) vieram só do VirusTotal, uma base fechada.
          </li>
        ) : null}
        {ct ? (
          <li>
            O Certificate Transparency, a única fonte auditável, trouxe {fmt(ct.nomes)} nomes; {fmt(ct.exclusivos)} deles nenhuma outra fonte viu.
          </li>
        ) : null}
        <li>Todo nome da HackerTarget também aparece no DNSDumpster, que é da mesma empresa: as duas concordarem não confirma nada.</li>
      </ul>

      <Sub>{coleta.origemTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{coleta.origemTexto}</p>
      <MapaFontes />

      <Sub>{coleta.hostsMapaTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{coleta.hostsMapaTexto}</p>
      <MapaHosts />
      <p className="medida mt-4 leading-relaxed text-tinta-2">{coleta.hostsMapaLeitura}</p>

      <Sub>{coleta.mapaTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{coleta.mapaTexto}</p>
      <WaffleHosts />

      <Sub>{coleta.perdasTitulo}</Sub>
      <div className="mt-6 grid max-w-[56rem] gap-10 md:grid-cols-2">
        <Perda
          titulo="Coleta de 12/10, a do experimento"
          etapas={[
            ["resolvem no DNS", M.total],
            ["não responderam HTTP", M.classes.sem, true],
            ["responderam", M.total - M.classes.sem],
          ]}
          texto={`Os ${M.classes.sem} que não responderam são os servidores de envio de e-mail o1 a o${M.classes.sem}.mailer.shopify.com: existem no DNS, mas não têm site.`}
        />
        <Perda
          titulo="Recoleta de 03/11"
          etapas={[
            ["encontrados pelo subfinder", R.encontrados],
            ["não resolvem mais no DNS", R.encontrados - R.resolvem, true],
            ["resolvem", R.resolvem],
            ["resolvem, mas não respondem HTTP", R.resolvem - R.http, true],
            ["responderam", R.http],
          ]}
          texto={`Os ${fmt(R.encontrados - R.resolvem)} que não resolvem são nomes antigos que continuam nas bases de DNS passivo. No shopify, ${pct(R.resolvem, R.encontrados)}% dos nomes ainda resolvem.`}
        />
      </div>
    </Secao>
  );
}

function Perda({ titulo, etapas, texto }: { titulo: string; etapas: [string, number, boolean?][]; texto: string }) {
  return (
    <div className="border-t-[3px] border-tinta pt-4">
      <h4 className="font-sinal text-lg font-extrabold">{titulo}</h4>
      <table className="mt-3 w-full border-collapse text-[0.95rem]">
        <tbody>
          {etapas.map(([rot, n, perdeu]) => (
            <tr key={rot} className="border-b border-fio">
              <td className={`py-1.5 ${perdeu ? "pl-4 text-suave" : ""}`}>{perdeu ? `menos ${rot}` : rot}</td>
              <td className="num py-1.5 text-right font-sinal font-bold">{fmt(n)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-tinta-2">{texto}</p>
    </div>
  );
}
