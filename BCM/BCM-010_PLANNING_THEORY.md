# BCM-010: Planning Theory

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | BCM-010 |
| **Title** | Planning Theory |
| **Version** | 1.0.0 |
| **Status** | Final |
| **Created** | 2026-01-15 |
| **Author** | Chief Cognitive Architect |
| **Purpose** | Universal theory of planning for cognitive systems |
| **Scope** | Entire Blueprint Enterprise platform |

---

## Vision

The Planning Theory provides the universal foundation for how cognitive systems create plans to achieve goals. It defines the physics of planning, independent of any domain, plan type, or implementation.

**Vision**: All cognitive systems must perform planning through a unified, formal, and verifiable planning model.

---

## Theory

### Core Theory

**Planning is the process of creating a sequence of actions to achieve a goal.**

**Key Principles**:
1. **Goal-Oriented**: Planning is goal-oriented
2. **Sequential**: Plans consist of sequential actions
3. **Dependencies**: Plans have action dependencies
4. **Optimization**: Plans can be optimized
5. **Execution Order**: Plans have defined execution order
6. **Subplans**: Plans can have subplans
7. **Alternatives**: Plans can have alternatives
8. **Traceability**: Plans must be traceable to goals
9. **Determinism**: Plan generation is deterministic
10. **Verifiability**: Plans must be verifiable

### Planning Lifecycle

```
Goal
    ↓
Objective Definition
    ↓
Alternative Generation
    ↓
Plan Generation
    ↓
Subplan Generation
    ↓
Dependency Analysis
    ↓
Execution Order Determination
    ↓
Plan Optimization
    ↓
Plan Validation
    ↓
Plan Execution
    ↓
Plan Monitoring
    ↓
Plan Adaptation
    ↓
Plan Storage
    ↓
Plan Retrieval
    ↓
Plan Use
```

---

## Formal Definitions

### Plan

