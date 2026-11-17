import dados from "@/data/experimento.json";
import { obras, projeto, rodadas, rodape, video } from "@/content/site";
import { Secao } from "@/components/linha/secao";
import { asset } from "@/lib/base";

export function Rodadas() {
  return (
    <Secao id="rodadas" titulo={rodadas.titulo} linha="rodadas" intro={<p>{rodadas.intro}</p>}>
      <ol className="relative mt-10 max-w-[60rem]">
        <span aria-hidden className="absolute bottom-3 left-[14px] top-3 w-[7px] rounded-full bg-rodadas" />
        {rodadas.lista.map((r, i) => {
          const ultima = i === rodadas.lista.length - 1;
          return (
            <li key={r.codigo} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-5 pb-10">
              <span
                aria-hidden
                className={`relative z-10 mt-1 block size-[36px] rounded-full border-[6px] ${ultima ? "border-rodadas bg-rodadas" : "border-rodadas bg-papel"}`}
              />
              <div>
                <h3 className="flex flex-wrap items-baseline gap-x-3 font-sinal text-2xl font-black">
                  Rodada {r.codigo.slice(1)}
                  {r.data ? <span className="font-mono text-base font-normal text-suave">{r.data}</span> : null}
                </h3>
                <p className="medida mt-2 leading-relaxed">
                  <b className="font-sinal font-extrabold text-rodadas-texto">Pedido:</b> <span className="text-tinta-2">{r.pedido}</span>
                </p>
                <p className="medida mt-2 leading-relaxed text-tinta-2">{r.feito}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* O pedido da última rodada, item por item, com o lugar onde cada resposta está. */}
      <h3 className="mt-6 font-sinal text-xl font-extrabold md:text-2xl">{rodadas.r7Titulo}</h3>
      <ol className="mt-5 max-w-[60rem]">
        {rodadas.r7.map((r, i) => (
          <li key={r.pedido} className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-fio py-3">
            <span className="font-mono text-sm text-suave">{i + 1}</span>
            <span className="leading-snug text-tinta-2">{r.pedido}</span>
            <a
              href={r.onde}
              className={`whitespace-nowrap font-sinal text-sm font-bold underline-offset-4 hover:underline ${r.estado === "feito" ? "text-tinta" : "text-obra-texto"}`}
            >
              {r.rotulo} →
            </a>
          </li>
        ))}
      </ol>
    </Secao>
  );
}

export function Video() {
  return (
    <Secao id="video" titulo={video.titulo} linha="rodadas" intro={<p>{video.texto}</p>}>
      <figure className="mt-8 max-w-[64rem]">
        <div className="rounded-[3px] bg-tinta p-2 md:p-3">
        <video
          controls
          preload="metadata"
          playsInline
          poster={asset(video.poster)}
          className="aspect-video w-full rounded-[3px] bg-tinta"
        >
          <source src={asset(video.arquivo)} type="video/mp4" />
          <track kind="captions" srcLang="pt-BR" label="Português" src={asset(video.legenda)} />
          Seu navegador não toca vídeo. <a href={asset(video.arquivo)} className="underline hover:text-pipeline">Baixe o arquivo do vídeo</a>.
        </video>
        </div>
        <figcaption className="mt-3 text-sm text-suave">{video.nota}</figcaption>
      </figure>
    </Secao>
  );
}

export function Obras() {
  return (
    <Secao id="obras" titulo={obras.titulo} linha="obra" intro={<p>{obras.intro}</p>}>
      <ol className="mt-10 grid max-w-[64rem] gap-x-12 gap-y-8 md:grid-cols-2">
        {obras.lista.map((o) => (
          <li key={o.titulo} className="border-t-[3px] border-dashed border-obra pt-4">
            <h3 className="font-sinal text-xl font-extrabold">{o.titulo}</h3>
            <p className="mt-2 leading-relaxed text-tinta-2">{o.texto}</p>
          </li>
        ))}
      </ol>
    </Secao>
  );
}

export function Rodape() {
  return (
    <footer className="bg-tinta text-[#d6d9dd]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-10">
        <p className="font-sinal text-2xl font-black text-papel">{projeto.nome}</p>
        <p className="medida mt-4 leading-relaxed">{rodape.linha1}</p>
        <p className="medida mt-3 leading-relaxed">{rodape.linha2}</p>
        <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-sinal text-sm">
          <a href={projeto.repositorio} className="font-bold text-papel underline decoration-[#6b7079] transition-colors hover:decoration-papel">
            {rodape.repositorio}
          </a>
          <span>Dados do experimento atualizados em {dados.gerado_em}.</span>
        </p>
      </div>
    </footer>
  );
}
