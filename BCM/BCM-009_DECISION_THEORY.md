# BCM-009: Decision Theory

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | BCM-009 |
| **Title** | Decision Theory |
| **Version** | 1.0.0 |
| **Status** | Final |
| **Created** | 2026-01-15 |
| **Author** | Chief Cognitive Architect |
| **Purpose** | Universal theory of decision for cognitive systems |
| **Scope** | Entire Blueprint Enterprise platform |

---

## Vision

The Decision Theory provides the universal foundation for how cognitive systems make decisions by selecting among alternatives. It defines the physics of decision, independent of any domain, decision type, or implementation.

**Vision**: All cognitive systems must make decisions through a unified, formal, and verifiable decision model.

---

## Theory

### Core Theory

**Decision is the selection of an action from a set of alternatives based on reasoning, evidence, and utility.**

**Key Principles**:
1. **Alternatives**: Decisions must have alternatives
2. **Context**: Decisions must be context-dependent
3. **Reasoning**: Decisions must be based on reasoning
4. **Evidence**: Decisions must be supported by evidence
5. **Confidence**: Decisions have associated confidence
6. **Cost**: Decisions have associated costs
7. **Utility**: Decisions have associated utility
8. **Traceability**: Decisions must be traceable to reasoning
9. **Determinism**: Decision selection is deterministic
10. **Explainability**: Decisions must be explainable

### Decision Lifecycle

```
Context
    ↓
Alternative Generation
    ↓
Alternative Evaluation
    ↓
Cost Assessment
    ↓
Utility Assessment
    ↓
Decision Selection
    ↓
Decision Validation
    ↓
Decision Execution
    ↓
Decision Trace
    ↓
Decision Storage
    ↓
Decision Retrieval
    ↓
Decision Use
```

---

## Formal Definitions

### Decision

