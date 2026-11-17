# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 + Tailwind v4 + shadcn (padrão do toolkit de sites em `~/projetos/CLAUDE.md`), com `output: "export"`: o site é estático. O resultado da exportação (`out/`) é publicado no repositório `UNIPAMPA-LIAA/liaa-elton.github.io` (GitHub Pages, branch `main`, raiz), servido em `https://unipampa-liaa.github.io/liaa-elton.github.io/`, então o build usa `basePath` `/liaa-elton.github.io`. O código-fonte fica em `~/projetos/liaa-reconai`.

## Users

- **Primário:** o professor da disciplina Laboratório de Inteligência Artificial Aplicada (LIAA), do Mestrado Profissional em Computação Aplicada. Ele acompanhou o projeto em rodadas e avalia contexto, problema, proposta e evolução ao longo do semestre.
- **Na apresentação final:** colegas da turma, assistindo ao vídeo e ao site projetados.
- **Depois:** quem chega ao repositório público (avaliadores, pesquisadores de segurança e LLM) e quer conferir de onde vem cada número.

## Product Purpose

Site do projeto ReconAI, de Elton Lunardi. Exigência da disciplina: apresentar o contexto, o problema, a proposta de solução e a evolução do projeto no semestre, de forma visualmente atrativa e bem organizada, servindo para documentar o projeto e apoiar a apresentação final. Inclui um vídeo animado de até 3 minutos que resume o projeto.

Sucesso: o professor entende o projeto inteiro, vê cada pedido de cada rodada respondido e consegue rastrear qualquer número até os dados.

## Positioning

O ReconAI pergunta se um LLM transforma dados de reconhecimento passivo em hipóteses de ataque com qualidade comparável à de um especialista, a que custo e em quanto tempo. O que o diferencia:
- mede a confiança de cada fonte de reconhecimento (rendimento, frescor, verificabilidade, origem) em vez de tratar todo dado como igual;
- usa avaliação cega contra um baseline humano, sem gabarito fixo;
- registra recusas e limites como resultado (o Claude recusou a tarefa; o prompt não foi alterado para contornar o filtro).

## Operating Context

- Pipeline em Python, M1 a M4: M1 coletor (subfinder, dnsx, httpx, Censys), M2 enriquecedor (NVD, EPSS), M3 analisador (filtro de contexto + LLM), M4 avaliação cega.
- Experimento: 4 alvos × 2 modelos locais (Llama 3.1 8B, Qwen 2.5 7B, via Ollama) × 2 prompts (few-shot, chain-of-thought) × 20 execuções = 320.
- O projeto avançou em 7 rodadas de retorno do professor (R1 a R7, até 12/11/2026).
- Material do projeto em `~/Área de trabalho/Mestrado/LIAA/` (código, `results/`, `coletas/`, `contexto/`, decks `.pptx`, roteiros, vídeo em `video-retrospectiva/`).

## Capabilities and Constraints

- Site estático, sem servidor. Os dados do experimento vêm dos scripts `tools/atualizar_dados.py` e `tools/dados_coleta.py` (hoje no repositório do site) a partir de `results/` e das coletas, e o site precisa continuar sendo atualizável por eles.
- Precisa manter: os dados do experimento (grade das 320 execuções, painéis comparativos, custo), todo o conteúdo da Rodada 7 (organograma do pentest, fontes do subfinder, mapa dos hosts, régua de verificabilidade 0–8, modelos e limites) e a linha do tempo das rodadas.
- O modo apresentação do site antigo (tecla P) não é requisito.
- Vídeo: ampliar a retrospectiva atual (1min27s) até no máximo 3 min, com narração nova pela ElevenLabs (conta no plano gratuito, ~200 créditos até a renovação de 06/12/2026; precisa de crédito para a narração nova).
- O endereço publicado é `unipampa-liaa.github.io/liaa-elton.github.io/`, não `liaa-elton.github.io` (repositório dentro da organização UNIPAMPA-LIAA).

## Brand Commitments

- Identidade visual própria do ReconAI, definida na rodada de direções. **Não** usa a identidade da MR. Robot Solutions; o vídeo de retrospectiva, que usa a identidade MR Robot, entra como peça à parte.
- Autor: Elton Lunardi. Disciplina: Laboratório de Inteligência Artificial Aplicada (LIAA). Curso: Mestrado Profissional em Computação Aplicada. Instituição: UNIPAMPA (inferido do nome da organização GitHub; A CONFIRMAR antes de aparecer no site).
- Texto em português do Brasil, passando pela skill humanizer (sem travessão, sem tríades forçadas, sem jargão de venda).

## Evidence on Hand

- Resultados reais: `results/execucoes.csv` (320 execuções), `results/<alvo>/...`, scorecard em `confianca.json`, coletas de 12/10, 03/11 e 12/11/2026, contextos em `contexto/`.
- Números já publicados e com trecho no site atual: 10.577 subdomínios (03/11), 2.491 hosts e 76 grupos (12/10), 52 grupos no contexto, 4,2% dos nomes em 2+ fontes, 2,9% de CT, Jaccard 0,855, 320 execuções sem erro de formato, desvio no mesmo alvo ~0,6 (few-shot) × ~1,9 (CoT), custos estimados.
- Vídeo: `video-retrospectiva/render/final.mp4` (1min27s, 1920×1080, com legenda e `final.srt`).
- **Ausências que não se pode fabricar:** o baseline humano ainda não foi produzido e nenhuma hipótese foi julgada às cegas. O site não pode afirmar acerto, qualidade ou superioridade do LLM. As datas das rodadas R1 a R3 não estão registradas.

## Product Principles

1. Todo número tem origem rastreável: dado medido, com data e fonte, ou marcado como estimativa.
2. Honestidade metodológica acima de impressão: limites, recusas e erros aparecem como resultado.
3. O professor deve ver cada pedido de cada rodada e a resposta dada a ele.
4. Explicar antes de impressionar: o leitor sai entendendo o pipeline, as fontes e o experimento.
5. Atualizável pelos scripts: quando o experimento avança, o site acompanha sem edição manual de números.
