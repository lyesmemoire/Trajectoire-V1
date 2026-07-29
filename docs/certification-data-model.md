# Contrat d'Architecture et Modèles de Données (Certification)

Ce document constitue la **norme de référence** (Architecture Contract) de la plateforme de certification. Il documente de manière exhaustive les identifiants, les schémas, les profils et les invariants garantissant la traçabilité à long terme des attestations.

---

## 1. Distinction Standard vs Profil
La plateforme s'appuie sur des standards ouverts du marché de la Supply Chain Security. Toutefois, la manière dont la donnée y est inscrite est régie par des **profils internes stricts**.

- **Standards sous-jacents** : in-toto Statement v1, SLSA Provenance v1, DSSE (Dead Simple Signing Envelope), CycloneDX 1.5, SPDX 2.3, RFC 8785.
- **Profils Internes** : 
  - `trajectoire-provenance-v1` : Définit la topologie des preuves d'herméticité.
  - `trajectoire-snapshot-v1` : Définit la topologie de l'archive et le graphe de dépendance des preuves.

> L'apparition de nouvelles exigences ne doit jamais modifier la sémantique de `v1`. Elle nécessitera la création d'un profil `v2`.

---

## 2. Identifiants Immuables (URN)
Ces identifiants garantissent la continuité de la traçabilité au travers des audits :

- **Builder ID** : `urn:trajectoire:builder:v1`
  - Désigne l'entité de certification automatisée.
- **BuildType** : `urn:trajectoire:buildtype:hermetic-node-pnpm:v1`
  - Désigne le type d'exécution : réseau coupé, système de fichiers immuable, Node.js + pnpm.

---

## 3. Modèle de Données : Build Provenance (DSSE / in-toto)
L'attestation `provenance.dsse.json` lie l'environnement de build, les sources exactes et tous les artefacts générés.

### A. Invariants Obligatoires
- Le champ `subject` DOIT lister exhaustivement TOUS les artefacts produits (manifestes, sboms, rapports d'audit, etc.).
- Le commit Git DOIT spécifier son algorithme : `{"algorithm": "git-sha1", "value": "..."}`.
- L'`invocationId` DOIT être déterministe et dérivé : `SHA256(commit+builder+startedOn)`.
- Le container DOIT être identifié uniquement par son `imageDigest`.
- Les preuves d'herméticité DOIVENT inclure : `cap-drop=ALL`, `seccomp=strict`, `no-new-privileges=true`, `readOnlyRootFilesystem=true`.

---

## 4. Modèle de Données : Certification Snapshot
Le Snapshot est un conteneur d'archives (TAR déterministe) orchestrant toutes les preuves cryptographiques.

### A. Format et Invariants
- **Format Archive** : `.tar` (sans compression, ou compression neutre sans altération des timestamps).
- **Déterminisme** : Umask forcé, UID/GID normalisés, horodatage EPOCH 0 pour l'enveloppe de l'archive (ou fixés à la date du snapshot).
- **Signature Index** : Le fichier d'index `snapshot.json` DOIT lui-même être signé (`snapshot.sig.json`).

### B. Graphe de Relations (Relationships)
Le `snapshot.json` modélise explicitement le graphe des preuves pour le laboratoire Zero-Trust :
- Le graphe DOIT être un DAG (Directed Acyclic Graph). Aucune relation circulaire n'est tolérée.
- Il DOIT exister une racine unique absolue (`snapshot.json`).
- `provenance.dsse.json` **describes** `manifest.json`.
- `manifest.json` **hashes** `sbom-cyclonedx.json`.
- `manifest.json` **hashes** `audit-cve.json`.

---

## 5. Registre des Contrôles (Laboratoire)
Pour assurer une traçabilité d'audit ISO 17025, le laboratoire émet un rapport JSON structuré reposant sur le registre normatif suivant :

| Code | Nom | Description de l'Invariant |
|---|---|---|
| L-001 | Snapshot Signature | La signature cryptographique de l'index racine (`snapshot.json`) doit être valide. |
| L-002 | DSSE Envelope | La provenance doit respecter le schéma de l'enveloppe DSSE. |
| L-003 | Payload Type | Le `payloadType` DSSE doit strictement être `application/vnd.in-toto+json`. |
| L-004 | Subject Digest | Tous les hashs annoncés dans le `subject` doivent correspondre physiquement aux fichiers de l'archive. |
| L-005 | Relationship Integrity | Le parcours du graphe ne doit présenter aucune rupture de lien. |
| L-006 | Graph Acyclicity | Le graphe doit être acyclique avec une racine unique. |
| L-007 | Orphan Detection | Il y a bijection stricte entre les fichiers de l'archive et le `subject`. Aucun artefact orphelin. |
| L-008 | Key Resolution | Le `keyid` est un index, la signature doit être prouvée cryptographiquement. |
| L-009 | Deterministic Determinism | Évaluation des preuves déterministes (hash binaire exact). |
| L-010 | Contextual Drift | Évaluation des preuves temporelles (vulnérabilités mouvantes). |

## 6. Classification des Preuves (Déterministe vs Contextuel)
Pour un audit ISO 17025, la nature de chaque preuve détermine comment le laboratoire Zero-Trust la valide. Les variations environnementales (date, chemin absolu) ne doivent pas invalider une preuve déterministe.

| Élément             | Nature                                 | Vérification attendue                          |
| ------------------- | -------------------------------------- | ---------------------------------------------- |
| Manifest            | Déterministe                           | Hash binaire identique                         |
| SBOM normalisé      | Déterministe                           | Hash binaire identique                         |
| Snapshot            | Déterministe (hors champs neutralisés) | Hash binaire identique de l'archive tar        |
| Audit CVE           | Contextuel                             | Analyse de dérive (Drift analysis)             |
| Provenance (DSSE)   | Mixte                                  | Vérification structurelle + champs contextuels |
| Rapport laboratoire | Contextuel                             | Signature cryptographique + cohérence          |

---

## 7. Versioning Global des Profils
Afin de garantir l'interopérabilité à long terme (quand le laboratoire traitera des archives vieilles de plusieurs années), la Provenance doit déclarer de manière explicite les versions de tous les profils appliqués :
```json
"profiles": {
  "provenance": "trajectoire-provenance-v1",
  "snapshot": "trajectoire-snapshot-v1",
  "hermeticity": "trajectoire-hermetic-v1",
  "laboratory": "trajectoire-laboratory-v1"
}
```

---

## 8. Règles de Compatibilité Avant/Arrière
- Un laboratoire devra toujours supporter les anciennes versions des profils (`v1`) même lorsque le système générera la `v2`.
- La politique cryptographique (`cryptoPolicy`) est intégrée de manière auto-descriptive dans le Snapshot et dans la Provenance (ex: passage futur de Ed25519 à un algorithme post-quantique).

---

## 6. Distinctions d'Audit (Laboratoire)
- **Preuves Déterministes** : (Manifeste, SBOM, Signatures). Le laboratoire EXIGE une équivalence binaire absolue (`hash(A) === hash(B)`).
- **Preuves Contextuelles** : (Provenance, Audit CVE, Snapshot Timestamps). Le laboratoire EXIGE une cohérence de graphe et de signatures, mais accepte les dérives temporelles (ex: nouvelles vulnérabilités).
