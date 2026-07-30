# BCM-014: Meta-Reasoning Theory

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | BCM-014 |
| **Title** | Meta-Reasoning Theory |
| **Version** | 1.0.0 |
| **Status** | Final |
| **Created** | 2026-01-15 |
| **Author** | Chief Cognitive Architect |
| **Purpose** | Universal theory of meta-reasoning for cognitive systems |
| **Scope** | Entire Blueprint Enterprise platform |

---

## Vision

The Meta-Reasoning Theory provides the universal foundation for how cognitive systems reason about their own reasoning processes. It defines the physics of meta-reasoning, independent of any domain, meta-reasoning type, or implementation.

**Vision**: All cognitive systems must perform meta-reasoning through a unified, formal, and verifiable meta-reasoning model.

---

## Theory

### Core Theory

**Meta-reasoning is the process of reasoning about reasoning.**

**Key Principles**:
1. **Reflection**: Meta-reasoning requires reflection on reasoning
2. **Evaluation**: Meta-reasoning evaluates reasoning quality
3. **Control**: Meta-reasoning controls reasoning processes
4. **Optimization**: Meta-reasoning optimizes reasoning
5. **Explanation**: Meta-reasoning provides explanations
6. **Debugging**: Meta-reasoning enables debugging of reasoning
7. **Learning**: Meta-reasoning can learn from reasoning
8. **Determinism**: Meta-reasoning operations are deterministic
9. **Verifiability**: Meta-reasoning must be verifiable
10. **Traceability**: Meta-reasoning must be traceable to reasoning

### Meta-Reasoning Lifecycle

```
Reasoning Process
    ↓
Reflection
    ↓
Evaluation
    ↓
Control Decision
    ↓
Optimization
    ↓
Explanation Generation
    ↓
Debugging
    ↓
Meta-Learning
    ↓
Meta-Reasoning Storage
    ↓
Meta-Reasoning Retrieval
    ↓
Meta-Reasoning Use
```

---

## Formal Definitions

### Meta-Reasoning

