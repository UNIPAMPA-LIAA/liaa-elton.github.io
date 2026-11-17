// Todo texto e todo link do site ficam aqui (regra do toolkit de sites).
// Os números do experimento e da coleta vêm de src/data/*.json, gerados por tools/*.py.

export type LinhaId = "pipeline" | "fontes" | "rodadas" | "obra";

export const projeto = {
  nome: "ReconAI",
  autor: "Elton Lunardi",
  disciplina: "Laboratório de Inteligência Artificial Aplicada",
  sigla: "LIAA",
  curso: "Mestrado Profissional em Computação Aplicada",
  ano: 2026,
  repositorio: "https://github.com/UNIPAMPA-LIAA/liaa-elton.github.io",
};

/** As estações da rede: cada seção da página é uma parada na linha do topo. */
export const estacoes = [
  { id: "pergunta", nome: "A pergunta", curto: "Início" },
  { id: "contexto", nome: "Contexto", curto: "Contexto" },
  { id: "problema", nome: "Problema", curto: "Problema" },
  { id: "pipeline", nome: "Pipeline", curto: "Pipeline" },
  { id: "coleta", nome: "Coleta", curto: "Coleta" },
  { id: "fontes", nome: "Fontes", curto: "Fontes" },
  { id: "experimento", nome: "Experimento", curto: "Experimento" },
  { id: "rodadas", nome: "Rodadas", curto: "Rodadas" },
  { id: "video", nome: "Vídeo", curto: "Vídeo" },
  { id: "obras", nome: "Em obras", curto: "Em obras" },
] as const;

export type EstacaoId = (typeof estacoes)[number]["id"];

export const abertura = {
  titulo: "Um LLM transforma reconhecimento passivo em hipóteses de ataque tão boas quanto as de um especialista?",
  paragrafos: [
    "Um pentest começa com milhares de nomes de domínio e termina com meia dúzia de coisas que valem ser testadas. O ReconAI coleta esses dados sem atacar o alvo, mede quanto cada fonte merece confiança e pede a dois modelos abertos as hipóteses de ataque.",
    "Depois, um especialista julga essas hipóteses às cegas, misturadas às de um analista humano. Essa última estação ainda está em obras.",
  ],
  acaoPrincipal: "Seguir a linha",
  acaoVideo: "Assistir ao resumo em vídeo",
};

export const contexto = {
  titulo: "Contexto",
  paragrafos: [
    "Todo teste de intrusão autorizado começa pelo reconhecimento. Antes de enviar qualquer carga ao alvo, o analista precisa saber o que existe: quais subdomínios, quais servidores, que software e em que versão. Quanto menos o reconhecimento toca o alvo, menor o risco de derrubar um serviço ou disparar alarmes, e por isso a primeira fase costuma ser passiva: ela consulta bases públicas que outros já coletaram.",
    "O volume é o primeiro obstáculo. Um domínio grande como o shopify.com devolve de 2,5 mil a mais de 10 mil nomes, dependendo do dia da coleta, e quase todos são lojas inativas idênticas. Achar ali o community-staging com versão exposta, ou o login fora da CDN, é trabalho manual e depende da experiência de quem lê.",
    "LLMs leem rápido e sabem muito sobre vulnerabilidades. A dúvida é se o que eles dizem sobre esses dados ajuda quem faz o pentest ou se apenas soa plausível.",
  ],
  fasesTitulo: "Onde o ReconAI entra num pentest",
  fasesIntro:
    "As fases seguem o PTES (Penetration Testing Execution Standard). O ReconAI cobre a parte passiva da coleta de informações e entrega a matéria-prima da modelagem de ameaças: hipóteses priorizadas, cada uma com o jeito de validar na fase ativa.",
  fases: [
    { nome: "Pré-engajamento", texto: "escopo, autorização e regras de engajamento", reconai: false },
    { nome: "Coleta de informações", texto: "a parte passiva é do ReconAI: M1 coleta, M2 enriquece, M3 filtra", reconai: true },
    { nome: "Modelagem de ameaças", texto: "o M3 entrega hipóteses de ataque priorizadas", reconai: true },
    { nome: "Análise de vulnerabilidades", texto: "confirmar as hipóteses pelo campo de validação", reconai: false },
    { nome: "Exploração", texto: "explorar o que foi confirmado", reconai: false },
    { nome: "Pós-exploração", texto: "alcance e impacto do acesso", reconai: false },
    { nome: "Relatório", texto: "achados, risco e correção", reconai: false },
  ],
  fasesNota: "Tudo depois da modelagem de ameaças continua manual e só acontece com autorização.",
};

