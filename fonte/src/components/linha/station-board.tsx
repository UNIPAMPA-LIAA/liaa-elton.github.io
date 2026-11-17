"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { estacoes, projeto } from "@/content/site";

const N = estacoes.length;
const DESLOCAMENTO = 140; // altura da placa + respiro: a seção "chega" antes de tocar o topo

/** Converte a rolagem em posição fracionária na linha (0 = primeira estação). */
function posicao(y: number, tops: number[]) {
  if (tops.length < 2) return 0;
  const alvo = y + DESLOCAMENTO;
  if (alvo <= tops[0]) return 0;
  for (let i = 0; i < tops.length - 1; i++) {
    if (alvo < tops[i + 1]) return i + (alvo - tops[i]) / Math.max(1, tops[i + 1] - tops[i]);
  }
  return tops.length - 1;
}

export function StationBoard() {
  const tops = useRef<number[]>([]);
  const [ativa, setAtiva] = useState(0);
  const reduzir = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    const medir = () => {
      tops.current = estacoes.map((e) => {
        const el = document.getElementById(e.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const bruto = useTransform(() => posicao(scrollY.get(), tops.current));
  const suave = useSpring(bruto, { stiffness: 220, damping: 40, mass: 0.6 });
  const xTrem = useTransform(() => {
    const p = reduzir ? Math.round(bruto.get()) : suave.get();
    return `${(p / (N - 1)) * 100}%`;
  });

  useMotionValueEvent(scrollY, "change", (y) => {
    const i = Math.min(N - 1, Math.floor(posicao(y, tops.current) + 0.02));
    setAtiva((a) => (a === i ? a : i));
  });

  const atual = estacoes[ativa];

  return (
    <header className="sticky top-0 z-40 overflow-x-clip bg-tinta text-papel">
      <a
        href="#pergunta"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-papel focus:px-3 focus:py-2 focus:text-tinta"
      >
        Ir para o conteúdo
      </a>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:flex-nowrap md:px-10 md:py-4">
        <a href="#pergunta" className="flex shrink-0 items-center gap-3 no-underline transition-opacity hover:opacity-85" aria-label="ReconAI, voltar ao início">
          <Roundel />
          <span className="flex flex-col gap-1">
            <span translate="no" className="font-sinal text-2xl font-black leading-none tracking-tight">{projeto.nome}</span>
            <span className="hidden font-sinal text-xs font-semibold uppercase tracking-[0.06em] text-[#b9bec7] xl:block">
              Linha do reconhecimento passivo · LIAA 2026
            </span>
          </span>
        </a>

        {/* No celular: a estação atual ao lado da marca, e a linha sem rótulos na linha de baixo. */}
        <p className="ml-auto text-right font-sinal text-sm font-semibold text-[#c9cdd3] md:hidden" aria-live="polite">
          Estação: <span className="text-papel">{atual.nome}</span>
        </p>

        <nav aria-label="Estações da página" className="relative min-w-0 flex-1 basis-full md:basis-auto">
          <div className="relative">
            <div aria-hidden className="absolute left-[5px] right-[5px] top-[5px] h-[4px] rounded-full bg-pipeline md:top-[11px] md:h-[6px]" />
            <div aria-hidden className="pointer-events-none absolute left-[7px] right-[7px] top-0 h-6 md:left-[14px] md:right-[14px]">
              <motion.div className="h-full w-full" style={{ x: xTrem }}>
                <span className="absolute -left-[9px] -top-[2px] block h-[18px] w-[18px] rounded-[4px] border-[3px] border-papel bg-pipeline shadow-[0_2px_6px_rgba(0,0,0,0.45)] md:-left-[13px] md:top-[4px] md:h-[20px] md:w-[26px] md:rounded-[5px]" />
              </motion.div>
            </div>
            <ol className="relative flex justify-between">
              {estacoes.map((e, i) => {
                const passou = i < ativa;
                const aqui = i === ativa;
                return (
                  <li key={e.id} className="flex flex-col items-center">
                    <a
                      href={`#${e.id}`}
                      aria-current={aqui ? "location" : undefined}
                      className="group flex min-h-6 min-w-6 flex-col items-center gap-1.5 no-underline"
                    >
                      <span
                        className={[
                          "block size-[14px] rounded-full border-[3px] transition-colors duration-200 md:size-[28px] md:border-[4px]",
                          aqui
                            ? "border-papel bg-pipeline"
                            : passou
                              ? "border-[#6b7079] bg-[#2a2d33]"
                              : "border-tinta bg-papel group-hover:border-pipeline",
                        ].join(" ")}
                      />
                      <span
                        className={[
                          "hidden whitespace-nowrap font-sinal text-[13px] font-semibold leading-none md:block",
                          aqui ? "text-papel" : passou ? "text-[#9ba0a8]" : "text-[#d6d9dd] group-hover:text-papel",
                        ].join(" ")}
                      >
                        {e.curto}
                        <span className="sr-only">{aqui ? " (você está aqui)" : ""}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Roundel() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <circle cx="20" cy="20" r="14" fill="none" stroke="var(--linha-pipeline)" strokeWidth="7" />
      <rect x="0" y="16" width="40" height="8" fill="var(--linha-fontes)" />
    </svg>
  );
}
