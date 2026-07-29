# Blueprint DSL Specification

## Metadata

**Document ID** : BLUEPRINT-DSL  
**Title** : Blueprint Domain Specific Language Specification  
**Version** : 1.0.0  
**Status** : Draft  
**Type** : Language Specification  
**Category** : Blueprint Foundation  
**Created** : 2024-01-23  
**Author** : Distinguished Engineer  
**Purpose** : Define the official Domain Specific Language for Blueprint V3 Enterprise specifications  

---

## 1. Purpose

The Blueprint DSL (Domain Specific Language) is the official language for defining Blueprint V3 Enterprise specifications. It provides a structured, type-safe, and compilable way to define recruitment intelligence, cognitive runtime, AI runtime, event runtime, configuration compiler, observability, security, and operations components.

The DSL is designed to be:
- **Expressive**: Capable of expressing complex recruitment logic
- **Type-safe**: All structures are strongly typed
- **Compilable**: Transforms into multiple runtime artifacts
- **Validatable**: Schema-based validation at compile time
- **Extensible**: Supports custom extensions and plugins
- **Documentable**: Self-documenting with inline documentation

---

## 2. Language Overview

### 2.1 Design Philosophy

**Declarative**: The DSL is declarative, not imperative. You define what you want, not how to achieve it.

**Composable**: All DSL structures are composable from smaller building blocks.

**Hierarchical**: DSL structures form a natural hierarchy from high-level concepts to low-level details.

**Schema-Driven**: All DSL structures have associated schemas for validation.

**Runtime-Independent**: The DSL is independent of any specific runtime or provider.

### 2.2 Language Characteristics

**Format**: YAML (primary), JSON (alternative)

**Type System**: Strong typing with custom types

**Validation**: Schema-based validation with custom validators

**Compilation**: Multi-target compilation to various artifacts

**Extensibility**: Plugin system for custom types and validators

### 2.3 Target Artifacts

The DSL compiles to:
- TypeScript contracts
- JSON Schema
- YAML configurations
- OpenAPI specifications
- AsyncAPI specifications
- Avro schemas
- Protocol Buffers
- Neo4j graph structures
- Redis configurations
- Supabase configurations
- SQL migrations
- Event contracts
- Test suites
- Documentation

---

## 3. Core Types

### 3.1 Primitive Types

```yaml
# String
type: string
example: "backend.architecture"

# Integer
type: integer
example: 42

# Float
type: float
example: 0.82

# Boolean
type: boolean
example: true

# Enum
type: enum
values: [low, medium, high]
example: high

# Array
type: array
itemType: string
example: ["challenge", "contradiction", "scaling"]

# Map
type: map
keyType: string
valueType: any
example: { "min": 4, "confidence": 0.82 }

# Timestamp
type: timestamp
example: "2024-01-23T12:00:00Z"

# Duration
type: duration
example: "30s"

# Reference
type: reference
target: competency
example: backend.architecture
```

### 3.2 Composite Types

