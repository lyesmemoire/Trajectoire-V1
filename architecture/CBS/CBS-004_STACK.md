# CBS-004: Stack

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the stack in Cognitive Bytecode

---

## Purpose

The stack provides a LIFO data structure for function calls, local variables, and temporary values.

---

## Stack Structure

### Stack Layout
```
[High Addresses]
    ...
    [Frame N]
    [Frame N-1]
    ...
    [Frame 0]
[Low Addresses]
```

### Stack Frame
Each stack frame contains:

```
[Return Address]
[Previous FP]
[Local Variables]
[Temporary Values]
[Arguments]
```

---

## Stack Operations

### PUSH
Push value onto stack.

```
PUSH <value>
```

### POP
Pop value from stack.

```
POP -> <value>
```

### PEEK
Peek at top of stack without popping.

```
PEEK -> <value>
```

### DUP
Duplicate top of stack.

```
DUP
```

### SWAP
Swap top two values.

```
SWAP
```

### ROT
Rotate top three values.

```
ROT
```

---

## Stack Pointer (SP)

The stack pointer points to the top of the stack.

- **Grows**: Downward (towards lower addresses)
- **Alignment**: 8-byte aligned

---

## Stack Operations Encoding

### PUSH
```
Opcode: 0x34
Operands: 1 (value)
Encoding: 34 01 <value>
```

### POP
```
Opcode: 0x35
Operands: 0
Encoding: 35 00
```

### PEEK
```
Opcode: 0x36
Operands: 0
Encoding: 36 00
```

### DUP
```
Opcode: 0x37
Operands: 0
Encoding: 37 00
```

### SWAP
```
Opcode: 0x38
Operands: 0
Encoding: 38 00
```

### ROT
```
Opcode: 0x39
Operands: 0
Encoding: 39 00
```

---

## Stack Safety

### Overflow Detection
Stack overflow is detected and reported.

### Underflow Detection
Stack underflow is detected and reported.

### Bounds Checking
All stack operations include bounds checking.
