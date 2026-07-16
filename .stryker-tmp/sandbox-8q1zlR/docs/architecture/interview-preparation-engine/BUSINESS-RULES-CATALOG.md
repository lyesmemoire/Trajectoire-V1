# Interview Preparation Engine - Business Rules Catalog

## Overview
This document defines all business rules for the Interview Preparation Engine. These rules are enforced by policies and domain services.

---

## Rule Categories

### 1. Quantity Rules
### 2. Duration Rules
### 3. Ordering Rules
### 4. Progression Rules
### 5. Balance Rules
### 6. Coverage Rules
### 7. Mandatory/Optional Rules
### 8. Adaptation Rules
### 9. Dependency Rules
### 10. Priority Rules

---

## 1. Quantity Rules

### BR-001: Minimum Total Questions
**Rule**: Interview plan must contain at least 10 questions
**Rationale**: Ensure comprehensive assessment
**Enforced By**: QuestionCountPolicy
**Violations**: Plan rejected if < 10 questions
**Exceptions**: None

### BR-002: Maximum Total Questions
**Rule**: Interview plan must not exceed 30 questions
**Rationale**: Prevent interview fatigue, maintain focus
**Enforced By**: QuestionCountPolicy
**Violations**: Plan rejected if > 30 questions
**Exceptions**: None

### BR-003: Minimum Questions Per Section
**Rule**: Each section must contain at least 3 questions
**Rationale**: Ensure adequate depth per topic
**Enforced By**: QuestionCountPolicy
**Violations**: Section rejected if < 3 questions
**Exceptions**: Introductory/outro sections (min 1 question)

### BR-004: Maximum Questions Per Section
**Rule**: Each section must not exceed 10 questions
**Rationale**: Maintain section focus, prevent topic fatigue
**Enforced By**: QuestionCountPolicy
**Violations**: Section rejected if > 10 questions
**Exceptions**: None

### BR-005: Mandatory Competency Questions
**Rule**: Each mandatory competency must have at least 2 questions
**Rationale**: Ensure adequate assessment of critical skills
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if mandatory competency has < 2 questions
**Exceptions**: None

---

## 2. Duration Rules

### BR-006: Maximum Total Duration
**Rule**: Interview plan must not exceed 90 minutes
**Rationale**: Standard interview duration, prevent fatigue
**Enforced By**: DurationPolicy
**Violations**: Plan rejected if > 90 minutes
**Exceptions**: None

### BR-007: Minimum Total Duration
**Rule**: Interview plan must be at least 30 minutes
**Rationale**: Ensure sufficient assessment time
**Enforced By**: DurationPolicy
**Violations**: Plan rejected if < 30 minutes
**Exceptions**: None

### BR-008: Maximum Question Duration
**Rule**: Individual question must not exceed 10 minutes
**Rationale**: Maintain pace, prevent rambling
**Enforced By**: DurationPolicy
**Violations**: Question rejected if > 10 minutes
**Exceptions**: Complex technical questions (max 15 minutes)

### BR-009: Minimum Question Duration
**Rule**: Individual question must be at least 2 minutes
**Rationale**: Allow time for thoughtful response
**Enforced By**: DurationPolicy
**Violations**: Question rejected if < 2 minutes
**Exceptions**: Quick verification questions (min 1 minute)

### BR-010: Preparation Time Allocation
**Rule**: Preparation time must be 20% of answer time
**Rationale**: Allow candidate to formulate response
**Enforced By**: TimingCalculationService
**Violations**: Timing rejected if ratio not met
**Exceptions**: None

---

## 3. Ordering Rules

### BR-011: Section Order
**Rule**: Sections must follow logical order: Introduction → Technical → Behavioral → Cultural → Closing
**Rationale**: Natural interview flow
**Enforced By**: QuestionOrderingService
**Violations**: Plan rejected if order violated
**Exceptions**: Custom order for specific interview types

### BR-012: Question Order Within Section
**Rule**: Questions must be ordered by difficulty (easy → hard)
**Rationale**: Build confidence, assess progression
**Enforced By**: QuestionOrderingService
**Violations**: Section rejected if order violated
**Exceptions**: Random order for adaptive interviews

### BR-013: Dependency Resolution
**Rule**: Questions with dependencies must appear after prerequisite questions
**Rationale**: Ensure logical flow
**Enforced By**: QuestionOrderingService
**Violations**: Plan rejected if dependency violated
**Exceptions**: None

### BR-014: No Circular Dependencies
**Rule**: Questions must not have circular dependencies
**Rationale**: Prevent infinite loops
**Enforced By**: QuestionOrderingService
**Violations**: Plan rejected if circular dependency detected
**Exceptions**: None

---

## 4. Progression Rules

### BR-015: Difficulty Progression
**Rule**: Difficulty must progress gradually (max 1 level jump)
**Rationale**: Smooth difficulty curve
**Enforced By**: DifficultyPolicy
**Violations**: Plan rejected if jump > 1 level
**Exceptions**: Expert-level interviews (max 2 level jumps)

