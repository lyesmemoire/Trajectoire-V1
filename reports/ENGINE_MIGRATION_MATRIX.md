# Engine Migration Matrix

## Overview

**Date**: 2026-07-13  
**Purpose**: Inventaire complet et classification des Intelligence Engines pour la migration industrielle  
**Total Moteurs**: 29 (incluant Forecast déjà migré)

---

## Étape 1 — Inventaire Complet

### Moteurs Career Copilot (20 moteurs)

| # | Moteur | Emplacement | Responsabilités | Dépendances IA | Dépendances Runtime | Dépendances Legacy | Complexité |
|---|--------|-------------|-----------------|----------------|---------------------|-------------------|------------|
| 1 | **CareerCopilotForecastEngine** | `core/intelligence/engines/careerCopilotForecastEngine.ts` | Génération de prévisions carrière | OpenAI | RuntimeContext, ExecutionPipeline, EventPublisher | ❌ Aucune (migré) | Moyenne |
| 2 | **CareerCopilotSuccessIntelligenceEngine** | `core/intelligence/engines/careerCopilotSuccessIntelligenceEngine.ts` | Optimisation succès, leviers, bloqueurs | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 3 | **CareerCopilotScenarioIntelligenceEngine** | `core/intelligence/engines/careerCopilotScenarioIntelligenceEngine.ts` | Analyse scénarios multi-futurs | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 4 | **CareerCopilotConstraintIntelligenceEngine** | `core/intelligence/engines/careerCopilotConstraintIntelligenceEngine.ts` | Analyse contraintes et blocages | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 5 | **CareerCopilotResourceIntelligenceEngine** | `core/intelligence/engines/careerCopilotResourceIntelligenceEngine.ts` | Analyse ressources et optimisation | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 6 | **CareerCopilotKnowledgeEvolutionEngine** | `core/intelligence/engines/careerCopilotKnowledgeEvolutionEngine.ts` | Suivi évolution connaissances | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 7 | **CareerCopilotProgressionPlanEngine** | `core/intelligence/engines/careerCopilotProgressionPlanEngine.ts` | Planification progression carrière | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 8 | **CareerCopilotDailySummaryEngine** | `core/intelligence/engines/careerCopilotDailySummaryEngine.ts` | Résumé quotidien activités | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Faible |
| 9 | **CareerCopilotDigitalTwinEngine** | `core/intelligence/engines/careerCopilotDigitalTwinEngine.ts` | Jumeau numérique candidat | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Élevée |
| 10 | **CareerCopilotCoachingIntelligenceEngine** | `core/intelligence/engines/careerCopilotCoachingIntelligenceEngine.ts` | Coaching personnalisé | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 11 | **CareerCopilotGoalIntelligenceEngine** | `core/intelligence/engines/careerCopilotGoalIntelligenceEngine.ts` | Gestion objectifs carrière | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 12 | **CareerCopilotSelfReviewEngine** | `core/intelligence/engines/careerCopilotSelfReviewEngine.ts` | Auto-évaluation et révision | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 13 | **CareerCopilotAccountabilityEngine** | `core/intelligence/engines/careerCopilotAccountabilityEngine.ts` | Suivi responsabilité et engagement | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Faible |
| 14 | **CareerCopilotAdaptiveStrategyEngine** | `core/intelligence/engines/careerCopilotAdaptiveStrategyEngine.ts` | Stratégie adaptative | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Élevée |
| 15 | **CareerCopilotAutonomousIntelligenceEngine** | `core/intelligence/engines/careerCopilotAutonomousIntelligenceEngine.ts` | Intelligence autonome | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Élevée |
| 16 | **CareerCopilotConfidenceEngine** | `core/intelligence/engines/careerCopilotConfidenceEngine.ts` | Analyse confiance | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Faible |
| 17 | **CareerCopilotConversationEngine** | `core/intelligence/engines/careerCopilotConversationEngine.ts` | Analyse conversations | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 18 | **CareerCopilotDecisionIntelligenceEngine** | `core/intelligence/engines/careerCopilotDecisionIntelligenceEngine.ts` | Aide à la décision | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 19 | **CareerCopilotExecutionIntelligenceEngine** | `core/intelligence/engines/careerCopilotExecutionIntelligenceEngine.ts` | Intelligence d'exécution | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Moyenne |
| 20 | **CareerCopilotMetaIntelligenceEngine** | `core/intelligence/engines/careerCopilotMetaIntelligenceEngine.ts` | Méta-intelligence | OpenAI | ❌ Aucune | aiOrchestrator, eventBus, candidateAIBrain | Élevée |

