# Interview Preparation Engine - Domain Model

## Overview
This document defines the complete domain model for the Interview Preparation Engine, following Domain-Driven Design principles and the FEATURE_B5 architectural pattern.

---

## Bounded Contexts

### 1. Candidate Context
**Responsibility**: Manages candidate profile and graph data
**Input**: CandidateGraph
**Entities**: Candidate, CandidateProfile, Skill, Experience
**Value Objects**: SkillLevel, ExperienceDuration

### 2. Job Context
**Responsibility**: Manages job offer and requirements
**Input**: JobOfferGraph
**Entities**: JobOffer, Requirement, Competency
**Value Objects**: SkillRequirement, ExperienceRequirement

### 3. Matching Context
**Responsibility**: Analyzes candidate-job fit
**Input**: MatchingGraph
**Entities**: MatchAnalysis, GapAnalysis
**Value Objects**: MatchScore, GapSeverity

### 4. Interview Planning Context (Primary)
**Responsibility**: Generates interview plans
**Output**: InterviewPlan
**Entities**: InterviewPlan, InterviewQuestion, InterviewSection
**Value Objects**: QuestionType, QuestionDifficulty, EvaluationCriteria, CompetencyCoverage, ExpectedAnswer, InterviewTiming, InterviewConstraints, AdaptiveRules, QuestionDependencies, CoverageMatrix, InterviewSummary

### 5. Interview Execution Context
**Responsibility**: Executes interviews
**Consumer**: Voice Interview Engine, Speech-to-Text, Live Analysis, Live Coaching, Final Report, Learning Engine
**Input**: InterviewPlan

---

## Entities

### InterviewPlan (Aggregate Root)

**Responsibility**: Complete interview strategy and structure
**Lifecycle**: Created → Generated → Validated → Approved → Executed → Archived
**Invariants**:
- Must have at least one section
- Total duration must not exceed maximum allowed
- Must cover all mandatory competencies
- Must respect soft/hard skills balance

**Relations**:
- Contains: InterviewSection[] (1..*)
- Depends on: CandidateGraph, JobOfferGraph, MatchingGraph
- Owned by: InterviewPlanningService

**Attributes**:
- `planId`: string (unique identifier)
- `candidateId`: string (reference to Candidate)
- `jobOfferId`: string (reference to JobOffer)
- `matchingId`: string (reference to MatchingAnalysis)
- `objective`: InterviewObjective
- `sections`: InterviewSection[]
- `constraints`: InterviewConstraints
- `adaptiveRules`: AdaptiveRules
- `summary`: InterviewSummary
- `metadata`: InterviewMetadata
- `status`: PlanStatus (DRAFT, GENERATED, VALIDATED, APPROVED, EXECUTED, ARCHIVED)
- `createdAt`: Date
- `updatedAt`: Date

**Behavior**:
- addSection(section: InterviewSection): void
- removeSection(sectionId: string): void
- reorderSections(sectionIds: string[]): void
- validate(): ValidationResult
- calculateTotalDuration(): Duration
- getCoverageMatrix(): CoverageMatrix

---

### InterviewQuestion

**Responsibility**: Individual interview question with evaluation criteria
**Lifecycle**: Created → Generated → Validated → Approved → Used → Archived
**Invariants**:
- Must have a type
- Must have a difficulty level
- Must have evaluation criteria
- Must map to at least one competency

**Relations**:
- Belongs to: InterviewSection (1)
- Maps to: Competency[] (1..*)
- Evaluated by: EvaluationCriteria (1)

**Attributes**:
- `questionId`: string (unique identifier)
- `sectionId`: string (reference to InterviewSection)
- `type`: QuestionType
- `difficulty`: QuestionDifficulty
- `text`: string (question text)
- `expectedAnswer`: ExpectedAnswer
- `evaluationCriteria`: EvaluationCriteria
- `competencyCoverage`: CompetencyCoverage
- `timing`: InterviewTiming
- `dependencies`: QuestionDependencies
- `order`: number (position within section)
- `isMandatory`: boolean
- `isAdaptive`: boolean
- `metadata`: Record<string, unknown>

**Behavior**:
- adjustDifficulty(newDifficulty: QuestionDifficulty): void
- updateOrder(newOrder: number): void
- addDependency(dependency: QuestionDependency): void
- removeDependency(dependencyId: string): void
- matchesCandidateLevel(candidateLevel: SkillLevel): boolean
- matchesJobRequirement(requirement: SkillRequirement): boolean

---

### InterviewSection

