# ADR-003: Reducer as Single Mutation Point

**Status**: Accepted  
**Date**: 30 juillet 2026  
**Context**: IOS v3 Architecture  

## Context

Le KnowledgeGraphReducer est responsable de transformer les événements en état cognitif. C'est le seul point autorisé pour muter l'état.

## Decision

Toute mutation de l'état doit passer par le pattern suivant :

```
Events
    ↓
Reducer
    ↓
Snapshot
```

### Règles Critiques

- **Jamais** de `Engine → Snapshot` direct
- **Jamais** de mutation directe de l'état
- **Uniquement** le Reducer peut muter l'état
- Les snapshots sont immuables
- Le Reducer crée de nouveaux snapshots à partir des événements

### Architecture

```typescript
interface KnowledgeGraphReducer {
  reduce(events: BaseEvent[], previousState: CognitiveState): CognitiveState;
  reduceIncremental(event: BaseEvent, currentState: CognitiveState): CognitiveState;
  validateState(state: CognitiveState): ValidationResult;
}
```

## Rationale

Cette séparation garantit :
- Immutabilité des snapshots
- Traçabilité complète des mutations
- Capacité de rejouer les événements
- Debugging simplifié
- Testabilité du Reducer indépendamment

## Consequences

### Positives

- Snapshots immuables et traçables
- Rejeu des événements possible
- Debugging simplifié avec historique
- Testabilité du Reducer

### Négatives

- Plus de copies d'état (performance)
- Nécessite une gestion efficace de la mémoire
- Complexité accrue pour les opérations complexes

## Alternatives Considérées

1. **Mutation directe par les engines** : Rejeté car casse l'immutabilité
2. **Multiple reducers** : Rejeté car complexifie l'architecture

## Références

- IOS v3 Implementation Roadmap
- Phase B: Domain Foundation
- ADR-001: CognitiveRuntime Responsibility

---

**Approved by**: CTO  
**Implementation**: Phase B
