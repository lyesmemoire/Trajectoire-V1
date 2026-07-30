# ADR-005: Engines as Extraction/Detection Units

**Status**: Accepted  
**Date**: 30 juillet 2026  
**Context**: IOS v3 Architecture  

## Context

Les Engines sont les unités de traitement du système cognitif. Ils sont responsables de l'extraction et de la détection d'informations à partir des entrées.

## Decision

Les Engines ont une responsabilité **strictement limitée à l'extraction ou la détection**. Ils ne prennent **jamais de décision globale**.

### Responsabilités Autorisées

- Extraire des observations à partir du texte
- Détecter des preuves à partir des observations
- Détecter des contradictions à partir des preuves
- Analyser des patterns temporels
- Calculer des métriques locales

### Responsabilités Interdites

- **Jamais** de décision globale (ex: "Le candidat est senior")
- **Jamais** de jugement de valeur
- **Jamais** de conclusion métier
- **Jamais** de décision de terminaison
- **Jamais** de sélection de questions

### Architecture des Engines

```typescript
interface Engine<I extends EngineInput = EngineInput, E extends BaseEvent = BaseEvent> {
  readonly name: string;
  readonly version: string;
  execute(input: I): Promise<EngineResult<E>>;
}
```

### Exemples de Transformations

**Perception Engine**:
```
texte
    ↓
ObservationEvent
```

**Evidence Engine**:
```
Observation
    ↓
EvidenceEvent
```

**Contradiction Engine**:
```
Evidence
    ↓
ContradictionEvent
```

## Rationale

Cette séparation garantit :
- Engines focalisés sur une tâche unique
- Décisions globales déléguées aux Policies
- Testabilité des engines indépendamment
- Capacité de remplacer un engine sans affecter les décisions

## Consequences

### Positives

- Engines testables avec des entrées/sorties simples
- Logique de décision isolée dans les Policies
- Architecture modulaire et extensible
- Remplacement d'engine facilité

### Négatives

- Plus de composants à gérer
- Nécessite une coordination entre engines et policies
- Complexité accrue pour les décisions complexes

## Alternatives Considérées

1. **Engines avec décisions globales** : Rejeté car mélange extraction et décision
2. **Engines avec logique métier** : Rejeté car casse la séparation des responsabilités

## Références

- IOS v3 Implementation Roadmap
- Phase C: Core Engines
- ADR-001: CognitiveRuntime Responsibility
- ADR-004: Policies as Deterministic Business Logic

---

**Approved by**: CTO  
**Implementation**: Phase C
