# liaa-elton.github.io

Site do projeto **ReconAI**, de Elton Lunardi, na disciplina Laboratório de
Inteligência Artificial Aplicada (LIAA). Apresenta o contexto, o problema, a
proposta e a evolução do projeto ao longo do semestre, com os dados do
experimento e um vídeo de resumo.

Site: https://unipampa-liaa.github.io/liaa-elton.github.io/

## O que está neste repositório

```
index.html, _next/, video/   o site pronto, gerado (não editar à mão)
.nojekyll                    faz o GitHub Pages servir a pasta _next/
fonte/                       o código-fonte do site
```

O código-fonte é um projeto Next.js 16 com exportação estática, Tailwind v4,
shadcn e motion. Todo o texto fica em `fonte/src/content/site.ts`; os números
do experimento e da coleta, em `fonte/src/data/*.json`.

## Atualizar os dados e publicar

```bash
cd fonte
npm install
python3 tools/atualizar_dados.py   # lê results/execucoes.csv do projeto e grava src/data/experimento.json
python3 tools/dados_coleta.py      # grava src/data/coleta.json a partir das coletas
bash tools/publicar.sh             # gera o site e copia para a raiz deste repositório
git add -A && git commit -m "Atualiza o site" && git push
```

Os dois scripts de dados procuram o projeto em `~/Área de trabalho/Mestrado/LIAA`;
use `--projeto <pasta>` para apontar outro lugar.

Para ver localmente antes de publicar: `npx next build` e sirva a pasta `out/`
num caminho `/liaa-elton.github.io/` (o site usa esse basePath).

## GitHub Pages

*Settings → Pages → Deploy from a branch*, `main`, pasta `/ (root)`.
