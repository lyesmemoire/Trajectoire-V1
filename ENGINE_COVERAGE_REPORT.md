# Engine Coverage Report

## Overview
This report tracks the actual usage of intelligence engines in the Candidate Intelligence Graph.

**Date:** 2026-07-07
**Sprint:** 10.5
**Objective:** 100% import usage, 0 unused imports, 0 fake data

---

## Engine Usage Analysis

### ScoreEngine
**Status:** ✅ CONNECTED

**Methods Available:**
- `calculateGlobalScore(liveScores)`
- `clampScore(score)`
- `calculateResponseImpact(responseLength, quality)`
- `adjustDifficulty(currentScores)`
- `calculateOverallScore(interviewAnalysis)`
- `calculateJobFitScore(profile, job)`
- `generateScoreBreakdown(globalScore)`
- `getLevel(score)`
- `generateComparison(currentScore, previousScore)`
- `createScoreDetail(...)`

**Methods Actually Called:**
- `calculateGlobalScore(liveScores)` - Called in CandidateGraphBuilder.build()
- `clampScore(score)` - Used internally by calculateGlobalScore

**Where Called:**
- `core/intelligence/profile/CandidateGraphBuilder.ts:115`

**CandidateGraph Sections Filled:**
- `overallScore` - Global score calculation
- `employability.technical` - Impact score
- `employability.behavioral` - Communication + leadership average
- `employability.cultural` - Confidence score

**Unused Methods:**
- `calculateResponseImpact` - Not used in graph building
- `adjustDifficulty` - Not used in graph building
- `calculateOverallScore` - Not used (different signature)
- `calculateJobFitScore` - Not used
- `generateScoreBreakdown` - Not used
- `getLevel` - Not used
- `generateComparison` - Not used
- `createScoreDetail` - Not used

**Why Unused:**
- These methods are designed for specific use cases (interview evaluation, job analysis) that are not part of the current graph building process. They are available for future integration when those features are implemented.

**Coverage:** 20% (2/10 methods)

---

### InsightEngine
**Status:** ✅ CONNECTED

**Methods Available:**
- `generateInsights(profile)`
- `generateStrengths(score)`
- `identifyPatterns(profile)`
- `analyzeBehavior(profile)`
- `detectStrengths(profile)`

**Methods Actually Called:**
- `generateStrengths(score)` - Called in CandidateGraphBuilder.build()

**Where Called:**
- `core/intelligence/profile/CandidateGraphBuilder.ts:118`

**CandidateGraph Sections Filled:**
- `strengths` - Array of detected strengths with category, priority, confidence, impact, evidence

**Unused Methods:**
- `generateInsights` - Not used
- `identifyPatterns` - Not used
- `analyzeBehavior` - Not used
- `detectStrengths` - Not used

**Why Unused:**
- These methods require full CandidateProfile which is not available in current graph building. They will be integrated when profile analysis is added to the graph.

**Coverage:** 20% (1/5 methods)

---

### DecisionEngine
**Status:** ✅ CONNECTED

**Methods Available:**
- `generateDecisionEstimation(score)`
- `generateDirectorValidation(score)`
- `generateRecruiterVision(score)`
- `generatePositiveReasoning(score)`
- `generateHesitantReasoning(score)`
- `generateNegativeReasoning(score)`

**Methods Actually Called:**
- `generateDecisionEstimation(score)` - Called in CandidateGraphBuilder.build()

**Where Called:**
- `core/intelligence/profile/CandidateGraphBuilder.ts:138`

**CandidateGraph Sections Filled:**
- `decisionReadiness.confidence` - Second interview probability from decision estimation

**Unused Methods:**
- `generateDirectorValidation` - Not used
- `generateRecruiterVision` - Not used
- `generatePositiveReasoning` - Not used
- `generateHesitantReasoning` - Not used
- `generateNegativeReasoning` - Not used