**Responsibility**: Logical grouping of related questions
**Lifecycle**: Created → Populated → Ordered → Validated
**Invariants**:
- Must have a name
- Must have at least one question
- Must have a defined duration

**Relations**:
- Belongs to: InterviewPlan (1)
- Contains: InterviewQuestion[] (1..*)

**Attributes**:
- `sectionId`: string (unique identifier)
- `planId`: string (reference to InterviewPlan)
- `name`: string (e.g., "Technical Skills", "Behavioral")
- `description`: string
- `objective`: string (section-specific objective)
- `questions`: InterviewQuestion[]
- `timing`: InterviewTiming
- `order`: number (position within plan)
- `isMandatory`: boolean
- `minQuestions`: number
- `maxQuestions`: number

**Behavior**:
- addQuestion(question: InterviewQuestion): void
- removeQuestion(questionId: string): void
- reorderQuestions(questionIds: string[]): void
- calculateDuration(): Duration
- getQuestionCount(): number

---

## Value Objects

### QuestionType

**Responsibility**: Type classification for questions
**Immutability**: Immutable
**Equality**: Value-based

**Values**:
- `TECHNICAL`: Technical skill assessment
- `BEHAVIORAL`: Behavioral/situational questions
- `SITUATIONAL`: Hypothetical scenarios
- `CULTURE_FIT`: Cultural alignment assessment
- `PROBLEM_SOLVING`: Analytical thinking assessment
- `LEADERSHIP`: Leadership capability assessment

**Behavior**:
- isSoftSkill(): boolean
- isHardSkill(): boolean
- requiresCodeExample(): boolean

---

### QuestionDifficulty

**Responsibility**: Difficulty level classification
**Immutability**: Immutable
**Equality**: Value-based

**Values**:
- `BEGINNER`: Entry-level questions
- `INTERMEDIATE`: Mid-level questions
- `ADVANCED`: Senior-level questions
- `EXPERT`: Principal/Architect-level questions

**Behavior**:
- toNumeric(): number (1-4)
- fromNumeric(value: number): QuestionDifficulty
- canBeAttemptedBy(candidateLevel: SkillLevel): boolean

---

### EvaluationCriteria

**Responsibility**: Scoring rubric for question evaluation
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `criteriaId`: string
- `rubric`: RubricItem[]
- `maxScore`: number
- `weight`: number (relative importance)
- `requiredKeyPoints`: string[]
- `acceptableAnswerPatterns`: string[]

**Behavior**:
- calculateScore(answer: string): number
- hasRequiredKeyPoints(answer: string): boolean
- matchesPattern(answer: string): boolean

---

### CompetencyCoverage

**Responsibility**: Mapping of questions to competencies
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `competencyId`: string
- `competencyName`: string
- `coverageLevel`: CoverageLevel (NONE, LOW, MEDIUM, HIGH, COMPLETE)
- `questionIds`: string[]
- `requiredCoverage`: CoverageLevel

**Behavior**:
- isCoverageSufficient(): boolean
- getCoveragePercentage(): number
- addQuestion(questionId: string): CompetencyCoverage

---

### ExpectedAnswer

**Responsibility**: Ideal response structure
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `structure`: AnswerStructure (STAR, SITUATION-ACTION-RESULT, TECHNICAL_EXPLANATION)
- `keyPoints`: string[]
- `examples`: string[]
- `antiPatterns`: string[] (what to avoid)
- `minimumLength`: number (characters)
- `maximumLength`: number (characters)

**Behavior**:
- matchesStructure(answer: string): boolean
- hasKeyPoints(answer: string): boolean
- hasAntiPatterns(answer: string): boolean
- withinLengthBounds(answer: string): boolean

---

### InterviewTiming

**Responsibility**: Time allocation for questions/sections
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `preparationTime`: number (seconds)
- `answerTime`: number (seconds)
- `followUpTime`: number (seconds)
- `totalTime`: number (seconds)

**Behavior**:
- calculateTotal(): number
- isWithinBounds(maxTime: number): boolean

---

### InterviewConstraints

**Responsibility**: Business rules and limitations
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `maxTotalDuration`: number (minutes)
- `maxQuestionsPerSection`: number
- `maxTotalQuestions`: number
- `minSoftSkillQuestions`: number
- `minHardSkillQuestions`: number
- `maxDifficulty`: QuestionDifficulty
- `minDifficulty`: QuestionDifficulty
- `mandatoryCompetencies`: string[]
- `forbiddenTopics`: string[]

**Behavior**:
- validatePlan(plan: InterviewPlan): ValidationResult
- isDurationValid(duration: number): boolean
- isQuestionCountValid(count: number): boolean
- isSkillBalanceValid(softCount: number, hardCount: number): boolean