```yaml
# Competency Definition
competency:
  id: backend.architecture
  name: Backend Architecture
  description: Design and implement scalable backend systems
  category: technical
  level: senior
  weight: 0.8
  evidence:
    min: 4
    confidence: 0.82
  strategies:
    - challenge
    - contradiction
    - scaling
    - optimization
  followups:
    automatic: true
    types:
      - evidence
      - metrics
      - ownership
  scoring:
    method: weighted
    weights:
      technical: 0.6
      communication: 0.2
      leadership: 0.2
  exit:
    condition: confidence > 0.88
    action: conclude

# Cognitive Principle
principle:
  id: CP-001
  name: Evidence-First Evaluation
  category: evidence
  priority: critical
  description: Every evaluation MUST be based on collected evidence
  businessRationale: Prevents bias, ensures defensibility
  executionRule:
    - evaluation SHALL NOT occur without minimum evidence threshold
    - evidence MUST be categorized by type and strength
    - contradictory evidence MUST trigger re-evaluation
  failureMode: insufficient evidence for evaluation
  runtimeConsequence: evaluation deferred, additional questions generated
  examples:
    - scenario: competency evaluation with sufficient evidence
      action: proceed with evaluation
    - scenario: competency evaluation with insufficient evidence
      action: defer evaluation, collect more evidence
  counterExamples:
    - scenario: evaluation without evidence
      action: forbidden, principle violation

# Business Rule
rule:
  id: BR-001
  name: Minimum Evidence Threshold
  category: evidence
  statement: Each competency MUST have minimum evidence threshold before evaluation
  threshold:
    strong: 3
    moderate: 5
    weak: 7
  calculation: 3 strong OR 5 moderate OR 7 weak evidence items
  validation: evidence count meets threshold
  enforcement: block evaluation until threshold met
  exception: competency is optional for role
  examples:
    - scenario: competency with 3 strong evidence
      action: evaluation permitted
    - scenario: competency with 1 weak evidence
      action: evaluation blocked
  counterExamples:
    - scenario: evaluation with insufficient evidence
      action: rule violation

# Runtime Invariant
invariant:
  id: INV-001
  name: Single Active Question
  category: conversation
  statement: At most one primary question SHALL be active at any time
  violationDetection: count active questions, must be ≤ 1
  recovery: queue secondary questions, maintain primary
  runtimeConsequence: question queue management
  monitoring:
    enabled: true
    interval: 1000
    alertThreshold: 2

# Forbidden Behavior
forbidden:
  id: FB-001
  name: Multiple Active Questions
  category: conversation
  prohibitionLevel: absolute
  description: Presenting multiple primary questions simultaneously
  detection: active question count > 1
  consequence: system error, session pause
  recovery: queue secondary questions
  examples:
    - scenario: attempt to present two questions
      action: block, queue second question
  counterExamples:
    - scenario: single active question
      action: permitted

# Decision Heuristic
heuristic:
  id: H-001
  name: Rapid Response Expertise
  category: evidence
  condition:
    - responseLatency < 2000
    - precision > 0.9
  heuristic: expertise probable
  confidence: 0.8
  applicability: technical questions
  examples:
    - scenario: rapid, precise technical answer
      action: increase expertise confidence
    - scenario: rapid, imprecise technical answer
      action: do not increase expertise confidence
  counterExamples:
    - scenario: slow response
      action: heuristic not applicable

# Conversation Pattern
pattern:
  id: PAT-001
  name: Leadership Pattern
  category: leadership
  description: Pattern for assessing leadership capabilities
  triggerConditions:
    - competency: leadership
    - context: team management
  patternSteps:
    - step: 1
      action: ask about team size
      expected: specific number
    - step: 2
      action: ask about team challenges
      expected: specific challenges
    - step: 3
      action: ask about conflict resolution
      expected: specific resolution approach
    - step: 4
      action: ask about team outcomes
      expected: measurable outcomes
  exitConditions:
    - condition: all steps completed with specific answers
      action: pattern complete
    - condition: any step with vague answer
      action: trigger clarification pattern
  examples:
    - scenario: candidate provides specific team details
      action: proceed through pattern
    - scenario: candidate provides vague team details
      action: trigger clarification
  counterExamples:
    - scenario: pattern applied to non-leadership competency
      action: pattern mismatch

# Evaluation Pattern
evaluationPattern:
  id: EPAT-001
  name: Technical Depth Evaluation
  category: technical
  competency: technical_depth
  evaluationCriteria:
    - criterion: knowledge depth
      weight: 0.4
      evidenceTypes: [direct, behavioral]
    - criterion: practical application
      weight: 0.3
      evidenceTypes: [behavioral, inferred]
    - criterion: problem solving
      weight: 0.3
      evidenceTypes: [behavioral, inferred]
  evidenceRequirements:
    - type: direct
      min: 2
      strength: strong
    - type: behavioral
      min: 3
      strength: moderate
  scoringAlgorithm: weighted
  examples:
    - scenario: strong direct evidence, moderate behavioral evidence
      action: calculate weighted score
    - scenario: weak evidence only
      action: insufficient evidence, collect more
  counterExamples:
    - scenario: evaluation without evidence
      action: evaluation not permitted

# State Machine
stateMachine:
  id: SM-001
  name: Conversation State Machine
  category: conversation
  states:
    - id: IDLE
      entry: none
      exit: initialize session
      timeout: none
      recovery: none
    - id: INTRODUCTION
      entry: greet candidate, explain process
      exit: begin questioning
      timeout: 300
      recovery: reintroduce
    - id: QUESTIONING
      entry: present question
      exit: process answer
      timeout: 120
      recovery: rephrase or move on
    - id: RELANCE
      entry: present follow-up
      exit: process answer
      timeout: 90
      recovery: abandon relance
    - id: TRANSITION
      entry: present transition
      exit: begin new topic
      timeout: 60
      recovery: re-state transition
    - id: EVALUATION
      entry: evaluate evidence
      exit: determine next action
      timeout: 30
      recovery: use cached evaluation
    - id: CONCLUSION
      entry: present summary
      exit: end session
      timeout: 120
      recovery: skip summary
    - id: TERMINATED
      entry: cleanup session
      exit: none
      timeout: none
      recovery: none
  transitions:
    - from: IDLE
      to: INTRODUCTION
      trigger: session start
    - from: INTRODUCTION
      to: QUESTIONING
      trigger: setup complete
    - from: QUESTIONING
      to: RELANCE
      trigger: follow-up needed
    - from: QUESTIONING
      to: TRANSITION
      trigger: topic change needed
    - from: QUESTIONING
      to: EVALUATION
      trigger: evidence sufficient
    - from: RELANCE
      to: QUESTIONING
      trigger: follow-up complete
    - from: RELANCE
      to: TRANSITION
      trigger: topic change needed
    - from: TRANSITION
      to: QUESTIONING
      trigger: transition complete
    - from: EVALUATION
      to: QUESTIONING
      trigger: more evidence needed
    - from: EVALUATION
      to: CONCLUSION
      trigger: evaluation complete
    - from: CONCLUSION
      to: TERMINATED
      trigger: session complete
    - from: any
      to: TERMINATED
      trigger: error or cancellation
```

### 3.3 Graph Types

