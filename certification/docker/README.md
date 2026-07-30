# Infrastructure Docker Hermétique pour Certification (SLSA)

Cette infrastructure permet d'exécuter la pipeline de certification (`certify.cjs`) de manière isolée, déterministe et reproductible, garantissant un très haut niveau de fiabilité pour les environnements industriels.

## Conformité SLSA / NIST SSDF

Cette implémentation respecte des règles de sécurité drastiques pour garantir que le processus de certification n'a subi aucune interférence :

- **Pas d'accès réseau au moment de l'exécution** (`network_mode: none`). Les dépendances sont téléchargées au moment du build.
- **Isolations Kernel étendues** (namespaces IPC et UTS isolés).
- **Conteneur en lecture seule** (`read_only: true`). Seuls `/tmp` et le répertoire interne de runs sont autorisés en écriture (`tmpfs` en mémoire).
- **Absence de privilèges root** : exécuté sous un utilisateur standard (`uid 1000`).
- **Suppression totale des capacités Linux** (`cap_drop: ALL`).
- **Interdiction d'acquérir de nouveaux privilèges** (`security_opt: no-new-privileges`).
- **Environnement verrouillé** : utilisation de variables spécifiques (`TZ=UTC`, `LANG=C.UTF-8`, `NODE_OPTIONS="--random-seed=42"`) pour garantir la reproductibilité parfaite du calcul de HASH (SHA256).
- **Verrouillage de Node et pnpm** via `corepack` (version 9.15.9 fixée) et une image `node:22-alpine`.
- **Génération d'attestation SLSA Provenance v1.0** à la fin du processus de certification.

## Mode d'emploi

### Lancer la certification hermétique

1. Assurez-vous d'avoir Docker et Docker Compose installés et accessibles sur votre système.
2. Exécutez le script helper depuis la racine de l'espace de travail :

```bash
bash certification/docker/run-certification.sh
```

### Récupération des Artefacts

Le processus entier est hermétique vis-à-vis du code local (le code est copié dans le conteneur). Une fois le conteneur fermé, tous les rapports, les manifestes cryptographiques et les fichiers de log produits par la certification et le laboratoire sont extraits dans le dossier partagé :

```text
/out/
```

Vous y trouverez :
- `manifest.json`
- L'attestation SLSA (`slsa-provenance.json`)
- Tous les autres rapports JSON et logs.

### Vérifications Intrinsèques

Au démarrage (`entrypoint.sh`), le conteneur va vérifier de lui-même ses propres contraintes :
1. Tentative de joindre un réseau externe (doit échouer).
2. Tentative d'écrire sur le disque racine (doit échouer).
3. Vérification de l'UID (doit être != 0).

Le manifeste généré par ce pipeline sera identique bit à bit sur toutes les machines exécutant le même commit.
