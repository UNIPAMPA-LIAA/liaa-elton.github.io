import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import paises from "world-atlas/countries-110m.json";

/**
 * Mapa-múndi desenhado no build (componente de servidor): vira SVG estático, sem JS no navegador.
 * Os países são só chão: papel cinza-claro, sem fronteira forte. Quem fala são os pontos.
 */
export const LARGURA = 960;
export const ALTURA = 470;

const topo = paises as unknown as Topology<{ countries: GeometryCollection }>;
const mundo = feature(topo, topo.objects.countries) as unknown as FeatureCollection;
// A Antártida (id 010) só ocupa espaço.
const semAntartida: FeatureCollection = { ...mundo, features: mundo.features.filter((f) => f.id !== "010") };
const projecao = geoEqualEarth().fitExtent(
  [
    [6, 6],
    [LARGURA - 6, ALTURA - 6],
  ],
  semAntartida,
);
const caminho = geoPath(projecao);
const CHAO = semAntartida.features.map((f) => caminho(f) ?? "").join("");

export function projetar(lon: number, lat: number): [number, number] {
  const p = projecao([lon, lat]);
  return p ? [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10] : [0, 0];
}

export function MapaMundo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="h-auto w-full" role="img" aria-label={rotulo}>
      <path d={CHAO} fill="var(--painel)" stroke="var(--fio)" strokeWidth="0.6" />
      {children}
    </svg>
  );
}