**Why Unused:**
- These methods provide detailed recruiter perspectives which are not currently integrated into the graph structure. They will be added when detailed decision analysis is required.

**Coverage:** 17% (1/6 methods)

---

### RecommendationEngine
**Status:** ✅ CONNECTED

**Methods Available:**
- `generateRecommendations(profile)`
- `generateWeaknesses(score)`
- `generateNextSimulation(score)`

**Methods Actually Called:**
- `generateWeaknesses(score)` - Called in CandidateGraphBuilder.build()

**Where Called:**
- `core/intelligence/profile/CandidateGraphBuilder.ts:121`

**CandidateGraph Sections Filled:**
- `weaknesses` - Array of detected weaknesses with category, priority, confidence, impact, evidence, suggestion

**Unused Methods:**
- `generateRecommendations` - Not used
- `generateNextSimulation` - Not used

**Why Unused:**
- `generateRecommendations` requires full profile data not currently available
- `generateNextSimulation` is specific to interview simulation workflow, not graph building

**Coverage:** 33% (1/3 methods)

---

### CareerEngine
**Status:** ❌ NOT CONNECTED

**Methods Available:**
- `calculateCareerLevel(yearsOfExperience, performanceScore)`
- `calculateLevelGap(currentLevel, targetLevel)`
- `isReadyForNextLevel(profile)`
- `getNextLevel(currentLevel)`
- `calculateEmployabilityScore(profile)`
- `generateProgressionInsights(profile)`
- `identifyCareerOpportunities(profile)`
- `identifyCareerGaps(profile)`

**Methods Actually Called:**
- None - Engine is not imported in CandidateGraphBuilder

**Where Called:**
- Nowhere

**CandidateGraph Sections Filled:**
- None - Career section is built from raw input data without engine orchestration

**Unused Methods:**
- All 8 methods are unused

**Why Unused:**
- Career trajectory is currently built manually in `buildTrajectory()` without engine orchestration. This should be refactored to use CareerEngine methods.

**Coverage:** 0% (0/8 methods)

---

### CandidateProfileEngine
**Status:** ❌ NOT CONNECTED

**Methods Available:**
- `createProfile(identity, career)`
- `updateWithSimulation(profile, simulationData)`
- `enrichProfile(profile, additionalData)`
- `validateProfile(profile)`

**Methods Actually Called:**
- None - Engine is not imported in CandidateGraphBuilder

**Where Called:**
- Nowhere

**CandidateGraph Sections Filled:**
- None - Profile data is passed as raw input

**Unused Methods:**
- All 4 methods are unused

**Why Unused:**
- Candidate profile is currently passed as raw input rather than being built/managed by the engine. This should be refactored to use CandidateProfileEngine.

**Coverage:** 0% (0/4 methods)

---

### JobAnalyzerEngine
**Status:** ❌ NOT CONNECTED

**Methods Available:**
- `analyzeJobDescription(jobDescription, position, sector)`
- `determineSeniority(description, position)`
- `extractSkills(description)`
- `extractSoftSkills(description)`
- `analyzeCulture(description)`
- `extractKeywords(description)`
- `extractLeadershipExpectations(description, seniority)`
- `extractCommunicationExpectations(description, seniority)`
- `assessTechnicalLevel(description, seniority)`
- `predictRecruiterType(sector, seniority)`
- `assessExigency(description, seniority)`
- `assessPressure(description, sector)`
- `generateProbableQuestions(description, position, seniority)`
- `identifyProbableTraps(description, position)`

**Methods Actually Called:**
- None - Engine is not imported in CandidateGraphBuilder

**Where Called:**
- Nowhere

**CandidateGraph Sections Filled:**
- None - Job analysis is not part of current graph structure

**Unused Methods:**
- All 14 methods are unused

**Why Unused:**
- Job analysis is not currently integrated into the candidate graph. This should be added when job matching features are implemented.

**Coverage:** 0% (0/14 methods)

---

### InterviewAnalyzerEngine
**Status:** ❌ NOT CONNECTED

