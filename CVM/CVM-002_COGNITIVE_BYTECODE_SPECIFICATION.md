# CVM-002: Cognitive Bytecode Specification

## OVERVIEW

Cognitive Bytecode is a stable, binary format for compiled cognitive brains. It is designed to be:
- **LLM-agnostic**: Independent of any specific LLM provider
- **Deterministic**: Same bytecode + same inputs = same outputs
- **Versioned**: Supports backward compatibility
- **Verifiable**: Includes checksums and signatures
- **Traceable**: Every instruction produces complete traces
- **Optimizable**: Contains hints for optimization
- **Distributable**: Can be executed across multiple nodes

## BINARY FORMAT STRUCTURE

### File Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Header (64 bytes)                    │
├─────────────────────────────────────────────────────────────┤
│                      Metadata Section                       │
├─────────────────────────────────────────────────────────────┤
│                    Constant Pool Section                     │
├─────────────────────────────────────────────────────────────┤
│                   Instruction Stream Section                 │
├─────────────────────────────────────────────────────────────┤
│                      Debug Info Section                      │
├─────────────────────────────────────────────────────────────┤
│                      Signature Section                       │
└─────────────────────────────────────────────────────────────┘
```

### Header Format (64 bytes)

```
Offset  Size  Field              Description
------  ----  -----              -----------
0x00    4     Magic Number       0x43564D42 ("CVMB")
0x04    2     Major Version     Bytecode major version
0x06    2     Minor Version     Bytecode minor version
0x08    2     Patch Version     Bytecode patch version
0x0A    2     Flags             Bytecode flags
0x0C    8     Header Size       Size of header in bytes
0x14    8     Metadata Offset   Offset to metadata section
0x1C    8     Metadata Size     Size of metadata section
0x24    8     Constant Pool Offset
0x2C    8     Constant Pool Size
0x34    8     Instruction Stream Offset
0x3C    8     Instruction Stream Size
```

### Magic Number

```
0x43 0x56 0x4D 0x42  // "CVMB" - Cognitive Virtual Machine Bytecode
```

### Version Format

- **Major Version**: Breaking changes (0-255)
- **Minor Version**: Additive changes (0-255)
- **Patch Version**: Bug fixes (0-255)

Current version: **1.0.0**

### Flags

```
Bit 0: Optimized (0 = unoptimized, 1 = optimized)
Bit 1: Debug Info (0 = no debug info, 1 = includes debug info)
Bit 2: Signed (0 = unsigned, 1 = signed)
Bit 3: Encrypted (0 = unencrypted, 1 = encrypted)
Bit 4-7: Reserved (must be 0)
Bit 8-15: Target Runtime ID
```

## METADATA SECTION

### Metadata Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Metadata Header (32 bytes)              │
├─────────────────────────────────────────────────────────────┤
│                      Resource Budgets                       │
├─────────────────────────────────────────────────────────────┤
│                      Execution Hints                        │
├─────────────────────────────────────────────────────────────┤
│                      Dependency Info                        │
├─────────────────────────────────────────────────────────────┤
│                      Compiler Info                          │
└─────────────────────────────────────────────────────────────┘
```

### Metadata Header

```typescript
interface MetadataHeader {
  checksum: Uint8Array;      // 32 bytes - SHA-256 of entire bytecode
  timestamp: number;         // 8 bytes - Unix timestamp
  authorId: string;         // 32 bytes - Author identifier
  sessionId: string;        // 32 bytes - Session identifier
  traceId: string;          // 32 bytes - Root trace identifier
}
```

### Resource Budgets

