# Intelligence Engine Architecture

## Overview

The Intelligence Engine is the central business logic layer for Trajectoire. It provides a single source of truth for all intelligence-related operations across the application, including ATS analysis, interview reports, progression tracking, recommendations, and decision-making.

## Architecture Principles

- **No React dependencies**: Pure TypeScript business logic
- **SOLID principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion
- **TypeScript strict**: Full type safety with no `any` types
- **100% reusable**: All engines can be used independently or combined
- **No simulated AI**: All logic is rule-based and deterministic
- **Context-aware**: Every recommendation considers the full context (CV, job, history, errors, successes)

## Directory Structure

```
/core/intelligence/
├── types/
│   └── index.ts              # Shared types for all engines
├── engines/
│   ├── index.ts              # Central export point
│   ├── careerEngine.ts       # Career progression logic
│   ├── candidateProfile.ts   # Profile management
│   ├── jobAnalyzer.ts        # Job description analysis
│   ├── interviewAnalyzer.ts  # Interview performance analysis
│   ├── recommendationEngine.ts# Personalized recommendations
│   ├── progressEngine.ts     # Progress tracking and trends
│   ├── scoreEngine.ts        # Score calculation and normalization
│   ├── coachEngine.ts        # Coaching plan generation
│   ├── insightEngine.ts      # Observation generation
│   ├── decisionEngine.ts     # Recruiter-style decisions
│   └── memoryEngine.ts       # Memory and pattern detection
└── INTELLIGENCE_ENGINE_ARCHITECTURE.md
```

## Engine Responsibilities

### 1. CareerEngine

**Responsibilities:**
- Calculate career level based on experience and performance
- Determine career progression trajectory
- Identify career gaps and opportunities
- Calculate employability score
- Recommend career moves

**Key Methods:**
- `calculateCareerLevel()` - Determines appropriate career level
- `isReadyForNextLevel()` - Checks if candidate can progress
- `calculateEmployabilityScore()` - Overall employability assessment
- `identifyCareerOpportunities()` - Career advancement suggestions
- `identifyCareerGaps()` - Areas needing improvement

**Data Flow:**
```
Candidate Profile → Career Level Calculation → Gap Analysis → Opportunities
```

### 2. CandidateProfileEngine

**Responsibilities:**
- Build and maintain candidate profiles
- Calculate dynamic profile metrics
- Update profile based on new data
- Profile enrichment and validation

**Key Methods:**
- `createProfile()` - Initialize new candidate profile
- `updateWithSimulation()` - Incorporate simulation results
- `updateATSScore()` - Update ATS scoring
- `updateSkill()` - Update skill assessments
- `calculateProfileCompleteness()` - Profile completion percentage
- `validateProfile()` - Data consistency validation

**Data Flow:**
```
Identity + Career → Profile Creation → Simulation Updates → Validation
```

### 3. JobAnalyzerEngine

**Responsibilities:**
- Parse and analyze job descriptions
- Extract key requirements and expectations
- Identify cultural fit indicators
- Determine probable interview questions
- Assess job difficulty and pressure
- Predict recruiter type and style

**Key Methods:**
- `analyzeJobDescription()` - Full job analysis
- `determineSeniority()` - Extract seniority level
- `extractSkills()` - Identify required skills
- `analyzeCulture()` - Cultural profile extraction
- `generateProbableQuestions()` - Interview question prediction
- `identifyProbableTraps()` - Interview trap identification

**Data Flow:**
```
Job Description → Skill Extraction → Culture Analysis → Question Generation
```

### 4. InterviewAnalyzerEngine

**Responsibilities:**
- Analyze interview performance across multiple dimensions
- Identify forces and weaknesses
- Detect contradictions in responses
- Assess quality of examples and STAR method usage
- Calculate composite scores for various competencies

**Key Methods:**
- `analyzeInterview()` - Full interview performance analysis
- `identifyForces()` - Strength identification
- `identifyWeaknesses()` - Weakness identification
- `detectContradictions()` - Inconsistency detection
- `assessSTARQuality()` - STAR method evaluation
- `assessImpact()` - Business impact assessment

**Data Flow:**
```
Profile + Job + Simulation → Multi-dimensional Analysis → Score Calculation
```

### 5. RecommendationEngine