```yaml
# Competency Graph
competencyGraph:
  id: CG-001
  name: Competency Graph
  description: Graph of competency relationships and influences
  nodes:
    - id: backend.architecture
      type: competency
      properties:
        name: Backend Architecture
        category: technical
        level: senior
        weight: 0.8
    - id: frontend.development
      type: competency
      properties:
        name: Frontend Development
        category: technical
        level: mid
        weight: 0.6
    - id: system.design
      type: competency
      properties:
        name: System Design
        category: technical
        level: senior
        weight: 0.9
  edges:
    - from: backend.architecture
      to: system.design
      type: influences
      weight: 0.7
      properties:
        rationale: backend architecture requires system design skills
    - from: frontend.development
      to: system.design
      type: influences
      weight: 0.5
      properties:
        rationale: frontend development contributes to system design
  algorithms:
    - name: influence_propagation
      description: Propagate competency influences through graph
    - name: dependency_analysis
      description: Analyze competency dependencies
  queries:
    - name: get_influenced_competencies
      description: Get competencies influenced by a given competency
    - name: get_dependency_chain
      description: Get dependency chain for a competency
  updates:
    - name: add_competency
      description: Add a new competency to the graph
    - name: update_influence
      description: Update influence weight between competencies
  visualization:
    layout: force_directed
    nodeSize: weight
    edgeWidth: weight
    color: category

# Knowledge Graph
knowledgeGraph:
  id: KG-001
  name: Candidate Knowledge Graph
  description: Graph of candidate's professional knowledge and experience
  nodes:
    - id: project.microservices
      type: project
      properties:
        name: Microservices Architecture
        role: Lead Architect
        duration: 18 months
        teamSize: 8
    - id: technology.react
      type: technology
      properties:
        name: React
        experience: 3 years
        proficiency: expert
    - id: company.techcorp
      type: company
      properties:
        name: TechCorp
        industry: Technology
        size: 500-1000
  edges:
    - from: project.microservices
      to: technology.react
      type: uses
      properties:
        context: Frontend implementation
    - from: project.microservices
      to: company.techcorp
      type: at
      properties:
        role: Lead Architect
        duration: 18 months
  algorithms:
    - name: experience_aggregation
      description: Aggregate experience across projects
    - name: skill_validation
      description: Validate skill claims against project evidence
  queries:
    - name: get_technology_experience
      description: Get experience for a specific technology
    - name: get_project_timeline
      description: Get timeline of projects
  updates:
    - name: add_project
      description: Add a new project to the graph
    - name: update_technology
      description: Update technology proficiency
  visualization:
    layout: hierarchical
    nodeSize: duration
    edgeType: relationship

# Decision Graph
decisionGraph:
  id: DG-001
  name: Decision Graph
  description: Graph of decision logic and branching
  nodes:
    - id: decision.evidence_sufficient
      type: decision
      properties:
        condition: evidence coverage >= threshold
        truePath: decision.evaluate
        falsePath: decision.collect_more_evidence
    - id: decision.evaluate
      type: action
      properties:
        action: evaluate competency
        output: evaluation_result
    - id: decision.collect_more_evidence
      type: action
      properties:
        action: generate follow-up question
        output: new_question
  edges:
    - from: decision.evidence_sufficient
      to: decision.evaluate
      type: true_path
    - from: decision.evidence_sufficient
      to: decision.collect_more_evidence
      type: false_path
  algorithms:
    - name: decision_traversal
      description: Traverse decision graph based on conditions
    - name: path_optimization
      description: Optimize decision path for efficiency
  queries:
    - name: get_decision_path
      description: Get decision path for given conditions
    - name: get_all_paths
      description: Get all possible decision paths
  updates:
    - name: add_decision
      description: Add a new decision node
    - name: update_condition
      description: Update decision condition
  visualization:
    layout: tree
    nodeType: decision_type
    edgeType: path_type
```

---

## 4. DSL Structure

### 4.1 Document Structure

```yaml
# Blueprint DSL Document
blueprint:
  version: "1.0.0"
  specId: RIK-001
  specType: recruitment_intelligence
  specName: Recruitment Intelligence Foundation
  
  metadata:
    author: Distinguished Engineer
    created: "2024-01-23T12:00:00Z"
    updated: "2024-01-23T12:00:00Z"
    status: draft
    
  dependencies:
    - specId: ETS-026
      version: "1.0.0"
    - specId: RIK-Recruitment_Intelligence_Kernel
      version: "1.0.0"
  
  imports:
    - from: common.types
      items: [CompetencyType, EvidenceType, ConfidenceLevel]
    - from: runtime.state
      items: [SessionState, ConversationState]
  
  exports:
    - RecruitmentIntelligenceFoundation
    - CorePrinciple
    - CognitiveRule
    - RuntimeInvariant
    - ForbiddenBehavior
    - BusinessRule
  
  definitions:
    competencies: [...]
    principles: [...]
    cognitiveRules: [...]
    invariants: [...]
    forbiddenBehaviors: [...]
    businessRules: [...]
    heuristics: [...]
    patterns: [...]
    evaluationPatterns: [...]
    stateMachines: [...]
    graphs: [...]
  
  configuration:
    runtime:
      evaluation:
        minEvidenceThreshold:
          strong: 3
          moderate: 5
          weak: 7
    conversation:
      questionManagement:
        maxActiveQuestions: 1
    cognitive:
      reasoning:
        confidenceThreshold: 0.7
  
  compilation:
    targets:
      - typescript
      - json_schema
      - yaml
      - openapi
      - asyncapi
      - avro
      - protobuf
      - neo4j
      - redis
      - supabase
      - sql
      - events
      - tests
      - documentation
    
    optimization:
      enabled: true
      level: aggressive
      
    validation:
      enabled: true
      strict: true
      
    generation:
      tests: true
      documentation: true
      examples: true
```

