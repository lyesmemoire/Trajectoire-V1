# CIR-010: Serializer

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Serializer structure in Cognitive Intermediate Representation

---

## Purpose

The Serializer converts CIR between different representations: text format, binary format, and in-memory representation. Serialization enables storage, transmission, and tooling integration.

---

## Serializer Structure

```typescript
interface CIRSerializer {
  format: SerializationFormat;
  config: SerializerConfig;
  
  serialize(cir: CIRModule): Buffer;
  
  deserialize(buffer: Buffer): CIRModule;
  
  validate(cir: CIRModule): ValidationResult;
}
```

---

## Serialization Formats

### Text Format
Human-readable representation for debugging and tooling.

```cir
module example {
    function add(a: i32, b: i32) -> i32 {
        entry:
            %1: i32 = add a, b;
            ret %1;
    }
}
```

### Binary Format
Compact binary representation for efficient storage and transmission.

```binary
[magic: 4 bytes]  // "CIR\0"
[version: 4 bytes]
[module_length: 8 bytes]
[module_data: module_length bytes]
[checksum: 4 bytes]
```

### JSON Format
JSON representation for web integration and tooling.

```json
{
  "module": {
    "name": "example",
    "functions": [
      {
        "name": "add",
        "parameters": [
          {"name": "a", "type": "i32"},
          {"name": "b", "type": "i32"}
        ],
        "return_type": "i32",
        "blocks": [...]
      }
    ]
  }
}
```

---

## Text Serialization

### Module Serialization
```cir
module <name> {
    <imports>
    <types>
    <functions>
    <metadata>
}
```

### Function Serialization
```cir
function <name>(<params>) -> <return_type> {
    <blocks>
}
```

### Block Serialization
```cir
<name>:
    <instructions>
    <terminator>
```

### Instruction Serialization
```cir
%<result>: <type> = <opcode> <operands>;
```

---

## Binary Serialization

### Module Header
```binary
[magic: 4 bytes]        // "CIR\0"
[version: 4 bytes]     // Version number
[flags: 4 bytes]       // Serialization flags
[module_name_length: 4 bytes]
[module_name: module_name_length bytes]
```

### Function Table
```binary
[function_count: 4 bytes]
[functions: function_count * variable]
```

### Function Entry
```binary
[function_id: 8 bytes]
[function_name_length: 4 bytes]
[function_name: function_name_length bytes]
[parameter_count: 4 bytes]
[parameters: parameter_count * variable]
[return_type: 4 bytes]
[block_count: 4 bytes]
[blocks: block_count * variable]
```

### Block Entry
```binary
[block_id: 8 bytes]
[block_name_length: 4 bytes]
[block_name: block_name_length bytes]
[instruction_count: 4 bytes]
[instructions: instruction_count * variable]
```

### Instruction Entry
```binary
[opcode: 4 bytes]
[operand_count: 4 bytes]
[operands: operand_count * variable]
[result_id: 8 bytes]
[metadata_length: 4 bytes]
[metadata: metadata_length bytes]
```

---

## Serializer Configuration

```typescript
interface SerializerConfig {
  includeDebugInfo: boolean;
  includeMetadata: boolean;
  includeComments: boolean;
  compress: boolean;
  checksum: boolean;
}
```

---

## Serialization API

```typescript
class CIRSerializer {
  constructor(format: SerializationFormat, config: SerializerConfig);
  
  serialize(cir: CIRModule): Buffer;
  
  deserialize(buffer: Buffer): CIRModule;
  
  serializeToFile(cir: CIRModule, path: string): void;
  
  deserializeFromFile(path: string): CIRModule;
  
  validate(cir: CIRModule): ValidationResult;
}
```

---

## Validation

After deserialization, CIR must be validated:

1. **Magic Number**: Verify file format
2. **Version Compatibility**: Verify version compatibility
3. **Checksum**: Verify data integrity
4. **Structure Validity**: Verify structure correctness
5. **Type Safety**: Verify type safety
6. **SSA Validity**: Verify SSA form

---

## Compression

Binary format supports compression:

```typescript
interface CompressionConfig {
  algorithm: 'none' | 'gzip' | 'zlib' | 'lz4';
  level: number;  // 0-9
}
```

---

## Checksum

Binary format includes checksum for integrity verification:

```typescript
function calculateChecksum(buffer: Buffer): number {
  return crc32(buffer);
}
```

---

## Serialization Statistics

```typescript
interface SerializationStatistics {
  originalSize: number;
  serializedSize: number;
  compressionRatio: number;
  serializationTime: number;
  deserializationTime: number;
}
```

---

## Serialization Format Comparison

| Format | Size | Speed | Human Readable | Tooling Support |
|--------|------|-------|----------------|-----------------|
| Text | Large | Slow | Yes | Excellent |
| Binary | Small | Fast | No | Good |
| JSON | Medium | Medium | Yes | Excellent |

---

## Serialization Best Practices

1. **Use Text Format** for debugging and development
2. **Use Binary Format** for production and distribution
3. **Use JSON Format** for web integration
4. **Always Validate** after deserialization
5. **Use Compression** for large modules
6. **Include Checksum** for integrity verification

---

## Serialization Example

### Text to Binary
```typescript
const textCIR = `
module example {
    function add(a: i32, b: i32) -> i32 {
        entry:
            %1: i32 = add a, b;
            ret %1;
    }
}
`;

const serializer = new CIRSerializer('binary', {
  includeDebugInfo: true,
  includeMetadata: true,
  compress: true,
  checksum: true
});

const binary = serializer.serialize(textCIR);
```

### Binary to Text
```typescript
const serializer = new CIRSerializer('text', {
  includeDebugInfo: true,
  includeMetadata: true
});

const textCIR = serializer.deserialize(binaryBuffer);
```

---

## Error Handling

```typescript
interface SerializationError {
  code: string;
  message: string;
  position: number;
  context: any;
}
```

Common errors:
- `INVALID_MAGIC`: Invalid file format
- `VERSION_MISMATCH`: Version incompatibility
- `CHECKSUM_FAILED`: Data corruption
- `INVALID_STRUCTURE`: Structure error
- `TYPE_ERROR`: Type mismatch
