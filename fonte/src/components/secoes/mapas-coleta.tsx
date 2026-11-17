import geo from "@/data/geo.json";
import { coleta as C } from "@/content/site";
import { MapaMundo, projetar } from "@/components/linha/mapa-mundo";
import { Rolavel } from "@/components/linha/secao";
import { fmt } from "@/lib/base";

/** Sede de quem opera cada fonte do subfinder. Cheio: devolveu nomes; vazado: consultada sem retorno. */
export function MapaFontes() {
  const devolveram = C.sedes.filter((s) => s.devolveu);
  return (
    <figure className="mt-8 max-w-[64rem]">
      <MapaMundo rotulo="Mapa das sedes das fontes consultadas pelo subfinder">
        {C.sedes.map((s) => {
          const [x, y] = projetar(s.lon, s.lat);
          return (
            <g key={s.id}>
              <circle
                cx={x}
                cy={y}
                r={s.devolveu ? 8 : 6}
                fill={s.devolveu ? "var(--linha-fontes)" : "var(--papel)"}
                stroke="var(--linha-fontes)"
                strokeWidth={s.devolveu ? 2.5 : 3}
              />
              <text
                x={x + s.dx}
                y={y + s.dy}
                textAnchor={s.ancora as "start" | "middle" | "end"}
                className={`max-md:hidden ${s.devolveu ? "fill-tinta font-sinal text-[15px] font-extrabold" : "fill-tinta-2 font-sinal text-[13px] font-semibold"}`}
                paintOrder="stroke"
                stroke="var(--papel)"
                strokeWidth="4"
              >
                {s.nome}
              </text>
            </g>
          );
        })}
      </MapaMundo>
      <figcaption className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-sinal text-sm font-semibold text-tinta-2">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full border-[2.5px] border-fontes bg-fontes" /> devolveu nomes do shopify.com
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3 rounded-full border-[3px] border-fontes bg-papel" /> consultada, não devolveu nada
        </span>
      </figcaption>
      <p className="medida mt-2 text-sm text-suave">{C.origemSemSede}</p>

      <Rolavel rotulo="De onde vêm os dados de cada fonte que devolveu nomes">
        <table className="w-full min-w-[44rem] max-w-[64rem] border-collapse text-[0.95rem]">
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Fonte</th>
              <th scope="col" className="px-3 py-2">Quem opera</th>
              <th scope="col" className="px-3 py-2">Sede</th>
              <th scope="col" className="px-3 py-2">De onde vêm os dados</th>
            </tr>
          </thead>
          <tbody>
            {devolveram.map((s) => (
              <tr key={s.id} className="border-b border-fio align-top">
                <th scope="row" className="px-3 py-3 text-left font-sinal font-extrabold">{s.nome}</th>
                <td className="px-3 py-3 text-tinta-2">{s.operador}</td>
                <td className="px-3 py-3 text-tinta-2">{s.local}</td>
                <td className="px-3 py-3 leading-relaxed text-tinta-2">{s.dados}</td>
              </tr>
            ))}
            <tr className="border-b border-fio align-top">
              <th scope="row" className="px-3 py-3 text-left font-sinal font-extrabold">THC</th>
              <td className="px-3 py-3 text-tinta-2">The Hacker&apos;s Choice</td>
              <td className="px-3 py-3 text-tinta-2">sem sede declarada</td>
              <td className="px-3 py-3 leading-relaxed text-tinta-2">base própria montada com doações de bases e sensores de DNS passivo</td>
            </tr>
          </tbody>
        </table>
      </Rolavel>
      <p className="medida mt-3 text-sm text-suave">{C.origemNota}</p>
    </figure>
  );
}

