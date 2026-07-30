# ADR-004: Policies as Deterministic Business Logic

**Status**: Accepted  
**Date**: 30 juillet 2026  
**Context**: IOS v3 Architecture  

## Context

Les Policies contiennent toute la logique métier du système cognitif. Elles sont responsables des décisions, validations et règles métier.

## Decision

Les Policies doivent être :
- **Testables individuellement** sans LLM
- **100% déterministes** en TypeScript
- **Indépendantes** les unes des autres
- **Composables** pour des décisions complexes

### Architecture des Policies

```typescript
interface Policy<TInput, TOutput> {
  name: string;
  version: string;
  evaluate(input: TInput, context: InvestigationContext): TOutput;
  isApplicable(context: InvestigationContext): boolean;
}
```

### Policies Requises

- `MinimumEvidencePolicy` - Validation du nombre minimum de preuves
- `TerminationPolicy` - Règles de terminaison d'investigation
- `ConfidencePolicy` - Seuils de confiance par compétence
- `QuestionSelectionPolicy` - Règles de sélection de questions
- `FollowUpPolicy` - Règles de questions de suivi
- `RiskPolicy` - Évaluation et gestion des risques
- `ContradictionPolicy` - Gestion des contradictions

### Règles Critiques

- **Jamais** de LLM dans une Policy
- **Jamais** de logique non déterministe
- **Toujours** testable sans dépendances externes
- **Toujours** documentée avec exemples

## Rationale

Cette séparation garantit :
- Logique métier testable sans LLM
- Décisions reproductibles et déterministes
- Capacité de tester les policies indépendamment
- Maintenance simplifiée de la logique métier

## Consequences

### Positives

- Policies testables sans LLM
- Décisions reproductibles
- Logique métier isolée et maintenable
- Tests rapides et fiables

### Négatives

- Plus de fichiers à gérer
- Nécessite une discipline stricte
- Complexité accrue pour les décisions complexes

## Alternatives Considérées

1. **Policies avec LLM** : Rejeté car non déterministe
2. **Logique métier dans les engines** : Rejeté car casse la séparation des responsabilités

## Références

- IOS v3 Implementation Roadmap
- Phase B: Domain Foundation
- ADR-001: CognitiveRuntime Responsibility

---

**Approved by**: CTO  
**Implementation**: Phase B
