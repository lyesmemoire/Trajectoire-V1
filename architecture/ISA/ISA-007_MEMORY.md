# ISA-007: Memory Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define memory instructions for memory operations

---

## MEM_READ
**Opcode**: 0x78  
**Category**: Memory  
**Description**: Read from cognitive memory

**Encoding**:
```
[opcode: 1 byte]
[key: 4 bytes]
[memory: 4 bytes]
```

**Operands**:
- key: Key identifier
- memory: Memory identifier

**Side Effects**: Reads from memory, updates access statistics

**Latency**: 5 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 32 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_READ key_id, memory_id
```

---

## MEM_WRITE
**Opcode**: 0x79  
**Category**: Memory  
**Description**: Write to cognitive memory

**Encoding**:
```
[opcode: 1 byte]
[key: 4 bytes]
[value: 4 bytes]
[memory: 4 bytes]
```

**Operands**:
- key: Key identifier
- value: Value identifier
- memory: Memory identifier

**Side Effects**: Writes to memory, updates memory

**Latency**: 8 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_WRITE key_id, value_id, memory_id
```

---

## MEM_LOOKUP
**Opcode**: 0x7A  
**Category**: Memory  
**Description**: Lookup in cognitive memory

**Encoding**:
```
[opcode: 1 byte]
[query: 4 bytes]
[memory: 4 bytes]
```

**Operands**:
- query: Query identifier
- memory: Memory identifier

**Side Effects**: Looks up in memory, returns results

**Latency**: 10 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_LOOKUP query_id, memory_id
```

---

## MEM_UPDATE
**Opcode**: 0x7B  
**Category**: Memory  
**Description**: Update cognitive memory

**Encoding**:
```
[opcode: 1 byte]
[key: 4 bytes]
[update: 4 bytes]
[memory: 4 bytes]
```

**Operands**:
- key: Key identifier
- update: Update data identifier
- memory: Memory identifier

**Side Effects**: Updates memory, updates memory

**Latency**: 12 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 96 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_UPDATE key_id, update_id, memory_id
```

---

## MEM_DELETE
**Opcode**: 0x7C  
**Category**: Memory  
**Description**: Delete from cognitive memory

**Encoding**:
```
[opcode: 1 byte]
[key: 4 bytes]
[memory: 4 bytes]
```

**Operands**:
- key: Key identifier
- memory: Memory identifier

**Side Effects**: Deletes from memory, updates memory

**Latency**: 7 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 32 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_DELETE key_id, memory_id
```

---

## MEM_ALLOC
**Opcode**: 0x7D  
**Category**: Memory  
**Description**: Allocate memory block

**Encoding**:
```
[opcode: 1 byte]
[size: 4 bytes]
[memory: 4 bytes]
```

**Operands**:
- size: Size in bytes
- memory: Memory identifier

**Side Effects**: Allocates memory block, returns block identifier

**Latency**: 15 cycles

**Token Cost**: 0 tokens

**Memory Cost**: size bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_ALLOC 1024, memory_id
```

---

## MEM_FREE
**Opcode**: 0x7E  
**Category**: Memory  
**Description**: Free memory block

**Encoding**:
```
[opcode: 1 byte]
[block: 4 bytes]
[memory: 4 bytes]
```

**Operands**:
- block: Block identifier
- memory: Memory identifier

**Side Effects**: Frees memory block, updates memory

**Latency**: 10 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 0 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_FREE block_id, memory_id
```

---

## MEM_COPY
**Opcode**: 0x7F  
**Category**: Memory  
**Description**: Copy memory block

**Encoding**:
```
[opcode: 1 byte]
[source: 4 bytes]
[destination: 4 bytes]
[size: 4 bytes]
```

**Operands**:
- source: Source block identifier
- destination: Destination block identifier
- size: Size in bytes

**Side Effects**: Copies memory, updates destination

**Latency**: 20 cycles

**Token Cost**: 0 tokens

**Memory Cost**: size bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_COPY source_id, dest_id, 1024
```

---

## MEM_CLEAR
**Opcode**: 0x80  
**Category**: Memory  
**Description**: Clear memory block

**Encoding**:
```
[opcode: 1 byte]
[block: 4 bytes]
[size: 4 bytes]
```

**Operands**:
- block: Block identifier
- size: Size in bytes

**Side Effects**: Clears memory block, updates block

**Latency**: 15 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 0 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_CLEAR block_id, 1024
```

---

## MEM_COMPACT
**Opcode**: 0x81  
**Category**: Memory  
**Description**: Compact memory

**Encoding**:
```
[opcode: 1 byte]
[memory: 4 bytes]
```

**Operands**:
- memory: Memory identifier

**Side Effects**: Compacts memory, defragments blocks

**Latency**: 50 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 0 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
MEM_COMPACT memory_id
```
