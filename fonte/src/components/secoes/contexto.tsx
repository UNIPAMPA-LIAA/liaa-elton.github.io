import { contexto } from "@/content/site";
import { Secao, Sub } from "@/components/linha/secao";
import { DesenhoPentest } from "./desenho-pentest";

export function Contexto() {
  return (
    <Secao id="contexto" titulo={contexto.titulo} linha="pipeline">
      {contexto.paragrafos.map((p) => (
        <p key={p.slice(0, 24)} className="medida mt-5 text-lg leading-relaxed text-tinta-2">
          {p}
        </p>
      ))}

      <Sub>{contexto.desenhoTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{contexto.desenhoIntro}</p>
      <DesenhoPentest />

      <Sub>{contexto.fasesTitulo}</Sub>
      <p className="medida mt-3 leading-relaxed text-tinta-2">{contexto.fasesIntro}</p>

      {/* As fases do PTES como uma linha; as fases do ReconAI são baldeações. */}
      <ol className="relative mt-10 grid gap-0 md:grid-cols-7">
        <span aria-hidden className="absolute left-[13px] top-0 h-full w-[6px] rounded-full bg-tinta md:left-0 md:top-[13px] md:h-[6px] md:w-full" />
        {contexto.fases.map((f, i) => (
          <li key={f.nome} className="relative flex gap-4 pb-8 md:flex-col md:gap-3 md:pb-0 md:pr-4">
            <span aria-hidden className="relative z-10 flex size-8 shrink-0 items-center justify-center">
              {f.reconai ? (
                <>
                  <span className="absolute size-8 rounded-full border-[6px] border-pipeline bg-papel" />
                  <span className="absolute h-[6px] w-10 bg-fontes" />
                </>
              ) : (
                <span className="size-6 rounded-full border-[5px] border-tinta bg-papel" />
              )}
            </span>
            <div>
              <p className={`font-sinal text-lg font-extrabold leading-tight ${f.reconai ? "text-pipeline" : "text-tinta"}`}>
                <span className="mr-2 font-mono text-sm font-semibold text-suave">{i + 1}</span>
                {f.nome}
              </p>
              <p className="mt-1 text-[0.95rem] leading-snug text-tinta-2">{f.texto}</p>
              {f.reconai ? <p className="mt-2 font-sinal text-sm font-bold text-pipeline">Baldeação ReconAI</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <p className="medida mt-8 text-[0.95rem] text-suave">{contexto.fasesNota}</p>
    </Secao>
  );
}
