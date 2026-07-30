# CBS-006: Frames

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the stack frame structure in Cognitive Bytecode

---

## Purpose

Stack frames provide the context for function execution, including local variables, arguments, and return information.

---

## Frame Structure

### Frame Layout
```
[High Addresses]
    [Return Address]      - 8 bytes
    [Previous FP]         - 8 bytes
    [Local Variables]     - variable
    [Temporary Values]    - variable
    [Arguments]           - variable
[Low Addresses]
```

### Frame Header
```
struct Frame {
    return_address: u64;    // Return address
    previous_fp: u64;       // Previous frame pointer
    local_count: u32;       // Number of local variables
    arg_count: u32;         // Number of arguments
}
```

---

## Frame Operations

### ENTER
Enter a new frame (function prologue).

```
ENTER <local_count>, <arg_count>
```

### LEAVE
Leave current frame (function epilogue).

```
LEAVE
```

### ALLOC_STACK
Allocate stack space for locals.

```
ALLOC_STACK <size>
```

### FREE_STACK
Free stack space.

```
FREE_STACK <size>
```

---

## Frame Pointer (FP)

The frame pointer points to the base of the current frame.

- **Purpose**: Access local variables and arguments
- **Alignment**: 8-byte aligned

---

## Frame Operations Encoding

### ENTER
```
Opcode: 0x40
Operands: 2 (local_count, arg_count)
Encoding: 40 02 02 <local_count> 02 <arg_count>
```

### LEAVE
```
Opcode: 0x41
Operands: 0
Encoding: 41 00
```

### ALLOC_STACK
```
Opcode: 0x42
Operands: 1 (size)
Encoding: 42 01 02 <size>
```

### FREE_STACK
```
Opcode: 0x43
Operands: 1 (size)
Encoding: 43 01 02 <size>
```

---

## Frame Safety

### Stack Overflow Detection
Frame overflow is detected and reported.

### Frame Underflow Detection
Frame underflow is detected and reported.

### FP Consistency
Frame pointer consistency is verified.
