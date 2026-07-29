# Third-Party Verification Guide

L'architecture de certification Trajectoire est conçue pour être **100% interopérable** avec l'écosystème open-source standard (SLSA, in-toto, Sigstore).

Un auditeur ou un consommateur n'a **pas besoin d'exécuter le code Trajectoire** pour vérifier la provenance des artefacts. Les outils standards de l'industrie suffisent.

Ce document détaille les commandes exactes permettant de vérifier les preuves générées par le pipeline de build hermétique.

---

## 1. Vérification avec `slsa-verifier`

L'outil officiel `slsa-verifier` permet de vérifier que l'artefact a bien été produit par le pipeline attendu et que la provenance n'a pas été altérée.

### Prérequis
- Télécharger [`slsa-verifier`](https://github.com/slsa-framework/slsa-verifier/releases)

### Commande de vérification
```bash
slsa-verifier verify-artifact <chemin/vers/artefact> \
  --provenance-path provenance/provenance.dsse.json \
  --source-uri <URI_du_depot_git>
```

> [!TIP]
> `slsa-verifier` décode l'enveloppe DSSE, valide la signature cryptographique Sigstore/OIDC, puis vérifie le Statement in-toto et le Predicate SLSA v1.0.

---

## 2. Vérification avec `cosign`

`cosign` est l'outil standard du projet Sigstore. Il permet de vérifier les signatures générées en mode OIDC Keyless, ainsi que les signatures apposées par des clés statiques (comme Ed25519 ou AWS KMS).

### Prérequis
- Installer [`cosign`](https://docs.sigstore.dev/system_config/installation/)

### Vérification d'un Blob (Manifeste ou Archive)
Si le pipeline a signé le manifeste global avec une clé OIDC :
```bash
cosign verify-blob manifest.json \
  --bundle manifest.sig.json \
  --certificate-identity <URI_OIDC_attendu> \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

### Vérification d'une Attestation in-toto (DSSE)
Si la DSSE a été signée en mode Keyless (CI/CD) :
```bash
cosign verify-attestation \
  --type slsaprovenance \
  --certificate-identity <URI_OIDC_attendu> \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  <chemin/vers/artefact>
```

### Vérification avec clé locale (Ed25519)
Si vous validez une archive générée localement en mode développement :
```bash
cosign verify-blob manifest.json \
  --signature manifest.sig.json \
  --key trajectoire.pub
```

---

## 3. Validation des Schémas (Optionnel)

Les artefacts respectent scrupuleusement les schémas officiels. Vous pouvez utiliser `ajv-cli` pour valider les structures JSON indépendamment de toute signature.

```bash
# Valider la DSSE
ajv validate -s schemas/dsse.schema.json -d provenance/provenance.dsse.json

# Extraire et valider l'attestation in-toto
cat provenance/provenance.dsse.json | jq -r '.payload' | base64 -d > statement.json
ajv validate -s schemas/intoto-statement.schema.json -d statement.json
```

> [!IMPORTANT]
> **Zero-Trust** : Ne validez jamais le contenu (schémas, hash) d'un document avant d'avoir vérifié cryptographiquement sa signature (DSSE). Une signature invalide rend le contenu caduc.
