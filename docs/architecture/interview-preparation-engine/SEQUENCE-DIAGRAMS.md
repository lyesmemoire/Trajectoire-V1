# Interview Preparation Engine - Sequence Diagrams

## Overview
This document defines the sequence diagrams for the Interview Preparation Engine, showing the complete flow from input graphs to output interview plan.

---

## Sequence 1: Interview Plan Generation

### Participants
- **User**: Initiates plan generation
- **InterviewPlanningIntegration**: Entry point
- **InterviewPlanningEventHandler**: Handles events
- **InterviewPlanningService**: Orchestrates generation
- **InterviewPlanGeneratorPort**: Generation interface
- **InterviewPlanGeneratorImpl**: Generation implementation
- **QuestionGenerationService**: Generates questions
- **AIQuestionProvider**: AI integration
- **TemplateQuestionProvider**: Template integration
- **CoverageAnalysisService**: Analyzes coverage
- **QuestionOrderingService**: Orders questions
- **TimingCalculationService**: Calculates timing
- **InterviewValidationService**: Validates plan
- **InterviewPlanRepository**: Persists plan
- **EventBus**: Domain events

### Flow

```
User
  ↓ InterviewPlanRequested
InterviewPlanningIntegration
  ↓ start()
InterviewPlanningEventHandler
  ↓ handleInterviewPlanRequested()
InterviewPlanningService
  ↓ generatePlan(request)
InterviewPlanGeneratorImpl
  ↓ createEmptyPlan()
InterviewPlanFactory
  → InterviewPlan (empty)
  ↓ generateSections()
InterviewSectionFactory
  → InterviewSection[] (empty)
  ↓ generateQuestions()
QuestionGenerationService
  ↓ provideQuestions(criteria)
  ↓ (AI path)
AIQuestionProvider
  ↓ generateQuestion()
GPTAdapter
  ↓ call GPT API
  → QuestionGenerationResponse
  ↓ validateResponse()
  → InterviewQuestion
  ↓ (Template path - fallback)
TemplateQuestionProvider
  ↓ searchTemplates()
  → QuestionTemplate
  → InterviewQuestion
  → InterviewQuestion[]
  ↓ analyzeCoverage()
CoverageAnalysisService
  ↓ analyze(plan, requirements)
  → CoverageMatrix
  ↓ identifyGaps()
  → string[] (gaps)
  ↓ suggestAdditionalQuestions()
  → InterviewQuestion[] (additional)
  ↓ orderQuestions()
QuestionOrderingService
  ↓ orderQuestions(questions, strategy)
  → InterviewQuestion[] (ordered)
  ↓ validateDependencies()
  → ValidationResult
  ↓ calculateTiming()
TimingCalculationService
  ↓ calculateQuestionTiming()
  → InterviewTiming[]
  ↓ calculateSectionTiming()
  → InterviewTiming[]
  ↓ calculateTotalTiming()
  → InterviewTiming
  ↓ validateTiming()
  → ValidationResult
  ↓ validatePlan()
InterviewValidationService
  ↓ validatePlan(plan)
  → ValidationResult
  ↓ (if valid)
InterviewPlanRepository
  ↓ save(plan)
  → void
  ↓ InterviewPlanGenerated
EventBus
  ↓ publish()
InterviewPlanningService
  → InterviewPlan
  ↓ InterviewPlanCompleted
EventBus
  ↓ publish()
InterviewPlanningService
  → InterviewPlan
  ↓ InterviewPlanApproved
EventBus
  ↓ publish()
InterviewPlanningService
  → InterviewPlan
User
  ← InterviewPlan
```

---

## Sequence 2: Question Generation (AI Path)

### Participants
- **QuestionGenerationService**: Orchestrates generation
- **AIQuestionProvider**: AI integration
- **GPTAdapter**: GPT API adapter
- **GPT API**: OpenAI API
- **InterviewQuestionFactory**: Creates entities
- **InterviewQuestionValidator**: Validates entities
- **EventBus**: Domain events

### Flow

```
QuestionGenerationService
  ↓ generateQuestions(criteria)
AIQuestionProvider
  ↓ generateQuestion(request)
GPTAdapter
  ↓ sanitizeInput()
  → sanitized request
  ↓ call GPT API
GPT API
  → GPTResponse
GPTAdapter
  ↓ parseResponse()
  → QuestionGenerationResponse
  ↓ validateResponse()
  ↓ (if valid)
  → QuestionGenerationResponse
  ↓ (if invalid)
  → null (fallback to template)
AIQuestionProvider
  ↓ postProcessResponse()
  ↓ mapToDomain()
InterviewQuestionFactory
  ↓ createFromAI(response, context)
  → InterviewQuestion
  ↓ validateQuestion()
InterviewQuestionValidator
  ↓ validate(question)
  → ValidationResult
  ↓ (if valid)
  → InterviewQuestion
  ↓ (if invalid)
  → null (fallback to template)
AIQuestionProvider
  → InterviewQuestion[]
  ↓ QuestionGenerated
EventBus
  ↓ publish()
QuestionGenerationService
  → InterviewQuestion[]
```

