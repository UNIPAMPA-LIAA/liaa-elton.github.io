---
name: ReconAI
description: O projeto como uma rede de metrô, lida estação por estação.
colors:
  tinta: "#15171a"
  tinta-2: "#31353c"
  suave: "#5b606b"
  fio: "#d9dce1"
  painel: "#f3f4f6"
  papel: "#ffffff"
  linha-pipeline: "#d7263d"
  linha-fontes: "#0072ce"
  linha-rodadas: "#00965e"
  linha-rodadas-texto: "#00744a"
  obra: "#8a8f98"
  obra-texto: "#5b606b"
  placa-texto: "#d6d9dd"
  placa-trilho: "#6b7079"
typography:
  display:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "3.1rem"
    fontWeight: 900
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  numeral:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 900
    lineHeight: 1.1
    fontFeature: "tnum"
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
  code:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  placa: "3px"
  trem: "5px"
  estacao: "9999px"
spacing:
  margem-celular: "16px"
  margem-desktop: "40px"
  trilho-celular: "2.25rem"
  trilho-desktop: "5rem"
  estacao-topo: "4.25rem"
  estacao-base: "7rem"
  sub: "4rem"
  medida: "68ch"
  container: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    typography: "{typography.label}"
    rounded: "{rounded.placa}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.linha-pipeline}"
    textColor: "{colors.papel}"
  button-secondary:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.placa}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    textColor: "{colors.linha-pipeline}"
  station-board:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    padding: "16px 40px"
  line-toggle:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.placa}"
    height: "44px"
  line-toggle-pressed:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
  code-panel:
    backgroundColor: "{colors.tinta}"
    textColor: "#e8eaed"
    rounded: "{rounded.placa}"
    padding: "20px"
  video-frame:
    backgroundColor: "{colors.tinta}"
    rounded: "{rounded.placa}"
    padding: "12px"
---

# Design System: ReconAI

## Overview

**Creative North Star: "O mapa de metrô"**

O site inteiro é uma rede de transporte desenhada no estilo de Harry Beck. O pipeline é a linha vermelha, as fontes de dados são a linha azul que cruza M1 e M2, as rodadas com o professor são a linha verde e o que falta fazer é um trecho tracejado cinza, em obras. Cada seção é uma estação: o trilho corre pela margem esquerda na cor da linha a que a seção pertence, e o título é a parada. A placa preta no topo é o painel do vagão, com um trem que anda pela linha vermelha conforme a leitura avança.

A superfície é papel branco e tinta quase preta, com linhas chapadas e estações em círculo branco de contorno grosso. Não há cards, sombras de superfície nem gradientes: a hierarquia vem do peso da linha, do tamanho da estação, do peso da letra e do espaço. A leitura é longa e atenta (um professor que confere cada número), então o corpo de texto usa uma face feita para legibilidade e uma medida de 68 caracteres; a sinalização usa uma face de placa, pesada e condensada no espírito, e os códigos e datas usam a mono da mesma família.

O sistema recusa o site de segurança escuro com terminal e neon e a documentação genérica de sumário lateral. O escuro aparece só como placa: o painel do topo, o rodapé, o bloco de código e a moldura do vídeo.

**Key Characteristics:**
- Fundo branco, tinta #15171a, quatro linhas de cor chapada e nada mais de cor.
- Cor diz "qual linha", nunca "bom ou ruim".
- Estações são círculos brancos de contorno grosso; o trecho em obras é tracejado.
- Três faces com papéis fixos: Overpass sinaliza, Overpass Mono codifica, Atkinson Hyperlegible Next conta.
- Plano, sem cards e sem sombra de superfície; separação por fios, réguas e espaço.
- Números com algarismos tabulares, sempre presos a estação e data.

## Colors

Uma paleta de sinalização de transporte: neutros de papel e tinta carregam tudo, e quatro cores de linha identificam a que trecho da rede cada coisa pertence.

### Primary
- **Vermelho Pipeline** (linha-pipeline): a linha do pipeline M1 a M4, o trilho das seções do pipeline, a linha da placa do topo, o trem e o estado de hover das ações principais. É a linha que o leitor segue.