---

### AdaptiveRules

**Responsibility**: Rules for dynamic adjustment
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `enableDifficultyAdaptation`: boolean
- `enableTopicAdaptation`: boolean
- `enableTimingAdaptation`: boolean
- `adaptationThreshold`: number (score threshold)
- `adaptationStrategy`: AdaptationStrategy (CONSERVATIVE, BALANCED, AGGRESSIVE)

**Behavior**:
- shouldAdapt(currentScore: number): boolean
- getNewDifficulty(currentDifficulty: QuestionDifficulty, score: number): QuestionDifficulty

---

### QuestionDependencies

**Responsibility**: Dependencies between questions
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `requires`: string[] (question IDs that must be answered first)
- `excludes`: string[] (question IDs that cannot be asked together)
- `requiresMinimumScore`: Map<string, number> (question ID → minimum score)

**Behavior**:
- canBeAsked(answeredQuestions: string[], scores: Map<string, number>): boolean
- getBlockingQuestions(): string[]
- hasCircularDependency(questionId: string, allDependencies: Map<string, QuestionDependencies>): boolean

---

### CoverageMatrix

**Responsibility**: Complete competency coverage analysis
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `competencies`: Map<string, CompetencyCoverage>
- `overallCoverage`: number (percentage)
- `softSkillCoverage`: number (percentage)
- `hardSkillCoverage`: number (percentage)
- `gaps`: string[] (uncovered competencies)

**Behavior**:
- isCoverageSufficient(): boolean
- getGaps(): string[]
- getCoverageByCompetency(competencyId: string): CompetencyCoverage
- calculateOverallCoverage(): number

---

### InterviewSummary

**Responsibility**: High-level interview summary
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `totalQuestions`: number
- `totalDuration`: number (minutes)
- `softSkillQuestions`: number
- `hardSkillQuestions`: number
- `averageDifficulty`: number
- `sections`: string[]
- `primaryCompetencies`: string[]
- `estimatedDifficulty`: QuestionDifficulty

**Behavior**:
- isBalanced(): boolean
- isAppropriateForLevel(candidateLevel: SkillLevel): boolean

---

### InterviewObjective

**Responsibility**: Interview goal definition
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `objectiveId`: string
- `type`: ObjectiveType (SCREENING, TECHNICAL, BEHAVIORAL, CULTURAL, FINAL)
- `primaryGoal`: string
- `secondaryGoals`: string[]
- `successCriteria`: string[]

**Behavior**:
- isSuccessMet(criteria: string[]): boolean

---

### InterviewMetadata

**Responsibility**: Additional interview metadata
**Immutability**: Immutable
**Equality**: Value-based

**Attributes**:
- `version`: string
- `generator`: string (AI, TEMPLATE, HYBRID)
- `generatedAt`: Date
- `generatedBy`: string (system or user ID)
- `tags`: string[]
- `customFields`: Record<string, unknown>

---

## Aggregates

### InterviewPlanAggregate

**Aggregate Root**: InterviewPlan
**Entities**: InterviewPlan, InterviewSection, InterviewQuestion
**Value Objects**: All VOs listed above
**Invariants**:
- InterviewPlan maintains consistency of all contained entities
- All business rules enforced at aggregate boundary
- No external access to internal entities except through root

**Consistency Boundaries**:
- Question ordering within sections
- Section ordering within plan
- Total duration calculation
- Competency coverage validation
- Difficulty progression validation

---

## Domain Services

### QuestionGenerationService

**Responsibility**: Generate questions based on competencies and requirements
**Dependencies**: AI Provider, QuestionTemplateRepository
**Interface**: QuestionGeneratorPort
**Behavior**:
- generateQuestions(competencies: Competency[], difficulty: QuestionDifficulty, count: number): InterviewQuestion[]
- generateTechnicalQuestion(skill: Skill, difficulty: QuestionDifficulty): InterviewQuestion
- generateBehavioralQuestion(competency: Competency, difficulty: QuestionDifficulty): InterviewQuestion

---

### CoverageAnalysisService

**Responsibility**: Ensure competency coverage requirements
**Dependencies**: InterviewPlan, CompetencyRepository
**Interface**: CoverageAnalyzerPort
**Behavior**:
- analyzeCoverage(plan: InterviewPlan, requiredCompetencies: string[]): CoverageMatrix
- identifyGaps(plan: InterviewPlan, requirements: Requirement[]): string[]
- suggestAdditionalQuestions(plan: InterviewPlan, gaps: string[]): InterviewQuestion[]

