# CBS-008: Branches

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the branch instructions in Cognitive Bytecode

---

## Purpose

Branch instructions enable control flow, including conditional and unconditional jumps.

---

## Branch Types

### Unconditional Branch
Jump to a target address.

```
BR <target>
```

### Conditional Branch
Jump based on condition.

```
BR_IF <condition>, <true_target>, <false_target>
```

### Switch
Multi-way branch.

```
SWITCH <value>, <default_target>, <case_count>, <cases>
```

### Table Switch
Table-based switch for efficiency.

```
TABLE_SWITCH <value>, <default_target>, <min_value>, <max_value>, <table>
```

---

## Branch Operations

### BR
Unconditional branch.

```
BR <target>
```

### BR_IF
Conditional branch.

```
BR_IF <condition>, <true_target>, <false_target>
```

### JMP
Jump to address.

```
JMP <address>
```

### JMP_IF
Conditional jump to address.

```
JMP_IF <condition>, <true_address>, <false_address>
```

---

## Branch Prediction

### Static Prediction
Branch prediction hints in bytecode.

```
BR <target> [likely]
BR <target> [unlikely]
```

### Dynamic Prediction
Runtime branch prediction using branch history.

---

## Branch Operations Encoding

### BR
```
Opcode: 0x20
Operands: 1 (target)
Encoding: 20 01 05 <target>
```

### BR_IF
```
Opcode: 0x21
Operands: 3 (condition, true_target, false_target)
Encoding: 21 03 <condition> 05 <true_target> 05 <false_target>
```

### JMP
```
Opcode: 0x24
Operands: 1 (address)
Encoding: 24 01 03 <address>
```

### JMP_IF
```
Opcode: 0x25
Operands: 3 (condition, true_address, false_address)
Encoding: 25 03 <condition> 03 <true_address> 03 <false_address>
```

---

## Branch Safety

### Target Validity
Branch targets must be valid instruction addresses.

### Stack Balance
Stack must be balanced across branches.

### Type Consistency
Stack types must be consistent across branches.
