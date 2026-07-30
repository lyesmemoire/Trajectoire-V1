# AUTOMATIC_GENERATION.md

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | AUTO-GEN-001 |
| **Title** | Automatic Interface Generation |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Created** | 2026-01-15 |
| **Author** | Enterprise Chief Architect |
| **Purpose** | Define automatic interface generation from canonical contracts |
| **Scope** | Entire Blueprint V3 Enterprise platform |

---

## Executive Summary

This document defines the automatic interface generation system for Blueprint V3 Enterprise. It specifies how to generate interfaces in multiple languages (TypeScript, Rust, Go, Java, Kotlin, C#) and schemas (JSON Schema, YAML, OpenAPI, AsyncAPI, GraphQL, Protobuf) from canonical contracts.

**Principles**:
1. **Single Source of Truth**: All interfaces are generated from canonical contracts
2. **Consistency**: Generated interfaces are consistent across languages
3. **Type Safety**: Generated interfaces are type-safe
4. **Documentation**: Generated interfaces include documentation

---

## Generation Targets

### Language Targets

**TypeScript**: Generated TypeScript interfaces and types
**Rust**: Generated Rust structs and traits
**Go**: Generated Go structs and interfaces
**Java**: Generated Java classes and interfaces
**Kotlin**: Generated Kotlin classes and interfaces
**C#**: Generated C# classes and interfaces

### Schema Targets

**JSON Schema**: Generated JSON schemas for validation
**YAML**: Generated YAML schemas for configuration
**OpenAPI**: Generated OpenAPI specifications for APIs
**AsyncAPI**: Generated AsyncAPI specifications for events
**GraphQL**: Generated GraphQL schemas for queries
**Protobuf**: Generated Protobuf schemas for serialization

---

## TypeScript Generation

### Object Generation

**Template**:
```typescript
/**
 * {description}
 * 
 * Canonical Reference: {canonical_reference}
 * Owner: {owner}
 * Version: {version}
 */
export interface {Name} {
  {property}: {type};
  {property}: {type};
}
```

**Example**:
```typescript
/**
 * The fundamental cognitive object representing information acquired from the environment.
 * 
 * Canonical Reference: BCM-OBJ-001
 * Owner: Chief Cognitive Architect
 * Version: 1.0.0
 */
export interface Observation {
  id: string;
  source: string;
  content: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}
```

### Event Generation

**Template**:
```typescript
/**
 * {description}
 * 
 * Canonical Reference: {canonical_reference}
 * Owner: {owner}
 * Version: {version}
 */
export interface {EventName} {
  id: string;
  timestamp: Date;
  payload: {PayloadType};
}
```

**Example**:
```typescript
/**
 * Emitted when an observation is created.
 * 
 * Canonical Reference: BCM-EVT-001
 * Owner: Chief Cognitive Architect
 * Version: 1.0.0
 */
export interface ObservationCreated {
  id: string;
  timestamp: Date;
  payload: {
    observation_id: string;
    source: string;
    content: string;
    timestamp: Date;
  };
}
```

---

## Rust Generation

### Object Generation

**Template**:
```rust
/// {description}
/// 
/// Canonical Reference: {canonical_reference}
/// Owner: {owner}
/// Version: {version}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct {Name} {
    pub {property}: {type},
    pub {property}: {type},
}
```

**Example**:
```rust
/// The fundamental cognitive object representing information acquired from the environment.
/// 
/// Canonical Reference: BCM-OBJ-001
/// Owner: Chief Cognitive Architect
/// Version: 1.0.0
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Observation {
    pub id: String,
    pub source: String,
    pub content: String,
    pub timestamp: DateTime<Utc>,
    pub metadata: HashMap<String, Value>,
}
```

---

## Go Generation

### Object Generation

**Template**:
```go
// {description}
// 
// Canonical Reference: {canonical_reference}
// Owner: {owner}
// Version: {version}
type {Name} struct {
    {Property} {Type} `json:"{property}"`
    {Property} {Type} `json:"{property}"`
}
```

**Example**:
```go
// The fundamental cognitive object representing information acquired from the environment.
// 
// Canonical Reference: BCM-OBJ-001
// Owner: Chief Cognitive Architect
// Version: 1.0.0
type Observation struct {
    ID        string                 `json:"id"`
    Source    string                 `json:"source"`
    Content   string                 `json:"content"`
    Timestamp time.Time              `json:"timestamp"`
    Metadata  map[string]interface{} `json:"metadata"`
}
```

---

## Java Generation

### Object Generation

**Template**:
```java
/**
 * {description}
 * 
 * Canonical Reference: {canonical_reference}
 * Owner: {owner}
 * Version: {version}
 */
public class {Name} {
    private {Type} {property};
    private {Type} {property};
    
    // Getters and setters
}
```

**Example**:
```java
/**
 * The fundamental cognitive object representing information acquired from the environment.
 * 
 * Canonical Reference: BCM-OBJ-001
 * Owner: Chief Cognitive Architect
 * Version: 1.0.0
 */
public class Observation {
    private String id;
    private String source;
    private String content;
    private Instant timestamp;
    private Map<String, Object> metadata;
    
    // Getters and setters
}
```

---

## JSON Schema Generation

### Object Schema

**Template**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "{Name}",
  "description": "{description}",
  "type": "object",
  "properties": {
    "{property}": {
      "type": "{type}",
      "description": "{description}"
    }
  },
  "required": ["{required_properties}"],
  "x-canonical-reference": "{canonical_reference}",
  "x-owner": "{owner}",
  "x-version": "{version}"
}
```

**Example**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Observation",
  "description": "The fundamental cognitive object representing information acquired from the environment.",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier"
    },
    "source": {
      "type": "string",
      "description": "Source of observation"
    },
    "content": {
      "type": "string",
      "description": "Content of observation"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of observation"
    },
    "metadata": {
      "type": "object",
      "description": "Additional metadata"
    }
  },
  "required": ["id", "source", "content", "timestamp"],
  "x-canonical-reference": "BCM-OBJ-001",
  "x-owner": "Chief Cognitive Architect",
  "x-version": "1.0.0"
}
```

