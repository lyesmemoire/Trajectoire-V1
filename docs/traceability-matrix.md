# Matrice de Traçabilité des Contrôles

Cette matrice référence formellement chaque point de contrôle implémenté par le `independent-lab.cjs`, et le relie à la menace couverte, au type de test ou d'évaluation appliqué, ainsi qu'à la politique régissant ce contrôle.

| Contrôle | Menace Couverte | Évaluation / Test appliqué | Politique / Standard cible |
|----------|-----------------|----------------------------|----------------------------|
| **L-001** | Falsification manifeste | Empreinte (Self-hash SHA256) | RFC 6234 (SHA-256) |
| **L-002** | Corruption Enveloppe | Structure `signatures` et `payload` | DSSE Specification |
| **L-003** | Injection de type inattendu | Vérification `payloadType` exact | SLSA v1.0 Provenance |
| **L-004** | Altération DSSE | Cryptographie : Validation Base64 & Digest | in-toto ITE-6 |
| **L-005** | Perte d'intégrité de la Trace | Hash matching avec le Manifeste | Trajectoire Manifest v1 |
| **L-006** | Fausse trace d'exécution | Détection de cycles (DFS) | Graph Theory DAG |
| **L-007** | Processus isolés cachés | Rejet des nœuds orphelins (Indegree/Outdegree) | ZTA Execution |
| **L-008** | Détournement d'IO | Validation cohérence Entrées/Sorties | Data Flow |
| **L-009** | Substitution de ressource | Validation Hash sur ressources | in-toto ITE-6 |
| **L-013** | Document non approuvé | Comptage strict de présences de signatures | `signature.json` (minCount) |
| **L-017** | Supply Chain Attack (Failles) | Analyse stricte `audit-cve.json` | `security.json` |
| **L-019** | Supply Chain Attack (Binaires)| Analyse stricte dépendances & hash | SBOM CycloneDX/SPDX |
| **L-021** | Faux environnement (Mock) | Vérification `execution.mode` vs Politique | `signature.json` (allowMock) |
| **L-022** | Clé Révoquée / Expirée | Lecture et croisement `status`, `notAfter` | `trusted-keys.json` |
| **L-023** | Schéma invalide / Format | Ajv validator (SLSA 1.0, Statement 0.1) | `schemas/` (JSON Schema) |
| **L-024** | Profil incompatible | Analyse sémantique des tags et profils | `profiles/` |
| **L-025** | Complétude des Preuves | Moteur d'audit comparant requis vs présent | SLSA Level 3 complet |

Cette matrice est le document de référence utilisé pour toute campagne de certification ou audit de maturité.