export const problema = {
  titulo: "O problema",
  pergunta:
    "Um LLM consegue transformar dados de reconhecimento passivo em hipóteses de vetores de ataque priorizadas, com qualidade comparável à de um analista especialista? A que custo e em quanto tempo?",
  intro: "Três coisas complicam a resposta.",
  dificuldades: [
    {
      titulo: "As fontes não valem o mesmo",
      texto:
        "Um subdomínio visto num certificado assinado é um fato. Um nome que só o VirusTotal conhece pode ser lixo antigo. Uma versão lida agora no cabeçalho HTTP vale mais que uma varredura da Censys feita semanas atrás. Se o modelo não souber disso, trata boato e fato do mesmo jeito.",
    },
    {
      titulo: "Não existe gabarito",
      texto:
        "Ninguém sabe quantos ativos o alvo tem de verdade nem quais hipóteses estão certas antes da fase ativa. A qualidade precisa ser julgada por um especialista, às cegas.",
    },
    {
      titulo: "O contexto não cabe",
      texto:
        "O JSON enriquecido do shopify tem cerca de 11,6 mil tokens, e o modelo local trabalha com uma janela de 8 mil. Por isso, escolher o que entra no contexto já faz parte da análise.",
    },
  ],
};

export const pipeline = {
  titulo: "O pipeline",
  intro:
    "Quatro módulos em Python, ligados como estações de uma linha. Cada um grava um JSON que o próximo lê, e cada dado carrega de onde veio.",
  modulos: [
    {
      codigo: "M1",
      nome: "Coletor",
      texto:
        "Transforma um domínio em subdomínios, IPs e respostas HTTP. Hosts que respondem igual viram um grupo só, o que corta cerca de 90% dos tokens.",
      fontes: ["subfinder", "dnsx", "httpx", "Censys"],
      arquivo: "m1_collector.py",
      obra: false,
    },
    {
      codigo: "M2",
      nome: "Enriquecedor",
      texto:
        "Cruza cada software com versão com o banco de CVEs do NIST e com a chance de exploração. Um mapa de CPE curado evita casar “IIS 8.5” com o WebLogic 8.5.",
      fontes: ["NVD", "EPSS"],
      arquivo: "m2_enricher.py · m_confianca.py",
      obra: false,
    },
    {
      codigo: "M3",
      nome: "Analisador",
      texto:
        "Um filtro dá nota a cada grupo de hosts pelo interesse ofensivo e corta o contexto para cerca de 3,5 mil tokens. O modelo devolve as hipóteses num formato fixo, sempre citando a evidência.",
      fontes: ["Llama 3.1 8B", "Qwen 2.5 7B"],
      arquivo: "m3_contexto.py · m3_analisador.py",
      obra: false,
    },
    {
      codigo: "M4",
      nome: "Avaliação cega",
      texto:
        "Junta as hipóteses dos modelos e as de um analista humano num conjunto embaralhado. O avaliador julga uma por vez sem saber a origem, e cada julgamento é cronometrado.",
      fontes: ["especialista", "baseline humano"],
      arquivo: "m4_avaliacao.py",
      obra: true,
    },
  ],
  exemploTitulo: "Uma hipótese como ela sai do modelo",
  exemploLegenda: "Saída real do Llama 3.1 8B, prompt few-shot, alvo juice-shop, execução 1 de 20. Ainda não foi julgada.",
  exemplo: `{
  "vetor": "ambiente não produtivo exposto",
  "hipotese": "A loja de demo está acessível para qualquer pessoa,
               podendo conter vulnerabilidades conhecidas.",
  "evidencia": "grupo juice-shop.herokuapp.com, status 200,
                server Heroku, infra C1, 4 IPs",
  "prioridade": 1,
  "probabilidade": "média",
  "validacao": "Verificar se há proteção contra scanners e se há
                credenciais padrão."
}`,
  exemploNota:
    "A evidência é obrigatória: se o modelo citar algo que não está no contexto, a alucinação fica visível para quem avalia.",
};

