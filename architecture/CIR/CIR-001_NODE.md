# CIR-001: Node

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Node structure in Cognitive Intermediate Representation

---

## Purpose

A Node represents a single operation or value in the Cognitive IR graph. Nodes are the fundamental building blocks of CIR.

---

## Node Structure

```typescript
interface CIRNode {
  id: string;                    // Unique node identifier
  type: NodeType;               // Node type
  operation?: CIRInstruction;   // Operation (for instruction nodes)
  value?: CIRValue;             // Value (for value nodes)
  inputs: string[];             // Input node IDs
  outputs: string[];            // Output node IDs
  metadata: CIRMetadata;        // Node metadata
}
```

---

## Node Types

### Value Nodes
Represent constant or computed values.

```cir
%1: i32 = const 42;
%2: string = const "hello";
%3: observation = observe source;
```

### Instruction Nodes
Represent executable operations.

```cir
%4: i32 = add %1, %2;
%5: bool = lt %4, %10;
%6: decision = decide %4, %5;
```

### Control Nodes
Represent control flow.

```cir
br %5, then_block, else_block;
ret %6;
```

### Phi Nodes
Represent SSA phi nodes.

```cir
%7: i32 = phi i32 [%1, entry_block], [%2, loop_block];
```

---

## Node Properties

### ID
Unique identifier for the node. Format: `%<name>` or `%<number>`.

### Type
The type of the node (value type or instruction type).

### Operation
The instruction or operation performed by the node.

### Value
The constant value (for value nodes).

### Inputs
List of input node IDs (dependencies).

### Outputs
List of output node IDs (dependents).

### Metadata
Additional metadata for optimization and debugging.

---

## Node Creation

### Constant Node
```cir
%1: i32 = const 42;
```

### Operation Node
```cir
%2: i32 = add %1, %3;
```

### Cognitive Node
```cir
%3: observation = observe source;
%4: perception = perceive %3;
%5: decision = decide %4, %2;
```

---

## Node Validation

Nodes must satisfy the following validation rules:

1. **Unique ID**: Each node ID must be unique within the module
2. **Type Consistency**: Node type must match operation type
3. **Input Validity**: All input nodes must exist
4. **SSA Validity**: Each variable assigned exactly once
5. **Metadata Completeness**: Required metadata must be present

---

## Node Optimization

Nodes can be optimized through:

1. **Constant Folding**: Evaluate constant nodes
2. **Dead Code Elimination**: Remove unused nodes
3. **Common Subexpression Elimination**: Share identical nodes
4. **Node Fusion**: Combine compatible nodes

---

## Serialization

### Text Format
```cir
%<id>: <type> = <operation> <inputs>;
```

### Binary Format
```binary
[id: 8 bytes]
[type: 4 bytes]
[operation: 4 bytes]
[input_count: 4 bytes]
[inputs: input_count * 8 bytes]
[metadata_length: 4 bytes]
[metadata: metadata_length bytes]
```