### 4.2 Type Definitions

```yaml
# Type Definition
typeDefinition:
  name: CompetencyType
  description: Type of competency
  type: enum
  values:
    - value: technical_depth
      description: Technical knowledge and skills
    - value: problem_solving
      description: Problem-solving capabilities
    - value: system_design
      description: System design skills
    - value: communication
      description: Communication skills
    - value: leadership
      description: Leadership capabilities
    - value: adaptability
      description: Adaptability to change
    - value: collaboration
      description: Collaboration skills
    - value: learning
      description: Learning ability
    - value: ownership
      description: Ownership and accountability
    - value: delivery
      description: Delivery and execution
  defaultValue: technical_depth
  validation:
    required: true
    pattern: "^[a-z_]+$"
```

### 4.3 Interface Definitions

```yaml
# Interface Definition
interfaceDefinition:
  name: Evidence
  description: Evidence collected during interview
  properties:
    - name: id
      type: string
      required: true
      description: Unique identifier for evidence
    - name: competency
      type: CompetencyType
      required: true
      description: Competency this evidence relates to
    - name: criterion
      type: string
      required: true
      description: Evaluation criterion this evidence addresses
    - name: type
      type: EvidenceType
      required: true
      description: Type of evidence
    - name: strength
      type: EvidenceStrength
      required: true
      description: Strength of evidence
    - name: source
      type: EvidenceSource
      required: true
      description: Source of evidence
    - name: content
      type: string
      required: true
      description: Content of the evidence
    - name: context
      type: EvidenceContext
      required: false
      description: Context in which the evidence was collected
    - name: validation
      type: EvidenceValidation
      required: false
      description: Validation status of the evidence
    - name: timestamp
      type: timestamp
      required: true
      description: When the evidence was collected
  methods:
    - name: validate
      returnType: boolean
      description: Validate the evidence
    - name: calculateStrength
      returnType: number
      description: Calculate evidence strength score
    - name: isContradictory
      parameters:
        - name: other
          type: Evidence
      returnType: boolean
      description: Check if this evidence contradicts another
```

### 4.4 Enum Definitions

```yaml
# Enum Definition
enumDefinition:
  name: EvidenceType
  description: Types of evidence that can be collected
  values:
    - value: technical_knowledge
      description: Direct technical knowledge demonstrated
    - value: practical_application
      description: Practical application of skills
    - value: problem_solving
      description: Problem-solving capabilities shown
    - value: communication
      description: Communication skills demonstrated
    - value: leadership
      description: Leadership capabilities shown
    - value: adaptability
      description: Adaptability to change demonstrated
  defaultValue: technical_knowledge
```

---

## 5. DSL Grammar

### 5.1 BNF Grammar

```
<document> ::= "blueprint:" <version> <specId> <specType> <specName> <metadata> <dependencies> <imports> <exports> <definitions> <configuration> <compilation>

<version> ::= "version:" <string>
<specId> ::= "specId:" <identifier>
<specType> ::= "specType:" <identifier>
<specName> ::= "specName:" <string>

<metadata> ::= "metadata:" <author> <created> <updated> <status>
<author> ::= "author:" <string>
<created> ::= "created:" <timestamp>
<updated> ::= "updated:" <timestamp>
<status> ::= "status:" <status_value>

<dependencies> ::= "dependencies:" <dependency_list>
<dependency_list> ::= <dependency> | <dependency> <dependency_list>
<dependency> ::= "-" <specId> <version>

<imports> ::= "imports:" <import_list>
<import_list> ::= <import> | <import> <import_list>
<import> ::= "-" "from:" <identifier> "items:" <item_list>

<exports> ::= "exports:" <export_list>
<export_list> ::= <export> | <export> <export_list>
<export> ::= "-" <identifier>

<definitions> ::= "definitions:" <definition_list>
<definition_list> ::= <definition> | <definition> <definition_list>
<definition> ::= <competency> | <principle> | <rule> | <invariant> | <forbidden> | <heuristic> | <pattern> | <evaluationPattern> | <stateMachine> | <graph>

<configuration> ::= "configuration:" <config_section_list>
<config_section_list> ::= <config_section> | <config_section> <config_section_list>

<compilation> ::= "compilation:" <targets> <optimization> <validation> <generation>
```

### 5.2 Type System

```yaml
# Type System Definition
typeSystem:
  primitiveTypes:
    - string
    - integer
    - float
    - boolean
    - timestamp
    - duration
  
  compositeTypes:
    - array
    - map
    - enum
    - reference
  
  customTypes:
    - CompetencyType
    - EvidenceType
    - EvidenceStrength
    - ConfidenceLevel
    - PriorityLevel
    - ProhibitionLevel
  
  typeValidation:
    strict: true
    coercion: false
    defaults: true
```

---

## 6. Compilation Rules

### 6.1 TypeScript Generation

