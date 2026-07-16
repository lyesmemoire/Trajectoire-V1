# Interview Preparation Engine - Class Diagram

## Overview
This document defines the class diagram for the Interview Preparation Engine, showing relationships between all domain and application components.

---

## Domain Layer

### Entities

```
┌─────────────────────────────────────┐
│         InterviewPlan               │
│─────────────────────────────────────│
│ - planId: string                    │
│ - candidateId: string               │
│ - jobOfferId: string                │
│ - matchingId: string                │
│ - objective: InterviewObjective     │
│ - sections: InterviewSection[]      │
│ - constraints: InterviewConstraints │
│ - adaptiveRules: AdaptiveRules      │
│ - summary: InterviewSummary         │
│ - metadata: InterviewMetadata       │
│ - status: PlanStatus                │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
│─────────────────────────────────────│
│ + addSection(section): void         │
│ + removeSection(sectionId): void    │
│ + reorderSections(sectionIds): void │
│ + validate(): ValidationResult       │
│ + calculateTotalDuration(): Duration│
│ + getCoverageMatrix(): CoverageMatrix│
└─────────────────────────────────────┘
              │ 1
              │ *
              │
┌─────────────────────────────────────┐
│        InterviewSection             │
│─────────────────────────────────────│
│ - sectionId: string                 │
│ - planId: string                    │
│ - name: string                      │
│ - description: string                │
│ - objective: string                 │
│ - questions: InterviewQuestion[]     │
│ - timing: InterviewTiming            │
│ - order: number                     │
│ - isMandatory: boolean              │
│ - minQuestions: number              │
│ - maxQuestions: number              │
│─────────────────────────────────────│
│ + addQuestion(question): void       │
│ + removeQuestion(questionId): void  │
│ + reorderQuestions(questionIds): void│
│ + calculateDuration(): Duration     │
│ + getQuestionCount(): number       │
└─────────────────────────────────────┘
              │ 1
              │ *
              │
┌─────────────────────────────────────┐
│       InterviewQuestion             │
│─────────────────────────────────────│
│ - questionId: string                │
│ - sectionId: string                 │
│ - type: QuestionType                │
│ - difficulty: QuestionDifficulty    │
│ - text: string                      │
│ - expectedAnswer: ExpectedAnswer    │
│ - evaluationCriteria: EvaluationCriteria│
│ - competencyCoverage: CompetencyCoverage│
│ - timing: InterviewTiming            │
│ - dependencies: QuestionDependencies │
│ - order: number                     │
│ - isMandatory: boolean              │
│ - isAdaptive: boolean               │
│ - metadata: Record<string, unknown>  │
│─────────────────────────────────────│
│ + adjustDifficulty(difficulty): void│
│ + updateOrder(order): void          │
│ + addDependency(dependency): void   │
│ + removeDependency(dependencyId): void│
│ + matchesCandidateLevel(level): boolean│
│ + matchesJobRequirement(requirement): boolean│
└─────────────────────────────────────┘
```

### Value Objects

