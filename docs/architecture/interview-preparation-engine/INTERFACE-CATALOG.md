# Interview Preparation Engine - Interface Catalog

## Overview
This document catalogs all interfaces in the Interview Preparation Engine, providing complete contract definitions.

---

## Port Interfaces

### InterviewPlanGeneratorPort

**Purpose**: Generate interview plans from candidate, job, and matching data
**Location**: `core/interview-preparation/interfaces/InterviewPlanGeneratorPort.ts`

```typescript
export interface InterviewPlanGeneratorPort {
  /**
   * Generate an interview plan from request data
   * @param request - Plan generation request
   * @returns Generated interview plan
   * @throws InterviewPlanningError if generation fails
   */
  generate(request: InterviewPlanRequest): Promise<InterviewPlan>;

  /**
   * Validate an interview plan
   * @param plan - Plan to validate
   * @returns Validation result
   */
  validate(plan: InterviewPlan): ValidationResult;

  /**
   * Regenerate an interview plan with adjustments
   * @param planId - Plan ID to regenerate
   * @param adjustments - Adjustments to apply
   * @returns Regenerated interview plan
   * @throws InterviewPlanningError if regeneration fails
   */
  regenerate(planId: string, adjustments: PlanAdjustments): Promise<InterviewPlan>;
}
```

**Input Types**:
```typescript
interface InterviewPlanRequest {
  candidateId: string;
  jobOfferId: string;
  matchingId: string;
  constraints?: InterviewConstraints;
  customRequirements?: string[];
  requestedBy: string;
}

interface PlanAdjustments {
  addQuestions?: QuestionData[];
  removeQuestions?: string[];
  reorderQuestions?: string[];
  adjustDifficulty?: Map<string, QuestionDifficulty>;
}
```

**Output Types**:
```typescript
interface InterviewPlan {
  planId: string;
  candidateId: string;
  jobOfferId: string;
  matchingId: string;
  objective: InterviewObjective;
  sections: InterviewSection[];
  constraints: InterviewConstraints;
  adaptiveRules: AdaptiveRules;
  summary: InterviewSummary;
  metadata: InterviewMetadata;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}
```

**Exceptions**:
- `InterviewPlanningError`: Generation or validation failure

---

### QuestionProviderPort

**Purpose**: Provide questions based on criteria
**Location**: `core/interview-preparation/interfaces/QuestionProviderPort.ts`

```typescript
export interface QuestionProviderPort {
  /**
   * Provide questions based on criteria
   * @param criteria - Question criteria
   * @returns Array of interview questions
   * @throws QuestionGenerationError if generation fails
   */
  provideQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]>;

  /**
   * Provide question templates based on criteria
   * @param criteria - Template criteria
   * @returns Array of question templates
   */
  provideTemplates(criteria: TemplateCriteria): Promise<QuestionTemplate[]>;

  /**
   * Search question templates by query
   * @param query - Search query
   * @returns Array of matching question templates
   */
  searchTemplates(query: string): Promise<QuestionTemplate[]>;
}
```

**Input Types**:
```typescript
interface QuestionCriteria {
  competencyIds: string[];
  difficulty: QuestionDifficulty;
  type: QuestionType;
  count: number;
  context: {
    candidateLevel: SkillLevel;
    jobRequirements: Requirement[];
    previousQuestions: InterviewQuestion[];
  };
}

interface TemplateCriteria {
  type?: QuestionType;
  competencyId?: string;
  difficulty?: QuestionDifficulty;
}
```

**Output Types**:
```typescript
interface InterviewQuestion {
  questionId: string;
  sectionId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  text: string;
  expectedAnswer: ExpectedAnswer;
  evaluationCriteria: EvaluationCriteria;
  competencyCoverage: CompetencyCoverage;
  timing: InterviewTiming;
  dependencies: QuestionDependencies;
  order: number;
  isMandatory: boolean;
  isAdaptive: boolean;
  metadata: Record<string, unknown>;
}

interface QuestionTemplate {
  templateId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  competencyId: string;
  text: string;
  evaluationCriteria: EvaluationCriteria;
  expectedAnswer: ExpectedAnswer;
}
```

**Exceptions**:
- `QuestionGenerationError`: Question generation failure