```yaml
# TypeScript Compilation Rules
typescriptCompilation:
  outputDirectory: src/types
  namingConvention: PascalCase
  filePerType: true
  generateInterfaces: true
  generateTypes: true
  generateEnums: true
  generateValidators: true
  generateFactories: true
  
  transformations:
    - from: competency
      to: interface
      template: |
        interface {{name}} {
          id: string;
          name: string;
          description: string;
          category: CompetencyCategory;
          level: CompetencyLevel;
          weight: number;
          evidence: EvidenceRequirements;
          strategies: Strategy[];
          followups: FollowupConfig;
          scoring: ScoringConfig;
          exit: ExitCondition;
        }
    
    - from: principle
      to: interface
      template: |
        interface CorePrinciple {
          id: string;
          name: string;
          description: string;
          businessRationale: string;
          executionRule: string[];
          failureMode: string;
          runtimeConsequence: string;
        }
```

### 6.2 JSON Schema Generation

```yaml
# JSON Schema Compilation Rules
jsonSchemaCompilation:
  outputDirectory: schemas
  schemaVersion: draft-07
  generateDescriptions: true
  generateExamples: true
  generateValidators: true
  
  transformations:
    - from: competency
      to: schema
      template: |
        {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "type": "object",
          "properties": {
            "id": {"type": "string"},
            "name": {"type": "string"},
            "description": {"type": "string"},
            "category": {"type": "string", "enum": ["technical", "behavioral", "leadership"]},
            "level": {"type": "string", "enum": ["junior", "mid", "senior", "principal"]},
            "weight": {"type": "number", "minimum": 0, "maximum": 1}
          },
          "required": ["id", "name", "description", "category", "level", "weight"]
        }
```

### 6.3 YAML Configuration Generation

```yaml
# YAML Compilation Rules
yamlCompilation:
  outputDirectory: config
  nestingStrategy: flat
  generateComments: true
  generateDefaults: true
  
  transformations:
    - from: configuration
      to: yaml
      template: |
        runtime:
          evaluation:
            minEvidenceThreshold:
              strong: {{minEvidenceThreshold.strong}}
              moderate: {{minEvidenceThreshold.moderate}}
              weak: {{minEvidenceThreshold.weak}}
```

### 6.4 OpenAPI Generation

```yaml
# OpenAPI Compilation Rules
openapiCompilation:
  outputDirectory: api
  openapiVersion: 3.0.0
  generatePaths: true
  generateComponents: true
  generateExamples: true
  
  transformations:
    - from: interface
      to: path
      template: |
        /{{name}}:
          get:
            summary: Get {{name}}
            responses:
              200:
                description: Successful response
                content:
                  application/json:
                    schema:
                      $ref: '#/components/schemas/{{name}}'
```

### 6.5 Neo4j Graph Generation

```yaml
# Neo4j Compilation Rules
neo4jCompilation:
  outputDirectory: graphs
  generateNodes: true
  generateEdges: true
  generateIndexes: true
  generateConstraints: true
  
  transformations:
    - from: competencyGraph
      to: cypher
      template: |
        CREATE (c:Competency {id: '{{id}}', name: '{{name}}', category: '{{category}}', weight: {{weight}})
        CREATE (c)-[:INFLUENCES {weight: {{weight}}}]->(target)
```

---

## 7. Validation Rules

### 7.1 Syntax Validation

```yaml
# Syntax Validation Rules
syntaxValidation:
  enabled: true
  strict: true
  
  rules:
    - rule: valid_yaml
      description: Document must be valid YAML
      severity: error
    
    - rule: required_sections
      description: All required sections must be present
      required:
        - blueprint
        - metadata
        - definitions
        - configuration
      severity: error
    
    - rule: valid_identifiers
      description: All identifiers must be valid
      pattern: "^[a-z][a-z0-9_]*$"
      severity: error
    
    - rule: valid_references
      description: All references must be resolvable
      severity: error
```

### 7.2 Semantic Validation

```yaml
# Semantic Validation Rules
semanticValidation:
  enabled: true
  strict: true
  
  rules:
    - rule: type_consistency
      description: All types must be consistent
      severity: error
    
    - rule: dependency_resolution
      description: All dependencies must be resolvable
      severity: error
    
    - rule: no_circular_dependencies
      description: No circular dependencies allowed
      severity: error
    
    - rule: interface_completeness
      description: All interfaces must be complete
      severity: error
```

### 7.3 Business Validation

```yaml
# Business Validation Rules
businessValidation:
  enabled: true
  strict: true
  
  rules:
    - rule: principle_completeness
      description: All principles must have complete metadata
      required:
        - id
        - name
        - description
        - businessRationale
        - executionRule
        - failureMode
        - runtimeConsequence
      severity: error
    
    - rule: rule_completeness
      description: All rules must have complete metadata
      required:
        - id
        - statement
        - enforcement
      severity: error
    
    - rule: invariant_completeness
      description: All invariants must have complete metadata
      required:
        - id
        - statement
        - violationDetection
        - recovery
        - runtimeConsequence
      severity: error
```

---

## 8. Extension Points

### 8.1 Custom Types

```yaml
# Custom Type Definition
customType:
  name: CustomCompetencyScore
  baseType: float
  validation:
    min: 0
    max: 100
    step: 0.1
  description: Custom competency score with precision
```

### 8.2 Custom Validators