### Secondary
- **Azul Fontes** (linha-fontes): a linha das fontes de dados (subfinder, dnsx, httpx, Censys, NVD, EPSS), os marcadores de fonte nas listas, as barras do gráfico de fontes e o anel de foco. No experimento, é também a linha do Qwen.

### Tertiary
- **Verde Rodadas** (linha-rodadas): a linha das sete rodadas com o professor e o trilho das seções Rodadas e Vídeo. A última rodada é a única estação preenchida.
- **Verde Rodadas Texto** (linha-rodadas-texto): a variante escura do verde para texto colorido ("Pedido:"), que passa de 4,5:1 sobre branco. A cor cheia é para traço; a variante "-texto" é para letra.

### Neutral
- **Tinta** (tinta): texto principal, contorno das estações, a placa do topo, o rodapé, os painéis de código e vídeo, o botão principal e a régua grossa de cabeçalho das tabelas. No experimento, é a linha do Llama.
- **Tinta Segunda** (tinta-2): corpo de texto secundário, parágrafos de introdução e legendas de cabeçalho de tabela.
- **Suave** (suave): notas, datas, códigos de estação, fontes de dado e a classificação "Baixa".
- **Fio** (fio): fios de separação entre linhas de tabela, a divisória vertical da abertura e bordas de interface.
- **Painel** (painel): fundo de trilho da barra de rolagem e superfícies neutras do shadcn. Quase não aparece.
- **Papel** (papel): o chão de toda a página e o miolo de toda estação.
- **Obra** (obra) e **Obra Texto** (obra-texto): o cinza do que ainda não existe (M4, baseline humano, avaliação cega), sempre tracejado no traço; a variante "-texto" para letra.
- **Texto de Placa** (placa-texto) e **Trilho de Placa** (placa-trilho): os cinzas claros e médios sobre a tinta, na placa do topo e no rodapé (texto de apoio e estações já passadas).

### Named Rules
**The Qual Linha Rule.** Cor responde a uma pergunta só: a que linha isto pertence. Nunca codifica bom, ruim, alerta ou sucesso. Avaliações usam peso: Alta em Overpass black na tinta, Média em semibold na tinta, Baixa em semibold no suave.

**The Traço e Letra Rule.** A cor cheia de uma linha é para traço, ponto e barra. Texto colorido usa a variante "-texto" ou a tinta; nenhuma letra pequena em verde ou cinza cheio.

**The Obra Tracejada Rule.** O que não existe ainda é cinza e tracejado, em todo lugar: no mapa, no trilho da seção, no contorno da estação e na régua do item. Nunca desenhe uma pendência com traço cheio.

## Typography

**Display Font:** Overpass (com system-ui), pesos 400, 600, 800 e 900
**Body Font:** Atkinson Hyperlegible Next (com system-ui)
**Label/Mono Font:** Overpass Mono (com ui-monospace), pesos 400 e 600

**Character:** Overpass vem da sinalização rodoviária e faz o papel da placa de estação: títulos, números, rótulos e botões. Atkinson Hyperlegible Next faz a leitura longa com formas de letra que não se confundem, e a mono da família Overpass marca códigos de estação, datas e nomes de arquivo como se fossem a tabela de horários.

### Hierarchy
- **Display** (900, 2.2rem no celular e 3.1rem a partir de md, altura 1.04, -0.025em): só a pergunta de pesquisa na abertura.
- **Headline** (900, 2rem no celular e 3.25rem a partir de md, altura 1.05, -0.015em): o título de cada estação (seção).
- **Title** (800 a 900, 1.25rem a 1.5rem, altura 1.25): subtítulos dentro da estação, nomes dos módulos, rodadas e itens em obras.
- **Numeral** (900, 1.875rem a 2.25rem, algarismos tabulares): os números grandes presos a estações e achados.
- **Body** (400, 1.0625rem, altura 1.6, medida de 68ch): todo o texto corrido. Introduções de seção sobem para 1.125rem em tinta-2.
- **Label** (600 a 800, 0.875rem): rótulos do seletor, cabeçalhos de tabela, legendas do mapa e botões (botões em 1rem, 800).
- **Code** (Overpass Mono 400 ou 600, 13px a 0.875rem): códigos M1 a M4, datas, notas de estação, nomes de arquivo, valores de limite.

