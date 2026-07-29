# Architecture Decision Record (ADR-001) : Chaîne de Certification Trajectoire

## Statut
**Accepté** (Gel de l'architecture v1.0)

## Contexte
Afin de répondre aux exigences de la norme SLSA (Supply chain Levels for Software Artifacts) et d'assurer une chaîne de confiance "Zero-Trust", l'architecture de certification Trajectoire a dû faire l'objet de décisions structurantes pour la génération, la signature et l'évaluation des preuves.

## Décisions

### 1. Séparation stricte Pipeline / Laboratoire
Nous avons séparé la génération des preuves (le **Pipeline**) de l'évaluation de ces preuves (le **Laboratoire Indépendant**).
- **Pourquoi ?** Un système compromis ne peut pas évaluer de manière fiable ses propres preuves. Le Laboratoire agit comme une entité externe, intraitable, qui applique des contrôles (L-001 à L-025) de manière totalement indépendante.

### 2. Format d'enveloppe DSSE (Dead Simple Signing Envelope)
Toutes les signatures sont transportées dans une enveloppe DSSE.
- **Pourquoi ?** C'est le standard de facto recommandé par in-toto et SLSA. Il permet d'encapsuler n'importe quel payload (JSON, binaire) avec de multiples signatures sans altérer la structure originelle du payload.

### 3. Canonicalisation RFC 8785 (JCS)
Avant tout hachage ou signature, le payload est sérialisé selon la norme RFC 8785.
- **Pourquoi ?** Les objets JSON peuvent varier selon la représentation des clés, les espaces et l'encodage. Le JSON Canonicalization Scheme garantit une empreinte cryptographique (hash) constante indépendamment de l'environnement, garantissant le déterminisme.

### 4. Ed25519 en développement / Cosign comme fournisseur CI
L'utilisation de clés statiques (Ed25519) est conservée pour le mode développement/hors-ligne, tandis que Cosign est l'abstraction de référence pour la CI.
- **Pourquoi ?** Cosign masque la complexité des interactions avec l'écosystème Sigstore (Fulcio, Rekor, OIDC) dans l'environnement CI/CD, sans forcer les développeurs locaux à utiliser des navigateurs et de l'authentification interactive (qui détruirait le déterminisme hors-ligne).

### 5. Validation Stricte des Schémas en amont
"On ne signe jamais un document qui ne valide pas son schéma." Le pipeline utilise `Ajv` avec les schémas JSON standards (SLSA v1.0, in-toto).
- **Pourquoi ?** Signer un JSON corrompu ou falsifié structurellement confère de la légitimité à une anomalie. Valider le schéma avant signature bloque l'introduction de malformations dans le registre.

### 6. Archive "Snapshot" Déterministe
Toutes les preuves sont empaquetées dans une archive TAR via un processus déterministe (horodatage fixé à Epoch, tri alphabétique, normalisation propriétaire/permissions).
- **Pourquoi ?** Le condensat cryptographique de cette archive de preuves sert d'ancrage final et garantit à l'auditeur que les preuves elles-mêmes n'ont pas été modifiées ou ajoutées a posteriori.

## Conséquences
L'adoption de ces standards lie l'architecture aux évolutions des normes SLSA, DSSE et Sigstore. Néanmoins, en manipulant des formats standards et validés par des schémas, Trajectoire maintient une totale compatibilité avec des auditeurs externes, via des outils indépendants comme `slsa-verifier`.
