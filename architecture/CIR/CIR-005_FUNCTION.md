# CIR-005: Function

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Function structure in Cognitive Intermediate Representation

---

## Purpose

A Function is a callable unit of code in CIR. Functions have parameters, return types, and a body consisting of basic blocks.

---

## Function Structure

```typescript
interface CIRFunction {
  id: string;              // Unique function identifier
  name: string;            // Function name
  parameters: CIRParameter[];  // Function parameters
  return_type: CIRType;    // Return type
  blocks: CIRBlock[];      // Basic blocks
  metadata: CIRMetadata;   // Function metadata
}
```

---

## Function Properties

### ID
Unique identifier for the function.

### Name
Human-readable name for the function.

### Parameters
List of function parameters (name, type).

### Return Type
The return type of the function.

### Blocks
List of basic blocks in the function body.

### Metadata
Additional metadata for optimization and debugging.

---

## Function Creation

```cir
function add(a: i32, b: i32) -> i32 {
    entry:
        %1: i32 = add a, b;
        ret %1;
}
```

### Cognitive Function
```cir
function reason(observation: observation) -> decision {
    entry:
        %1: perception = perceive observation;
        %2: reasoning = reason %1;
        %3: decision = decide %2;
        ret %3;
}
```

---

## Function Validation

Functions must satisfy the following validation rules:

1. **Unique ID**: Each function ID must be unique within the module
2. **Parameter Uniqueness**: Parameter names must be unique
3. **Entry Block**: Function must have an entry block
4. **Return Consistency**: All return instructions must match return type
5. **Block Reachability**: All blocks must be reachable from entry

---

## Function Optimization

Functions can be optimized through:

1. **Inlining**: Inline function calls
2. **Function Specialization**: Specialize for specific argument types
3. **Dead Code Elimination**: Remove unused functions
4. **Function Cloning**: Clone functions for optimization
5. **Tail Call Optimization**: Optimize tail calls

---

## Serialization

### Text Format
```cir
function <name>(<params>) -> <return_type> {
    <blocks>
}
```

### Binary Format
```binary
[id: 8 bytes]
[name_length: 4 bytes]
[name: name_length bytes]
[parameter_count: 4 bytes]
[parameters: parameter_count * variable]
[return_type: 4 bytes]
[block_count: 4 bytes]
[blocks: block_count * variable]
[metadata_length: 4 bytes]
[metadata: metadata_length bytes]
```