export const coleta = {
  titulo: "A coleta",
  intro:
    "A primeira tela junta duas coletas: a de 12/10, usada no experimento, e a recoleta de 03/11. Esta estação abre as duas pontas: de onde vêm os nomes e o que acontece com cada um dos 2.491 hosts.",
  fontesTitulo: "De onde vêm os subdomínios",
  fontesTexto:
    "O subfinder não varre nada. Ele pergunta a bases públicas que já registraram nomes do domínio e junta as respostas sem repetir. A versão instalada conhece 49 fontes, mas a maioria exige chave de acesso.",
  cruzaTitulo: "O que o subfinder cruza",
  cruzaTexto:
    "Cada linha é uma combinação de fontes. Os pontos marcam quais fontes viram aqueles nomes; a barra mostra quantos nomes caem na combinação.",
  mapaTitulo: "Os 2.491 hosts, um por quadrado",
  mapaTexto:
    "Coleta de 12/10/2026, a usada no experimento. Os quadrados seguem a ordem dos grupos do M1, do maior para o menor: hosts que respondem igual ficam juntos.",
  perdasTitulo: "O que ficou pelo caminho",
};

export const fontesSecao = {
  titulo: "Quanto vale cada fonte",
  intro:
    "Na Rodada 4 o professor pediu para medir a confiança das fontes. A primeira resposta foi um quadro com notas dadas por julgamento. Na rodada seguinte cada eixo ganhou uma conta e um limiar fixo, calculados pelo m_confianca.py. Oito notas mudaram quando passaram a ser medidas: sete caíram e só o rendimento do httpx subiu.",
  origensTitulo: "De onde vem cada dado",
  origens: [
    { origem: "Primeira mão", fonte: "httpx", linha: "pipeline" as LinhaId, texto: "observa o alvo agora, com uma requisição HTTP comum" },
    { origem: "Infra ao vivo", fonte: "dnsx", linha: "fontes" as LinhaId, texto: "consulta o DNS agora; quem responde é a infraestrutura pública, não o site" },
    { origem: "Herdado", fonte: "subfinder, Censys", linha: "obra" as LinhaId, texto: "alguém coletou antes e o pipeline lê o que ficou guardado" },
    { origem: "Correlação", fonte: "NVD", linha: "fontes" as LinhaId, texto: "cruza a versão observada com uma base pública" },
    { origem: "Modelo", fonte: "EPSS", linha: "obra" as LinhaId, texto: "estimativa estatística, não observação" },
  ],
  scorecardTitulo: "Scorecard medido",
  scorecardLegenda:
    "Coleta de 03/11/2026. Entre parênteses, a nota dada por julgamento na rodada anterior, quando mudou.",
  scorecard: [
    { fonte: "subfinder", rend: ["Alta", "88,5%"], fresc: ["n/d", ""], verif: ["Baixa", "1/3 (era Alta)"], origem: "Herdado" },
    { fonte: "dnsx", rend: ["n/d", ""], fresc: ["Alta", "0 d"], verif: ["Média", "2/3 (era Alta)"], origem: "Infra ao vivo" },
    { fonte: "httpx", rend: ["Alta", "99,5% (era Média)"], fresc: ["Alta", "0 d"], verif: ["Média", "2/3 (era Alta)"], origem: "Primeira mão" },
    { fonte: "Censys", rend: ["Baixa", "23,2%* (era Média)"], fresc: ["n/d", ""], verif: ["Baixa", "0/3 (era Média)"], origem: "Herdado" },
    { fonte: "NVD", rend: ["Média", "75% (era Alta)"], fresc: ["n/d", ""], verif: ["Alta", "3/3"], origem: "Correlação" },
    { fonte: "EPSS", rend: ["Alta", "100%"], fresc: ["Alta", "1 d"], verif: ["Baixa", "1/3 (era Média)"], origem: "Modelo" },
  ],
  scorecardNota:
    "* Limite inferior: a única coleta com crédito na Censys (12/10) não registrou quais IPs foram consultados.",
  eixos: [
    { nome: "Rendimento", texto: "o que a fonte devolveu dividido pelo que recebeu. Alta a partir de 80%, Média de 40% a 80%, Baixa abaixo. Não é cobertura: cobertura exigiria saber o total real de ativos, e esse gabarito não existe." },
    { nome: "Frescor", texto: "dias entre a observação do dado e a coleta. Alta até 1 dia, Média até 30, Baixa acima." },
    { nome: "Verificabilidade", texto: "se um terceiro, só com acesso público, chega ao mesmo dado e consegue provar que ele é autêntico." },
    { nome: "Origem", texto: "se a fonte toca o alvo ou não. É categórica." },
  ],
  achadosTitulo: "O que a medição mostrou",
  achados: [
    { valor: "2,9%", texto: "dos 10.610 subdomínios da coleta de 03/11 (10.577 do shopify e 33 dos alvos de teste) vieram de Certificate Transparency, a fonte mais auditável. 89% vieram do VirusTotal, que não é auditável. A nota “Alta” da rodada anterior presumia CT." },
    { valor: "0,855", texto: "de concordância média (Jaccard) entre httpx e Censys nos 19 IPs do shopify em que as duas fontes disseram algo." },
    { valor: "23%", texto: "dos IPs consultados na Censys trouxeram software: o pior rendimento do pipeline." },
    { valor: "100%", texto: "dos CVEs do projeto saíram de versões vistas pelo httpx, a única fonte que toca o alvo." },
  ],
  reguaTitulo: "Uma régua mais precisa para a verificabilidade",
  reguaIntro:
    "A régua de sim ou não tinha três limites: era binária (um registro versionado e um assinado valiam o mesmo ponto), julgava a fonte em vez do dado, e era declarada em vez de medida. A régua nova tem quatro critérios de 0 a 2. Até 2 é Baixa, de 3 a 5 é Média, de 6 a 8 é Alta.",
  reguaCriterios: [
    { letra: "R", nome: "Reprodução", pergunta: "outra pessoa obtém o mesmo dado?", n: ["foi uma foto do passado, guardada por uma empresa", "sim, agora, mas o valor muda e não há histórico", "sim, inclusive o valor de uma data passada"] },
    { letra: "A", nome: "Autenticidade", pergunta: "existe prova de que não foi alterado?", n: ["nenhum registro", "registro público versionado, sem assinatura", "registro assinado e só de acréscimo"] },
    { letra: "O", nome: "Abertura", pergunta: "dá para saber como o dado nasceu?", n: ["método e dados fechados", "só um dos dois é aberto", "método e dados abertos"] },
    { letra: "E", nome: "Evidência", pergunta: "o que vem junto com cada dado?", n: ["só um número ou rótulo", "o dado com fonte e data", "o artefato bruto: certificado, resposta HTTP, registro do CVE"] },
  ],
  reguaFontes: [
    { fonte: "CT (crt.sh)", r: 2, a: 2, o: 2, e: 2, antes: "referência" },
    { fonte: "NVD", r: 2, a: 1, o: 2, e: 2, antes: "3 Alta" },
    { fonte: "httpx", r: 1, a: 0, o: 2, e: 2, antes: "2 Média" },
    { fonte: "dnsx", r: 1, a: 0, o: 2, e: 1, antes: "2 Média" },
    { fonte: "EPSS", r: 2, a: 1, o: 1, e: 0, antes: "1 Baixa" },
    { fonte: "subfinder", r: 1, a: 0, o: 0, e: 1, antes: "1 Baixa" },
    { fonte: "Censys", r: 0, a: 0, o: 0, e: 1, antes: "0 Baixa" },
  ],
  reguaNota:
    "É uma proposta para discussão: os níveis ainda são atribuídos, mas cada um tem definição fixa e duas pessoas chegam à mesma nota.",
  medirTitulo: "Medir em vez de declarar",
  medir: [
    { texto: "Só 4,2% dos nomes do subfinder aparecem em duas fontes ou mais.", estado: "medido" },
    { texto: "Todos os 50 nomes da HackerTarget também estão no DNSDumpster, um projeto da mesma empresa: a concordância entre as duas não conta como confirmação.", estado: "medido" },
    { texto: "Censys confirmada pelo httpx: concordância de 0,855 nos 19 IPs comparáveis.", estado: "medido" },
    { texto: "Repetir as mesmas requisições do httpx depois de alguns dias e medir quantas respostas continuam iguais.", estado: "proposto" },
    { texto: "Conferir à mão uma amostra de software para CPE no NVD e medir a taxa de acerto.", estado: "proposto" },
  ],
  tensaoTitulo: "A troca que o projeto assume",
  tensao:
    "A fonte mais valiosa é justamente a única ativa. Um reconhecimento 100% passivo abriria mão da versão de software, que é o que o M2 transforma em CVE. A escolha foi chamar o pipeline de passivo com baixo contato e registrar isso como limitação, em vez de descartar o dado que sustenta o resto.",
};