```yaml
# Custom Validator Definition
customValidator:
  name: evidenceThresholdValidator
  type: competency
  implementation: |
    function validate(competency) {
      return competency.evidence.min >= 3;
    }
  description: Validates that competency has minimum evidence threshold
```

### 8.3 Custom Generators

```yaml
# Custom Generator Definition
customGenerator:
  name: customGraphGenerator
  inputType: competencyGraph
  outputType: custom_graph
  implementation: |
    function generate(graph) {
      // Custom graph generation logic
      return customGraph;
    }
  description: Custom graph generator for specific use case
```

---

## 9. Tooling

### 9.1 DSL Parser

```yaml
# DSL Parser Configuration
parser:
  implementation: yaml
  validation: true
  errorHandling: strict
  recovery: none
  
  features:
    - include_directives
    - variable_substitution
    - conditional_inclusion
    - macro_expansion
```

### 9.2 DSL Validator

```yaml
# DSL Validator Configuration
validator:
  syntax: true
  semantic: true
  business: true
  strict: true
  
  reporting:
    format: json
    detailed: true
    suggestions: true
```

### 9.3 DSL Compiler

```yaml
# DSL Compiler Configuration
compiler:
  targets:
    - typescript
    - json_schema
    - yaml
    - openapi
    - asyncapi
    - avro
    - protobuf
    - neo4j
    - redis
    - supabase
    - sql
    - events
    - tests
    - documentation
  
  optimization:
    enabled: true
    level: aggressive
    
  validation:
    enabled: true
    strict: true
    
  generation:
    tests: true
    documentation: true
    examples: true
```

---

## 10. Examples

### 10.1 Complete Example

```yaml
blueprint:
  version: "1.0.0"
  specId: RIK-001
  specType: recruitment_intelligence
  specName: Recruitment Intelligence Foundation
  
  metadata:
    author: Distinguished Engineer
    created: "2024-01-23T12:00:00Z"
    updated: "2024-01-23T12:00:00Z"
    status: draft
  
  dependencies:
    - specId: ETS-026
      version: "1.0.0"
  
  imports:
    - from: common.types
      items: [CompetencyType, EvidenceType]
  
  exports:
    - RecruitmentIntelligenceFoundation
    - CorePrinciple
    - CognitiveRule
  
  definitions:
    competencies:
      - id: backend.architecture
        name: Backend Architecture
        description: Design and implement scalable backend systems
        category: technical
        level: senior
        weight: 0.8
        evidence:
          min: 4
          confidence: 0.82
        strategies:
          - challenge
          - contradiction
          - scaling
          - optimization
        followups:
          automatic: true
          types:
            - evidence
            - metrics
            - ownership
        scoring:
          method: weighted
          weights:
            technical: 0.6
            communication: 0.2
            leadership: 0.2
        exit:
          condition: confidence > 0.88
          action: conclude
    
    principles:
      - id: CP-001
        name: Evidence-First Evaluation
        category: evidence
        priority: critical
        description: Every evaluation MUST be based on collected evidence
        businessRationale: Prevents bias, ensures defensibility
        executionRule:
          - evaluation SHALL NOT occur without minimum evidence threshold
          - evidence MUST be categorized by type and strength
          - contradictory evidence MUST trigger re-evaluation
        failureMode: insufficient evidence for evaluation
        runtimeConsequence: evaluation deferred, additional questions generated
        examples:
          - scenario: competency evaluation with sufficient evidence
            action: proceed with evaluation
        counterExamples:
          - scenario: evaluation without evidence
            action: forbidden, principle violation
    
    cognitiveRules:
      - id: RIK-CR-001
        priority: CRITICAL
        category: evidence
        condition: Evaluation is requested for a competency
        action:
          - MUST verify minimum evidence threshold is met
          - MUST calculate evidence coverage
          - MUST validate evidence quality
          - MUST proceed only if thresholds are satisfied
        exception: None
        examples:
          - scenario: Competency evaluation with sufficient evidence
            action: Proceed with evaluation
        counterExamples:
          - scenario: Competency evaluation with insufficient evidence
            action: Reject evaluation, collect more evidence
  
  configuration:
    runtime:
      evaluation:
        minEvidenceThreshold:
          strong: 3
          moderate: 5
          weak: 7
        evidenceCategorization:
          enabled: true
          types:
            - direct
            - indirect
            - behavioral
            - inferred
        contradictionHandling:
          enabled: true
          action: reevaluate
        missingEvidenceTracking:
          enabled: true
  
  compilation:
    targets:
      - typescript
      - json_schema
      - yaml
      - openapi
      - neo4j
    
    optimization:
      enabled: true
      level: aggressive
      
    validation:
      enabled: true
      strict: true
      
    generation:
      tests: true
      documentation: true
      examples: true
```

### 10.2 Competency Example

```yaml
competency:
  id: system.design
  name: System Design
  description: Design scalable, maintainable systems
  category: technical
  level: senior
  weight: 0.9
  evidence:
    min: 5
    confidence: 0.85
  strategies:
    - scaling
    - availability
    - consistency
    - tradeoffs
    - architecture
  followups:
    automatic: true
    types:
      - evidence
      - metrics
      - ownership
      - tradeoffs
      - architecture
  scoring:
    method: weighted
    weights:
      technical: 0.5
      communication: 0.2
      leadership: 0.3
  exit:
    condition: confidence > 0.9
    action: conclude
```