---

### CoverageAnalyzerPort

**Purpose**: Analyze competency coverage
**Location**: `core/interview-preparation/interfaces/CoverageAnalyzerPort.ts`

```typescript
export interface CoverageAnalyzerPort {
  /**
   * Analyze competency coverage for a plan
   * @param plan - Interview plan to analyze
   * @param requirements - Job requirements
   * @returns Coverage matrix
   */
  analyze(plan: InterviewPlan, requirements: Requirement[]): CoverageMatrix;

  /**
   * Identify competency gaps in a plan
   * @param plan - Interview plan to analyze
   * @param requirements - Job requirements
   * @returns Array of missing competencies
   */
  identifyGaps(plan: InterviewPlan, requirements: Requirement[]): string[];

  /**
   * Suggest improvements for coverage
   * @param coverage - Current coverage matrix
   * @returns Array of suggestions
   */
  suggestImprovements(coverage: CoverageMatrix): Suggestion[];
}
```

**Input Types**:
```typescript
interface Requirement {
  requirementId: string;
  competencyId: string;
  requiredLevel: SkillLevel;
  isMandatory: boolean;
}
```

**Output Types**:
```typescript
interface CoverageMatrix {
  competencies: Map<string, CompetencyCoverage>;
  overallCoverage: number;
  softSkillCoverage: number;
  hardSkillCoverage: number;
  gaps: string[];
}

interface Suggestion {
  type: "ADD_QUESTION" | "ADJUST_DIFFICULTY" | "REORDER";
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: SuggestionAction;
}
```

**Exceptions**: None (pure function)

---

### InterviewPlanRepository

**Purpose**: Persist and retrieve interview plans
**Location**: `core/interview-preparation/interfaces/InterviewPlanRepository.ts`

```typescript
export interface InterviewPlanRepository {
  /**
   * Save an interview plan
   * @param plan - Plan to save
   * @throws PersistenceError if save fails
   */
  save(plan: InterviewPlan): Promise<void>;

  /**
   * Find an interview plan by ID
   * @param planId - Plan ID
   * @returns Interview plan or null if not found
   */
  findById(planId: string): Promise<InterviewPlan | null>;

  /**
   * Find interview plans by candidate ID
   * @param candidateId - Candidate ID
   * @returns Array of interview plans
   */
  findByCandidate(candidateId: string): Promise<InterviewPlan[]>;

  /**
   * Find interview plans by job offer ID
   * @param jobOfferId - Job offer ID
   * @returns Array of interview plans
   */
  findByJobOffer(jobOfferId: string): Promise<InterviewPlan[]>;

  /**
   * Delete an interview plan
   * @param planId - Plan ID to delete
   * @throws PersistenceError if delete fails
   */
  delete(planId: string): Promise<void>;
}
```

**Exceptions**:
- `PersistenceError`: Database operation failure

---

## Service Interfaces

### InterviewPlanningService

**Purpose**: Orchestrate interview plan generation workflow
**Location**: `core/interview-preparation/services/InterviewPlanningService.ts`

```typescript
export interface InterviewPlanningService {
  /**
   * Generate an interview plan
   * @param request - Plan generation request
   * @returns Generated interview plan
   */
  generatePlan(request: InterviewPlanRequest): Promise<InterviewPlan>;

  /**
   * Validate an interview plan
   * @param planId - Plan ID to validate
   * @returns Validation result
   */
  validatePlan(planId: string): Promise<ValidationResult>;

  /**
   * Approve an interview plan
   * @param planId - Plan ID to approve
   */
  approvePlan(planId: string): Promise<void>;

  /**
   * Reject an interview plan
   * @param planId - Plan ID to reject
   * @param reason - Rejection reason
   */
  rejectPlan(planId: string, reason: string): Promise<void>;

  /**
   * Archive an interview plan
   * @param planId - Plan ID to archive
   */
  archivePlan(planId: string): Promise<void>;
}
```

---

### QuestionGenerationService

**Purpose**: Orchestrate question generation
**Location**: `core/interview-preparation/services/QuestionGenerationService.ts`

