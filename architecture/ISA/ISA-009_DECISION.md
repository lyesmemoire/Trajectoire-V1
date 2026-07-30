# ISA-009: Decision Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define decision instructions for decision-making operations

---

## DECIDE
**Opcode**: 0x88  
**Category**: Decision  
**Description**: Make decision from inputs

**Encoding**:
```
[opcode: 1 byte]
[inputs: 4 bytes]
[count: 4 bytes]
[decider: 4 bytes]
```

**Operands**:
- inputs: Input identifiers array
- count: Number of inputs
- decider: Decision model (constant pool index)

**Side Effects**: Creates decision, updates cognitive state

**Latency**: 45 cycles

**Token Cost**: 200 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
DECIDE input_array, 4, decider_id
```

---

## DECIDE_EVALUATE
**Opcode**: 0x89  
**Category**: Decision  
**Description**: Evaluate decision quality

**Encoding**:
```
[opcode: 1 byte]
[decision: 4 bytes]
[evaluator: 4 bytes]
```

**Operands**:
- decision: Decision identifier
- evaluator: Evaluation function (constant pool index)

**Side Effects**: Evaluates decision, adds evaluation metadata

**Latency**: 25 cycles

**Token Cost**: 100 tokens

**Memory Cost**: 128 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
DECIDE_EVALUATE decision_id, evaluator_id
```

---

## DECIDE_COMMIT
**Opcode**: 0x8A  
**Category**: Decision  
**Description**: Commit decision to execution

**Encoding**:
```
[opcode: 1 byte]
[decision: 4 bytes]
```

**Operands**:
- decision: Decision identifier

**Side Effects**: Commits decision, updates execution state

**Latency**: 15 cycles

**Token Cost**: 50 tokens

**Memory Cost**: 64 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
DECIDE_COMMIT decision_id
```

---

## DECIDE_ROLLBACK
**Opcode**: 0x8B  
**Category**: Decision  
**Description**: Rollback decision

**Encoding**:
```
[opcode: 1 byte]
[decision: 4 bytes]
```

**Operands**:
- decision: Decision identifier

**Side Effects**: Rolls back decision, restores previous state

**Latency**: 20 cycles

**Token Cost**: 75 tokens

**Memory Cost**: 96 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
DECIDE_ROLLBACK decision_id
```

---

## DECIDE_COMPARE
**Opcode**: 0x8C  
**Category**: Decision  
**Description**: Compare multiple decisions

**Encoding**:
```
[opcode: 1 byte]
[decisions: 4 bytes]
[count: 4 bytes]
[comparer: 4 bytes]
```

**Operands**:
- decisions: Decision identifiers array
- count: Number of decisions
- comparer: Comparison function (constant pool index)

**Side Effects**: Compares decisions, returns comparison result

**Latency**: 30 cycles

**Token Cost**: 125 tokens

**Memory Cost**: 160 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
DECIDE_COMPARE decision_array, 3, comparer_id
```

---

## DECIDE_SELECT
**Opcode**: 0x8D  
**Category**: Decision  
**Description**: Select best decision from alternatives

**Encoding**:
```
[opcode: 1 byte]
[decisions: 4 bytes]
[count: 4 bytes]
[selector: 4 bytes]
```

**Operands**:
- decisions: Decision identifiers array
- count: Number of decisions
- selector: Selection function (constant pool index)

**Side Effects**: Selects best decision, returns selected decision

**Latency**: 35 cycles

**Token Cost**: 150 tokens

**Memory Cost**: 192 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
DECIDE_SELECT decision_array, 5, selector_id
```
