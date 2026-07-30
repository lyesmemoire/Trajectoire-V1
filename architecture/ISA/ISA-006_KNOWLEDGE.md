# ISA-006: Knowledge Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define knowledge instructions for knowledge operations

---

## KNOWLEDGE_LOOKUP
**Opcode**: 0x70  
**Category**: Knowledge  
**Description**: Lookup knowledge from knowledge base

**Encoding**:
```
[opcode: 1 byte]
[query: 4 bytes]
[knowledge_base: 4 bytes]
```

**Operands**:
- query: Query identifier
- knowledge_base: Knowledge base identifier

**Side Effects**: Returns knowledge, updates access statistics

**Latency**: 20 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 128 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_LOOKUP query_id, kb_id
```

---

## KNOWLEDGE_STORE
**Opcode**: 0x71  
**Category**: Knowledge  
**Description**: Store knowledge in knowledge base

**Encoding**:
```
[opcode: 1 byte]
[knowledge: 4 bytes]
[knowledge_base: 4 bytes]
```

**Operands**:
- knowledge: Knowledge identifier
- knowledge_base: Knowledge base identifier

**Side Effects**: Stores knowledge, updates knowledge base

**Latency**: 15 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 256 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_STORE knowledge_id, kb_id
```

---

## KNOWLEDGE_UPDATE
**Opcode**: 0x72  
**Category**: Knowledge  
**Description**: Update existing knowledge

**Encoding**:
```
[opcode: 1 byte]
[knowledge: 4 bytes]
[update: 4 bytes]
```

**Operands**:
- knowledge: Knowledge identifier
- update: Update data identifier

**Side Effects**: Updates knowledge, updates knowledge base

**Latency**: 18 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 192 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_UPDATE knowledge_id, update_id
```

---

## KNOWLEDGE_DELETE
**Opcode**: 0x73  
**Category**: Knowledge  
**Description**: Delete knowledge from knowledge base

**Encoding**:
```
[opcode: 1 byte]
[knowledge: 4 bytes]
[knowledge_base: 4 bytes]
```

**Operands**:
- knowledge: Knowledge identifier
- knowledge_base: Knowledge base identifier

**Side Effects**: Deletes knowledge, updates knowledge base

**Latency**: 12 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_DELETE knowledge_id, kb_id
```

---

## KNOWLEDGE_QUERY
**Opcode**: 0x74  
**Category**: Knowledge  
**Description**: Query knowledge base

**Encoding**:
```
[opcode: 1 byte]
[query: 4 bytes]
[knowledge_base: 4 bytes]
[results: 4 bytes]
```

**Operands**:
- query: Query identifier
- knowledge_base: Knowledge base identifier
- results: Results identifier

**Side Effects**: Queries knowledge base, returns results

**Latency**: 30 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 256 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_QUERY query_id, kb_id, results_id
```

---

## KNOWLEDGE_INDEX
**Opcode**: 0x75  
**Category**: Knowledge  
**Description**: Index knowledge for faster lookup

**Encoding**:
```
[opcode: 1 byte]
[knowledge: 4 bytes]
[indexer: 4 bytes]
```

**Operands**:
- knowledge: Knowledge identifier
- indexer: Indexer function (constant pool index)

**Side Effects**: Indexes knowledge, updates index

**Latency**: 25 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 128 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_INDEX knowledge_id, indexer_id
```

---

## KNOWLEDGE_VALIDATE
**Opcode**: 0x76  
**Category**: Knowledge  
**Description**: Validate knowledge consistency

**Encoding**:
```
[opcode: 1 byte]
[knowledge: 4 bytes]
[validator: 4 bytes]
```

**Operands**:
- knowledge: Knowledge identifier
- validator: Validation function (constant pool index)

**Side Effects**: Validates knowledge, returns validation result

**Latency**: 22 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 96 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_VALIDATE knowledge_id, validator_id
```

---

## KNOWLEDGE_MERGE
**Opcode**: 0x77  
**Category**: Knowledge  
**Description**: Merge multiple knowledge items

**Encoding**:
```
[opcode: 1 byte]
[knowledge_items: 4 bytes]
[count: 4 bytes]
[merger: 4 bytes]
```

**Operands**:
- knowledge_items: Knowledge identifiers array
- count: Number of knowledge items
- merger: Merge function (constant pool index)

**Side Effects**: Merges knowledge, creates merged knowledge

**Latency**: 35 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 384 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
KNOWLEDGE_MERGE knowledge_array, 5, merger_id
```
