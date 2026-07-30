# CBS-001: Instruction Encoding

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the instruction encoding in Cognitive Bytecode

---

## Purpose

Instruction encoding defines how instructions are represented in binary format for execution by the Cognitive Virtual Machine.

---

## Instruction Format

### Single-Byte Opcode
All instructions use a single-byte opcode for compactness.

```binary
[opcode: 1 byte]          // Operation code (0-255)
[operand_count: 1 byte]   // Number of operands (0-255)
[operands: variable]       // Operands (variable length)
```

---

## Opcode Categories

### 0x00-0x0F: Arithmetic
```
0x00: NOP
0x01: ADD
0x02: SUB
0x03: MUL
0x04: DIV
0x05: REM
0x06: AND
0x07: OR
0x08: XOR
0x09: NOT
0x0A: SHL
0x0B: SHR
0x0C-0x0F: Reserved
```

### 0x10-0x1F: Comparison
```
0x10: EQ
0x11: NE
0x12: LT
0x13: LE
0x14: GT
0x15: GE
0x16-0x1F: Reserved
```

### 0x20-0x2F: Control Flow
```
0x20: BR
0x21: BR_IF
0x22: CALL
0x23: RET
0x24: JMP
0x25: JMP_IF
0x26: SWITCH
0x27: TABLE_SWITCH
0x28-0x2F: Reserved
```

### 0x30-0x3F: Memory
```
0x30: LOAD
0x31: STORE
0x32: ALLOC
0x33: FREE
0x34: PUSH
0x35: POP
0x36: PEEK
0x37: DUP
0x38: SWAP
0x39: ROT
0x3A-0x3F: Reserved
```

### 0x40-0x4F: Stack
```
0x40: ENTER
0x41: LEAVE
0x42: ALLOC_STACK
0x43: FREE_STACK
0x44-0x4F: Reserved
```

### 0x50-0x5F: Cognitive
```
0x50: OBSERVE
0x51: PERCEIVE
0x52: EVIDENCE
0x53: CONFIDENCE
0x54: KNOWLEDGE
0x55: BELIEF
0x56: HYPOTHESIS
0x57: REASON
0x58: DECIDE
0x59: PLAN
0x5A: MEM_READ
0x5B: MEM_WRITE
0x5C: MEM_LOOKUP
0x5D: MEM_UPDATE
0x5E: MEM_DELETE
0x5F: Reserved
```

### 0x60-0x6F: Runtime
```
0x60: PANIC
0x61: ASSERT
0x62: LOG
0x63: TRACE
0x64: PROFILE
0x65: BENCHMARK
0x66-0x6F: Reserved
```

### 0x70-0x7F: Type Operations
```
0x70: CAST
0x71: TYPEOF
0x72: INSTANCEOF
0x73: SIZEOF
0x74-0x7F: Reserved
```

### 0x80-0xFF: Extended
Reserved for future extensions.

---

## Operand Encoding

### Register Operand
```binary
[0x01: 1 byte]  // Register marker
[reg: 1 byte]   // Register number (0-255)
```

### Immediate Operand
```binary
[0x02: 1 byte]  // Immediate marker
[type: 1 byte]  // Type (i8, i16, i32, i64, f32, f64)
[value: variable]  // Value (1-8 bytes)
```

### Address Operand
```binary
[0x03: 1 byte]  // Address marker
[addr: 8 bytes] // Memory address
```

### Constant Pool Operand
```binary
[0x04: 1 byte]      // Constant pool marker
[index: 4 bytes]    // Constant pool index
```

### Label Operand
```binary
[0x05: 1 byte]      // Label marker
[index: 4 bytes]    // Label index
```

---

## Instruction Examples

### ADD Instruction
```
Opcode: 0x01 (ADD)
Operands: 2 (register, register)
Encoding: 01 02 01 R0 01 R1
```

### LOAD Instruction
```
Opcode: 0x30 (LOAD)
Operands: 1 (address)
Encoding: 30 01 03 0000000000001000
```

### OBSERVE Instruction
```
Opcode: 0x50 (OBSERVE)
Operands: 1 (constant pool)
Encoding: 50 01 04 00000042
```

---

## Instruction Length

Instructions have variable length:

- **Minimum**: 2 bytes (opcode + operand_count)
- **Maximum**: 256 bytes (opcode + operand_count + 255 operands)

---

## Instruction Alignment

Instructions are byte-aligned for efficient decoding.

---

## Instruction Verification

Instructions must satisfy:

1. **Opcode Validity**: Opcode must be valid
2. **Operand Count**: Operand count must match opcode requirements
3. **Operand Types**: Operand types must match instruction requirements
4. **Operand Range**: Operands must be within valid ranges

---

## Extended Instructions

Extended instructions use the 0x80-0xFF range for future extensions and custom instructions.