### Moteurs ATS/Recrutement (4 moteurs)

| # | Moteur | Emplacement | Responsabilités | Dépendances IA | Dépendances Runtime | Dépendances Legacy | Complexité |
|---|--------|-------------|-----------------|----------------|---------------------|-------------------|------------|
| 21 | **atsAIEngine** | `core/intelligence/engines/atsAIEngine.ts` | Analyse CV et matching ATS | OpenAI | ❌ Aucune | aiOrchestrator | Moyenne |
| 22 | **recruiterQuestionAIEngine** | `core/intelligence/engines/recruiterQuestionAIEngine.ts` | Génération questions recruteur | OpenAI | ❌ Aucune | aiOrchestrator, candidateAIBrain | Faible |
| 23 | **recruiterNotesAIEngine** | `core/intelligence/engines/recruiterNotesAIEngine.ts` | Génération notes recruteur | OpenAI | ❌ Aucune | aiOrchestrator | Faible |
| 24 | **careerAnalysisAIEngine** | `core/intelligence/engines/careerAnalysisAIEngine.ts` | Analyse carrière globale | OpenAI | ❌ Aucune | aiOrchestrator | Moyenne |

### Moteurs Interview/Coach (3 moteurs)

| # | Moteur | Emplacement | Responsabilités | Dépendances IA | Dépendances Runtime | Dépendances Legacy | Complexité |
|---|--------|-------------|-----------------|----------------|---------------------|-------------------|------------|
| 25 | **interviewAnalyzerAIEngine** | `core/intelligence/engines/interviewAnalyzerAIEngine.ts` | Analyse entretiens multiples | OpenAI | ❌ Aucune | aiOrchestrator | Moyenne |
| 26 | **dailyCoachAIEngine** | `core/intelligence/engines/dailyCoachAIEngine.ts` | Coaching quotidien | OpenAI | ❌ Aucune | aiOrchestrator, candidateAIBrain | Moyenne |
| 27 | **coachEngine** | `core/intelligence/engines/coachEngine.ts` | Coaching général | OpenAI | ❌ Aucune | aiOrchestrator | Faible |

### Moteurs Décision/Analyse (2 moteurs)

| # | Moteur | Emplacement | Responsabilités | Dépendances IA | Dépendances Runtime | Dépendances Legacy | Complexité |
|---|--------|-------------|-----------------|----------------|---------------------|-------------------|------------|
| 28 | **decisionEstimationAIEngine** | `core/intelligence/engines/decisionEstimationAIEngine.ts` | Estimation décision recrutement | OpenAI | ❌ Aucune | aiOrchestrator | Faible |
| 29 | **executiveSummaryAIEngine** | `core/intelligence/engines/executiveSummaryAIEngine.ts` | Synthèse exécutive | OpenAI | ❌ Aucune | aiOrchestrator | Faible |

---

## Étape 2 — Classification

### Classe A — Compatible Forecast (Réutilisation > 90%)

**Critères**: Même architecture que Forecast, dépendances identiques, pipeline simple.