```typescript
interface ResourceBudgets {
  tokenBudget: TokenBudget;
  latencyBudget: LatencyBudget;
  memoryBudget: MemoryBudget;
  cpuBudget: CPUBudget;
  gpuBudget?: GPUBudget;
}

interface TokenBudget {
  maxPerInstruction: number;  // 4 bytes
  maxPerSession: number;       // 4 bytes
  maxPerLLMCall: number;       // 4 bytes
  reserved: number;            // 4 bytes
}

interface LatencyBudget {
  maxPerInstruction: number;   // 4 bytes - milliseconds
  maxPerSession: number;       // 4 bytes - milliseconds
  maxPerLLMCall: number;       // 4 bytes - milliseconds
  reserved: number;            // 4 bytes
}

interface MemoryBudget {
  maxPerInstruction: number;   // 8 bytes - bytes
  maxPerSession: number;       // 8 bytes - bytes
  maxPerGraphNode: number;     // 8 bytes - bytes
  reserved: number;            // 8 bytes
}

interface CPUBudget {
  maxPerInstruction: number;   // 4 bytes - milliseconds
  maxPerSession: number;       // 4 bytes - milliseconds
  reserved: number;            // 4 bytes
}

interface GPUBudget {
  maxPerInstruction: number;   // 4 bytes - milliseconds
  maxPerSession: number;       // 4 bytes - milliseconds
  reserved: number;            // 4 bytes
}
```

### Execution Hints

```typescript
interface ExecutionHints {
  parallelism: number;         // 1 byte - Max parallel instructions
  priority: number;            // 1 byte - Execution priority (0-255)
  cacheStrategy: number;       // 1 byte - Cache strategy ID
  optimizationLevel: number;   // 1 byte - Optimization level (0-3)
  fallbackStrategy: number;    // 1 byte - Fallback strategy ID
  retryStrategy: number;       // 1 byte - Retry strategy ID
  reserved: number;            // 2 bytes
}
```

### Dependency Info

```typescript
interface DependencyInfo {
  dependencyCount: number;    // 4 bytes
  dependencies: Dependency[]; // Variable length
}

interface Dependency {
  id: string;                  // 32 bytes
  version: string;             // 16 bytes - "X.Y.Z"
  type: DependencyType;        // 1 byte
  required: boolean;           // 1 byte
  checksum: Uint8Array;        // 32 bytes - SHA-256
}

enum DependencyType {
  BYTECODE_LIBRARY = 0,
  KNOWLEDGE_GRAPH = 1,
  MODEL = 2,
  PLUGIN = 3
}
```

### Compiler Info

```typescript
interface CompilerInfo {
  compilerId: string;          // 32 bytes - Compiler identifier
  compilerVersion: string;    // 16 bytes - "X.Y.Z"
  compilationTimestamp: number; // 8 bytes - Unix timestamp
  optimizationFlags: number;   // 4 bytes
  sourceLanguage: string;      // 8 bytes - Source DSL identifier
  sourceVersion: string;       // 8 bytes - Source DSL version
}
```

## CONSTANT POOL SECTION

### Constant Pool Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Constant Count (4 bytes)                  │
├─────────────────────────────────────────────────────────────┤
│                      Constant Entries                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Constant 1 (variable length)                       │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  Constant 2 (variable length)                       │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  ...                                                 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Constant Types

```typescript
enum ConstantType {
  NULL = 0,
  BOOLEAN = 1,
  INTEGER = 2,
  FLOAT = 3,
  STRING = 4,
  BYTES = 5,
  ARRAY = 6,
  OBJECT = 7,
  REFERENCE = 8,
  INSTRUCTION = 9,
  FUNCTION = 10,
  EMBEDDING = 11
}

interface ConstantEntry {
  type: ConstantType;          // 1 byte
  size: number;                // 4 bytes - Size in bytes
  data: Uint8Array;            // Variable length
}
```

### Constant Encoding

