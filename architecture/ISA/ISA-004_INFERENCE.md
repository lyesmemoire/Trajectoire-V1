# ISA-004: Inference Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define inference instructions for inference operations

---

## INFER
**Opcode**: 0x64  
**Category**: Inference  
**Description**: Perform inference on model

**Encoding**:
```
[opcode: 1 byte]
[model: 4 bytes]
[input: 4 bytes]
```

**Operands**:
- model: Model identifier
- input: Input identifier

**Side Effects**: Creates inference result, updates cognitive state

**Latency**: 100 cycles

**Token Cost**: 500 tokens

**Memory Cost**: 512 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
INFER model_id, input_id
```

---

## INFER_BATCH
**Opcode**: 0x65  
**Category**: Inference  
**Description**: Perform batch inference

**Encoding**:
```
[opcode: 1 byte]
[model: 4 bytes]
[inputs: 4 bytes]
[count: 4 bytes]
```

**Operands**:
- model: Model identifier
- inputs: Input identifiers array
- count: Number of inputs

**Side Effects**: Creates batch inference results, updates cognitive state

**Latency**: 500 cycles

**Token Cost**: 500 * count tokens

**Memory Cost**: 512 * count bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
INFER_BATCH model_id, input_array, 10
```

---

## INFER_STREAM
**Opcode**: 0x66  
**Category**: Inference  
**Description**: Perform streaming inference

**Encoding**:
```
[opcode: 1 byte]
[model: 4 bytes]
[stream: 4 bytes]
```

**Operands**:
- model: Model identifier
- stream: Stream identifier

**Side Effects**: Creates streaming inference results, updates cognitive state

**Latency**: variable

**Token Cost**: 500 tokens per inference

**Memory Cost**: 512 bytes per inference

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
INFER_STREAM model_id, stream_id
```

---

## INFER_ENSEMBLE
**Opcode**: 0x67  
**Category**: Inference  
**Description**: Perform ensemble inference

**Encoding**:
```
[opcode: 1 byte]
[models: 4 bytes]
[count: 4 bytes]
[input: 4 bytes]
[aggregation: 4 bytes]
```

**Operands**:
- models: Model identifiers array
- count: Number of models
- input: Input identifier
- aggregation: Aggregation function (constant pool index)

**Side Effects**: Creates ensemble inference result, updates cognitive state

**Latency**: 200 cycles

**Token Cost**: 500 * count tokens

**Memory Cost**: 512 * count bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
INFER_ENSEMBLE model_array, 5, input_id, agg_id
```

---

## INFER_ADAPTIVE
**Opcode**: 0x68  
**Category**: Inference  
**Description**: Perform adaptive inference

**Encoding**:
```
[opcode: 1 byte]
[model: 4 bytes]
[input: 4 bytes]
[feedback: 4 bytes]
```

**Operands**:
- model: Model identifier
- input: Input identifier
- feedback: Feedback identifier

**Side Effects**: Creates adaptive inference result, updates model

**Latency**: 150 cycles

**Token Cost**: 600 tokens

**Memory Cost**: 768 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
INFER_ADAPTIVE model_id, input_id, feedback_id
```

---

## INFER_CACHED
**Opcode**: 0x69  
**Category**: Inference  
**Description**: Perform cached inference

**Encoding**:
```
[opcode: 1 byte]
[model: 4 bytes]
[input: 4 bytes]
[cache: 4 bytes]
```

**Operands**:
- model: Model identifier
- input: Input identifier
- cache: Cache identifier

**Side Effects**: Returns cached inference or performs new inference

**Latency**: 10 cycles (cached) or 100 cycles (new)

**Token Cost**: 0 tokens (cached) or 500 tokens (new)

**Memory Cost**: 512 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
INFER_CACHED model_id, input_id, cache_id
```