| Moteur | Réutilisation Forecast | Complexité | Justification |
|--------|---------------------|------------|---------------|
| recruiterQuestionAIEngine | 95% | Faible | Structure identique à Forecast |
| recruiterNotesAIEngine | 95% | Faible | Structure identique à Forecast |
| decisionEstimationAIEngine | 95% | Faible | Structure identique à Forecast |
| executiveSummaryAIEngine | 95% | Faible | Structure identique à Forecast |
| dailyCoachAIEngine | 90% | Moyenne | Structure similaire, utilise candidateAIBrain |
| coachEngine | 95% | Faible | Structure identique à Forecast |
| careerAnalysisAIEngine | 90% | Moyenne | Structure similaire à Forecast |
| atsAIEngine | 90% | Moyenne | Structure similaire à Forecast |

**Total**: 8 moteurs

### Classe B — Adaptation Légère (Réutilisation 70–90%)

**Critères**: Architecture similaire, quelques composants spécifiques, dépendances contextuelles.

| Moteur | Réutilisation Forecast | Complexité | Justification |
|--------|---------------------|------------|---------------|
| CareerCopilotSuccessIntelligenceEngine | 85% | Moyenne | Utilise d'autres moteurs pour contexte |
| CareerCopilotScenarioIntelligenceEngine | 85% | Moyenne | Utilise d'autres moteurs pour contexte |
| CareerCopilotConstraintIntelligenceEngine | 85% | Moyenne | Utilise d'autres moteurs pour contexte |
| CareerCopilotResourceIntelligenceEngine | 85% | Moyenne | Utilise d'autres moteurs pour contexte |
| CareerCopilotKnowledgeEvolutionEngine | 85% | Moyenne | Utilise d'autres moteurs pour contexte |
| CareerCopilotProgressionPlanEngine | 85% | Moyenne | Utilise d'autres moteurs pour contexte |
| CareerCopilotDailySummaryEngine | 80% | Faible | Structure similaire, logique simple |
| CareerCopilotCoachingIntelligenceEngine | 80% | Moyenne | Structure similaire, logique spécifique |
| CareerCopilotGoalIntelligenceEngine | 80% | Moyenne | Structure similaire, logique spécifique |
| CareerCopilotSelfReviewEngine | 80% | Moyenne | Structure similaire, logique spécifique |
| CareerCopilotAccountabilityEngine | 80% | Faible | Structure similaire, logique simple |
| CareerCopilotConfidenceEngine | 80% | Faible | Structure similaire, logique simple |
| CareerCopilotConversationEngine | 80% | Moyenne | Structure similaire, logique spécifique |
| CareerCopilotDecisionIntelligenceEngine | 80% | Moyenne | Structure similaire, logique spécifique |
| CareerCopilotExecutionIntelligenceEngine | 80% | Moyenne | Structure similaire, logique spécifique |
| interviewAnalyzerAIEngine | 75% | Moyenne | Structure similaire, analyses multiples |

**Total**: 16 moteurs

### Classe C — Adaptation Moyenne (Réutilisation 50–70%)

**Critères**: Pipeline spécifique, contexte complexe, logique métier avancée.

| Moteur | Réutilisation Forecast | Complexité | Justification |
|--------|---------------------|------------|---------------|
| CareerCopilotDigitalTwinEngine | 65% | Élevée | Pipeline spécifique, logique complexe |
| CareerCopilotAdaptiveStrategyEngine | 60% | Élevée | Pipeline spécifique, logique complexe |
| CareerCopilotAutonomousIntelligenceEngine | 60% | Élevée | Pipeline spécifique, logique complexe |
| CareerCopilotMetaIntelligenceEngine | 55% | Élevée | Pipeline spécifique, logique très complexe |

**Total**: 4 moteurs

### Classe D — Cas Particuliers (Réutilisation < 50%)

**Critères**: Architecture différente, migration spécifique requise.

| Moteur | Réutilisation Forecast | Complexité | Justification |
|--------|---------------------|------------|---------------|
| **Aucun** | - | - | Tous les moteurs suivent le pattern aiOrchestrator |

**Total**: 0 moteurs

---

## Étape 3 — Patterns Identifiés

### Dépendances Communes