```
┌─────────────────────────────────────┐
│          QuestionType               │
│─────────────────────────────────────│
│ <<enumeration>>                      │
│ TECHNICAL                           │
│ BEHAVIORAL                          │
│ SITUATIONAL                         │
│ CULTURE_FIT                         │
│ PROBLEM_SOLVING                     │
│ LEADERSHIP                          │
│─────────────────────────────────────│
│ + isSoftSkill(): boolean            │
│ + isHardSkill(): boolean            │
│ + requiresCodeExample(): boolean    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       QuestionDifficulty            │
│─────────────────────────────────────│
│ <<enumeration>>                      │
│ BEGINNER                            │
│ INTERMEDIATE                        │
│ ADVANCED                            │
│ EXPERT                              │
│─────────────────────────────────────│
│ + toNumeric(): number               │
│ + fromNumeric(value): QuestionDifficulty│
│ + canBeAttemptedBy(level): boolean  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       EvaluationCriteria            │
│─────────────────────────────────────│
│ - criteriaId: string                │
│ - rubric: RubricItem[]              │
│ - maxScore: number                  │
│ - weight: number                    │
│ - requiredKeyPoints: string[]       │
│ - acceptableAnswerPatterns: string[] │
│─────────────────────────────────────│
│ + calculateScore(answer): number    │
│ + hasRequiredKeyPoints(answer): boolean│
│ + matchesPattern(answer): boolean   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      CompetencyCoverage             │
│─────────────────────────────────────│
│ - competencyId: string               │
│ - competencyName: string             │
│ - coverageLevel: CoverageLevel      │
│ - questionIds: string[]              │
│ - requiredCoverage: CoverageLevel   │
│─────────────────────────────────────│
│ + isCoverageSufficient(): boolean    │
│ + getCoveragePercentage(): number   │
│ + addQuestion(questionId): CompetencyCoverage│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        ExpectedAnswer               │
│─────────────────────────────────────│
│ - structure: AnswerStructure         │
│ - keyPoints: string[]                │
│ - examples: string[]                 │
│ - antiPatterns: string[]             │
│ - minimumLength: number              │
│ - maximumLength: number              │
│─────────────────────────────────────│
│ + matchesStructure(answer): boolean │
│ + hasKeyPoints(answer): boolean      │
│ + hasAntiPatterns(answer): boolean   │
│ + withinLengthBounds(answer): boolean│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        InterviewTiming              │
│─────────────────────────────────────│
│ - preparationTime: number            │
│ - answerTime: number                 │
│ - followUpTime: number               │
│ - totalTime: number                  │
│─────────────────────────────────────│
│ + calculateTotal(): number           │
│ + isWithinBounds(maxTime): boolean   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     InterviewConstraints            │
│─────────────────────────────────────│
│ - maxTotalDuration: number           │
│ - maxQuestionsPerSection: number     │
│ - maxTotalQuestions: number          │
│ - minSoftSkillQuestions: number      │
│ - minHardSkillQuestions: number      │
│ - maxDifficulty: QuestionDifficulty  │
│ - minDifficulty: QuestionDifficulty  │
│ - mandatoryCompetencies: string[]    │
│ - forbiddenTopics: string[]          │
│─────────────────────────────────────│
│ + validatePlan(plan): ValidationResult│
│ + isDurationValid(duration): boolean│
│ + isQuestionCountValid(count): boolean│
│ + isSkillBalanceValid(soft, hard): boolean│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         AdaptiveRules               │
│─────────────────────────────────────│
│ - enableDifficultyAdaptation: boolean│
│ - enableTopicAdaptation: boolean    │
│ - enableTimingAdaptation: boolean    │
│ - adaptationThreshold: number       │
│ - adaptationStrategy: AdaptationStrategy│
│─────────────────────────────────────│
│ + shouldAdapt(score): boolean       │
│ + getNewDifficulty(current, score): QuestionDifficulty│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      QuestionDependencies            │
│─────────────────────────────────────│
│ - requires: string[]                 │
│ - excludes: string[]                 │
│ - requiresMinimumScore: Map<string, number>│
│─────────────────────────────────────│
│ + canBeAsked(answered, scores): boolean│
│ + getBlockingQuestions(): string[]   │
│ + hasCircularDependency(id, all): boolean│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        CoverageMatrix               │
│─────────────────────────────────────│
│ - competencies: Map<string, CompetencyCoverage>│
│ - overallCoverage: number            │
│ - softSkillCoverage: number          │
│ - hardSkillCoverage: number          │
│ - gaps: string[]                     │
│─────────────────────────────────────│
│ + isCoverageSufficient(): boolean    │
│ + getGaps(): string[]                │
│ + getCoverageByCompetency(id): CompetencyCoverage│
│ + calculateOverallCoverage(): number  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       InterviewSummary              │
│─────────────────────────────────────│
│ - totalQuestions: number             │
│ - totalDuration: number              │
│ - softSkillQuestions: number         │
│ - hardSkillQuestions: number         │
│ - averageDifficulty: number          │
│ - sections: string[]                 │
│ - primaryCompetencies: string[]       │
│ - estimatedDifficulty: QuestionDifficulty│
│─────────────────────────────────────│
│ + isBalanced(): boolean             │
│ + isAppropriateForLevel(level): boolean│
└─────────────────────────────────────┘
```

