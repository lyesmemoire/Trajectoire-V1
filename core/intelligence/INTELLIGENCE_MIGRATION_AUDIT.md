# Intelligence Migration Audit

## Overview

This document identifies all business logic locations in the Trajectoire codebase that need to be migrated to the Intelligence Engines.

---

## Critical Priority Files

### 1. `app/dashboard/interview-simulation/hooks/useInterviewReport.ts`

**Current Logic:**
- `calculateGlobalScore()` - Calculates average score from live scores
- `getLevel()` - Determines performance level
- `generateScoreBreakdown()` - Creates detailed score breakdowns with explanations
- `generateQuestionAnalysis()` - Analyzes conversation history
- `generateTimeline()` - Creates timeline of conversation
- `generateHighlights()` - Generates performance highlights
- `generateImprovements()` - Generates improvement suggestions
- `generateSTARAnalysis()` - STAR method analysis
- `generateLanguageAnalysis()` - Language analysis
- `generatePostureAnalysis()` - Posture analysis
- `generateRecruiterVision()` - Recruiter perspective
- `generateComparison()` - Comparison with benchmarks
- `generateActionPlan()` - 7/30/90 day action plan
- `generateNextSimulation()` - Next simulation recommendation
- `generateBehavioralAnalysis()` - Behavioral traits analysis
- `generateRecruiterPrivateNotes()` - Private recruiter notes
- `generateDecisionEstimation()` - Decision probability estimation
- `generateTippingFactors()` - Critical moments analysis
- `generateExecutiveSummary()` - Executive summary
- `generateEnhancedComparison()` - Enhanced comparison data

**Target Engines:**
- ScoreEngine → `calculateGlobalScore`, `generateScoreBreakdown`
- InterviewAnalyzerEngine → `generateSTARAnalysis`, `generateBehavioralAnalysis`
- InsightEngine → `generateHighlights`, `generateImprovements`, `generateRecruiterPrivateNotes`
- RecommendationEngine → `generateActionPlan`, `generateNextSimulation`
- DecisionEngine → `generateDecisionEstimation`, `generateRecruiterVision`
- CoachEngine → `generateActionPlan` (7/30/90 days)
- ProgressEngine → `generateComparison`, `generateEnhancedComparison`

**Action Required:**
- Replace all generation functions with engine calls
- Remove hardcoded text and random values
- Use real data from engines
- Maintain existing type interfaces

**Priority:** CRITICAL
**Risk:** HIGH - This is the core report generation logic
**Estimated Effort:** 4-6 hours

---

### 2. `app/dashboard/interview-simulation/hooks/useInterviewEvaluation.ts`

**Current Logic:**
- `updateScore()` - Updates individual scores
- `updateScoresBasedOnResponse()` - Updates scores based on response quality
- `incrementDifficulty()` - Increases difficulty level
- `resetScores()` - Resets to initial scores

**Target Engines:**
- ScoreEngine → Score normalization and updates
- InterviewAnalyzerEngine → Real-time analysis

**Action Required:**
- Integrate with ScoreEngine for score calculations
- Use InterviewAnalyzerEngine for response analysis
- Remove hardcoded score update logic

**Priority:** HIGH
**Risk:** MEDIUM - Live evaluation logic
**Estimated Effort:** 2-3 hours

---

### 3. `app/dashboard/ats/client.tsx`

**Current Logic:**
- `getScoreColor()` - Determines score color based on value
- `getScoreBg()` - Determines background color
- `getScoreLabel()` - Generates score label text
- UI state management for ATS analysis

**Target Engines:**
- ScoreEngine → Score normalization and categorization
- JobAnalyzerEngine → Job analysis
- InsightEngine → ATS insights
- RecommendationEngine → ATS recommendations

**Action Required:**
- Replace hardcoded score categorization with ScoreEngine
- Use JobAnalyzerEngine for job description parsing
- Use InsightEngine for ATS observations
- Use RecommendationEngine for ATS recommendations

**Priority:** HIGH
**Risk:** MEDIUM - ATS module is critical
**Estimated Effort:** 3-4 hours

---

### 4. `app/dashboard/history/page.tsx`

**Current Logic:**
- Mock data for interview history
- Mock data for CV history
- Average score calculation
- Score trend calculation
- Progression display

**Target Engines:**
- ProgressEngine → Progression tracking and trend analysis
- MemoryEngine → Historical data storage
- CareerEngine → Career progression

**Action Required:**
- Replace mock data with real queries
- Use ProgressEngine for trend analysis
- Integrate with MemoryEngine for historical insights
- Display progress from ProgressEngine

**Priority:** HIGH
**Risk:** LOW - Currently uses mock data
**Estimated Effort:** 2-3 hours

---

## Medium Priority Files

### 5. `app/dashboard/interview-simulation/types/interviewReport.ts`

**Current Logic:**
- Type definitions for interview report
- ScoreDetail interface with hardcoded content

**Target Engines:**
- No direct migration needed
- Types should align with engine outputs

**Action Required:**
- Update types to match engine outputs
- Remove hardcoded content from types
- Ensure type compatibility

**Priority:** MEDIUM
**Risk:** LOW - Type definitions only
**Estimated Effort:** 1 hour

---

### 6. `app/dashboard/interview-simulation/components/report/GlobalScore.tsx`

**Current Logic:**
- Score display logic
- Progression calculation

**Target Engines:**
- ScoreEngine → Score calculations
- ProgressEngine → Progression data

**Action Required:**
- Use ScoreEngine for score display
- Use ProgressEngine for progression

**Priority:** MEDIUM
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

### 7. `app/dashboard/interview-simulation/components/report/LanguageAnalysis.tsx`

**Current Logic:**
- Language analysis display
- Communication metrics