export const experimento = {
  titulo: "O experimento",
  intro:
    "Quatro alvos, dois modelos abertos rodando na própria máquina, duas técnicas de prompt e 20 execuções de cada combinação, para medir também a variação do modelo. No few-shot o modelo vê dois exemplos resolvidos antes do contexto; no chain-of-thought ele escreve o raciocínio antes da resposta.",
  seletorRotulo: "Acender uma linha",
  seletorAjuda: "Escolha um modelo e um prompt: a grade, os painéis e o custo acendem a mesma combinação.",
  modelosTitulo: "Os modelos",
  modelos: [
    { nome: "Llama 3.1 8B", fab: "Meta, licença Llama 3.1 Community", tam: "8,0 bi parâmetros, 4 bits (Q4_K_M), 4,9 GB", janela: "128 mil tokens", usada: "8.192", situacao: "160 execuções", fechada: false },
    { nome: "Qwen 2.5 7B", fab: "Alibaba, Apache-2.0", tam: "7,6 bi parâmetros, 4 bits (Q4_K_M), 4,7 GB", janela: "32 mil tokens", usada: "8.192", situacao: "160 execuções", fechada: false },
    { nome: "Claude Sonnet 5.5", fab: "Anthropic, US$ 2 / 10 por milhão de tokens", tam: "não divulgado, via API", janela: "1 milhão", usada: "nenhuma", situacao: "Estação fechada: recusou a tarefa (categoria cyber) nas duas variantes de prompt.", fechada: true },
  ],
  recusa:
    "O prompt não foi reescrito para contornar o filtro: o braço Claude passaria a medir a habilidade de burlar o filtro, não o modelo. A recusa entrou como resultado.",
  limitesTitulo: "Os limites e por que existem",
  limitesIntro:
    "A janela de 8.192 tokens não é limite dos modelos: o Llama aceita 128 mil e o Qwen 32 mil. É uma escolha, e o orçamento de 3.500 tokens do contexto sai dela.",
  limites: [
    { nome: "Janela do modelo local", valor: "8.192 tokens", porque: "O padrão do Ollama é menor e cortaria o shopify sem avisar. Uma janela maior ocupa mais memória e fica mais lenta em CPU. 8.192 cobre o pior caso medido, 6.840 tokens de entrada mais saída." },
    { nome: "Contexto enviado ao modelo", valor: "3.500 tokens", porque: "Precisa caber com as instruções, os dois exemplos e a resposta. Sem o filtro, só o JSON do shopify tem 11,6 mil tokens. Modelos pequenos também usam pior entradas longas e tendem a ignorar o meio (Liu et al., 2023, “Lost in the Middle”)." },
    { nome: "Grupos no contexto", valor: "por nota, até encher", porque: "No shopify entraram 52 de 76. O 52º e o 53º têm a mesma nota: quem decide o corte é o espaço." },
    { nome: "Hipóteses pedidas", valor: "de 3 a 10", porque: "Força o modelo a priorizar. 17,5% das execuções saíram da faixa." },
    { nome: "Execuções por combinação", valor: "20", porque: "Pedido da Rodada 3: duas execuções não medem variação." },
    { nome: "Consultas à Censys", valor: "1 crédito por IP", porque: "Os créditos gratuitos acabaram em 12/10, por isso o experimento usa essa coleta." },
  ],
  gradeTitulo: "320 execuções, uma por ponto",
  resultadosTitulo: "As quatro combinações lado a lado",
  resultadosIntro:
    "Cada painel é uma métrica, com uma barra por combinação. A cor é o modelo e a barra listrada é o chain-of-thought; cada painel tem a própria escala.",
  leitura: [
    { titulo: "O prompt pesa mais que o modelo.", texto: "Passar de few-shot para chain-of-thought muda mais o resultado do que trocar o Llama pelo Qwen." },
    { titulo: "O chain-of-thought gera mais e varia mais.", texto: "No mesmo alvo, o desvio entre as 20 execuções fica em torno de 0,6 hipótese no few-shot e 1,9 no CoT, nos dois modelos, e ele leva o dobro do tempo." },
    { titulo: "Formato válido não é instrução cumprida.", texto: "Nenhuma execução teve erro de formato, mas 17,5% saíram da faixa de 3 a 10 hipóteses pedida no prompt." },
  ],
  avisoQualidade:
    "Estes números medem volume e estabilidade. Nenhuma hipótese foi julgada ainda: a qualidade só aparece depois da avaliação cega.",
  custoTitulo: "Quanto custou e quanto custaria",
  custoNota:
    "Preços de 12/11/2026. Claude: tabela oficial da Anthropic. Llama e Qwen hospedados: mediana do OpenRouter, onde os provedores variam de cerca de US$ 0,02 a 0,20 por milhão. O Claude conta mais tokens para o mesmo texto (1,9 vez no few-shot e 2,5 no CoT, medido no teste de fumaça), e a estimativa aplica esse fator.",
};

