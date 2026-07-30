# MASTER PLAN v2.1 — Plateforme Cognitive Explicable & Événementielle (IOS)

Ce plan intègre les 10 ajustements ultimes requis pour figer l'architecture de la plateforme. L'objectif est de transformer un simple moteur en une plateforme **explicable, rejouable, versionnée et mesurable**.

## 1. Séparation stricte : Facts vs Events
- **Facts (Temporaires)** : Sorties brutes des moteurs (ex: `Fact(type=metric, value=180)`).
- **Events (Persistants)** : Ce qui est réellement enregistré dans le système via l'EventBus (ex: `EvidenceAddedEvent`, `ContradictionDetectedEvent`).

## 2. Découplage maximal via EventBus et SnapshotBuilder
Le `CognitivePipeline` ne connaît plus le `Reducer`. Le flux devient :
1. `Engine.execute(InvestigationContext)` -> génère des `Facts` et émet des `Events`.
2. Le `CognitivePipeline` publie les événements : `EventBus.publish(events)`.
3. Plusieurs Reducers écoutent (Knowledge, Audit, Analytics).
4. `SnapshotBuilder` construit un nouvel `InvestigationContext` (100% immutable).

## 3. InvestigationContext = Snapshots 100% Immutables
L'`InvestigationContext` ne contient plus d'objets mutables mais des clichés figés dans le temps :
- `graphSnapshot` (Read-only)
- `timelineSnapshot`
- `strategySnapshot`
- `budgetSnapshot`
- `metricsSnapshot`

## 4. Ajout des Nouveaux Moteurs (Normalizer & Identity)
L'ordre d'exécution s'enrichit pour pré-mâcher le travail cognitif :
1. **Normalizer Engine** : Nettoyage ASR, ponctuation, segmentation temporelle.
2. **Identity Engine** : Extraction des entités brutes (personne, entreprise, techno, date).
3. **Perception Engine** : Travaille désormais sur les entités normalisées au lieu du texte brut.
4. **Evidence Engine** -> **Contradiction Engine** -> **Temporal Engine** -> **Confidence Engine**.

## 5. Confidence Engine (Incrémental)
Le Confidence Engine ne recalcule jamais tout. Il fonctionne par delta (`+0.07`, `-0.12`).
- **Formule par delta** : Modification mathématique basée sur le nouvel `EvidenceAddedEvent` ou `ContradictionDetectedEvent`.

## 6. Investigation Ledger & Decision Graph
- **Investigation Ledger** : Registre ultra-détaillé (`Reason`, `Decision`, `Evidence`, `Confidence Impact`, `Missing`). Permet d'expliquer *exactement* pourquoi une compétence est validée.
- **Decision Graph** : On ne stocke plus seulement la Connaissance (`KnowledgeGraph`), mais aussi le Raisonnement (`DecisionGraph`). (ex: *Question 14 -> Leadership unknown -> Decision: Challenge candidate*).

## 7. Versioning Indépendant des Engines
Chaque `Event` émis porte la version spécifique de l'Engine (ex: `Perception@1.3.0`, `Temporal@1.2.1`). Le replay permet de recréer l'état exact.

## 8. Cognitive Metrics API
Les métriques deviennent natives dans les Snapshots et le Ledger :
- *Unknown reduction rate, Evidence density, Contradiction rate, Confidence growth, Question efficiency, Conversation entropy, etc.*

---

## Plan de Travail (Prochaines Étapes Techniques)

Dès l'approbation de cette version 2.1, l'implémentation commencera dans cet ordre strict :
1. **Refonte des Contrats (Core)** : Création de `EventBus`, `SnapshotBuilder`, et mise à jour de `InvestigationContext` avec des *Snapshots*.
2. **Implémentation du Ledger & Decision Graph** : Les nouvelles structures de données.
3. **Mise à jour du Pipeline** : Boucle sur `EngineRegistry` et publication asynchrone sur `EventBus`.
4. **Implémentation des Moteurs Fondations** : `NormalizerEngine` et `IdentityEngine`.
5. **Adaptation Moteurs Cognitifs** : `Perception`, `Evidence`, `Contradiction`, `Temporal`, `Confidence` (Incrémental).

> **User Review Required** : Le plan v2.1 est-il validé pour démarrer l'implémentation de la fondation Core (EventBus, SnapshotBuilder, InvestigationContext) ?
