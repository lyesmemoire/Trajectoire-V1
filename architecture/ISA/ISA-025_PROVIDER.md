# ISA-025: Provider Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define provider instructions for provider operations

---

## PROVIDER_CALL
**Opcode**: 0xF0  
**Category**: Provider  
**Description**: Call LLM provider

**Encoding**:
```
[opcode: 1 byte]
[provider: 4 bytes]
[prompt: 4 bytes]
[config: 4 bytes]
```

**Operands**:
- provider: Provider identifier
- prompt: Prompt identifier
- config: Configuration identifier

**Side Effects**: Calls provider, returns response

**Latency**: variable (depends on provider)

**Token Cost**: variable (depends on prompt)

**Memory Cost**: 512 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: no (LLM output is non-deterministic)

**Example**:
```
PROVIDER_CALL provider_id, prompt_id, config_id
```

---

## PROVIDER_STREAM
**Opcode**: 0xF1  
**Category**: Provider  
**Description**: Stream response from provider

**Encoding**:
```
[opcode: 1 byte]
[provider: 4 bytes]
[prompt: 4 bytes]
[config: 4 bytes]
[handler: 4 bytes]
```

**Operands**:
- provider: Provider identifier
- prompt: Prompt identifier
- config: Configuration identifier
- handler: Stream handler (constant pool index)

**Side Effects**: Streams response, calls handler for each chunk

**Latency**: variable

**Token Cost**: variable

**Memory Cost**: 512 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: no

**Example**:
```
PROVIDER_STREAM provider_id, prompt_id, config_id, handler_id
```

---

## PROVIDER_BATCH
**Opcode**: 0xF2  
**Category**: Provider  
**Description**: Batch multiple provider calls

**Encoding**:
```
[opcode: 1 byte]
[provider: 4 bytes]
[prompts: 4 bytes]
[count: 4 bytes]
[config: 4 bytes]
```

**Operands**:
- provider: Provider identifier
- prompts: Prompt identifiers array
- count: Number of prompts
- config: Configuration identifier

**Side Effects**: Batches calls, returns responses

**Latency**: variable

**Token Cost**: variable

**Memory Cost**: 512 * count bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: no

**Example**:
```
PROVIDER_BATCH provider_id, prompt_array, 10, config_id
```

---

## PROVIDER_CONFIGURE
**Opcode**: 0xF3  
**Category**: Provider  
**Description**: Configure provider

**Encoding**:
```
[opcode: 1 byte]
[provider: 4 bytes]
[config: 4 bytes]
```

**Operands**:
- provider: Provider identifier
- config: Configuration identifier

**Side Effects**: Configures provider, updates provider state

**Latency**: 20 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 128 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PROVIDER_CONFIGURE provider_id, config_id
```

---

## PROVIDER_STATUS
**Opcode**: 0xF4  
**Category**: Provider  
**Description**: Get provider status

**Encoding**:
```
[opcode: 1 byte]
[provider: 4 bytes]
```

**Operands**:
- provider: Provider identifier

**Side Effects**: Returns provider status

**Latency**: 10 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PROVIDER_STATUS provider_id
```

---

## PROVIDER_METRICS
**Opcode**: 0xF5  
**Category**: Provider  
**Description**: Get provider metrics

**Encoding**:
```
[opcode: 1 byte]
[provider: 4 bytes]
```

**Operands**:
- provider: Provider identifier

**Side Effects**: Returns provider metrics (latency, tokens, cost, etc.)

**Latency**: 15 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 128 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PROVIDER_METRICS provider_id
```

---

## PROVIDER_SELECT
**Opcode**: 0xF6  
**Category**: Provider  
**Description**: Select best provider for request

**Encoding**:
```
[opcode: 1 byte]
[request: 4 bytes]
[candidates: 4 bytes]
[count: 4 bytes]
[selector: 4 bytes]
```

**Operands**:
- request: Request identifier
- candidates: Provider identifiers array
- count: Number of candidates
- selector: Selection function (constant pool index)

**Side Effects**: Selects best provider, returns selected provider

**Latency**: 25 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 192 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PROVIDER_SELECT request_id, provider_array, 5, selector_id
```

---

## PROVIDER_FEDERATE
**Opcode**: 0xF7  
**Category**: Provider  
**Description**: Federate across multiple providers

**Encoding**:
```
[opcode: 1 byte]
[request: 4 bytes]
[providers: 4 bytes]
[count: 4 bytes]
[federation: 4 bytes]
```

**Operands**:
- request: Request identifier
- providers: Provider identifiers array
- count: Number of providers
- federation: Federation strategy (constant pool index)

**Side Effects**: Federates request across providers, returns federated response

**Latency**: variable

**Token Cost**: variable

**Memory Cost**: 512 * count bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: no

**Example**:
```
PROVIDER_FEDERATE request_id, provider_array, 3, federation_id
```
