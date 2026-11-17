import type { Metadata, Viewport } from "next";
import { Overpass, Overpass_Mono, Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";

const sinal = Overpass({ variable: "--font-sinal", subsets: ["latin"], weight: ["400", "600", "800", "900"] });
const codigo = Overpass_Mono({ variable: "--font-codigo", subsets: ["latin"], weight: ["400", "600"] });
const leitura = Atkinson_Hyperlegible_Next({ variable: "--font-leitura", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReconAI · Elton Lunardi · LIAA",
  description:
    "ReconAI: hipóteses de ataque geradas por LLM a partir de reconhecimento passivo, com a confiança de cada fonte medida e avaliação cega contra um especialista. Projeto da disciplina Laboratório de Inteligência Artificial Aplicada.",
};

export const viewport: Viewport = { themeColor: "#15171A" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sinal.variable} ${codigo.variable} ${leitura.variable}`}>
      <body>{children}</body>
    </html>
  );
}