**Methods Available:**
- `generateQuestionAnalysis(conversationHistory, config)`
- `generateTimeline(conversationHistory, duration)`
- `generateSTARAnalysis(conversationHistory)`
- `generateLanguageAnalysis(conversationHistory)`
- `generatePostureAnalysis(config)`

**Methods Actually Called:**
- None - Engine is not imported in CandidateGraphBuilder

**Where Called:**
- Nowhere (used in useInterviewReport hook, not in graph)

**CandidateGraph Sections Filled:**
- None - Interview analysis is not part of current graph structure

**Unused Methods:**
- All 5 methods are unused

**Why Unused:**
- Interview analysis is currently handled in the useInterviewReport hook, not in the candidate graph. This should be integrated into the graph for historical tracking.

**Coverage:** 0% (0/5 methods)

---

### ProgressEngine
**Status:** ❌ NOT CONNECTED

**Methods Available:**
- `calculateProgress(currentScore, previousScores)`
- `generateProgressionTimeline(history)`
- `identifyTrends(scores)`
- `calculateVelocity(scores)`
- `predictFutureProgress(scores)`

**Methods Actually Called:**
- None - Engine is not imported in CandidateGraphBuilder

**Where Called:**
- Nowhere

**CandidateGraph Sections Filled:**
- `progress` - Built manually in `buildProgress()` without engine

**Unused Methods:**
- All 5 methods are unused

**Why Unused:**
- Progress tracking is currently built manually without engine orchestration. This should be refactored to use ProgressEngine.

**Coverage:** 0% (0/5 methods)

---

### CoachEngine
**Status:** ❌ NOT CONNECTED (REMOVED)

**Methods Available:**
- `generateCoachPlan(profile)`
- `generateSevenDayPlan(profile)`
- `generateThirtyDayPlan(profile)`
- `generateNinetyDayPlan(profile)`
- `adaptPlanBasedOnProgress(plan, progress)`
- `generateActionPlan(score)`

**Methods Actually Called:**
- None - Import was removed

**Where Called:**
- Nowhere

**CandidateGraph Sections Filled:**
- None - Coaching is not part of current graph structure

**Unused Methods:**
- All 6 methods are unused

**Why Unused:**
- CoachEngine was imported but never actually used. The import was removed in SPRINT 10.5 to eliminate unused imports.

**Coverage:** 0% (0/6 methods)

---

### MemoryEngine
**Status:** ❌ NOT CONNECTED

**Methods Available:**
- `storeMemory(key, data)`
- `retrieveMemory(key)`
- `updateMemory(key, data)`
- `clearMemory(key)`
- `getAllMemories()`
- `searchMemories(query)`

**Methods Actually Called:**
- None - Engine is not imported in CandidateGraphBuilder

**Where Called:**
- Nowhere

**CandidateGraph Sections Filled:**
- None - Memory is not part of current graph structure

**Unused Methods:**
- All 6 methods are unused

**Why Unused:**
- Memory management is not currently integrated into the candidate graph. This should be added when historical memory features are implemented.

**Coverage:** 0% (0/6 methods)

---

## CandidateGraph Section Coverage