---

## Sequence 3: Question Generation (Template Fallback)

### Participants
- **QuestionGenerationService**: Orchestrates generation
- **AIQuestionProvider**: AI integration
- **TemplateQuestionProvider**: Template integration
- **QuestionTemplateRepository**: Template storage
- **InterviewQuestionFactory**: Creates entities
- **InterviewQuestionValidator**: Validates entities
- **EventBus**: Domain events

### Flow

```
QuestionGenerationService
  ↓ generateQuestions(criteria)
AIQuestionProvider
  ↓ generateQuestion(request)
GPTAdapter
  ↓ call GPT API
  → error / invalid response
  → null
AIQuestionProvider
  ↓ (AI failed, use template)
TemplateQuestionProvider
  ↓ searchTemplates(criteria)
QuestionTemplateRepository
  ↓ findByType()
  ↓ findByCompetency()
  ↓ findByDifficulty()
  → QuestionTemplate[]
TemplateQuestionProvider
  ↓ selectBestTemplate()
  → QuestionTemplate
  ↓ mapToDomain()
InterviewQuestionFactory
  ↓ createFromTemplate(template, context)
  → InterviewQuestion
  ↓ validateQuestion()
InterviewQuestionValidator
  ↓ validate(question)
  → ValidationResult
  ↓ (if valid)
  → InterviewQuestion
  ↓ (if invalid)
  → null (use default template)
TemplateQuestionProvider
  ↓ getDefaultTemplate()
  → QuestionTemplate
  → InterviewQuestion
  → InterviewQuestion[]
  ↓ QuestionGenerated
EventBus
  ↓ publish()
QuestionGenerationService
  → InterviewQuestion[]
```

---

## Sequence 4: Coverage Analysis

### Participants
- **InterviewPlanningService**: Orchestrates analysis
- **CoverageAnalysisService**: Analyzes coverage
- **CoverageAnalyzerPort**: Analysis interface
- **CoveragePolicy**: Enforces coverage rules
- **EventBus**: Domain events

### Flow

```
InterviewPlanningService
  ↓ analyzeCoverage(plan, requirements)
CoverageAnalysisService
  ↓ analyze(plan, requirements)
CoverageAnalyzerPort
  ↓ calculateCoverage()
  → CoverageMatrix
  ↓ validateCoverage()
CoveragePolicy
  ↓ validate(coverageMatrix)
  → ValidationResult
  ↓ (if insufficient)
  → ValidationResult (invalid)
  ↓ identifyGaps()
CoverageAnalyzerPort
  ↓ getMissingCompetencies()
  → string[]
  ↓ suggestImprovements()
CoverageAnalyzerPort
  ↓ suggestAdditionalQuestions()
  → Suggestion[]
  ↓ suggestQuestions()
QuestionGenerationService
  ↓ generateQuestions(criteria)
  → InterviewQuestion[]
  → InterviewQuestion[]
  ↓ reanalyzeCoverage()
CoverageAnalysisService
  ↓ analyze(plan, requirements)
  → CoverageMatrix
  ↓ CoverageCompleted
EventBus
  ↓ publish()
CoverageAnalysisService
  → CoverageMatrix
InterviewPlanningService
  → CoverageMatrix
```

---

## Sequence 5: Plan Validation

### Participants
- **InterviewPlanningService**: Orchestrates validation
- **InterviewValidationService**: Validates plan
- **InterviewPlanValidator**: Validates aggregate
- **QuestionCountPolicy**: Enforces count rules
- **DurationPolicy**: Enforces duration rules
- **DifficultyPolicy**: Enforces difficulty rules
- **CoveragePolicy**: Enforces coverage rules
- **EventBus**: Domain events

### Flow