```typescript
export interface QuestionGenerationService {
  /**
   * Generate questions based on criteria
   * @param criteria - Question criteria
   * @returns Array of interview questions
   */
  generateQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]>;

  /**
   * Generate a technical question
   * @param skill - Skill to target
   * @param difficulty - Question difficulty
   * @returns Interview question
   */
  generateTechnicalQuestion(skill: Skill, difficulty: QuestionDifficulty): Promise<InterviewQuestion>;

  /**
   * Generate a behavioral question
   * @param competency - Competency to target
   * @param difficulty - Question difficulty
   * @returns Interview question
   */
  generateBehavioralQuestion(competency: Competency, difficulty: QuestionDifficulty): Promise<InterviewQuestion>;

  /**
   * Regenerate a question with adjustments
   * @param questionId - Question ID to regenerate
   * @param adjustments - Adjustments to apply
   * @returns Regenerated interview question
   */
  regenerateQuestion(questionId: string, adjustments: QuestionAdjustments): Promise<InterviewQuestion>;
}
```

---

### CoverageAnalysisService

**Purpose**: Orchestrate coverage analysis
**Location**: `core/interview-preparation/services/CoverageAnalysisService.ts`

```typescript
export interface CoverageAnalysisService {
  /**
   * Analyze competency coverage
   * @param plan - Interview plan
   * @param requirements - Job requirements
   * @returns Coverage matrix
   */
  analyzeCoverage(plan: InterviewPlan, requirements: Requirement[]): Promise<CoverageMatrix>;

  /**
   * Identify competency gaps
   * @param plan - Interview plan
   * @param requirements - Job requirements
   * @returns Array of missing competencies
   */
  identifyGaps(plan: InterviewPlan, requirements: Requirement[]): Promise<string[]>;

  /**
   * Suggest additional questions for gaps
   * @param plan - Interview plan
   * @param gaps - Array of gaps
   * @returns Array of additional questions
   */
  suggestAdditionalQuestions(plan: InterviewPlan, gaps: string[]): Promise<InterviewQuestion[]>;
}
```

---

### DifficultyAdjustmentService

**Purpose**: Orchestrate difficulty adjustment
**Location**: `core/interview-preparation/services/DifficultyAdjustmentService.ts`

```typescript
export interface DifficultyAdjustmentService {
  /**
   * Adjust question difficulty based on candidate level
   * @param questions - Array of questions
   * @param candidateLevel - Candidate skill level
   * @returns Array of adjusted questions
   */
  adjustDifficulty(questions: InterviewQuestion[], candidateLevel: SkillLevel): Promise<InterviewQuestion[]>;

  /**
   * Calculate optimal difficulty
   * @param candidateLevel - Candidate skill level
   * @param jobLevel - Job required level
   * @returns Optimal difficulty level
   */
  calculateOptimalDifficulty(candidateLevel: SkillLevel, jobLevel: SkillLevel): QuestionDifficulty;

  /**
   * Validate difficulty progression
   * @param questions - Array of questions
   * @returns Validation result
   */
  validateProgression(questions: InterviewQuestion[]): ValidationResult;
}
```

---

### QuestionOrderingService

**Purpose**: Orchestrate question ordering
**Location**: `core/interview-preparation/services/QuestionOrderingService.ts`

```typescript
export interface QuestionOrderingService {
  /**
   * Order questions based on strategy
   * @param questions - Array of questions
   * @param strategy - Ordering strategy
   * @returns Array of ordered questions
   */
  orderQuestions(questions: InterviewQuestion[], strategy: OrderingStrategy): Promise<InterviewQuestion[]>;

  /**
   * Validate question dependencies
   * @param questions - Array of questions
   * @returns Validation result
   */
  validateDependencies(questions: InterviewQuestion[]): ValidationResult;

  /**
   * Resolve ordering conflicts
   * @param questions - Array of questions
   * @returns Array of resolved questions
   */
  resolveConflicts(questions: InterviewQuestion[]): Promise<InterviewQuestion[]>;
}
```

---

### TimingCalculationService

**Purpose**: Orchestrate timing calculation
**Location**: `core/interview-preparation/services/TimingCalculationService.ts`

