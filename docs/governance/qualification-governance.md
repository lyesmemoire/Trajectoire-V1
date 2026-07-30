# Trajectoire — Constitution de la Qualification

> Version de gouvernance : **1.0**
> Date d'entrée en vigueur : 2026-07-29
> Profil de référence : **Q1.0** (immutable)

---

## 1. Périmètre

La présente politique de gouvernance s'applique à l'ensemble de la chaîne de qualification de la **Cognitive Virtual Machine (CVM)** du projet Trajectoire. Elle couvre :

- la compilation du compilateur sémantique et de la CVM ;
- les tests unitaires, d'intégration et de propriétés (PBT) ;
- les tests de mutation ;
- le fuzzing (corpus, campagnes, rapports) ;
- le chaos engineering (injection de fautes, oracles) ;
- la certification (manifeste, provenance SLSA, SBOM, DSSE) ;
- l'audit indépendant (laboratoire clean room).

Tout composant participant à la production ou à la vérification d'une preuve de qualification entre dans le périmètre de cette politique.

---

## 2. Rôles et Responsabilités

| Rôle | Responsabilité | Artefacts produits |
|------|----------------|-------------------|
| **Producer** | Développement du code source de la CVM | Code source, tests |
| **Certification Pipeline** | Exécution automatisée de la chaîne de preuves | Manifest, Provenance, SBOM, rapports PBT/Fuzz/Chaos, DSSE |
| **Independent Laboratory** | Vérification indépendante, rejeu déterministe, validation cryptographique | `laboratory-audit-report.json`, `laboratory.dsse.json` |
| **Auditor** | Revue externe des preuves | Rapport d'audit externe |

### Principe fondamental

> Le Producer et le Certification Pipeline partagent la même racine de confiance (clé de signature `pipeline`).
> Le Laboratory dispose de sa propre racine de confiance (clé de signature `lab`).
> Un Auditor externe ne fait confiance à aucune des deux racines a priori.

---

## 3. Artefacts Normatifs

Les artefacts suivants constituent les preuves formelles d'une qualification :