**Responsibilities:**
- Generate personalized recommendations based on full context
- Avoid generic advice - every recommendation is context-specific
- Provide actionable, time-bound recommendations with expected impact
- Prioritize recommendations based on urgency and impact

**Key Methods:**
- `generateRecommendations()` - Context-aware recommendations
- `generateQuickWins()` - Easy improvements with high impact

**Data Flow:**
```
Profile + Job + Interview → Gap Analysis → Contextual Recommendations
```

### 6. ProgressEngine

**Responsibilities:**
- Track progression across all metrics
- Detect trends (improvement, regression, stagnation, acceleration, plateau)
- Calculate velocity of change
- Predict future performance
- Identify plateaus and suggest interventions

**Key Methods:**
- `analyzeProgressTrend()` - Single metric trend analysis
- `analyzeOverallProgress()` - Multi-metric progress overview
- `detectPlateau()` - Plateau detection
- `suggestPlateauIntervention()` - Intervention recommendations
- `generateProgressReport()` - Comprehensive progress summary

**Data Flow:**
```
History → Trend Analysis → Velocity Calculation → Prediction
```

### 7. ScoreEngine

**Responsibilities:**
- Calculate composite scores from multiple data sources
- Weight scores based on job requirements
- Normalize scores across different scales
- Calculate probability scores
- Generate score breakdowns and explanations

**Key Methods:**
- `calculateOverallScore()` - Composite interview score
- `calculateJobFitScore()` - Job compatibility assessment
- `calculateSuccessProbability()` - Success likelihood
- `generateScoreBreakdown()` - Detailed score explanation
- `normalizeScore()` - Score normalization

**Data Flow:**
```
Multiple Data Sources → Weighted Calculation → Normalization → Breakdown
```

### 8. CoachEngine

**Responsibilities:**
- Generate personalized coaching plans (7 days, 30 days, 90 days)
- Create daily, weekly, and monthly objectives
- Design exercises and practice activities
- Recommend specific simulations
- Adapt plans based on progress

**Key Methods:**
- `generateCoachPlan()` - Comprehensive coaching plan
- `generateSevenDayPlan()` - Immediate action plan
- `generateThirtyDayPlan()` - Short-term development
- `generateNinetyDayPlan()` - Long-term mastery
- `adaptPlan()` - Plan adjustment based on progress

**Data Flow:**
```
Profile + Job + Interview → Plan Generation → Exercise Design → Adaptation
```

### 9. InsightEngine

**Responsibilities:**
- Generate observations from data (not scores)
- Detect patterns in behavior and performance
- Provide actionable insights
- Identify recurring themes
- Generate contextual observations

**Key Methods:**
- `generateInsights()` - Full insight generation
- `generateCommunicationInsights()` - Communication patterns
- `generateLeadershipInsights()` - Leadership observations
- `generatePatternInsights()` - Historical pattern detection
- `generateQuickInsights()` - Dashboard-ready insights

**Data Flow:**
```
Profile + Interview + Job → Pattern Detection → Insight Generation
```

### 10. DecisionEngine

**Responsibilities:**
- Generate recruiter-style decisions
- Provide reasoning like a real recruiter would
- Avoid generic responses
- Create hundreds of variants for natural language
- Consider context, profile, and performance

**Key Methods:**
- `generateDecision()` - Main decision generation
- `generateSecondInterviewDecision()` - Second interview recommendation
- `generateHRRecommendation()` - HR recommendation
- `generateManagerValidation()` - Manager validation
- `generateDirectorValidation()` - Director validation

**Data Flow:**
```
Profile + Job + Interview → Decision Logic → Natural Language Generation
```

### 11. MemoryEngine

**Responsibilities:**
- Store and retrieve memory events
- Detect patterns across time
- Remember recurring errors and successes
- Provide contextual memory for recommendations
- Track long-term progress and regressions

**Key Methods:**
- `addMemory()` - Store memory event
- `detectRecurringPattern()` - Pattern detection
- `generateMemoryInsights()` - Memory-based observations
- `rememberError()` - Error tracking
- `rememberSuccess()` - Success tracking
- `generateMemoryBasedRecommendations()` - Contextual recommendations

**Data Flow:**
```
Events → Memory Storage → Pattern Detection → Contextual Retrieval
```

## Data Flow Architecture

### Primary Flow

