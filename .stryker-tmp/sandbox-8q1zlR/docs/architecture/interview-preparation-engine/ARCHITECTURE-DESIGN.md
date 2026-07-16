# Interview Preparation Engine - Architecture Design

## Overview
This document defines the complete architecture for the Interview Preparation Engine, following the exact pattern established by FEATURE_B5 (Runtime Persistence).

---

## Architecture Pattern

### Component Structure (FEATURE_B5 Pattern)
```
Interface
  ↓
Service
  ↓
Builder
  ↓
Mapper
  ↓
Repository
  ↓
Provider
  ↓
Events
  ↓
Policies
  ↓
Composition Root
```

### Layer Separation
```
CandidateGraph (Domain Input)
  ↓
JobOfferGraph (Domain Input)
  ↓
MatchingGraph (Domain Input)
  ↓
InterviewPlanningEventHandler (Application)
  ↓
InterviewPlanningService (Application)
  ↓
InterviewPlanGeneratorPort (Interface)
  ↓
InterviewPlanGeneratorImpl (Infrastructure)
  ↓
AI Provider (External)
  ↓
InterviewPlan (Domain Output)
```

---

## Folder Structure

```
core/interview-preparation/
├── builders/              # Domain object construction
│   ├── InterviewPlanBuilder.ts
│   ├── InterviewQuestionBuilder.ts
│   └── InterviewSectionBuilder.ts
├── events/                # Event handling
│   └── InterviewPlanningEventHandler.ts
├── integration/           # Integration coordination
│   └── InterviewPlanningIntegration.ts
├── interfaces/           # Feature interfaces
│   ├── InterviewPlanGeneratorPort.ts
│   ├── QuestionProviderPort.ts
│   ├── CoverageAnalyzerPort.ts
│   └── InterviewPlanRepository.ts
├── mappers/              # Data transformation
│   ├── InterviewPlanMapper.ts
│   ├── InterviewQuestionMapper.ts
│   └── InterviewSectionMapper.ts
├── policies/             # Cross-cutting policies
│   ├── QuestionCountPolicy.ts
│   ├── DurationPolicy.ts
│   ├── DifficultyPolicy.ts
│   └── CoveragePolicy.ts
├── repositories/         # Data access
│   ├── InterviewPlanRepositoryImpl.ts
│   └── QuestionTemplateRepositoryImpl.ts
├── services/             # Application services
│   ├── InterviewPlanningService.ts
│   ├── QuestionGenerationService.ts
│   ├── CoverageAnalysisService.ts
│   ├── DifficultyAdjustmentService.ts
│   ├── QuestionOrderingService.ts
│   ├── TimingCalculationService.ts
│   └── InterviewValidationService.ts
├── validators/           # Domain validation
│   ├── InterviewPlanValidator.ts
│   ├── InterviewQuestionValidator.ts
│   └── InterviewSectionValidator.ts
├── factories/            # Domain factories
│   ├── InterviewPlanFactory.ts
│   ├── InterviewQuestionFactory.ts
│   └── InterviewSectionFactory.ts
├── providers/            # External providers
│   ├── AIQuestionProvider.ts
│   ├── TemplateQuestionProvider.ts
│   └── DatabaseQuestionProvider.ts
├── errors/               # Domain errors
│   ├── InterviewPlanningError.ts
│   ├── QuestionGenerationError.ts
│   └── ValidationError.ts
├── __tests__/            # Test suite
│   ├── InterviewPlanningService.test.ts
│   ├── QuestionGenerationService.test.ts
│   ├── CoverageAnalysisService.test.ts
│   └── InterviewPlanRepository.test.ts
└── types.ts              # Shared types
```

---

## Interfaces

### InterviewPlanGeneratorPort

**Responsibility**: Interface for interview plan generation
**Location**: `core/interview-preparation/interfaces/InterviewPlanGeneratorPort.ts`

```typescript
export interface InterviewPlanGeneratorPort {
  generate(request: InterviewPlanRequest): Promise<InterviewPlan>;
  validate(plan: InterviewPlan): ValidationResult;
  regenerate(planId: string, adjustments: PlanAdjustments): Promise<InterviewPlan>;
}
```