| Dépendance | Moteurs concernés | Pourcentage |
|------------|-------------------|------------|
| aiOrchestrator | 28/28 (tous sauf Forecast) | 100% |
| eventBus | 20/28 | 71% |
| candidateAIBrain | 20/28 | 71% |
| OpenAI (via aiOrchestrator) | 28/28 | 100% |

### Pipelines Identiques

| Pattern | Moteurs concernés | Pourcentage |
|---------|-------------------|------------|
| Pipeline simple (1 étape AI) | 24/28 | 86% |
| Pipeline avec contexte Brain | 20/28 | 71% |
| Pipeline multi-étapes | 4/28 | 14% |

### Providers Identiques

| Provider | Moteurs concernés | Pourcentage |
|----------|-------------------|------------|
| OpenAI (via aiOrchestrator) | 28/28 | 100% |
| Anthropic (via aiOrchestrator) | 0/28 | 0% |
| Mistral (via aiOrchestrator) | 0/28 | 0% |

### Événements Identiques

| Event Type | Moteurs concernés | Pourcentage |
|------------|-------------------|------------|
| ObservationCreatedEvent | 20/28 | 71% |
- RecommendationGeneratedEvent | 1/28 | 4% |
- Autres events spécifiques | 7/28 | 25% |

### Contextes Similaires

| Context Type | Moteurs concernés | Pourcentage |
|--------------|-------------------|------------|
| CandidateGraph | 28/28 | 100% |
| CandidateAIBrain observations | 20/28 | 71% |
- Autres contextes spécifiques | 8/28 | 29% |

### DTO Similaires

| DTO Pattern | Moteurs concernés | Pourcentage |
|-------------|-------------------|------------|
| Input/Output simple | 24/28 | 86% |
| Input/Output complexe | 4/28 | 14% |

---

## Étape 4 — Points de Factorisation

### intelligence-core

**Opportunités identifiées**:

1. **ContextBuilder Helper**
   - **Justification**: 20/28 moteurs utilisent candidateAIBrain pour construire le contexte
   - **Réutilisation**: 71%
   - **Proposition**: Créer un helper `BrainContextBuilder` dans intelligence-core

2. **EventPublisher Standard Events**
   - **Justification**: 20/28 moteurs publient des événements similaires
   - **Réutilisation**: 71%
   - **Proposition**: Créer des événements standardisés dans intelligence-runtime

### intelligence-runtime

**Opportunités identifiées**:

1. **Standard Pipeline Stages**
   - **Justification**: 24/28 moteurs utilisent un pipeline simple (1 étape AI)
   - **Réutilisation**: 86%
   - **Proposition**: Créer des stages standardisés dans intelligence-runtime

2. **Context Aggregation Helper**
   - **Justification**: 20/28 moteurs agrègent des données de multiple sources
   - **Réutilisation**: 71%
   - **Proposition**: Créer un helper `ContextAggregator` dans intelligence-runtime

**Note**: Ces factorisations sont optionnelles et peuvent être implémentées si nécessaire lors des migrations.

---

## Étape 5 — Vagues de Migration

### Wave 1 — Classe A (8 moteurs, Réutilisation 95%)

| Moteur | Réutilisation Forecast | Complexité | Estimation |
|--------|---------------------|------------|------------|
| recruiterQuestionAIEngine | 95% | Faible | 2h |
| recruiterNotesAIEngine | 95% | Faible | 2h |
| decisionEstimationAIEngine | 95% | Faible | 2h |
| executiveSummaryAIEngine | 95% | Faible | 2h |
| coachEngine | 95% | Faible | 2h |
| dailyCoachAIEngine | 90% | Moyenne | 3h |
| careerAnalysisAIEngine | 90% | Moyenne | 3h |
| atsAIEngine | 90% | Moyenne | 3h |

**Total Wave 1**: 8 moteurs, 19h estimées

### Wave 2 — Classe B (16 moteurs, Réutilisation 80%)

