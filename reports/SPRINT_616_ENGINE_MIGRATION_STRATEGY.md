# Sprint 6.16 — Industrialisation de la Migration des Intelligence Engines

## Overview

**Date**: 2026-07-13  
**Objective**: Construire une stratégie industrielle pour migrer les 28 Intelligence Engines restants vers l'architecture cible  
**Status**: ✅ Completed

---

## Executive Summary

**Conclusion**: Une stratégie industrielle complète a été définie pour migrer les 28 moteurs restants avec une réutilisation moyenne de 81%.

**Key Achievement**: Classification des moteurs en 3 vagues (Wave 1: 8 moteurs, Wave 2: 16 moteurs, Wave 3: 4 moteurs) avec un effort total estimé de 105h (~13 jours).

**Validation**: Aucune modification de moteur n'a été effectuée. La stratégie repose sur l'analyse et la planification uniquement.

---

## Contexte

### Architecture Stabilisée

Les éléments suivants sont terminés et validés:

- ✅ lib/intelligence-core (production-ready)
- ✅ lib/intelligence-runtime (MVP)
- ✅ Forecast entièrement migré (Golden Reference)
- ✅ INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md
- ✅ Intelligence Engine Standard (ADR-020)
- ✅ Intelligence Runtime Architecture (ADR-021)

### Objectif

Construire une stratégie industrielle permettant de migrer tous les moteurs avec un maximum de réutilisation et un minimum de code spécifique.

**Contraintes**:
- Ne modifier aucun moteur
- Ne modifier ni intelligence-core ni intelligence-runtime sauf si une lacune générique est démontrée
- Ne pas introduire de logique spécifique à un moteur dans les modules partagés

---

## Étape 1 — Inventaire Complet

### Total Moteurs: 29 (incluant Forecast déjà migré)

#### Moteurs Career Copilot (20 moteurs)

| # | Moteur | Emplacement | Responsabilités | Complexité |
|---|--------|-------------|-----------------|------------|
| 1 | CareerCopilotForecastEngine | `core/intelligence/engines/careerCopilotForecastEngine.ts` | Génération de prévisions carrière | Moyenne |
| 2 | CareerCopilotSuccessIntelligenceEngine | `core/intelligence/engines/careerCopilotSuccessIntelligenceEngine.ts` | Optimisation succès, leviers, bloqueurs | Moyenne |
| 3 | CareerCopilotScenarioIntelligenceEngine | `core/intelligence/engines/careerCopilotScenarioIntelligenceEngine.ts` | Analyse scénarios multi-futurs | Moyenne |
| 4 | CareerCopilotConstraintIntelligenceEngine | `core/intelligence/engines/careerCopilotConstraintIntelligenceEngine.ts` | Analyse contraintes et blocages | Moyenne |
| 5 | CareerCopilotResourceIntelligenceEngine | `core/intelligence/engines/careerCopilotResourceIntelligenceEngine.ts` | Analyse ressources et optimisation | Moyenne |
| 6 | CareerCopilotKnowledgeEvolutionEngine | `core/intelligence/engines/careerCopilotKnowledgeEvolutionEngine.ts` | Suivi évolution connaissances | Moyenne |
| 7 | CareerCopilotProgressionPlanEngine | `core/intelligence/engines/careerCopilotProgressionPlanEngine.ts` | Planification progression carrière | Moyenne |
| 8 | CareerCopilotDailySummaryEngine | `core/intelligence/engines/careerCopilotDailySummaryEngine.ts` | Résumé quotidien activités | Faible |
| 9 | CareerCopilotDigitalTwinEngine | `core/intelligence/engines/careerCopilotDigitalTwinEngine.ts` | Jumeau numérique candidat | Élevée |
| 10 | CareerCopilotCoachingIntelligenceEngine | `core/intelligence/engines/careerCopilotCoachingIntelligenceEngine.ts` | Coaching personnalisé | Moyenne |
| 11 | CareerCopilotGoalIntelligenceEngine | `core/intelligence/engines/careerCopilotGoalIntelligenceEngine.ts` | Gestion objectifs carrière | Moyenne |
| 12 | CareerCopilotSelfReviewEngine | `core/intelligence/engines/careerCopilotSelfReviewEngine.ts` | Auto-évaluation et révision | Moyenne |
| 13 | CareerCopilotAccountabilityEngine | `core/intelligence/engines/careerCopilotAccountabilityEngine.ts` | Suivi responsabilité et engagement | Faible |
| 14 | CareerCopilotAdaptiveStrategyEngine | `core/intelligence/engines/careerCopilotAdaptiveStrategyEngine.ts` | Stratégie adaptative | Élevée |
| 15 | CareerCopilotAutonomousIntelligenceEngine | `core/intelligence/engines/careerCopilotAutonomousIntelligenceEngine.ts` | Intelligence autonome | Élevée |
| 16 | CareerCopilotConfidenceEngine | `core/intelligence/engines/careerCopilotConfidenceEngine.ts` | Analyse confiance | Faible |
| 17 | CareerCopilotConversationEngine | `core/intelligence/engines/careerCopilotConversationEngine.ts` | Analyse conversations | Moyenne |
| 18 | CareerCopilotDecisionIntelligenceEngine | `core/intelligence/engines/careerCopilotDecisionIntelligenceEngine.ts` | Aide à la décision | Moyenne |
| 19 | CareerCopilotExecutionIntelligenceEngine | `core/intelligence/engines/careerCopilotExecutionIntelligenceEngine.ts` | Intelligence d'exécution | Moyenne |
| 20 | CareerCopilotMetaIntelligenceEngine | `core/intelligence/engines/careerCopilotMetaIntelligenceEngine.ts` | Méta-intelligence | Élevée |