### Named Rules
**The Código na Linha Rule.** Não há sobretítulo (eyebrow) acima de título. Códigos como M1 ou o número da fase entram na mesma linha do título, em mono semibold no suave, à esquerda do nome; a data de uma rodada entra à direita, na mesma linha de base.

**The Três Vozes Rule.** Overpass nunca vira corpo de texto e Atkinson nunca vira título ou número grande. A mono só aparece para códigos, datas e dados literais.

## Layout

Uma coluna de leitura num container de até 1440px, com margens de 16px no celular e 40px a partir de md. Cada estação é uma grade de duas colunas: o trilho à esquerda (2.25rem no celular, 5rem a partir de md) e o conteúdo à direita. O trilho tem 7px no celular e 9px no desktop, com a estação em círculo de 26px ou 34px alinhada ao título. As estações respiram com 3rem a 4.25rem no topo e 5rem a 7rem na base; subtítulos internos abrem com 4rem.

A abertura é a exceção: a partir de lg, coluna de leitura de até 34rem com um fio à direita e o mapa da rede ocupando o resto. No celular, o mapa em SVG vira uma lista vertical de estações descendo por um trilho vermelho que termina tracejado, seguida de uma fileira verde de R1 a R7; a linha azul e sua legenda saem do celular.

Diagramas de linha mudam de eixo com a largura: o pipeline, as fases do pentest e as coletas são horizontais a partir de md (ou sm) e verticais abaixo. Tabelas largas rolam dentro da própria região rotulada e focável, com largura mínima própria; a página nunca rola na horizontal. O seletor de linha do experimento fica preso logo abaixo da placa enquanto a grade e os painéis passam.

**The Rolagem Contida Rule.** Só a tabela rola para o lado, dentro de uma região com rótulo e foco; o corpo da página nunca.

## Elevation & Depth

O sistema é plano. Não há sombra em superfície, card ou botão; a profundidade vem de três camadas de cor (papel, tinta da placa, painel) e da sobreposição física das estações, que ficam acima do trilho com miolo branco. A placa do topo é fixa e o seletor do experimento é fixo com papel a 95% e desfoque de 2px, mas nenhum dos dois ganha sombra.

### Shadow Vocabulary
- **Trem** (`box-shadow: 0 2px 6px rgba(0,0,0,0.45)`): só no marcador de trem da placa, para destacá-lo sobre a linha vermelha. É a única sombra do sistema.

### Named Rules
**The Placa Plana Rule.** Separação é fio, régua ou espaço: fio de 1px entre linhas de tabela, régua de 2px de tinta no cabeçalho, régua de 3px no topo de um bloco. Nunca uma caixa com sombra.

## Shapes

Duas formas mandam: o círculo e a linha arredondada. Estações são círculos brancos com contorno de 5px a 7px (tinta para estações em operação, obra tracejada para as pendentes, a cor da linha para fontes e rodadas). Linhas são faixas chapadas com pontas redondas. Retângulos têm canto de placa (3px) e só aparecem em botões, no seletor, no bloco de código e na moldura do vídeo; o trem tem canto de 4px a 5px. As barras dos gráficos são retas com a ponta direita levemente arredondada, e o prompt CoT é marcado por hachura a 45° em vez de outra cor.

## Components

### Buttons
Placa de estação: retângulo de tinta, letra pesada, sem ornamento.
- **Shape:** canto de placa (3px), altura mínima de 44px, 20px de respiro lateral.
- **Primary:** fundo tinta, texto papel, Overpass 800 a 1rem. Hover troca o fundo pelo vermelho do pipeline.
- **Secondary:** contorno de 2px em tinta sobre papel. Hover passa contorno e texto para o vermelho do pipeline.
- **Focus:** anel global de 3px no azul das fontes, afastado 3px.