---

### QuestionProviderPort

**Responsibility**: Interface for question sourcing
**Location**: `core/interview-preparation/interfaces/QuestionProviderPort.ts`

```typescript
export interface QuestionProviderPort {
  provideQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]>;
  provideTemplates(criteria: TemplateCriteria): Promise<QuestionTemplate[]>;
  searchTemplates(query: string): Promise<QuestionTemplate[]>;
}
```

---

### CoverageAnalyzerPort

**Responsibility**: Interface for coverage analysis
**Location**: `core/interview-preparation/interfaces/CoverageAnalyzerPort.ts`

```typescript
export interface CoverageAnalyzerPort {
  analyze(plan: InterviewPlan, requirements: Requirement[]): CoverageMatrix;
  identifyGaps(plan: InterviewPlan, requirements: Requirement[]): string[];
  suggestImprovements(coverage: CoverageMatrix): Suggestion[];
}
```

---

### InterviewPlanRepository

**Responsibility**: Interface for plan persistence
**Location**: `core/interview-preparation/interfaces/InterviewPlanRepository.ts`

```typescript
export interface InterviewPlanRepository {
  save(plan: InterviewPlan): Promise<void>;
  findById(planId: string): Promise<InterviewPlan | null>;
  findByCandidate(candidateId: string): Promise<InterviewPlan[]>;
  findByJobOffer(jobOfferId: string): Promise<InterviewPlan[]>;
  delete(planId: string): Promise<void>;
}
```

---

## Builders

### InterviewPlanBuilder

**Responsibility**: Build InterviewPlan aggregates
**Location**: `core/interview-preparation/builders/InterviewPlanBuilder.ts`

**SRP**: ✅ Single responsibility (plan construction)
**Dependencies**: InterviewSectionBuilder, InterviewQuestionBuilder
**Forbidden**: Validation, persistence, business logic

```typescript
export interface InterviewPlanBuilder {
  buildPlan(request: InterviewPlanRequest): InterviewPlan;
  addSection(builder: InterviewSectionBuilder): void;
  addQuestion(builder: InterviewQuestionBuilder): void;
  withConstraints(constraints: InterviewConstraints): void;
  withAdaptiveRules(rules: AdaptiveRules): void;
}
```

---

### InterviewQuestionBuilder

**Responsibility**: Build InterviewQuestion entities
**Location**: `core/interview-preparation/builders/InterviewQuestionBuilder.ts`

**SRP**: ✅ Single responsibility (question construction)
**Dependencies**: None
**Forbidden**: Validation, persistence, business logic

```typescript
export interface InterviewQuestionBuilder {
  buildQuestion(data: QuestionData): InterviewQuestion;
  withType(type: QuestionType): void;
  withDifficulty(difficulty: QuestionDifficulty): void;
  withCompetencies(competencies: string[]): void;
  withEvaluationCriteria(criteria: EvaluationCriteria): void;
  withTiming(timing: InterviewTiming): void;
}
```

---

### InterviewSectionBuilder

**Responsibility**: Build InterviewSection entities
**Location**: `core/interview-preparation/builders/InterviewSectionBuilder.ts`

**SRP**: ✅ Single responsibility (section construction)
**Dependencies**: InterviewQuestionBuilder
**Forbidden**: Validation, persistence, business logic

```typescript
export interface InterviewSectionBuilder {
  buildSection(data: SectionData): InterviewSection;
  withName(name: string): void;
  withObjective(objective: string): void;
  addQuestion(builder: InterviewQuestionBuilder): void;
  withTiming(timing: InterviewTiming): void;
}
```

---

## Services

### InterviewPlanningService

**Responsibility**: Orchestrate interview plan generation
**Location**: `core/interview-preparation/services/InterviewPlanningService.ts`

**SRP**: ✅ Single responsibility (planning orchestration)
**Dependencies**: InterviewPlanGeneratorPort, InterviewPlanRepository, EventBus, DiagnosticCollector
**Forbidden**: Business logic, generation logic, validation logic