### BR-016: Topic Progression
**Rule**: Topics must progress from general to specific
**Rationale**: Build understanding before depth
**Enforced By**: QuestionOrderingService
**Violations**: Plan rejected if topic regression detected
**Exceptions**: None

### BR-017: Complexity Progression
**Rule**: Question complexity must increase over time
**Rationale**: Assess candidate's ability to handle complexity
**Enforced By**: DifficultyPolicy
**Violations**: Plan rejected if complexity regression detected
**Exceptions**: None

---

## 5. Balance Rules

### BR-018: Soft Skills vs Hard Skills Balance
**Rule**: Soft skills questions must be 40-60% of total questions
**Rationale**: Balanced assessment
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if ratio outside 40-60%
**Exceptions**: Technical interviews (20-40% soft skills)

### BR-019: Technical vs Behavioral Balance
**Rule**: Technical questions must be 50-70% of total questions
**Rationale**: Focus on job requirements
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if ratio outside 50-70%
**Exceptions**: Management interviews (30-50% technical)

### BR-020: Section Duration Balance
**Rule**: No section should exceed 40% of total duration
**Rationale**: Balanced coverage
**Enforced By**: DurationPolicy
**Violations**: Plan rejected if section > 40% duration
**Exceptions**: Technical interviews (max 50% for technical section)

### BR-021: Question Type Distribution
**Rule**: Each question type must be represented (technical, behavioral, situational)
**Rationale**: Comprehensive assessment
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if type missing
**Exceptions**: Specialized interviews (e.g., pure technical)

---

## 6. Coverage Rules

### BR-022: Mandatory Competency Coverage
**Rule**: All mandatory competencies must be covered at 80%+
**Rationale**: Ensure critical skill assessment
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if mandatory competency < 80% coverage
**Exceptions**: None

### BR-023: Optional Competency Coverage
**Rule**: Optional competencies should be covered at 50%+
**Rationale**: Bonus points for additional coverage
**Enforced By**: CoveragePolicy
**Violations**: Warning if optional competency < 50% coverage
**Exceptions**: Time constraints

### BR-024: Job Requirement Coverage
**Rule**: All job requirements must be addressed
**Rationale**: Ensure job relevance
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if requirement not addressed
**Exceptions**: Requirements marked as "nice to have"

### BR-025: Candidate Strength Coverage
**Rule**: Candidate's top 3 strengths must be covered
**Rationale**: Validate claimed strengths
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if strength not covered
**Exceptions**: None

### BR-026: Candidate Weakness Coverage
**Rule**: Candidate's identified weaknesses must be covered
**Rationale**: Assess improvement areas
**Enforced By**: CoveragePolicy
**Violations**: Plan rejected if weakness not covered
**Exceptions**: Weaknesses marked as "minor"

---

## 7. Mandatory/Optional Rules

### BR-027: Mandatory Questions
**Rule**: Questions marked as mandatory must be included
**Rationale**: Ensure critical assessment
**Enforced By**: QuestionCountPolicy
**Violations**: Plan rejected if mandatory question missing
**Exceptions**: None

### BR-028: Optional Questions
**Rule**: Optional questions may be included if time permits
**Rationale**: Flexibility for time management
**Enforced By**: QuestionCountPolicy
**Violations**: None (optional)
**Exceptions**: None

### BR-029: Conditional Questions
**Rule**: Conditional questions are included only if conditions met
**Rationale**: Adaptive questioning
**Enforced By**: AdaptiveRules
**Violations**: None (conditional)
**Exceptions**: None

---

## 8. Adaptation Rules

### BR-030: Candidate Level Adaptation
**Rule**: Question difficulty must match candidate's skill level
**Rationale**: Appropriate challenge level
**Enforced By**: DifficultyAdjustmentService
**Violations**: Plan rejected if difficulty mismatch
**Exceptions**: Stretch questions (1 level above)

### BR-031: Job Level Adaptation
**Rule**: Question difficulty must match job's required level
**Rationale**: Job-appropriate assessment
**Enforced By**: DifficultyAdjustmentService
**Violations**: Plan rejected if difficulty mismatch
**Exceptions**: None

### BR-032: Dynamic Difficulty Adjustment
**Rule**: Difficulty adjusts based on candidate performance
**Rationale**: Adaptive assessment
**Enforced By**: AdaptiveRules
**Violations**: None (adaptive)
**Exceptions**: Fixed-difficulty interviews

### BR-033: Topic Adaptation
**Rule**: Topics adapt based on candidate's background
**Rationale**: Relevant assessment
**Enforced By**: AdaptiveRules
**Violations**: None (adaptive)
**Exceptions**: Standardized interviews