/** Os IPs dos hosts no mapa. Tinta cheia: respondeu HTTP; cinza vazado: não respondeu. */
export function MapaHosts() {
  const max = Math.max(...geo.pontos.map((p) => p.hosts));
  const raio = (h: number) => 4 + 22 * Math.sqrt(h / max);
  // Rótulos só nos pontos que contam a história; o resto fica na tabela.
  const rotulos: Record<string, { dx: number; dy: number; ancora: "start" | "end" | "middle"; texto: string }> = {
    "Kansas City": { dx: 30, dy: 30, ancora: "start", texto: "Google Cloud" },
    Toronto: { dx: 30, dy: -18, ancora: "start", texto: "Cloudflare" },
    "Denver (Ballpark District)": { dx: -24, dy: -12, ancora: "end", texto: "SendGrid\ne-mail, sem HTTP" },
    "São Paulo": { dx: 14, dy: 5, ancora: "start", texto: "CloudFront" },
  };
  const pontos = [...geo.pontos].sort((a, b) => b.hosts - a.hosts);
  const sem = geo.pontos.filter((p) => !p.respondeu);

  return (
    <figure className="mt-8 max-w-[64rem]">
      <MapaMundo rotulo={`Mapa dos ${geo.total_ips} IPs dos hosts do shopify.com`}>
        {pontos.map((p) => {
          const [x, y] = projetar(p.lon, p.lat);
          const r = raio(p.hosts);
          return (
            <circle
              key={`${p.cidade}-${p.lat}`}
              cx={x}
              cy={y}
              r={r}
              fill={p.respondeu ? "var(--tinta)" : "var(--papel)"}
              fillOpacity={p.respondeu ? 0.85 : 1}
              stroke={p.respondeu ? "var(--papel)" : "var(--obra)"}
              strokeWidth={p.respondeu ? 1.5 : 3}
              strokeDasharray={p.respondeu ? undefined : "4 3"}
            />
          );
        })}
        {pontos
          .filter((p) => rotulos[p.cidade])
          .map((p) => {
            const [x, y] = projetar(p.lon, p.lat);
            const l = rotulos[p.cidade];
            return (
              <text
                key={`r-${p.cidade}`}
                x={x + l.dx}
                y={y + l.dy}
                textAnchor={l.ancora}
                className={`max-md:hidden font-sinal text-[14px] font-bold ${p.respondeu ? "fill-tinta" : "fill-obra-texto"}`}
                paintOrder="stroke"
                stroke="var(--papel)"
                strokeWidth="4"
              >
                {`${l.texto}: ${fmt(p.hosts)} ${p.hosts === 1 ? "host" : "hosts"}`.split("\n").map((linha, i) => (
                  <tspan key={linha} x={x + l.dx} dy={i ? 17 : 0}>
                    {linha}
                  </tspan>
                ))}
              </text>
            );
          })}
      </MapaMundo>
      <figcaption className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-sinal text-sm font-semibold text-tinta-2">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-tinta" /> respondeu HTTP
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full border-[3px] border-dashed border-obra bg-papel" /> não respondeu ({fmt(geo.sem_resposta)} hosts, {sem.reduce((a, p) => a + p.ips, 0)} IPs)
        </span>
      </figcaption>

      <Rolavel rotulo="IPs dos hosts por dono e lugar">
        <table className="w-full min-w-[36rem] max-w-[56rem] border-collapse text-[0.95rem]">
          <caption className="pb-3 text-left text-sm text-suave">{C.hostsMapaNota}</caption>
          <thead>
            <tr className="border-b-2 border-tinta text-left font-sinal text-sm text-tinta-2">
              <th scope="col" className="px-3 py-2">Lugar do registro</th>
              <th scope="col" className="px-3 py-2">Dono do IP</th>
              <th scope="col" className="px-3 py-2 text-right">IPs</th>
              <th scope="col" className="px-3 py-2 text-right">Hosts que apontam para lá</th>
            </tr>
          </thead>
          <tbody>
            {pontos.map((p) => (
              <tr key={`t-${p.cidade}-${p.lat}`} className="border-b border-fio">
                <th scope="row" className={`px-3 py-2 text-left font-normal ${p.respondeu ? "text-tinta" : "text-obra-texto"}`}>
                  {p.cidade.replace(/ \(.*\)/, "")}, {p.pais}
                </th>
                <td className="px-3 py-2 text-tinta-2">{p.operadores.join(", ")}</td>
                <td className="num px-3 py-2 text-right">{p.ips}</td>
                <td className="num px-3 py-2 text-right font-sinal font-bold">
                  {fmt(p.hosts)}
                  {p.respondeu ? "" : " sem HTTP"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rolavel>
    </figure>
  );
}