```typescript
export interface InterviewPlanningService {
  generatePlan(request: InterviewPlanRequest): Promise<InterviewPlan>;
  validatePlan(planId: string): Promise<ValidationResult>;
  approvePlan(planId: string): Promise<void>;
  rejectPlan(planId: string, reason: string): Promise<void>;
  archivePlan(planId: string): Promise<void>;
}
```

---

### QuestionGenerationService

**Responsibility**: Generate questions based on criteria
**Location**: `core/interview-preparation/services/QuestionGenerationService.ts`

**SRP**: ✅ Single responsibility (question generation orchestration)
**Dependencies**: QuestionProviderPort, InterviewQuestionFactory, EventBus
**Forbidden**: Business logic, AI logic, validation logic

```typescript
export interface QuestionGenerationService {
  generateQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]>;
  generateTechnicalQuestion(skill: Skill, difficulty: QuestionDifficulty): Promise<InterviewQuestion>;
  generateBehavioralQuestion(competency: Competency, difficulty: QuestionDifficulty): Promise<InterviewQuestion>;
  regenerateQuestion(questionId: string, adjustments: QuestionAdjustments): Promise<InterviewQuestion>;
}
```

---

### CoverageAnalysisService

**Responsibility**: Analyze competency coverage
**Location**: `core/interview-preparation/services/CoverageAnalysisService.ts`

**SRP**: ✅ Single responsibility (coverage analysis orchestration)
**Dependencies**: CoverageAnalyzerPort, EventBus
**Forbidden**: Business logic, calculation logic

```typescript
export interface CoverageAnalysisService {
  analyzeCoverage(plan: InterviewPlan, requirements: Requirement[]): Promise<CoverageMatrix>;
  identifyGaps(plan: InterviewPlan, requirements: Requirement[]): Promise<string[]>;
  suggestAdditionalQuestions(plan: InterviewPlan, gaps: string[]): Promise<InterviewQuestion[]>;
}
```

---

### DifficultyAdjustmentService

**Responsibility**: Adapt difficulty to candidate level
**Location**: `core/interview-preparation/services/DifficultyAdjustmentService.ts`

**SRP**: ✅ Single responsibility (difficulty adjustment orchestration)
**Dependencies**: AdaptiveRules, EventBus
**Forbidden**: Business logic, calculation logic

```typescript
export interface DifficultyAdjustmentService {
  adjustDifficulty(questions: InterviewQuestion[], candidateLevel: SkillLevel): Promise<InterviewQuestion[]>;
  calculateOptimalDifficulty(candidateLevel: SkillLevel, jobLevel: SkillLevel): QuestionDifficulty;
  validateProgression(questions: InterviewQuestion[]): ValidationResult;
}
```

---

### QuestionOrderingService

**Responsibility**: Order questions logically
**Location**: `core/interview-preparation/services/QuestionOrderingService.ts`

**SRP**: ✅ Single responsibility (ordering orchestration)
**Dependencies**: QuestionDependencies, InterviewConstraints
**Forbidden**: Business logic, dependency resolution logic

```typescript
export interface QuestionOrderingService {
  orderQuestions(questions: InterviewQuestion[], strategy: OrderingStrategy): Promise<InterviewQuestion[]>;
  validateDependencies(questions: InterviewQuestion[]): ValidationResult;
  resolveConflicts(questions: InterviewQuestion[]): Promise<InterviewQuestion[]>;
}
```

---

### TimingCalculationService

**Responsibility**: Calculate optimal timing
**Location**: `core/interview-preparation/services/TimingCalculationService.ts`

**SRP**: ✅ Single responsibility (timing calculation orchestration)
**Dependencies**: InterviewConstraints, QuestionType
**Forbidden**: Business logic, calculation logic

```typescript
export interface TimingCalculationService {
  calculateQuestionTiming(question: InterviewQuestion): InterviewTiming;
  calculateSectionTiming(section: InterviewSection): InterviewTiming;
  calculateTotalTiming(plan: InterviewPlan): InterviewTiming;
  validateTiming(plan: InterviewPlan, constraints: InterviewConstraints): ValidationResult;
}
```