### BR-034: Timing Adaptation
**Rule**: Time allocation adapts based on question complexity
**Rationale**: Fair time distribution
**Enforced By**: TimingCalculationService
**Violations**: None (adaptive)
**Exceptions**: Fixed-timing interviews

---

## 9. Dependency Rules

### BR-035: Prerequisite Questions
**Rule**: Prerequisite questions must be answered before dependent questions
**Rationale**: Build knowledge foundation
**Enforced By**: QuestionDependencies
**Violations**: Dependent question skipped if prerequisite not answered
**Exceptions**: None

### BR-036: Score-Based Dependencies
**Rule**: Dependent questions require minimum score on prerequisite
**Rationale**: Ensure competence before advancing
**Enforced By**: QuestionDependencies
**Violations**: Dependent question skipped if score threshold not met
**Exceptions**: None

### BR-037: Mutually Exclusive Questions
**Rule**: Mutually exclusive questions cannot both be asked
**Rationale**: Avoid redundancy
**Enforced By**: QuestionDependencies
**Violations**: First question asked, second skipped
**Exceptions**: None

### BR-038: Sequential Dependencies
**Rule**: Sequential questions must be asked in order
**Rationale**: Logical flow
**Enforced By**: QuestionDependencies
**Violations**: Out-of-order question skipped
**Exceptions**: None

---

## 10. Priority Rules

### BR-039: Critical Competency Priority
**Rule**: Critical competencies have highest priority for question allocation
**Rationale**: Focus on most important skills
**Enforced By**: CoveragePolicy
**Violations**: None (priority)
**Exceptions**: None

### BR-040: Job Requirement Priority
**Rule**: Job requirements have higher priority than optional competencies
**Rationale**: Job relevance
**Enforced By**: CoveragePolicy
**Violations**: None (priority)
**Exceptions**: None

### BR-041: Candidate Gap Priority
**Rule**: Candidate's skill gaps have higher priority
**Rationale**: Address weaknesses
**Enforced By**: CoveragePolicy
**Violations**: None (priority)
**Exceptions**: None

### BR-042: Mandatory Section Priority
**Rule**: Mandatory sections are prioritized over optional sections
**Rationale**: Ensure core coverage
**Enforced By**: QuestionOrderingService
**Violations**: None (priority)
**Exceptions**: None

---

## Rule Enforcement

### Policy-Based Enforcement
- QuestionCountPolicy: BR-001, BR-002, BR-003, BR-004, BR-005, BR-027, BR-028
- DurationPolicy: BR-006, BR-007, BR-008, BR-009
- DifficultyPolicy: BR-015, BR-017
- CoveragePolicy: BR-018, BR-019, BR-021, BR-022, BR-023, BR-024, BR-025, BR-026, BR-039, BR-040, BR-041, BR-042

### Service-Based Enforcement
- QuestionOrderingService: BR-011, BR-012, BR-013, BR-014, BR-016, BR-038
- DifficultyAdjustmentService: BR-030, BR-031
- TimingCalculationService: BR-010, BR-034
- CoverageAnalysisService: BR-022, BR-023, BR-024, BR-025, BR-026

### Aggregate-Based Enforcement
- InterviewPlan aggregate enforces invariants
- InterviewSection aggregate enforces section-level rules
- InterviewQuestion aggregate enforces question-level rules

---

## Rule Violation Handling

### Critical Violations (Plan Rejected)
- BR-001, BR-002, BR-005, BR-006, BR-007, BR-011, BR-013, BR-014, BR-022, BR-024, BR-025, BR-027, BR-030, BR-031

### Warning Violations (Plan Accepted with Warning)
- BR-023, BR-026, BR-020 (if slightly over)

### Adaptive Violations (Handled by Adaptation)
- BR-032, BR-033, BR-034

### Priority Violations (Handled by Reordering)
- BR-039, BR-040, BR-041, BR-042

---

## Rule Configuration

### Configurable Rules
- Question count limits (min/max)
- Duration limits (min/max)
- Soft/hard skills ratio
- Coverage thresholds
- Difficulty progression settings

### Fixed Rules
- Circular dependency prohibition
- Mandatory competency coverage
- Dependency resolution order

### Environment-Specific Rules
- Technical interview adjustments
- Management interview adjustments
- Entry-level interview adjustments
- Expert interview adjustments

---

## Rule Validation

### Validation Points
- Plan generation (initial validation)
- Plan modification (incremental validation)
- Plan approval (final validation)
- Plan execution (runtime validation)

### Validation Results
- VALID: All rules passed
- INVALID: Critical rule failed
- WARNING: Non-critical rule failed
- ADAPTIVE: Rule handled by adaptation

---

## Rule Evolution

### Versioning
- Each rule has a version number
- Rule changes tracked in ADR
- Backward compatibility maintained where possible

### Deprecation
- Deprecated rules marked for removal
- Grace period for migration
- Clear communication of changes

### Addition
- New rules added via ADR
- Impact analysis performed
- Implementation phased if needed
