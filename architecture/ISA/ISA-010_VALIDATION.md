# ISA-010: Validation Instructions

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define validation instructions for validation operations

---

## VALIDATE
**Opcode**: 0x8E  
**Category**: Validation  
**Description**: Validate data against schema

**Encoding**:
```
[opcode: 1 byte]
[data: 4 bytes]
[schema: 4 bytes]
```

**Operands**:
- data: Data identifier
- schema: Schema identifier

**Side Effects**: Validates data, returns validation result

**Latency**: 15 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VALIDATE data_id, schema_id
```

---

## VALIDATE_TYPE
**Opcode**: 0x8F  
**Category**: Validation  
**Description**: Validate data type

**Encoding**:
```
[opcode: 1 byte]
[data: 4 bytes]
[type: 4 bytes]
```

**Operands**:
- data: Data identifier
- type: Expected type identifier

**Side Effects**: Validates type, returns validation result

**Latency**: 5 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 32 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VALIDATE_TYPE data_id, type_id
```

---

## VALIDATE_RANGE
**Opcode**: 0x90  
**Category**: Validation  
**Description**: Validate data range

**Encoding**:
```
[opcode: 1 byte]
[data: 4 bytes]
[min: 4 bytes]
[max: 4 bytes]
```

**Operands**:
- data: Data identifier
- min: Minimum value
- max: Maximum value

**Side Effects**: Validates range, returns validation result

**Latency**: 8 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 48 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VALIDATE_RANGE data_id, min_id, max_id
```

---

## VALIDATE_FORMAT
**Opcode**: 0x91  
**Category**: Validation  
**Description**: Validate data format

**Encoding**:
```
[opcode: 1 byte]
[data: 4 bytes]
[format: 4 bytes]
```

**Operands**:
- data: Data identifier
- format: Format identifier

**Side Effects**: Validates format, returns validation result

**Latency**: 10 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 56 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VALIDATE_FORMAT data_id, format_id
```

---

## VALIDATE_CONSTRAINT
**Opcode**: 0x92  
**Category**: Validation  
**Description**: Validate constraint

**Encoding**:
```
[opcode: 1 byte]
[data: 4 bytes]
[constraint: 4 bytes]
```

**Operands**:
- data: Data identifier
- constraint: Constraint identifier

**Side Effects**: Validates constraint, returns validation result

**Latency**: 12 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 64 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VALIDATE_CONSTRAINT data_id, constraint_id
```

---

## VALIDATE_BATCH
**Opcode**: 0x93  
**Category**: Validation  
**Description**: Validate multiple data items

**Encoding**:
```
[opcode: 1 byte]
[data_items: 4 bytes]
[count: 4 bytes]
[validator: 4 bytes]
```

**Operands**:
- data_items: Data identifiers array
- count: Number of data items
- validator: Validation function (constant pool index)

**Side Effects**: Validates batch, returns validation results

**Latency**: 25 cycles

**Token Cost**: 0 tokens

**Memory Cost**: 128 bytes

**Rollback**: no

**Trace**: yes

**Debug**: yes

**Determinism**: yes

**Example**:
```
VALIDATE_BATCH data_array, 10, validator_id
```
