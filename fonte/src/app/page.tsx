import { StationBoard } from "@/components/linha/station-board";
import { Abertura } from "@/components/secoes/abertura";
import { Contexto } from "@/components/secoes/contexto";
import { Problema } from "@/components/secoes/problema";
import { Pipeline } from "@/components/secoes/pipeline";
import { Coleta } from "@/components/secoes/coleta";
import { Fontes } from "@/components/secoes/fontes";
import { Experimento } from "@/components/secoes/experimento";
import { Obras, Rodadas, Rodape, Video } from "@/components/secoes/finais";

export default function Pagina() {
  return (
    <>
      <StationBoard />
      <main>
        <Abertura />
        <div className="mx-auto max-w-[1440px] md:pl-4">
          <Contexto />
          <Problema />
          <Pipeline />
          <Coleta />
          <Fontes />
          <Experimento />
          <Rodadas />
          <Video />
          <Obras />
        </div>
      </main>
      <Rodape />
    </>
  );
}
