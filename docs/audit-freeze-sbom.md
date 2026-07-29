# SBOM Audit Freeze Record

**Version du Sous-Système :** 1.0.0 (Gelé)
**Date de Gel :** 2026-07-29
**Cible d'Audit :** Génération, Normalisation, Canonicalisation et Vérification Indépendante (Zero Trust) du SBOM.

## 1. Composants Inclus
- `certification/sbom.cjs` : Génération et Canonicalisation.
- `certification/normalize-sbom.cjs` : Profil de normalisation (v1).
- `certification/sign.cjs` : Signature cryptographique.
- `certification/test-sbom-determinism.cjs` : Démonstrateur de déterminisme.
- `laboratory/independent-lab.cjs` : Vérification Zero-Trust et rapport Lockfile.
- `laboratory/independent-normalize-sbom.cjs` : Implémentation en salle blanche de la normalisation.

## 2. Schémas et Standards Utilisés
- **CycloneDX** : Version 1.5 (Schéma officiel validé via AJV).
- **SPDX** : Version 2.3 (Schéma officiel validé via AJV).
- **JSON Canonicalization** : RFC 8785 (Implémenté via `json-canonicalize`).

## 3. Politique Cryptographique (CryptoPolicy v1.0)
- **Fonction de Hachage** : SHA-256
- **Algorithme de Signature** : Ed25519
- **Cible de Signature** : `SHA-256(RFC8785(JSON))`
- *Note : Toute variation d'espace, d'indentation ou d'ordre des clés JSON n'affectera pas la validité de la signature.*

## 4. Hypothèses Retenues
- L'outil de génération (`cdxgen`) est présumé produire un graphe de dépendances exact. La complétude est vérifiée exhaustivement par le laboratoire via le `pnpm-lock.yaml`.
- Les horodatages temporels (timestamps) et identifiants uniques générés localement (UUIDs de namespaces) n'ont pas de valeur cryptographique pour le SBOM final et sont intentionnellement purgés pour garantir le déterminisme strict.
- La structure de l'environnement hermétique (Docker) est présumée isolée et sans réseau lors de la génération.

## 5. Limites Connues
- La vérification du Lockfile dépend de la syntaxe spécifique de `pnpm-lock.yaml` (v9+). Un changement de gestionnaire de paquets nécessitera une mise à jour de l'analyseur.
- La validation des licences dans le SBOM n'est pas encore interfacée avec le module de sécurité global (prévu dans le cadre du prochain chantier).

## 6. Critères de Dégel (Unfreeze Triggers)
Ce sous-système est déclaré **GELÉ**. Aucune modification architecturale ne doit y être apportée sauf si l'un des déclencheurs suivants est activé :
1. **Évolution Réglementaire** : Le NIST ou une entité équivalente mandate l'usage obligatoire de CycloneDX 1.6+ ou de SPDX 3.0+.
2. **Transition Cryptographique** : La politique de sécurité interne exige le passage à SHA-512 ou à un algorithme post-quantique.
3. **Vulnérabilité Tooling** : Découverte d'une faille critique (CVE) dans `cdxgen`, `ajv`, ou `json-canonicalize` nécessitant une refonte de l'intégration.
4. **Changement Majeur d'Écosystème** : Migration vers un autre gestionnaire de paquets (ex: Bun) entraînant l'incompatibilité de l'analyse du lockfile.
