# SBOM Verification & Auditability

Ce document détaille la politique cryptographique et de normalisation du système de traçabilité SBOM (Software Bill of Materials) du pipeline de certification.

## 1. Objectif
Garantir qu'un SBOM généré est :
- **Déterministe** : Deux générations identiques dans les mêmes conditions produisent la même empreinte cryptographique.
- **Canonique** : Indépendant de l'outil de sérialisation et de l'indentation JSON (RFC 8785).
- **Inaltérable** : Protégé par une signature asymétrique forte.
- **Auditable (Zero-Trust)** : Vérifiable par un laboratoire tiers sans confiance accordée au pipeline de génération.

## 2. Politique Cryptographique (v1.0)
Toutes les signatures SBOM respectent le format suivant :
- **Schémas supportés** : CycloneDX 1.5, SPDX 2.3
- **Canonicalisation** : RFC 8785 (JSON Canonicalization Scheme)
- **Algorithme de Hachage** : SHA-256
- **Algorithme de Signature** : Ed25519
- **Cible de la Signature** : `SHA-256(RFC8785(JSON))`

## 3. Profil de Normalisation (v1)
Afin d'obtenir un déterminisme strict, les SBOMs générés subissent une normalisation avant canonicalisation.
### CycloneDX
- Suppression du champ racine `serialNumber` (UUID aléatoire).
- Suppression du champ `metadata.timestamp` (volatilité temporelle).
- Tri alphanumérique strict du tableau `components` par `name` puis par `version`.
### SPDX
- Suppression du champ `documentNamespace` (contient généralement un UUID aléatoire).
- Suppression du champ `creationInfo.created` (volatilité temporelle).
- Filtrage conditionnel de `creationInfo.creators` pour retirer les versions exactes d'outils générateurs aléatoires.
- Tri alphanumérique du tableau `packages` par nom.

> *Un test "anti-déterminisme" garantit que toute modification pertinente (changement de version d'un composant, de licence, ajout de paquet) modifie instantanément le hash canonique.*

## 4. Protocole du Laboratoire Indépendant
Le laboratoire s'exécute selon une architecture **Zero-Trust** :
1. **Regénération Indépendante** : Le laboratoire invoque lui-même le générateur SBOM.
2. **Normalisation en Salle Blanche** : Application du "Normalization Profile v1" via un script dupliqué indépendamment du pipeline.
3. **Vérification Cryptographique** : Le laboratoire canonise sa sortie en RFC 8785 et vérifie que son hash SHA-256 correspond mathématiquement au hash signé fourni par le pipeline.
4. **Validation de Schéma AJV** : Le SBOM est validé contre les schémas locaux versionnés et hachés (`certification/schemas/*`).
5. **Vérification Profonde du Lockfile** : Le laboratoire parse manuellement le fichier `pnpm-lock.yaml` et valide chaque dépendance (nom, version, intégrité) contre le SBOM. Un rapport exhaustif de complétude est alors généré.

## 5. Tests de Résilience
Le pipeline s'accompagne du script `certification/test-sbom-determinism.cjs` qui vérifie en continu l'immunité au bruit temporel (10 itérations successives) ainsi que l'extrême sensibilité cryptographique aux altérations de paquets.
