# ADR-002: EventBus Type-Agnostic Design

**Status**: Accepted  
**Date**: 30 juillet 2026  
**Context**: IOS v3 Architecture  

## Context

L'EventBus est le bus d'événements inter-moteurs du système cognitif. Il permet la communication entre les composants via un pattern publish/subscribe.

## Decision

Le Runtime ne doit **jamais connaître le type des événements**. L'EventBus doit être complètement type-agnostic.

### Interface Autorisée

```typescript
interface EventBus {
  publish(event: BaseEvent): void;
  subscribe(pattern: string, handler: EventHandler): void;
  unsubscribe(pattern: string, handler: EventHandler): void;
  getHistory(sessionId: string): BaseEvent[];
}
```

### Règles Critiques

- **Jamais** de `if (event.type === ...)`
- **Jamais** de `switch (event.eventType)`
- **Jamais** de logique basée sur le type d'événement
- **Uniquement** `publish(event)` et `subscribe(pattern, handler)`
- Filtrage par pattern string uniquement

## Rationale

Cette séparation garantit :
- Découplage complet entre runtime et types d'événements
- Capacité d'ajouter de nouveaux types d'événements sans modifier le runtime
- Extensibilité du système sans refactoring
- Respect du principe Open/Closed

## Consequences

### Positives

- Runtime indépendant des types d'événements
- Ajout de nouveaux événements sans modification du runtime
- Architecture extensible et maintenable

### Négatives

- Nécessite un pattern matching robuste
- Plus difficile de déboguer sans connaissance des types
- Nécessite une documentation claire des patterns

## Alternatives Considérées

1. **EventBus avec connaissance des types** : Rejeté car crée un couplage fort
2. **EventBus avec typage générique** : Rejeté car complexifie inutilement

## Références

- IOS v3 Implementation Roadmap
- Phase A: Runtime Foundation
- ADR-001: CognitiveRuntime Responsibility

---

**Approved by**: CTO  
**Implementation**: Phase A