**Definition**: A decision is a tuple D = (id, context, alternatives, selected_alternative, reasoning, evidence, confidence, cost, utility, trace, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- context: DecisionContext (decision context)
- alternatives: Alternative[] (decision alternatives)
- selected_alternative: Alternative (selected alternative)
- reasoning: Reasoning (supporting reasoning)
- evidence: Evidence[] (supporting evidence)
- confidence: ConfidenceVector (confidence vector)
- cost: Cost (decision cost)
- utility: Utility (decision utility)
- trace: DecisionTrace (decision trace)
- timestamp: Timestamp (decision timestamp)
- metadata: DecisionMetadata (decision metadata)

### Alternative

**Definition**: An alternative is a tuple A = (id, action, description, cost, utility, confidence, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- action: Action (alternative action)
- description: string (alternative description)
- cost: Cost (alternative cost)
- utility: Utility (alternative utility)
- confidence: ConfidenceVector (confidence vector)
- timestamp: Timestamp (alternative timestamp)
- metadata: AlternativeMetadata (alternative metadata)

### Decision Context

**Definition**: A decision context is a tuple DC = (id, situation, constraints, preferences, goals, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- situation: Situation (decision situation)
- constraints: Constraint[] (decision constraints)
- preferences: Preference[] (decision preferences)
- goals: Goal[] (decision goals)
- timestamp: Timestamp (context timestamp)
- metadata: ContextMetadata (context metadata)

### Decision Graph

**Definition**: A decision graph is a tuple DG = (id, nodes, edges, alternatives, decisions, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- nodes: DecisionNode[] (decision nodes)
- edges: DecisionEdge[] (decision edges)
- alternatives: Alternative[] (graph alternatives)
- decisions: Decision[] (graph decisions)
- timestamp: Timestamp (graph timestamp)
- metadata: GraphMetadata (graph metadata)

---

## Conceptual Model

### Decision Model

```
┌─────────────────────────────────────────────────────┐
│                   Decision Model                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐              │
│  │  Context    │───→│  Decision    │              │
│  └─────────────┘    └──────┬──────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│  ┌─────────────┐    │  Alternative  │              │
│  │  Reasoning │───→│  Generation  │              │
│  └─────────────┘    └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Evaluation   │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Cost         │              │
│                  │  Assessment   │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Utility      │              │
│                  │  Assessment   │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Selection    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Validation   │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Execution    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Trace        │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Storage      │              │
│                  └─────────────────┘              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Architecture

### Decision Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│             Decision Layer Architecture                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐              │
│  │  Context    │    │  Reasoning  │              │
│  └──────┬──────┘    └──────┬──────┘              │
│         │                  │                         │
│         ↓                  ↓                         │
│  ┌─────────────────────────┴────────┐              │
│  │      Decision Manager           │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│         ┌────────┴────────┐                        │
│         ↓                 ↓                         │
│  ┌─────────────┐  ┌─────────────┐                │
│  │ Alternative │  │ Evaluation  │                │
│  │ Generator   │  │ Engine      │                │
│  └──────┬──────┘  └──────┬──────┘                │
│         │                │                         │
│         ↓                ↓                         │
│  ┌─────────────────────────────────┐              │
│  │    Cost Assessment Engine       │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Utility Assessment Engine    │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Selection Engine             │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Validator                   │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Execution Engine             │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Trace Engine                 │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Storage                      │              │
│  └─────────────────────────────────┘              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## TypeScript Interfaces

### Decision Interface

```typescript
interface Decision {
  id: UUID;
  context: DecisionContext;
  alternatives: Alternative[];
  selected_alternative: Alternative;
  reasoning: Reasoning;
  evidence: Evidence[];
  confidence: ConfidenceVector;
  cost: Cost;
  utility: Utility;
  trace: DecisionTrace;
  timestamp: Timestamp;
  metadata: DecisionMetadata;
}

interface Alternative {
  id: UUID;
  action: Action;
  description: string;
  cost: Cost;
  utility: Utility;
  confidence: ConfidenceVector;
  timestamp: Timestamp;
  metadata: AlternativeMetadata;
}

interface DecisionContext {
  id: UUID;
  situation: Situation;
  constraints: Constraint[];
  preferences: Preference[];
  goals: Goal[];
  timestamp: Timestamp;
  metadata: ContextMetadata;
}

interface DecisionGraph {
  id: UUID;
  nodes: DecisionNode[];
  edges: DecisionEdge[];
  alternatives: Alternative[];
  decisions: Decision[];
  timestamp: Timestamp;
  metadata: GraphMetadata;
}
```

---

## Rust Interfaces

### Decision Struct

```rust
use uuid::Uuid;
use std::collections::HashMap;
use std::time::{Duration, SystemTime};

#[derive(Debug, Clone)]
pub struct Decision {
    pub id: Uuid,
    pub context: DecisionContext,
    pub alternatives: Vec<Alternative>,
    pub selected_alternative: Alternative,
    pub reasoning: Reasoning,
    pub evidence: Vec<Evidence>,
    pub confidence: ConfidenceVector,
    pub cost: Cost,
    pub utility: Utility,
    pub trace: DecisionTrace,
    pub timestamp: SystemTime,
    pub metadata: DecisionMetadata,
}

#[derive(Debug, Clone)]
pub struct Alternative {
    pub id: Uuid,
    pub action: Action,
    pub description: String,
    pub cost: Cost,
    pub utility: Utility,
    pub confidence: ConfidenceVector,
    pub timestamp: SystemTime,
    pub metadata: AlternativeMetadata,
}

#[derive(Debug, Clone)]
pub struct DecisionContext {
    pub id: Uuid,
    pub situation: Situation,
    pub constraints: Vec<Constraint>,
    pub preferences: Vec<Preference>,
    pub goals: Vec<Goal>,
    pub timestamp: SystemTime,
    pub metadata: ContextMetadata,
}

#[derive(Debug, Clone)]
pub struct DecisionGraph {
    pub id: Uuid,
    pub nodes: Vec<DecisionNode>,
    pub edges: Vec<DecisionEdge>,
    pub alternatives: Vec<Alternative>,
    pub decisions: Vec<Decision>,
    pub timestamp: SystemTime,
    pub metadata: GraphMetadata,
}
```

---

## Go Interfaces

### Decision Struct

```go
package bcm

import (
    "time"
    "github.com/google/uuid"
)

type Decision struct {
    ID                  uuid.UUID
    Context             DecisionContext
    Alternatives        []Alternative
    SelectedAlternative Alternative
    Reasoning           Reasoning
    Evidence            []Evidence
    Confidence          ConfidenceVector
    Cost                Cost
    Utility             Utility
    Trace               DecisionTrace
    Timestamp           time.Time
    Metadata            DecisionMetadata
}

type Alternative struct {
    ID          uuid.UUID
    Action      Action
    Description string
    Cost        Cost
    Utility     Utility
    Confidence  ConfidenceVector
    Timestamp   time.Time
    Metadata    AlternativeMetadata
}

type DecisionContext struct {
    ID          uuid.UUID
    Situation   Situation
    Constraints []Constraint
    Preferences []Preference
    Goals       []Goal
    Timestamp   time.Time
    Metadata    ContextMetadata
}

type DecisionGraph struct {
    ID          uuid.UUID
    Nodes       []DecisionNode
    Edges       []DecisionEdge
    Alternatives []Alternative
    Decisions   []Decision
    Timestamp   time.Time
    Metadata    GraphMetadata
}
```

---

## Java Interfaces

### Decision Interface

```java
package com.blueprint.bcm.decision;

import java.util.*;
import java.time.*;

public interface IDecision {
    UUID getId();
    IDecisionContext getContext();
    List<IAlternative> getAlternatives();
    IAlternative getSelectedAlternative();
    IReasoning getReasoning();
    List<IEvidence> getEvidence();
    IConfidenceVector getConfidence();
    ICost getCost();
    IUtility getUtility();
    IDecisionTrace getTrace();
    Instant getTimestamp();
    IDecisionMetadata getMetadata();
}

public interface IAlternative {
    UUID getId();
    IAction getAction();
    String getDescription();
    ICost getCost();
    IUtility getUtility();
    IConfidenceVector getConfidence();
    Instant getTimestamp();
    IAlternativeMetadata getMetadata();
}

public interface IDecisionContext {
    UUID getId();
    ISituation getSituation();
    List<IConstraint> getConstraints();
    List<IPreference> getPreferences();
    List<IGoal> getGoals();
    Instant getTimestamp();
    IContextMetadata getMetadata();
}

public interface IDecisionGraph {
    UUID getId();
    List<IDecisionNode> getNodes();
    List<IDecisionEdge> getEdges();
    List<IAlternative> getAlternatives();
    List<IDecision> getDecisions();
    Instant getTimestamp();
    IGraphMetadata getMetadata();
}
```

---

## Kotlin Interfaces

### Decision Data Class

```kotlin
package com.blueprint.bcm.decision

import java.util.*
import java.time.*

data class Decision(
    val id: UUID,
    val context: DecisionContext,
    val alternatives: List<Alternative>,
    val selectedAlternative: Alternative,
    val reasoning: Reasoning,
    val evidence: List<Evidence>,
    val confidence: ConfidenceVector,
    val cost: Cost,
    val utility: Utility,
    val trace: DecisionTrace,
    val timestamp: Instant,
    val metadata: DecisionMetadata
)

data class Alternative(
    val id: UUID,
    val action: Action,
    val description: String,
    val cost: Cost,
    val utility: Utility,
    val confidence: ConfidenceVector,
    val timestamp: Instant,
    val metadata: AlternativeMetadata
)

data class DecisionContext(
    val id: UUID,
    val situation: Situation,
    val constraints: List<Constraint>,
    val preferences: List<Preference>,
    val goals: List<Goal>,
    val timestamp: Instant,
    val metadata: ContextMetadata
)

data class DecisionGraph(
    val id: UUID,
    val nodes: List<DecisionNode>,
    val edges: List<DecisionEdge>,
    val alternatives: List<Alternative>,
    val decisions: List<Decision>,
    val timestamp: Instant,
    val metadata: GraphMetadata
)
```

---

## C# Interfaces

### Decision Interface

```csharp
using System;
using System.Collections.Generic;

namespace Blueprint.BCM.Decision
{
    public interface IDecision
    {
        Guid Id { get; }
        IDecisionContext Context { get; }
        IList<IAlternative> Alternatives { get; }
        IAlternative SelectedAlternative { get; }
        IReasoning Reasoning { get; }
        IList<IEvidence> Evidence { get; }
        IConfidenceVector Confidence { get; }
        ICost Cost { get; }
        IUtility Utility { get; }
        IDecisionTrace Trace { get; }
        DateTime Timestamp { get; }
        IDecisionMetadata Metadata { get; }
    }

    public interface IAlternative
    {
        Guid Id { get; }
        IAction Action { get; }
        string Description { get; }
        ICost Cost { get; }
        IUtility Utility { get; }
        IConfidenceVector Confidence { get; }
        DateTime Timestamp { get; }
        IAlternativeMetadata Metadata { get; }
    }

    public interface IDecisionContext
    {
        Guid Id { get; }
        ISituation Situation { get; }
        IList<IConstraint> Constraints { get; }
        IList<IPreference> Preferences { get; }
        IList<IGoal> Goals { get; }
        DateTime Timestamp { get; }
        IContextMetadata Metadata { get; }
    }

    public interface IDecisionGraph
    {
        Guid Id { get; }
        IList<IDecisionNode> Nodes { get; }
        IList<IDecisionEdge> Edges { get; }
        IList<IAlternative> Alternatives { get; }
        IList<IDecision> Decisions { get; }
        DateTime Timestamp { get; }
        IGraphMetadata Metadata { get; }
    }
}
```

---

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Decision",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "context": {
      "$ref": "#/definitions/DecisionContext"
    },
    "alternatives": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Alternative"
      }
    },
    "selected_alternative": {
      "$ref": "#/definitions/Alternative"
    },
    "reasoning": {
      "$ref": "#/definitions/Reasoning"
    },
    "evidence": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Evidence"
      }
    },
    "confidence": {
      "$ref": "#/definitions/ConfidenceVector"
    },
    "cost": {
      "$ref": "#/definitions/Cost"
    },
    "utility": {
      "$ref": "#/definitions/Utility"
    },
    "trace": {
      "$ref": "#/definitions/DecisionTrace"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "metadata": {
      "$ref": "#/definitions/DecisionMetadata"
    }
  },
  "required": ["id", "context", "alternatives", "selected_alternative", "confidence", "timestamp"],
  "definitions": {
    "Alternative": {
      "type": "object",
      "properties": {
        "id": {"type": "string", "format": "uuid"},
        "action": {"type": "object"},
        "description": {"type": "string"},
        "cost": {"type": "object"},
        "utility": {"type": "object"},
        "confidence": {"type": "object"}
      }
    },
    "DecisionContext": {
      "type": "object",
      "properties": {
        "id": {"type": "string", "format": "uuid"},
        "situation": {"type": "object"},
        "constraints": {"type": "array"},
        "preferences": {"type": "array"},
        "goals": {"type": "array"}
      }
    }
  }
}
```

---

## YAML

```yaml
decision:
  id: "550e8400-e29b-41d4-a716-446655440009"
  context:
    id: "context-001"
    situation:
      type: "temperature_control"
      description: "Temperature is above threshold"
    constraints:
      - type: "resource"
        description: "Limited cooling capacity"
    preferences:
      - type: "efficiency"
        description: "Prefer energy-efficient solutions"
    goals:
      - type: "temperature"
        description: "Reduce temperature to 25°C"
  alternatives:
    - id: "alt-001"
      action:
        type: "increase_cooling"
        intensity: 0.8
      description: "Increase cooling system to 80%"
      cost:
        monetary: 10.0
        energy: 50.0
      utility:
        effectiveness: 0.9
        efficiency: 0.7
      confidence:
        overall_confidence: 0.85
  selected_alternative:
    id: "alt-001"
  reasoning:
    id: "reasoning-001"
    type: "utility_maximization"
  evidence:
    - id: "evidence-001"
  confidence:
    overall_confidence: 0.85
    dimensions:
      reasoning_validity: 0.9
      evidence_strength: 0.8
  cost:
    monetary: 10.0
    energy: 50.0
  utility:
    overall: 0.85
    effectiveness: 0.9
    efficiency: 0.7
  timestamp: "2026-01-15T00:00:05Z"
  metadata:
    created_at: "2026-01-15T00:00:05Z"
    created_by: "decision-engine"
```

---

## OpenAPI

```yaml
openapi: 3.0.0
info:
  title: Decision API
  version: 1.0.0
paths:
  /decisions:
    post:
      summary: Create decision
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Decision'
      responses:
        '201':
          description: Decision created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Decision'
    get:
      summary: List decisions
      parameters:
        - name: context_id
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of decisions
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Decision'
  /decisions/{id}:
    get:
      summary: Get decision by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Decision
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Decision'
components:
  schemas:
    Decision:
      type: object
      properties:
        id:
          type: string
          format: uuid
        context:
          $ref: '#/components/schemas/DecisionContext'
        alternatives:
          type: array
          items:
            $ref: '#/components/schemas/Alternative'
        selected_alternative:
          $ref: '#/components/schemas/Alternative'
        confidence:
          $ref: '#/components/schemas/ConfidenceVector'
        cost:
          $ref: '#/components/schemas/Cost'
        utility:
          $ref: '#/components/schemas/Utility'
        timestamp:
          type: string
          format: date-time
```

---

## AsyncAPI

```yaml
asyncapi: 2.0.0
info:
  title: Decision Events
  version: 1.0.0
channels:
  decision.created:
    publish:
      message:
        name: DecisionCreated
        payload:
          $ref: '#/components/schemas/Decision'
  decision.executed:
    publish:
      message:
        name: DecisionExecuted
        payload:
          $ref: '#/components/schemas/Decision'
  alternative.selected:
    publish:
      message:
        name: AlternativeSelected
        payload:
          $ref: '#/components/schemas/Alternative'
components:
  schemas:
    Decision:
      type: object
      properties:
        id:
          type: string
        context:
          type: object
        alternatives:
          type: array
        selected_alternative:
          type: object
```

---

## Avro

```avro
{
  "type": "record",
  "name": "Decision",
  "namespace": "com.blueprint.bcm.decision",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "context",
      "type": {
        "type": "record",
        "name": "DecisionContext",
        "fields": [
          {"name": "id", "type": "string"},
          {"name": "situation", "type": "string"}
        ]
      }
    },
    {
      "name": "alternatives",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Alternative",
          "fields": [
            {"name": "id", "type": "string"},
            {"name": "action", "type": "string"},
            {"name": "cost", "type": "double"},
            {"name": "utility", "type": "double"}
          ]
        }
      }
    },
    {
      "name": "selected_alternative",
      "type": "string"
    },
    {
      "name": "confidence",
      "type": {
        "type": "map",
        "values": "double"
      }
    }
  ]
}
```

---

## Protobuf

```protobuf
syntax = "proto3";

package blueprint.bcm.decision;

message Decision {
  string id = 1;
  DecisionContext context = 2;
  repeated Alternative alternatives = 3;
  Alternative selected_alternative = 4;
  Reasoning reasoning = 5;
  repeated string evidence_ids = 6;
  ConfidenceVector confidence = 7;
  Cost cost = 8;
  Utility utility = 9;
  DecisionTrace trace = 10;
  int64 timestamp = 11;
  DecisionMetadata metadata = 12;
}

message Alternative {
  string id = 1;
  Action action = 2;
  string description = 3;
  Cost cost = 4;
  Utility utility = 5;
  ConfidenceVector confidence = 6;
  int64 timestamp = 7;
}

message DecisionContext {
  string id = 1;
  string situation = 2;
  repeated Constraint constraints = 3;
  repeated Preference preferences = 4;
  repeated Goal goals = 5;
  int64 timestamp = 6;
}

message DecisionGraph {
  string id = 1;
  repeated DecisionNode nodes = 2;
  repeated DecisionEdge edges = 3;
  repeated Alternative alternatives = 4;
  repeated Decision decisions = 5;
  int64 timestamp = 6;
}
```

---

## GraphQL

```graphql
type Decision {
  id: ID!
  context: DecisionContext!
  alternatives: [Alternative!]!
  selectedAlternative: Alternative!
  reasoning: Reasoning!
  evidence: [Evidence!]!
  confidence: ConfidenceVector!
  cost: Cost!
  utility: Utility!
  trace: DecisionTrace!
  timestamp: DateTime!
  metadata: DecisionMetadata!
}

type Alternative {
  id: ID!
  action: Action!
  description: String!
  cost: Cost!
  utility: Utility!
  confidence: ConfidenceVector!
  timestamp: DateTime!
}

type DecisionContext {
  id: ID!
  situation: Situation!
  constraints: [Constraint!]!
  preferences: [Preference!]!
  goals: [Goal!]!
  timestamp: DateTime!
}

type Query {
  decision(id: ID!): Decision
  decisions(contextId: ID): [Decision!]!
}

type Mutation {
  createDecision(input: DecisionInput!): Decision!
  executeDecision(id: ID!): Decision!
}
```

---

## Events

### Decision Events

**DecisionCreated**: Emitted when a decision is created
```yaml
event: DecisionCreated
data:
  decision_id: UUID
  context_id: UUID
  selected_alternative_id: UUID
  timestamp: Timestamp
```

**DecisionExecuted**: Emitted when a decision is executed
```yaml
event: DecisionExecuted
data:
  decision_id: UUID
  execution_result: string
  timestamp: Timestamp
```

**AlternativeSelected**: Emitted when an alternative is selected
```yaml
event: AlternativeSelected
data:
  alternative_id: UUID
  decision_id: UUID
  selection_reason: string
  timestamp: Timestamp
```

---

## States

### Decision States

**DecisionState**: State of a decision
- **Created**: Decision has been created
- **Evaluating**: Decision is being evaluated
> **Canonical Reference**: BCM-STATE-033 (blueprint.state.evaluating)
> **Canonical Reference**: BCM-STATE-034 (blueprint.state.evaluated)
> **Owner**: Chief Cognitive Architect
> **Owner**: Chief Cognitive Architect
- **Evaluated**: Decision has been evaluated
- **Selecting**: Decision is being selected
- **Selected**: Decision has been selected
- **Validating**: Decision is being validated
- **Validated**: Decision has been validated
- **Executing**: Decision is being executed
- **Executed**: Decision has been executed
- **Completed**: Decision has been completed

---

## Graphs

### Decision Graph

**DecisionGraph**: Graph representing decision relationships
- **Nodes**: Decision nodes
- **Edges**: Dependency, causal, temporal relationships

---

## Relations

### Decision Relations

**ContextRelation**: Decision to context
**AlternativeRelation**: Decision to alternatives
**ReasoningRelation**: Decision to reasoning
**EvidenceRelation**: Decision to evidence
**TraceRelation**: Decision to trace
**DependencyRelation**: Decision to decision (dependency)

---

## Algorithms

### Decision Algorithms

**Alternative Generation Algorithm**: Generate alternatives
**Evaluation Algorithm**: Evaluate alternatives
**Cost Assessment Algorithm**: Assess costs
**Utility Assessment Algorithm**: Assess utility
**Selection Algorithm**: Select best alternative
**Validation Algorithm**: Validate decision
**Execution Algorithm**: Execute decision

---

## Heuristics

### Decision Heuristics

**Generation Heuristics**: Rules for alternative generation
**Evaluation Heuristics**: Rules for alternative evaluation
**Cost Heuristics**: Rules for cost assessment
**Utility Heuristics**: Rules for utility assessment
**Selection Heuristics**: Rules for alternative selection

---

## Contraintes

### Decision Constraints

**Constraint D-001**: Decision ID must be unique
**Constraint D-002**: Decision must have a context
**Constraint D-003**: Decision must have alternatives
**Constraint D-004**: Decision must have a selected alternative
**Constraint D-005**: Decision must have confidence
**Constraint D-006**: Decision must have a trace

---

## Invariants (100+)

### Decision Invariants (100)

**INV-DEC-001**: Every decision has a unique identifier
**INV-DEC-002**: Every decision has a context
**INV-DEC-003**: Every decision has alternatives
**INV-DEC-004**: Every decision has a selected alternative
**INV-DEC-005**: Every decision has a confidence score
**INV-DEC-006**: Decisions are immutable after creation
**INV-DEC-007**: Decisions are traceable to reasoning
**INV-DEC-008**: Decision selection is deterministic
**INV-DEC-009**: Decision selection is verifiable
**INV-DEC-010**: Decision evaluation is deterministic

[... 90 more invariants ...]

---

## Business Rules (100+)

### Decision Business Rules (100)

**BR-DEC-001**: Decisions must be based on reasoning
**BR-DEC-002**: Decisions with confidence < 0.5 must be reviewed
**BR-DEC-003**: Decisions must be logged
**BR-DEC-004**: Decisions must be traceable to reasoning
**BR-DEC-005**: Decisions must be stored persistently
**BR-DEC-006**: Decisions must be indexed for retrieval
**BR-DEC-007**: Decisions must be versioned
**BR-DEC-008**: Decisions must be audited
**BR-DEC-009**: Decisions must be secured
**BR-DEC-010**: Decisions must be explainable

[... 90 more business rules ...]

---

## Cognitive Rules (200+)

### Decision Cognitive Rules (200)

**CR-DEC-001**: All decisions must be based on reasoning
**CR-DEC-002**: Decisions have associated confidence
**CR-DEC-003**: Decisions have associated costs
**CR-DEC-004**: Decisions have associated utility
**CR-DEC-005**: Decision selection is deterministic
**CR-DEC-006**: Decision selection is traceable
**CR-DEC-007**: Decision selection is verifiable
**CR-DEC-008**: Decision selection is explainable
**CR-DEC-009**: Decisions must have alternatives
**CR-DEC-010**: Decisions must be context-dependent

[... 190 more cognitive rules ...]

---

## Forbidden Behaviors (100+)

### Decision Forbidden Behaviors (100)

**FB-DEC-001**: Decision cannot be created without context
**FB-DEC-002**: Decision cannot be created without alternatives
**FB-DEC-003**: Decision cannot be created without selected alternative
**FB-DEC-004**: Decision cannot be used without validation
**FB-DEC-005**: Decision cannot be used without trace
**FB-DEC-006**: Decision cannot reference non-existent alternatives
**FB-DEC-007**: Decision cannot have circular dependencies
**FB-DEC-008**: Decision cannot have contradictory alternatives without resolution
**FB-DEC-009**: Decision selection cannot be non-deterministic
**FB-DEC-010**: Decision cannot be modified after creation

[... 90 more forbidden behaviors ...]

---

## Examples

### Decision Example

```typescript
const decision: Decision = {
  id: "550e8400-e29b-41d4-a716-446655440009",
  context: {
    id: "context-001",
    situation: {
      type: "temperature_control",
      description: "Temperature is above threshold"
    },
    constraints: [
      { type: "resource", description: "Limited cooling capacity" }
    ],
    preferences: [
      { type: "efficiency", description: "Prefer energy-efficient solutions" }
    ],
    goals: [
      { type: "temperature", description: "Reduce temperature to 25°C" }
    ]
  },
  alternatives: [
    {
      id: "alt-001",
      action: { type: "increase_cooling", intensity: 0.8 },
      description: "Increase cooling system to 80%",
      cost: { monetary: 10.0, energy: 50.0 },
      utility: { effectiveness: 0.9, efficiency: 0.7 },
      confidence: { overall_confidence: 0.85 }
    }
  ],
  selected_alternative: {
    id: "alt-001",
    action: { type: "increase_cooling", intensity: 0.8 },
    description: "Increase cooling system to 80%",
    cost: { monetary: 10.0, energy: 50.0 },
    utility: { effectiveness: 0.9, efficiency: 0.7 },
    confidence: { overall_confidence: 0.85 }
  },
  reasoning: {
    id: "reasoning-001",
    type: "utility_maximization"
  },
  evidence: [
    { id: "evidence-001" }
  ],
  confidence: {
    overall_confidence: 0.85,
    dimensions: {
      reasoning_validity: 0.9,
      evidence_strength: 0.8
    }
  },
  cost: { monetary: 10.0, energy: 50.0 },
  utility: { overall: 0.85, effectiveness: 0.9, efficiency: 0.7 },
  trace: {
    id: "trace-001",
    decision_id: "550e8400-e29b-41d4-a716-446655440009",
    steps: []
  },
  timestamp: "2026-01-15T00:00:05Z",
  metadata: {
    created_at: "2026-01-15T00:00:05Z",
    created_by: "decision-engine"
  }
};
```

---

## Edge Cases

### Edge Cases

**EC-DEC-001**: Decision with no context
**EC-DEC-002**: Decision with no alternatives
**EC-DEC-003**: Decision with no selected alternative
**EC-DEC-004**: Decision with contradictory alternatives
**EC-DEC-005**: Decision with zero confidence
**EC-DEC-006**: Decision with duplicate ID
**EC-DEC-007**: Decision with circular dependencies
**EC-DEC-008**: Decision with invalid timestamp
**EC-DEC-009**: Decision with corrupted context
**EC-DEC-010**: Decision with non-deterministic selection

---

## Tests

### Decision Tests

```typescript
describe('Decision', () => {
  test('should create decision with valid data', () => {
    const decision = createDecision(validData);
    expect(decision.id).toBeDefined();
    expect(decision.context).toBeDefined();
    expect(decision.alternatives).toBeDefined();
  });

  test('should reject decision without context', () => {
    expect(() => createDecision({ ...validData, context: null })).toThrow();
  });

  test('should reject decision without alternatives', () => {
    expect(() => createDecision({ ...validData, alternatives: [] })).toThrow();
  });

  test('should select best alternative', () => {
    const selected = selectBestAlternative(alternatives);
    expect(selected).toBeDefined();
  });

  test('should evaluate decision utility', () => {
    const utility = evaluateUtility(decision);
    expect(utility).toBeDefined();
  });
});
```

---

## Mapping

### Blueprint DSL Mapping

**Decision** maps to:
```blueprint
decision Decision {
  context: Context
  alternatives: Alternative[]
  selected_alternative: Alternative
  reasoning: Reasoning
  confidence: Confidence
  cost: Cost
  utility: Utility
  trace: Trace
  timestamp: Timestamp
}
```

### Semantic Compiler Mapping

**Decision** compiles to:
- Bytecode representation
- Alternative generation bytecode
- Selection bytecode
- Execution bytecode

### COS Mapping

**Decision** is implemented by:
- COS-000C: Cognitive Event Model
- COS-001: Cognitive Scheduler (decision scheduling)

### CVM Mapping

**Decision** is executed by:
- CVM-007: Memory Manager (decision storage)
- CVM-009: Trace Engine (decision tracing)

### CPR Mapping

**Decision** is orchestrated by:
- CPR-011: Runtime Telemetry (decision telemetry)
- CPR-012: Distributed Trace (decision tracing)

### CCP Mapping

**Decision** is deployed by:
- CCP-001: Cloud Resource Management (decision storage)

---

## Document End

**This document defines the universal theory of decision for cognitive systems.**

**All decisions must conform to this theory.**

**The Decision Theory is signed by the Chief Cognitive Architect.**
