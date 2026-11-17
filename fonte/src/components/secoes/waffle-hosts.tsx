"use client";

import { useState } from "react";
import coleta from "@/data/coleta.json";
import { fmt } from "@/lib/base";

type Classe = "4xx" | "outro" | "sem";
const COR: Record<Classe, string> = {
  "4xx": "#b9bec7",
  outro: "var(--linha-fontes)",
  sem: "var(--linha-pipeline)",
};
const NOME: Record<Classe, string> = {
  "4xx": "respondeu com erro 4xx, quase todo lojas desativadas",
  outro: "respondeu com página, redirecionamento ou erro de servidor (2xx, 3xx, 5xx)",
  sem: "não respondeu HTTP",
};

/** Os 2.491 hosts da coleta de 12/10, um por quadrado, na ordem dos grupos do M1. */
export function WaffleHosts() {
  const grupos = coleta.mapa.grupos as { n: number; status: number | null; titulo: string | null; classe: Classe; ex: string[] }[];
  const [foco, setFoco] = useState<number | null>(null);
  const g = foco === null ? null : grupos[foco];
  const pegar = (e: React.PointerEvent) => {
    const v = (e.target as HTMLElement).dataset.g;
    if (v !== undefined) setFoco(Number(v));
  };
  const teclas = (e: React.KeyboardEvent) => {
    const passo = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    setFoco((f) => (f === null ? 0 : (f + passo + grupos.length) % grupos.length));
  };

  return (
    <div className="mt-6">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 font-sinal text-[0.95rem]">
        {(["4xx", "outro", "sem"] as Classe[]).map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span aria-hidden className="size-3.5 rounded-[2px]" style={{ background: COR[k] }} />
            <span>
              <b className="num font-extrabold">{fmt(coleta.mapa.classes[k])}</b> {NOME[k]}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div
          className="grid touch-manipulation grid-cols-[repeat(auto-fill,7px)] gap-[2px] sm:grid-cols-[repeat(auto-fill,9px)]"
          role="img"
          tabIndex={0}
          aria-describedby="waffle-detalhe"
          onPointerMove={pegar}
          onPointerDown={pegar}
          onKeyDown={teclas}
          aria-label={`Mapa de ${fmt(coleta.mapa.total)} hosts: ${fmt(coleta.mapa.classes["4xx"])} com erro 4xx, ${fmt(coleta.mapa.classes.outro)} com outras respostas e ${coleta.mapa.classes.sem} sem resposta HTTP.`}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setFoco(null);
          }}
        >
          {grupos.map((gr, gi) =>
            Array.from({ length: gr.n }, (_, k) => (
              <span
                key={`${gi}-${k}`}
                data-g={gi}
                className="block size-[7px] rounded-[1px] sm:size-[9px]"
                style={{
                  background: COR[gr.classe],
                  outline: foco === gi ? "2px solid var(--tinta)" : undefined,
                }}
              />
            )),
          )}
        </div>
        <div id="waffle-detalhe" className="min-h-[7.5rem] border-t-[3px] border-tinta pt-3 text-[0.95rem]" aria-live="polite">
          {g ? (
            <>
              <p className="font-sinal text-lg font-extrabold">
                {fmt(g.n)} host{g.n > 1 ? "s" : ""}
              </p>
              <p className="text-tinta-2">{g.status ? `status ${g.status}` : "sem resposta HTTP"}</p>
              {g.titulo ? <p className="text-tinta-2">“{g.titulo}”</p> : null}
              <p className="mt-1 break-all font-mono text-xs text-suave">ex.: {g.ex[0]}</p>
            </>
          ) : (
            <p className="text-suave">Toque, passe o ponteiro ou use as setas no mapa para ver cada grupo. O bloco grande são as 2.004 lojas desativadas com a mesma página “Store unavailable”.</p>
          )}
        </div>
      </div>
    </div>
  );
}
