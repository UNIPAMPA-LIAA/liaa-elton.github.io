#!/usr/bin/env bash
# Gera o site e copia para o repositório do GitHub Pages.
# Raiz do repositório = site pronto (out/). fonte/ = código-fonte, sem node_modules nem builds.
# Não faz commit nem push: isso fica com quem publica.
set -euo pipefail

ORIGEM="$(cd "$(dirname "$0")/.." && pwd)"
DESTINO="${1:-$HOME/Área de trabalho/Mestrado/LIAA/liaa-elton.github.io}"

[ -d "$DESTINO/.git" ] || { echo "Não achei o repositório em: $DESTINO" >&2; exit 1; }

cd "$ORIGEM"
npx next build

# Site pronto na raiz. --delete apaga o site antigo, mas preserva o .git, o README e a pasta fonte/.
rsync -a --delete \
  --exclude '.git/' --exclude 'README.md' --exclude 'fonte/' \
  out/ "$DESTINO/"
touch "$DESTINO/.nojekyll"   # sem isso o GitHub Pages ignora a pasta _next/

# Código-fonte em fonte/.
rsync -a --delete \
  --exclude '.git/' --exclude 'node_modules/' --exclude '.next/' --exclude 'out/' \
  --exclude 'public/video/' --exclude '.impeccable/review/' --exclude 'RETOMAR.md' \
  --exclude 'next-env.d.ts' \
  "$ORIGEM/" "$DESTINO/fonte/"

echo "Copiado para $DESTINO. Confira com: git -C \"$DESTINO\" status"
