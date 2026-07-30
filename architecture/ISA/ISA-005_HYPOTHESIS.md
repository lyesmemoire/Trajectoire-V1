# ISA-005: Hypothesis Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define hypothesis instructions for hypothesis generation and validation

---

## HYPOTHESIZE
**Opcode**: 0x6A  
**Category**: Hypothesis  
**Description**: Generate hypothesis from observations

**Encoding**:
```
[opcode: 1 byte]
[observations: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- observations: Observation identifiers array
- count: Number of observations

**Side Effects**: Creates hypothesis, updates cognitive state

**Latency**: 40 cycles

**Token Cost**: 150 tokens

**Memory Cost**: 192 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
HYPOTHESIZE obs_array, 5
```

---

## HYPOTHESIZE_VALIDATE
**Opcode**: 0x6B  
**Category**: Hypothesis  
**Description**: Validate hypothesis against evidence

**Encoding**:
```
[opcode: 1 byte]
[hypothesis: 4 bytes]
[evidence: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- hypothesis: Hypothesis identifier
- evidence: Evidence identifiers array
- count: Number of evidence

**Side Effects**: Validates hypothesis, updates confidence

**Latency**: 30 cycles

**Token Cost**: 100 tokens

**Memory Cost**: 128 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
HYPOTHESIZE_VALIDATE hyp_id, evidence_array, 3
```

---

## HYPOTHESIZE_REFINE
**Opcode**: 0x6C  
**Category**: Hypothesis  
**Description**: Refine hypothesis based on feedback

**Encoding**:
```
[opcode: 1 byte]
[hypothesis: 4 bytes]
[feedback: 4 bytes]
```

**Operands**:
- hypothesis: Hypothesis identifier
- feedback: Feedback identifier

**Side Effects**: Refines hypothesis, creates refined hypothesis

**Latency**: 35 cycles

**Token Cost**: 125 tokens

**Memory Cost**: 160 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
HYPOTHESIZE_REFINE hyp_id, feedback_id
```

---

## HYPOTHESIZE_MERGE
**Opcode**: 0x6D  
**Category**: Hypothesis  
**Description**: Merge multiple hypotheses

**Encoding**:
```
[opcode: 1 byte]
[hypotheses: 4 bytes]
[count: 4 bytes]
[merger: 4 bytes]
```

**Operands**:
- hypotheses: Hypothesis identifiers array
- count: Number of hypotheses
- merger: Merge function (constant pool index)

**Side Effects**: Merges hypotheses, creates merged hypothesis

**Latency**: 45 cycles

**Token Cost**: 175 tokens

**Memory Cost**: 224 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
HYPOTHESIZE_MERGE hyp_array, 4, merger_id
```

---

## HYPOTHESIZE_RANK
**Opcode**: 0x6E  
**Category**: Hypothesis  
**Description**: Rank hypotheses by confidence

**Encoding**:
```
[opcode: 1 byte]
[hypotheses: 4 bytes]
[count: 4 bytes]
[ranker: 4 bytes]
```

**Operands**:
- hypotheses: Hypothesis identifiers array
- count: Number of hypotheses
- ranker: Ranking function (constant pool index)

**Side Effects**: Ranks hypotheses, adds ranking metadata

**Latency**: 25 cycles

**Token Cost**: 75 tokens

**Memory Cost**: 96 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
HYPOTHESIZE_RANK hyp_array, 10, ranker_id
```

---

## HYPOTHESIZE_SELECT
**Opcode**: 0x6F  
**Category**: Hypothesis  
**Description**: Select best hypothesis

**Encoding**:
```
[opcode: 1 byte]
[hypotheses: 4 bytes]
[count: 4 bytes]
[selector: 4 bytes]
```

**Operands**:
- hypotheses: Hypothesis identifiers array
- count: Number of hypotheses
- selector: Selection function (constant pool index)

**Side Effects**: Selects best hypothesis, returns selected hypothesis

**Latency**: 20 cycles

**Token Cost**: 50 tokens

**Memory Cost**: 64 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
HYPOTHESIZE_SELECT hyp_array, 5, selector_id
```
