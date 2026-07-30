# CIR-003: Block

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Block structure in Cognitive Intermediate Representation

---

## Purpose

A Block is a sequence of instructions with a single entry point and a single exit point. Blocks are the basic units of control flow in CIR.

---

## Block Structure

```typescript
interface CIRBlock {
  id: string;              // Unique block identifier
  name: string;            // Block name
  instructions: CIRInstruction[];  // Instructions in the block
  predecessors: string[];  // Predecessor block IDs
  successors: string[];    // Successor block IDs
  metadata: CIRMetadata;   // Block metadata
}
```

---

## Block Types

### Entry Block
The entry point of a function.

```cir
function example() -> i32 {
    entry:
        %1: i32 = const 42;
        ret %1;
}
```

### Regular Block
A regular basic block.

```cir
    regular_block:
        %1: i32 = add %a, %b;
        %2: bool = lt %1, %c;
        br %2, then_block, else_block;
```

### Exit Block
The exit point of a function.

```cir
    exit_block:
        ret %result;
```

---

## Block Properties

### ID
Unique identifier for the block.

### Name
Human-readable name for the block.

### Instructions
Sequence of instructions in the block.

### Predecessors
List of predecessor block IDs (blocks that can jump to this block).

### Successors
List of successor block IDs (blocks this block can jump to).

### Metadata
Additional metadata for optimization and debugging.

---

## Block Creation

```cir
function example(a: i32, b: i32) -> i32 {
    entry:
        %1: i32 = add a, b;
        %2: bool = lt %1, 0;
        br %2, positive_block, negative_block;
    
    positive_block:
        %3: i32 = mul %1, 2;
        ret %3;
    
    negative_block:
        %4: i32 = sub 0, %1;
        ret %4;
}
```

---

## Block Validation

Blocks must satisfy the following validation rules:

1. **Unique ID**: Each block ID must be unique within the function
2. **Single Entry**: Block has a single entry point
3. **Single Exit**: Block has a single exit point (terminator instruction)
4. **Terminator**: Last instruction must be a terminator (br, ret, etc.)
5. **Predecessor Consistency**: Predecessors list must be consistent with control flow

---

## Block Optimization

Blocks can be optimized through:

1. **Block Merging**: Merge consecutive blocks
2. **Block Splitting**: Split blocks for optimization
3. **Dead Block Elimination**: Remove unreachable blocks
4. **Block Reordering**: Reorder blocks for better locality

---

## Serialization

### Text Format
```cir
<name>:
    <instruction>;
    <instruction>;
    br <target>;
```

### Binary Format
```binary
[id: 8 bytes]
[name_length: 4 bytes]
[name: name_length bytes]
[instruction_count: 4 bytes]
[instructions: instruction_count * variable]
[predecessor_count: 4 bytes]
[predecessors: predecessor_count * 8 bytes]
[successor_count: 4 bytes]
[successors: successor_count * 8 bytes]
[metadata_length: 4 bytes]
[metadata: metadata_length bytes]
```