**Definition**: A meta-reasoning is a tuple MR = (id, type, target_reasoning, reflection, evaluation, control, optimization, explanation, confidence, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- type: MetaReasoningType (meta-reasoning type)
- target_reasoning: Reasoning (target reasoning)
- reflection: Reflection (meta-reasoning reflection)
- evaluation: Evaluation (meta-reasoning evaluation)
- control: Control (meta-reasoning control)
- optimization: Optimization (meta-reasoning optimization)
- explanation: Explanation (meta-reasoning explanation)
- confidence: ConfidenceVector (confidence vector)
- timestamp: Timestamp (meta-reasoning timestamp)
- metadata: MetaReasoningMetadata (meta-reasoning metadata)

### Meta-Reasoning Types

**Meta-Cognition**: Reasoning about cognitive processes
**Meta-Learning**: Reasoning about learning processes
**Meta-Planning**: Reasoning about planning processes
**Meta-Decision**: Reasoning about decision processes
**Meta-Memory**: Reasoning about memory processes
**Meta-Attention**: Reasoning about attention processes
**Meta-Perception**: Reasoning about perception processes
**Meta-Action**: Reasoning about action processes

### Reflection

**Definition**: A reflection is a tuple R = (id, target, reflection_type, reflection_content, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- target: Reasoning (reflection target)
- reflection_type: ReflectionType (reflection type)
- reflection_content: ReflectionContent (reflection content)
- timestamp: Timestamp (reflection timestamp)
- metadata: ReflectionMetadata (reflection metadata)

### Evaluation

**Definition**: An evaluation is a tuple E = (id, target, evaluation_type, evaluation_criteria, evaluation_result, confidence, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- target: Reasoning (evaluation target)
- evaluation_type: EvaluationType (evaluation type)
- evaluation_criteria: EvaluationCriteria[] (evaluation criteria)
- evaluation_result: EvaluationResult (evaluation result)
- confidence: ConfidenceVector (confidence vector)
- timestamp: Timestamp (evaluation timestamp)
- metadata: EvaluationMetadata (evaluation metadata)

### Control

**Definition**: A control is a tuple C = (id, target, control_type, control_action, control_effect, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- target: Reasoning (control target)
- control_type: ControlType (control type)
- control_action: ControlAction (control action)
- control_effect: ControlEffect (control effect)
- timestamp: Timestamp (control timestamp)
- metadata: ControlMetadata (control metadata)

### Optimization

**Definition**: An optimization is a tuple O = (id, target, optimization_type, optimization_strategy, optimization_result, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- target: Reasoning (optimization target)
- optimization_type: OptimizationType (optimization type)
- optimization_strategy: OptimizationStrategy (optimization strategy)
- optimization_result: OptimizationResult (optimization result)
- timestamp: Timestamp (optimization timestamp)
- metadata: OptimizationMetadata (optimization metadata)

### Explanation

**Definition**: An explanation is a tuple E = (id, target, explanation_type, explanation_content, explanation_quality, timestamp, metadata)

**Formal Specification**:
- id: UUID (unique identifier)
- target: Reasoning (explanation target)
- explanation_type: ExplanationType (explanation type)
- explanation_content: ExplanationContent (explanation content)
- explanation_quality: QualityScore (explanation quality)
- timestamp: Timestamp (explanation timestamp)
- metadata: ExplanationMetadata (explanation metadata)

---

## Conceptual Model

### Meta-Reasoning Model

```
┌─────────────────────────────────────────────────────┐
│               Meta-Reasoning Model                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐              │
│  │  Reasoning  │───→│  Meta-       │              │
│  └─────────────┘    │  Reasoning   │              │
│                    └──────┬──────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Reflection    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Evaluation    │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Control       │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Optimization  │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Explanation   │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Debugging     │              │
│                  └────────┬────────┘              │
│                           │                         │
│                           ↓                         │
│                  ┌─────────────────┐              │
│                  │  Meta-Learning │              │
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

### Meta-Reasoning Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│          Meta-Reasoning Layer Architecture            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐              │
│  │  Reasoning  │    │  Cognitive   │              │
│  └──────┬──────┘    └──────┬──────┘              │
│         │                  │                         │
│         ↓                  ↓                         │
│  ┌─────────────────────────┴────────┐              │
│  │      Meta-Reasoning Manager      │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│         ┌────────┴────────┐                        │
│         ↓                 ↓                         │
│  ┌─────────────┐  ┌─────────────┐                │
│  │ Reflection  │  │ Evaluation  │                │
│  │ Engine      │  │ Engine      │                │
│  └──────┬──────┘  └──────┬──────┘                │
│         │                │                         │
│         ↓                ↓                         │
│  ┌─────────────────────────────────┐              │
│  │    Control Engine               │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Optimization Engine          │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Explanation Engine          │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Debugging Engine            │              │
│  └───────────────┬───────────────┘              │
│                  │                                 │
│                  ↓                                 │
│  ┌─────────────────────────────────┐              │
│  │    Meta-Learning Engine         │              │
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

### Meta-Reasoning Interface

```typescript
interface MetaReasoning {
  id: UUID;
  type: MetaReasoningType;
  target_reasoning: Reasoning;
  reflection: Reflection;
  evaluation: Evaluation;
  control: Control;
  optimization: Optimization;
  explanation: Explanation;
  confidence: ConfidenceVector;
  timestamp: Timestamp;
  metadata: MetaReasoningMetadata;
}

interface Reflection {
  id: UUID;
  target: Reasoning;
  reflection_type: ReflectionType;
  reflection_content: ReflectionContent;
  timestamp: Timestamp;
  metadata: ReflectionMetadata;
}

interface Evaluation {
  id: UUID;
  target: Reasoning;
  evaluation_type: EvaluationType;
  evaluation_criteria: EvaluationCriteria[];
  evaluation_result: EvaluationResult;
  confidence: ConfidenceVector;
  timestamp: Timestamp;
  metadata: EvaluationMetadata;
}

interface Control {
  id: UUID;
  target: Reasoning;
  control_type: ControlType;
  control_action: ControlAction;
  control_effect: ControlEffect;
  timestamp: Timestamp;
  metadata: ControlMetadata;
}

interface Optimization {
  id: UUID;
  target: Reasoning;
  optimization_type: OptimizationType;
  optimization_strategy: OptimizationStrategy;
  optimization_result: OptimizationResult;
  timestamp: Timestamp;
  metadata: OptimizationMetadata;
}

interface Explanation {
  id: UUID;
  target: Reasoning;
  explanation_type: ExplanationType;
  explanation_content: ExplanationContent;
  explanation_quality: QualityScore;
  timestamp: Timestamp;
  metadata: ExplanationMetadata;
}
```

---

## Rust Interfaces

### Meta-Reasoning Struct

```rust
use uuid::Uuid;
use std::collections::HashMap;
use std::time::{Duration, SystemTime};

#[derive(Debug, Clone)]
pub struct MetaReasoning {
    pub id: Uuid,
    pub r#type: MetaReasoningType,
    pub target_reasoning: Reasoning,
    pub reflection: Reflection,
    pub evaluation: Evaluation,
    pub control: Control,
    pub optimization: Optimization,
    pub explanation: Explanation,
    pub confidence: ConfidenceVector,
    pub timestamp: SystemTime,
    pub metadata: MetaReasoningMetadata,
}

#[derive(Debug, Clone)]
pub struct Reflection {
    pub id: Uuid,
    pub target: Reasoning,
    pub reflection_type: ReflectionType,
    pub reflection_content: ReflectionContent,
    pub timestamp: SystemTime,
    pub metadata: ReflectionMetadata,
}

#[derive(Debug, Clone)]
pub struct Evaluation {
    pub id: Uuid,
    pub target: Reasoning,
    pub evaluation_type: EvaluationType,
    pub evaluation_criteria: Vec<EvaluationCriteria>,
    pub evaluation_result: EvaluationResult,
    pub confidence: ConfidenceVector,
    pub timestamp: SystemTime,
    pub metadata: EvaluationMetadata,
}

#[derive(Debug, Clone)]
pub struct Control {
    pub id: Uuid,
    pub target: Reasoning,
    pub control_type: ControlType,
    pub control_action: ControlAction,
    pub control_effect: ControlEffect,
    pub timestamp: SystemTime,
    pub metadata: ControlMetadata,
}

#[derive(Debug, Clone)]
pub struct Optimization {
    pub id: Uuid,
    pub target: Reasoning,
    pub optimization_type: OptimizationType,
    pub optimization_strategy: OptimizationStrategy,
    pub optimization_result: OptimizationResult,
    pub timestamp: SystemTime,
    pub metadata: OptimizationMetadata,
}

#[derive(Debug, Clone)]
pub struct Explanation {
    pub id: Uuid,
    pub target: Reasoning,
    pub explanation_type: ExplanationType,
    pub explanation_content: ExplanationContent,
    pub explanation_quality: QualityScore,
    pub timestamp: SystemTime,
    pub metadata: ExplanationMetadata,
}
```

---

## Go Interfaces

### Meta-Reasoning Struct

```go
package bcm

import (
    "time"
    "github.com/google/uuid"
)

type MetaReasoning struct {
    ID               uuid.UUID
    Type             MetaReasoningType
    TargetReasoning  Reasoning
    Reflection       Reflection
    Evaluation       Evaluation
    Control          Control
    Optimization     Optimization
    Explanation      Explanation
    Confidence       ConfidenceVector
    Timestamp        time.Time
    Metadata         MetaReasoningMetadata
}

type Reflection struct {
    ID               uuid.UUID
    Target           Reasoning
    ReflectionType   ReflectionType
    ReflectionContent ReflectionContent
    Timestamp        time.Time
    Metadata         ReflectionMetadata
}

type Evaluation struct {
    ID                uuid.UUID
    Target            Reasoning
    EvaluationType    EvaluationType
    EvaluationCriteria []EvaluationCriteria
    EvaluationResult  EvaluationResult
    Confidence        ConfidenceVector
    Timestamp         time.Time
    Metadata          EvaluationMetadata
}

type Control struct {
    ID            uuid.UUID
    Target        Reasoning
    ControlType   ControlType
    ControlAction ControlAction
    ControlEffect ControlEffect
    Timestamp     time.Time
    Metadata      ControlMetadata
}

type Optimization struct {
    ID                 uuid.UUID
    Target             Reasoning
    OptimizationType   OptimizationType
    OptimizationStrategy OptimizationStrategy
    OptimizationResult OptimizationResult
    Timestamp          time.Time
    Metadata           OptimizationMetadata
}

type Explanation struct {
    ID                 uuid.UUID
    Target             Reasoning
    ExplanationType    ExplanationType
    ExplanationContent ExplanationContent
    ExplanationQuality QualityScore
    Timestamp          time.Time
    Metadata           ExplanationMetadata
}
```

---

## Java Interfaces

### Meta-Reasoning Interface

```java
package com.blueprint.bcm.metareasoning;

import java.util.*;
import java.time.*;

public interface IMetaReasoning {
    UUID getId();
    MetaReasoningType getType();
    IReasoning getTargetReasoning();
    IReflection getReflection();
    IEvaluation getEvaluation();
    IControl getControl();
    IOptimization getOptimization();
    IExplanation getExplanation();
    IConfidenceVector getConfidence();
    Instant getTimestamp();
    IMetaReasoningMetadata getMetadata();
}

public interface IReflection {
    UUID getId();
    IReasoning getTarget();
    ReflectionType getReflectionType();
    IReflectionContent getReflectionContent();
    Instant getTimestamp();
    IReflectionMetadata getMetadata();
}

public interface IEvaluation {
    UUID getId();
    IReasoning getTarget();
    EvaluationType getEvaluationType();
    List<IEvaluationCriteria> getEvaluationCriteria();
    IEvaluationResult getEvaluationResult();
    IConfidenceVector getConfidence();
    Instant getTimestamp();
    IEvaluationMetadata getMetadata();
}

public interface IControl {
    UUID getId();
    IReasoning getTarget();
    ControlType getControlType();
    IControlAction getControlAction();
    IControlEffect getControlEffect();
    Instant getTimestamp();
    IControlMetadata getMetadata();
}

public interface IOptimization {
    UUID getId();
    IReasoning getTarget();
    OptimizationType getOptimizationType();
    IOptimizationStrategy getOptimizationStrategy();
    IOptimizationResult getOptimizationResult();
    Instant getTimestamp();
    IOptimizationMetadata getMetadata();
}

public interface IExplanation {
    UUID getId();
    IReasoning getTarget();
    ExplanationType getExplanationType();
    IExplanationContent getExplanationContent();
    IQualityScore getExplanationQuality();
    Instant getTimestamp();
    IExplanationMetadata getMetadata();
}
```

---

## Kotlin Interfaces

### Meta-Reasoning Data Class

```kotlin
package com.blueprint.bcm.metareasoning

import java.util.*
import java.time.*

data class MetaReasoning(
    val id: UUID,
    val type: MetaReasoningType,
    val targetReasoning: Reasoning,
    val reflection: Reflection,
    val evaluation: Evaluation,
    val control: Control,
    val optimization: Optimization,
    val explanation: Explanation,
    val confidence: ConfidenceVector,
    val timestamp: Instant,
    val metadata: MetaReasoningMetadata
)

data class Reflection(
    val id: UUID,
    val target: Reasoning,
    val reflectionType: ReflectionType,
    val reflectionContent: ReflectionContent,
    val timestamp: Instant,
    val metadata: ReflectionMetadata
)

data class Evaluation(
    val id: UUID,
    val target: Reasoning,
    val evaluationType: EvaluationType,
    val evaluationCriteria: List<EvaluationCriteria>,
    val evaluationResult: EvaluationResult,
    val confidence: ConfidenceVector,
    val timestamp: Instant,
    val metadata: EvaluationMetadata
)

data class Control(
    val id: UUID,
    val target: Reasoning,
    val controlType: ControlType,
    val controlAction: ControlAction,
    val controlEffect: ControlEffect,
    val timestamp: Instant,
    val metadata: ControlMetadata
)

data class Optimization(
    val id: UUID,
    val target: Reasoning,
    val optimizationType: OptimizationType,
    val optimizationStrategy: OptimizationStrategy,
    val optimizationResult: OptimizationResult,
    val timestamp: Instant,
    val metadata: OptimizationMetadata
)

data class Explanation(
    val id: UUID,
    val target: Reasoning,
    val explanationType: ExplanationType,
    val explanationContent: ExplanationContent,
    val explanationQuality: QualityScore,
    val timestamp: Instant,
    val metadata: ExplanationMetadata
)
```

---

## C# Interfaces

### Meta-Reasoning Interface

```csharp
using System;
using System.Collections.Generic;

namespace Blueprint.BCM.MetaReasoning
{
    public interface IMetaReasoning
    {
        Guid Id { get; }
        MetaReasoningType Type { get; }
        IReasoning TargetReasoning { get; }
        IReflection Reflection { get; }
        IEvaluation Evaluation { get; }
        IControl Control { get; }
        IOptimization Optimization { get; }
        IExplanation Explanation { get; }
        IConfidenceVector Confidence { get; }
        DateTime Timestamp { get; }
        IMetaReasoningMetadata Metadata { get; }
    }

    public interface IReflection
    {
        Guid Id { get; }
        IReasoning Target { get; }
        ReflectionType ReflectionType { get; }
        IReflectionContent ReflectionContent { get; }
        DateTime Timestamp { get; }
        IReflectionMetadata Metadata { get; }
    }

    public interface IEvaluation
    {
        Guid Id { get; }
        IReasoning Target { get; }
        EvaluationType EvaluationType { get; }
        IList<IEvaluationCriteria> EvaluationCriteria { get; }
        IEvaluationResult EvaluationResult { get; }
        IConfidenceVector Confidence { get; }
        DateTime Timestamp { get; }
        IEvaluationMetadata Metadata { get; }
    }

    public interface IControl
    {
        Guid Id { get; }
        IReasoning Target { get; }
        ControlType ControlType { get; }
        IControlAction ControlAction { get; }
        IControlEffect ControlEffect { get; }
        DateTime Timestamp { get; }
        IControlMetadata Metadata { get; }
    }

    public interface IOptimization
    {
        Guid Id { get; }
        IReasoning Target { get; }
        OptimizationType OptimizationType { get; }
        IOptimizationStrategy OptimizationStrategy { get; }
        IOptimizationResult OptimizationResult { get; }
        DateTime Timestamp { get; }
        IOptimizationMetadata Metadata { get; }
    }

    public interface IExplanation
    {
        Guid Id { get; }
        IReasoning Target { get; }
        ExplanationType ExplanationType { get; }
        IExplanationContent ExplanationContent { get; }
        IQualityScore ExplanationQuality { get; }
        DateTime Timestamp { get; }
        IExplanationMetadata Metadata { get; }
    }
}
```

---

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MetaReasoning",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "type": {
      "type": "string"
    },
    "target_reasoning": {
      "$ref": "#/definitions/Reasoning"
    },
    "reflection": {
      "$ref": "#/definitions/Reflection"
    },
    "evaluation": {
      "$ref": "#/definitions/Evaluation"
    },
    "control": {
      "$ref": "#/definitions/Control"
    },
    "optimization": {
      "$ref": "#/definitions/Optimization"
    },
    "explanation": {
      "$ref": "#/definitions/Explanation"
    },
    "confidence": {
      "$ref": "#/definitions/ConfidenceVector"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "metadata": {
      "$ref": "#/definitions/MetaReasoningMetadata"
    }
  },
  "required": ["id", "type", "target_reasoning", "confidence", "timestamp"],
  "definitions": {
    "Reflection": {
      "type": "object",
      "properties": {
        "id": {"type": "string", "format": "uuid"},
        "reflection_type": {"type": "string"},
        "reflection_content": {"type": "object"}
      }
    },
    "Evaluation": {
      "type": "object",
      "properties": {
        "id": {"type": "string", "format": "uuid"},
        "evaluation_type": {"type": "string"},
        "evaluation_criteria": {"type": "array"},
        "evaluation_result": {"type": "object"}
      }
    }
  }
}
```

---

## YAML

```yaml
meta_reasoning:
  id: "550e8400-e29b-41d4-a716-446655440014"
  type: "meta_cognition"
  target_reasoning:
    id: "reasoning-001"
    type: "deduction"
  reflection:
    id: "reflection-001"
    reflection_type: "process_analysis"
    reflection_content:
      process_steps: 5
      process_duration: 1000
      process_quality: 0.85
  evaluation:
    id: "evaluation-001"
    evaluation_type: "quality_assessment"
    evaluation_criteria:
      - type: "logical_validity"
        weight: 0.5
      - type: "efficiency"
        weight: 0.3
      - type: "completeness"
        weight: 0.2
    evaluation_result:
      overall_score: 0.85
      criterion_scores:
        logical_validity: 0.9
        efficiency: 0.8
        completeness: 0.85
  control:
    id: "control-001"
    control_type: "process_adjustment"
    control_action:
      type: "optimize"
      parameter: "step_order"
      value: "reorder"
    control_effect:
      efficiency_improvement: 0.1
  optimization:
    id: "optimization-001"
    optimization_type: "process_optimization"
    optimization_strategy:
      type: "pruning"
      target: "redundant_steps"
    optimization_result:
      steps_removed: 2
      efficiency_gain: 0.15
  explanation:
    id: "explanation-001"
    explanation_type: "trace_explanation"
    explanation_content:
      summary: "Reasoning process completed with high quality"
      steps:
        - step: 1
          description: "Premise validation"
        - step: 2
          description: "Inference generation"
    explanation_quality: 0.9
  confidence:
    overall_confidence: 0.85
    dimensions:
      reflection_accuracy: 0.85
      evaluation_validity: 0.9
  timestamp: "2026-01-15T00:00:05Z"
  metadata:
    created_at: "2026-01-15T00:00:05Z"
    created_by: "metareasoning-engine"
```

---

## OpenAPI

```yaml
openapi: 3.0.0
info:
  title: Meta-Reasoning API
  version: 1.0.0
paths:
  /metareasoning:
    post:
      summary: Create meta-reasoning
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MetaReasoning'
      responses:
        '201':
          description: Meta-reasoning created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetaReasoning'
    get:
      summary: List meta-reasoning
      parameters:
        - name: type
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of meta-reasoning
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MetaReasoning'
  /metareasoning/{id}:
    get:
      summary: Get meta-reasoning by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Meta-reasoning
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetaReasoning'
components:
  schemas:
    MetaReasoning:
      type: object
      properties:
        id:
          type: string
          format: uuid
        type:
          type: string
        target_reasoning:
          $ref: '#/components/schemas/Reasoning'
        reflection:
          $ref: '#/components/schemas/Reflection'
        evaluation:
          $ref: '#/components/schemas/Evaluation'
        control:
          $ref: '#/components/schemas/Control'
        optimization:
          $ref: '#/components/schemas/Optimization'
        explanation:
          $ref: '#/components/schemas/Explanation'
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
  title: Meta-Reasoning Events
  version: 1.0.0
channels:
  metareasoning.created:
    publish:
      message:
        name: MetaReasoningCreated
        payload:
          $ref: '#/components/schemas/MetaReasoning'
  metareasoning.completed:
    publish:
      message:
        name: MetaReasoningCompleted
        payload:
          $ref: '#/components/schemas/MetaReasoning'
  reasoning.evaluated:
    publish:
      message:
        name: ReasoningEvaluated
        payload:
          $ref: '#/components/schemas/Evaluation'
components:
  schemas:
    MetaReasoning:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        target_reasoning:
          type: object
```

---

## Avro

```avro
{
  "type": "record",
  "name": "MetaReasoning",
  "namespace": "com.blueprint.bcm.metareasoning",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "type",
      "type": "string"
    },
    {
      "name": "target_reasoning",
      "type": "string"
    },
    {
      "name": "evaluation",
      "type": {
        "type": "record",
        "name": "Evaluation",
        "fields": [
          {"name": "evaluation_type", "type": "string"},
          {"name": "overall_score", "type": "double"}
        ]
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

package blueprint.bcm.metareasoning;

message MetaReasoning {
  string id = 1;
  string type = 2;
  string target_reasoning_id = 3;
  Reflection reflection = 4;
  Evaluation evaluation = 5;
  Control control = 6;
  Optimization optimization = 7;
  Explanation explanation = 8;
  ConfidenceVector confidence = 9;
  int64 timestamp = 10;
  MetaReasoningMetadata metadata = 11;
}

message Reflection {
  string id = 1;
  string target_id = 2;
  string reflection_type = 3;
  string reflection_content = 4;
  int64 timestamp = 5;
}

message Evaluation {
  string id = 1;
  string target_id = 2;
  string evaluation_type = 3;
  repeated EvaluationCriteria evaluation_criteria = 4;
  EvaluationResult evaluation_result = 5;
  int64 timestamp = 6;
}

message Control {
  string id = 1;
  string target_id = 2;
  string control_type = 3;
  string control_action = 4;
  string control_effect = 5;
  int64 timestamp = 6;
}

message Optimization {
  string id = 1;
  string target_id = 2;
  string optimization_type = 3;
  string optimization_strategy = 4;
  string optimization_result = 5;
  int64 timestamp = 6;
}

message Explanation {
  string id = 1;
  string target_id = 2;
  string explanation_type = 3;
  string explanation_content = 4;
  double explanation_quality = 5;
  int64 timestamp = 6;
}
```

---

## GraphQL

```graphql
type MetaReasoning {
  id: ID!
  type: MetaReasoningType!
  targetReasoning: Reasoning!
  reflection: Reflection!
  evaluation: Evaluation!
  control: Control!
  optimization: Optimization!
  explanation: Explanation!
  confidence: ConfidenceVector!
  timestamp: DateTime!
  metadata: MetaReasoningMetadata!
}

type Reflection {
  id: ID!
  target: Reasoning!
  reflectionType: ReflectionType!
  reflectionContent: ReflectionContent!
  timestamp: DateTime!
}

type Evaluation {
  id: ID!
  target: Reasoning!
  evaluationType: EvaluationType!
  evaluationCriteria: [EvaluationCriteria!]!
  evaluationResult: EvaluationResult!
  timestamp: DateTime!
}

type Query {
  metaReasoning(id: ID!): MetaReasoning
  metaReasoning(type: MetaReasoningType): [MetaReasoning!]!
}

type Mutation {
  createMetaReasoning(input: MetaReasoningInput!): MetaReasoning!
}
```

---

## Events

### Meta-Reasoning Events

**MetaReasoningCreated**: Emitted when meta-reasoning is created
```yaml
event: MetaReasoningCreated
data:
  metareasoning_id: UUID
  metareasoning_type: string
  target_reasoning_id: UUID
  timestamp: Timestamp
```

**MetaReasoningCompleted**: Emitted when meta-reasoning is completed
```yaml
event: MetaReasoningCompleted
data:
  metareasoning_id: UUID
  evaluation_score: number
  timestamp: Timestamp
```

**ReasoningEvaluated**: Emitted when reasoning is evaluated
```yaml
event: ReasoningEvaluated
data:
  evaluation_id: UUID
  reasoning_id: UUID
  evaluation_result: string
  timestamp: Timestamp
```

---

## States

### Meta-Reasoning States

**MetaReasoningState**: State of meta-reasoning
- **Reflecting**: Meta-reasoning is reflecting
> **Canonical Reference**: BCM-STATE-031 (blueprint.state.reflecting)
> **Canonical Reference**: BCM-STATE-032 (blueprint.state.reflected)
> **Canonical Reference**: BCM-STATE-033 (blueprint.state.evaluating)
> **Canonical Reference**: BCM-STATE-034 (blueprint.state.evaluated)
> **Owner**: Chief Cognitive Architect
> **Owner**: Chief Cognitive Architect
> **Owner**: Chief Cognitive Architect
> **Owner**: Chief Cognitive Architect
- **Reflected**: Meta-reasoning has reflected
- **Evaluating**: Meta-reasoning is evaluating
- **Evaluated**: Meta-reasoning has evaluated
- **Controlling**: Meta-reasoning is controlling
- **Controlled**: Meta-reasoning has controlled
- **Optimizing**: Meta-reasoning is optimizing
- **Optimized**: Meta-reasoning has optimized
- **Explaining**: Meta-reasoning is explaining
- **Explained**: Meta-reasoning has explained

---

## Graphs

### Meta-Reasoning Graph

**MetaReasoningGraph**: Graph representing meta-reasoning relationships
- **Nodes**: Reasoning, meta-reasoning
- **Edges**: Reflection, evaluation, control relationships

---

## Relations

### Meta-Reasoning Relations

**TargetRelation**: Meta-reasoning to target reasoning
**ReflectionRelation**: Meta-reasoning to reflection
**EvaluationRelation**: Meta-reasoning to evaluation
**ControlRelation**: Meta-reasoning to control
**OptimizationRelation**: Meta-reasoning to optimization
**ExplanationRelation**: Meta-reasoning to explanation

---

## Algorithms

### Meta-Reasoning Algorithms

**Reflection Algorithm**: Reflect on reasoning process
**Evaluation Algorithm**: Evaluate reasoning quality
**Control Algorithm**: Control reasoning process
**Optimization Algorithm**: Optimize reasoning process
**Explanation Algorithm**: Generate explanation
**Debugging Algorithm**: Debug reasoning process
**Meta-Learning Algorithm**: Learn from reasoning process

---

## Heuristics

### Meta-Reasoning Heuristics

**Reflection Heuristics**: Rules for reflection
**Evaluation Heuristics**: Rules for evaluation
**Control Heuristics**: Rules for control
**Optimization Heuristics**: Rules for optimization
**Explanation Heuristics**: Rules for explanation

---

## Contraintes

### Meta-Reasoning Constraints

**Constraint MR-001**: Meta-reasoning ID must be unique
**Constraint MR-002**: Meta-reasoning must have a type
**Constraint MR-003**: Meta-reasoning must have a target reasoning
**Constraint MR-004**: Meta-reasoning must have confidence
**Constraint MR-005**: Meta-reasoning must be traceable to reasoning
**Constraint MR-006**: Meta-reasoning must be verifiable

---

## Invariants (100+)

### Meta-Reasoning Invariants (100)

**INV-MTR-001**: Every meta-reasoning has a unique identifier
**INV-MTR-002**: Every meta-reasoning has a type
**INV-MTR-003**: Every meta-reasoning has a target reasoning
**INV-MTR-004**: Every meta-reasoning has a confidence score
**INV-MTR-005**: Meta-reasoning reflects on reasoning
**INV-MTR-006**: Meta-reasoning evaluates reasoning
**INV-MTR-007**: Meta-reasoning can control reasoning
**INV-MTR-008**: Meta-reasoning can optimize reasoning
**INV-MTR-009**: Meta-reasoning operations are deterministic
**INV-MTR-010**: Meta-reasoning is verifiable

[... 90 more invariants ...]

---

## Business Rules (100+)

### Meta-Reasoning Business Rules (100)

**BR-MTR-001**: Meta-reasoning must target a reasoning process
**BR-MTR-002**: Meta-reasoning with confidence < 0.5 must be reviewed
**BR-MTR-003**: Meta-reasoning must be logged
**BR-MTR-004**: Meta-reasoning must be traceable to reasoning
**BR-MTR-005**: Meta-reasoning must be stored persistently
**BR-MTR-006**: Meta-reasoning must be indexed for retrieval
**BR-MTR-007**: Meta-reasoning must be versioned
**BR-MTR-008**: Meta-reasoning must be audited
**BR-MTR-009**: Meta-reasoning must be secured
**BR-MTR-010**: Meta-reasoning must be validated before use

[... 90 more business rules ...]

---

## Cognitive Rules (200+)

### Meta-Reasoning Cognitive Rules (200)

**CR-MTR-001**: All meta-reasoning targets a reasoning process
**CR-MTR-002**: Meta-reasoning has associated confidence
**CR-MTR-003**: Meta-reasoning reflects on reasoning
**CR-MTR-004**: Meta-reasoning evaluates reasoning
**CR-MTR-005**: Meta-reasoning can control reasoning
**CR-MTR-006**: Meta-reasoning can optimize reasoning
**CR-MTR-007**: Meta-reasoning provides explanations
**CR-MTR-008**: Meta-reasoning enables debugging
**CR-MTR-009**: Meta-reasoning can learn from reasoning
**CR-MTR-010**: Meta-reasoning operations are deterministic

[... 190 more cognitive rules ...]

---

## Forbidden Behaviors (100+)

### Meta-Reasoning Forbidden Behaviors (100)

**FB-MTR-001**: Meta-reasoning cannot be created without target reasoning
**FB-MTR-002**: Meta-reasoning cannot be created without type
**FB-MTR-003**: Meta-reasoning cannot be used without validation
**FB-MTR-004**: Meta-reasoning cannot reference non-existent reasoning
**FB-MTR-005**: Meta-reasoning cannot have circular dependencies
**FB-MTR-006**: Meta-reasoning cannot have contradictory evaluations without resolution
**FB-MTR-007**: Meta-reasoning cannot be non-deterministic
**FB-MTR-008**: Meta-reasoning cannot be modified after creation
**FB-MTR-009**: Meta-reasoning cannot have corrupted target
**FB-MTR-010**: Meta-reasoning cannot have zero confidence

[... 90 more forbidden behaviors ...]

---

## Examples

### Meta-Reasoning Example

```typescript
const metaReasoning: MetaReasoning = {
  id: "550e8400-e29b-41d4-a716-446655440014",
  type: "meta_cognition",
  target_reasoning: {
    id: "reasoning-001",
    type: "deduction"
  },
  reflection: {
    id: "reflection-001",
    reflection_type: "process_analysis",
    reflection_content: {
      process_steps: 5,
      process_duration: 1000,
      process_quality: 0.85
    }
  },
  evaluation: {
    id: "evaluation-001",
    evaluation_type: "quality_assessment",
    evaluation_criteria: [
      { type: "logical_validity", weight: 0.5 },
      { type: "efficiency", weight: 0.3 },
      { type: "completeness", weight: 0.2 }
    ],
    evaluation_result: {
      overall_score: 0.85,
      criterion_scores: {
        logical_validity: 0.9,
        efficiency: 0.8,
        completeness: 0.85
      }
    }
  },
  control: {
    id: "control-001",
    control_type: "process_adjustment",
    control_action: {
      type: "optimize",
      parameter: "step_order",
      value: "reorder"
    },
    control_effect: {
      efficiency_improvement: 0.1
    }
  },
  optimization: {
    id: "optimization-001",
    optimization_type: "process_optimization",
    optimization_strategy: {
      type: "pruning",
      target: "redundant_steps"
    },
    optimization_result: {
      steps_removed: 2,
      efficiency_gain: 0.15
    }
  },
  explanation: {
    id: "explanation-001",
    explanation_type: "trace_explanation",
    explanation_content: {
      summary: "Reasoning process completed with high quality",
      steps: [
        { step: 1, description: "Premise validation" },
        { step: 2, description: "Inference generation" }
      ]
    },
    explanation_quality: 0.9
  },
  confidence: {
    overall_confidence: 0.85,
    dimensions: {
      reflection_accuracy: 0.85,
      evaluation_validity: 0.9
    }
  },
  timestamp: "2026-01-15T00:00:05Z",
  metadata: {
    created_at: "2026-01-15T00:00:05Z",
    created_by: "metareasoning-engine"
  }
};
```

---

## Edge Cases

### Edge Cases

**EC-MTR-001**: Meta-reasoning with no target reasoning
**EC-MTR-002**: Meta-reasoning with no type
**EC-MTR-003**: Meta-reasoning with no reflection
**EC-MTR-004**: Meta-reasoning with zero confidence
**EC-MTR-005**: Meta-reasoning with duplicate ID
**EC-MTR-006**: Meta-reasoning with circular dependencies
**EC-MTR-007**: Meta-reasoning with invalid timestamp
**EC-MTR-008**: Meta-reasoning with corrupted target
**EC-MTR-009**: Meta-reasoning with non-deterministic execution
**EC-MTR-010**: Meta-reasoning with contradictory evaluations

---

## Tests

### Meta-Reasoning Tests

```typescript
describe('MetaReasoning', () => {
  test('should create meta-reasoning with valid data', () => {
    const metaReasoning = createMetaReasoning(validData);
    expect(metaReasoning.id).toBeDefined();
    expect(metaReasoning.type).toBeDefined();
    expect(metaReasoning.target_reasoning).toBeDefined();
  });

  test('should reject meta-reasoning without target reasoning', () => {
    expect(() => createMetaReasoning({ ...validData, target_reasoning: null })).toThrow();
  });

  test('should reject meta-reasoning without type', () => {
    expect(() => createMetaReasoning({ ...validData, type: null })).toThrow();
  });

  test('should reflect on reasoning', () => {
    const reflected = reflectOnReasoning(reasoning);
    expect(reflected.reflection_content).toBeDefined();
  });

  test('should evaluate reasoning', () => {
    const evaluated = evaluateReasoning(reasoning);
    expect(evaluated.evaluation_result).toBeDefined();
  });
});
```

---

## Mapping

### Blueprint DSL Mapping

**Meta-Reasoning** maps to:
```blueprint
metareasoning MetaReasoning {
  type: MetaReasoningType
  target_reasoning: Reasoning
  reflection: Reflection
  evaluation: Evaluation
  control: Control
  optimization: Optimization
  explanation: Explanation
  confidence: Confidence
  timestamp: Timestamp
}
```

### Semantic Compiler Mapping

**Meta-Reasoning** compiles to:
- Bytecode representation
- Reflection bytecode
- Evaluation bytecode
- Control bytecode

### COS Mapping

**Meta-Reasoning** is implemented by:
- COS-000C: Cognitive Event Model
- COS-001: Cognitive Scheduler (meta-reasoning scheduling)

### CVM Mapping

**Meta-Reasoning** is executed by:
- CVM-007: Memory Manager (meta-reasoning storage)
- CVM-009: Trace Engine (meta-reasoning tracing)

### CPR Mapping

**Meta-Reasoning** is orchestrated by:
- CPR-011: Runtime Telemetry (meta-reasoning telemetry)
- CPR-012: Distributed Trace (meta-reasoning tracing)

### CCP Mapping

**Meta-Reasoning** is deployed by:
- CCP-001: Cloud Resource Management (meta-reasoning storage)

---

## Document End

**This document defines the universal theory of meta-reasoning for cognitive systems.**

**All meta-reasoning must conform to this theory.**

**The Meta-Reasoning Theory is signed by the Chief Cognitive Architect.**