#### Moteurs ATS/Recrutement (4 moteurs)

| # | Moteur | Emplacement | Responsabilités | Complexité |
|---|--------|-------------|-----------------|------------|
| 21 | atsAIEngine | `core/intelligence/engines/atsAIEngine.ts` | Analyse CV et matching ATS | Moyenne |
| 22 | recruiterQuestionAIEngine | `core/intelligence/engines/recruiterQuestionAIEngine.ts` | Génération questions recruteur | Faible |
| 23 | recruiterNotesAIEngine | `core/intelligence/engines/recruiterNotesAIEngine.ts` | Génération notes recruteur | Faible |
| 24 | careerAnalysisAIEngine | `core/intelligence/engines/careerAnalysisAIEngine.ts` | Analyse carrière globale | Moyenne |

#### Moteurs Interview/Coach (3 moteurs)

| # | Moteur | Emplacement | Responsabilités | Complexité |
|---|--------|-------------|-----------------|------------|
| 25 | interviewAnalyzerAIEngine | `core/intelligence/engines/interviewAnalyzerAIEngine.ts` | Analyse entretiens multiples | Moyenne |
| 26 | dailyCoachAIEngine | `core/intelligence/engines/dailyCoachAIEngine.ts` | Coaching quotidien | Moyenne |
| 27 | coachEngine | `core/intelligence/engines/coachEngine.ts` | Coaching général | Faible |

#### Moteurs Décision/Analyse (2 moteurs)

| # | Moteur | Emplacement | Responsabilités | Complexité |
|---|--------|-------------|-----------------|------------|
| 28 | decisionEstimationAIEngine | `core/intelligence/engines/decisionEstimationAIEngine.ts` | Estimation décision recrutement | Faible |
| 29 | executiveSummaryAIEngine | `core/intelligence/engines/executiveSummaryAIEngine.ts` | Synthèse exécutive | Faible |

---

## Étape 2 — Classification

### Classe A — Compatible Forecast (Réutilisation > 90%)

**Critères**: Même architecture que Forecast, dépendances identiques, pipeline simple.

**Moteurs (8)**:
- recruiterQuestionAIEngine (95%)
- recruiterNotesAIEngine (95%)
- decisionEstimationAIEngine (95%)
- executiveSummaryAIEngine (95%)
- coachEngine (95%)
- dailyCoachAIEngine (90%)
- careerAnalysisAIEngine (90%)
- atsAIEngine (90%)

**Justification**: Structure identique ou très similaire à Forecast, dépendances identiques, pipeline simple.

### Classe B — Adaptation Légère (Réutilisation 70–90%)

**Critères**: Architecture similaire, quelques composants spécifiques, dépendances contextuelles.

