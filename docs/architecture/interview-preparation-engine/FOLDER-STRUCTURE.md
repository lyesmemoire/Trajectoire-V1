# Interview Preparation Engine - Folder Structure

## Overview
This document defines the complete folder structure for the Interview Preparation Engine, following the exact pattern established by FEATURE_B5.

---

## Root Structure

```
core/interview-preparation/
├── builders/              # Domain object construction
├── events/                # Event handling
├── integration/           # Integration coordination
├── interfaces/           # Feature interfaces
├── mappers/              # Data transformation
├── policies/             # Cross-cutting policies
├── repositories/         # Data access
├── services/             # Application services
├── validators/           # Domain validation
├── factories/            # Domain factories
├── providers/            # External providers
├── errors/               # Domain errors
├── __tests__/            # Test suite
├── types.ts              # Shared types
└── container.ts          # Composition root
```

---

## Detailed Structure

### builders/

**Purpose**: Domain object construction
**Files**:
- `InterviewPlanBuilder.ts` - Build InterviewPlan aggregates
- `InterviewQuestionBuilder.ts` - Build InterviewQuestion entities
- `InterviewSectionBuilder.ts` - Build InterviewSection entities

**SRP**: Each builder has single responsibility (construction only)
**Forbidden**: Validation, persistence, business logic

---

### events/

**Purpose**: Event handling
**Files**:
- `InterviewPlanningEventHandler.ts` - Handle planning events

**SRP**: Single responsibility (event handling only)
**Forbidden**: Business logic, persistence

---

### integration/

**Purpose**: Integration coordination
**Files**:
- `InterviewPlanningIntegration.ts` - Thin wrapper for event handler

**SRP**: Single responsibility (delegation only)
**Forbidden**: Business logic, event handling, persistence

---

### interfaces/

**Purpose**: Feature interfaces (Ports)
**Files**:
- `InterviewPlanGeneratorPort.ts` - Plan generation interface
- `QuestionProviderPort.ts` - Question provision interface
- `CoverageAnalyzerPort.ts` - Coverage analysis interface
- `InterviewPlanRepository.ts` - Plan persistence interface

**SRP**: Each interface defines single contract
**Forbidden**: Implementation logic

---

### mappers/

**Purpose**: Data transformation
**Files**:
- `InterviewPlanMapper.ts` - Transform plan to DTO
- `InterviewQuestionMapper.ts` - Transform question to DTO

**SRP**: Each mapper has single responsibility (transformation only)
**Forbidden**: Validation, business logic

---

### policies/

**Purpose**: Cross-cutting policies
**Files**:
- `QuestionCountPolicy.ts` - Enforce count rules
- `DurationPolicy.ts` - Enforce duration rules
- `DifficultyPolicy.ts` - Enforce difficulty rules
- `CoveragePolicy.ts` - Enforce coverage rules

**SRP**: Each policy enforces single rule set
**Forbidden**: Business logic (rules only)

---

### repositories/

**Purpose**: Data access
**Files**:
- `InterviewPlanRepositoryImpl.ts` - Persist interview plans
- `QuestionTemplateRepositoryImpl.ts` - Access question templates

**SRP**: Each repository has single responsibility (persistence)
**Forbidden**: Business logic, validation, mapping (delegated to mapper)

---

### services/

**Purpose**: Application services
**Files**:
- `InterviewPlanningService.ts` - Orchestrate planning workflow
- `QuestionGenerationService.ts` - Orchestrate question generation
- `CoverageAnalysisService.ts` - Orchestrate coverage analysis
- `DifficultyAdjustmentService.ts` - Orchestrate difficulty adjustment
- `QuestionOrderingService.ts` - Orchestrate question ordering
- `TimingCalculationService.ts` - Orchestrate timing calculation
- `InterviewValidationService.ts` - Orchestrate validation

**SRP**: Each service orchestrates single workflow
**Forbidden**: Business logic (delegated to domain), infrastructure access

---

### validators/

**Purpose**: Domain validation
**Files**:
- `InterviewPlanValidator.ts` - Validate plan aggregates
- `InterviewQuestionValidator.ts` - Validate question entities

**SRP**: Each validator validates single entity type
**Forbidden**: Business logic (validation only)

---

### factories/

**Purpose**: Domain factories
**Files**:
- `InterviewPlanFactory.ts` - Create plan aggregates
- `InterviewQuestionFactory.ts` - Create question entities

**SRP**: Each factory creates single entity type
**Forbidden**: Validation, persistence, business logic

---

### providers/

**Purpose**: External providers
**Files**:
- `AIQuestionProvider.ts` - Integrate with AI
- `TemplateQuestionProvider.ts` - Integrate with templates