### Seletor de linha
O controle do experimento ("Acender uma linha"): um grupo de cinco botões (todas e as quatro combinações de modelo e prompt) colados por fios de tinta dentro de um contorno de 2px, com 44px de altura. O pressionado vira tinta com texto papel. Ao escolher, a grade das 320 execuções, os painéis e o custo apagam o que não pertence à linha em 280ms (curva de saída), ou na hora com movimento reduzido. Duas colunas no celular, cinco a partir de sm.

### Tabelas
Cabeçalho em Overpass 0.875rem tinta-2 sobre régua de 2px de tinta; linhas separadas por fio de 1px; cabeçalho de linha em Overpass 800. Números tabulares. Classificações seguem a Qual Linha Rule (peso, não cor). Toda tabela larga vai dentro da região de rolagem contida.

### Navigation
A placa do topo é uma faixa de tinta fixa com o roundel (anel vermelho cortado por barra azul), o nome ReconAI em Overpass 900 e a linha vermelha com uma estação por seção. A estação atual fica vermelha com contorno papel; as já passadas escurecem em placa-trilho; as próximas ficam brancas e acendem em vermelho no hover. O trem desliza entre estações por mola (rigidez 220, amortecimento 40) e salta direto com movimento reduzido. No celular os rótulos somem, as estações encolhem para 14px e o nome da estação atual aparece ao lado da marca ("Estação: A pergunta").

### Trilho de seção (signature)
Cada seção carrega à esquerda o trilho da sua linha (pipeline, fontes, rodadas ou obra tracejada) e uma estação em círculo branco com contorno de tinta na altura do título. A cor do trilho é a resposta a "de que linha é esta parte".

### Mapa da rede (signature)
O mapa na primeira tela é navegação: cada estação é um link para a sua seção. Linhas de 10px a 16px, estações de 9px a 21px de raio, códigos e datas em mono 13px no suave, números em Overpass 900. A legenda usa amostras de linha de 7px por 32px, com a obra tracejada.

### Painéis de tinta
Código de exemplo e vídeo ficam em painéis de tinta com canto de placa. O vídeo é emoldurado por 8px a 12px de tinta porque carrega identidade visual própria (a da retrospectiva, separada da do site); a moldura isola essa peça do mapa.

### Itens em obras
Pendências são blocos sem caixa, com régua tracejada de 3px em obra no topo, título em Overpass 800 e texto em tinta-2. Avisos de pendência usam régua tracejada acima e abaixo e texto em obra-texto.

## Do's and Don'ts

### Do:
- **Do** atribuir cada seção, gráfico e marcador a uma das quatro linhas e usar só a cor dessa linha.
- **Do** codificar avaliações por peso: Alta em 900 na tinta, Média em 600 na tinta, Baixa em 600 no suave.
- **Do** pôr códigos (M1, número da fase) dentro do título, em mono semibold no suave, e datas na mesma linha de base.
- **Do** desenhar tudo o que ainda não existe em cinza obra e tracejado.
- **Do** usar a variante "-texto" (ou a tinta) sempre que uma cor de linha virar letra.
- **Do** manter o corpo de texto em até 68ch e as tabelas largas dentro da própria região de rolagem.
- **Do** converter o mapa em lista vertical de estações mais a fileira verde R1 a R7 abaixo de md.
- **Do** emoldurar peças com identidade própria, como o vídeo, num painel de tinta.

### Don't:
- **Don't** usar cor para dizer bom, ruim, alerta ou sucesso; nenhum verde de "ok" nem vermelho de "erro".
- **Don't** pôr sobretítulo (eyebrow) ou etiqueta em caixa alta acima de um título.
- **Don't** usar cards, sombras de superfície ou gradientes decorativos; a única sombra é a do trem.
- **Don't** criar uma quinta cor de linha ou um tom intermediário de uma linha existente.
- **Don't** deixar a página rolar na horizontal.
- **Don't** usar Overpass para corpo de texto nem Atkinson para títulos e números.
- **Don't** voltar ao site de segurança escuro com terminal e neon; o escuro é só placa.