```typescript
export interface TimingCalculationService {
  /**
   * Calculate timing for a question
   * @param question - Interview question
   * @returns Interview timing
   */
  calculateQuestionTiming(question: InterviewQuestion): InterviewTiming;

  /**
   * Calculate timing for a section
   * @param section - Interview section
   * @returns Interview timing
   */
  calculateSectionTiming(section: InterviewSection): InterviewTiming;

  /**
   * Calculate total timing for a plan
   * @param plan - Interview plan
   * @returns Interview timing
   */
  calculateTotalTiming(plan: InterviewPlan): InterviewTiming;

  /**
   * Validate timing against constraints
   * @param plan - Interview plan
   * @param constraints - Interview constraints
   * @returns Validation result
   */
  validateTiming(plan: InterviewPlan, constraints: InterviewConstraints): ValidationResult;
}
```

---

### InterviewValidationService

**Purpose**: Orchestrate plan validation
**Location**: `core/interview-preparation/services/InterviewValidationService.ts`

```typescript
export interface InterviewValidationService {
  /**
   * Validate an interview plan
   * @param plan - Interview plan
   * @returns Validation result
   */
  validatePlan(plan: InterviewPlan): Promise<ValidationResult>;

  /**
   * Validate an interview question
   * @param question - Interview question
   * @returns Validation result
   */
  validateQuestion(question: InterviewQuestion): ValidationResult;

  /**
   * Validate an interview section
   * @param section - Interview section
   * @returns Validation result
   */
  validateSection(section: InterviewSection): ValidationResult;

  /**
   * Validate competency coverage
   * @param plan - Interview plan
   * @param requirements - Job requirements
   * @returns Validation result
   */
  validateCoverage(plan: InterviewPlan, requirements: Requirement[]): ValidationResult;
}
```

---

## Policy Interfaces

### QuestionCountPolicy

**Purpose**: Enforce question count rules
**Location**: `core/interview-preparation/policies/QuestionCountPolicy.ts`

```typescript
export interface QuestionCountPolicy {
  /**
   * Validate total question count
   * @param count - Question count
   * @returns True if valid
   */
  validate(count: number): boolean;

  /**
   * Validate section question count
   * @param count - Section question count
   * @returns True if valid
   */
  validateSection(count: number): boolean;

  /**
   * Get violation message
   * @param count - Question count
   * @returns Violation message
   */
  getViolationMessage(count: number): string;
}
```

---

### DurationPolicy

**Purpose**: Enforce duration rules
**Location**: `core/interview-preparation/policies/DurationPolicy.ts`

```typescript
export interface DurationPolicy {
  /**
   * Validate total duration
   * @param duration - Duration in minutes
   * @returns True if valid
   */
  validate(duration: number): boolean;

  /**
   * Validate question duration
   * @param duration - Question duration in minutes
   * @returns True if valid
   */
  validateQuestion(duration: number): boolean;

  /**
   * Get violation message
   * @param duration - Duration in minutes
   * @returns Violation message
   */
  getViolationMessage(duration: number): string;
}
```

---

### DifficultyPolicy

**Purpose**: Enforce difficulty rules
**Location**: `core/interview-preparation/policies/DifficultyPolicy.ts`

```typescript
export interface DifficultyPolicy {
  /**
   * Validate difficulty progression
   * @param difficulties - Array of difficulties
   * @returns True if valid
   */
  validateProgression(difficulties: QuestionDifficulty[]): boolean;

  /**
   * Validate difficulty range
   * @param difficulty - Difficulty level
   * @returns True if valid
   */
  validateRange(difficulty: QuestionDifficulty): boolean;

  /**
   * Get violation message
   * @param difficulty - Difficulty level
   * @returns Violation message
   */
  getViolationMessage(difficulty: QuestionDifficulty): string;
}
```

---

### CoveragePolicy

**Purpose**: Enforce coverage rules
**Location**: `core/interview-preparation/policies/CoveragePolicy.ts`

```typescript
export interface CoveragePolicy {
  /**
   * Validate coverage matrix
   * @param coverage - Coverage matrix
   * @returns True if valid
   */
  validate(coverage: CoverageMatrix): boolean;

  /**
   * Get missing competencies
   * @param coverage - Coverage matrix
   * @returns Array of missing competencies
   */
  getMissingCompetencies(coverage: CoverageMatrix): string[];

  /**
   * Get violation message
   * @param coverage - Coverage matrix
   * @returns Violation message
   */
  getViolationMessage(coverage: CoverageMatrix): string;
}
```

