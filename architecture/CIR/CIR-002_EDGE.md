# CIR-002: Edge

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Edge structure in Cognitive Intermediate Representation

---

## Purpose

An Edge represents a relationship between two nodes in the Cognitive IR graph. Edges define data flow, control flow, and dependency relationships.

---

## Edge Structure

```typescript
interface CIREdge {
  id: string;              // Unique edge identifier
  source: string;          // Source node ID
  target: string;          // Target node ID
  type: EdgeType;         // Edge type
  weight?: number;        // Edge weight (for optimization)
  metadata: CIRMetadata;   // Edge metadata
}
```

---

## Edge Types

### Data Flow Edge
Represents data flowing from one node to another.

```cir
%1: i32 = add %a, %b;
%2: i32 = mul %1, %c;
// Edge: %1 -> %2 (data flow)
```

### Control Flow Edge
Represents control flow between basic blocks.

```cir
entry:
    %1: bool = lt %a, %b;
    br %1, then_block, else_block;

then_block:
    // Edge: entry -> then_block (control flow)
```

### Dependency Edge
Represents a dependency relationship.

```cir
%1: observation = observe source;
%2: perception = perceive %1;
// Edge: %1 -> %2 (dependency)
```

### Cognitive Edge
Represents a cognitive relationship.

```cir
%1: reasoning = reason inputs;
%2: decision = decide %1;
// Edge: %1 -> %2 (cognitive)
```

---

## Edge Properties

### ID
Unique identifier for the edge.

### Source
The source node ID.

### Target
The target node ID.

### Type
The type of relationship (data flow, control flow, dependency, cognitive).

### Weight
Optional weight for optimization (e.g., execution cost, latency).

### Metadata
Additional metadata for optimization and debugging.

---

## Edge Creation

### Data Flow Edge
```cir
%1: i32 = add %a, %b;
%2: i32 = mul %1, %c;
// Edge: %1 -> %2 (data flow)
```

### Control Flow Edge
```cir
br %cond, then_block, else_block;
// Edge: current -> then_block (control flow)
// Edge: current -> else_block (control flow)
```

### Dependency Edge
```cir
%1: observation = observe source;
%2: perception = perceive %1;
// Edge: %1 -> %2 (dependency)
```

---

## Edge Validation

Edges must satisfy the following validation rules:

1. **Unique ID**: Each edge ID must be unique within the module
2. **Node Existence**: Source and target nodes must exist
3. **Type Consistency**: Edge type must match node types
4. **No Self-Loops**: Edge cannot have same source and target
5. **Acyclic**: No cycles in dependency edges (unless explicitly allowed)

---

## Edge Optimization

Edges can be optimized through:

1. **Edge Elimination**: Remove redundant edges
2. **Edge Fusion**: Combine compatible edges
3. **Edge Weighting**: Assign weights for scheduling
4. **Critical Path Analysis**: Identify critical edges

---

## Serialization

### Text Format
```cir
edge %<id>: %<source> -> %<target> [type: <type>];
```

### Binary Format
```binary
[id: 8 bytes]
[source: 8 bytes]
[target: 8 bytes]
[type: 4 bytes]
[weight: 4 bytes]
[metadata_length: 4 bytes]
[metadata: metadata_length bytes]
```