export const rodadas = {
  titulo: "Sete rodadas com o professor",
  intro: "O projeto andou em rodadas. Em cada uma o professor fez um pedido, e a rodada seguinte começou por ele.",
  lista: [
    { codigo: "R1", data: "", pedido: "Fechar o escopo, fixar e justificar as ferramentas, separar o baseline do autor, usar pelo menos dois modelos, estimar tokens e custo.", feito: "Escopo reduzido a três módulos, ferramentas fixas e um analista especialista como baseline. Sonnet 4.6 e Llama, com custo estimado em cerca de US$ 0,92." },
    { codigo: "R2", data: "", pedido: "Justificar cada ferramenta, definir os domínios, avaliar a engenharia de prompt e estimar o custo do modelo pago.", feito: "Alvos definidos e comparação entre few-shot e chain-of-thought, a cerca de US$ 0,023 por execução no Sonnet." },
    { codigo: "R3", data: "", pedido: "Duas execuções não têm significância: usar 10, 20 ou 30, e comparar custo e consumo de tokens.", feito: "20 execuções por combinação e uma tabela de custo por execução para Opus, Sonnet e Llama." },
    { codigo: "R4", data: "27/10", pedido: "Relacionar as dependências das fontes, desenhar o fluxograma, medir a confiança e dizer qual fonte é a melhor.", feito: "Fluxograma com a natureza de cada fonte, scorecard de quatro eixos e corroboração cruzada. O pipeline deixou de ser chamado de 100% passivo." },
    { codigo: "R5", data: "03/11", pedido: "Transformar a confiança em número, enxugar o contexto, recoletar o alvo que caiu e rodar o M3.", feito: "Scorecard medido, com oito notas revistas, e filtro de contexto de 11,6 mil para 3,5 mil tokens. No teste de fumaça o Sonnet recusou e a Groq deixou de servir o Llama, que passou a rodar local." },
    { codigo: "R6", data: "10/11", pedido: "Decidir o braço Claude, escolher um segundo modelo aberto, rodar o experimento e montar o baseline humano.", feito: "Recusa mantida como resultado e Qwen 2.5 7B como segundo modelo. As 320 execuções rodaram em cerca de 3,8 h de CPU, sem erro de formato, e o M4 ficou pronto." },
    { codigo: "R7", data: "12/11", pedido: "Desenhar as fases do pentest, as fontes do subfinder e o mapa dos hosts; declarar modelos e limites; julgar a verificabilidade com mais precisão; comparar as técnicas e estimar o custo.", feito: "Organograma pelo PTES, recoleta do subfinder com a fonte de cada nome, mapa dos 2.491 hosts, tabelas de modelos e limites, régua de 0 a 8 e custo das 320 execuções." },
  ],
};

