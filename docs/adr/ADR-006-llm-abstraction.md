# ADR-006: LLM as Co-processor with Deterministic Validation

**Status**: Accepted  
**Date**: 30 juillet 2026  
**Context**: IOS v3 Architecture  

## Context

Le LLM est utilisé comme coprocesseur pour l'extraction d'informations à partir de texte non structuré. Il ne doit jamais être utilisé pour la logique métier.

## Decision

Le LLM est **uniquement utilisé pour l'extraction brute**. Toute la logique métier reste en TypeScript déterministe.

### Architecture Générale

```
LLM (extraction brute)
    ↓
TypeScript (validation)
    ↓
TypeScript (logique métier)
    ↓
Events
```

### Cas d'Usage

**Perception Engine**:
```
LLM: Extraction d'observations
    ↓
TypeScript: Validation et post-processing
    ↓
ObservationEvent
```

**Evidence Engine**:
```
LLM: Qualification des preuves
    ↓
TypeScript: Validation des scores
    ↓
EvidenceEvent
```

**Temporal Engine**:
```
LLM: Extraction temporelle (dates, durées)
    ↓
TimelineBuilder (TypeScript): Construction de timeline
    ↓
TemporalValidator (TypeScript): Validation de cohérence
    ↓
TemporalEvent
```

**Confidence Engine**:
```
NO LLM
100% TypeScript
100% déterministe
```

### Règles Critiques

- **Jamais** de LLM pour la logique métier
- **Jamais** de LLM pour les décisions
- **Jamais** de LLM pour la validation
- **Toujours** validation TypeScript après extraction LLM
- **Toujours** logique métier en TypeScript déterministe

## Rationale

Cette séparation garantit :
- Décisions reproductibles et déterministes
- Testabilité de la logique métier sans LLM
- Capacité de remplacer le LLM sans affecter la logique métier
- Coûts LLM maîtrisés
- Performance prévisible

## Consequences

### Positives

- Logique métier testable sans LLM
- Décisions reproductibles
- Coûts LLM maîtrisés
- Remplacement du LLM facilité

### Négatives

- Plus de code TypeScript à maintenir
- Complexité accrue pour la validation
- Nécessite une discipline stricte

## Alternatives Considérées

1. **LLM pour la logique métier** : Rejeté car non déterministe
2. **LLM pour la validation** : Rejeté car non reproductible
3. **LLM pour les décisions** : Rejeté car non déterministe

## Références

- IOS v3 Implementation Roadmap
- Phase C: Core Engines
- ADR-004: Policies as Deterministic Business Logic
- ADR-005: Engines as Extraction/Detection Units

---

**Approved by**: CTO  
**Implementation**: Phase C
