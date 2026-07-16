# Interview Preparation Engine - Dependencies Matrix

## Overview
This document defines the dependency rules for the Interview Preparation Engine, following the exact dependency pattern established by FEATURE_B5.

---

## Dependency Rules

### Allowed Dependencies

#### Domain Layer → Domain Layer
**Allowed**: Yes
**Direction**: Within domain layer only
**Examples**:
- Entity → Value Object
- Aggregate → Entity
- Domain Service → Domain Service
- Factory → Entity/Value Object

**Constraints**:
- No circular dependencies
- No upward dependencies to application/infrastructure

---

#### Domain Layer → Application Layer
**Allowed**: NO
**Direction**: Forbidden
**Rationale**: Domain must remain independent of application logic

---

#### Domain Layer → Infrastructure Layer
**Allowed**: NO
**Direction**: Forbidden
**Rationale**: Domain must remain independent of infrastructure

---

#### Application Layer → Domain Layer
**Allowed**: YES
**Direction**: Allowed (inward dependency)
**Examples**:
- Service → Entity
- Service → Value Object
- Service → Domain Service
- Validator → Entity
- Policy → Entity

**Constraints**:
- Must depend on interfaces, not implementations
- No direct repository access (through service only)

---

#### Application Layer → Application Layer
**Allowed**: YES
**Direction**: Within application layer only
**Examples**:
- Service → Service
- Service → Policy
- Service → Validator
- Service → Factory

**Constraints**:
- No circular dependencies
- Max 5 dependencies per constructor

---

#### Application Layer → Infrastructure Layer
**Allowed**: NO
**Direction**: Forbidden
**Rationale**: Application must depend on interfaces, not implementations

---

#### Infrastructure Layer → Domain Layer
**Allowed**: NO
**Direction**: Forbidden
**Rationale**: Infrastructure must not depend on domain

---

#### Infrastructure Layer → Application Layer
**Allowed**: NO
**Direction**: Forbidden
**Rationale**: Infrastructure must not depend on application

---

#### Infrastructure Layer → Infrastructure Layer
**Allowed**: YES
**Direction**: Within infrastructure layer only
**Examples**:
- Repository → Mapper
- Provider → Adapter
- Adapter → External API

**Constraints**:
- No circular dependencies
- Max 5 dependencies per constructor

---

### Forbidden Dependencies

#### Direct Infrastructure Access
**Forbidden**: Application layer directly accessing infrastructure
**Example**: Service calling Repository directly
**Correct**: Service calling Service which calls Repository

---

#### Direct AI Access
**Forbidden**: Domain or application layer directly calling AI
**Example**: Service calling GPT API directly
**Correct**: Service calling Provider which calls Adapter

---

#### Circular Dependencies
**Forbidden**: Any circular dependency
**Example**: Service A → Service B → Service A
**Correct**: Refactor to eliminate circular dependency

---

#### Upward Dependencies
**Forbidden**: Lower layer depending on higher layer
**Example**: Infrastructure depending on Application
**Correct**: Application depending on Infrastructure interface

---

#### Concrete Dependencies
**Forbidden**: Depending on concrete implementations
**Example**: Service depending on RepositoryImpl
**Correct**: Service depending on Repository interface

---

## Layer Dependency Matrix

| From \ To | Domain | Application | Infrastructure | External |
|------------|--------|-------------|----------------|----------|
| **Domain** | ✅ Allowed | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |
| **Application** | ✅ Allowed | ✅ Allowed | ❌ Forbidden | ❌ Forbidden |
| **Infrastructure** | ❌ Forbidden | ❌ Forbidden | ✅ Allowed | ✅ Allowed |
| **External** | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden | N/A |

---

## Component Dependency Matrix

### Builders

**InterviewPlanBuilder**
- **Allowed Dependencies**: InterviewSectionBuilder, InterviewQuestionBuilder
- **Forbidden Dependencies**: Services, Repositories, Providers
- **Max Dependencies**: 3

**InterviewQuestionBuilder**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: Services, Repositories, Providers
- **Max Dependencies**: 0

**InterviewSectionBuilder**
- **Allowed Dependencies**: InterviewQuestionBuilder
- **Forbidden Dependencies**: Services, Repositories, Providers
- **Max Dependencies**: 1