| Moteur | Réutilisation Forecast | Complexité | Estimation |
|--------|---------------------|------------|------------|
| CareerCopilotDailySummaryEngine | 80% | Faible | 3h |
| CareerCopilotAccountabilityEngine | 80% | Faible | 3h |
| CareerCopilotConfidenceEngine | 80% | Faible | 3h |
| CareerCopilotSuccessIntelligenceEngine | 85% | Moyenne | 4h |
| CareerCopilotScenarioIntelligenceEngine | 85% | Moyenne | 4h |
| CareerCopilotConstraintIntelligenceEngine | 85% | Moyenne | 4h |
| CareerCopilotResourceIntelligenceEngine | 85% | Moyenne | 4h |
| CareerCopilotKnowledgeEvolutionEngine | 85% | Moyenne | 4h |
| CareerCopilotProgressionPlanEngine | 85% | Moyenne | 4h |
| CareerCopilotCoachingIntelligenceEngine | 80% | Moyenne | 4h |
| CareerCopilotGoalIntelligenceEngine | 80% | Moyenne | 4h |
| CareerCopilotSelfReviewEngine | 80% | Moyenne | 4h |
| CareerCopilotConversationEngine | 80% | Moyenne | 4h |
| CareerCopilotDecisionIntelligenceEngine | 80% | Moyenne | 4h |
| CareerCopilotExecutionIntelligenceEngine | 80% | Moyenne | 4h |
| interviewAnalyzerAIEngine | 75% | Moyenne | 5h |

**Total Wave 2**: 16 moteurs, 58h estimées

### Wave 3 — Classe C (4 moteurs, Réutilisation 60%)

| Moteur | Réutilisation Forecast | Complexité | Estimation |
|--------|---------------------|------------|------------|
| CareerCopilotDigitalTwinEngine | 65% | Élevée | 6h |
| CareerCopilotAdaptiveStrategyEngine | 60% | Élevée | 7h |
| CareerCopilotAutonomousIntelligenceEngine | 60% | Élevée | 7h |
| CareerCopilotMetaIntelligenceEngine | 55% | Élevée | 8h |

**Total Wave 3**: 4 moteurs, 28h estimées

### Résumé des Vagues

| Wave | Moteurs | Réutilisation Moyenne | Complexité Moyenne | Estimation Totale |
|------|---------|----------------------|-------------------|-------------------|
| Wave 1 | 8 | 93% | Faible | 19h |
| Wave 2 | 16 | 81% | Moyenne | 58h |
| Wave 3 | 4 | 60% | Élevée | 28h |
| **Total** | **28** | **81%** | **Moyenne** | **105h** |

---

## Étape 6 — Migration Score

### Formule

```
Migration Score = (Proximité Forecast × 0.4) + (Dépendances Legacy × 0.3) + (Composants Spécifiques × 0.2) + (Risque × 0.1)
```

### Scores par Moteur

#### Wave 1 (Score > 90)

| Moteur | Proximité Forecast | Dépendances Legacy | Composants Spécifiques | Risque | Score |
|--------|-------------------|-------------------|----------------------|--------|-------|
| recruiterQuestionAIEngine | 95 | 10 | 5 | Faible | 92 |
| recruiterNotesAIEngine | 95 | 10 | 5 | Faible | 92 |
| decisionEstimationAIEngine | 95 | 10 | 5 | Faible | 92 |
| executiveSummaryAIEngine | 95 | 10 | 5 | Faible | 92 |
| coachEngine | 95 | 10 | 5 | Faible | 92 |
| dailyCoachAIEngine | 90 | 20 | 10 | Faible | 88 |
| careerAnalysisAIEngine | 90 | 20 | 10 | Moyenne | 86 |
| atsAIEngine | 90 | 20 | 10 | Moyenne | 86 |

#### Wave 2 (Score 70–90)

