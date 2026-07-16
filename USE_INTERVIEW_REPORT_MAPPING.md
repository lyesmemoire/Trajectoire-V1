# useInterviewReport Migration Mapping

## Overview
This document tracks the migration of business logic from `useInterviewReport.ts` to dedicated intelligence engines.

## Migration Status: Phase 1 Complete (with Architecture Correction)

### Group 1: Pure Functions (Decision & Insight) ✅

| Function | Destination Engine | Method | Status |
|----------|-------------------|--------|--------|
| `generateExecutiveSummary` | InsightEngine | `generateExecutiveSummary` | ✅ Migrated |
| `generateBehavioralAnalysis` | InsightEngine | `generateBehavioralAnalysis` | ✅ Migrated |
| `generateDecisionEstimation` | DecisionEngine | `generateDecisionEstimation` | ✅ Migrated |
| `generateEnhancedComparison` | ScoreEngine | `generateEnhancedComparison` | ✅ Migrated |
| `generateRecruiterPrivateNotes` | InsightEngine | `generateRecruiterPrivateNotes` | ✅ Migrated |
| `generateTippingFactors` | InsightEngine | `generateTippingFactors` | ✅ Migrated |
| `generateRecruiterVision` | DecisionEngine | `generateRecruiterVision` | ✅ Migrated |
| `generateDirectorValidation` | DecisionEngine | `generateDirectorValidation` | ✅ Migrated |
| `generateStrengths` | InsightEngine | `generateStrengths` | ✅ Migrated (raw data) |

### Group 2: Score Functions ✅

| Function | Destination Engine | Method | Status |
|----------|-------------------|--------|--------|
| `calculateGlobalScore` | ScoreEngine | `calculateGlobalScore` | ✅ Migrated |
| `getLevel` | ScoreEngine | `getLevel` | ✅ Migrated |
| `generateScoreBreakdown` | ScoreEngine | `generateScoreBreakdownFromGlobalScore` | ✅ Migrated |
| `createScoreDetail` | ScoreEngine | `createScoreDetail` (private) | ✅ Migrated |
| `generateComparison` | ScoreEngine | `generateComparison` | ✅ Migrated |

### Group 3: Interview Analysis ✅

| Function | Destination Engine | Method | Status |
|----------|-------------------|--------|--------|
| `generateQuestionAnalysis` | InterviewAnalyzerEngine | `generateQuestionAnalysis` | ✅ Migrated |
| `generateTimeline` | InterviewAnalyzerEngine | `generateTimeline` | ✅ Migrated |
| `generateSTARAnalysis` | InterviewAnalyzerEngine | `generateSTARAnalysis` | ✅ Migrated |
| `generateLanguageAnalysis` | InterviewAnalyzerEngine | `generateLanguageAnalysis` | ✅ Migrated |
| `generatePostureAnalysis` | InterviewAnalyzerEngine | `generatePostureAnalysis` | ✅ Migrated |

### Group 4: Recommendations ✅

| Function | Destination Engine | Method | Status |
|----------|-------------------|--------|--------|
| `generateActionPlan` | CoachEngine | `generateActionPlan` | ✅ Migrated |
| `generateNextSimulation` | RecommendationEngine | `generateNextSimulation` | ✅ Migrated |
| `generateWeaknesses` | RecommendationEngine | `generateWeaknesses` | ✅ Migrated (raw data) |

### Group 5: Display Functions ❌ (Architecture Correction)

**Original (Incorrect):**
- `generateHighlights` → DisplayEngine (DELETED)
- `generateImprovements` → DisplayEngine (DELETED)

**Corrected:**
- `generateHighlights` → InsightEngine.generateStrengths (raw data: priority, category, impact, confidence)
- `generateImprovements` → RecommendationEngine.generateWeaknesses (raw data: priority, category, impact, confidence)
- UI projection layer handles formatting into cards/badges

## Architecture Principle

**Raw Data → Engine → Projection → UI**

Engines return raw structured data:
- `priority: "high" | "medium" | "low"`
- `category: string`
- `impact: "low" | "medium" | "high"`
- `confidence: number`
- `evidence: string`

UI layer handles:
- Badge colors
- Icons
- Component selection
- Display formatting

## Engine Files Created/Modified

### New Engines
- `core/intelligence/engines/interviewAnalyzerEngine.ts` - Interview analysis and STAR evaluation

### Modified Engines
- `core/intelligence/engines/insightEngine.ts` - Added Group 1 methods + `generateStrengths` (raw data)
- `core/intelligence/engines/decisionEngine.ts` - Added Group 1 methods
- `core/intelligence/engines/scoreEngine.ts` - Added Group 2 methods
- `core/intelligence/engines/coachEngine.ts` - Added Group 4 methods
- `core/intelligence/engines/recommendationEngine.ts` - Added Group 4 methods + `generateWeaknesses` (raw data)

### Deleted (Architecture Correction)
- `core/intelligence/engines/displayEngine.ts` - ❌ DELETED (display logic belongs in UI layer)

### Modified Hook
- `app/dashboard/interview-simulation/hooks/useInterviewReport.ts` - Now orchestrates engine calls + projects raw data to UI format

## Backward Compatibility

All migrated functions have wrapper functions in `useInterviewReport.ts` prefixed with `_` to indicate they are deprecated and will be removed in Phase 4. These wrappers call the corresponding engine methods and project raw data to legacy UI format.

## Verification

- ✅ Typecheck passed (npx tsc --noEmit)
- ✅ Lint passed (no errors in migrated files)
- ⚠️ Build has Windows symlink permission issues (unrelated to migration)

## Next Steps (Phase 4)

1. Remove backward-compatible wrapper functions
2. Clean up unused helper functions
3. Finalize hook as pure orchestrator
4. Move UI projection logic to component layer
5. Update documentation

