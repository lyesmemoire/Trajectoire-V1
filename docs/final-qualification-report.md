# Rapport de Qualification Final v1.0

## 1. Périmètre
Le présent document certifie la qualification de la **Chaîne de Certification Trajectoire** dans sa version 1.0. Le périmètre inclut l'intégralité du pipeline de build hermétique (`certify.cjs`) et le mécanisme d'évaluation externe "Zero-Trust" (`independent-lab.cjs`).

## 2. Hypothèses de Sécurité
- Le code source extrait depuis le SCM (Git) n'est pas réputé sûr, c'est pourquoi il est audité systématiquement (CVE, secrets).
- L'infrastructure d'intégration continue (runner) n'est pas digne de confiance absolue ; les garanties d'intégrité reposent sur l'horodatage et la signature cryptographique (Sigstore, Ed25519) des preuves produites.
- Les dépendances cryptographiques (Sigstore, OIDC) sont administrées par des tiers dignes de confiance.

## 3. Dépendances & Standards Intégrés
- **SLSA v1.0** : Standard officiel de Provenance (Builder, RunDetails).
- **in-toto v0.1** : Standard pour la validation du "Statement" et de l'intégrité de la supply chain.
- **DSSE (Dead Simple Signing Envelope)** : Encapsulation des signatures.
- **CycloneDX / SPDX** : Formats pour les nomenclatures logicielles (SBOM).
- **Ajv (JSON Schema)** : Moteur de validation stricte.
- **Cosign (Sigstore)** : Fournisseur de signature OIDC/Rekor de référence pour l'environnement de production.

## 4. Versions Gelées (Architecture)
Suite à cette qualification, les formats suivants sont considérés comme **GELÉS** et immuables pour la version 1.x afin de garantir l'interopérabilité :
- Formats JSON des preuves (`manifest.json`, `audit-cve.json`, `snapshot.json`).
- Profils déclarés (`trajectoire-provenance-v1`).
- Moteur de politique `signature.json` (structure et règles `allowMockProviders`, `minCount`).
- Structure du cycle de vie des clés (`trusted-keys.json`).
- Grille des 25 contrôles d'audit `L-001` à `L-025`.

## 5. Campagnes de Tests & Résultats
La chaîne a validé avec succès l'ensemble de la campagne de tests :
- **Audit de Déterminisme** : Le générateur de Snapshot produit rigoureusement la même empreinte SHA pour des exécutions répétées (normalisation Epoch).
- **Red Team / Bypass** : Toutes les attaques par mutation de graphe, corruption de hash, ou soumission de mock cryptographique en mode production ont été bloquées formellement par le laboratoire.
- **Interopérabilité** : Un artefact généré par Trajectoire peut être vérifié avec succès par `cosign verify-blob` et `slsa-verifier` sans le code source originel.

## 6. Limites Connues (Hors v1.0)
Les sujets suivants ont été consciemment écartés de cette V1 pour limiter la complexité et maximiser l'interopérabilité :
- Hardware Security Modules (HSM physiques locaux).
- Confidential Computing (Enclaves SGX, attestations matérielles).
- AppArmor / Profils SELinux spécifiques imposés par le builder.

## 7. Évolutions Prévues
Les futures versions (v1.x, v2.x) se concentreront de manière additive sur :
- L'ajout de nouveaux fournisseurs de signatures (KMS additionnels, Vault).
- La mise à niveau des standards (nouvelles versions SLSA, SPDX).
- L'intégration de plateformes CI additionnelles (GitLab OIDC, Azure).

---
**Statut de Qualification :** `APPROUVÉ`
**Niveau d'Assurance :** `SLSA Level 3 - Architecture Interopérable`
