# ADR-011: Chaos Engineering & Infrastructure Resilience

## Status
Accepted

## Context
La Cognitive Virtual Machine (CVM) a déjà atteint un haut niveau d'assurance fonctionnelle grâce aux tests unitaires, de mutation, de propriétés (PBT), et au Fuzzing orienté couverture. Cependant, ces techniques se concentrent majoritairement sur les défauts logiques du code et la corruption des données par des entrées malformées.
Dans un environnement de production critique (aérospatial, médical, Edge computing hostile), les défaillances proviennent souvent de l'infrastructure sous-jacente : pénurie de mémoire, système de fichiers plein ou corrompu, perte de réseau, ou dérive temporelle.
Il est nécessaire d'introduire un **Chaos Engine** comme nouvelle étape de qualification formelle, situé entre le Fuzzing et l'audit du Laboratoire Zero-Trust.

## Decision
Nous avons décidé d'implémenter un moteur de **Chaos Engineering** traité comme un composant de qualification à part entière, avec la même philosophie architecturale que le Fuzzer.

### 1. Taxonomie des Fautes
Le Chaos Engine injectera des fautes appartenant à 6 familles strictement définies :
- **Processus** : SIGTERM / SIGINT, Process Kill, Suspend/Resume.
- **Mémoire** : OOM simulé, fragmentation, allocations limitées.
- **Disque** : Disk Full (ENOSPC), Permission Denied (EACCES), Fichiers supprimés, Corruption de secteurs.
- **Temps** : Clock Drift, Gel, Sauts, Timeouts.
- **Système** : Variables manquantes, Chemins invalides, Fichiers verrouillés (EBUSY).
- **Réseau** : Timeout, DNS failure, ECONNREFUSED, Latence, Réponses partielles.

### 2. Réutilisation Architecturale
Afin d'éviter la divergence technique, le Chaos Engine réutilisera les fondations du Fuzzer :
- Mêmes concepts de cibles (`ChaosTarget`), oracles (`ChaosOracle`), et campagnes déclaratives (`ChaosCampaign`).
- Même *Event Bus* pour découpler l'orchestration du reporting.
- Utilisation de la canonisation RFC 8785 et de la signature DSSE pour intégrer le `chaos-report.dsse.json` au Snapshot de Certification.

### 3. Oracles Centrés sur le Métier
Un crash induit par le chaos ne signifie pas un échec, sauf s'il viole un invariant métier. Les Oracles du Chaos Engine valideront :
- Aucune corruption du Snapshot après récupération.
- Aucun artefact DSSE partiellement écrit/signé.
- Aucun manifeste tronqué.
- Aucun verrou orphelin (Cleanup complet).
- Rétablissement d'un état cohérent après Rollback.

### 4. Golden Chaos Suite et Laboratoire
Une *Golden Suite* sera maintenue pour certifier le moteur lui-même, en validant que l'injection produit systématiquement l'Oracle attendu. Le laboratoire Zero-Trust s'enrichit des contrôles **L-050 à L-057** pour vérifier l'intégrité, la reproductibilité et la couverture de la campagne de chaos.

## Consequences
- **Positive** : La résilience face à des environnements hautement instables devient formellement prouvable.
- **Positive** : Standardisation du reporting (PBT, Fuzzing, Chaos) facilitant l'audit de qualification (DSSE, RFC 8785).
- **Negative** : La complexité d'interception (mocking) de bas niveau (fs, net, memory) peut nécessiter des ajustements lors de la mise à jour de Node.js ou de la version de TypeScript.