### 10.3 Principle Example

```yaml
principle:
  id: CP-002
  name: Single Active Question
  category: conversation
  priority: critical
  description: Only one primary question SHALL be active at any time
  businessRationale: Prevents candidate confusion, ensures clear evaluation
  executionRule:
    - MUST verify no other active question exists
    - MUST check current question resolution status
    - MUST confirm follow-up questions relate to primary
    - MUST proceed only if single question constraint satisfied
  failureMode: multiple active questions detected
  runtimeConsequence: secondary questions queued, primary question maintained
  examples:
    - scenario: Current question resolved, no follow-ups
      action: Generate new question
    - scenario: Current question unresolved
      action: Defer new question, resolve current first
  counterExamples:
    - scenario: Two questions presented simultaneously
      action: Forbidden, principle violation
```

---

## 11. TypeScript Contracts

### 11.1 Core Interfaces

```typescript
// Blueprint Document
interface BlueprintDocument {
  version: string;
  specId: string;
  specType: SpecificationType;
  specName: string;
  metadata: BlueprintMetadata;
  dependencies: Dependency[];
  imports: Import[];
  exports: Export[];
  definitions: BlueprintDefinitions;
  configuration: BlueprintConfiguration;
  compilation: CompilationConfig;
}

// Competency
interface Competency {
  id: string;
  name: string;
  description: string;
  category: CompetencyCategory;
  level: CompetencyLevel;
  weight: number;
  evidence: EvidenceRequirements;
  strategies: Strategy[];
  followups: FollowupConfig;
  scoring: ScoringConfig;
  exit: ExitCondition;
}

// Principle
interface CorePrinciple {
  id: string;
  name: string;
  description: string;
  businessRationale: string;
  executionRule: string[];
  failureMode: string;
  runtimeConsequence: string;
  examples: PrincipleExample[];
  counterExamples: PrincipleExample[];
}

// Cognitive Rule
interface CognitiveRule {
  id: string;
  priority: PriorityLevel;
  category: RuleCategory;
  condition: string;
  action: string[];
  exception: string;
  examples: RuleExample[];
  counterExamples: RuleExample[];
}

// Runtime Invariant
interface RuntimeInvariant {
  id: string;
  statement: string;
  violationDetection: string;
  recovery: string;
  runtimeConsequence: string;
  monitoring?: MonitoringConfig;
}

// Forbidden Behavior
interface ForbiddenBehavior {
  id: string;
  description: string;
  prohibitionLevel: ProhibitionLevel;
  detection: string;
  consequence: string;
  recovery: string;
  examples: BehaviorExample[];
}

// Business Rule
interface BusinessRule {
  id: string;
  statement: string;
  threshold?: number;
  calculation?: string;
  validation?: string;
  enforcement: string;
  exception?: string;
  examples: RuleExample[];
  counterExamples: RuleExample[];
}

// Decision Heuristic
interface DecisionHeuristic {
  id: string;
  condition: HeuristicCondition[];
  heuristic: string;
  confidence: number;
  applicability: string;
  examples: HeuristicExample[];
  counterExamples: HeuristicExample[];
}

// Conversation Pattern
interface ConversationPattern {
  id: string;
  name: string;
  description: string;
  triggerConditions: TriggerCondition[];
  patternSteps: PatternStep[];
  exitConditions: ExitCondition[];
  examples: PatternExample[];
  counterExamples: PatternExample[];
}

// Evaluation Pattern
interface EvaluationPattern {
  id: string;
  name: string;
  description: string;
  competency: CompetencyType;
  evaluationCriteria: EvaluationCriterion[];
  evidenceRequirements: EvidenceRequirement[];
  scoringAlgorithm: ScoringAlgorithm;
  examples: EvaluationExample[];
  counterExamples: EvaluationExample[];
}

// State Machine
interface StateMachine {
  id: string;
  name: string;
  category: StateMachineCategory;
  states: State[];
  transitions: Transition[];
}

// Graph
interface Graph {
  id: string;
  name: string;
  description: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  algorithms: GraphAlgorithm[];
  queries: GraphQuery[];
  updates: GraphUpdate[];
  visualization: GraphVisualization;
}
```

### 11.2 Type Definitions

```typescript
// Types
type SpecificationType = 
  | 'recruitment_intelligence'
  | 'cognitive_runtime'
  | 'ai_runtime'
  | 'event_runtime'
  | 'configuration_compiler'
  | 'observability'
  | 'security'
  | 'operations';

type CompetencyCategory = 'technical' | 'behavioral' | 'leadership';

type CompetencyLevel = 'junior' | 'mid' | 'senior' | 'principal';

type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

type ProhibitionLevel = 'ABSOLUTE' | 'HIGH' | 'MEDIUM' | 'LOW';

type RuleCategory = 
  | 'evidence'
  | 'conversation'
  | 'question'
  | 'adaptation'
  | 'relance'
  | 'persona'
  | 'ethics'
  | 'memory'
  | 'validation'
  | 'hypothesis'
  | 'assessment'
  | 'learning'
  | 'session'
  | 'state';

type StateMachineCategory = 
  | 'conversation'
  | 'memory'
  | 'evaluation'
  | 'planning'
  | 'director'
  | 'question'
  | 'context'
  | 'prompt'
  | 'confidence'
  | 'evidence'
  | 'persona'
  | 'difficulty'
  | 'simulation'
  | 'learning'
  | 'recovery'
  | 'error'
  | 'safety'
  | 'latency'
  | 'provider'
  | 'retry'
  | 'replay'
  | 'audit'
  | 'monitoring'
  | 'decision'
  | 'reasoning';
```

