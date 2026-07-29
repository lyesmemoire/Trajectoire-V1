# Audit Readiness Report

Ce document synthétise l'état de préparation de l'architecture logicielle face à un audit normatif de type ISO 17025 / SLSA L3. 
Il recense les garanties implémentées et les preuves cryptographiques associées, permettant à un auditeur externe de valider la conception et le niveau d'assurance.

## 1. Synthèse de Conformité

| Domaine | État | Preuve / Justification |
| :--- | :---: | :--- |
| **Déterminisme** | ✔ | Script `snapshot-determinism.test.cjs` validant l'identité binaire (`sha256`) sur des runs répétés. |
| **SBOM** | ✔ | `sbom-cyclonedx.json` + `sbom-spdx.json` générés. Schémas validés et canonisés RFC 8785 par le Laboratoire. |
| **Provenance** | ✔ | Enveloppe DSSE (`provenance.dsse.json`) générée avec `payloadType` in-toto. Validée par le contrôle `L-002`. |
| **Herméticité** | ✔ | Preuves runtime (`runtimeEvidence`) et configuration (`builderConfigurationDigest`) croisées avec `policy/hermeticity.json` via le contrôle `L-011`. |
| **Supply Chain** | ✔ | `audit-cve.json` attestant de 0 vulnérabilité bloquante, synchronisé avec le SBOM. |
| **Red Team** | ✔ | Campagne `attack-campaign.test.cjs` vérifiant le rejet strict des falsifications (cycle, orphelin, hash corrompu, format invalide). |
| **Reproductibilité** | ✔ | Séparation claire entre Pipeline (Générateur) et Laboratoire (Consommateur indépendant). Preuves validables sur toute machine "Machine B". |
| **Limites connues** | ✔ | Hypothèses documentées ci-dessous (Root of Trust). |

---

## 2. Qualification de la Campagne Red Team

La résilience du laboratoire a été démontrée par une campagne d'attaques ciblées (`attack-campaign.test.cjs`). La matrice ci-dessous relie chaque falsification au contrôle normatif qui assure son rejet immédiat (0 faux négatif) :

| Attaque / Altération | Contrôle Déclenché | Résultat Attendu | Constat |
| :--- | :---: | :--- | :---: |
| **Artefact Orphelin** (Ajout d'un fichier malveillant) | `L-007` | Détection de désynchronisation entre Subject In-toto et Archive | REJETÉ |
| **Falsification Cryptographique** (Digest altéré) | `L-004` | Mismatch de hash (Subject vs Fichier physique) | REJETÉ |
| **Cycle Vicieux** (Boucle dans le graphe) | `L-006` | Détection du graphe non-acyclique (Non-DAG) | REJETÉ |
| **Changement Sémantique** (PayloadType invalide) | `L-003` | Rejet du format de l'attestation DSSE | REJETÉ |

---

## 3. Hypothèses de Confiance (Root of Trust)
L'architecture garantit un niveau d'assurance élevé. Toutefois, un auditeur doit prendre en compte les hypothèses (limites) suivantes, inhérentes à cette `v1` :
1. **Intégrité de l'Hôte Docker** : Nous partons du principe que le daemon Docker hôte applique correctement les profils Seccomp et le `network: none`. (Si le noyau hôte est compromis, l'isolation l'est aussi).
2. **Gestion des Clés** : Les clés (`pipeline_private.pem` et `lab_private.pem`) sont actuellement stockées sur le système de fichiers. Pour une `v2`, un HSM, KMS ou OIDC (ex: Sigstore Fulcio) serait requis pour une confiance absolue dans la provenance de la signature.
3. **Absence d'Horodatage RFC 3161** : Le `finishedOn` est généré localement. Il n'y a pas de Time Stamping Authority externe garantissant l'instant exact de la certification de la preuve (Risque de *backdating*).

## 3. Conclusions pour l'Auditeur
La structure du graphe de preuves, l'absence de confiance déclarative (remplacée par des preuves *runtime*), et la séparation des identités cryptographiques placent ce projet dans la classe des **architectures matures** pour une chaîne d'approvisionnement logicielle Zero-Trust.