---

### Events

**InterviewPlanningEventHandler**
- **Allowed Dependencies**: InterviewPlanningService, EventBus, DiagnosticCollector
- **Forbidden Dependencies**: Repositories, Providers, AI
- **Max Dependencies**: 3

---

### Integration

**InterviewPlanningIntegration**
- **Allowed Dependencies**: InterviewPlanningEventHandler, DiagnosticCollector
- **Forbidden Dependencies**: Services, Repositories, Providers
- **Max Dependencies**: 2

---

### Services

**InterviewPlanningService**
- **Allowed Dependencies**: InterviewPlanRepository, EventBus, DiagnosticCollector
- **Forbidden Dependencies**: AI, Providers, Builders
- **Max Dependencies**: 3

**QuestionGenerationService**
- **Allowed Dependencies**: QuestionProviderPort, InterviewQuestionFactory, EventBus
- **Forbidden Dependencies**: AI directly, Repositories
- **Max Dependencies**: 3

**CoverageAnalysisService**
- **Allowed Dependencies**: CoverageAnalyzerPort, EventBus
- **Forbidden Dependencies**: AI, Repositories
- **Max Dependencies**: 2

**DifficultyAdjustmentService**
- **Allowed Dependencies**: AdaptiveRules, EventBus
- **Forbidden Dependencies**: AI, Repositories
- **Max Dependencies**: 2

**QuestionOrderingService**
- **Allowed Dependencies**: QuestionDependencies, InterviewConstraints
- **Forbidden Dependencies**: AI, Repositories
- **Max Dependencies**: 2

**TimingCalculationService**
- **Allowed Dependencies**: InterviewConstraints, QuestionType
- **Forbidden Dependencies**: AI, Repositories
- **Max Dependencies**: 2

**InterviewValidationService**
- **Allowed Dependencies**: InterviewPlanValidator, QuestionCountPolicy, DurationPolicy, DifficultyPolicy, CoveragePolicy
- **Forbidden Dependencies**: AI, Repositories
- **Max Dependencies**: 5

---

### Repositories

**InterviewPlanRepositoryImpl**
- **Allowed Dependencies**: InterviewPlanMapper, getServerDb
- **Forbidden Dependencies**: Services, AI, Providers
- **Max Dependencies**: 2

**QuestionTemplateRepositoryImpl**
- **Allowed Dependencies**: QuestionTemplateMapper, getServerDb
- **Forbidden Dependencies**: Services, AI, Providers
- **Max Dependencies**: 2

---

### Providers

**AIQuestionProvider**
- **Allowed Dependencies**: AIAdapter (GPT)
- **Forbidden Dependencies**: Services, Repositories
- **Max Dependencies**: 1

**TemplateQuestionProvider**
- **Allowed Dependencies**: QuestionTemplateRepository
- **Forbidden Dependencies**: Services, AI
- **Max Dependencies**: 1

---

### Policies

**QuestionCountPolicy**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: All
- **Max Dependencies**: 0

**DurationPolicy**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: All
- **Max Dependencies**: 0

**DifficultyPolicy**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: All
- **Max Dependencies**: 0

**CoveragePolicy**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: All
- **Max Dependencies**: 0

---

### Mappers

**InterviewPlanMapper**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: Services, Repositories
- **Max Dependencies**: 0

**InterviewQuestionMapper**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: Services, Repositories
- **Max Dependencies**: 0

---

### Validators

**InterviewPlanValidator**
- **Allowed Dependencies**: QuestionCountPolicy, DurationPolicy, DifficultyPolicy, CoveragePolicy
- **Forbidden Dependencies**: Services, Repositories, AI
- **Max Dependencies**: 4

**InterviewQuestionValidator**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: Services, Repositories, AI
- **Max Dependencies**: 0

---

### Factories

**InterviewPlanFactory**
- **Allowed Dependencies**: InterviewSectionFactory
- **Forbidden Dependencies**: Services, Repositories, Providers
- **Max Dependencies**: 1

**InterviewQuestionFactory**
- **Allowed Dependencies**: None
- **Forbidden Dependencies**: Services, Repositories, Providers
- **Max Dependencies**: 0

---

## Interface Contracts

### InterviewPlanGeneratorPort

