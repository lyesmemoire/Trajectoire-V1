# useInterviewReport.ts Function Mapping

## Overview

This document maps all functions in `useInterviewReport.ts` to their target Intelligence Engines for incremental migration.

---

## Function Analysis

| Fonction | Responsabilité | Lignes | Engine cible | Conserver | Supprimer | Migrer |
|----------|----------------|--------|--------------|-----------|-----------|--------|
| `calculateGlobalScore` | Calcule le score global à partir des live scores | 60-64 (5 lignes) | ScoreEngine | ❌ | ❌ | ✅ |
| `getLevel` | Détermine le niveau de performance | 66-71 (6 lignes) | ScoreEngine | ❌ | ❌ | ✅ |
| `generateScoreBreakdown` | Génère le détail des scores par catégorie | 73-87 (15 lignes) | ScoreEngine | ❌ | ❌ | ✅ |
| `createScoreDetail` | Crée le détail d'un score avec explications | 89-174 (86 lignes) | ScoreEngine | ❌ | ❌ | ✅ |
| `generateQuestionAnalysis` | Analyse question par question | 176-197 (22 lignes) | InterviewAnalyzerEngine | ❌ | ❌ | ✅ |
| `generateTimeline` | Génère la timeline de l'entretien | 199-209 (11 lignes) | InterviewAnalyzerEngine | ❌ | ❌ | ✅ |
| `generateHighlights` | Génère les points forts | 211-220 (10 lignes) | InsightEngine | ❌ | ❌ | ✅ |
| `generateImprovements` | Génère les axes d'amélioration | 222-259 (38 lignes) | InsightEngine | ❌ | ❌ | ✅ |
| `generateSTARAnalysis` | Analyse la qualité STAR | 261-288 (28 lignes) | InterviewAnalyzerEngine | ❌ | ❌ | ✅ |
| `generateLanguageAnalysis` | Analyse le langage et la communication | 290-328 (39 lignes) | InterviewAnalyzerEngine | ❌ | ❌ | ✅ |
| `generatePostureAnalysis` | Analyse la posture et la confiance | 330-359 (30 lignes) | InterviewAnalyzerEngine | ❌ | ❌ | ✅ |
| `generateRecruiterVision` | Génère la vision du recruteur | 361-387 (27 lignes) | DecisionEngine | ❌ | ❌ | ✅ |
| `generateComparison` | Compare avec les benchmarks | 389-420 (32 lignes) | ScoreEngine | ❌ | ❌ | ✅ |
| `generateActionPlan` | Génère le plan d'action 7/30/90 jours | 422-464 (43 lignes) | CoachEngine | ❌ | ❌ | ✅ |
| `generateNextSimulation` | Recommande la simulation suivante | 466-481 (16 lignes) | RecommendationEngine | ❌ | ❌ | ✅ |
| `generateBehavioralAnalysis` | Analyse comportementale | 483-514 (32 lignes) | InsightEngine | ❌ | ❌ | ✅ |
| `generateRecruiterPrivateNotes` | Génère les notes privées du recruteur | 516-543 (28 lignes) | InsightEngine | ❌ | ❌ | ✅ |
| `generateDecisionEstimation` | Estime la décision du recruteur | 545-559 (15 lignes) | DecisionEngine | ❌ | ❌ | ✅ |
| `generateTippingFactors` | Identifie les facteurs décisifs | 561-579 (19 lignes) | InsightEngine | ❌ | ❌ | ✅ |
| `generateExecutiveSummary` | Génère le résumé exécutif | 581-594 (14 lignes) | InsightEngine | ❌ | ❌ | ✅ |
| `generateEnhancedComparison` | Comparaison améliorée | 596-618 (23 lignes) | ScoreEngine | ❌ | ❌ | ✅ |

---

## Summary Statistics

**Total Functions:** 21
**Total Lines:** 560 lignes de logique métier
**Functions to Migrate:** 21 (100%)

---

## Migration Groups

### Group 1: Pure Functions - Decision & Insights (Phase 2)
Priority: HIGH - These are pure functions with no dependencies

| Fonction | Engine cible | Lignes |
|----------|--------------|--------|
| `generateExecutiveSummary` | InsightEngine | 14 |
| `generateBehavioralAnalysis` | InsightEngine | 32 |
| `generateDecisionEstimation` | DecisionEngine | 15 |
| `generateEnhancedComparison` | ScoreEngine | 23 |
| `generateRecruiterPrivateNotes` | InsightEngine | 28 |
| `generateTippingFactors` | InsightEngine | 19 |
| **Sous-total** | | **131** |

### Group 2: Score Functions (Phase 2)
Priority: HIGH - Core scoring logic

| Fonction | Engine cible | Lignes |
|----------|--------------|--------|
| `calculateGlobalScore` | ScoreEngine | 5 |
| `getLevel` | ScoreEngine | 6 |
| `generateScoreBreakdown` | ScoreEngine | 15 |
| `createScoreDetail` | ScoreEngine | 86 |
| `generateComparison` | ScoreEngine | 32 |
| **Sous-total** | | **144** |