---

### InterviewValidationService

**Responsibility**: Validate interview plans
**Location**: `core/interview-preparation/services/InterviewValidationService.ts`

**SRP**: ✅ Single responsibility (validation orchestration)
**Dependencies**: InterviewPlanValidator, QuestionCountPolicy, DurationPolicy, DifficultyPolicy, CoveragePolicy
**Forbidden**: Business logic, validation logic (delegated to validators/policies)

```typescript
export interface InterviewValidationService {
  validatePlan(plan: InterviewPlan): Promise<ValidationResult>;
  validateQuestion(question: InterviewQuestion): ValidationResult;
  validateSection(section: InterviewSection): ValidationResult;
  validateCoverage(plan: InterviewPlan, requirements: Requirement[]): ValidationResult;
}
```

---

## Repositories

### InterviewPlanRepositoryImpl

**Responsibility**: Persist interview plans to database
**Location**: `core/interview-preparation/repositories/InterviewPlanRepositoryImpl.ts`

**SRP**: ✅ Single responsibility (plan persistence)
**Dependencies**: InterviewPlanMapper, getServerDb
**Forbidden**: Business logic, validation, mapping (delegated to mapper)

```typescript
export class InterviewPlanRepositoryImpl implements InterviewPlanRepository {
  constructor(mapper: InterviewPlanMapper) {}
  
  async save(plan: InterviewPlan): Promise<void> { /* implementation */ }
  async findById(planId: string): Promise<InterviewPlan | null> { /* implementation */ }
  async findByCandidate(candidateId: string): Promise<InterviewPlan[]> { /* implementation */ }
  async findByJobOffer(jobOfferId: string): Promise<InterviewPlan[]> { /* implementation */ }
  async delete(planId: string): Promise<void> { /* implementation */ }
}
```

---

### QuestionTemplateRepositoryImpl

**Responsibility**: Access question templates from database
**Location**: `core/interview-preparation/repositories/QuestionTemplateRepositoryImpl.ts`

**SRP**: ✅ Single responsibility (template access)
**Dependencies**: QuestionTemplateMapper, getServerDb
**Forbidden**: Business logic, validation, mapping (delegated to mapper)

```typescript
export class QuestionTemplateRepositoryImpl implements QuestionTemplateRepository {
  constructor(mapper: QuestionTemplateMapper) {}
  
  async findByType(type: QuestionType): Promise<QuestionTemplate[]> { /* implementation */ }
  async findByCompetency(competencyId: string): Promise<QuestionTemplate[]> { /* implementation */ }
  async findByDifficulty(difficulty: QuestionDifficulty): Promise<QuestionTemplate[]> { /* implementation */ }
}
```

---

## Providers

### AIQuestionProvider

**Responsibility**: Integrate with AI for question generation
**Location**: `core/interview-preparation/providers/AIQuestionProvider.ts`

**SRP**: ✅ Single responsibility (AI integration)
**Dependencies**: AIAdapter (GPT)
**Forbidden**: Business logic, validation

```typescript
export class AIQuestionProvider implements QuestionProviderPort {
  constructor(aiAdapter: AIAdapter) {}
  
  async provideQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]> { /* implementation */ }
  async provideTemplates(criteria: TemplateCriteria): Promise<QuestionTemplate[]> { /* implementation */ }
  async searchTemplates(query: string): Promise<QuestionTemplate[]> { /* implementation */ }
}
```

---

### TemplateQuestionProvider

**Responsibility**: Integrate with template repository
**Location**: `core/interview-preparation/providers/TemplateQuestionProvider.ts`

**SRP**: ✅ Single responsibility (template integration)
**Dependencies**: QuestionTemplateRepository
**Forbidden**: Business logic, validation

```typescript
export class TemplateQuestionProvider implements QuestionProviderPort {
  constructor(repository: QuestionTemplateRepository) {}
  
  async provideQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]> { /* implementation */ }
  async provideTemplates(criteria: TemplateCriteria): Promise<QuestionTemplate[]> { /* implementation */ }
  async searchTemplates(query: string): Promise<QuestionTemplate[]> { /* implementation */ }
}
```