```typescript
// NULL
interface NullConstant {
  type: ConstantType.NULL;
  size: 0;
}

// BOOLEAN
interface BooleanConstant {
  type: ConstantType.BOOLEAN;
  size: 1;
  value: boolean;             // 0 or 1
}

// INTEGER
interface IntegerConstant {
  type: ConstantType.INTEGER;
  size: 8;
  value: bigint;              // 64-bit signed integer
}

// FLOAT
interface FloatConstant {
  type: ConstantType.FLOAT;
  size: 8;
  value: number;              // 64-bit double precision
}

// STRING
interface StringConstant {
  type: ConstantType.STRING;
  size: 4 + length;           // 4 bytes length + UTF-8 bytes
  length: number;             // 4 bytes - UTF-8 byte length
  value: string;              // UTF-8 encoded
}

// BYTES
interface BytesConstant {
  type: ConstantType.BYTES;
  size: 4 + length;           // 4 bytes length + data bytes
  length: number;             // 4 bytes
  value: Uint8Array;          // Binary data
}

// ARRAY
interface ArrayConstant {
  type: ConstantType.ARRAY;
  size: 4 + elementCount * 4; // 4 bytes count + 4 bytes per element index
  elementCount: number;        // 4 bytes
  elements: number[];         // Indices into constant pool
}

// OBJECT
interface ObjectConstant {
  type: ConstantType.OBJECT;
  size: 4 + propertyCount * 8; // 4 bytes count + 8 bytes per property
  propertyCount: number;       // 4 bytes
  properties: PropertyEntry[];
}

interface PropertyEntry {
  keyIndex: number;           // 4 bytes - Index into constant pool (string)
  valueIndex: number;         // 4 bytes - Index into constant pool
}

// REFERENCE
interface ReferenceConstant {
  type: ConstantType.REFERENCE;
  size: 4;
  targetIndex: number;        // 4 bytes - Index into constant pool
}

// INSTRUCTION
interface InstructionConstant {
  type: ConstantType.INSTRUCTION;
  size: 4;
  instructionIndex: number;   // 4 bytes - Index into instruction stream
}

// FUNCTION
interface FunctionConstant {
  type: ConstantType.FUNCTION;
  size: 12;
  entryPoint: number;         // 4 bytes - Instruction index
  parameterCount: number;     // 4 bytes
  localVariableCount: number; // 4 bytes
}

// EMBEDDING
interface EmbeddingConstant {
  type: ConstantType.EMBEDDING;
  size: 4 + dimension * 4;    // 4 bytes dimension + 4 bytes per float
  dimension: number;           // 4 bytes
  values: Float32Array;        // Vector of floats
}
```

## INSTRUCTION STREAM SECTION

### Instruction Format

Each instruction has the following structure:

```
┌─────────────────────────────────────────────────────────────┐
│  Instruction Header (16 bytes)                              │
├─────────────────────────────────────────────────────────────┤
│  Operands (variable length)                                  │
├─────────────────────────────────────────────────────────────┤
│  Metadata (variable length)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Instruction Header

```typescript
interface InstructionHeader {
  opcode: number;              // 2 bytes - Operation code
  operandCount: number;        // 2 bytes - Number of operands
  size: number;                // 4 bytes - Total instruction size in bytes
  flags: number;               // 2 bytes - Instruction flags
  version: number;             // 1 byte - Instruction format version
  reserved: number;            // 1 byte
}
```

### Instruction Flags

```
Bit 0: Checkpoint (0 = no checkpoint, 1 = create checkpoint)
Bit 1: Trace (0 = no trace, 1 = produce trace)
Bit 2: Async (0 = synchronous, 1 = asynchronous)
Bit 3: Parallel (0 = sequential, 1 = can be parallel)
Bit 4: Cacheable (0 = not cacheable, 1 = cacheable)
Bit 5: Rollback (0 = cannot rollback, 1 = can rollback)
Bit 6: Replay (0 = cannot replay, 1 = can replay)
Bit 7: Reserved (must be 0)
Bit 8-15: Custom flags
```

### Operands

Each operand has the following structure:

```typescript
interface Operand {
  type: OperandType;           // 1 byte
  size: number;                // 4 bytes - Size in bytes
  value: Uint8Array;          // Variable length
}

enum OperandType {
  IMMEDIATE = 0,
  CONSTANT_POOL_INDEX = 1,
  REGISTER = 2,
  MEMORY_ADDRESS = 3,
  STACK_OFFSET = 4,
  LABEL = 5
}
```

### Operand Encoding

```typescript
// IMMEDIATE
interface ImmediateOperand {
  type: OperandType.IMMEDIATE;
  size: 8;
  value: bigint;              // 64-bit immediate value
}

// CONSTANT_POOL_INDEX
interface ConstantPoolOperand {
  type: OperandType.CONSTANT_POOL_INDEX;
  size: 4;
  index: number;               // 4 bytes - Index into constant pool
}

