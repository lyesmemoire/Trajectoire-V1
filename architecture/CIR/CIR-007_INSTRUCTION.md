# CIR-007: Instruction

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Instruction structure in Cognitive Intermediate Representation

---

## Purpose

An Instruction is a single operation in CIR. Instructions are the executable units that compose basic blocks.

---

## Instruction Structure

```typescript
interface CIRInstruction {
  opcode: string;          // Operation code
  operands: CIRValue[];    // Operands
  result?: string;         // Result variable ID
  metadata: CIRMetadata;   // Instruction metadata
}
```

---

## Instruction Categories

### Arithmetic Instructions
```cir
%1: i32 = add %a, %b;
%2: i32 = sub %a, %b;
%3: i32 = mul %a, %b;
%4: i32 = div %a, %b;
%5: i32 = rem %a, %b;
```

### Comparison Instructions
```cir
%1: bool = eq %a, %b;
%2: bool = ne %a, %b;
%3: bool = lt %a, %b;
%4: bool = le %a, %b;
%5: bool = gt %a, %b;
%6: bool = ge %a, %b;
```

### Logical Instructions
```cir
%1: bool = and %a, %b;
%2: bool = or %a, %b;
%3: bool = xor %a, %b;
%4: bool = not %a;
```

### Bitwise Instructions
```cir
%1: i32 = shl %a, %b;
%2: i32 = shr %a, %b;
```

### Memory Instructions
```cir
%1: ptr = alloc i32;
%2: i32 = load %1;
store %1, %value;
free %1;
```

### Control Flow Instructions
```cir
br <label>;
br %cond, <true_label>, <false_label>;
call <function>(<args>);
ret %value;
```

### Cognitive Instructions
```cir
%1: observation = observe <source>;
%2: perception = perceive %1;
%3: evidence = evidence %data;
%4: confidence = confidence %3;
%5: knowledge = knowledge_lookup %query;
%6: belief = belief_update %5;
%7: hypothesis = hypothesis %6;
%8: reasoning = reason %2, %5;
%9: decision = decide %8;
%10: plan = plan %9;
%11: memory = mem_read %key;
mem_write %key, %value;
```

### Phi Instructions
```cir
%1: i32 = phi i32 [%a, entry_block], [%b, loop_block];
```

---

## Instruction Properties

### Opcode
The operation code (add, sub, mul, observe, perceive, etc.).

### Operands
List of operand values or variable IDs.

### Result
Optional result variable ID for instructions that produce a value.

### Metadata
Additional metadata for optimization and debugging.

---

## Instruction Encoding

### Text Format
```cir
%<result>: <type> = <opcode> <operands>;
```

### Binary Format
```binary
[opcode: 4 bytes]
[operand_count: 4 bytes]
[operands: operand_count * variable]
[result_id: 8 bytes]
[metadata_length: 4 bytes]
[metadata: metadata_length bytes]
```

---

## Instruction Validation

Instructions must satisfy the following validation rules:

1. **Opcode Validity**: Opcode must be a valid instruction
2. **Operand Count**: Correct number of operands for opcode
3. **Operand Types**: Operand types must match instruction requirements
4. **Result Type**: Result type must match instruction output type
5. **SSA Validity**: Result variable must not be previously assigned

---

## Instruction Optimization

Instructions can be optimized through:

1. **Constant Folding**: Evaluate constant expressions
2. **Instruction Combining**: Combine compatible instructions
3. **Instruction Scheduling**: Reorder instructions
4. **Dead Code Elimination**: Remove unused instructions
5. **Instruction Selection**: Select optimal instructions