### Group 3: Interview Analysis Functions (Phase 3)
Priority: MEDIUM - Depends on conversation history

| Fonction | Engine cible | Lignes |
|----------|--------------|--------|
| `generateQuestionAnalysis` | InterviewAnalyzerEngine | 22 |
| `generateTimeline` | InterviewAnalyzerEngine | 11 |
| `generateSTARAnalysis` | InterviewAnalyzerEngine | 28 |
| `generateLanguageAnalysis` | InterviewAnalyzerEngine | 39 |
| `generatePostureAnalysis` | InterviewAnalyzerEngine | 30 |
| **Sous-total** | | **130** |

### Group 4: Recommendations & Coaching (Phase 3)
Priority: MEDIUM - Depends on other analyses

| Fonction | Engine cible | Lignes |
|----------|--------------|--------|
| `generateActionPlan` | CoachEngine | 43 |
| `generateNextSimulation` | RecommendationEngine | 16 |
| **Sous-total** | | **59** |

### Group 5: Highlights & Improvements (Phase 4)
Priority: LOW - Display-oriented

| Fonction | Engine cible | Lignes |
|----------|--------------|--------|
| `generateHighlights` | InsightEngine | 10 |
| `generateImprovements` | InsightEngine | 38 |
| `generateRecruiterVision` | DecisionEngine | 27 |
| **Sous-total** | | **75** |

---

## Migration Strategy

### Phase 1: Documentation ✅
- [x] Create USE_INTERVIEW_REPORT_MAPPING.md

### Phase 2: Pure Functions (Group 1 + Group 2)
- [ ] Migrate Group 1 functions to engines
- [ ] Migrate Group 2 functions to engines
- [ ] Update useInterviewReport to call engines
- [ ] Remove migrated functions
- [ ] Typecheck, Lint, Build

### Phase 3: Interview Analysis (Group 3)
- [ ] Migrate Group 3 functions to engines
- [ ] Update useInterviewReport to call engines
- [ ] Remove migrated functions
- [ ] Typecheck, Lint, Build

### Phase 4: Recommendations & Coaching (Group 4)
- [ ] Migrate Group 4 functions to engines
- [ ] Update useInterviewReport to call engines
- [ ] Remove migrated functions
- [ ] Typecheck, Lint, Build

### Phase 5: Display Functions (Group 5)
- [ ] Migrate Group 5 functions to engines
- [ ] Update useInterviewReport to call engines
- [ ] Remove migrated functions
- [ ] Typecheck, Lint, Build

### Phase 6: Final Orchestration
- [ ] Ensure useInterviewReport is pure orchestrator
- [ ] Final validation
- [ ] Typecheck, Lint, Build

---

## Engine Implementation Requirements

### ScoreEngine
Needs to implement:
- `calculateGlobalScore(scores)`
- `getLevel(score)`
- `generateScoreBreakdown(globalScore)`
- `createScoreDetail(score, category)`
- `generateComparison(score, difficulty)`
- `generateEnhancedComparison(score, difficulty)`

### InterviewAnalyzerEngine
Needs to implement:
- `generateQuestionAnalysis(history)`
- `generateTimeline(history)`
- `generateSTARAnalysis(history)`
- `generateLanguageAnalysis(score)`
- `generatePostureAnalysis(score)`

### InsightEngine
Needs to implement:
- `generateHighlights(score)`
- `generateImprovements(score)`
- `generateBehavioralAnalysis(score, config)`
- `generateRecruiterPrivateNotes(score)`
- `generateTippingFactors(score)`
- `generateExecutiveSummary(score, config)`

### DecisionEngine
Needs to implement:
- `generateRecruiterVision(score)`
- `generateDecisionEstimation(score, config)`

### CoachEngine
Needs to implement:
- `generateActionPlan(score)`

### RecommendationEngine
Needs to implement:
- `generateNextSimulation(difficulty, score)`

---

## Risk Assessment

**High Risk:**
- `createScoreDetail` - 86 lines, complex hardcoded content
- `generateActionPlan` - 43 lines, structured data generation

**Medium Risk:**
- `generateLanguageAnalysis` - 39 lines, multiple metrics
- `generateImprovements` - 38 lines, detailed suggestions
- `generateBehavioralAnalysis` - 32 lines, behavioral traits

**Low Risk:**
- `calculateGlobalScore` - 5 lines, simple calculation
- `getLevel` - 6 lines, simple categorization
- `generateTimeline` - 11 lines, static data

---

## Success Criteria

- All 21 functions migrated to engines
- useInterviewReport reduced to < 50 lines (orchestration only)
- No business logic in hook
- All engines used
- Typecheck passes
- Lint passes
- Build passes
- No regression in report output