**SRP**: Each provider integrates with single external system
**Forbidden**: Business logic, validation

---

### errors/

**Purpose**: Domain errors
**Files**:
- `InterviewPlanningError.ts` - Planning errors
- `QuestionGenerationError.ts` - Question generation errors
- `ValidationError.ts` - Validation errors

**SRP**: Each error type represents single error category

---

### __tests__/

**Purpose**: Test suite
**Files**:
- `InterviewPlanningService.test.ts` - Planning service tests
- `QuestionGenerationService.test.ts` - Question generation tests
- `CoverageAnalysisService.test.ts` - Coverage analysis tests
- `InterviewPlanRepository.test.ts` - Repository tests
- `InterviewPlanValidator.test.ts` - Validator tests
- `QuestionCountPolicy.test.ts` - Policy tests
- `DurationPolicy.test.ts` - Policy tests
- `DifficultyPolicy.test.ts` - Policy tests
- `CoveragePolicy.test.ts` - Policy tests

**Test Types**:
- Unit tests (individual components)
- Integration tests (component interactions)
- E2E tests (complete workflows)

---

### types.ts

**Purpose**: Shared types
**Content**:
- Domain types (entities, value objects)
- Application types (requests, responses)
- Infrastructure types (DTOs)

---

### container.ts

**Purpose**: Composition root
**Content**:
- Dependency wiring
- Component instantiation
- Singleton container

**SRP**: Single responsibility (dependency wiring)
**Forbidden**: Business logic

---

## File Naming Conventions

### TypeScript Files
- PascalCase for class files: `InterviewPlanBuilder.ts`
- PascalCase for interface files: `InterviewPlanGeneratorPort.ts`
- camelCase for utility files: `types.ts`

### Test Files
- Append `.test.ts` to source file name: `InterviewPlanningService.test.ts`

### Index Files
- Use `index.ts` for barrel exports where needed

---

## Import Rules

### Allowed Imports
- Import from interfaces, not implementations
- Import from same layer or lower layers
- Import from types.ts for shared types

### Forbidden Imports
- Import from implementations (use interfaces)
- Import from higher layers
- Circular imports

---

## Export Rules

### Interface Exports
- Export interfaces from `interfaces/` folder
- Use barrel exports for related interfaces

### Implementation Exports
- Export implementations from their respective folders
- Use barrel exports for related implementations

### Type Exports
- Export types from `types.ts`
- Export domain types from domain files

---

## Documentation

### File Headers
Each file should have a header comment:
```typescript
/**
 * Component Name
 *
 * Brief description of component responsibility.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY [specific responsibility].
 */
```

### JSDoc Comments
All public methods should have JSDoc comments:
```typescript
/**
 * Method description
 * @param paramName - Parameter description
 * @returns Return value description
 * @throws ErrorType - When this error is thrown
 */
```

---

## File Size Guidelines

### Maximum Lines
- 300 lines per file (excluding imports and comments)
- If file exceeds 300 lines, consider splitting

### Maximum Methods
- 15 public methods per class
- If class exceeds 15 methods, consider splitting

### Maximum Dependencies
- 5 dependencies per constructor
- If constructor exceeds 5 dependencies, consider refactoring

---

## Folder Organization Principles

### Single Responsibility
Each folder contains components with single responsibility:
- `builders/` - Construction only
- `events/` - Event handling only
- `services/` - Orchestration only
- `repositories/` - Persistence only

### Layer Separation
Folders organized by layer:
- Domain layer: types.ts (entities, VOs)
- Application layer: services/, policies/, validators/, builders/, factories/, events/, integration/
- Infrastructure layer: repositories/, providers/, mappers/

### Dependency Direction
Dependencies flow from outer to inner layers:
- Application → Domain
- Infrastructure → Infrastructure
- No upward dependencies

---

## File Creation Checklist

When creating a new file:

1. ✅ Add header comment
2. ✅ Add JSDoc comments for public methods
3. ✅ Follow naming conventions
4. ✅ Place in correct folder
5. ✅ Add to barrel exports if needed
6. ✅ Add test file
7. ✅ Update documentation

---

## File Deletion Checklist

When deleting a file:

1. ✅ Remove from barrel exports
2. ✅ Remove imports from other files
3. ✅ Delete test file
4. ✅ Update documentation
5. ✅ Update ADR if breaking change

---

## Folder Structure Evolution

### Phase 2B (Implementation)
- Implement all folders as defined
- Add test files for all components
- Add documentation

### Phase 2C (Enhancement)
- Add additional providers as needed
- Add additional policies as needed
- Refactor folders if needed (ADR required)

### Phase 3 (Expansion)
- Add new bounded contexts as separate folders
- Add shared components to common folder
- Refactor structure if needed (ADR required)