**Target Engines:**
- InterviewAnalyzerEngine → Communication analysis
- InsightEngine → Language insights

**Action Required:**
- Use InterviewAnalyzerEngine for communication scores
- Use InsightEngine for language observations

**Priority:** MEDIUM
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

### 8. `app/dashboard/interview-simulation/components/report/PostureAnalysis.tsx`

**Current Logic:**
- Posture analysis display
- Confidence metrics

**Target Engines:**
- InterviewAnalyzerEngine → Confidence analysis
- InsightEngine → Posture insights

**Action Required:**
- Use InterviewAnalyzerEngine for confidence scores
- Use InsightEngine for posture observations

**Priority:** MEDIUM
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

### 9. `app/dashboard/interview-simulation/components/report/STARAnalysis.tsx`

**Current Logic:**
- STAR method analysis display

**Target Engines:**
- InterviewAnalyzerEngine → STAR quality assessment
- InsightEngine → STAR insights

**Action Required:**
- Use InterviewAnalyzerEngine for STAR scores
- Use InsightEngine for STAR observations

**Priority:** MEDIUM
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

### 10. `app/dashboard/interview-simulation/components/report/QuestionAnalysis.tsx`

**Current Logic:**
- Question-by-question analysis

**Target Engines:**
- InterviewAnalyzerEngine → Question analysis
- InsightEngine → Question insights

**Action Required:**
- Use InterviewAnalyzerEngine for question scores
- Use InsightEngine for question observations

**Priority:** MEDIUM
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

## Low Priority Files

### 11. `app/dashboard/interview-simulation/components/report/Comparison.tsx`

**Current Logic:**
- Comparison with benchmarks display

**Target Engines:**
- ScoreEngine → Comparison calculations
- ProgressEngine → Benchmark data

**Action Required:**
- Use ScoreEngine for comparison logic
- Use ProgressEngine for benchmark data

**Priority:** LOW
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

### 12. `app/dashboard/interview-simulation/components/report/Motivation.tsx`

**Current Logic:**
- Motivation analysis display

**Target Engines:**
- InterviewAnalyzerEngine → Motivation analysis
- InsightEngine → Motivation insights

**Action Required:**
- Use InterviewAnalyzerEngine for motivation scores
- Use InsightEngine for motivation observations

**Priority:** LOW
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

### 13. `app/dashboard/interview-simulation/components/report/NextSimulation.tsx`

**Current Logic:**
- Next simulation recommendation display

**Target Engines:**
- RecommendationEngine → Next simulation recommendation
- CoachEngine → Coaching plan integration

**Action Required:**
- Use RecommendationEngine for recommendations
- Use CoachEngine for plan integration

**Priority:** LOW
**Risk:** LOW - Display component
**Estimated Effort:** 1 hour

---

## API Routes to Review

### 14. `app/api/interview/analyze/route.ts`

**Current Logic:**
- Interview analysis endpoint
- Score calculation

**Target Engines:**
- InterviewAnalyzerEngine
- ScoreEngine

**Action Required:**
- Integrate engines in API route
- Remove duplicate logic

**Priority:** MEDIUM
**Risk:** MEDIUM - API endpoint
**Estimated Effort:** 2 hours

---

### 15. `app/api/interview/feedback/route.ts`

**Current Logic:**
- Feedback generation

**Target Engines:**
- InsightEngine
- RecommendationEngine

**Action Required:**
- Use engines for feedback generation
- Remove hardcoded feedback

**Priority:** MEDIUM
**Risk:** MEDIUM - API endpoint
**Estimated Effort:** 2 hours

---

### 16. `app/api/interview/premium/report/route.ts`

**Current Logic:**
- Premium report generation

**Target Engines:**
- All engines (comprehensive report)

**Action Required:**
- Full integration with all engines
- Remove all hardcoded logic

**Priority:** HIGH
**Risk:** HIGH - Premium feature
**Estimated Effort:** 4-5 hours

---

## Summary Statistics

**Total Files to Migrate:** 16
**Critical Priority:** 4
**Medium Priority:** 8
**Low Priority:** 4

**Estimated Total Effort:** 25-35 hours

**Engines to be Used:**
- ScoreEngine (8 files)
- InterviewAnalyzerEngine (6 files)
- InsightEngine (7 files)
- RecommendationEngine (4 files)
- DecisionEngine (2 files)
- CoachEngine (2 files)
- ProgressEngine (4 files)
- JobAnalyzerEngine (1 file)
- MemoryEngine (1 file)
- CareerEngine (1 file)

---

## Migration Strategy

### Phase 1: Critical Path (Week 1)
1. Migrate `useInterviewReport.ts` - Core report generation
2. Migrate `useInterviewEvaluation.ts` - Live evaluation
3. Migrate ATS client - ATS module
4. Migrate History page - Historical data

### Phase 2: Display Components (Week 2)
5. Migrate all report display components
6. Update type definitions
7. Test report generation end-to-end

### Phase 3: API Routes (Week 3)
8. Migrate API routes
9. Test API endpoints
10. Integration testing

### Phase 4: Cleanup (Week 4)
11. Remove redundant logic
12. Performance optimization
13. Documentation updates

---

## Risk Assessment

**High Risk:**
- `useInterviewReport.ts` - Core report logic, breaking changes possible
- API routes - Public endpoints, must maintain compatibility

**Medium Risk:**
- ATS module - Critical user-facing feature
- Live evaluation - Real-time performance impact

**Low Risk:**
- Display components - UI only, easy to rollback
- History page - Currently uses mock data

---

## Success Criteria

- All business logic removed from React components
- All engines actively used in production
- No duplicate logic
- Type safety maintained
- Performance not degraded
- All tests passing
- Documentation updated
