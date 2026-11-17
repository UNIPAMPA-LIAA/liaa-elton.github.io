---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Superfície: página única do site do ReconAI

Modo: Read. Público: o professor da LIAA (leitura atenta) e a turma na apresentação final. Tarefa do leitor: entender contexto, problema, proposta, coleta, fontes, experimento e evolução, e rastrear cada número até a coleta de origem. Conteúdo: o do site antigo (Rodada 7 inclusa) e os dados de `src/data/` gerados pelos scripts; vídeo de resumo de até 3 min. Restrições: export estático para GitHub Pages com basePath `/liaa-elton.github.io`; sem modo apresentação; nada de afirmar acerto do LLM.

Momento memorável: o mapa da rede do projeto na primeira tela, que também é a navegação, com um marcador de trem que acompanha a leitura.

Decisões em aberto: instituição (UNIPAMPA, a confirmar); narração do trecho novo do vídeo depende de créditos da ElevenLabs.

## Direction contract

THESIS: o projeto como uma rede de metrô. O pipeline é a linha vermelha, as fontes são a linha azul que cruza M1 e M2, as rodadas são a linha verde, e o que falta fazer é tracejado cinza, em obras. Recusa o site de segurança escuro com terminal e neon, e a documentação genérica de sumário lateral.

OWN-WORLD: fundo branco, tinta #15171A, linhas chapadas #D7263D (pipeline), #0072CE (fontes), #00965E (rodadas), #8A8F98 tracejado (em obras). Estações em círculo branco com contorno grosso, curvas de 45°, placa de estação em faixa preta, legenda de mapa de transporte. Overpass para sinalização e títulos, Overpass Mono para códigos de estação e datas, Atkinson Hyperlegible para a leitura. Sem cards, sombra ou gradiente: hierarquia por peso de linha, tamanho de estação e espaço.

STORY: o leitor vê a pergunta e a rede inteira, segue a linha vermelha estação por estação (do funil de 10.577 nomes às ~8 hipóteses), entende por que cada fonte vale o que vale, vê as 320 execuções e as rodadas, assiste ao vídeo e termina nas estações em obras: o baseline humano e a avaliação cega.

FIRST VIEWPORT: faixa preta de placa no topo (roundel, ReconAI, subtítulo, seções como botões de linha). Coluna de leitura à esquerda com a etiqueta "Estação 0 · a pergunta", a pergunta de pesquisa em Overpass grande e dois parágrafos; ações "Seguir a linha" e "Ver o vídeo". À direita, o mapa da rede: estações 10.577 → 2.491 → 76 → 52 → ~8 com datas, a linha azul das fontes, a linha verde R1 a R7 e a legenda no canto. Cada estação é um link para a sua seção.

FORM: mapa de metrô no estilo Beck com sinalização de estação, posição 3 da lista ordenada, seed key ab7a029f. Interação assinatura: o marcador de trem anda pela linha vermelha conforme a leitura avança e mostra "você está aqui"; e um seletor de linha (modelo e prompt) acende as mesmas combinações na grade das 320 execuções, nos painéis e no custo. Reforços: recusa do Claude como estação fechada; limites e pendências isolados por espaço; cada número preso à estação e à data; sem caixas; pendências tracejadas em obras.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
