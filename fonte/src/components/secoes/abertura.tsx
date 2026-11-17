import { abertura } from "@/content/site";
import { NetworkMap } from "@/components/linha/network-map";

export function Abertura() {
  return (
    <section id="pergunta" aria-labelledby="pergunta-titulo" className="border-b border-fio">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-14 pt-10 md:px-10 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-14 lg:pb-20 lg:pt-14">
        <div className="lg:border-r lg:border-fio lg:pr-12">
          <h1 id="pergunta-titulo" className="font-sinal text-[2.2rem] font-black leading-[1.04] tracking-[-0.025em] md:text-[3.1rem]">
            {abertura.titulo}
          </h1>
          {abertura.paragrafos.map((p) => (
            <p key={p.slice(0, 24)} className="medida mt-5 text-lg leading-relaxed text-tinta-2">
              {p}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contexto"
              className="inline-flex min-h-11 items-center rounded-[3px] bg-tinta px-5 font-sinal text-base font-extrabold text-papel no-underline transition-colors hover:bg-pipeline"
            >
              {abertura.acaoPrincipal}
            </a>
            <a
              href="#video"
              className="inline-flex min-h-11 items-center rounded-[3px] border-2 border-tinta px-5 font-sinal text-base font-extrabold text-tinta no-underline transition-colors hover:border-pipeline hover:text-pipeline"
            >
              {abertura.acaoVideo}
            </a>
          </div>
        </div>
        <NetworkMap />
      </div>
    </section>
  );
}