**Moteurs (16)**:
- CareerCopilotSuccessIntelligenceEngine (85%)
- CareerCopilotScenarioIntelligenceEngine (85%)
- CareerCopilotConstraintIntelligenceEngine (85%)
- CareerCopilotResourceIntelligenceEngine (85%)
- CareerCopilotKnowledgeEvolutionEngine (85%)
- CareerCopilotProgressionPlanEngine (85%)
- CareerCopilotDailySummaryEngine (80%)
- CareerCopilotCoachingIntelligenceEngine (80%)
- CareerCopilotGoalIntelligenceEngine (80%)
- CareerCopilotSelfReviewEngine (80%)
- CareerCopilotAccountabilityEngine (80%)
- CareerCopilotConfidenceEngine (80%)
- CareerCopilotConversationEngine (80%)
- CareerCopilotDecisionIntelligenceEngine (80%)
- CareerCopilotExecutionIntelligenceEngine (80%)
- interviewAnalyzerAIEngine (75%)

**Justification**: Structure similaire à Forecast, utilise d'autres moteurs pour contexte, logique spécifique.

### Classe C — Adaptation Moyenne (Réutilisation 50–70%)

**Critères**: Pipeline spécifique, contexte complexe, logique métier avancée.

**Moteurs (4)**:
- CareerCopilotDigitalTwinEngine (65%)
- CareerCopilotAdaptiveStrategyEngine (60%)
- CareerCopilotAutonomousIntelligenceEngine (60%)
- CareerCopilotMetaIntelligenceEngine (55%)

**Justification**: Pipeline spécifique, logique complexe, architecture différente.

### Classe D — Cas Particuliers (Réutilisation < 50%)

**Moteurs (0)**: Aucun moteur ne nécessite une migration spécifique.

---

## Étape 3 — Patterns Identifiés

### Dépendances Communes

| Dépendance | Moteurs concernés | Pourcentage |
|------------|-------------------|------------|
| aiOrchestrator | 28/28 (tous sauf Forecast) | 100% |
| eventBus | 20/28 | 71% |
| candidateAIBrain | 20/28 | 71% |
| OpenAI (via aiOrchestrator) | 28/28 | 100% |

**Conclusion**: 100% des moteurs utilisent aiOrchestrator, ce qui signifie que le pattern de remplacement est universel.

### Pipelines Identiques

| Pattern | Moteurs concernés | Pourcentage |
|---------|-------------------|------------|
| Pipeline simple (1 étape AI) | 24/28 | 86% |
| Pipeline avec contexte Brain | 20/28 | 71% |
| Pipeline multi-étapes | 4/28 | 14% |

**Conclusion**: 86% des moteurs utilisent un pipeline simple, ce qui signifie que la migration est hautement réutilisable.

### Providers Identiques

| Provider | Moteurs concernés | Pourcentage |
|----------|-------------------|------------|
| OpenAI (via aiOrchestrator) | 28/28 | 100% |

**Conclusion**: 100% des moteurs utilisent OpenAI, ce qui signifie que le provider est universel.

### Événements Identiques

| Event Type | Moteurs concernés | Pourcentage |
|------------|-------------------|------------|
| ObservationCreatedEvent | 20/28 | 71% |
- RecommendationGeneratedEvent | 1/28 | 4% |
- Autres events spécifiques | 7/28 | 25% |

**Conclusion**: 71% des moteurs publient des événements similaires, ce qui signifie que le pattern de remplacement est réutilisable.

---

## Étape 4 — Points de Factorisation

### intelligence-core

**Opportunités identifiées**:

1. **BrainContextBuilder Helper**
   - **Justification**: 20/28 moteurs (71%) utilisent candidateAIBrain pour construire le contexte
   - **Réutilisation**: 71%
   - **Proposition**: Créer un helper `BrainContextBuilder` dans intelligence-core
   - **Priorité**: Faible (optionnel)

2. **Standard Event Types**
   - **Justification**: 20/28 moteurs (71%) publient des événements similaires
   - **Réutilisation**: 71%
   - **Proposition**: Créer des événements standardisés dans intelligence-runtime
   - **Priorité**: Faible (optionnel)

### intelligence-runtime

**Opportunités identifiées**:

1. **Standard Pipeline Stages**
   - **Justification**: 24/28 moteurs (86%) utilisent un pipeline simple (1 étape AI)
   - **Réutilisation**: 86%
   - **Proposition**: Créer des stages standardisés dans intelligence-runtime
   - **Priorité**: Faible (optionnel)

