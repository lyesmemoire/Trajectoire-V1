#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT_DIR="${ROOT_DIR}/out"

echo "=== Lancement du Pipeline de Certification SLSA Hermétique ==="

# Préparation du répertoire de sortie
mkdir -p "$OUT_DIR"
# Facultatif : Vider le répertoire de sortie avant exécution pour éviter des reliquats
# rm -rf "$OUT_DIR"/* 

# Lancement via Docker Compose
# Le build est fait à chaque fois pour intégrer le code courant
cd "$ROOT_DIR"
docker-compose -f certification/docker/docker-compose.yml build
docker-compose -f certification/docker/docker-compose.yml up --abort-on-container-exit

echo ""
echo "=== Vérification des Artefacts SLSA ==="
if [ -f "$OUT_DIR/manifest.json" ]; then
    echo "✅ Le manifeste a été généré avec succès dans ./out/manifest.json"
    
    if [ -f "$OUT_DIR/slsa-provenance.json" ]; then
        echo "✅ L'attestation de provenance SLSA a été générée :"
        jq . "$OUT_DIR/slsa-provenance.json"
    else
        echo "❌ ERREUR: L'attestation SLSA n'a pas été trouvée."
    fi
else
    echo "❌ ERREUR: Le manifeste n'a pas été généré."
fi