**Definition**: A plan is a tuple P = (id, goal, objectives, actions, subplans, dependencies, execution_order, optimization, confidence, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- goal: Goal (plan goal)
- objectives: Objective[] (plan objectives)
- actions: Action[] (plan actions)
- subplans: Plan[] (plan subplans)
- dependencies: Dependency[] (action dependencies)
- execution_order: ExecutionOrder (execution order)
- optimization: Optimization (plan optimization)
- confidence: ConfidenceVector (confidence vector)
- timestamp: Timestamp (plan timestamp)
- metadata: PlanMetadata (plan metadata)

### Goal

**Definition**: A goal is a tuple G = (id, description, type, priority, deadline, constraints, success_criteria, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- description: string (goal description)
- type: GoalType (goal type)
- priority: Priority (goal priority)
- deadline: Timestamp (goal deadline)
- constraints: Constraint[] (goal constraints)
- success_criteria: SuccessCriteria (success criteria)
- timestamp: Timestamp (goal timestamp)
- metadata: GoalMetadata (goal metadata)

### Objective

**Definition**: An objective is a tuple O = (id, description, type, priority, deadline, success_criteria, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- description: string (objective description)
- type: ObjectiveType (objective type)
- priority: Priority (objective priority)
- deadline: Timestamp (objective deadline)
- success_criteria: SuccessCriteria (success criteria)
- timestamp: Timestamp (objective timestamp)
- metadata: ObjectiveMetadata (objective metadata)

### Subplan

**Definition**: A subplan is a tuple SP = (id, parent_plan, goal, actions, dependencies, execution_order, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- parent_plan: UUID (parent plan ID)
- goal: Goal (subplan goal)
- actions: Action[] (subplan actions)
- dependencies: Dependency[] (subplan dependencies)
- execution_order: ExecutionOrder (execution order)
- timestamp: Timestamp (subplan timestamp)
- metadata: SubplanMetadata (subplan metadata)

### Dependency

**Definition**: A dependency is a tuple D = (id, type, source, target, condition, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- type: DependencyType (dependency type)
- source: Action (source action)
- target: Action (target action)
- condition: Condition (dependency condition)
- timestamp: Timestamp (dependency timestamp)
- metadata: DependencyMetadata (dependency metadata)

### Execution Order

**Definition**: An execution order is a tuple EO = (id, actions, order_type, sequence, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- actions: Action[] (ordered actions)
- order_type: OrderType (order type)
- sequence: Sequence[] (action sequence)
- timestamp: Timestamp (execution order timestamp)
- metadata: ExecutionOrderMetadata (execution order metadata)

---

## Conceptual Model

### Planning Model

```
┌─────────────────────────────────────────────────────┐
│                   Planning Model                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐              │
│  │  Goal       │───→│  Plan        │              │
│  └─────────────┘    └──────┬──────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│  ┌─────────────┐    │  Objective    │              │
│  │  Objectives │───→│  Definition   │              │
│  └─────────────┘    └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Alternative   │              │
│                  │  Generation    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Plan         │              │
│                  │  Generation    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Subplan      │              │
│                  │  Generation    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Dependency    │              │
│                  │  Analysis      │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Execution     │              │
│                  │  Order         │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Optimization  │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Validation    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Execution     │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Monitoring    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Adaptation    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Storage       │              │
│                  └─────────────────┘              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Architecture

### Planning Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│            Planning Layer Architecture                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐              │
│  │  Goals      │    │  Objectives  │              │
│  └──────┬──────┘    └──────┬──────┘              │
│         │                  │                         │
│         ↓                  ↓                         │
│  ┌─────────────────────────┴────────┐              │
│  │      Planning Manager           │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│         ┌────────┴────────┐                        │
│         ↓                 ↓                         │
│  ┌─────────────┐  ┌─────────────┐                │
│  │ Objective   │  │ Alternative  │                │
│  │ Definition  │  │ Generator    │                │
│  └──────┬──────┘  └──────┬──────┘                │
│         │                │                         │
│         ↓                ↓                         │
│  ┌─────────────────────────────────┐              │
│  │    Plan Generator              │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Subplan Generator           │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Dependency Analyzer         │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Execution Order Determiner   │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Optimizer                    │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Validator                    │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Execution Engine             │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Monitor                      │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Adapter                      │              │
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

### Plan Interface

```typescript
interface Plan {
  id: UUID;
  goal: Goal;
  objectives: Objective[];
  actions: Action[];
  subplans: Plan[];
  dependencies: Dependency[];
  execution_order: ExecutionOrder;
  optimization: Optimization;
  confidence: ConfidenceVector;
  timestamp: Timestamp;
  metadata: PlanMetadata;
}

interface Goal {
  id: UUID;
  description: string;
  type: GoalType;
  priority: Priority;
  deadline: Timestamp;
  constraints: Constraint[];
  success_criteria: SuccessCriteria;
  timestamp: Timestamp;
  metadata: GoalMetadata;
}

interface Objective {
  id: UUID;
  description: string;
  type: ObjectiveType;
  priority: Priority;
  deadline: Timestamp;
  success_criteria: SuccessCriteria;
  timestamp: Timestamp;
  metadata: ObjectiveMetadata;
}

interface Subplan {
  id: UUID;
  parent_plan: UUID;
  goal: Goal;
  actions: Action[];
  dependencies: Dependency[];
  execution_order: ExecutionOrder;
  timestamp: Timestamp;
  metadata: SubplanMetadata;
}

interface Dependency {
  id: UUID;
  type: DependencyType;
  source: Action;
  target: Action;
  condition: Condition;
  timestamp: Timestamp;
  metadata: DependencyMetadata;
}

interface ExecutionOrder {
  id: UUID;
  actions: Action[];
  order_type: OrderType;
  sequence: Sequence[];
  timestamp: Timestamp;
  metadata: ExecutionOrderMetadata;
}
```

---

## Rust Interfaces

### Plan Struct

```rust
use uuid::Uuid;
use std::collections::HashMap;
use std::time::{Duration, SystemTime};

#[derive(Debug, Clone)]
pub struct Plan {
    pub id: Uuid,
    pub goal: Goal,
    pub objectives: Vec<Objective>,
    pub actions: Vec<Action>,
    pub subplans: Vec<Plan>,
    pub dependencies: Vec<Dependency>,
    pub execution_order: ExecutionOrder,
    pub optimization: Optimization,
    pub confidence: ConfidenceVector,
    pub timestamp: SystemTime,
    pub metadata: PlanMetadata,
}

#[derive(Debug, Clone)]
pub struct Goal {
    pub id: Uuid,
    pub description: String,
    pub r#type: GoalType,
    pub priority: Priority,
    pub deadline: SystemTime,
    pub constraints: Vec<Constraint>,
    pub success_criteria: SuccessCriteria,
    pub timestamp: SystemTime,
    pub metadata: GoalMetadata,
}

#[derive(Debug, Clone)]
pub struct Objective {
    pub id: Uuid,
    pub description: String,
    pub r#type: ObjectiveType,
    pub priority: Priority,
    pub deadline: SystemTime,
    pub success_criteria: SuccessCriteria,
    pub timestamp: SystemTime,
    pub metadata: ObjectiveMetadata,
}

#[derive(Debug, Clone)]
pub struct Subplan {
    pub id: Uuid,
    pub parent_plan: Uuid,
    pub goal: Goal,
    pub actions: Vec<Action>,
    pub dependencies: Vec<Dependency>,
    pub execution_order: ExecutionOrder,
    pub timestamp: SystemTime,
    pub metadata: SubplanMetadata,
}

#[derive(Debug, Clone)]
pub struct Dependency {
    pub id: Uuid,
    pub r#type: DependencyType,
    pub source: Action,
    pub target: Action,
    pub condition: Condition,
    pub timestamp: SystemTime,
    pub metadata: DependencyMetadata,
}

#[derive(Debug, Clone)]
pub struct ExecutionOrder {
    pub id: Uuid,
    pub actions: Vec<Action>,
    pub order_type: OrderType,
    pub sequence: Vec<Sequence>,
    pub timestamp: SystemTime,
    pub metadata: ExecutionOrderMetadata,
}
```

---

## Go Interfaces

### Plan Struct

```go
package bcm

import (
    "time"
    "github.com/google/uuid"
)

type Plan struct {
    ID             uuid.UUID
    Goal           Goal
    Objectives     []Objective
    Actions        []Action
    Subplans       []Plan
    Dependencies   []Dependency
    ExecutionOrder ExecutionOrder
    Optimization   Optimization
    Confidence     ConfidenceVector
    Timestamp      time.Time
    Metadata       PlanMetadata
}

type Goal struct {
    ID             uuid.UUID
    Description    string
    Type           GoalType
    Priority       Priority
    Deadline       time.Time
    Constraints    []Constraint
    SuccessCriteria SuccessCriteria
    Timestamp      time.Time
    Metadata       GoalMetadata
}

type Objective struct {
    ID             uuid.UUID
    Description    string
    Type           ObjectiveType
    Priority       Priority
    Deadline       time.Time
    SuccessCriteria SuccessCriteria
    Timestamp      time.Time
    Metadata       ObjectiveMetadata
}

type Subplan struct {
    ID             uuid.UUID
    ParentPlan     uuid.UUID
    Goal           Goal
    Actions        []Action
    Dependencies   []Dependency
    ExecutionOrder ExecutionOrder
    Timestamp      time.Time
    Metadata       SubplanMetadata
}

type Dependency struct {
    ID        uuid.UUID
    Type      DependencyType
    Source    Action
    Target    Action
    Condition Condition
    Timestamp time.Time
    Metadata  DependencyMetadata
}

type ExecutionOrder struct {
    ID        uuid.UUID
    Actions   []Action
    OrderType OrderType
    Sequence  []Sequence
    Timestamp time.Time
    Metadata  ExecutionOrderMetadata
}
```

---

## Java Interfaces

### Plan Interface

```java
package com.blueprint.bcm.planning;

import java.util.*;
import java.time.*;

public interface IPlan {
    UUID getId();
    IGoal getGoal();
    List<IObjective> getObjectives();
    List<IAction> getActions();
    List<IPlan> getSubplans();
    List<IDependency> getDependencies();
    IExecutionOrder getExecutionOrder();
    IOptimization getOptimization();
    IConfidenceVector getConfidence();
    Instant getTimestamp();
    IPlanMetadata getMetadata();
}

public interface IGoal {
    UUID getId();
    String getDescription();
    GoalType getType();
    Priority getPriority();
    Instant getDeadline();
    List<IConstraint> getConstraints();
    ISuccessCriteria getSuccessCriteria();
    Instant getTimestamp();
    IGoalMetadata getMetadata();
}

public interface IObjective {
    UUID getId();
    String getDescription();
    ObjectiveType getType();
    Priority getPriority();
    Instant getDeadline();
    ISuccessCriteria getSuccessCriteria();
    Instant getTimestamp();
    IObjectiveMetadata getMetadata();
}

public interface ISubplan {
    UUID getId();
    UUID getParentPlan();
    IGoal getGoal();
    List<IAction> getActions();
    List<IDependency> getDependencies();
    IExecutionOrder getExecutionOrder();
    Instant getTimestamp();
    ISubplanMetadata getMetadata();
}

public interface IDependency {
    UUID getId();
    DependencyType getType();
    IAction getSource();
    IAction getTarget();
    ICondition getCondition();
    Instant getTimestamp();
    IDependencyMetadata getMetadata();
}

public interface IExecutionOrder {
    UUID getId();
    List<IAction> getActions();
    OrderType getOrderType();
    List<ISequence> getSequence();
    Instant getTimestamp();
    IExecutionOrderMetadata getMetadata();
}
```

---

## Kotlin Interfaces

### Plan Data Class

```kotlin
package com.blueprint.bcm.planning

import java.util.*
import java.time.*

data class Plan(
    val id: UUID,
    val goal: Goal,
    val objectives: List<Objective>,
    val actions: List<Action>,
    val subplans: List<Plan>,
    val dependencies: List<Dependency>,
    val executionOrder: ExecutionOrder,
    val optimization: Optimization,
    val confidence: ConfidenceVector,
    val timestamp: Instant,
    val metadata: PlanMetadata
)

data class Goal(
    val id: UUID,
    val description: String,
    val type: GoalType,
    val priority: Priority,
    val deadline: Instant,
    val constraints: List<Constraint>,
    val successCriteria: SuccessCriteria,
    val timestamp: Instant,
    val metadata: GoalMetadata
)

data class Objective(
    val id: UUID,
    val description: String,
    val type: ObjectiveType,
    val priority: Priority,
    val deadline: Instant,
    val successCriteria: SuccessCriteria,
    val timestamp: Instant,
    val metadata: ObjectiveMetadata
)

data class Subplan(
    val id: UUID,
    val parentPlan: UUID,
    val goal: Goal,
    val actions: List<Action>,
    val dependencies: List<Dependency>,
    val executionOrder: ExecutionOrder,
    val timestamp: Instant,
    val metadata: SubplanMetadata
)

data class Dependency(
    val id: UUID,
    val type: DependencyType,
    val source: Action,
    val target: Action,
    val condition: Condition,
    val timestamp: Instant,
    val metadata: DependencyMetadata
)

data class ExecutionOrder(
    val id: UUID,
    val actions: List<Action>,
    val orderType: OrderType,
    val sequence: List<Sequence>,
    val timestamp: Instant,
    val metadata: ExecutionOrderMetadata
)
```

---

## C# Interfaces

### Plan Interface

```csharp
using System;
using System.Collections.Generic;

namespace Blueprint.BCM.Planning
{
    public interface IPlan
    {
        Guid Id { get; }
        IGoal Goal { get; }
        IList<IObjective> Objectives { get; }
        IList<IAction> Actions { get; }
        IList<IPlan> Subplans { get; }
        IList<IDependency> Dependencies { get; }
        IExecutionOrder ExecutionOrder { get; }
        IOptimization Optimization { get; }
        IConfidenceVector Confidence { get; }
        DateTime Timestamp { get; }
        IPlanMetadata Metadata { get; }
    }

    public interface IGoal
    {
        Guid Id { get; }
        string Description { get; }
        GoalType Type { get; }
        Priority Priority { get; }
        DateTime Deadline { get; }
        IList<IConstraint> Constraints { get; }
        ISuccessCriteria SuccessCriteria { get; }
        DateTime Timestamp { get; }
        IGoalMetadata Metadata { get; }
    }

    public interface IObjective
    {
        Guid Id { get; }
        string Description { get; }
        ObjectiveType Type { get; }
        Priority Priority { get; }
        DateTime Deadline { get; }
        ISuccessCriteria SuccessCriteria { get; }
        DateTime Timestamp { get; }
        IObjectiveMetadata Metadata { get; }
    }

    public interface ISubplan
    {
        Guid Id { get; }
        Guid ParentPlan { get; }
        IGoal Goal { get; }
        IList<IAction> Actions { get; }
        IList<IDependency> Dependencies { get; }
        IExecutionOrder ExecutionOrder { get; }
        DateTime Timestamp { get; }
        ISubplanMetadata Metadata { get; }
    }

    public interface IDependency
    {
        Guid Id { get; }
        DependencyType Type { get; }
        IAction Source { get; }
        IAction Target { get; }
        ICondition Condition { get; }
        DateTime Timestamp { get; }
        IDependencyMetadata Metadata { get; }
    }

    public interface IExecutionOrder
    {
        Guid Id { get; }
        IList<IAction> Actions { get; }
        OrderType OrderType { get; }
        IList<ISequence> Sequence { get; }
        DateTime Timestamp { get; }
        IExecutionOrderMetadata Metadata { get; }
    }
}
```

---

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Plan",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "goal": {
      "$ref": "#/definitions/Goal"
    },
    "objectives": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Objective"
      }
    },
    "actions": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Action"
      }
    },
    "subplans": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Plan"
      }
    },
    "dependencies": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Dependency"
      }
    },
    "execution_order": {
      "$ref": "#/definitions/ExecutionOrder"
    },
    "optimization": {
      "$ref": "#/definitions/Optimization"
    },
    "confidence": {
      "$ref": "#/definitions/ConfidenceVector"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "metadata": {
      "$ref": "#/definitions/PlanMetadata"
    }
  },
  "required": ["id", "goal", "actions", "confidence", "timestamp"],
  "definitions": {
    "Goal": {
      "type": "object",
      "properties": {
        "id": {"type": "string", "format": "uuid"},
        "description": {"type": "string"},
        "type": {"type": "string"},
        "priority": {"type": "string"},
        "deadline": {"type": "string", "format": "date-time"},
        "constraints": {"type": "array"},
        "success_criteria": {"type": "object"}
      }
    },
    "Objective": {
      "type": "object",
      "properties": {
        "id": {"type": "string", "format": "uuid"},
        "description": {"type": "string"},
        "type": {"type": "string"},
        "priority": {"type": "string"},
        "deadline": {"type": "string", "format": "date-time"},
        "success_criteria": {"type": "object"}
      }
    }
  }
}
```

---

## YAML

```yaml
plan:
  id: "550e8400-e29b-41d4-a716-446655440010"
  goal:
    id: "goal-001"
    description: "Reduce temperature to 25°C"
    type: "temperature_control"
    priority: "high"
    deadline: "2026-01-15T01:00:00Z"
    constraints:
      - type: "resource"
        description: "Limited cooling capacity"
    success_criteria:
      type: "threshold"
      value: 25.0
      unit: "celsius"
  objectives:
    - id: "objective-001"
      description: "Achieve target temperature within 1 hour"
      type: "time_bound"
      priority: "high"
      deadline: "2026-01-15T01:00:00Z"
      success_criteria:
        type: "time_threshold"
        max_duration: 3600
  actions:
    - id: "action-001"
      type: "increase_cooling"
      intensity: 0.8
      duration: 1800
  subplans: []
  dependencies:
    - id: "dep-001"
      type: "sequential"
      source: "action-001"
      target: "action-002"
      condition:
        type: "completion"
  execution_order:
    id: "order-001"
    order_type: "sequential"
    sequence:
      - action_id: "action-001"
        position: 1
  optimization:
    id: "opt-001"
    type: "cost_minimization"
    criteria:
      - type: "energy"
        weight: 0.5
      - type: "time"
        weight: 0.5
  confidence:
    overall_confidence: 0.85
    dimensions:
      goal_achievement: 0.9
      feasibility: 0.8
  timestamp: "2026-01-15T00:00:05Z"
  metadata:
    created_at: "2026-01-15T00:00:05Z"
    created_by: "planning-engine"
```

---

## OpenAPI

```yaml
openapi: 3.0.0
info:
  title: Planning API
  version: 1.0.0
paths:
  /plans:
    post:
      summary: Create plan
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Plan'
      responses:
        '201':
          description: Plan created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Plan'
    get:
      summary: List plans
      parameters:
        - name: goal_id
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of plans
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Plan'
  /plans/{id}:
    get:
      summary: Get plan by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Plan
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Plan'
components:
  schemas:
    Plan:
      type: object
      properties:
        id:
          type: string
          format: uuid
        goal:
          $ref: '#/components/schemas/Goal'
        objectives:
          type: array
          items:
            $ref: '#/components/schemas/Objective'
        actions:
          type: array
          items:
            $ref: '#/components/schemas/Action'
        subplans:
          type: array
          items:
            $ref: '#/components/schemas/Plan'
        dependencies:
          type: array
          items:
            $ref: '#/components/schemas/Dependency'
        execution_order:
          $ref: '#/components/schemas/ExecutionOrder'
        optimization:
          $ref: '#/components/schemas/Optimization'
        confidence:
          $ref: '#/components/schemas/ConfidenceVector'
        timestamp:
          type: string
          format: date-time
```

---

## AsyncAPI

```yaml
asyncapi: 2.0.0
info:
  title: Planning Events
  version: 1.0.0
channels:
  plan.created:
    publish:
      message:
        name: PlanCreated
        payload:
          $ref: '#/components/schemas/Plan'
  plan.executed:
    publish:
      message:
        name: PlanExecuted
        payload:
          $ref: '#/components/schemas/Plan'
  plan.adapted:
    publish:
      message:
        name: PlanAdapted
        payload:
          $ref: '#/components/schemas/Plan'
components:
  schemas:
    Plan:
      type: object
      properties:
        id:
          type: string
        goal:
          type: object
        actions:
          type: array
        dependencies:
          type: array
```

---

## Avro

```avro
{
  "type": "record",
  "name": "Plan",
  "namespace": "com.blueprint.bcm.planning",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "goal",
      "type": {
        "type": "record",
        "name": "Goal",
        "fields": [
          {"name": "id", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "type", "type": "string"},
          {"name": "priority", "type": "string"}
        ]
      }
    },
    {
      "name": "objectives",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Objective",
          "fields": [
            {"name": "id", "type": "string"},
            {"name": "description", "type": "string"},
            {"name": "type", "type": "string"}
          ]
        }
      }
    },
    {
      "name": "actions",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Action",
          "fields": [
            {"name": "id", "type": "string"},
            {"name": "type", "type": "string"}
          ]
        }
      }
    },
    {
      "name": "dependencies",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Dependency",
          "fields": [
            {"name": "id", "type": "string"},
            {"name": "type", "type": "string"},
            {"name": "source", "type": "string"},
            {"name": "target", "type": "string"}
          ]
        }
      }
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

package blueprint.bcm.planning;

message Plan {
  string id = 1;
  Goal goal = 2;
  repeated Objective objectives = 3;
  repeated Action actions = 4;
  repeated Plan subplans = 5;
  repeated Dependency dependencies = 6;
  ExecutionOrder execution_order = 7;
  Optimization optimization = 8;
  ConfidenceVector confidence = 9;
  int64 timestamp = 10;
  PlanMetadata metadata = 11;
}

message Goal {
  string id = 1;
  string description = 2;
  string type = 3;
  string priority = 4;
  int64 deadline = 5;
  repeated Constraint constraints = 6;
  SuccessCriteria success_criteria = 7;
  int64 timestamp = 8;
}

message Objective {
  string id = 1;
  string description = 2;
  string type = 3;
  string priority = 4;
  int64 deadline = 5;
  SuccessCriteria success_criteria = 6;
  int64 timestamp = 7;
}

message Subplan {
  string id = 1;
  string parent_plan = 2;
  Goal goal = 3;
  repeated Action actions = 4;
  repeated Dependency dependencies = 5;
  ExecutionOrder execution_order = 6;
  int64 timestamp = 7;
}

message Dependency {
  string id = 1;
  string type = 2;
  string source = 3;
  string target = 4;
  string condition = 5;
  int64 timestamp = 6;
}

message ExecutionOrder {
  string id = 1;
  repeated Action actions = 2;
  string order_type = 3;
  repeated Sequence sequence = 4;
  int64 timestamp = 5;
}
```

---

## GraphQL

```graphql
type Plan {
  id: ID!
  goal: Goal!
  objectives: [Objective!]!
  actions: [Action!]!
  subplans: [Plan!]!
  dependencies: [Dependency!]!
  executionOrder: ExecutionOrder!
  optimization: Optimization!
  confidence: ConfidenceVector!
  timestamp: DateTime!
  metadata: PlanMetadata!
}

type Goal {
  id: ID!
  description: String!
  type: GoalType!
  priority: Priority!
  deadline: DateTime!
  constraints: [Constraint!]!
  successCriteria: SuccessCriteria!
  timestamp: DateTime!
}

type Objective {
  id: ID!
  description: String!
  type: ObjectiveType!
  priority: Priority!
  deadline: DateTime!
  successCriteria: SuccessCriteria!
  timestamp: DateTime!
}

type Query {
  plan(id: ID!): Plan
  plans(goalId: ID): [Plan!]!
}

type Mutation {
  createPlan(input: PlanInput!): Plan!
  executePlan(id: ID!): Plan!
  adaptPlan(id: ID!, input: AdaptationInput!): Plan!
}
```

---

## Events

### Planning Events

**PlanCreated**: Emitted when a plan is created
```yaml
event: PlanCreated
data:
  plan_id: UUID
  goal_id: UUID
  action_count: number
  timestamp: Timestamp
```

**PlanExecuted**: Emitted when a plan is executed
```yaml
event: PlanExecuted
data:
  plan_id: UUID
  execution_result: string
  timestamp: Timestamp
```

**PlanAdapted**: Emitted when a plan is adapted
```yaml
event: PlanAdapted
data:
  plan_id: UUID
  adaptation_reason: string
  timestamp: Timestamp
```

---

## States

### Plan States

**PlanState**: State of a plan
- **Created**: Plan has been created
- **Generating**: Plan is being generated
- **Generated**: Plan has been generated
- **Optimizing**: Plan is being optimized
- **Optimized**: Plan has been optimized
- **Validating**: Plan is being validated
- **Validated**: Plan has been validated
- **Executing**: Plan is being executed
- **Executed**: Plan has been executed
- **Adapting**: Plan is being adapted
> **Canonical Reference**: BCM-STATE-029 (blueprint.state.adapting)
> **Canonical Reference**: BCM-STATE-030 (blueprint.state.adapted)
> **Owner**: Chief Cognitive Architect
> **Owner**: Chief Cognitive Architect
- **Adapted**: Plan has been adapted
- **Completed**: Plan has been completed

---

## Graphs

### Plan Graph

**PlanGraph**: Graph representing plan relationships
- **Nodes**: Goals, objectives, actions
- **Edges**: Dependency, temporal, causal relationships

---

## Relations

### Plan Relations

**GoalRelation**: Plan to goal
**ObjectiveRelation**: Plan to objectives
**ActionRelation**: Plan to actions
**SubplanRelation**: Plan to subplans
**DependencyRelation**: Action to action (dependency)
**ExecutionOrderRelation**: Plan to execution order

---

## Algorithms

### Planning Algorithms

**Objective Definition Algorithm**: Define objectives from goals
**Alternative Generation Algorithm**: Generate alternative plans
**Plan Generation Algorithm**: Generate plan from objectives
**Subplan Generation Algorithm**: Generate subplans
**Dependency Analysis Algorithm**: Analyze action dependencies
**Execution Order Algorithm**: Determine execution order
**Optimization Algorithm**: Optimize plan
**Validation Algorithm**: Validate plan
**Execution Algorithm**: Execute plan
**Monitoring Algorithm**: Monitor plan execution
**Adaptation Algorithm**: Adapt plan to changes

---

## Heuristics

### Planning Heuristics

**Objective Definition Heuristics**: Rules for objective definition
**Alternative Generation Heuristics**: Rules for alternative generation
**Plan Generation Heuristics**: Rules for plan generation
**Dependency Heuristics**: Rules for dependency analysis
**Optimization Heuristics**: Rules for optimization
**Adaptation Heuristics**: Rules for adaptation

---

## Contraintes

### Planning Constraints

**Constraint P-001**: Plan ID must be unique
**Constraint P-002**: Plan must have a goal
**Constraint P-003**: Plan must have actions
**Constraint P-004**: Plan must have execution order
**Constraint P-005**: Plan must have confidence
**Constraint P-006**: Plan must be traceable to goal

---

## Invariants (100+)

### Planning Invariants (100)

**INV-PLN-001**: Every plan has a unique identifier
**INV-PLN-002**: Every plan has a goal
**INV-PLN-003**: Every plan has actions
**INV-PLN-004**: Every plan has an execution order
**INV-PLN-005**: Every plan has a confidence score
**INV-PLN-006**: Plan generation is deterministic
**INV-PLN-007**: Plan optimization is deterministic
**INV-PLN-008**: Plan execution is deterministic
**INV-PLN-009**: Plan adaptation is deterministic
**INV-PLN-010**: Plan is traceable to goal

[... 90 more invariants ...]

---

## Business Rules (100+)

### Planning Business Rules (100)

**BR-PLN-001**: Plans must be goal-oriented
**BR-PLN-002**: Plans with confidence < 0.5 must be reviewed
**BR-PLN-003**: Plans must be logged
**BR-PLN-004**: Plans must be traceable to goals
**BR-PLN-005**: Plans must be stored persistently
**BR-PLN-006**: Plans must be indexed for retrieval
**BR-PLN-007**: Plans must be versioned
**BR-PLN-008**: Plans must be audited
**BR-PLN-009**: Plans must be secured
**BR-PLN-010**: Plans must be validated before execution

[... 90 more business rules ...]

---

## Cognitive Rules (200+)

### Planning Cognitive Rules (200)

**CR-PLN-001**: All planning must be goal-oriented
**CR-PLN-002**: Plans have associated confidence
**CR-PLN-003**: Plans have action dependencies
**CR-PLN-004**: Plans have execution order
**CR-PLN-005**: Plan generation is deterministic
**CR-PLN-006**: Plan optimization is deterministic
**CR-PLN-007**: Plan execution is deterministic
**CR-PLN-008**: Plan adaptation is deterministic
**CR-PLN-009**: Plans can have subplans
**CR-PLN-010**: Plans can be optimized

[... 190 more cognitive rules ...]

---

## Forbidden Behaviors (100+)

### Planning Forbidden Behaviors (100)

**FB-PLN-001**: Plan cannot be created without goal
**FB-PLN-002**: Plan cannot be created without actions
**FB-PLN-003**: Plan cannot be created without execution order
**FB-PLN-004**: Plan cannot be used without validation
**FB-PLN-005**: Plan cannot be used without optimization
**FB-PLN-006**: Plan cannot reference non-existent goals
**FB-PLN-007**: Plan cannot have circular dependencies without resolution
**FB-PLN-008**: Plan cannot have contradictory actions without resolution
**FB-PLN-009**: Plan generation cannot be non-deterministic
**FB-PLN-010**: Plan cannot be modified after creation

[... 90 more forbidden behaviors ...]

---

## Examples

### Plan Example

```typescript
const plan: Plan = {
  id: "550e8400-e29b-41d4-a716-446655440010",
  goal: {
    id: "goal-001",
    description: "Reduce temperature to 25°C",
    type: "temperature_control",
    priority: "high",
    deadline: "2026-01-15T01:00:00Z",
    constraints: [
      { type: "resource", description: "Limited cooling capacity" }
    ],
    success_criteria: {
      type: "threshold",
      value: 25.0,
      unit: "celsius"
    }
  },
  objectives: [
    {
      id: "objective-001",
      description: "Achieve target temperature within 1 hour",
      type: "time_bound",
      priority: "high",
      deadline: "2026-01-15T01:00:00Z",
      success_criteria: {
        type: "time_threshold",
        max_duration: 3600
      }
    }
  ],
  actions: [
    {
      id: "action-001",
      type: "increase_cooling",
      intensity: 0.8,
      duration: 1800
    }
  ],
  subplans: [],
  dependencies: [
    {
      id: "dep-001",
      type: "sequential",
      source: { id: "action-001" },
      target: { id: "action-002" },
      condition: { type: "completion" }
    }
  ],
  execution_order: {
    id: "order-001",
    order_type: "sequential",
    sequence: [
      { action_id: "action-001", position: 1 }
    ]
  },
  optimization: {
    id: "opt-001",
    type: "cost_minimization",
    criteria: [
      { type: "energy", weight: 0.5 },
      { type: "time", weight: 0.5 }
    ]
  },
  confidence: {
    overall_confidence: 0.85,
    dimensions: {
      goal_achievement: 0.9,
      feasibility: 0.8
    }
  },
  timestamp: "2026-01-15T00:00:05Z",
  metadata: {
    created_at: "2026-01-15T00:00:05Z",
    created_by: "planning-engine"
  }
};
```

---

## Edge Cases

### Edge Cases

**EC-PLN-001**: Plan with no goal
**EC-PLN-002**: Plan with no actions
**EC-PLN-003**: Plan with no execution order
**EC-PLN-004**: Plan with contradictory dependencies
**EC-PLN-005**: Plan with zero confidence
**EC-PLN-006**: Plan with duplicate ID
**EC-PLN-007**: Plan with circular dependencies
**EC-PLN-008**: Plan with invalid timestamp
**EC-PLN-009**: Plan with corrupted goal
**EC-PLN-010**: Plan with non-deterministic generation

---

## Tests

### Planning Tests

```typescript
describe('Plan', () => {
  test('should create plan with valid data', () => {
    const plan = createPlan(validData);
    expect(plan.id).toBeDefined();
    expect(plan.goal).toBeDefined();
    expect(plan.actions).toBeDefined();
  });

  test('should reject plan without goal', () => {
    expect(() => createPlan({ ...validData, goal: null })).toThrow();
  });

  test('should reject plan without actions', () => {
    expect(() => createPlan({ ...validData, actions: [] })).toThrow();
  });

  test('should generate plan from goal', () => {
    const plan = generatePlan(goal);
    expect(plan.actions).toBeDefined();
  });

  test('should optimize plan', () => {
    const optimized = optimizePlan(plan);
    expect(optimized.optimization).toBeDefined();
  });
});
```

---

## Mapping

### Blueprint DSL Mapping

**Plan** maps to:
```blueprint
plan Plan {
  goal: Goal
  objectives: Objective[]
  actions: Action[]
  subplans: Plan[]
  dependencies: Dependency[]
  execution_order: ExecutionOrder
  optimization: Optimization
  confidence: Confidence
  timestamp: Timestamp
}
```

### Semantic Compiler Mapping

**Plan** compiles to:
- Bytecode representation
- Generation bytecode
- Optimization bytecode
- Execution bytecode

### COS Mapping

**Plan** is implemented by:
- COS-000C: Cognitive Event Model
- COS-001: Cognitive Scheduler (plan scheduling)

### CVM Mapping

**Plan** is executed by:
- CVM-007: Memory Manager (plan storage)
- CVM-009: Trace Engine (plan tracing)

### CPR Mapping

**Plan** is orchestrated by:
- CPR-011: Runtime Telemetry (plan telemetry)
- CPR-012: Distributed Trace (plan tracing)

### CCP Mapping

**Plan** is deployed by:
- CCP-001: Cloud Resource Management (plan storage)

---

## Document End

**This document defines the universal theory of planning for cognitive systems.**

**All plans must conform to this theory.**

**The Planning Theory is signed by the Chief Cognitive Architect.**