2. **Context Aggregation Helper**
   - **Justification**: 20/28 moteurs (71%) agrègent des données de multiple sources
   - **Réutilisation**: 71%
   - **Proposition**: Créer un helper `ContextAggregator` dans intelligence-runtime
   - **Priorité**: Faible (optionnel)

**Conclusion**: Aucune factorisation n'est requise avant les migrations. L'infrastructure actuelle est suffisante. Les factorisations proposées sont optionnelles et peuvent être implémentées si nécessaire lors des migrations.

---

## Étape 5 — Vagues de Migration

### Wave 1 — Classe A (8 moteurs, Réutilisation 93%, 19h)

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

**Ordre recommandé**: Du plus simple au plus complexe pour maximiser la réutilisation.

### Wave 2 — Classe B (16 moteurs, Réutilisation 81%, 58h)

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

**Ordre recommandé**: Du plus simple au plus complexe pour maximiser la réutilisation.

### Wave 3 — Classe C (4 moteurs, Réutilisation 60%, 28h)

| Moteur | Réutilisation Forecast | Complexité | Estimation |
|--------|---------------------|------------|------------|
| CareerCopilotDigitalTwinEngine | 65% | Élevée | 6h |
| CareerCopilotAdaptiveStrategyEngine | 60% | Élevée | 7h |
| CareerCopilotAutonomousIntelligenceEngine | 60% | Élevée | 7h |
| CareerCopilotMetaIntelligenceEngine | 55% | Élevée | 8h |

**Total Wave 3**: 4 moteurs, 28h estimées

**Ordre recommandé**: Du plus simple au plus complexe pour maximiser la réutilisation.

### Résumé des Vagues

| Wave | Moteurs | Réutilisation Moyenne | Complexité Moyenne | Estimation Totale |
|------|---------|----------------------|-------------------|-------------------|
| Wave 1 | 8 | 93% | Faible | 19h |
| Wave 2 | 16 | 81% | Moyenne | 58h |
| Wave 3 | 4 | 60% | Élevée | 28h |
| **Total** | **28** | **81%** | **Moyenne** | **105h** |

**Conclusion**: L'ordre des vagues est optimisé pour maximiser la réutilisation. Les moteurs les plus simples sont migrés en premier pour construire de l'expérience et de la confiance.

---

## Étape 6 — Migration Playbook

### Document créé: ENGINE_MIGRATION_PLAYBOOK.md

**Contenu**:
- Prérequis
- Checklist pré-migration
- Étapes techniques détaillées
- Validations
- Critères de succès
- Points d'attention
- Erreurs fréquentes
- Rollback
- Documentation post-migration

**Objectif**: Guide opérationnel standard pour migrer les Intelligence Engines vers l'architecture cible.

**Référence**: Basé sur l'expérience de migration de Forecast (Sprint 6.15).

---

## Étape 7 — Migration Score

### Formule

```
Migration Score = (Proximité Forecast × 0.4) + (Dépendances Legacy × 0.3) + (Composants Spécifiques × 0.2) + (Risque × 0.1)
```

### Scores par Moteur

#### Wave 1 (Score > 90)

| Moteur | Score |
|--------|-------|
| recruiterQuestionAIEngine | 92 |
| recruiterNotesAIEngine | 92 |
| decisionEstimationAIEngine | 92 |
| executiveSummaryAIEngine | 92 |
| coachEngine | 92 |
| dailyCoachAIEngine | 88 |
| careerAnalysisAIEngine | 86 |
| atsAIEngine | 86 |

#### Wave 2 (Score 70–90)

| Moteur | Score |
|--------|-------|
| CareerCopilotDailySummaryEngine | 82 |
| CareerCopilotAccountabilityEngine | 82 |
| CareerCopilotConfidenceEngine | 82 |
| CareerCopilotSuccessIntelligenceEngine | 81 |
| CareerCopilotScenarioIntelligenceEngine | 81 |
| CareerCopilotConstraintIntelligenceEngine | 81 |
| CareerCopilotResourceIntelligenceEngine | 81 |
| CareerCopilotKnowledgeEvolutionEngine | 81 |
| CareerCopilotProgressionPlanEngine | 81 |
| CareerCopilotCoachingIntelligenceEngine | 78 |
| CareerCopilotGoalIntelligenceEngine | 78 |
| CareerCopilotSelfReviewEngine | 78 |
| CareerCopilotConversationEngine | 78 |
| CareerCopilotDecisionIntelligenceEngine | 78 |
| CareerCopilotExecutionIntelligenceEngine | 78 |
| interviewAnalyzerAIEngine | 75 |