| Section | Status | Data Source | Engine Used | Notes |
|---------|--------|-------------|-------------|-------|
| identity | ✅ Filled | Raw input | None | Direct mapping from input |
| career | ✅ Filled | Raw input | None | Direct mapping from input |
| candidateProfile | ❌ Not in graph | N/A | N/A | Should be added |
| experience | ❌ Not in graph | N/A | N/A | Should be added |
| education | ❌ Not in graph | N/A | N/A | Should be added |
| skills | ✅ Filled | Raw input | None | Direct mapping from input |
| softSkills | ✅ Filled | Filtered from skills | None | Filtered from skills array |
| hardSkills | ✅ Filled | Filtered from skills | None | Filtered from skills array |
| languages | ❌ Not in graph | N/A | N/A | Should be added |
| communication | ✅ Filled | Raw input | None | Mapped from liveScores |
| leadership | ✅ Filled | Raw input | None | Mapped from liveScores |
| confidence | ✅ Filled | Raw input | None | Mapped from liveScores |
| ats | ❌ Not in graph | N/A | N/A | Should be added |
| interviews | ❌ Not in graph | N/A | N/A | Should be added |
| history | ❌ Not in graph | N/A | N/A | Should be added |
| memory | ❌ Not in graph | N/A | N/A | Should be added |
| patterns | ⚠️ Empty | [] | None | Empty array - no engine |
| progress | ✅ Filled | Manual calculation | None | Should use ProgressEngine |
| trajectory | ⚠️ Partial | Manual calculation | None | Should use CareerEngine |
| coach | ❌ Not in graph | N/A | N/A | Should be added |
| recommendations | ⚠️ Empty | [] | None | Empty array - no engine |
| decisionReadiness | ✅ Filled | DecisionEngine | DecisionEngine | Partial coverage |
| riskAnalysis | ⚠️ Partial | Manual calculation | None | Should use dedicated engine |
| employability | ✅ Filled | Manual calculation | ScoreEngine | Partial coverage |
| overallScore | ✅ Filled | ScoreEngine | ScoreEngine | Fully covered |

---

## Summary

### Global Coverage
- **Engines Imported:** 4 (ScoreEngine, InsightEngine, DecisionEngine, RecommendationEngine)
- **Engines Available:** 11
- **Import Coverage:** 36% (4/11)
- **Method Coverage:** 19% (5/26 methods from imported engines)
- **CandidateGraph Sections Filled:** 13/24 (54%)
- **Fake Data Removed:** ✅ trajectory now returns null instead of "3-6 months"

### Actions Taken in SPRINT 10.5
1. ✅ Removed CoachEngine import (was unused)
2. ✅ Removed fake data from trajectory (replaced "3-6 months" with null)
3. ✅ Removed fake data from trajectory (replaced [] with null for requiredSkills, blockers, accelerators)
4. ✅ Removed dead code (buildCoach, buildPatterns, buildMemory methods)

### Remaining Issues
1. ❌ CareerEngine not used (trajectory built manually)
2. ❌ CandidateProfileEngine not used (profile passed as raw input)
3. ❌ JobAnalyzerEngine not used (job analysis not in graph)
4. ❌ InterviewAnalyzerEngine not used (interview analysis not in graph)
5. ❌ ProgressEngine not used (progress built manually)
6. ❌ MemoryEngine not used (memory not in graph)
7. ❌ Many CandidateGraph sections not implemented (candidateProfile, experience, education, languages, ats, interviews, history, memory, coach)
8. ❌ Patterns section empty (recommendations empty)
9. ❌ Risk analysis manual (should use dedicated engine)

### Recommendations
1. Integrate CareerEngine for trajectory calculation
2. Integrate CandidateProfileEngine for profile building
3. Add missing CandidateGraph sections
4. Integrate ProgressEngine for progress tracking
5. Consider adding JobAnalyzerEngine when job features are implemented
6. Consider adding InterviewAnalyzerEngine for interview history
7. Create dedicated RiskEngine for risk analysis
8. Add PatternEngine for pattern detection

---

## Compliance Status

**SPRINT 10.5 Requirements:**
- ✅ 0 unused imports (CoachEngine removed)
- ✅ 0 fake data (trajectory nullified)
- ✅ 0 placeholder comments
- ✅ 0 TODO comments
- ⚠️ Not 100% engine coverage (only 4/11 engines used)
- ⚠️ Not 100% section coverage (13/24 sections filled)

**Overall Status:** PARTIAL COMPLIANCE
- Import usage: ✅ 100% (all imported engines are used)
- Data integrity: ✅ 100% (no fake data)
- Engine coverage: ❌ 36% (4/11 engines connected)
- Section coverage: ❌ 54% (13/24 sections filled)