// REGISTER
interface RegisterOperand {
  type: OperandType.REGISTER;
  size: 1;
  register: number;            // 1 byte - Register number (0-255)
}

// MEMORY_ADDRESS
interface MemoryAddressOperand {
  type: OperandType.MEMORY_ADDRESS;
  size: 8;
  address: bigint;             // 64-bit memory address
}

// STACK_OFFSET
interface StackOffsetOperand {
  type: OperandType.STACK_OFFSET;
  size: 4;
  offset: number;              // 4 bytes - Signed stack offset
}

// LABEL
interface LabelOperand {
  type: OperandType.LABEL;
  size: 4;
  labelIndex: number;          // 4 bytes - Label index
}
```

### Instruction Metadata

```typescript
interface InstructionMetadata {
  traceId: string;             // 32 bytes - Unique trace identifier
  rollbackId: string;          // 32 bytes - Rollback identifier
  replayId: string;            // 32 bytes - Replay identifier
  latencyBudget: number;       // 4 bytes - Milliseconds
  tokenBudget: number;         // 4 bytes - Tokens
  memoryBudget: number;        // 8 bytes - Bytes
  optimizationHints: number;   // 4 bytes - Optimization hint flags
  sourceLocation: SourceLocation; // Variable length
}

interface SourceLocation {
  file: string;                // 32 bytes - Source file identifier
  lineNumber: number;           // 4 bytes
  columnNumber: number;         // 4 bytes
  context: string;             // Variable length - Source context
}
```

### Optimization Hints

```
Bit 0: Dead Code (0 = live, 1 = can be eliminated)
Bit 1: Pure (0 = side effects, 1 = pure function)
Bit 2: Idempotent (0 = not idempotent, 1 = idempotent)
Bit 3: Memoizable (0 = not memoizable, 1 = memoizable)
Bit 4: Parallelizable (0 = sequential, 1 = parallelizable)
Bit 5: Speculative (0 = not speculative, 1 = can speculate)
Bit 6: Critical (0 = not critical, 1 = critical path)
Bit 7: Reserved
Bit 8-15: Custom hints
```

## DEBUG INFO SECTION

### Debug Info Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Debug Info Header (16 bytes)             │
├─────────────────────────────────────────────────────────────┤
│                      Source Map                              │
├─────────────────────────────────────────────────────────────┤
│                      Variable Table                         │
├─────────────────────────────────────────────────────────────┤
│                      Label Table                             │
├─────────────────────────────────────────────────────────────┤
│                      Comment Table                          │
└─────────────────────────────────────────────────────────────┘
```

### Source Map

```typescript
interface SourceMap {
  version: number;             // 4 bytes
  fileCount: number;           // 4 bytes
  mappingCount: number;        // 4 bytes
  files: SourceFile[];        // Variable length
  mappings: SourceMapping[];  // Variable length
}

interface SourceFile {
  id: number;                  // 4 bytes
  path: string;                // Variable length
  hash: Uint8Array;            // 32 bytes - SHA-256
}

interface SourceMapping {
  instructionIndex: number;    // 4 bytes
  fileIndex: number;           // 4 bytes
  lineNumber: number;          // 4 bytes
  columnNumber: number;        // 4 bytes
  nameIndex?: number;          // 4 bytes - Optional
}
```

### Variable Table

```typescript
interface VariableTable {
  variableCount: number;       // 4 bytes
  variables: VariableEntry[]; // Variable length
}

interface VariableEntry {
  name: string;                // Variable length
  type: string;                // Variable length
  scope: VariableScope;        // 1 byte
  register?: number;           // 1 byte - Optional
  stackOffset?: number;        // 4 bytes - Optional
  lifetime: Lifetime;          // 8 bytes
}

enum VariableScope {
  LOCAL = 0,
  PARAMETER = 1,
  GLOBAL = 2,
  CLOSURE = 3
}

interface Lifetime {
  startInstruction: number;    // 4 bytes
  endInstruction: number;      // 4 bytes
}
```

### Label Table