---

## Builder Interfaces

### InterviewPlanBuilder

**Purpose**: Build InterviewPlan aggregates
**Location**: `core/interview-preparation/builders/InterviewPlanBuilder.ts`

```typescript
export interface InterviewPlanBuilder {
  /**
   * Build an interview plan
   * @param request - Plan request
   * @returns Interview plan
   */
  buildPlan(request: InterviewPlanRequest): InterviewPlan;

  /**
   * Add a section to the plan
   * @param builder - Section builder
   */
  addSection(builder: InterviewSectionBuilder): void;

  /**
   * Add a question to the plan
   * @param builder - Question builder
   */
  addQuestion(builder: InterviewQuestionBuilder): void;

  /**
   * Set constraints for the plan
   * @param constraints - Interview constraints
   */
  withConstraints(constraints: InterviewConstraints): void;

  /**
   * Set adaptive rules for the plan
   * @param rules - Adaptive rules
   */
  withAdaptiveRules(rules: AdaptiveRules): void;
}
```

---

### InterviewQuestionBuilder

**Purpose**: Build InterviewQuestion entities
**Location**: `core/interview-preparation/builders/InterviewQuestionBuilder.ts`

```typescript
export interface InterviewQuestionBuilder {
  /**
   * Build an interview question
   * @param data - Question data
   * @returns Interview question
   */
  buildQuestion(data: QuestionData): InterviewQuestion;

  /**
   * Set question type
   * @param type - Question type
   */
  withType(type: QuestionType): void;

  /**
   * Set question difficulty
   * @param difficulty - Question difficulty
   */
  withDifficulty(difficulty: QuestionDifficulty): void;

  /**
   * Set competencies
   * @param competencies - Array of competency IDs
   */
  withCompetencies(competencies: string[]): void;

  /**
   * Set evaluation criteria
   * @param criteria - Evaluation criteria
   */
  withEvaluationCriteria(criteria: EvaluationCriteria): void;

  /**
   * Set timing
   * @param timing - Interview timing
   */
  withTiming(timing: InterviewTiming): void;
}
```

---

### InterviewSectionBuilder

**Purpose**: Build InterviewSection entities
**Location**: `core/interview-preparation/builders/InterviewSectionBuilder.ts`

```typescript
export interface InterviewSectionBuilder {
  /**
   * Build an interview section
   * @param data - Section data
   * @returns Interview section
   */
  buildSection(data: SectionData): InterviewSection;

  /**
   * Set section name
   * @param name - Section name
   */
  withName(name: string): void;

  /**
   * Set section objective
   * @param objective - Section objective
   */
  withObjective(objective: string): void;

  /**
   * Add a question to the section
   * @param builder - Question builder
   */
  addQuestion(builder: InterviewQuestionBuilder): void;

  /**
   * Set timing
   * @param timing - Interview timing
   */
  withTiming(timing: InterviewTiming): void;
}
```

---

## Factory Interfaces

### InterviewPlanFactory

**Purpose**: Create InterviewPlan aggregates
**Location**: `core/interview-preparation/factories/InterviewPlanFactory.ts`

```typescript
export interface InterviewPlanFactory {
  /**
   * Create an interview plan
   * @param request - Plan request
   * @returns Interview plan
   */
  create(request: InterviewPlanRequest): InterviewPlan;

  /**
   * Create an interview section
   * @param data - Section data
   * @returns Interview section
   */
  createSection(data: SectionData): InterviewSection;

  /**
   * Create an empty interview plan
   * @returns Empty interview plan
   */
  createEmpty(): InterviewPlan;
}
```

---

### InterviewQuestionFactory

**Purpose**: Create InterviewQuestion entities
**Location**: `core/interview-preparation/factories/InterviewQuestionFactory.ts`

