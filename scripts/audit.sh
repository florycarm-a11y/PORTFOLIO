#!/usr/bin/env bash
# Audit rapide du portfolio avant déploiement

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
errors=0

echo "=== Audit du portfolio ==="

# Vérifier que les fichiers essentiels existent
for f in index.html css/style.css js/main.js data/projects.json; do
    if [ ! -f "$f" ]; then
        echo -e "${RED}MANQUANT${NC} $f"
        errors=$((errors + 1))
    else
        echo -e "${GREEN}OK${NC} $f"
    fi
done

# Vérifier que le JSON des projets est valide
if command -v python3 &>/dev/null; then
    if python3 -m json.tool data/projects.json >/dev/null 2>&1; then
        echo -e "${GREEN}OK${NC} data/projects.json est un JSON valide"
    else
        echo -e "${RED}ERREUR${NC} data/projects.json n'est pas un JSON valide"
        errors=$((errors + 1))
    fi
fi

# Vérifier qu'aucun secret n'est présent
for pattern in ".env" "*.key" "credentials.json"; do
    found=$(find . -name "$pattern" -not -path './.git/*' 2>/dev/null)
    if [ -n "$found" ]; then
        echo -e "${RED}SECRET DÉTECTÉ${NC} $found"
        errors=$((errors + 1))
    fi
done

# Vérifier que CLAUDE.local.md n'est pas tracké
if git ls-files --error-unmatch CLAUDE.local.md 2>/dev/null; then
    echo -e "${RED}ERREUR${NC} CLAUDE.local.md est tracké par git"
    errors=$((errors + 1))
else
    echo -e "${GREEN}OK${NC} CLAUDE.local.md n'est pas tracké"
fi

echo ""
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}Audit réussi — 0 erreur${NC}"
else
    echo -e "${RED}Audit échoué — $errors erreur(s)${NC}"
    exit 1
fi
