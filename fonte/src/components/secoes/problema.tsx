import { problema } from "@/content/site";
import { Secao } from "@/components/linha/secao";

export function Problema() {
  return (
    <Secao id="problema" titulo={problema.titulo} linha="pipeline">
      <p className="mt-8 max-w-[30ch] font-sinal text-[1.6rem] font-extrabold leading-[1.18] md:text-[2.15rem]">
        {problema.pergunta}
      </p>
      <p className="medida mt-10 text-lg text-tinta-2">{problema.intro}</p>
      <dl className="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-3">
        {problema.dificuldades.map((d) => (
          <div key={d.titulo} className="border-t-[3px] border-tinta pt-4">
            <dt className="font-sinal text-xl font-extrabold leading-tight">{d.titulo}</dt>
            <dd className="mt-2 leading-relaxed text-tinta-2">{d.texto}</dd>
          </div>
        ))}
      </dl>
    </Secao>
  );
}
