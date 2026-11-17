# A tabela de confiança questionada por uma IA

Pedido do professor na Rodada 7 (12/11/2026): depois de montar a tabela, pedir a um bom modelo que a questione (as características bastam? as ponderações estão adequadas?), e fazer isso sempre.

- **Modelo:** Claude Opus 5.5 (Anthropic), em sessão nova, sem o histórico do projeto e sem ferramentas: só o material abaixo.
- **Data:** 17/11/2026.
- **Material enviado:** a tabela exatamente como está publicada no site (origens, eixos, scorecard medido, medições de apoio e a régua R/A/O/E).
- **Resposta:** transcrita sem edição de conteúdo; só a formatação das listas foi ajustada.

## Prompt

> Você é um revisor cético, especialista em OSINT, reconhecimento para pentest e metodologia de pesquisa. Não use ferramentas: responda só a partir do material abaixo. [...]
>
> Contexto: um projeto de mestrado (ReconAI) faz reconhecimento passivo "com baixo contato" de um domínio (shopify.com e alvos de teste), agrupa os hosts e manda o contexto a um LLM, que gera hipóteses de ataque. O autor montou uma tabela de confiança das fontes de dados. O orientador pediu: "depois de montar a tabela, peça a um bom modelo que a questione: as características bastam? as ponderações estão adequadas?". Sua tarefa é exatamente essa: questionar a tabela com rigor, apontando o que está errado, faltando, mal ponderado ou mal medido. Não seja educado à toa: o valor está nas críticas que um pedido comum não traria. Mas também diga, no fim, o que está bem resolvido e deve ficar.
>
> [material da tabela, como publicado no site em 17/11/2026]
>
> O QUE ENTREGAR: 1. "Perguntas que a tabela não responde": de 5 a 8 críticas numeradas, cada uma com a crítica, por que importa no pentest e uma mudança concreta e verificável. Inclua obrigatoriamente uma resposta direta a "as características (eixos) bastam?" e outra a "as ponderações estão adequadas?". 2. "Onde as notas parecem erradas". 3. "O que está bem e deve ficar". No máximo 900 palavras.

## Resposta

### 1. Perguntas que a tabela não responde

**1. Os eixos bastam? Não. Falta acurácia.** Nenhum eixo mede se o dado está certo. O rendimento mede se a fonte respondeu e a verificabilidade mede se daria para checar, mas ninguém checou.
- Por que importa: no pentest, o custo está na hipótese falsa (host morto, versão errada). É justamente isso que a tabela não estima.
- Mudança: medir a precisão de cada fonte contra um verificador que já existe no pipeline: a % dos nomes de cada fonte primária do subfinder que o dnsx resolve; a % das tecnologias da Censys que o httpx confirma; uma amostra de 30 CVEs com o casamento de CPE conferido à mão.

**2. As ponderações estão adequadas? Não existem, e a soma implícita é a pior escolha.** Com quatro eixos lado a lado, o leitor (e o LLM) pondera como quiser. A régua nova repete o problema ao somar R+A+O+E com pesos iguais.
- Por que importa: o subfinder (rendimento Alto, verificabilidade Baixa) parece "meio bom", mas 89% do que ele entrega não pode ser auditado.
- Mudança: ponderar por regras em ordem de prioridade, sem média: acurácia e verificabilidade funcionam como portão (abaixo do mínimo, o dado entra como "não confirmado" e não sustenta hipótese sozinho); o frescor vira um decaimento que depende do tipo de dado; o rendimento só desempata. Na régua, criar um teto: R=0 ou E=0 limita a nota a Média. Depois, calibrar contra as hipóteses confirmadas nos alvos de teste.

**3. A nota é dada por fonte, mas o LLM consome registros.** O "subfinder" junta sob uma nota só o crt.sh (8/8 na própria régua) e o VirusTotal (inauditável).
- Por que importa: um nome vindo de CT e um vindo do VT chegam ao prompt com o mesmo peso.
- Mudança: pôr uma etiqueta em cada registro do contexto (fonte primária, data, artefato). A confiança da hipótese passa a ser a do elo mais fraco da cadeia: nome → DNS → HTTP → CVE → EPSS. Em seguida, fazer uma ablação: rodar o prompt com e sem as etiquetas e contar quantas hipóteses mudam. Se nada mudar, a tabela é documentação e não faz parte do método.