```
InterviewPlanningService
  ↓ validatePlan(planId)
InterviewValidationService
  ↓ validatePlan(plan)
InterviewPlanValidator
  ↓ validateStructure(plan)
  → ValidationResult
  ↓ validateInvariants(plan)
  → ValidationResult
  ↓ (if structure valid)
  ↓ validateCount()
QuestionCountPolicy
  ↓ validate(totalQuestions)
  → ValidationResult
  ↓ validateSectionCounts()
  → ValidationResult
  → ValidationResult
  ↓ (if count valid)
  ↓ validateDuration()
DurationPolicy
  ↓ validate(totalDuration)
  → ValidationResult
  ↓ validateQuestionDurations()
  → ValidationResult
  → ValidationResult
  ↓ (if duration valid)
  ↓ validateDifficulty()
DifficultyPolicy
  ↓ validateProgression(difficulties)
  → ValidationResult
  ↓ validateRange(difficulties)
  → ValidationResult
  → ValidationResult
  ↓ (if difficulty valid)
  ↓ validateCoverage()
CoveragePolicy
  ↓ validate(coverageMatrix)
  → ValidationResult
  ↓ getMissingCompetencies()
  → string[]
  → ValidationResult
  → ValidationResult
InterviewValidationService
  ↓ (if all valid)
  ↓ PlanValidated
EventBus
  ↓ publish()
  → ValidationResult (valid)
  ↓ (if any invalid)
  ↓ PlanRejected
EventBus
  ↓ publish()
  → ValidationResult (invalid)
InterviewPlanningService
  → ValidationResult
```

---

## Sequence 6: Plan Modification

### Participants
- **User**: Initiates modification
- **InterviewPlanningIntegration**: Entry point
- **InterviewPlanningService**: Orchestrates modification
- **InterviewPlanRepository**: Loads plan
- **InterviewPlanValidator**: Validates modification
- **CoverageAnalysisService**: Reanalyzes coverage
- **QuestionOrderingService**: Reorders questions
- **EventBus**: Domain events

### Flow

```
User
  ↓ modifyPlan(planId, modifications)
InterviewPlanningIntegration
  ↓ handleModification()
InterviewPlanningService
  ↓ loadPlan(planId)
InterviewPlanRepository
  ↓ findById(planId)
  → InterviewPlan
InterviewPlanningService
  ↓ applyModifications(plan, modifications)
  ↓ (add question)
InterviewPlan
  ↓ addQuestion(question)
  → InterviewPlan
  ↓ QuestionAdded
EventBus
  ↓ publish()
  ↓ (remove question)
InterviewPlan
  ↓ removeQuestion(questionId)
  → InterviewPlan
  ↓ QuestionRemoved
EventBus
  ↓ publish()
  ↓ (reorder questions)
InterviewPlan
  ↓ reorderQuestions(questionIds)
  → InterviewPlan
  ↓ QuestionReordered
EventBus
  ↓ publish()
  ↓ (adjust difficulty)
InterviewPlan
  ↓ adjustDifficulty(questionId, newDifficulty)
  → InterviewPlan
  ↓ DifficultyAdjusted
EventBus
  ↓ publish()
  ↓ reanalyzeCoverage()
CoverageAnalysisService
  ↓ analyze(plan, requirements)
  → CoverageMatrix
  ↓ reorderQuestions()
QuestionOrderingService
  ↓ orderQuestions(questions, strategy)
  → InterviewQuestion[]
  ↓ validatePlan()
InterviewPlanValidator
  ↓ validate(plan)
  → ValidationResult
  ↓ (if valid)
InterviewPlanRepository
  ↓ save(plan)
  → void
  ↓ PlanModified
EventBus
  ↓ publish()
  ↓ PlanValidated
EventBus
  ↓ publish()
InterviewPlanningService
  → InterviewPlan
User
  ← InterviewPlan
```

---

## Sequence 7: Adaptive Difficulty Adjustment

### Participants
- **InterviewPlanningService**: Orchestrates adjustment
- **DifficultyAdjustmentService**: Adjusts difficulty
- **AdaptiveRules**: Defines adaptation rules
- **QuestionOrderingService**: Reorders questions
- **EventBus**: Domain events

### Flow

```
InterviewPlanningService
  ↓ applyAdaptiveRules(plan, candidatePerformance)
DifficultyAdjustmentService
  ↓ adjustDifficulty(questions, candidateLevel)
AdaptiveRules
  ↓ shouldAdapt(currentScore)
  → boolean
  ↓ (if true)
  ↓ getNewDifficulty(currentDifficulty, score)
  → QuestionDifficulty
  → QuestionDifficulty[]
  ↓ validateProgression()
DifficultyPolicy
  ↓ validateProgression(difficulties)
  → ValidationResult
  ↓ (if valid)
  → InterviewQuestion[]
  ↓ (if invalid)
  ↓ revertAdjustment()
  → InterviewQuestion[]
  ↓ reorderQuestions()
QuestionOrderingService
  ↓ orderQuestions(questions, strategy)
  → InterviewQuestion[]
  ↓ DifficultyAdjusted
EventBus
  ↓ publish()
DifficultyAdjustmentService
  → InterviewQuestion[]
InterviewPlanningService
  → InterviewPlan
```

