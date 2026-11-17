import coleta from "@/data/coleta.json";
import experimento from "@/data/experimento.json";
import { fmt } from "@/lib/base";

type Estacao = {
  x: number;
  y: number;
  href: string;
  titulo?: string;
  valor?: string;
  nota: string;
  /** versão curta da nota para o mapa em SVG, onde o espaço entre estações é fixo */
  notaMapa?: string;
  grande?: boolean;
  obra?: boolean;
  tx?: number;
};

/**
 * O mapa da rede na primeira tela. É navegação: cada estação leva à sua seção.
 * Linha vermelha = pipeline; azul = fontes; verde = rodadas; tracejado = em obras.
 */
export function NetworkMap() {
  const hipMed = (() => {
    const shop = experimento.celulas.filter((c) => c.alvo === "shopify" && c.resumo);
    const hs = shop.flatMap((c) => c.resumo!.hip_por_run);
    return Math.round(hs.reduce((a, b) => a + b, 0) / hs.length);
  })();

  const pipeline: Estacao[] = [
    { x: 40, y: 300, href: "#coleta", valor: fmt(coleta.recoleta.encontrados), nota: "nomes · recoleta 03/11", notaMapa: "nomes · 03/11" },
    { x: 250, y: 300, href: "#pipeline", titulo: "M1 Coletor", valor: fmt(coleta.mapa.total), nota: "hosts · 12/10", grande: true },
    { x: 400, y: 300, href: "#pipeline", titulo: "M2 Enriquecedor", valor: String(coleta.mapa.grupos.length), nota: "grupos de hosts", grande: true },
    { x: 550, y: 300, href: "#experimento", titulo: "M3 Analisador", valor: `52 → ~${hipMed}`, nota: "grupos → hipóteses", grande: true },
    { x: 760, y: 300, href: "#obras", titulo: "M4 Avaliação", nota: "em obras", obra: true, tx: 700 },
  ];
  const fontes = [
    { x: 40, y: 90, href: "#coleta", rotulo: "subfinder · 4,2% em 2+ fontes", lx: 22, ly: 64 },
    { x: 160, y: 90, href: "#fontes", rotulo: "dnsx", lx: 148, ly: 120 },
    { x: 250, y: 190, href: "#fontes", rotulo: "httpx · primeira mão", lx: 236, ly: 195, fim: true },
    { x: 400, y: 60, href: "#fontes", rotulo: "NVD · EPSS", lx: 416, ly: 65 },
    { x: 400, y: 170, href: "#fontes", rotulo: "Censys · 23% com software", lx: 416, ly: 175 },
  ];
  const rodadas = ["R1", "R2", "R3", "R4 27/10", "R5 03/11", "R6 10/11", "R7 12/11"];

  return (
    <figure className="w-full">
      <svg viewBox="0 0 820 600" className="hidden h-auto w-full md:block" role="group" aria-label="Mapa da rede do ReconAI">
        {/* fontes (azul) */}
        <path d="M40 90 H210 Q250 90 250 130 V300" fill="none" stroke="var(--linha-fontes)" strokeWidth="12" strokeLinecap="round" />
        <path d="M400 60 V300" fill="none" stroke="var(--linha-fontes)" strokeWidth="12" strokeLinecap="round" />
        {/* pipeline (vermelho) e trecho em obras */}
        <path d="M40 300 H600" fill="none" stroke="var(--linha-pipeline)" strokeWidth="16" strokeLinecap="round" />
        <path d="M600 300 H760" fill="none" stroke="var(--obra)" strokeWidth="16" strokeDasharray="18 12" />
        {/* rodadas (verde) */}
        <path d="M40 500 H760" fill="none" stroke="var(--linha-rodadas)" strokeWidth="10" strokeLinecap="round" />

        {fontes.map((f) => (
          <a key={f.rotulo} href={f.href} className="group">
            <circle cx={f.x} cy={f.y} r="9" fill="var(--papel)" stroke="var(--linha-fontes)" strokeWidth="4" />
            <text x={f.lx} y={f.ly} textAnchor={"fim" in f ? "end" : "start"} className="fill-suave font-mono text-[13px] group-hover:fill-tinta">{f.rotulo}</text>
          </a>
        ))}

        {pipeline.map((e) => (
          <a key={e.nota} href={e.href} className="group">
            <title>{e.titulo ? `${e.titulo}: ${e.nota}` : e.nota}</title>
            <circle
              cx={e.x}
              cy={e.y}
              r={e.grande ? 21 : 15}
              fill="var(--papel)"
              stroke={e.obra ? "var(--obra)" : "var(--tinta)"}
              strokeWidth={e.grande ? 7 : 5}
              strokeDasharray={e.obra ? "6 4" : undefined}
              className="transition-[stroke] group-hover:stroke-[var(--linha-pipeline)]"
            />
            {e.titulo ? (
              <text x={e.tx ?? e.x - 44} y={e.y + 48} className={`font-sinal text-[16px] font-bold ${e.obra ? "fill-obra-texto" : "fill-tinta"}`}>
                {e.titulo}
              </text>
            ) : null}
            {e.valor ? (
              <text x={e.x - 44 + (e.titulo ? 0 : 28)} y={e.y + (e.titulo ? 82 : 54)} className="num fill-tinta font-sinal text-[28px] font-black">
                {e.valor}
              </text>
            ) : null}
            <text x={e.tx ?? e.x - 44 + (e.titulo ? 0 : 28)} y={e.y + (e.titulo ? (e.valor ? 103 : 70) : 75)} className="fill-suave font-mono text-[13px]">
              {e.notaMapa ?? e.nota}
            </text>
          </a>
        ))}

        {rodadas.map((r, i) => {
          const x = 40 + i * 120;
          const ultima = i === rodadas.length - 1;
          return (
            <a key={r} href="#rodadas" className="group">
              <circle cx={x} cy={500} r={ultima ? 13 : 10} fill={ultima ? "var(--linha-rodadas)" : "var(--papel)"} stroke="var(--linha-rodadas)" strokeWidth="4" />
              <text x={x - 12} y={536} className="fill-suave font-mono text-[13px] group-hover:fill-tinta">{r}</text>
            </a>
          );
        })}
      </svg>

      {/* No celular o mapa vira o diagrama de linha do vagão: estações descendo, números legíveis. */}
      <ol aria-label="Linha do pipeline" className="relative md:hidden">
        <span aria-hidden className="absolute bottom-8 left-[13px] top-3 w-[8px] rounded-full bg-pipeline" />
        <span
          aria-hidden
          className="absolute bottom-0 left-[13px] h-12 w-[8px]"
          style={{ backgroundImage: "repeating-linear-gradient(180deg, var(--obra) 0 9px, transparent 9px 15px)" }}
        />
        {pipeline.map((e) => (
          <li key={e.nota} className="relative pb-6 last:pb-0">
            <a href={e.href} className="group grid grid-cols-[2.125rem_minmax(0,1fr)] items-start gap-4 no-underline">
              <span
                aria-hidden
                className={`relative z-10 mt-1 block size-[34px] rounded-full border-[6px] bg-papel ${e.obra ? "border-dashed border-obra" : "border-tinta"}`}
              />
              <span className="block">
                {e.titulo ? (
                  <span className={`block font-sinal text-base font-bold group-hover:underline ${e.obra ? "text-obra-texto" : "text-tinta"}`}>{e.titulo}</span>
                ) : null}
                {e.valor ? <span className="num block font-sinal text-[1.9rem] font-black leading-tight text-tinta">{e.valor}</span> : null}
                <span className="block font-mono text-[13px] text-suave">{e.nota}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>

      {/* A linha verde das rodadas também no celular: o mapa continua sendo uma rede. */}
      <a href="#rodadas" className="relative mt-8 block no-underline md:hidden" aria-label="Sete rodadas com o professor, de R1 a R7">
        <span aria-hidden className="absolute left-[9px] right-[9px] top-[7px] h-[6px] rounded-full bg-rodadas" />
        <span aria-hidden className="relative flex justify-between">
          {rodadas.map((r, i) => (
            <span key={r} className="flex flex-col items-center gap-1">
              <span className={`block size-5 rounded-full border-4 border-rodadas ${i === rodadas.length - 1 ? "bg-rodadas" : "bg-papel"}`} />
              <span className="font-mono text-xs text-suave">{r.split(" ")[0]}</span>
            </span>
          ))}
        </span>
      </a>

      <p className="mt-3 text-sm text-suave">Os 2.491 hosts são da coleta de 12/10, a usada no experimento; os 10.577 nomes, da recoleta de 03/11.</p>
      <figcaption className="mt-2 flex flex-wrap gap-x-6 gap-y-2 font-sinal text-sm font-semibold text-tinta-2">
        <Chave cor="var(--linha-pipeline)">Pipeline M1 a M4</Chave>
        <Chave cor="var(--linha-fontes)" soDesktop>Fontes de dados</Chave>
        <Chave cor="var(--linha-rodadas)">Rodadas com o professor</Chave>
        <Chave cor="var(--obra)" tracejado>Em obras</Chave>
      </figcaption>
    </figure>
  );
}

function Chave({ cor, tracejado, soDesktop, children }: { cor: string; tracejado?: boolean; soDesktop?: boolean; children: React.ReactNode }) {
  return (
    <span className={`${soDesktop ? "hidden md:flex" : "flex"} items-center gap-2`}>
      <span
        aria-hidden
        className="inline-block h-[7px] w-8 rounded-full"
        style={tracejado ? { backgroundImage: `repeating-linear-gradient(90deg, ${cor} 0 9px, transparent 9px 15px)` } : { background: cor }}
      />
      {children}
    </span>
  );
}
