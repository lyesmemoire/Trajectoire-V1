# ADD-001: Interview Preparation Engine Architecture

## Status
Proposed — Phase 2 Design

## Context
The Trajectoire project requires an Interview Preparation Engine that generates comprehensive interview plans from candidate profiles, job offers, and matching analysis. This engine will serve as the central business contract for the entire interview pipeline, feeding into Voice Interview Engine, Speech-to-Text, Live Analysis, Live Coaching, Final Report, and Learning Engine.

## Problem
The current system lacks a structured approach to interview preparation. Interview questions are generated ad-hoc without:
- Systematic competency coverage
- Adaptive difficulty based on candidate level
- Logical question progression
- Clear evaluation criteria
- Consistent timing and structure

This leads to inconsistent interview quality and poor candidate experience.

## Decision
We adopt a Domain-Driven Design (DDD) approach for the Interview Preparation Engine, following the exact architectural pattern established by FEATURE_B5 (Runtime Persistence).

### Architecture Pattern
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

### Bounded Contexts
The Interview Preparation Engine operates within the **Interview Planning** bounded context, with clear boundaries:
- **Candidate Context**: CandidateGraph (input)
- **Job Context**: JobOfferGraph (input)
- **Matching Context**: MatchingGraph (input)
- **Interview Planning Context**: InterviewPlan (output)
- **Interview Execution Context**: Voice Interview Engine (consumer)

### Core Domain Concepts

#### Entities
- **InterviewPlan**: Aggregate root, represents complete interview strategy
- **InterviewQuestion**: Individual question with metadata and evaluation criteria
- **InterviewSection**: Logical grouping of questions (e.g., "Technical Skills", "Behavioral")

#### Value Objects
- **QuestionType**: Type of question (technical, behavioral, situational, culture-fit)
- **QuestionDifficulty**: Difficulty level (beginner, intermediate, advanced, expert)
- **EvaluationCriteria**: Scoring rubric for question evaluation
- **CompetencyCoverage**: Mapping of questions to competencies
- **ExpectedAnswer**: Ideal response structure and key points
- **InterviewTiming**: Time allocation per question/section
- **InterviewConstraints**: Business rules and limitations
- **AdaptiveRules**: Rules for dynamic adjustment

#### Aggregates
- **InterviewPlanAggregate**: Root containing all interview planning entities

#### Domain Services
- **QuestionGenerationService**: Generates questions based on competencies
- **CoverageAnalysisService**: Ensures competency coverage requirements
- **DifficultyAdjustmentService**: Adapts difficulty to candidate level
- **QuestionOrderingService**: Orders questions logically
- **TimingCalculationService**: Calculates optimal timing

#### Policies
- **QuestionCountPolicy**: Enforces question count limits
- **DurationPolicy**: Enforces time constraints
- **DifficultyPolicy**: Enforces difficulty progression
- **CoveragePolicy**: Enforces competency coverage requirements

#### Business Rules
- Minimum/maximum question counts per section
- Total interview duration limits
- Soft skills vs hard skills balance (e.g., 60/40)
- Mandatory competency coverage
- Logical question progression (easy → hard)
- Candidate level adaptation
- Job-specific customization

#### Domain Events
- InterviewPlanRequested
- InterviewPlanGenerated
- QuestionGenerated
- CoverageCompleted
- PlanValidated
- PlanRejected
- QuestionAdded
- QuestionRemoved
- QuestionReordered
- DifficultyAdjusted
- InterviewPlanCompleted

#### Factories
- InterviewPlanFactory: Creates InterviewPlan aggregates
- InterviewQuestionFactory: Creates InterviewQuestion entities

#### Repositories
- InterviewPlanRepository: Persists interview plans
- QuestionTemplateRepository: Access to question templates

#### Ports
- InterviewPlanGeneratorPort: Interface for plan generation
- QuestionProviderPort: Interface for question sourcing
- CoverageAnalyzerPort: Interface for coverage analysis

#### Adapters
- AIQuestionAdapter: Integrates with AI for question generation
- TemplateQuestionAdapter: Integrates with template repository
- DatabaseQuestionAdapter: Integrates with database storage

#### Application Services
- InterviewPlanningService: Orchestrates plan generation
- InterviewValidationService: Validates generated plans

## Consequences

### Positive
- Clear separation of concerns following FEATURE_B5 pattern
- Domain logic isolated from infrastructure
- Testable architecture with clear interfaces
- Extensible design for future enhancements
- Consistent with project architectural standards

### Negative
- Increased initial complexity due to DDD approach
- More files and abstractions than simple implementation
- Requires understanding of DDD concepts

### Risks
- AI integration complexity (question generation)
- Business rule complexity (adaptive rules)
- Performance considerations for large candidate/job graphs

## Alternatives Considered

### Alternative 1: Simple Service Layer
- Single service with all logic
- No DDD patterns
- **Rejected**: Violates SRP, not extensible, inconsistent with FEATURE_B5

### Alternative 2: AI-Only Generation
- Let AI generate entire plan
- No business rules in code
- **Rejected**: AI cannot enforce business constraints, no auditability, not deterministic

### Alternative 3: Template-Based Only
- Pre-defined question templates
- No AI generation
- **Rejected**: Not adaptive, limited coverage, poor candidate experience

## Implementation Strategy

### Phase 2A (Current): Domain Design
- Complete DDD analysis
- Define all domain concepts
- Specify business rules
- Design architecture

### Phase 2B: Implementation
- Implement following FEATURE_B5 pattern
- Use same folder structure
- Apply same quality gates
- Follow same testing strategy

### Phase 2C: Integration
- Integrate with CandidateGraph
- Integrate with JobOfferGraph
- Integrate with MatchingGraph
- Feed into Voice Interview Engine

## Dependencies

### Input Dependencies
- CandidateGraph (from Candidate Context)
- JobOfferGraph (from Job Context)
- MatchingGraph (from Matching Context)

### Output Dependencies
- Voice Interview Engine (Interview Execution Context)
- Speech-to-Text (Interview Execution Context)
- Live Analysis (Interview Execution Context)
- Live Coaching (Interview Execution Context)
- Final Report (Interview Execution Context)
- Learning Engine (Interview Execution Context)

### Technical Dependencies
- AI Provider (GPT for question generation)
- Database (for plan persistence)
- Event Bus (for domain events)

## Quality Gates

All implementations must pass:
- TypeScript strict mode
- ESLint (zero errors)
- Prettier formatting
- Unit tests (all components)
- Integration tests (all flows)
- Architecture compliance (FEATURE_B5 pattern)
- ADR compliance (all relevant ADRs)

## References
- FEATURE_B5 Runtime Persistence (Reference Implementation)
- docs/architecture/REFERENCE_IMPLEMENTATION.md
- ADR-001: Hexagonal Architecture
- ADR-005: Domain Events
- ADR-007: Composition Root
- ADR-008: Dependency Injection Strategy