```
User Input → CandidateProfile → JobAnalysis → InterviewAnalyzer
    ↓
ScoreEngine → InsightEngine → RecommendationEngine
    ↓
CoachEngine → ProgressEngine → DecisionEngine
    ↓
MemoryEngine (tracks everything)
```

### Secondary Flow (Report Generation)

```
Profile + Job + Simulation → InterviewAnalyzer
    ↓
ScoreEngine → InsightEngine → DecisionEngine
    ↓
Report Generation (UI Layer)
```

### Tertiary Flow (Dashboard)

```
Profile History → ProgressEngine → InsightEngine
    ↓
Dashboard Display (UI Layer)
```

## Extension Points

### Adding New Engines

1. Create engine file in `/core/intelligence/engines/`
2. Follow SOLID principles
3. Use shared types from `/core/intelligence/types/`
4. Export from `/core/intelligence/engines/index.ts`
5. Add documentation to this file

### Adding New Types

1. Add to `/core/intelligence/types/index.ts`
2. Ensure TypeScript strict compliance
3. Document purpose and usage
4. Update engine implementations as needed

### Extending Existing Engines

1. Add new methods following existing patterns
2. Maintain backward compatibility
3. Update documentation
4. Add tests (when test suite is implemented)

## Integration Points

### With ATS Module

```typescript
import { ScoreEngine, CandidateProfileEngine } from '@/core/intelligence';

const profile = CandidateProfileEngine.updateATSScore(profile, atsScore, trend);
const jobFit = ScoreEngine.calculateJobFitScore(profile, jobAnalysis);
```

### With Interview Simulation

```typescript
import { InterviewAnalyzerEngine, InsightEngine } from '@/core/intelligence';

const analysis = InterviewAnalyzerEngine.analyzeInterview(profile, job, simulationData);
const insights = InsightEngine.generateInsights(profile, analysis, job);
```

### With Report Generation

```typescript
import { DecisionEngine, RecommendationEngine } from '@/core/intelligence';

const decision = DecisionEngine.generateDecision(profile, job, interviewAnalysis);
const recommendations = RecommendationEngine.generateRecommendations(profile, job, interviewAnalysis);
```

### With Dashboard

```typescript
import { ProgressEngine, InsightEngine } from '@/core/intelligence';

const progress = ProgressEngine.analyzeOverallProgress(profile);
const quickInsights = InsightEngine.generateQuickInsights(profile);
```

## Performance Considerations

- All engines use pure functions where possible
- Memoization is handled at the hook level (React)
- Memory engine limits storage to 1000 events
- No external API calls or async operations
- Minimal computational overhead

## Future Enhancements

### Planned Additions

1. **Machine Learning Integration**: Pattern recognition beyond rule-based
2. **Natural Language Processing**: Advanced text analysis for responses
3. **Sentiment Analysis**: Emotional state detection
4. **Voice Analysis**: Audio-based insights (when voice data available)
5. **Video Analysis**: Non-verbal communication assessment
6. **Peer Benchmarking**: Comparison with anonymized peer data
7. **Market Analysis**: Job market trends and salary insights

### Extension Hooks

- `useIntelligence()` - Central hook for all intelligence operations
- `useCareerProgression()` - Career-specific operations
- `useJobMatching()` - Job fit and recommendations
- `useCoaching()` - Coaching plan management

## Testing Strategy

When test suite is implemented:

1. **Unit Tests**: Each engine method independently
2. **Integration Tests**: Engine interactions
3. **End-to-End Tests**: Full user flows
4. **Performance Tests**: Memory and computation limits
5. **Type Tests**: TypeScript strict compliance

## Maintenance Guidelines

1. **Type Safety**: Never use `any` - always use specific types
2. **Documentation**: Update this file for significant changes
3. **Backward Compatibility**: Maintain existing public APIs
4. **Code Quality**: Follow existing patterns and conventions
5. **Performance**: Monitor memory usage and computation time

## Dependencies

- **External**: None (pure TypeScript)
- **Internal**: Only shared types from `/core/intelligence/types/`
- **React**: None (intentionally React-free)

## Version History

- **v1.0** (SPRINT 9): Initial implementation with 11 engines
  - CareerEngine
  - CandidateProfileEngine
  - JobAnalyzerEngine
  - InterviewAnalyzerEngine
  - RecommendationEngine
  - ProgressEngine
  - ScoreEngine
  - CoachEngine
  - InsightEngine
  - DecisionEngine
  - MemoryEngine