---

### DifficultyAdjustmentService

**Responsibility**: Adapt difficulty to candidate level
**Dependencies**: CandidateGraph, AdaptiveRules
**Behavior**:
- adjustDifficulty(questions: InterviewQuestion[], candidateLevel: SkillLevel): InterviewQuestion[]
- calculateOptimalDifficulty(candidateLevel: SkillLevel, jobLevel: SkillLevel): QuestionDifficulty
- validateProgression(questions: InterviewQuestion[]): boolean

---

### QuestionOrderingService

**Responsibility**: Order questions logically
**Dependencies**: QuestionDependencies, InterviewConstraints
**Behavior**:
- orderQuestions(questions: InterviewQuestion[], strategy: OrderingStrategy): InterviewQuestion[]
- validateDependencies(questions: InterviewQuestion[]): ValidationResult
- resolveConflicts(questions: InterviewQuestion[]): InterviewQuestion[]

---

### TimingCalculationService

**Responsibility**: Calculate optimal timing
**Dependencies**: InterviewConstraints, QuestionType
**Behavior**:
- calculateQuestionTiming(question: InterviewQuestion): InterviewTiming
- calculateSectionTiming(section: InterviewSection): InterviewTiming
- calculateTotalTiming(plan: InterviewPlan): InterviewTiming
- validateTiming(plan: InterviewPlan, constraints: InterviewConstraints): ValidationResult

---

## Policies

### QuestionCountPolicy

**Responsibility**: Enforce question count limits
**Configuration**: minQuestions, maxQuestions, minPerSection, maxPerSection
**Behavior**:
- validate(count: number): boolean
- getViolationMessage(count: number): string

---

### DurationPolicy

**Responsibility**: Enforce time constraints
**Configuration**: maxDuration, minDuration, maxPerQuestion
**Behavior**:
- validate(duration: number): boolean
- getViolationMessage(duration: number): string

---

### DifficultyPolicy

**Responsibility**: Enforce difficulty progression
**Configuration**: minDifficulty, maxDifficulty, allowJumps
**Behavior**:
- validateProgression(difficulties: QuestionDifficulty[]): boolean
- validateRange(difficulty: QuestionDifficulty): boolean

---

### CoveragePolicy

**Responsibility**: Enforce competency coverage
**Configuration**: requiredCompetencies, minCoverageLevel
**Behavior**:
- validate(coverage: CoverageMatrix): boolean
- getMissingCompetencies(coverage: CoverageMatrix): string[]

---

## Repository Interfaces

### InterviewPlanRepository

**Responsibility**: Persist interview plans
**Methods**:
- save(plan: InterviewPlan): Promise<void>
- findById(planId: string): Promise<InterviewPlan | null>
- findByCandidate(candidateId: string): Promise<InterviewPlan[]>
- findByJobOffer(jobOfferId: string): Promise<InterviewPlan[]>
- delete(planId: string): Promise<void>

### QuestionTemplateRepository

**Responsibility**: Access question templates
**Methods**:
- findByType(type: QuestionType): Promise<QuestionTemplate[]>
- findByCompetency(competencyId: string): Promise<QuestionTemplate[]>
- findByDifficulty(difficulty: QuestionDifficulty): Promise<QuestionTemplate[]>

---

## Port Interfaces

### InterviewPlanGeneratorPort

**Responsibility**: Generate interview plans
**Methods**:
- generate(request: InterviewPlanRequest): Promise<InterviewPlan>
- validate(plan: InterviewPlan): ValidationResult

### QuestionProviderPort

**Responsibility**: Provide questions
**Methods**:
- provideQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]>
- provideTemplates(criteria: TemplateCriteria): Promise<QuestionTemplate[]>

### CoverageAnalyzerPort

**Responsibility**: Analyze competency coverage
**Methods**:
- analyze(plan: InterviewPlan, requirements: Requirement[]): CoverageMatrix
- suggestImprovements(coverage: CoverageMatrix): Suggestion[]

---

## Factory Interfaces

### InterviewPlanFactory

**Responsibility**: Create InterviewPlan aggregates
**Methods**:
- create(request: InterviewPlanRequest): InterviewPlan
- createSection(sectionData: SectionData): InterviewSection
- createQuestion(questionData: QuestionData): InterviewQuestion

### InterviewQuestionFactory

**Responsibility**: Create InterviewQuestion entities
**Methods**:
- createFromTemplate(template: QuestionTemplate, context: QuestionContext): InterviewQuestion
- createFromAI(aiResponse: AIQuestionResponse, context: QuestionContext): InterviewQuestion