**Contract**: Generate interview plans from inputs
**Input**: InterviewPlanRequest
**Output**: InterviewPlan
**Exceptions**: InterviewPlanningError
**Guarantees**: Returns valid plan or throws exception
**Side Effects**: None (pure function)

---

### QuestionProviderPort

**Contract**: Provide questions based on criteria
**Input**: QuestionCriteria
**Output**: InterviewQuestion[]
**Exceptions**: QuestionGenerationError
**Guarantees**: Returns valid questions or throws exception
**Side Effects**: May call external AI API

---

### CoverageAnalyzerPort

**Contract**: Analyze competency coverage
**Input**: InterviewPlan, Requirement[]
**Output**: CoverageMatrix
**Exceptions**: None
**Guarantees**: Always returns valid coverage matrix
**Side Effects**: None (pure function)

---

### InterviewPlanRepository

**Contract**: Persist and retrieve interview plans
**Input**: InterviewPlan or planId
**Output**: void or InterviewPlan
**Exceptions**: PersistenceError
**Guarantees**: Successful persistence or throws exception
**Side Effects**: Database operations

---

## Component Responsibilities

### Builders
**Responsibility**: Construct domain objects
**Contract**: Create valid domain objects
**Input**: Raw data
**Output**: Domain objects
**Forbidden**: Validation, persistence, business logic

---

### Events
**Responsibility**: Handle domain events
**Contract**: Transform events to commands
**Input**: Domain events
**Output**: Commands
**Forbidden**: Business logic, persistence

---

### Integration
**Responsibility**: Thin wrapper for event handlers
**Contract**: Delegate to event handlers
**Input**: Start/stop commands
**Output**: None
**Forbidden**: Business logic, event handling

---

### Services
**Responsibility**: Orchestrate domain operations
**Contract**: Execute domain workflows
**Input**: Domain requests
**Output**: Domain responses
**Forbidden**: Business logic (delegated to domain), infrastructure access

---

### Repositories
**Responsibility**: Persist domain objects
**Contract**: Save/retrieve domain objects
**Input**: Domain objects or IDs
**Output**: void or domain objects
**Forbidden**: Business logic, validation, mapping (delegated to mapper)

---

### Providers
**Responsibility**: Integrate with external systems
**Contract**: Provide data from external systems
**Input**: Criteria
**Output**: Data
**Forbidden**: Business logic, validation

---

### Policies
**Responsibility**: Enforce business rules
**Contract**: Validate against rules
**Input**: Data to validate
**Output**: ValidationResult
**Forbidden**: Business logic (rules only)

---

### Mappers
**Responsibility**: Transform between domain and DTO
**Contract**: Convert domain to DTO and vice versa
**Input**: Domain or DTO
**Output**: DTO or domain
**Forbidden**: Validation, business logic

---

### Validators
**Responsibility**: Validate domain objects
**Contract**: Validate domain invariants
**Input**: Domain objects
**Output**: ValidationResult
**Forbidden**: Business logic (validation only)

---

### Factories
**Responsibility**: Create domain objects
**Contract**: Create valid domain objects
**Input**: Creation data
**Output**: Domain objects
**Forbidden**: Validation, persistence, business logic

---

## Dependency Violation Detection

### Static Analysis
- ESLint rules for import restrictions
- TypeScript compiler for circular dependencies
- Custom lint rules for dependency violations

### Runtime Detection
- Dependency injection validation at startup
- Interface contract validation
- Dependency count validation

### Manual Review
- Code review checklist
- Architecture review checklist
- Dependency review checklist

---

## Dependency Evolution

### Versioning
- Dependencies versioned with interfaces
- Breaking changes require new interface version
- Backward compatibility maintained where possible

### Deprecation
- Deprecated dependencies marked with @deprecated
- Grace period for migration
- Clear communication of changes

### Addition
- New dependencies added via ADR
- Impact analysis performed
- Implementation phased if needed

---

## Dependency Testing

### Unit Tests
- Mock dependencies
- Test in isolation
- Verify dependency contracts

### Integration Tests
- Test with real dependencies
- Verify dependency resolution
- Test dependency failures

### Contract Tests
- Test interface contracts
- Verify input/output contracts
- Test exception handling