**4. O frescor está n/d justamente onde importa.** No httpx e no dnsx ele é 0 d por construção. O eixo só diferencia as fontes herdadas, e nelas está vazio.
- Por que importa: um IP antigo da Censys pode virar alvo de hipótese sem que ninguém saiba a idade do dado.
- Mudança: a Censys traz data de observação por serviço e o crt.sh traz `not_before` e `entry_timestamp`; cruzar a idade do certificado com a resolução no dnsx para os 304 nomes do crt.sh dá uma curva de decaimento, que justifica os limiares (hoje 1 e 30 dias são arbitrários e valem igual para IP e CVE). Cuidado: dado velho não é inútil. Um CNAME pendurado é candidato a subdomain takeover, então o frescor não deve só penalizar.

**5. "Origem" mistura duas coisas: o contato com o alvo e a natureza da inferência.** A "Primeira mão" é a mais confiável e também a que quebra o "baixo contato".
- Por que importa: o risco operacional (OPSEC, autorização) e a confiança no dado são decisões separadas.
- Mudança: dividir em dois eixos: Contato (nenhum, infraestrutura de terceiros, alvo) e Natureza (observação, correlação, modelo).

**6. No shopify, a "primeira mão" observa a borda da CDN, não a aplicação.**
- Por que importa: um CVE tirado da versão da borda vira hipótese contra o ativo errado. E o Jaccard de 0,855 pode só estar mostrando que as duas ferramentas enxergam a mesma CDN.
- Mudança: classificar os IPs por ASN (CDN ou próprio) e recalcular rendimento, Jaccard e CVEs só nos IPs que não são de CDN.

**7. Os números não sustentam as faixas.** O "Baixa 23,2%" da Censys é um limite inferior: o valor real pode ser qualquer um acima, e a nota honesta é "indeterminada". O Jaccard foi calculado em 19 IPs e não tem intervalo. "23% dos IPs com software" parece ser a mesma medida do rendimento, contada duas vezes. O denominador muda de linha para linha, então os rendimentos não se comparam.
- Mudança: escrever numerador e denominador em cada linha, publicar o n com intervalo (Wilson para proporção, bootstrap para Jaccard) e fazer uma recoleta na Censys registrando os IPs consultados.

### 2. Onde as notas parecem erradas

- **NVD, verificabilidade Alta (3/3 e 2/1/2/2):** a nota avalia o registro do CVE, mas a afirmação que entra no pipeline é "esta versão tem este CVE". O casamento de CPE (backport de distribuição, CVE sem CPE pelo atraso da NVD) não se verifica pelo registro. Separar "registro NVD" (Alta) de "correlação versão→CVE" (no máximo Média).
- **EPSS:** o scorecard dá Baixa, mas a régua nova soma 2+1+1+0 = 4, que é Média. Escolher uma das duas e explicar. E o rendimento de 100% é trivial, porque o EPSS pontua todo CVE publicado: deveria ser n/a.
- **httpx, E=2:** só vale se o pipeline guarda a resposta bruta. Se guarda só as tags de tecnologia, a nota é 0 ou 1. Pela mesma lógica, o dnsx com E=1 sobe para 2 se o registro DNS bruto for salvo.
- **dnsx, A=0:** em zona com DNSSEC a resposta vem assinada. Testar com `dig +dnssec` e dar A≥1 onde houver RRSIG válido.
- **Censys, E=1:** a Censys devolve banner e certificado brutos. Se o pipeline os guarda, a nota é 2.
- **Subfinder, rendimento Alta:** os 88,5% vêm de um volume em que 89% é VirusTotal. Reportar por fonte primária.
- **Critério A da régua:** "assinado e só de acréscimo" descreve exatamente o CT. O critério parece ter sido desenhado a partir do caso.

### 3. O que está bem e deve ficar

- A troca da nota por julgamento pela nota medida, com a anterior entre parênteses.
- A recusa em chamar rendimento de cobertura.
- A medição de independência entre fontes (HackerTarget dentro do DNSDumpster; só 4,2% dos nomes em duas fontes). Merece virar um eixo de corroboração, em que fontes que não são independentes contam como uma só.
