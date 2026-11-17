import type { ReactNode } from "react";
import type { LinhaId } from "@/content/site";

const cor: Record<LinhaId, string> = {
  pipeline: "var(--linha-pipeline)",
  fontes: "var(--linha-fontes)",
  rodadas: "var(--linha-rodadas)",
  obra: "var(--obra)",
};

/**
 * Uma seção é um trecho da linha: o trilho corre pela margem esquerda e o
 * título é a estação. Em obras, o trilho fica tracejado.
 */
export function Secao({
  id,
  titulo,
  linha,
  intro,
  children,
}: {
  id: string;
  titulo: string;
  linha: LinhaId;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  const c = cor[linha];
  const tracejado = linha === "obra";
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] md:grid-cols-[5rem_minmax(0,1fr)]">
      <div aria-hidden className="relative">
        <div
          className="absolute bottom-0 left-1/2 top-0 w-[7px] -translate-x-1/2 md:w-[9px]"
          style={
            tracejado
              ? { backgroundImage: `repeating-linear-gradient(180deg, ${c} 0 18px, transparent 18px 30px)` }
              : { background: c }
          }
        />
        <span
          className="absolute left-1/2 top-[3.35rem] block size-[26px] -translate-x-1/2 rounded-full border-[6px] bg-papel md:top-[5.1rem] md:size-[34px] md:border-[7px]"
          style={{ borderColor: tracejado ? "var(--obra)" : "var(--tinta)", borderStyle: tracejado ? "dashed" : "solid" }}
        />
      </div>
      <div className="min-w-0 pb-20 pr-4 pt-12 md:pb-28 md:pr-10 md:pt-[4.25rem]">
        <h2 id={`${id}-titulo`} className="font-sinal text-[2rem] font-black leading-[1.05] md:text-[3.25rem]">
          {titulo}
        </h2>
        {intro ? <div className="medida mt-5 text-lg leading-relaxed text-tinta-2">{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}

/** Subtítulo dentro de uma estação. */
export function Sub({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3 id={id} className="mt-16 font-sinal text-xl font-extrabold leading-tight md:text-2xl">
      {children}
    </h3>
  );
}

/** Rolagem horizontal só para tabelas largas, nunca para a página. */
export function Rolavel({ children, rotulo }: { children: ReactNode; rotulo: string }) {
  return (
    <div className="mt-6 overflow-x-auto" role="region" aria-label={rotulo} tabIndex={0}>
      {children}
    </div>
  );
}