---

## OpenAPI Generation

### API Specification

**Template**:
```yaml
openapi: 3.0.0
info:
  title: {API Name}
  version: {version}
  description: {description}
  x-canonical-reference: {canonical_reference}
  x-owner: {owner}
paths:
  /{path}:
    {method}:
      summary: {summary}
      operationId: {operationId}
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/{Schema}'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/{ResponseSchema}'
components:
  schemas:
    {Schema}:
      $ref: '{schema_file}'
```

---

## GraphQL Generation

### Schema Generation

**Template**:
```graphql
"""
{description}

Canonical Reference: {canonical_reference}
Owner: {owner}
Version: {version}
"""
type {Name} {
  {property}: {Type}
  {property}: {Type}
}

type Query {
  {queryName}: {ReturnType}
}

type Mutation {
  {mutationName}: {ReturnType}
}
```

**Example**:
```graphql
"""
The fundamental cognitive object representing information acquired from the environment.

Canonical Reference: BCM-OBJ-001
Owner: Chief Cognitive Architect
Version: 1.0.0
"""
type Observation {
  id: ID!
  source: String!
  content: String!
  timestamp: DateTime!
  metadata: JSON
}

type Query {
  observation(id: ID!): Observation
  observations(limit: Int, offset: Int): [Observation!]!
}

type Mutation {
  createObservation(input: CreateObservationInput!): Observation!
  updateObservation(id: ID!, input: UpdateObservationInput!): Observation!
  deleteObservation(id: ID!): Boolean!
}
```

---

## Protobuf Generation

### Schema Generation

**Template**:
```protobuf
syntax = "proto3";

// {description}
// Canonical Reference: {canonical_reference}
// Owner: {owner}
// Version: {version}

package {package};

message {Name} {
  {type} {property} = {number};
  {type} {property} = {number};
}
```

**Example**:
```protobuf
syntax = "proto3";

// The fundamental cognitive object representing information acquired from the environment.
// Canonical Reference: BCM-OBJ-001
// Owner: Chief Cognitive Architect
// Version: 1.0.0

package blueprint.cognitive;

message Observation {
  string id = 1;
  string source = 2;
  string content = 3;
  int64 timestamp = 4;
  map<string, string> metadata = 5;
}
```

---

## Generation Pipeline

### Pipeline Stages

1. **Contract Parsing**: Parse canonical contracts
2. **Model Building**: Build internal model from contracts
3. **Code Generation**: Generate code for each target
4. **Validation**: Validate generated code
5. **Output**: Write generated code to files

### Pipeline Configuration

```yaml
generation:
  contracts:
    - contracts/foundation/OBJECT_CONTRACT.md
    - contracts/foundation/EVENT_CONTRACT.md
    - contracts/foundation/RUNTIME_CONTRACT.md
  targets:
    typescript:
      output: generated/typescript/
      enabled: true
    rust:
      output: generated/rust/
      enabled: true
    go:
      output: generated/go/
      enabled: true
    java:
      output: generated/java/
      enabled: true
    kotlin:
      output: generated/kotlin/
      enabled: true
    csharp:
      output: generated/csharp/
      enabled: true
    json_schema:
      output: generated/json_schema/
      enabled: true
    openapi:
      output: generated/openapi/
      enabled: true
    graphql:
      output: generated/graphql/
      enabled: true
    protobuf:
      output: generated/protobuf/
      enabled: true
```

---

## Generation Automation

### Continuous Generation

**Triggers**:
- On contract change
- On manual request
- On schedule (daily)

### Generation Gates

**Pre-commit Gate**:
- Generate interfaces from contracts
- Validate generated interfaces
- Commit generated interfaces

**Pre-deployment Gate**:
- Generate interfaces from contracts
- Validate generated interfaces
- Deploy generated interfaces

---

## Document End

**This document defines the automatic interface generation system for Blueprint V3 Enterprise.**

**All interfaces are generated from canonical contracts.**

**This document is signed by the Enterprise Chief Architect.**