---

## Policies

### QuestionCountPolicy

**Responsibility**: Enforce question count limits
**Location**: `core/interview-preparation/policies/QuestionCountPolicy.ts`

**SRP**: ✅ Single responsibility (count enforcement)
**Dependencies**: None
**Configuration**: minQuestions, maxQuestions, minPerSection, maxPerSection

```typescript
export interface QuestionCountPolicy {
  validate(count: number): boolean;
  validateSection(count: number): boolean;
  getViolationMessage(count: number): string;
}
```

---

### DurationPolicy

**Responsibility**: Enforce time constraints
**Location**: `core/interview-preparation/policies/DurationPolicy.ts`

**SRP**: ✅ Single responsibility (duration enforcement)
**Dependencies**: None
**Configuration**: maxDuration, minDuration, maxPerQuestion

```typescript
export interface DurationPolicy {
  validate(duration: number): boolean;
  validateQuestion(duration: number): boolean;
  getViolationMessage(duration: number): string;
}
```

---

### DifficultyPolicy

**Responsibility**: Enforce difficulty progression
**Location**: `core/interview-preparation/policies/DifficultyPolicy.ts`

**SRP**: ✅ Single responsibility (difficulty enforcement)
**Dependencies**: None
**Configuration**: minDifficulty, maxDifficulty, allowJumps

```typescript
export interface DifficultyPolicy {
  validateProgression(difficulties: QuestionDifficulty[]): boolean;
  validateRange(difficulty: QuestionDifficulty): boolean;
  getViolationMessage(difficulty: QuestionDifficulty): string;
}
```

---

### CoveragePolicy

**Responsibility**: Enforce competency coverage
**Location**: `core/interview-preparation/policies/CoveragePolicy.ts`

**SRP**: ✅ Single responsibility (coverage enforcement)
**Dependencies**: None
**Configuration**: requiredCompetencies, minCoverageLevel

```typescript
export interface CoveragePolicy {
  validate(coverage: CoverageMatrix): boolean;
  getMissingCompetencies(coverage: CoverageMatrix): string[];
  getViolationMessage(coverage: CoverageMatrix): string;
}
```

---

## Mappers

### InterviewPlanMapper

**Responsibility**: Transform between InterviewPlan and DatabaseDTO
**Location**: `core/interview-preparation/mappers/InterviewPlanMapper.ts`

**SRP**: ✅ Single responsibility (plan transformation)
**Dependencies**: None
**Methods**: toDatabaseDTO, fromDatabaseDTO, fromDatabaseRecord

```typescript
export interface InterviewPlanMapper {
  toDatabaseDTO(plan: InterviewPlan): InterviewPlanDatabaseDTO;
  fromDatabaseDTO(dto: InterviewPlanDatabaseDTO): InterviewPlan;
  fromDatabaseRecord(record: DatabaseRecord): InterviewPlanDatabaseDTO;
}
```

---

### InterviewQuestionMapper

**Responsibility**: Transform between InterviewQuestion and DatabaseDTO
**Location**: `core/interview-preparation/mappers/InterviewQuestionMapper.ts`

**SRP**: ✅ Single responsibility (question transformation)
**Dependencies**: None
**Methods**: toDatabaseDTO, fromDatabaseDTO, fromDatabaseRecord

```typescript
export interface InterviewQuestionMapper {
  toDatabaseDTO(question: InterviewQuestion): InterviewQuestionDatabaseDTO;
  fromDatabaseDTO(dto: InterviewQuestionDatabaseDTO): InterviewQuestion;
  fromDatabaseRecord(record: DatabaseRecord): InterviewQuestionDatabaseDTO;
}
```

---

## Validators

### InterviewPlanValidator

**Responsibility**: Validate InterviewPlan aggregates
**Location**: `core/interview-preparation/validators/InterviewPlanValidator.ts`

**SRP**: ✅ Single responsibility (plan validation)
**Dependencies**: QuestionCountPolicy, DurationPolicy, DifficultyPolicy, CoveragePolicy
**Forbidden**: Business logic, policy logic (delegated to policies)