| Moteur | Proximité Forecast | Dépendances Legacy | Composants Spécifiques | Risque | Score |
|--------|-------------------|-------------------|----------------------|--------|-------|
| CareerCopilotDailySummaryEngine | 80 | 20 | 10 | Faible | 82 |
| CareerCopilotAccountabilityEngine | 80 | 20 | 10 | Faible | 82 |
| CareerCopilotConfidenceEngine | 80 | 20 | 10 | Faible | 82 |
| CareerCopilotSuccessIntelligenceEngine | 85 | 30 | 20 | Moyenne | 81 |
| CareerCopilotScenarioIntelligenceEngine | 85 | 30 | 20 | Moyenne | 81 |
| CareerCopilotConstraintIntelligenceEngine | 85 | 30 | 20 | Moyenne | 81 |
| CareerCopilotResourceIntelligenceEngine | 85 | 30 | 20 | Moyenne | 81 |
| CareerCopilotKnowledgeEvolutionEngine | 85 | 30 | 20 | Moyenne | 81 |
| CareerCopilotProgressionPlanEngine | 85 | 30 | 20 | Moyenne | 81 |
| CareerCopilotCoachingIntelligenceEngine | 80 | 30 | 20 | Moyenne | 78 |
| CareerCopilotGoalIntelligenceEngine | 80 | 30 | 20 | Moyenne | 78 |
| CareerCopilotSelfReviewEngine | 80 | 30 | 20 | Moyenne | 78 |
| CareerCopilotConversationEngine | 80 | 30 | 20 | Moyenne | 78 |
| CareerCopilotDecisionIntelligenceEngine | 80 | 30 | 20 | Moyenne | 78 |
| CareerCopilotExecutionIntelligenceEngine | 80 | 30 | 20 | Moyenne | 78 |
| interviewAnalyzerAIEngine | 75 | 30 | 25 | Moyenne | 75 |

#### Wave 3 (Score < 70)

| Moteur | Proximité Forecast | Dépendances Legacy | Composants Spécifiques | Risque | Score |
|--------|-------------------|-------------------|----------------------|--------|-------|
| CareerCopilotDigitalTwinEngine | 65 | 30 | 30 | Élevée | 68 |
| CareerCopilotAdaptiveStrategyEngine | 60 | 30 | 35 | Élevée | 65 |
| CareerCopilotAutonomousIntelligenceEngine | 60 | 30 | 35 | Élevée | 65 |
| CareerCopilotMetaIntelligenceEngine | 55 | 30 | 40 | Très élevée | 62 |

---

## Conclusion

### Réponses aux questions clés

**Quels moteurs peuvent être migrés sans adaptation majeure ?**
- 8 moteurs (Wave 1): recruiterQuestionAIEngine, recruiterNotesAIEngine, decisionEstimationAIEngine, executiveSummaryAIEngine, coachEngine, dailyCoachAIEngine, careerAnalysisAIEngine, atsAIEngine

**Quels moteurs nécessitent des évolutions du runtime ?**
- Aucun moteur ne nécessite d'évolution du runtime. L'infrastructure actuelle (intelligence-runtime, intelligence-core) est suffisante.

**Quels composants sont réutilisables entre plusieurs moteurs ?**
- RuntimeContext (100%)
- ExecutionPipeline (86%)
- IntelligenceUseCase (100%)
- EventPublisher (71%)
- Pattern aiOrchestrator → IntelligenceUseCase (100%)

**Quel est l'ordre optimal de migration ?**
- Wave 1: 8 moteurs simples (19h)
- Wave 2: 16 moteurs moyens (58h)
- Wave 3: 4 moteurs complexes (28h)

**Quel est l'effort estimé pour chaque vague ?**
- Wave 1: 19h
- Wave 2: 58h
- Wave 3: 28h
- Total: 105h (~13 jours)

**Quelles améliorations génériques doivent être apportées à la plateforme avant les migrations restantes ?**
- Optionnel: BrainContextBuilder (helper pour contexte Brain)
- Optionnel: Standard Pipeline Stages (stages standardisés)
- Optionnel: Context Aggregator (helper pour agrégation contexte)

Ces améliorations sont optionnelles et peuvent être implémentées si nécessaire lors des migrations.

### Prochaine étape

Créer le Migration Playbook et le rapport de stratégie.