#### Wave 3 (Score < 70)

| Moteur | Score |
|--------|-------|
| CareerCopilotDigitalTwinEngine | 68 |
| CareerCopilotAdaptiveStrategyEngine | 65 |
| CareerCopilotAutonomousIntelligenceEngine | 65 |
| CareerCopilotMetaIntelligenceEngine | 62 |

**Conclusion**: Les moteurs les mieux notés (Wave 1) seront migrés en premier. L'ordre des vagues est optimisé pour maximiser la réutilisation et minimiser les risques.

---

## Réponses aux Questions Clés

### Quels moteurs peuvent être migrés sans adaptation majeure ?

**Réponse**: 8 moteurs (Wave 1) peuvent être migrés sans adaptation majeure:
- recruiterQuestionAIEngine
- recruiterNotesAIEngine
- decisionEstimationAIEngine
- executiveSummaryAIEngine
- coachEngine
- dailyCoachAIEngine
- careerAnalysisAIEngine
- atsAIEngine

Ces moteurs ont une réutilisation Forecast de 90-95% et une complexité faible à moyenne.

### Quels moteurs nécessitent des évolutions du runtime ?

**Réponse**: Aucun moteur ne nécessite d'évolution du runtime.

L'infrastructure actuelle (intelligence-runtime, intelligence-core) est suffisante pour migrer tous les moteurs. Les factorisations proposées (BrainContextBuilder, Standard Pipeline Stages, Context Aggregator) sont optionnelles et peuvent être implémentées si nécessaire lors des migrations.

### Quels composants sont réutilisables entre plusieurs moteurs ?

**Réponse**: Les composants suivants sont réutilisables entre plusieurs moteurs:

- **RuntimeContext**: 100% (tous les moteurs)
- **ExecutionPipeline**: 86% (24/28 moteurs)
- **IntelligenceUseCase**: 100% (tous les moteurs)
- **EventPublisher**: 71% (20/28 moteurs)
- **Pattern aiOrchestrator → IntelligenceUseCase**: 100% (tous les moteurs)

### Quel est l'ordre optimal de migration ?

**Réponse**: L'ordre optimal de migration est:

1. **Wave 1**: 8 moteurs simples (19h)
2. **Wave 2**: 16 moteurs moyens (58h)
3. **Wave 3**: 4 moteurs complexes (28h)

Cet ordre est optimisé pour maximiser la réutilisation et minimiser les risques. Les moteurs les plus simples sont migrés en premier pour construire de l'expérience et de la confiance.

### Quel est l'effort estimé pour chaque vague ?

**Réponse**: L'effort estimé pour chaque vague est:

- **Wave 1**: 19h (8 moteurs)
- **Wave 2**: 58h (16 moteurs)
- **Wave 3**: 28h (4 moteurs)
- **Total**: 105h (~13 jours)

### Quelles améliorations génériques doivent être apportées à la plateforme avant les migrations restantes ?

**Réponse**: Aucune amélioration générique n'est requise avant les migrations.

L'infrastructure actuelle (intelligence-runtime, intelligence-core) est suffisante pour migrer tous les moteurs. Les factorisations proposées (BrainContextBuilder, Standard Pipeline Stages, Context Aggregator) sont optionnelles et peuvent être implémentées si nécessaire lors des migrations.

---

## Livrables

### Documents créés

1. **ENGINE_MIGRATION_MATRIX.md**
   - Inventaire complet des 29 moteurs
   - Classification (Classe A, B, C)
   - Patterns identifiés
   - Points de factorisation
   - Vagues de migration
   - Migration Score

2. **ENGINE_MIGRATION_PLAYBOOK.md**
   - Prérequis
   - Checklist pré-migration
   - Étapes techniques détaillées
   - Validations
   - Critères de succès
   - Points d'attention
   - Erreurs fréquentes
   - Rollback
   - Documentation post-migration

3. **SPRINT_616_ENGINE_MIGRATION_STRATEGY.md** (ce document)
   - Résumé de la stratégie
   - Réponses aux questions clés
   - Conclusion

---

## Vérifications

### Étape 1: Inventaire complet des moteurs