---

## 12. JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://trajectoire.ai/schemas/blueprint-dsl.json",
  "title": "Blueprint DSL",
  "description": "Schema for Blueprint Domain Specific Language",
  "type": "object",
  "properties": {
    "blueprint": {
      "type": "object",
      "properties": {
        "version": {
          "type": "string",
          "pattern": "^\\d+\\.\\d+\\.\\d+$"
        },
        "specId": {
          "type": "string",
          "pattern": "^[A-Z]+-\\d+$"
        },
        "specType": {
          "type": "string",
          "enum": [
            "recruitment_intelligence",
            "cognitive_runtime",
            "ai_runtime",
            "event_runtime",
            "configuration_compiler",
            "observability",
            "security",
            "operations"
          ]
        },
        "specName": {
          "type": "string"
        },
        "metadata": {
          "type": "object",
          "properties": {
            "author": {
              "type": "string"
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            },
            "status": {
              "type": "string",
              "enum": ["draft", "review", "approved", "approved"]
            }
          },
          "required": ["author", "created", "updated", "status"]
        },
        "dependencies": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "specId": {
                "type": "string"
              },
              "version": {
                "type": "string"
              }
            },
            "required": ["specId", "version"]
          }
        },
        "imports": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "from": {
                "type": "string"
              },
              "items": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": ["from", "items"]
          }
        },
        "exports": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "definitions": {
          "type": "object",
          "properties": {
            "competencies": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Competency"
              }
            },
            "principles": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/CorePrinciple"
              }
            },
            "cognitiveRules": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/CognitiveRule"
              }
            },
            "invariants": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/RuntimeInvariant"
              }
            },
            "forbiddenBehaviors": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ForbiddenBehavior"
              }
            },
            "businessRules": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/BusinessRule"
              }
            }
          }
        },
        "configuration": {
          "type": "object"
        },
        "compilation": {
          "type": "object",
          "properties": {
            "targets": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "typescript",
                  "json_schema",
                  "yaml",
                  "openapi",
                  "asyncapi",
                  "avro",
                  "protobuf",
                  "neo4j",
                  "redis",
                  "supabase",
                  "sql",
                  "events",
                  "tests",
                  "documentation"
                ]
              }
            },
            "optimization": {
              "type": "object",
              "properties": {
                "enabled": {
                  "type": "boolean"
                },
                "level": {
                  "type": "string",
                  "enum": ["none", "basic", "moderate", "aggressive"]
                }
              }
            },
            "validation": {
              "type": "object",
              "properties": {
                "enabled": {
                  "type": "boolean"
                },
                "strict": {
                  "type": "boolean"
                }
              }
            },
            "generation": {
              "type": "object",
              "properties": {
                "tests": {
                  "type": "boolean"
                },
                "documentation": {
                  "type": "boolean"
                },
                "examples": {
                  "type": "boolean"
                }
              }
            }
          }
        }
      },
      "required": [
        "version",
        "specId",
        "specType",
        "specName",
        "metadata",
        "definitions",
        "configuration",
        "compilation"
      ]
    }
  },
  "required": ["blueprint"],
  "definitions": {
    "Competency": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "category": {
          "type": "string",
          "enum": ["technical", "behavioral", "leadership"]
        },
        "level": {
          "type": "string",
          "enum": ["junior", "mid", "senior", "principal"]
        },
        "weight": {
          "type": "number",
          "minimum": 0,
          "maximum": 1
        },
        "evidence": {
          "type": "object",
          "properties": {
            "min": {
              "type": "number"
            },
            "confidence": {
              "type": "number",
              "minimum": 0,
              "maximum": 1
            }
          }
        },
        "strategies": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "followups": {
          "type": "object"
        },
        "scoring": {
          "type": "object"
        },
        "exit": {
          "type": "object"
        }
      },
      "required": ["id", "name", "description", "category", "level", "weight"]
    },
    "CorePrinciple": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^CP-\\d+$"
        },
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "businessRationale": {
          "type": "string"
        },
        "executionRule": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "failureMode": {
          "type": "string"
        },
        "runtimeConsequence": {
          "type": "string"
        },
        "examples": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "counterExamples": {
          "type": "array",
          "items": {
            "type": "object"
          }
        }
      },
      "required": ["id", "name", "description", "businessRationale", "executionRule", "failureMode", "runtimeConsequence"]
    }
  }
}
```

---

## 13. Version History

**Version 1.0.0** (2024-01-23)
- Initial release
- Defined core DSL structure
- Defined primitive and composite types
- Defined DSL grammar
- Defined compilation rules
- Defined validation rules
- Defined extension points
- Defined tooling requirements
- Provided complete examples
- Provided TypeScript contracts
- Provided JSON Schema