---

## Application Layer

### Services

```
┌─────────────────────────────────────┐
│    InterviewPlanningService         │
│─────────────────────────────────────│
│ - persistence: InterviewPlanRepository│
│ - eventBus: EventBus                │
│ - diagnosticCollector: DiagnosticCollector│
│─────────────────────────────────────│
│ + generatePlan(request): Promise<InterviewPlan>│
│ + validatePlan(planId): Promise<ValidationResult>│
│ + approvePlan(planId): Promise<void>│
│ + rejectPlan(planId, reason): Promise<void>│
│ + archivePlan(planId): Promise<void>│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   QuestionGenerationService          │
│─────────────────────────────────────│
│ - questionProvider: QuestionProviderPort│
│ - questionFactory: InterviewQuestionFactory│
│ - eventBus: EventBus                │
│─────────────────────────────────────│
│ + generateQuestions(criteria): Promise<InterviewQuestion[]>│
│ + generateTechnicalQuestion(skill, difficulty): Promise<InterviewQuestion>│
│ + generateBehavioralQuestion(competency, difficulty): Promise<InterviewQuestion>│
│ + regenerateQuestion(questionId, adjustments): Promise<InterviewQuestion>│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   CoverageAnalysisService           │
│─────────────────────────────────────│
│ - coverageAnalyzer: CoverageAnalyzerPort│
│ - eventBus: EventBus                │
│─────────────────────────────────────│
│ + analyzeCoverage(plan, requirements): Promise<CoverageMatrix>│
│ + identifyGaps(plan, requirements): Promise<string[]>│
│ + suggestAdditionalQuestions(plan, gaps): Promise<InterviewQuestion[]>│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  DifficultyAdjustmentService         │
│─────────────────────────────────────│
│ - adaptiveRules: AdaptiveRules       │
│ - eventBus: EventBus                │
│─────────────────────────────────────│
│ + adjustDifficulty(questions, level): Promise<InterviewQuestion[]>│
│ + calculateOptimalDifficulty(candidateLevel, jobLevel): QuestionDifficulty│
│ + validateProgression(questions): ValidationResult│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    QuestionOrderingService          │
│─────────────────────────────────────│
│ - dependencies: QuestionDependencies  │
│ - constraints: InterviewConstraints  │
│─────────────────────────────────────│
│ + orderQuestions(questions, strategy): Promise<InterviewQuestion[]>│
│ + validateDependencies(questions): ValidationResult│
│ + resolveConflicts(questions): Promise<InterviewQuestion[]>│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   TimingCalculationService          │
│─────────────────────────────────────│
│ - constraints: InterviewConstraints  │
│ - questionType: QuestionType         │
│─────────────────────────────────────│
│ + calculateQuestionTiming(question): InterviewTiming│
│ + calculateSectionTiming(section): InterviewTiming│
│ + calculateTotalTiming(plan): InterviewTiming│
│ + validateTiming(plan, constraints): ValidationResult│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  InterviewValidationService          │
│─────────────────────────────────────│
│ - validator: InterviewPlanValidator  │
│ - questionCountPolicy: QuestionCountPolicy│
│ - durationPolicy: DurationPolicy    │
│ - difficultyPolicy: DifficultyPolicy│
│ - coveragePolicy: CoveragePolicy    │
│─────────────────────────────────────│
│ + validatePlan(plan): Promise<ValidationResult>│
│ + validateQuestion(question): ValidationResult│
│ + validateSection(section): ValidationResult│
│ + validateCoverage(plan, requirements): ValidationResult│
└─────────────────────────────────────┘
```

