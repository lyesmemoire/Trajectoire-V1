# ISA-022: Versioning Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define versioning instructions for versioning operations

---

## VERSION_CHECK
**Opcode**: 0xE0  
**Category**: Versioning  
**Description**: Check version compatibility

**Encoding**:
```
[opcode: 1 byte]
[version: 4 bytes]
[required: 4 bytes]
```

**Operands**:
- version: Current version identifier
- required: Required version identifier

**Side Effects**: Checks version compatibility, returns compatibility result

**Latency**: 5 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 32 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VERSION_CHECK version_id, required_id
```

---

## VERSION_GET
**Opcode**: 0xE1  
**Category**: Versioning  
**Description**: Get current version

**Encoding**:
```
[opcode: 1 byte]
[component: 4 bytes]
```

**Operands**:
- component: Component identifier

**Side Effects**: Returns current version of component

**Latency**: 5 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 32 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VERSION_GET component_id
```

---

## VERSION_MIGRATE
**Opcode**: 0xE2  
**Category**: Versioning  
**Description**: Migrate to new version

**Encoding**:
```
[opcode: 1 byte]
[target: 4 bytes]
[component: 4 bytes]
```

**Operands**:
- target: Target version identifier
- component: Component identifier

**Side Effects**: Migrates component to target version

**Latency**: 100 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 512 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VERSION_MIGRATE target_id, component_id
```

---

## VERSION_ROLLBACK
**Opcode**: 0xE3  
**Category**: Versioning  
**Description**: Rollback to previous version

**Encoding**:
```
[opcode: 1 byte]
[component: 4 bytes]
```

**Operands**:
- component: Component identifier

**Side Effects**: Rolls back component to previous version

**Latency**: 75 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 384 bytes

**Rollback**: yes

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VERSION_ROLLBACK component_id
```
