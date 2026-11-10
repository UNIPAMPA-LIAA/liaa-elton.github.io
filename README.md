# liaa-elton.github.io

Site do projeto **ReconAI**, de Elton Lunardi, na disciplina Laboratório de
Inteligência Artificial Aplicada (LIAA). Apresenta o contexto, o problema, a
proposta e a evolução do projeto ao longo do semestre.

HTML, CSS e JS puros, sem etapa de build. O GitHub Pages serve os arquivos como estão.

```
index.html              conteúdo
assets/style.css        visual (tema claro e escuro)
assets/app.js           grade do experimento, resultados, modo apresentação
data/experimento.js     dados do experimento (gerado, não editar à mão)
tools/atualizar_dados.py  gera data/experimento.js a partir de results/
```

## Atualizar os números do experimento

O script lê `results/execucoes.csv` do projeto (e, quando existirem,
`results/humano/*.json` e `results/avaliacao_cega_*.csv`):

```bash
python3 tools/atualizar_dados.py --projeto ..   # pasta que contém results/
git commit -am "Atualiza dados do experimento" && git push
```

## Modo apresentação

Tecla **P** (ou o botão no topo): cada seção vira um slide em tela cheia.
Setas ou PageUp/PageDown navegam, Esc sai. Funciona também abrindo o
`index.html` direto do disco, sem internet para tudo exceto as fontes.

## Publicar no GitHub Pages

Um site `<nome>.github.io` precisa de uma conta (ou organização) do GitHub
chamada `liaa-elton` e de um repositório com o mesmo nome do site:

1. Criar a conta ou organização `liaa-elton` no GitHub.
2. Criar o repositório público `liaa-elton.github.io`.
3. Nesta pasta:
   ```bash
   git init -b main
   git add .
   git commit -m "Site do projeto ReconAI"
   git remote add origin https://github.com/liaa-elton/liaa-elton.github.io.git
   git push -u origin main
   ```
4. Em *Settings → Pages*, fonte: *Deploy from a branch*, `main`, pasta `/ (root)`.
   Em um ou dois minutos o site fica em https://liaa-elton.github.io.