### Policies

```
┌─────────────────────────────────────┐
│      QuestionCountPolicy            │
│─────────────────────────────────────│
│ - minQuestions: number              │
│ - maxQuestions: number              │
│ - minPerSection: number             │
│ - maxPerSection: number             │
│─────────────────────────────────────│
│ + validate(count): boolean          │
│ + validateSection(count): boolean   │
│ + getViolationMessage(count): string│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        DurationPolicy               │
│─────────────────────────────────────│
│ - maxDuration: number               │
│ - minDuration: number               │
│ - maxPerQuestion: number            │
│─────────────────────────────────────│
│ + validate(duration): boolean       │
│ + validateQuestion(duration): boolean│
│ + getViolationMessage(duration): string│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      DifficultyPolicy               │
│─────────────────────────────────────│
│ - minDifficulty: QuestionDifficulty │
│ - maxDifficulty: QuestionDifficulty │
│ - allowJumps: boolean               │
│─────────────────────────────────────│
│ + validateProgression(difficulties): boolean│
│ + validateRange(difficulty): boolean│
│ + getViolationMessage(difficulty): string│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       CoveragePolicy                │
│─────────────────────────────────────│
│ - requiredCompetencies: string[]     │
│ - minCoverageLevel: CoverageLevel   │
│─────────────────────────────────────│
│ + validate(coverage): boolean       │
│ + getMissingCompetencies(coverage): string[]│
│ + getViolationMessage(coverage): string│
└─────────────────────────────────────┘
```

### Builders

```
┌─────────────────────────────────────┐
│     InterviewPlanBuilder            │
│─────────────────────────────────────│
│ - sectionBuilder: InterviewSectionBuilder│
│ - questionBuilder: InterviewQuestionBuilder│
│─────────────────────────────────────│
│ + buildPlan(request): InterviewPlan │
│ + addSection(builder): void         │
│ + addQuestion(builder): void        │
│ + withConstraints(constraints): void│
│ + withAdaptiveRules(rules): void    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   InterviewQuestionBuilder          │
│─────────────────────────────────────│
│─────────────────────────────────────│
│ + buildQuestion(data): InterviewQuestion│
│ + withType(type): void              │
│ + withDifficulty(difficulty): void │
│ + withCompetencies(competencies): void│
│ + withEvaluationCriteria(criteria): void│
│ + withTiming(timing): void          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    InterviewSectionBuilder           │
│─────────────────────────────────────│
│ - questionBuilder: InterviewQuestionBuilder│
│─────────────────────────────────────│
│ + buildSection(data): InterviewSection│
│ + withName(name): void              │
│ + withObjective(objective): void    │
│ + addQuestion(builder): void        │
│ + withTiming(timing): void          │
└─────────────────────────────────────┘
```

### Factories

```
┌─────────────────────────────────────┐
│     InterviewPlanFactory            │
│─────────────────────────────────────│
│ - sectionFactory: InterviewSectionFactory│
│─────────────────────────────────────│
│ + create(request): InterviewPlan    │
│ + createSection(data): InterviewSection│
│ + createEmpty(): InterviewPlan      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   InterviewQuestionFactory          │
│─────────────────────────────────────│
│─────────────────────────────────────│
│ + createFromTemplate(template, context): InterviewQuestion│
│ + createFromAI(response, context): InterviewQuestion│
│ + createEmpty(): InterviewQuestion  │
└─────────────────────────────────────┘
```

### Validators

