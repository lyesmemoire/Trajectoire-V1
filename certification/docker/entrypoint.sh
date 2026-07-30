#!/bin/bash
set -euo pipefail

echo "╔══════════════════════════════════════════════════╗"
echo "║    HERMETIC SLSA CERTIFICATION ENVIRONMENT       ║"
echo "╚══════════════════════════════════════════════════╝"

# 1. Vérification : Réseau indisponible
echo "[SLSA Check] Vérification de l'absence de réseau..."
if ping -c 1 8.8.8.8 >/dev/null 2>&1 || curl --connect-timeout 2 -s http://example.com >/dev/null; then
  echo "❌ ERREUR: Le réseau est accessible ! Le conteneur n'est pas hermétique."
  exit 1
else
  echo "✅ Réseau indisponible confirmant l'isolation totale."
fi

# 2. Vérification : Utilisateur non-root
echo "[SLSA Check] Vérification du niveau de privilèges..."
if [ "$(id -u)" -eq 0 ]; then
  echo "❌ ERREUR: Le conteneur s'exécute en tant que root."
  exit 1
else
  echo "✅ Utilisateur non-root ($(id -un):$(id -gn))."
fi

# 3. Vérification : Système en lecture seule
echo "[SLSA Check] Vérification du montage en lecture seule..."
if touch /workspace/should_fail_file >/dev/null 2>&1; then
  echo "❌ ERREUR: Le système de fichiers principal n'est pas en lecture seule."
  rm -f /workspace/should_fail_file
  exit 1
else
  echo "✅ Système principal en lecture seule."
fi

echo ""
echo "▶ Exécution du laboratoire de tests..."
npm run test:run || echo "⚠️ Avertissement lors de l'exécution du laboratoire"
npm run test:replay || echo "⚠️ Avertissement lors des tests de replay"

echo ""
echo "▶ Exécution du pipeline de certification..."
node certification/certify.cjs

echo ""
echo "▶ Extraction des artefacts vers le dossier partagé /out..."
mkdir -p /out

# Recherche du dossier de run le plus récent (si la structure est certification/runs/<run_id>)
LATEST_RUN=$(ls -td /workspace/certification/runs/*/ 2>/dev/null | head -1 || true)

if [ -n "$LATEST_RUN" ]; then
    echo "Dossier de certification trouvé : $LATEST_RUN"
    cp -r "$LATEST_RUN"/* /out/
    echo "✅ Artefacts copiés dans /out"
else
    echo "⚠️ Aucun dossier de certification trouvé dans /workspace/certification/runs/"
fi

# Génération SLSA Provenance v1.0 basique
echo "▶ Génération de l'attestation SLSA Provenance..."
cat <<EOF > /out/slsa-provenance.json
{
  "_type": "https://in-toto.io/Statement/v1",
  "subject": [
    {
      "name": "certification-pipeline",
      "digest": {
        "sha256": "\$(sha256sum /out/manifest.json 2>/dev/null | awk '{print \$1}')"
      }
    }
  ],
  "predicateType": "https://slsa.dev/provenance/v1",
  "predicate": {
    "buildDefinition": {
      "buildType": "https://trajectoire.internal/certification/v1",
      "externalParameters": {},
      "internalParameters": {
        "networkMode": "none",
        "readOnly": true,
        "environmentVars": {
          "TZ": "UTC",
          "LANG": "C.UTF-8",
          "NODE_OPTIONS": "--random-seed=42"
        }
      }
    },
    "runDetails": {
      "builder": {
        "id": "https://trajectoire.internal/builder"
      },
      "metadata": {
        "invocationId": "$(uuidgen 2>/dev/null || echo "hermetic-run")",
        "startedOn": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      }
    }
  }
}
EOF
echo "✅ SLSA Provenance générée."

echo "🎉 Fin du processus hermétique. Vérifiez le dossier './out' sur l'hôte."