export const video = {
  titulo: "O projeto em vídeo",
  texto:
    "Uma retrospectiva animada do projeto, com narração gerada pela ElevenLabs e legendas. A identidade visual do vídeo é outra, porque ele foi feito como peça à parte.",
  arquivo: "/video/reconai-resumo.mp4",
  legenda: "/video/reconai-resumo.vtt",
  poster: "/video/reconai-resumo.webp",
  duracao: "1 min 27 s",
  nota: "A versão atual tem 1 min 27 s. A versão de até 3 minutos, com as cenas da Rodada 7, entra aqui quando a narração nova estiver pronta.",
};

export const obras = {
  titulo: "Em obras",
  intro: "Falta a estação que dá sentido à linha inteira: saber se as hipóteses prestam.",
  lista: [
    { titulo: "Baseline humano", texto: "Um analista especialista, que não é o autor, lê os mesmos contextos e escreve as próprias hipóteses, com o tempo cronometrado." },
    { titulo: "Avaliação cega", texto: "Um avaliador que não escreveu o baseline julga o conjunto embaralhado de hipóteses dos modelos e do humano." },
    { titulo: "Métrica final", texto: "Porcentagem de hipóteses válidas por fonte, tempo de produção do humano contra a latência do LLM e variação entre execuções." },
    { titulo: "Frescor da Censys", texto: "Uma coleta com crédito, para saber a idade real do dado herdado." },
  ],
};

export const rodape = {
  linha1: "ReconAI é o projeto de Elton Lunardi na disciplina Laboratório de Inteligência Artificial Aplicada (LIAA), Mestrado Profissional em Computação Aplicada, 2026.",
  linha2: "Todo reconhecimento foi feito contra alvos públicos de teste ou de forma passiva, para uso em pentest autorizado. O LLM não coleta nada: só interpreta dados que já foram coletados.",
  repositorio: "Código e dados do site no GitHub",
};
