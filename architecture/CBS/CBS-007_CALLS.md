# CBS-007: Calls

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the call convention in Cognitive Bytecode

---

## Purpose

The call convention defines how functions are called, arguments are passed, and return values are handled.

---

## Call Convention

### Register Calling Convention
Arguments are passed in registers:

```
R0-R7: Argument registers (first 8 arguments)
R8: Return value register
FP: Frame pointer
SP: Stack pointer
```

### Stack Calling Convention
Additional arguments are passed on the stack:

```
[Argument 9]
[Argument 8]
...
```

---

## Call Operations

### CALL
Call a function.

```
CALL <function_id>
```

### RET
Return from function.

```
RET <value>
```

### TAILCALL
Tail call optimization.

```
TAILCALL <function_id>
```

---

## Call Sequence

### Caller
```
1. Push arguments (if > 8)
2. Load arguments into R0-R7
3. CALL function
4. Retrieve return value from R8
5. Clean up stack (if needed)
```

### Callee
```
1. ENTER frame
2. Execute function body
3. RET value
```

---

## Call Operations Encoding

### CALL
```
Opcode: 0x22
Operands: 1 (function_id)
Encoding: 22 01 04 <function_id>
```

### RET
```
Opcode: 0x23
Operands: 1 (value)
Encoding: 23 01 <value>
```

### TAILCALL
```
Opcode: 0x2A
Operands: 1 (function_id)
Encoding: 2A 01 04 <function_id>
```

---

## Call Safety

### Stack Balance
Stack must be balanced after call.

### Argument Count
Argument count must match function signature.

### Return Type
Return type must match function signature.