---

## Sequence 8: Complete End-to-End Flow

### Participants
- **CandidateGraph**: Input graph
- **JobOfferGraph**: Input graph
- **MatchingGraph**: Input graph
- **InterviewPlanningIntegration**: Entry point
- **InterviewPlanningService**: Orchestrates entire flow
- **InterviewPlanGeneratorImpl**: Generates plan
- **QuestionGenerationService**: Generates questions
- **CoverageAnalysisService**: Analyzes coverage
- **QuestionOrderingService**: Orders questions
- **TimingCalculationService**: Calculates timing
- **InterviewValidationService**: Validates plan
- **InterviewPlanRepository**: Persists plan
- **EventBus**: Domain events
- **Voice Interview Engine**: Consumer

### Flow

```
CandidateGraph
  → CandidateProfile
JobOfferGraph
  → JobOffer
MatchingGraph
  → MatchingAnalysis
  ↓ InterviewPlanRequested
InterviewPlanningIntegration
  ↓ handleRequest()
InterviewPlanningService
  ↓ generatePlan(request)
InterviewPlanGeneratorImpl
  ↓ analyzeInputs(candidate, job, matching)
  → AnalysisResult
  ↓ determineStrategy()
  → GenerationStrategy
  ↓ generateSections()
  → InterviewSection[]
  ↓ generateQuestions()
QuestionGenerationService
  ↓ generateQuestions(criteria)
  → InterviewQuestion[]
  ↓ analyzeCoverage()
CoverageAnalysisService
  ↓ analyze(plan, requirements)
  → CoverageMatrix
  ↓ identifyGaps()
  → string[]
  ↓ (if gaps)
  ↓ suggestAdditionalQuestions()
  → InterviewQuestion[]
  ↓ orderQuestions()
QuestionOrderingService
  ↓ orderQuestions(questions, strategy)
  → InterviewQuestion[]
  ↓ calculateTiming()
TimingCalculationService
  ↓ calculateTiming(plan)
  → InterviewTiming
  ↓ validatePlan()
InterviewValidationService
  ↓ validatePlan(plan)
  → ValidationResult
  ↓ (if valid)
InterviewPlanRepository
  ↓ save(plan)
  → void
  ↓ InterviewPlanGenerated
EventBus
  ↓ publish()
  ↓ InterviewPlanCompleted
EventBus
  ↓ publish()
  ↓ InterviewPlanApproved
EventBus
  ↓ publish()
InterviewPlanningService
  → InterviewPlan
  ↓ (notify consumers)
Voice Interview Engine
  ← InterviewPlan
```

---

## Error Handling Flows

### Error Flow 1: AI Generation Failure

```
QuestionGenerationService
  ↓ generateQuestions(criteria)
AIQuestionProvider
  ↓ generateQuestion(request)
GPTAdapter
  ↓ call GPT API
  → error
  → null
AIQuestionProvider
  ↓ (AI failed, use template)
TemplateQuestionProvider
  ↓ searchTemplates(criteria)
  → QuestionTemplate
  → InterviewQuestion
  → InterviewQuestion[]
  ↓ (if template also fails)
  → empty array
  ↓ alert monitoring
MonitoringService
  ↓ logError()
  ↓ alert()
QuestionGenerationService
  → InterviewQuestion[] (empty or partial)
```

### Error Flow 2: Validation Failure

```
InterviewPlanningService
  ↓ validatePlan(plan)
InterviewValidationService
  ↓ validatePlan(plan)
InterviewPlanValidator
  ↓ validateStructure(plan)
  → ValidationResult (invalid)
  ↓ PlanRejected
EventBus
  ↓ publish()
  ↓ notify user
NotificationService
  ↓ sendNotification()
InterviewPlanningService
  → ValidationResult (invalid)
```

### Error Flow 3: Repository Failure

```
InterviewPlanningService
  ↓ savePlan(plan)
InterviewPlanRepository
  ↓ save(plan)
  → error
  ↓ alert monitoring
MonitoringService
  ↓ logError()
  ↓ alert()
  ↓ retry
InterviewPlanRepository
  ↓ save(plan)
  → success
  ↓ (if retry succeeds)
  → void
  ↓ (if retry fails)
  → error
InterviewPlanningService
  → error
```

---

## Performance Considerations

### Parallel Operations

- Question generation can be parallelized across sections
- Coverage analysis can run concurrently with question generation
- Timing calculation can run concurrently with ordering

### Caching

- AI responses can be cached for similar requests
- Templates are cached in memory
- Coverage analysis results can be cached

### Batching

- Multiple questions can be generated in a single AI call
- Multiple validation checks can be batched
- Multiple repository operations can be batched