```typescript
export interface InterviewPlanValidator {
  validate(plan: InterviewPlan): ValidationResult;
  validateStructure(plan: InterviewPlan): ValidationResult;
  validateInvariants(plan: InterviewPlan): ValidationResult;
}
```

---

### InterviewQuestionValidator

**Responsibility**: Validate InterviewQuestion entities
**Location**: `core/interview-preparation/validators/InterviewQuestionValidator.ts`

**SRP**: ✅ Single responsibility (question validation)
**Dependencies**: None
**Forbidden**: Business logic

```typescript
export interface InterviewQuestionValidator {
  validate(question: InterviewQuestion): ValidationResult;
  validateStructure(question: InterviewQuestion): ValidationResult;
  validateInvariants(question: InterviewQuestion): ValidationResult;
}
```

---

## Factories

### InterviewPlanFactory

**Responsibility**: Create InterviewPlan aggregates
**Location**: `core/interview-preparation/factories/InterviewPlanFactory.ts`

**SRP**: ✅ Single responsibility (plan creation)
**Dependencies**: InterviewSectionFactory
**Forbidden**: Validation, persistence, business logic

```typescript
export interface InterviewPlanFactory {
  create(request: InterviewPlanRequest): InterviewPlan;
  createSection(sectionData: SectionData): InterviewSection;
  createEmpty(): InterviewPlan;
}
```

---

### InterviewQuestionFactory

**Responsibility**: Create InterviewQuestion entities
**Location**: `core/interview-preparation/factories/InterviewQuestionFactory.ts`

**SRP**: ✅ Single responsibility (question creation)
**Dependencies**: None
**Forbidden**: Validation, persistence, business logic

```typescript
export interface InterviewQuestionFactory {
  createFromTemplate(template: QuestionTemplate, context: QuestionContext): InterviewQuestion;
  createFromAI(aiResponse: AIQuestionResponse, context: QuestionContext): InterviewQuestion;
  createEmpty(): InterviewQuestion;
}
```

---

## Events

### InterviewPlanningEventHandler

**Responsibility**: Handle interview planning events
**Location**: `core/interview-preparation/events/InterviewPlanningEventHandler.ts`

**SRP**: ✅ Single responsibility (event handling)
**Dependencies**: InterviewPlanningService, EventBus, DiagnosticCollector
**Forbidden**: Business logic, planning logic (delegated to service)

```typescript
export interface InterviewPlanningEventHandler {
  start(): void;
  stop(): void;
  isActive(): boolean;
  handleInterviewPlanRequested(event: InterviewPlanRequested): void;
  handleInterviewPlanGenerated(event: InterviewPlanGenerated): void;
  handlePlanValidated(event: PlanValidated): void;
}
```

---

## Integration

### InterviewPlanningIntegration

**Responsibility**: Thin wrapper for event handler
**Location**: `core/interview-preparation/integration/InterviewPlanningIntegration.ts`

**SRP**: ✅ Single responsibility (delegation only)
**Dependencies**: InterviewPlanningEventHandler, DiagnosticCollector
**Forbidden**: Business logic, event handling, planning logic

```typescript
export interface InterviewPlanningIntegration {
  start(): void;
  stop(): void;
  isActive(): boolean;
}
```

---

## Composition Root

### Container

**Responsibility**: Wire all dependencies
**Location**: `core/interview-preparation/container.ts`

**SRP**: ✅ Single responsibility (dependency wiring)
**Dependencies**: All concrete implementations
**Forbidden**: Business logic