| Artefact | Format | Signé | Description |
|----------|--------|-------|-------------|
| `manifest.json` | JSON | Oui (DSSE) | Racine de confiance : empreintes SHA-256 de tous les fichiers |
| `provenance.dsse.json` | DSSE / In-Toto / SLSA | Oui | Attestation de provenance des artefacts |
| `sbom-cyclonedx.json` | CycloneDX 1.5 | Oui (DSSE) | Inventaire des dépendances |
| `pbt-statistics.json` | JSON | Non | Résultats des tests de propriétés (seed, nombre d'exécutions) |
| `fuzz-report.json` | JSON | Oui (DSSE) | Rapport de fuzzing (corpus, crashs, couverture) |
| `chaos-report.json` | JSON | Oui (DSSE) | Rapport de chaos engineering (fautes, oracles, récupération) |
| `laboratory-audit-report.json` | JSON | Oui (DSSE Lab) | Rapport d'audit du laboratoire indépendant |
| `release-evidence-v*.dsse.json` | DSSE | Oui | Index signé de l'ensemble des preuves d'une release |

---

## 4. Profils d'Audit

| Profil | Type | Rejeu | Durée estimée | Usage |
|--------|------|-------|---------------|-------|
| **A** | Structural | Aucun | ~secondes | Vérification rapide (CI, pre-commit) |
| **B** | Deterministic Replay | PBT, Fuzz, Chaos | ~minutes | Profil par défaut en CI |
| **C** | Full Qualification | Compile + Unit + Mutation + PBT + Fuzz + Chaos | ~dizaines de minutes | Audits approfondis |
| **Q1.0** | Official Certification | Identique à C, avec contraintes strictes | ~dizaines de minutes | Qualification officielle V1.0 |

### Contraintes du profil Q1.0

Le profil Q1.0 est **immutable**. Il impose :

- `environmentStrictMatch: true` — l'environnement d'exécution doit correspondre exactement à celui du Snapshot ;
- `seedReplay: true` — les seeds PBT/Fuzz/Chaos doivent être rejouées à l'identique ;
- `commitLocked: true` — le commit Git doit correspondre au Snapshot ;
- `sourceDateEpochRequired: true` — le `SOURCE_DATE_EPOCH` doit être défini.

Toute modification des exigences de qualification nécessite la création d'un nouveau profil (`Q1.1`, `Q2.0`, etc.).

---

## 5. Critères de Décision

Le laboratoire indépendant attribue l'un des statuts suivants :

| Statut | Signification |
|--------|---------------|
| `MATCH` | Toutes les preuves sont reproduites à l'identique ou sémantiquement. |
| `DIFF` | Divergence détectée dans le même environnement. Défaut potentiel. |
| `UNSUPPORTED_ENVIRONMENT` | L'environnement de rejeu diffère significativement. Comparaison invalide. |
| `INCOMPLETE` | Certaines vérifications n'ont pas été exécutées (profil A/B). |

### Niveaux de correspondance

| Niveau | Définition |
|--------|-----------|
| `IDENTICAL` | Même SHA-256 bit à bit. |
| `CANONICAL_MATCH` | JSON différents mais RFC 8785 identique. |
| `SEMANTIC_MATCH` | Ordre ou timestamps différents, mais mêmes propriétés vérifiées. |
| `DIFF` | Preuve réellement différente. |

---

## 6. Politique de Gestion des Clés

### Clés du Pipeline de Certification

- **Algorithme** : Ed25519
- **Stockage** : Variable d'environnement `CERT_PRIVATE_KEY` ou coffre-fort sécurisé (CI/CD secrets)
- **Rotation** : Annuelle minimum, ou sur compromission suspectée
- **Clé publique** : Versionnée dans `certification/keys/pipeline_public.pem`
- **Clé privée** : **Jamais versionnée**. Injectée par l'environnement d'exécution.

### Clés du Laboratoire Indépendant

- **Algorithme** : Ed25519
- **Stockage** : Variable d'environnement `LAB_PRIVATE_KEY` ou coffre-fort dédié
- **Rotation** : Indépendante du pipeline
- **Clé publique** : Versionnée dans `laboratory/keys/lab_public.pem`
- **Clé privée** : **Jamais versionnée**. Racine de confiance distincte du pipeline.

### Principe de séparation

> Les clés de signature du pipeline et du laboratoire doivent appartenir à des racines de confiance distinctes.
> Aucun module du laboratoire ne doit importer de code du pipeline, ni vice-versa pour les opérations cryptographiques.

---

## 7. Politique de Conservation et d'Archivage

| Artefact | Durée de conservation | Format |
|----------|----------------------|--------|
| Snapshots de qualification | 5 ans minimum | Dossier `certification/runs/` ou archivage externe |
| Release Evidence | Durée de vie du produit | Archive signée |
| Rapports du Laboratoire | 5 ans minimum | JSON + DSSE |
| Corpus PBT/Fuzz | Durée de vie du profil de qualification | Fichiers dans `tests/fuzzing/corpus/` |
| Clés publiques historiques | Indéfiniment | PEM versionné |

---

## 8. Gestion des Incidents et des Divergences

### En cas de `DIFF` après publication

1. **Gel immédiat** : aucune nouvelle release tant que la cause n'est pas identifiée.
2. **Analyse de cause racine** : identifier si la divergence est un défaut logiciel, un changement d'environnement non documenté, ou une altération des preuves.
3. **Remédiation** : corriger le défaut et relancer la qualification complète (profil C ou Q1.0).
4. **Documentation** : consigner l'incident dans un ADR dédié.
5. **Re-qualification** : produire un nouveau Release Evidence avec un nouveau `qualificationId`.

### En cas de `UNSUPPORTED_ENVIRONMENT`

1. **Ne pas conclure** : un `UNSUPPORTED_ENVIRONMENT` n'est ni un succès ni un échec.
2. **Documenter** : enregistrer les versions détectées.
3. **Remédier** : reproduire l'environnement original ou créer un nouveau profil de qualification adapté.

---

## 9. Identifiant de Qualification

Chaque exécution de la chaîne de qualification produit un identifiant unique et déterministe :

```
TRAJECTOIRE-{profil}-{année}-{hash8}
```

Exemple : `TRAJECTOIRE-Q1.0-2026-a3b7c9d1`

Cet identifiant est dérivé de :
- la version de release ;
- le profil de qualification ;
- le commit Git (`HEAD`) ;
- le `SOURCE_DATE_EPOCH`.

Il apparaît dans :
- le Manifest (`metadata.qualificationId`) ;
- la Provenance SLSA ;
- le rapport du Laboratoire ;
- le Release Evidence.

---

## 10. Règles d'Évolution

### Ce qui peut évoluer sans créer un nouveau profil de qualification

- Ajout de nouveaux tests unitaires ou de propriétés.
- Enrichissement du corpus de fuzzing.
- Ajout de nouveaux scénarios de chaos.
- Amélioration des messages d'erreur du laboratoire.
- Correction de bugs dans le code source.

### Ce qui nécessite un nouveau profil de qualification

- Modification des critères de décision (`MATCH`, `DIFF`, etc.).
- Modification des contraintes d'un profil existant.
- Changement d'algorithme de signature ou de hachage.
- Modification de la structure du manifeste.
- Ajout ou suppression d'artefacts normatifs.

### Ce qui nécessite une nouvelle version de gouvernance

- Ajout ou suppression de rôles.
- Modification de la politique de gestion des clés.
- Modification de la politique de conservation.
- Changement des règles d'évolution elles-mêmes.

---

## 11. Références

| Document | Chemin |
|----------|--------|
| ADR-001 : Architecture de Certification | `docs/ADR-001-certification-architecture.md` |
| Matrice de Traçabilité | `CVM_TRACEABILITY_MATRIX.md` |
| Gouvernance du Laboratoire | `laboratory/governance.json` |
| Politique de Signature | `certification/policy/signature.json` |
| Politique de Seuils | `certification/policy/thresholds.json` |
