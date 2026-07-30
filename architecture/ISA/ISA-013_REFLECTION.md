# ISA-013: Reflection Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define reflection instructions for reflection operations

---

## REFLECT
**Opcode**: 0xA0  
**Category**: Reflection  
**Description**: Reflect on cognitive state

**Encoding**:
```
[opcode: 1 byte]
[state: 4 bytes]
[reflector: 4 bytes]
```

**Operands**:
- state: Cognitive state identifier
- reflector: Reflection function (constant pool index)

**Side Effects**: Creates reflection, updates cognitive state

**Latency**: 55 cycles

**Token Cost**: 275 tokens

**Memory Cost**: 352 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REFLECT state_id, reflector_id
```

---

## REFLECT_SELF
**Opcode**: 0xA1  
**Category**: Reflection  
**Description**: Self-reflection on own cognitive state

**Encoding**:
```
[opcode: 1 byte]
[reflector: 4 bytes]
```

**Operands**:
- reflector: Reflection function (constant pool index)

**Side Effects**: Creates self-reflection, updates cognitive state

**Latency**: 60 cycles

**Token Cost**: 300 tokens

**Memory Cost**: 384 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REFLECT_SELF reflector_id
```

---

## REFLECT_METACOGNITIVE
**Opcode**: 0xA2  
**Category**: Reflection  
**Description**: Metacognitive reflection on thinking processes

**Encoding**:
```
[opcode: 1 byte]
[processes: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- processes: Process identifiers array
- count: Number of processes

**Side Effects**: Creates metacognitive reflection, updates cognitive state

**Latency**: 70 cycles

**Token Cost**: 350 tokens

**Memory Cost**: 448 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REFLECT_METACOGNITIVE process_array, 5
```

---

## REFLECT_EVALUATE
**Opcode**: 0xA3  
**Category**: Reflection  
**Description**: Evaluate reflection quality

**Encoding**:
```
[opcode: 1 byte]
[reflection: 4 bytes]
[evaluator: 4 bytes]
```

**Operands**:
- reflection: Reflection identifier
- evaluator: Evaluation function (constant pool index)

**Side Effects**: Evaluates reflection, adds evaluation metadata

**Latency**: 30 cycles

**Token Cost**: 150 tokens

**Memory Cost**: 192 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REFLECT_EVALUATE reflection_id, evaluator_id
```

---

## REFLECT_IMPROVE
**Opcode**: 0xA4  
**Category**: Reflection  
**Description**: Improve based on reflection

**Encoding**:
```
[opcode: 1 byte]
[reflection: 4 bytes]
[improver: 4 bytes]
```

**Operands**:
- reflection: Reflection identifier
- improver: Improvement function (constant pool index)

**Side Effects**: Improves based on reflection, updates cognitive state

**Latency**: 40 cycles

**Token Cost**: 200 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REFLECT_IMPROVE reflection_id, improver_id
```

---

## REFLECT_LEARN
**Opcode**: 0xA5  
**Category**: Reflection  
**Description**: Learn from reflection

**Encoding**:
```
[opcode: 1 byte]
[reflection: 4 bytes]
[learner: 4 bytes]
```

**Operands**:
- reflection: Reflection identifier
- learner: Learning model identifier

**Side Effects**: Learns from reflection, updates knowledge

**Latency**: 50 cycles

**Token Cost**: 250 tokens

**Memory Cost**: 320 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REFLECT_LEARN reflection_id, learner_id
```
