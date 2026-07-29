# Baseline Conformité v1.0

Cette baseline récapitule le niveau de conformité de l'architecture pour le jalon v1.0.

| Domaine          | Statut |
| ---------------- | ------ |
| Architecture     | ✅      |
| Sécurité         | ✅      |
| Cryptographie    | ✅      |
| Gouvernance      | ✅      |
| Documentation    | ✅      |
| Interopérabilité | ✅      |
| Qualification    | ✅      |

### Détails de conformité

- **Architecture** : Le pipeline est hermétique, sépare strictement la production de preuves du laboratoire de vérification, et repose sur des politiques déclaratives exécutables.
- **Sécurité & Cryptographie** : Toutes les preuves générées sont standardisées en DSSE (Digital Signature Standard Envelope), et utilisent in-toto Statements pour les payloads. Les signatures et horodatages proviennent de fournisseurs validés par politique. L-001 à L-031 implémentés et documentés.
- **Gouvernance & Documentation** : Le modèle de menaces, la matrice de traçabilité, les ADRs et le contrat de stabilité (figeant le périmètre et prévoyant l'extensibilité future) sont validés.
- **Interopérabilité** : Support effectif de DSSE, in-toto v1, SLSA Provenance v1, CycloneDX et SPDX. Le Snapshot est structuré pour des audits tiers facilités.
- **Qualification** : Le pipeline passe de bout-en-bout avec génération d'un rapport cryptographique et audit Zéro-Confiance validé au statut *productionReady*.