```typescript
interface LabelTable {
  labelCount: number;          // 4 bytes
  labels: LabelEntry[];        // Variable length
}

interface LabelEntry {
  name: string;                // Variable length
  instructionIndex: number;    // 4 bytes
  type: LabelType;             // 1 byte
}

enum LabelType {
  ENTRY = 0,
  EXIT = 1,
  LOOP_START = 2,
  LOOP_END = 3,
  CONDITION = 4,
  CATCH = 5,
  FINALLY = 6
}
```

## SIGNATURE SECTION

### Signature Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Signature Header (8 bytes)               │
├─────────────────────────────────────────────────────────────┤
│                      Signature Algorithm                     │
├─────────────────────────────────────────────────────────────┤
│                      Signature Value                         │
├─────────────────────────────────────────────────────────────┤
│                      Certificate Chain                       │
└─────────────────────────────────────────────────────────────┘
```

### Signature Header

```typescript
interface SignatureHeader {
  algorithm: number;           // 4 bytes - Signature algorithm ID
  signatureSize: number;       // 4 bytes - Size of signature in bytes
}
```

### Signature Algorithms

```
0x00000001: RSA-SHA256
0x00000002: RSA-SHA512
0x00000003: ECDSA-SHA256
0x00000004: ECDSA-SHA512
0x00000005: Ed25519
```

### Signature Value

```typescript
interface SignatureValue {
  algorithm: number;
  signature: Uint8Array;      // Variable length
}
```

### Certificate Chain

```typescript
interface CertificateChain {
  certificateCount: number;    // 4 bytes
  certificates: Certificate[]; // Variable length
}

interface Certificate {
  size: number;                // 4 bytes
  data: Uint8Array;            // DER-encoded certificate
}
```

## CHECKSUM AND VERIFICATION

### Checksum Calculation

```
checksum = SHA-256(entire bytecode excluding checksum field)
```

### Verification Steps

1. Verify magic number
2. Verify version compatibility
3. Verify checksum
4. Verify signature (if present)
5. Verify constant pool integrity
6. Verify instruction stream validity
7. Verify control flow consistency
8. Verify resource budget consistency

## VERSION COMPATIBILITY

### Compatibility Matrix

| Runtime Version | Bytecode 1.0 | Bytecode 1.1 | Bytecode 2.0 |
|----------------|--------------|--------------|--------------|
| 1.0            | ✓            | ✗            | ✗            |
| 1.1            | ✓            | ✓            | ✗            |
| 2.0            | ✓            | ✓            | ✓            |

### Compatibility Rules

- **Major version**: Breaking changes, requires runtime upgrade
- **Minor version**: Additive changes, backward compatible
- **Patch version**: Bug fixes, fully compatible

## ENCODING EXAMPLE

### Example Instruction

```
Instruction: CALL_LLM with prompt from constant pool index 5

Header:
  opcode: 0x0001 (CALL_LLM)
  operandCount: 1
  size: 64
  flags: 0x0006 (trace + async)
  version: 1
  reserved: 0

Operands:
  [0] {
    type: CONSTANT_POOL_INDEX
    size: 4
    index: 5
  }

Metadata:
  traceId: "550e8400-e29b-41d4-a716-446655440000"
  rollbackId: "660e8400-e29b-41d4-a716-446655440001"
  replayId: "770e8400-e29b-41d4-a716-446655440002"
  latencyBudget: 5000
  tokenBudget: 1000
  memoryBudget: 1048576
  optimizationHints: 0x0004 (memoizable)
  sourceLocation: {
    file: "example.blueprint",
    lineNumber: 42,
    columnNumber: 8,
    context: "CALL_LLM(prompt)"
  }
```

## IMPLEMENTATION STATUS

- [x] Binary format structure defined
- [x] Header format specified
- [x] Metadata section defined
- [x] Constant pool encoding specified
- [x] Instruction format defined
- [x] Debug info structure specified
- [x] Signature section defined
- [x] Checksum and verification defined
- [x] Version compatibility matrix

## NEXT STEPS

- Implement CVM-003: Cognitive Instruction Set
- Implement CVM-012: Package Format
- Implement CVM-013: Loader
- Implement CVM-014: Validator
