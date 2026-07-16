# Intelligence Engine Migration Factory

## Overview

**Purpose**: Factory pour migrer les Intelligence Engines vers l'architecture cible de manière industrielle  
**Based on**: Forecast Golden Reference  
**Target**: Wave 1 (8 moteurs)

---

## Description

Cette Migration Factory contient les règles, transformations, validations et checklists pour migrer les Intelligence Engines vers l'architecture cible (Runtime → IntelligenceUseCase → Provider → AI SDK).

L'objectif est de permettre des migrations homogènes avec une réutilisation maximale (95% pour Wave 1).

---

## Structure

```
tools/intelligence-engine-migration/
├── README.md                    # Ce fichier
├── migration-rules.md           # Règles de migration (R001-R010)
├── migration-checklist.md       # Checklist de migration
└── migration-matrix.json        # Matrice de transformation (JSON)
```

---

## Utilisation

### 1. Lire la documentation

1. Lire `migration-rules.md` pour comprendre les règles de migration
2. Lire `migration-checklist.md` pour comprendre le processus de migration
3. Consulter `migration-matrix.json` pour comprendre la matrice de transformation

### 2. Analyser le moteur

1. Identifier le moteur dans `migration-matrix.json`
2. Vérifier les règles applicables
3. Vérifier les adaptations spécifiques
4. Estimer l'effort de migration

### 3. Appliquer les règles

1. Suivre la checklist dans `migration-checklist.md`
2. Appliquer les règles dans `migration-rules.md`
3. Adapter les spécificités du moteur
4. Valider les transformations

### 4. Valider

1. Suivre les validations dans `migration-checklist.md`
2. Lancer les tests
3. Vérifier le build, typecheck, ESLint
4. Documenter les changements

---

## Règles de Migration

### R001 — Supprimer aiOrchestrator

Supprimer l'import aiOrchestrator et ajouter intelligenceCoreModule et IntelligenceRequest.

**Applicabilité**: 100% des moteurs Wave 1

### R002 — Supprimer eventBus

Supprimer l'import eventBus et les events, ajouter EventPublisher.

**Applicabilité**: 25% des moteurs Wave 1

### R003 — Ajouter RuntimeContext

Ajouter RuntimeContext si le moteur utilise un pipeline complexe.

**Applicabilité**: 0% des moteurs Wave 1

### R004 — Ajouter ExecutionPipeline

Ajouter ExecutionPipeline si le moteur utilise un pipeline complexe.

**Applicabilité**: 0% des moteurs Wave 1

### R005 — Remplacer aiOrchestrator.execute()

Remplacer l'appel aiOrchestrator.execute() par IntelligenceUseCase.execute().

**Applicabilité**: 100% des moteurs Wave 1

### R006 — Remplacer result.data par result.output

Remplacer result.data par result.output dans toutes les occurrences.

**Applicabilité**: 100% des moteurs Wave 1

### R007 — Remplacer eventBus.publish()

Remplacer eventBus.publish() par EventPublisher.publish().

**Applicabilité**: 25% des moteurs Wave 1

### R008 — Conserver candidateAIBrain

Conserver candidateAIBrain car c'est une dépendance contextuelle nécessaire.

**Applicabilité**: 38% des moteurs Wave 1

### R009 — Conserver les prompts

Conserver les prompts car ils sont nécessaires pour l'exécution IA.

**Applicabilité**: 100% des moteurs Wave 1

### R010 — Conserver les DTOs

Conserver les DTOs Input/Output car ils définissent l'interface du moteur.

**Applicabilité**: 100% des moteurs Wave 1

---

## Matrice de Transformation

La matrice de transformation (`migration-matrix.json`) contient:

- Les règles de migration avec leurs transformations
- Les moteurs de Wave 1 avec leurs règles applicables
- Les adaptations spécifiques pour chaque moteur
- L'effort estimé pour chaque moteur
- Le score de compatibilité pour chaque moteur

---

## Wave 1 — Moteurs

| Moteur | Classe | Règles Applicables | Adaptations Spécifiques | Effort Estimé | Compatibilité |
|--------|--------|-------------------|-------------------------|---------------|---------------|
| recruiterQuestionAIEngine | A | R001, R005, R006, R008, R009, R010 | Logique Brain, construction variables | 2h | 95% |
| recruiterNotesAIEngine | A | R001, R005, R006, R009, R010 | Aucune | 2h | 95% |
| decisionEstimationAIEngine | A | R001, R005, R006, R009, R010 | Aucune | 2h | 95% |
| executiveSummaryAIEngine | A | R001, R005, R006, R009, R010 | Aucune | 2h | 95% |
| coachEngine | A | R009, R010 | Pas de migration IA requise | 2h | 100% |
| dailyCoachAIEngine | A | R001, R005, R006, R008, R009, R010 | Logique cache Brain, stockage Brain | 3h | 90% |
| careerAnalysisAIEngine | A | R001, R002, R005, R006, R007, R008, R009, R010 | Logique cache Brain, stockage Brain, event | 3h | 90% |
| atsAIEngine | A | R001, R002, R005, R006, R007, R009, R010 | Publication event | 3h | 90% |

**Total**: 8 moteurs, 19h estimées, compatibilité moyenne 93%

---

## Couverture

**Couverture estimée**: 95% de la migration d'un moteur Wave 1 peut être réalisée en appliquant ces règles.

**Adaptations restantes**: 5% correspond à la logique métier spécifique à chaque moteur (cache Brain, stockage Brain, publication d'évents).

---

## Support

### Documentation

- ADR-020: Intelligence Engine Standard
- ADR-021: Intelligence Runtime Architecture
- SPRINT_614_PROVIDER_IMPLEMENTATION.md
- SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md
- ENGINE_MIGRATION_MATRIX.md
- ENGINE_MIGRATION_PLAYBOOK.md

### Exemples

- Forecast (Golden Reference)
- `core/intelligence/engines/careerCopilotForecastEngine.ts`

### Questions

Pour toute question sur la migration, consulter:
- L'équipe architecture
- Le rapport SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- ENGINE_MIGRATION_PLAYBOOK.md
- Le présent README

---

## Conclusion

Cette Migration Factory est basée sur l'expérience de migration de Forecast (Sprint 6.15) et l'analyse des 8 moteurs de Wave 1 (Sprint 6.16). Elle est conçue pour être un guide reproductible pour migrer tous les moteurs vers l'architecture cible.

En suivant cette factory, chaque migration devrait:
- Être cohérente avec les autres migrations
- Respecter le Intelligence Engine Standard
- Minimiser les risques de régression
- Être documentée de manière standardisée

**Forecast est la Golden Reference. Utilisez-le comme modèle.**
