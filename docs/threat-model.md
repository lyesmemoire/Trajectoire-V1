# Modélisation des Menaces (Threat Model)

Ce document décrit le modèle de menace de la chaîne de confiance Trajectoire selon une approche "Zero-Trust". Il établit le lien entre les risques supply chain et les contrôles mis en œuvre par le laboratoire indépendant.

## Actifs (Assets)
- Code source (dépôt Git).
- Artefacts de build (Binaires, Conteneurs).
- Preuves (SBOM, Résultats d'audit, Traces de tests).
- Clés cryptographiques (Sigstore OIDC, Ed25519, KMS).

## Hypothèses de Confiance (Trust Boundaries)
1. **L'environnement de Build N'EST PAS digne de confiance.** Tout rapport généré par le build doit être considéré comme potentiellement falsifié jusqu'à sa vérification.
2. **Le Dépôt Git (SCM) EST partiellement digne de confiance.** Il est la source de vérité, mais son intégrité doit être prouvée via SHA.
3. **Le Registre de Clés (PKI / OIDC) EST digne de confiance.** Les fournisseurs d'identité (GitHub, AWS, Fulcio) sont hors périmètre d'attaque.
4. **Le Laboratoire EST digne de confiance.** Il opère dans un environnement hermétique et indépendant.

## Menaces & Contrôles

| Identifiant Menace | Description | Actif Ciblé | Mécanisme de Défense | Contrôle Lab |
|--------------------|-------------|-------------|----------------------|--------------|
| **T-01** | Falsification d'une preuve ou d'un artefact pendant/après le build. | Artefacts / Preuves | Utilisation d'Enveloppes DSSE signées et vérification des condensats SHA256. | L-001, L-002, L-004 |
| **T-02** | Remplacement d'une preuve par un fichier structurellement invalide ou corrompu. | Preuves | Validation formelle des schémas officiels (Ajv) avant et pendant l'audit. | L-023, L-024 |
| **T-03** | Utilisation d'une clé compromise, expirée, ou non autorisée pour signer le manifeste. | Clés | Interrogation stricte du `trusted-keys.json` et rejet de tout `execution.mode: mock` en prod. | L-021, L-022 |
| **T-04** | Vulnérabilités critiques injectées silencieusement (Supply Chain Attack). | Dépendances | Analyse CVE intégrée refusant systématiquement le build en cas de faille Critique/Haute. | L-017, L-019 |
| **T-05** | Altération du graphe d'exécution pour cacher des actions non autorisées. | Traces de build | Vérification mathématique du DAG (pas de cycles, pas de sommets orphelins isolés). | L-006, L-007, L-008 |
| **T-06** | Suppression volontaire d'artefacts compromettants de l'archive d'audit. | Preuves | Manifeste global référençant le graphe total, complété par le contrôle d'intégrité de l'archive Snapshot. | L-005, L-025 |

## Synthèse
Le système est robuste face aux altérations de surface et aux attaques internes sur le runner CI. L'attaquant doit compromettre *à la fois* l'infrastructure de build pour modifier le payload, *et* l'infrastructure OIDC/PKI (externe) pour regénérer une signature valide et un horodatage Rekor correct. Sans ces deux facteurs simultanés, le laboratoire `independent-lab.cjs` rejettera l'artefact.
