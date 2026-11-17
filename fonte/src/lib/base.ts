// Arquivos de public/ referenciados direto no HTML não recebem o basePath
// sozinhos na exportação estática: este helper põe o prefixo.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (caminho: string) => `${BASE}${caminho}`;

export const fmt = (n: number, casas = 0) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