```
┌─────────────────────────────────────┐
│   InterviewPlanValidator            │
│─────────────────────────────────────│
│ - questionCountPolicy: QuestionCountPolicy│
│ - durationPolicy: DurationPolicy    │
│ - difficultyPolicy: DifficultyPolicy│
│ - coveragePolicy: CoveragePolicy    │
│─────────────────────────────────────│
│ + validate(plan): ValidationResult   │
│ + validateStructure(plan): ValidationResult│
│ + validateInvariants(plan): ValidationResult│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  InterviewQuestionValidator          │
│─────────────────────────────────────│
│─────────────────────────────────────│
│ + validate(question): ValidationResult│
│ + validateStructure(question): ValidationResult│
│ + validateInvariants(question): ValidationResult│
└─────────────────────────────────────┘
```

### Events

```
┌─────────────────────────────────────┐
│ InterviewPlanningEventHandler        │
│─────────────────────────────────────│
│ - planningService: InterviewPlanningService│
│ - eventBus: EventBus                │
│ - diagnosticCollector: DiagnosticCollector│
│ - active: boolean                   │
│─────────────────────────────────────│
│ + start(): void                     │
│ + stop(): void                      │
│ + isActive(): boolean               │
│ + handleInterviewPlanRequested(event): void│
│ + handleInterviewPlanGenerated(event): void│
│ + handlePlanValidated(event): void  │
└─────────────────────────────────────┘
```

### Integration

```
┌─────────────────────────────────────┐
│ InterviewPlanningIntegration        │
│─────────────────────────────────────│
│ - eventHandler: InterviewPlanningEventHandler│
│ - diagnosticCollector: DiagnosticCollector│
│─────────────────────────────────────│
│ + start(): void                     │
│ + stop(): void                      │
│ + isActive(): boolean               │
└─────────────────────────────────────┘
```

---

## Infrastructure Layer

### Repositories

```
┌─────────────────────────────────────┐
│ InterviewPlanRepositoryImpl         │
│─────────────────────────────────────│
│ - mapper: InterviewPlanMapper        │
│ - db: DatabaseClient                │
│─────────────────────────────────────│
│ + save(plan): Promise<void>         │
│ + findById(planId): Promise<InterviewPlan | null>│
│ + findByCandidate(candidateId): Promise<InterviewPlan[]>│
│ + findByJobOffer(jobOfferId): Promise<InterviewPlan[]>│
│ + delete(planId): Promise<void>     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ QuestionTemplateRepositoryImpl       │
│─────────────────────────────────────│
│ - mapper: QuestionTemplateMapper     │
│ - db: DatabaseClient                │
│─────────────────────────────────────│
│ + findByType(type): Promise<QuestionTemplate[]>│
│ + findByCompetency(competencyId): Promise<QuestionTemplate[]>│
│ + findByDifficulty(difficulty): Promise<QuestionTemplate[]>│
└─────────────────────────────────────┘
```

### Providers

```
┌─────────────────────────────────────┐
│      AIQuestionProvider             │
│─────────────────────────────────────│
│ - aiAdapter: GPTAdapter             │
│─────────────────────────────────────│
│ + provideQuestions(criteria): Promise<InterviewQuestion[]>│
│ + provideTemplates(criteria): Promise<QuestionTemplate[]>│
│ + searchTemplates(query): Promise<QuestionTemplate[]>│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   TemplateQuestionProvider          │
│─────────────────────────────────────│
│ - repository: QuestionTemplateRepository│
│─────────────────────────────────────│
│ + provideQuestions(criteria): Promise<InterviewQuestion[]>│
│ + provideTemplates(criteria): Promise<QuestionTemplate[]>│
│ + searchTemplates(query): Promise<QuestionTemplate[]>│
└─────────────────────────────────────┘
```

### Mappers

