# ISA-023: Persistence Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define persistence instructions for persistence operations

---

## PERSIST_SAVE
**Opcode**: 0xE4  
**Category**: Persistence  
**Description**: Save state to persistent storage

**Encoding**:
```
[opcode: 1 byte]
[state: 4 bytes]
[destination: 4 bytes]
```

**Operands**:
- state: State identifier
- destination: Destination identifier

**Side Effects**: Saves state to persistent storage

**Latency**: 100 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 512 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PERSIST_SAVE state_id, dest_id
```

---

## PERSIST_LOAD
**Opcode**: 0xE5  
**Category**: Persistence  
**Description**: Load state from persistent storage

**Encoding**:
```
[opcode: 1 byte]
[source: 4 bytes]
```

**Operands**:
- source: Source identifier

**Side Effects**: Loads state from persistent storage

**Latency**: 100 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 512 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PERSIST_LOAD source_id
```

---

## PERSIST_DELETE
**Opcode**: 0xE6  
**Category**: Persistence  
**Description**: Delete state from persistent storage

**Encoding**:
```
[opcode: 1 byte]
[state: 4 bytes]
```

**Operands**:
- state: State identifier

**Side Effects**: Deletes state from persistent storage

**Latency**: 50 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PERSIST_DELETE state_id
```

---

## PERSIST_SNAPSHOT
**Opcode**: 0xE7  
**Category**: Persistence  
**Description**: Create snapshot of current state

**Encoding**:
```
[opcode: 1 byte]
[snapshot: 4 bytes]
```

**Operands**:
- snapshot: Snapshot identifier

**Side Effects**: Creates snapshot of current state

**Latency**: 75 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 384 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PERSIST_SNAPSHOT snapshot_id
```

---

## PERSIST_RESTORE
**Opcode**: 0xE8  
**Category**: Persistence  
**Description**: Restore state from snapshot

**Encoding**:
```
[opcode: 1 byte]
[snapshot: 4 bytes]
```

**Operands**:
- snapshot: Snapshot identifier

**Side Effects**: Restores state from snapshot

**Latency**: 75 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 384 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PERSIST_RESTORE snapshot_id
```

---

## PERSIST_CHECKPOINT
**Opcode**: 0xE9  
**Category**: Persistence  
**Description**: Create checkpoint for rollback

**Encoding**:
```
[opcode: 1 byte]
[checkpoint: 4 bytes]
```

**Operands**:
- checkpoint: Checkpoint identifier

**Side Effects**: Creates checkpoint for rollback

**Latency**: 40 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 192 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
PERSIST_CHECKPOINT checkpoint_id
```