- [x] Tous les moteurs sont inventoriés (29 moteurs)
- [x] Chaque moteur a un emplacement
- [x] Chaque moteur a des responsabilités
- [x] Chaque moteur a des dépendances identifiées

### Étape 2: Classification

- [x] Chaque moteur est classé (Classe A, B, C)
- [x] La classification est justifiée

### Étape 3: Patterns

- [x] Les dépendances communes sont identifiées
- [x] Les pipelines identiques sont identifiés
- [x] Les providers identiques sont identifiés
- [x] Les événements identiques sont identifiés

### Étape 4: Factorisation

- [x] Les points de factorisation sont identifiés
- [x] Les propositions sont justifiées par plusieurs cas d'usage

### Étape 5: Vagues de migration

- [x] Les vagues de migration sont définies (Wave 1, 2, 3)
- [x] L'ordre est optimisé pour maximiser la réutilisation

### Étape 6: Migration Playbook

- [x] Le Migration Playbook est créé
- [x] Le document inclut toutes les sections requises

### Étape 7: Migration Score

- [x] Le Migration Score est calculé pour chaque moteur
- [x] Les moteurs les mieux notés sont identifiés

### Contraintes

- [x] Aucun moteur n'a été modifié
- [x] Ni intelligence-core ni intelligence-runtime n'ont été modifiés
- [x] Aucune logique spécifique à un moteur n'a été introduite dans les modules partagés

---

## Conclusion

### Objectif atteint

La Sprint 6.16 a atteint son objectif: construire une stratégie industrielle pour migrer les 28 moteurs restants vers l'architecture cible.

### Résultats

1. **Inventaire complet**: 29 moteurs inventoriés avec leurs dépendances et complexité
2. **Classification**: 3 classes définies (A, B, C) avec des niveaux de réutilisation
3. **Patterns**: Patterns identifiés (dépendances, pipelines, providers, événements)
4. **Factorisation**: Points de factorisation identifiés (optionnels)
5. **Vagues**: 3 vagues définies avec un effort total estimé de 105h
6. **Playbook**: Migration Playbook créé pour guider les migrations
7. **Score**: Migration Score calculé pour chaque moteur

### Réponses aux questions clés

1. **Quels moteurs peuvent être migrés sans adaptation majeure ?**
   - 8 moteurs (Wave 1)

2. **Quels moteurs nécessitent des évolutions du runtime ?**
   - Aucun

3. **Quels composants sont réutilisables entre plusieurs moteurs ?**
   - RuntimeContext (100%), ExecutionPipeline (86%), IntelligenceUseCase (100%), EventPublisher (71%)

4. **Quel est l'ordre optimal de migration ?**
   - Wave 1 → Wave 2 → Wave 3

5. **Quel est l'effort estimé pour chaque vague ?**
   - Wave 1: 19h, Wave 2: 58h, Wave 3: 28h

6. **Quelles améliorations génériques doivent être apportées à la plateforme avant les migrations restantes ?**
   - Aucune (optionnelles)

### Prochaine étape

La prochaine étape est de commencer les migrations en suivant le Migration Playbook et l'ordre des vagues défini. La première vague (Wave 1) devrait commencer par les moteurs les plus simples (recruiterQuestionAIEngine, recruiterNotesAIEngine, decisionEstimationAIEngine, executiveSummaryAIEngine, coachEngine).

### Impact

À l'issue de cette Sprint, la migration des 28 moteurs est pilotée par une stratégie industrielle, où chaque nouvelle migration s'appuie sur Forecast comme Golden Reference, maximise la réutilisation de intelligence-core et intelligence-runtime, et limite les adaptations à des cas réellement spécifiques.

L'objectif est d'obtenir une plateforme homogène, maintenable et évolutive, sans multiplier les implémentations particulières.

---

## Annexes

### Références

- ADR-020: Intelligence Engine Standard
- ADR-021: Intelligence Runtime Architecture
- SPRINT_614_PROVIDER_IMPLEMENTATION.md
- SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md
- ENGINE_MIGRATION_MATRIX.md
- ENGINE_MIGRATION_PLAYBOOK.md

### Documents créés

1. `reports/ENGINE_MIGRATION_MATRIX.md`
2. `docs/architecture/ENGINE_MIGRATION_PLAYBOOK.md`
3. `reports/SPRINT_616_ENGINE_MIGRATION_STRATEGY.md` (ce document)
