# ADR 009: Reproducible Builds et Niveaux de Déterminisme

## Statut
**Accepté** (v1.0.0)

## Contexte
Afin de garantir la confiance dans les artefacts logiciels produits par le pipeline de certification de *Trajectoire*, nous devons assurer un build **100% reproductible**.
Cependant, le pipeline intègre des services cryptographiques tiers (Timestamping Authority RFC3161, Transparency Log Rekor) et des mécanismes de signature locaux (DSSE) qui injectent de la variabilité : les UUID générés par les outils de SBOM, les dates courantes, et les timestamps externes.

Nous avons donc besoin de définir clairement ce qui doit être déterministe (bit-à-bit) et ce qui est par nature volatile.

## Décision

Nous avons décidé d'implémenter une **architecture de reproductibilité à deux niveaux**.

### Niveau 1 : Le Déterminisme du Payload (Bit-à-bit)
Le **Niveau 1** concerne les objets de données (payloads JSON : Manifeste, SBOM, Provenance) et les archives physiques (fichiers `.tar`).
- **Objectif** : Si l'on re-construit le projet depuis le même commit Git, les empreintes SHA-256 de tous les artefacts JSON internes doivent être **strictement identiques**.
- **Mécanismes** :
  - **Temps figé** : Le temps est extrait de la variable d'environnement `SOURCE_DATE_EPOCH`. En son absence, nous utilisons la date du dernier commit Git (`git log -1 --format=%cI`). Aucun appel à `new Date()` n'est autorisé pour dater les builds.
  - **Identifiants Stables** : Remplacement des UUID aléatoires (v4) par des UUID déterministes (v5) basés sur un namespace `trajectoire` et une valeur prévisible (ex: le hash du commit ou le nom du composant).
  - **Canonicalisation RFC 8785** : Tout objet JSON est trié et canonisé selon la RFC 8785 avant d'être sérialisé et hashé.
  - **Archives TAR normalisées** : Les archives TAR de certification (Snapshot) forcent `mtime` à la valeur de `SOURCE_DATE_EPOCH`, et normalisent les droits d'accès `uid=0`, `gid=0`, et les droits POSIX standardisés. L'ordre des fichiers dans l'archive est strictement trié de façon lexicographique.

### Niveau 2 : L'Enveloppe Cryptographique (Volatile)
Le **Niveau 2** concerne l'enveloppe DSSE (Dead Simple Signing Envelope) qui encapsule les payloads du Niveau 1, ainsi que les preuves liées à l'environnement extérieur.
- **Objectif** : Isoler la variabilité inhérente aux signatures cryptographiques sans corrompre le déterminisme du Niveau 1.
- **Mécanismes** :
  - L'enveloppe DSSE (`manifest.dsse.json`) stocke le payload de Niveau 1 encodé en base64.
  - Les signatures, métadonnées de clés, et horodatages (RFC3161, Sigstore Rekor) s'appliquent sur le digest du payload (Niveau 1).
  - L'enveloppe complète est **intentionnellement non-déterministe** (elle varie à chaque exécution car la date du timestamp réseau ou la position dans le journal de transparence Rekor varie).
  
## Vérification par le Laboratoire (L-032)
Le contrôle `L-032 (Reproducible Build)` est implémenté dans le script du laboratoire indépendant :
1. Il extrait le `payload` base64 de l'enveloppe `manifest.dsse.json`.
2. Il applique la canonicalisation RFC 8785 sur ce payload décodé.
3. Il recalcule le hash SHA-256 et vérifie qu'il correspond exactement à l'empreinte signée par la clé cryptographique.
4. Cette vérification cryptographique garantit que le Manifest a été généré via le module déterministe certifié et qu'aucun acteur n'a altéré la structure JSON sous-jacente.

## Conséquences
- **Avantages** : Nous atteignons le niveau SLSA L3 (Build Reproductible) complet. L'auditabilité est maximale.
- **Inconvénients** : Obligation d'utiliser un module de déterminisme strict (`deterministic.cjs`). Les outils tiers (comme `@cyclonedx/cdxgen`) doivent être post-traités et purgés de leurs identifiants volatils natifs.