```
┌─────────────────────────────────────┐
│     InterviewPlanMapper             │
│─────────────────────────────────────│
│─────────────────────────────────────│
│ + toDatabaseDTO(plan): InterviewPlanDatabaseDTO│
│ + fromDatabaseDTO(dto): InterviewPlan│
│ + fromDatabaseRecord(record): InterviewPlanDatabaseDTO│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   InterviewQuestionMapper           │
│─────────────────────────────────────│
│─────────────────────────────────────│
│ + toDatabaseDTO(question): InterviewQuestionDatabaseDTO│
│ + fromDatabaseDTO(dto): InterviewQuestion│
│ + fromDatabaseRecord(record): InterviewQuestionDatabaseDTO│
└─────────────────────────────────────┘
```

---

## Port Interfaces

```
┌─────────────────────────────────────┐
│  InterviewPlanGeneratorPort        │
│─────────────────────────────────────│
│ <<interface>>                       │
│─────────────────────────────────────│
│ + generate(request): Promise<InterviewPlan>│
│ + validate(plan): ValidationResult  │
│ + regenerate(planId, adjustments): Promise<InterviewPlan>│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     QuestionProviderPort            │
│─────────────────────────────────────│
│ <<interface>>                       │
│─────────────────────────────────────│
│ + provideQuestions(criteria): Promise<InterviewQuestion[]>│
│ + provideTemplates(criteria): Promise<QuestionTemplate[]>│
│ + searchTemplates(query): Promise<QuestionTemplate[]>│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    CoverageAnalyzerPort             │
│─────────────────────────────────────│
│ <<interface>>                       │
│─────────────────────────────────────│
│ + analyze(plan, requirements): CoverageMatrix│
│ + identifyGaps(plan, requirements): string[]│
│ + suggestImprovements(coverage): Suggestion[]│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   InterviewPlanRepository           │
│─────────────────────────────────────│
│ <<interface>>                       │
│─────────────────────────────────────│
│ + save(plan): Promise<void>         │
│ + findById(planId): Promise<InterviewPlan | null>│
│ + findByCandidate(candidateId): Promise<InterviewPlan[]>│
│ + findByJobOffer(jobOfferId): Promise<InterviewPlan[]>│
│ + delete(planId): Promise<void>     │
└─────────────────────────────────────┘
```

---

## Relationships Summary

### Aggregation
- InterviewPlan 1..* InterviewSection
- InterviewSection 1..* InterviewQuestion

### Composition
- InterviewPlan contains InterviewObjective (VO)
- InterviewPlan contains InterviewConstraints (VO)
- InterviewPlan contains AdaptiveRules (VO)
- InterviewPlan contains InterviewSummary (VO)
- InterviewPlan contains InterviewMetadata (VO)
- InterviewQuestion contains QuestionType (VO)
- InterviewQuestion contains QuestionDifficulty (VO)
- InterviewQuestion contains ExpectedAnswer (VO)
- InterviewQuestion contains EvaluationCriteria (VO)
- InterviewQuestion contains CompetencyCoverage (VO)
- InterviewQuestion contains InterviewTiming (VO)
- InterviewQuestion contains QuestionDependencies (VO)

### Association
- InterviewPlanningService uses InterviewPlanRepository
- InterviewPlanningService uses EventBus
- QuestionGenerationService uses QuestionProviderPort
- QuestionGenerationService uses InterviewQuestionFactory
- CoverageAnalysisService uses CoverageAnalyzerPort
- InterviewValidationService uses InterviewPlanValidator
- InterviewValidationService uses Policies
- InterviewPlanRepositoryImpl uses InterviewPlanMapper
- AIQuestionProvider uses GPTAdapter
- TemplateQuestionProvider uses QuestionTemplateRepository

### Realization
- InterviewPlanRepositoryImpl implements InterviewPlanRepository
- QuestionTemplateRepositoryImpl implements QuestionTemplateRepository
- AIQuestionProvider implements QuestionProviderPort
- TemplateQuestionProvider implements QuestionProviderPort
- InterviewPlanGeneratorImpl implements InterviewPlanGeneratorPort
