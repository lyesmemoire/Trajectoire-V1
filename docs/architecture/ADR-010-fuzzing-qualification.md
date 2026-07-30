# ADR 010: Fuzzing en tant que Composant de Qualification Industrielle

## Contexte
La Cognitive Virtual Machine (CVM) nécessite une preuve de robustesse face à des entrées malformées, corrompues ou malveillantes (Bytecode, Code source). Le Property-Based Testing (PBT) permet de garantir des invariants logiques, mais l'exploration de chemins atypiques sur des volumes massifs d'exécutions requiert un moteur de fuzzing.

## Décision
Nous avons décidé d'implémenter un moteur de fuzzing sur-mesure intégré nativement à notre infrastructure TypeScript/Node.js, conçu dès le départ comme un **composant de qualification certifié** (et non un simple outil de test ad hoc).

### Pourquoi un moteur propriétaire plutôt que libFuzzer/AFL++ ?
1. **Intégration Node.js (V8)** : libFuzzer et AFL++ sont optimisés pour les binaires C/C++ (via LLVM sancov). Les intégrations JS (comme Jazzer.js) ajoutent une couche de complexité native qui nuit à l'herméticité de notre build reproductible.
2. **Oracles Sémantiques** : Nous ne cherchons pas seulement des crashs (Segfault/OOM), mais des violations de sécurité spécifiques à la CVM (Oracles) : stack overflow virtuelle, corruption de snapshot, compteurs de programme invalides. Un moteur natif permet d'inspecter l'état interne.
3. **Certification DSSE** : Le pipeline doit produire un rapport cryptographiquement signé (`fuzz-report.dsse.json`) qui intègre directement les métadonnées de reproductibilité (seed, mutations) pour nos auditeurs.

## Architecture du Moteur

L'architecture est structurée autour d'abstractions fortes garantissant la maintenabilité :

### 1. Interfaces Fondamentales
- `FuzzTarget` : Définit la cible (Parser, Compiler, VM). Expose `initialize()`, `execute(input)` et `shutdown()`.
- `FuzzOracle` : S'exécute après chaque `execute()` pour valider que l'état post-exécution reste cohérent. Détecte les bugs silencieux.
- **Stratégies Injectables** : `Scheduler`, `MutationStrategy`, `CoverageStrategy`, `CorpusStrategy`, `CrashClassifier`.

### 2. Le Cycle de Vie d'une Campagne
Le moteur ne possède plus de paramètres codés en dur. Il exécute des profils déclaratifs (Campagnes).
1. **Initialisation** : Chargement de la configuration (`qualification.json`), initialisation de la `seed` déterministe et du `CoverageTracker` V8.
2. **Régression** : Exécution du corpus existant (dossier `corpus/regressions/`).
3. **Fuzzing (Coverage-Guided)** : 
   - Le `Scheduler` sélectionne une entrée du corpus (favorisant les entrées produisant le plus de couverture).
   - Le `Mutator` altère l'entrée en utilisant une mémoire d'efficacité (apprentissage adaptatif).
   - Le `FuzzTarget` exécute le payload.
   - Si nouvelle couverture : ajout au corpus `interesting/`.
   - Si erreur : le `CrashReporter` classifie, minimise (Delta Debugging) et sauvegarde dans `crashes/<Type>/`.
4. **Finalisation** : Réduction automatique du corpus (élagage des chemins redondants) et émission de l'événement `CampaignFinished`.

### 3. Intégration de Qualification (Zero-Trust)
Le moteur produit un document complet formaté en JSON.
Ce fichier passe ensuite dans la chaîne de confiance de Trajectoire :
`fuzz-report.json` ➔ `RFC8785 Canonicalization` ➔ `DSSE Signature` ➔ `Transparency Timestamp` ➔ `Certification Snapshot`.

Les règles du Laboratoire de Qualification (`independent-lab.cjs`) couvrent :
- **L-041** : Corpus Regression (tout le corpus historique doit passer).
- **L-042** : Crash Reproducibility (re-jeu des crashs historiques).
- **L-043** : Coverage Growth (le fuzzing doit produire une évolution active).
- **L-044** : Corpus Integrity (SHA-256 valides, absence de doublons purs).
- **L-045** : Mutation Efficiency.
- **L-046** : Corpus Minimization (absence d'entrées non utiles à la couverture globale).
- **L-047** : Campaign Reproducibility (vérification de la signature stricte config+seed+commit).

### 4. Matrice de Traçabilité
Les identifiants **F-001** à **F-009** couvrent les cibles de fuzzing (VM, Parser, Compiler, Pipeline, Oracles, Scheduler, Corpus, Crash, Coverage) et ferment la boucle de bout-en-bout (Requirement ➔ Unit ➔ PBT ➔ Fuzz ➔ Lab).

## Conséquences
- **Avantages** : Reproductibilité absolue, génération de preuves d'assurance pour les auditeurs, indépendance technologique.
- **Inconvénients** : Complexité initiale de développement, vitesse d'exécution (exec/s) potentiellement inférieure à un fuzzer binaire natif codé en C/Rust.