```typescript
export interface InterviewQuestionFactory {
  /**
   * Create question from template
   * @param template - Question template
   * @param context - Question context
   * @returns Interview question
   */
  createFromTemplate(template: QuestionTemplate, context: QuestionContext): InterviewQuestion;

  /**
   * Create question from AI response
   * @param response - AI question response
   * @param context - Question context
   * @returns Interview question
   */
  createFromAI(response: AIQuestionResponse, context: QuestionContext): InterviewQuestion;

  /**
   * Create an empty interview question
   * @returns Empty interview question
   */
  createEmpty(): InterviewQuestion;
}
```

---

## Validator Interfaces

### InterviewPlanValidator

**Purpose**: Validate InterviewPlan aggregates
**Location**: `core/interview-preparation/validators/InterviewPlanValidator.ts`

```typescript
export interface InterviewPlanValidator {
  /**
   * Validate an interview plan
   * @param plan - Interview plan
   * @returns Validation result
   */
  validate(plan: InterviewPlan): ValidationResult;

  /**
   * Validate plan structure
   * @param plan - Interview plan
   * @returns Validation result
   */
  validateStructure(plan: InterviewPlan): ValidationResult;

  /**
   * Validate plan invariants
   * @param plan - Interview plan
   * @returns Validation result
   */
  validateInvariants(plan: InterviewPlan): ValidationResult;
}
```

---

### InterviewQuestionValidator

**Purpose**: Validate InterviewQuestion entities
**Location**: `core/interview-preparation/validators/InterviewQuestionValidator.ts`

```typescript
export interface InterviewQuestionValidator {
  /**
   * Validate an interview question
   * @param question - Interview question
   * @returns Validation result
   */
  validate(question: InterviewQuestion): ValidationResult;

  /**
   * Validate question structure
   * @param question - Interview question
   * @returns Validation result
   */
  validateStructure(question: InterviewQuestion): ValidationResult;

  /**
   * Validate question invariants
   * @param question - Interview question
   * @returns Validation result
   */
  validateInvariants(question: InterviewQuestion): ValidationResult;
}
```

---

## Event Handler Interfaces

### InterviewPlanningEventHandler

**Purpose**: Handle interview planning events
**Location**: `core/interview-preparation/events/InterviewPlanningEventHandler.ts`

```typescript
export interface InterviewPlanningEventHandler {
  /**
   * Start handling events
   */
  start(): void;

  /**
   * Stop handling events
   */
  stop(): void;

  /**
   * Check if handler is active
   * @returns True if active
   */
  isActive(): boolean;

  /**
   * Handle interview plan requested event
   * @param event - Interview plan requested event
   */
  handleInterviewPlanRequested(event: InterviewPlanRequested): void;

  /**
   * Handle interview plan generated event
   * @param event - Interview plan generated event
   */
  handleInterviewPlanGenerated(event: InterviewPlanGenerated): void;

  /**
   * Handle plan validated event
   * @param event - Plan validated event
   */
  handlePlanValidated(event: PlanValidated): void;
}
```

---

## Integration Interfaces

### InterviewPlanningIntegration

**Purpose**: Thin wrapper for event handler
**Location**: `core/interview-preparation/integration/InterviewPlanningIntegration.ts`

```typescript
export interface InterviewPlanningIntegration {
  /**
   * Start integration
   */
  start(): void;

  /**
   * Stop integration
   */
  stop(): void;

  /**
   * Check if integration is active
   * @returns True if active
   */
  isActive(): boolean;
}
```

---

## Interface Versioning

### Versioning Strategy
- Each interface has a version number
- Version follows semantic versioning (MAJOR.MINOR.PATCH)
- MAJOR: Breaking changes
- MINOR: Non-breaking additions
- PATCH: Bug fixes

### Current Versions
- InterviewPlanGeneratorPort: v1.0.0
- QuestionProviderPort: v1.0.0
- CoverageAnalyzerPort: v1.0.0
- InterviewPlanRepository: v1.0.0
- All service interfaces: v1.0.0
- All policy interfaces: v1.0.0
- All builder interfaces: v1.0.0
- All factory interfaces: v1.0.0
- All validator interfaces: v1.0.0
- All event handler interfaces: v1.0.0
- All integration interfaces: v1.0.0

### Backward Compatibility
- All interfaces maintain backward compatibility
- Deprecated methods marked with @deprecated
- Grace period for deprecation: 2 versions
- Clear communication of breaking changes
