import { pipeline } from "@/content/site";
import { Secao, Sub } from "@/components/linha/secao";

export function Pipeline() {
  return (
    <Secao id="pipeline" titulo={pipeline.titulo} linha="pipeline" intro={<p>{pipeline.intro}</p>}>
      {/* Os quatro módulos como estações de uma linha horizontal. */}
      <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-0">
        <span aria-hidden className="absolute left-[15px] top-0 hidden h-full w-[8px] bg-pipeline max-md:block" />
        <span aria-hidden className="absolute left-0 right-[25%] top-[15px] hidden h-[10px] rounded-l-full bg-pipeline md:block" />
        <span
          aria-hidden
          className="absolute right-0 top-[15px] hidden h-[10px] w-[25%] md:block"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--obra) 0 18px, transparent 18px 30px)" }}
        />
        {pipeline.modulos.map((m) => (
          <li key={m.codigo} className="relative flex gap-5 md:block md:pr-8">
            <span
              aria-hidden
              className="relative z-10 block size-10 shrink-0 rounded-full border-[7px] bg-papel"
              style={{ borderColor: m.obra ? "var(--obra)" : "var(--tinta)", borderStyle: m.obra ? "dashed" : "solid" }}
            />
            <div className="md:mt-5">
              <h3 className={`font-sinal text-2xl font-black leading-tight ${m.obra ? "text-obra-texto" : ""}`}>
                <span className="mr-2 font-mono text-base font-semibold text-suave">{m.codigo}</span>
                {m.nome}
              </h3>
              {m.obra ? <p className="mt-1 font-sinal text-sm font-bold text-obra-texto">Em obras: aguarda o baseline humano</p> : null}
              <p className="mt-3 leading-relaxed text-tinta-2">{m.texto}</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label={`Fontes e ferramentas do ${m.codigo}`}>
                {m.fontes.map((f) => (
                  <li key={f} className="flex items-center gap-2 font-sinal text-sm font-semibold">
                    <span aria-hidden className="size-3 rounded-full border-[3px] border-fontes bg-papel" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-xs text-suave">{m.arquivo}</p>
            </div>
          </li>
        ))}
      </ol>

      <Sub>{pipeline.exemploTitulo}</Sub>
      <p className="medida mt-3 text-tinta-2">{pipeline.exemploLegenda}</p>
      <pre className="mt-5 max-w-[72ch] overflow-x-auto rounded-[3px] bg-tinta p-5 font-mono text-[0.85rem] leading-relaxed text-[#e8eaed]">
        <code>{pipeline.exemplo}</code>
      </pre>
      <p className="medida mt-4 text-[0.95rem] text-suave">{pipeline.exemploNota}</p>
    </Secao>
  );
}
