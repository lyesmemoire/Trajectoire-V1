# ADR-001: CognitiveRuntime Responsibility

**Status**: Accepted  
**Date**: 30 juillet 2026  
**Context**: IOS v3 Architecture  

## Context

Le CognitiveRuntime est l'orchestrateur principal du système cognitif. Il coordonne l'exécution des moteurs, la gestion des événements et la construction des snapshots.

## Decision

Le CognitiveRuntime a une responsabilité **strictement limitée à l'orchestration**. Il ne contient **aucune logique métier**.

### Responsabilités Autorisées

- Exécuter les moteurs via EngineScheduler
- Publier les événements via EventBus
- Construire les snapshots via SnapshotBuilder
- Gérer les erreurs d'exécution
- Gérer le budget (tokens, coûts)
- Gérer le cycle de vie des sessions

### Responsabilités Interdites

- **Jamais** de calcul métier
- **Jamais** de score
- **Jamais** de décision
- **Jamais** de validation métier
- **Jamais** de logique de domaine

## Rationale

Cette séparation garantit :
- Découplage entre runtime et domaine
- Testabilité du runtime indépendamment de la logique métier
- Capacité de remplacer la logique métier sans toucher au runtime
- Maintenance simplifiée

## Consequences

### Positives

- Runtime testable avec des mocks
- Logique métier isolée dans les engines et policies
- Architecture claire et maintenable

### Négatives

- Plus de fichiers à gérer
- Nécessite une discipline stricte

## Alternatives Considérées

1. **Runtime avec logique métier** : Rejeté car crée un couplage fort
2. **Runtime minimaliste** : Rejeté car ne fournit pas assez de fonctionnalités

## Références

- IOS v3 Implementation Roadmap
- Phase A: Runtime Foundation

---

**Approved by**: CTO  
**Implementation**: Phase A
