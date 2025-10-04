#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-src}"

OS="$(uname)"

run_sed() {
  # usage: run_sed -e "s#old#new#g" -- file
  if [ "$OS" = "Darwin" ]; then
    sed -E -i '' "$@"
  else
    sed -E -i "$@"
  fi
}

# Liste des stores à renommer: useXxxStore -> useXxx
NAMES="\
Ecoles
Students
Teachers
Cours
Devoirs
Examens
Interros
Evaluations
Presences
Seances
Periodes
Users
Classes
BulletinsMeta
"

echo "🔎 Recherche des fichiers dans ${ROOT_DIR}…"

FILES_FOUND=0

# Parcours des fichiers (nul-delimited pour gérer espaces)
while IFS= read -r -d '' f; do
  FILES_FOUND=1
  for name in $NAMES; do
    # 1) Chemins d'import : stores/useXxxStore  -> stores/useXxx
    run_sed -e "s#([\"'/])stores/use${name}Store([\"'])#\1stores/use${name}\2#g" -- "$f"

    # 2) Identifiants dans le code : useXxxStore(  -> useXxx(
    run_sed -e "s/(^|[^A-Za-z0-9_])use${name}Store([^A-Za-z0-9_]|$)/\1use${name}\2/g" -- "$f"
  done
done < <(find "$ROOT_DIR" -type f \( -name '*.vue' -o -name '*.js' -o -name '*.ts' -o -name '*.tsx' -o -name '*.jsx' \) -print0)

if [ "$FILES_FOUND" -eq 0 ]; then
  echo "Aucun fichier .vue/.js/.ts/.tsx/.jsx trouvé dans ${ROOT_DIR}."
  exit 0
fi

echo "✅ Remplacements terminés."

echo "📋 Usages restants de useSomethingStore (s'il en reste) :"
if ! grep -RIn -E 'use[A-Za-z]+Store' "$ROOT_DIR"; then
  echo "— aucun —"
fi

echo "💡 Pense à lancer 'npm run build'."