```typescript
// Composition Root - All instantiation happens here
export class InterviewPreparationContainer {
  private static instance: InterviewPreparationContainer;
  
  private interviewPlanningService: InterviewPlanningService;
  private questionGenerationService: QuestionGenerationService;
  private coverageAnalysisService: CoverageAnalysisService;
  private difficultyAdjustmentService: DifficultyAdjustmentService;
  private questionOrderingService: QuestionOrderingService;
  private timingCalculationService: TimingCalculationService;
  private interviewValidationService: InterviewValidationService;
  
  private constructor() {
    this.initialize();
  }
  
  private initialize(): void {
    // Initialize all dependencies
    const eventBus = new LocalEventBus();
    const diagnosticCollector = new DiagnosticCollector();
    
    // Policies
    const questionCountPolicy = new QuestionCountPolicyImpl(DEFAULT_COUNT_CONFIG);
    const durationPolicy = new DurationPolicyImpl(DEFAULT_DURATION_CONFIG);
    const difficultyPolicy = new DifficultyPolicyImpl(DEFAULT_DIFFICULTY_CONFIG);
    const coveragePolicy = new CoveragePolicyImpl(DEFAULT_COVERAGE_CONFIG);
    
    // Mappers
    const interviewPlanMapper = new InterviewPlanMapperImpl();
    const interviewQuestionMapper = new InterviewQuestionMapperImpl();
    
    // Repositories
    const interviewPlanRepository = new InterviewPlanRepositoryImpl(interviewPlanMapper);
    const questionTemplateRepository = new QuestionTemplateRepositoryImpl();
    
    // Providers
    const aiAdapter = new GPTAdapter();
    const aiQuestionProvider = new AIQuestionProvider(aiAdapter);
    const templateQuestionProvider = new TemplateQuestionProvider(questionTemplateRepository);
    
    // Factories
    const interviewPlanFactory = new InterviewPlanFactoryImpl();
    const interviewQuestionFactory = new InterviewQuestionFactoryImpl();
    
    // Services
    this.questionGenerationService = new QuestionGenerationServiceImpl(
      aiQuestionProvider,
      interviewQuestionFactory,
      eventBus
    );
    
    this.coverageAnalysisService = new CoverageAnalysisServiceImpl(
      coveragePolicy,
      eventBus
    );
    
    this.difficultyAdjustmentService = new DifficultyAdjustmentServiceImpl(
      eventBus
    );
    
    this.questionOrderingService = new QuestionOrderingServiceImpl(
      eventBus
    );
    
    this.timingCalculationService = new TimingCalculationServiceImpl(
      durationPolicy
    );
    
    this.interviewValidationService = new InterviewValidationServiceImpl(
      questionCountPolicy,
      durationPolicy,
      difficultyPolicy,
      coveragePolicy
    );
    
    this.interviewPlanningService = new InterviewPlanningServiceImpl(
      interviewPlanRepository,
      eventBus,
      diagnosticCollector
    );
  }
  
  static getInstance(): InterviewPreparationContainer {
    if (!InterviewPreparationContainer.instance) {
      InterviewPreparationContainer.instance = new InterviewPreparationContainer();
    }
    return InterviewPreparationContainer.instance;
  }
  
  getInterviewPlanningService(): InterviewPlanningService {
    return this.interviewPlanningService;
  }
  
  getQuestionGenerationService(): QuestionGenerationService {
    return this.questionGenerationService;
  }
  
  getCoverageAnalysisService(): CoverageAnalysisService {
    return this.coverageAnalysisService;
  }
  
  getDifficultyAdjustmentService(): DifficultyAdjustmentService {
    return this.difficultyAdjustmentService;
  }
  
  getQuestionOrderingService(): QuestionOrderingService {
    return this.questionOrderingService;
  }
  
  getTimingCalculationService(): TimingCalculationService {
    return this.timingCalculationService;
  }
  
  getInterviewValidationService(): InterviewValidationService {
    return this.interviewValidationService;
  }
}
```

---

## Dependency Injection

### Constructor Injection
- All dependencies injected via constructor
- No service locator pattern
- No global state
- Manual DI (no IoC framework)

### Dependency Limits
- Max 5 dependencies per constructor
- Max 5 parameters per method
- Max 15 public methods per class
- Max 3 levels of nesting

### Import Rules
- No circular dependencies
- No upward layer imports
- Import from interfaces, not implementations

---

## Quality Gates

All implementations must pass:
- TypeScript strict mode
- ESLint (zero errors)
- Prettier formatting
- Unit tests (all components)
- Integration tests (all flows)
- Architecture compliance (FEATURE_B5 pattern)
- ADR compliance (all relevant ADRs)
