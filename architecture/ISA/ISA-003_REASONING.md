# ISA-003: Reasoning Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define reasoning instructions for cognitive reasoning operations

---

## REASON
**Opcode**: 0x5C  
**Category**: Reasoning  
**Description**: Perform reasoning operation on inputs

**Encoding**:
```
[opcode: 1 byte]
[inputs: 4 bytes]
[count: 4 bytes]
[reasoner: 4 bytes]
```

**Operands**:
- inputs: Input identifiers array
- count: Number of inputs
- reasoner: Reasoning model (constant pool index)

**Side Effects**: Creates reasoning result, updates cognitive state

**Latency**: 50 cycles

**Token Cost**: 200 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON input_array, 3, reasoner_id
```

---

## REASON_CHAIN
**Opcode**: 0x5D  
**Category**: Reasoning  
**Description**: Chain multiple reasoning operations

**Encoding**:
```
[opcode: 1 byte]
[reasoners: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- reasoners: Reasoner identifiers array
- count: Number of reasoners

**Side Effects**: Chains reasoning operations, creates chained result

**Latency**: 100 cycles

**Token Cost**: 200 * count tokens

**Memory Cost**: 256 * count bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON_CHAIN reasoner_array, 5
```

---

## REASON_ABSTRACT
**Opcode**: 0x5E  
**Category**: Reasoning  
**Description**: Abstract reasoning from specific instances

**Encoding**:
```
[opcode: 1 byte]
[instances: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- instances: Instance identifiers array
- count: Number of instances

**Side Effects**: Creates abstraction, updates knowledge

**Latency**: 75 cycles

**Token Cost**: 300 tokens

**Memory Cost**: 512 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON_ABSTRACT instance_array, 10
```

---

## REASON_DEDUCE
**Opcode**: 0x5F  
**Category**: Reasoning  
**Description**: Deduce conclusions from premises

**Encoding**:
```
[opcode: 1 byte]
[premises: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- premises: Premise identifiers array
- count: Number of premises

**Side Effects**: Deduces conclusion, updates cognitive state

**Latency**: 60 cycles

**Token Cost**: 250 tokens

**Memory Cost**: 384 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON_DEDUCE premise_array, 4
```

---

## REASON_INDUCE
**Opcode**: 0x60  
**Category**: Reasoning  
**Description**: Induce general rules from observations

**Encoding**:
```
[opcode: 1 byte]
[observations: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- observations: Observation identifiers array
- count: Number of observations

**Side Effects**: Induces rule, updates knowledge

**Latency**: 80 cycles

**Token Cost**: 350 tokens

**Memory Cost**: 512 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON_INDUCE obs_array, 20
```

---

## REASON_ANALOGY
**Opcode**: 0x61  
**Category**: Reasoning  
**Description**: Reason by analogy

**Encoding**:
```
[opcode: 1 byte]
[source: 4 bytes]
[target: 4 bytes]
[mapping: 4 bytes]
```

**Operands**:
- source: Source domain identifier
- target: Target domain identifier
- mapping: Mapping function (constant pool index)

**Side Effects**: Creates analogy, updates cognitive state

**Latency**: 70 cycles

**Token Cost**: 280 tokens

**Memory Cost**: 448 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON_ANALOGY source_id, target_id, mapping_id
```

---

## REASON_CAUSAL
**Opcode**: 0x62  
**Category**: Reasoning  
**Description**: Reason about causal relationships

**Encoding**:
```
[opcode: 1 byte]
[effect: 4 bytes]
[causes: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- effect: Effect identifier
- causes: Cause identifiers array
- count: Number of causes

**Side Effects**: Creates causal model, updates knowledge

**Latency**: 65 cycles

**Token Cost**: 260 tokens

**Memory Cost**: 384 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON_CAUSAL effect_id, cause_array, 3
```

---

## REASON_COUNTERFACTUAL
**Opcode**: 0x63  
**Category**: Reasoning  
**Description**: Reason about counterfactual scenarios

**Encoding**:
```
[opcode: 1 byte]
[scenario: 4 bytes]
[alternatives: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- scenario: Scenario identifier
- alternatives: Alternative identifiers array
- count: Number of alternatives

**Side Effects**: Creates counterfactual reasoning, updates cognitive state

**Latency**: 90 cycles

**Token Cost**: 400 tokens

**Memory Cost**: 640 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
REASON_COUNTERFACTUAL scenario_id, alt_array, 5
```
