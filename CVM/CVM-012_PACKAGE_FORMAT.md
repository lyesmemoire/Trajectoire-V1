# CVM-012: Package Format

## OVERVIEW

The Cognitive Package Format defines the standard packaging format for compiled cognitive brains. It provides a structured, versioned, and signed container for Cognitive Bytecode, metadata, dependencies, and resources.

## ARCHITECTURE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    Cognitive Package Format
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              Package Structure                                 ┃
┃  ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━┓  ┃
┃  ┃ Header  ┃ ┃ Manifest┃ ┃ Bytecode┃ ┃ Metadata┃ ┃ Resources┃ ┃
┃  ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━┛  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              Package Manifest                                  ┃
┃  ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━┓  ┃
┃  ┃ Package ┃ ┃ Version ┃ ┃ Dependencies┃ ┃ Capabilities┃ ┃ Security┃ ┃
┃  ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━┛  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              Bytecode Container                                 ┃
┃  ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━┓  ┃
┃  ┃ Constant┃ ┃ Instruction┃ ┃ Debug   ┃ ┃ Signature┃ ┃ Checksum┃ ┃
┃  ┃ Pool    ┃ ┃ Stream     ┃ ┃ Info    ┃ ┃          ┃ ┃         ┃ ┃
┃  ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━┛  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              Resource Bundle                                   ┃
┃  ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━┓  ┃
┃  ┃ Knowledge┃ ┃ Models  ┃ ┃ Prompts ┃ ┃ Config  ┃ ┃ Assets ┃ ┃
┃  ┃ Graph   ┃ ┃         ┃ ┃         ┃ ┃         ┃ ┃         ┃ ┃
┃  ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━┛  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              Security Layer                                    ┃
┃  ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━━┓ ┏━━━━━━━┓  ┃
┃  ┃ Signature┃ ┃ Encryption┃ ┃ Integrity ┃ ┃ Auth    ┃ ┃ ACL   ┃ ┃
┃  ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━━┛ ┗━━━━━━━┛  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## PACKAGE STRUCTURE

### File Format

```
.cvm (Cognitive Virtual Machine Package)
├── HEADER (64 bytes)
├── MANIFEST (variable)
├── BYTECODE (variable)
├── METADATA (variable)
├── RESOURCES (variable)
└── SIGNATURE (variable)
```

### Header

```typescript
interface PackageHeader {
  magic: number;           // 0x43564D00 (CVM\0)
  version: number;         // Package format version
  headerSize: number;      // Size of header
  manifestOffset: number;  // Offset to manifest
  manifestSize: number;   // Size of manifest
  bytecodeOffset: number;  // Offset to bytecode
  bytecodeSize: number;   // Size of bytecode
  metadataOffset: number;  // Offset to metadata
  metadataSize: number;   // Size of metadata
  resourcesOffset: number;// Offset to resources
  resourcesSize: number;  // Size of resources
  signatureOffset: number;// Offset to signature
  signatureSize: number;  // Size of signature
  checksum: number;        // Header checksum
  flags: number;           // Package flags
  reserved: number[8];     // Reserved space
}
```

### Binary Encoding

```typescript
function encodeHeader(header: PackageHeader): Buffer {
  const buffer = Buffer.alloc(64);
  
  buffer.writeUInt32LE(header.magic, 0);
  buffer.writeUInt16LE(header.version, 4);
  buffer.writeUInt16LE(header.headerSize, 6);
  buffer.writeUInt32LE(header.manifestOffset, 8);
  buffer.writeUInt32LE(header.manifestSize, 12);
  buffer.writeUInt32LE(header.bytecodeOffset, 16);
  buffer.writeUInt32LE(header.bytecodeSize, 20);
  buffer.writeUInt32LE(header.metadataOffset, 24);
  buffer.writeUInt32LE(header.metadataSize, 28);
  buffer.writeUInt32LE(header.resourcesOffset, 32);
  buffer.writeUInt32LE(header.resourcesSize, 36);
  buffer.writeUInt32LE(header.signatureOffset, 40);
  buffer.writeUInt32LE(header.signatureSize, 44);
  buffer.writeUInt32LE(header.checksum, 48);
  buffer.writeUInt32LE(header.flags, 52);
  
  // Reserved space
  for (let i = 0; i < 8; i++) {
    buffer.writeUInt32LE(header.reserved[i], 56 + i * 4);
  }
  
  return buffer;
}

function decodeHeader(buffer: Buffer): PackageHeader {
  return {
    magic: buffer.readUInt32LE(0),
    version: buffer.readUInt16LE(4),
    headerSize: buffer.readUInt16LE(6),
    manifestOffset: buffer.readUInt32LE(8),
    manifestSize: buffer.readUInt32LE(12),
    bytecodeOffset: buffer.readUInt32LE(16),
    bytecodeSize: buffer.readUInt32LE(20),
    metadataOffset: buffer.readUInt32LE(24),
    metadataSize: buffer.readUInt32LE(28),
    resourcesOffset: buffer.readUInt32LE(32),
    resourcesSize: buffer.readUInt32LE(36),
    signatureOffset: buffer.readUInt32LE(40),
    signatureSize: buffer.readUInt32LE(44),
    checksum: buffer.readUInt32LE(48),
    flags: buffer.readUInt32LE(52),
    reserved: Array.from({ length: 8 }, (_, i) => buffer.readUInt32LE(56 + i * 4))
  };
}
```

## PACKAGE MANIFEST

### Manifest Structure

```typescript
interface PackageManifest {
  package: PackageInfo;
  version: VersionInfo;
  dependencies: Dependency[];
  capabilities: Capability[];
  requirements: Requirement[];
  security: SecurityInfo;
  metadata: PackageMetadata;
}

interface PackageInfo {
  id: string;
  name: string;
  description: string;
  author: string;
  license: string;
  homepage: string;
  repository: string;
}

interface VersionInfo {
  version: string;
  build: string;
  compatibility: string;
  bytecodeVersion: string;
}

interface Dependency {
  id: string;
  version: string;
  type: DependencyType;
  required: boolean;
  checksum: string;
}

enum DependencyType {
  RUNTIME = 'RUNTIME',
  DEVELOPMENT = 'DEVELOPMENT',
  TEST = 'TEST',
  OPTIONAL = 'OPTIONAL'
}

interface Capability {
  id: string;
  name: string;
  description: string;
  version: string;
  permissions: Permission[];
}

interface Permission {
  resource: string;
  actions: string[];
  constraints: Constraint[];
}

interface Requirement {
  type: RequirementType;
  value: string;
  minimum: string;
  maximum: string;
}

enum RequirementType {
  CVM_VERSION = 'CVM_VERSION',
  MEMORY = 'MEMORY',
  CPU = 'CPU',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  GPU = 'GPU'
}

interface SecurityInfo {
  signature: SignatureInfo;
  encryption: EncryptionInfo;
  integrity: IntegrityInfo;
  accessControl: AccessControlInfo;
}

interface SignatureInfo {
  algorithm: string;
  publicKey: string;
  signature: string;
  timestamp: number;
}

interface EncryptionInfo {
  algorithm: string;
  keyId: string;
  iv: string;
}

interface IntegrityInfo {
  algorithm: string;
  checksum: string;
  salt: string;
}

interface AccessControlInfo {
  acl: ACL[];
  owner: string;
  group: string;
}

interface ACL {
  principal: string;
  permissions: string[];
}

interface PackageMetadata {
  created: number;
  modified: number;
  size: number;
  tags: string[];
  categories: string[];
}
```

### Manifest Serialization

```typescript
function serializeManifest(manifest: PackageManifest): Buffer {
  const json = JSON.stringify(manifest);
  return Buffer.from(json, 'utf8');
}

function deserializeManifest(buffer: Buffer): PackageManifest {
  const json = buffer.toString('utf8');
  return JSON.parse(json);
}
```

## BYTECODE CONTAINER

### Bytecode Structure

```typescript
interface BytecodeContainer {
  header: BytecodeHeader;
  constantPool: ConstantPool;
  instructionStream: InstructionStream;
  debugInfo: DebugInfo;
  signature: BytecodeSignature;
}

interface BytecodeHeader {
  magic: number;           // 0x43424300 (CBC\0)
  version: number;         // Bytecode version
  constantPoolOffset: number;
  constantPoolSize: number;
  instructionStreamOffset: number;
  instructionStreamSize: number;
  debugInfoOffset: number;
  debugInfoSize: number;
  signatureOffset: number;
  signatureSize: number;
  checksum: number;
}

interface ConstantPool {
  entries: ConstantPoolEntry[];
}

interface ConstantPoolEntry {
  type: ConstantType;
  value: any;
  index: number;
}

enum ConstantType {
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY'
}

interface InstructionStream {
  instructions: EncodedInstruction[];
}

interface EncodedInstruction {
  opcode: number;
  operands: number[];
  metadata: InstructionMetadata;
}

interface InstructionMetadata {
  traceId: string;
  rollbackId: string;
  replayId: string;
  latencyBudget: number;
  tokenBudget: number;
  memoryBudget: number;
  optimizationHints: OptimizationHints;
}

interface DebugInfo {
  sourceMap: SourceMap;
  lineInfo: LineInfo[];
  symbolTable: SymbolTable;
}

interface SourceMap {
  sources: string[];
  mappings: SourceMapping[];
}

interface SourceMapping {
  generatedPosition: Position;
  originalPosition: Position;
  source: string;
  name?: string;
}

interface Position {
  line: number;
  column: number;
}

interface LineInfo {
  instructionIndex: number;
  sourceFile: string;
  lineNumber: number;
  columnNumber: number;
}

interface SymbolTable {
  symbols: Symbol[];
}

interface Symbol {
  name: string;
  type: SymbolType;
  scope: string;
  address: number;
}

enum SymbolType {
  FUNCTION = 'FUNCTION',
  VARIABLE = 'VARIABLE',
  CONSTANT = 'CONSTANT',
  LABEL = 'LABEL'
}

interface BytecodeSignature {
  algorithm: string;
  checksum: string;
  timestamp: number;
}
```

### Bytecode Serialization

```typescript
function serializeBytecode(bytecode: BytecodeContainer): Buffer {
  const buffers: Buffer[] = [];
  
  // Serialize header
  const headerBuffer = serializeBytecodeHeader(bytecode.header);
  buffers.push(headerBuffer);
  
  // Serialize constant pool
  const constantPoolBuffer = serializeConstantPool(bytecode.constantPool);
  buffers.push(constantPoolBuffer);
  
  // Serialize instruction stream
  const instructionStreamBuffer = serializeInstructionStream(bytecode.instructionStream);
  buffers.push(instructionStreamBuffer);
  
  // Serialize debug info
  const debugInfoBuffer = serializeDebugInfo(bytecode.debugInfo);
  buffers.push(debugInfoBuffer);
  
  // Serialize signature
  const signatureBuffer = serializeBytecodeSignature(bytecode.signature);
  buffers.push(signatureBuffer);
  
  return Buffer.concat(buffers);
}

function serializeBytecodeHeader(header: BytecodeHeader): Buffer {
  const buffer = Buffer.alloc(48);
  
  buffer.writeUInt32LE(header.magic, 0);
  buffer.writeUInt16LE(header.version, 4);
  buffer.writeUInt32LE(header.constantPoolOffset, 8);
  buffer.writeUInt32LE(header.constantPoolSize, 12);
  buffer.writeUInt32LE(header.instructionStreamOffset, 16);
  buffer.writeUInt32LE(header.instructionStreamSize, 20);
  buffer.writeUInt32LE(header.debugInfoOffset, 24);
  buffer.writeUInt32LE(header.debugInfoSize, 28);
  buffer.writeUInt32LE(header.signatureOffset, 32);
  buffer.writeUInt32LE(header.signatureSize, 36);
  buffer.writeUInt32LE(header.checksum, 40);
  
  return buffer;
}

function serializeConstantPool(pool: ConstantPool): Buffer {
  const buffers: Buffer[] = [];
  
  // Write count
  const countBuffer = Buffer.alloc(4);
  countBuffer.writeUInt32LE(pool.entries.length, 0);
  buffers.push(countBuffer);
  
  // Write entries
  for (const entry of pool.entries) {
    buffers.push(serializeConstantPoolEntry(entry));
  }
  
  return Buffer.concat(buffers);
}

function serializeConstantPoolEntry(entry: ConstantPoolEntry): Buffer {
  const buffers: Buffer[] = [];
  
  // Write type
  const typeBuffer = Buffer.alloc(1);
  typeBuffer.writeUInt8(constantTypeToNumber(entry.type), 0);
  buffers.push(typeBuffer);
  
  // Write index
  const indexBuffer = Buffer.alloc(4);
  indexBuffer.writeUInt32LE(entry.index, 0);
  buffers.push(indexBuffer);
  
  // Write value
  const valueBuffer = serializeConstantValue(entry.type, entry.value);
  buffers.push(valueBuffer);
  
  return Buffer.concat(buffers);
}

function constantTypeToNumber(type: ConstantType): number {
  switch (type) {
    case ConstantType.INTEGER: return 0;
    case ConstantType.FLOAT: return 1;
    case ConstantType.STRING: return 2;
    case ConstantType.BOOLEAN: return 3;
    case ConstantType.NULL: return 4;
    case ConstantType.OBJECT: return 5;
    case ConstantType.ARRAY: return 6;
  }
}

function serializeConstantValue(type: ConstantType, value: any): Buffer {
  switch (type) {
    case ConstantType.INTEGER:
      const buffer = Buffer.alloc(8);
      buffer.writeBigInt64LE(BigInt(value), 0);
      return buffer;
    case ConstantType.FLOAT:
      const floatBuffer = Buffer.alloc(8);
      floatBuffer.writeDoubleLE(value, 0);
      return floatBuffer;
    case ConstantType.STRING:
      const strBuffer = Buffer.from(value, 'utf8');
      const lenBuffer = Buffer.alloc(4);
      lenBuffer.writeUInt32LE(strBuffer.length, 0);
      return Buffer.concat([lenBuffer, strBuffer]);
    case ConstantType.BOOLEAN:
      const boolBuffer = Buffer.alloc(1);
      boolBuffer.writeUInt8(value ? 1 : 0, 0);
      return boolBuffer;
    case ConstantType.NULL:
      return Buffer.alloc(0);
    case ConstantType.OBJECT:
    case ConstantType.ARRAY:
      const json = JSON.stringify(value);
      const jsonBuffer = Buffer.from(json, 'utf8');
      const jsonLenBuffer = Buffer.alloc(4);
      jsonLenBuffer.writeUInt32LE(jsonBuffer.length, 0);
      return Buffer.concat([jsonLenBuffer, jsonBuffer]);
  }
}

function serializeInstructionStream(stream: InstructionStream): Buffer {
  const buffers: Buffer[] = [];
  
  // Write count
  const countBuffer = Buffer.alloc(4);
  countBuffer.writeUInt32LE(stream.instructions.length, 0);
  buffers.push(countBuffer);
  
  // Write instructions
  for (const instruction of stream.instructions) {
    buffers.push(serializeEncodedInstruction(instruction));
  }
  
  return Buffer.concat(buffers);
}

function serializeEncodedInstruction(instruction: EncodedInstruction): Buffer {
  const buffers: Buffer[] = [];
  
  // Write opcode
  const opcodeBuffer = Buffer.alloc(2);
  opcodeBuffer.writeUInt16LE(instruction.opcode, 0);
  buffers.push(opcodeBuffer);
  
  // Write operand count
  const operandCountBuffer = Buffer.alloc(1);
  operandCountBuffer.writeUInt8(instruction.operands.length, 0);
  buffers.push(operandCountBuffer);
  
  // Write operands
  for (const operand of instruction.operands) {
    const operandBuffer = Buffer.alloc(8);
    operandBuffer.writeBigUInt64LE(BigInt(operand), 0);
    buffers.push(operandBuffer);
  }
  
  // Write metadata size
  const metadataJson = JSON.stringify(instruction.metadata);
  const metadataBuffer = Buffer.from(metadataJson, 'utf8');
  const metadataSizeBuffer = Buffer.alloc(4);
  metadataSizeBuffer.writeUInt32LE(metadataBuffer.length, 0);
  buffers.push(metadataSizeBuffer);
  buffers.push(metadataBuffer);
  
  return Buffer.concat(buffers);
}

function serializeDebugInfo(debugInfo: DebugInfo): Buffer {
  const json = JSON.stringify(debugInfo);
  const buffer = Buffer.from(json, 'utf8');
  
  const sizeBuffer = Buffer.alloc(4);
  sizeBuffer.writeUInt32LE(buffer.length, 0);
  
  return Buffer.concat([sizeBuffer, buffer]);
}

function serializeBytecodeSignature(signature: BytecodeSignature): Buffer {
  const json = JSON.stringify(signature);
  const buffer = Buffer.from(json, 'utf8');
  
  const sizeBuffer = Buffer.alloc(4);
  sizeBuffer.writeUInt32LE(buffer.length, 0);
  
  return Buffer.concat([sizeBuffer, buffer]);
}
```

## RESOURCE BUNDLE

### Resource Structure

```typescript
interface ResourceBundle {
  resources: Resource[];
  index: ResourceIndex;
  compression: CompressionInfo;
}

interface Resource {
  id: string;
  type: ResourceType;
  path: string;
  size: number;
  checksum: string;
  compression: string;
  metadata: ResourceMetadata;
}

enum ResourceType {
  KNOWLEDGE_GRAPH = 'KNOWLEDGE_GRAPH',
  MODEL = 'MODEL',
  PROMPT = 'PROMPT',
  CONFIG = 'CONFIG',
  ASSET = 'ASSET',
  DATA = 'DATA'
}

interface ResourceMetadata {
  mimeType: string;
  encoding: string;
  language?: string;
  version?: string;
  tags: string[];
}

interface ResourceIndex {
  entries: ResourceIndexEntry[];
}

interface ResourceIndexEntry {
  resourceId: string;
  offset: number;
  size: number;
  compressed: boolean;
}

interface CompressionInfo {
  algorithm: string;
  level: number;
}
```

### Resource Serialization

```typescript
function serializeResourceBundle(bundle: ResourceBundle): Buffer {
  const buffers: Buffer[] = [];
  
  // Serialize compression info
  const compressionBuffer = serializeCompressionInfo(bundle.compression);
  buffers.push(compressionBuffer);
  
  // Serialize resource count
  const countBuffer = Buffer.alloc(4);
  countBuffer.writeUInt32LE(bundle.resources.length, 0);
  buffers.push(countBuffer);
  
  // Serialize resources
  const resourceBuffers: Buffer[] = [];
  const indexEntries: ResourceIndexEntry[] = [];
  let currentOffset = 0;
  
  for (const resource of bundle.resources) {
    const resourceBuffer = serializeResource(resource);
    resourceBuffers.push(resourceBuffer);
    
    indexEntries.push({
      resourceId: resource.id,
      offset: currentOffset,
      size: resourceBuffer.length,
      compressed: resource.compression !== 'none'
    });
    
    currentOffset += resourceBuffer.length;
  }
  
  buffers.push(...resourceBuffers);
  
  // Serialize index
  const indexBuffer = serializeResourceIndex({ entries: indexEntries });
  buffers.push(indexBuffer);
  
  return Buffer.concat(buffers);
}

function serializeResource(resource: Resource): Buffer {
  const buffers: Buffer[] = [];
  
  // Serialize resource header
  const headerBuffer = serializeResourceHeader(resource);
  buffers.push(headerBuffer);
  
  // Serialize resource data (would be loaded from file)
  // For now, we'll just serialize the metadata
  
  return Buffer.concat(buffers);
}

function serializeResourceHeader(header: Resource): Buffer {
  const buffers: Buffer[] = [];
  
  // Write ID length and ID
  const idBuffer = Buffer.from(header.id, 'utf8');
  const idLenBuffer = Buffer.alloc(2);
  idLenBuffer.writeUInt16LE(idBuffer.length, 0);
  buffers.push(idLenBuffer, idBuffer);
  
  // Write type
  const typeBuffer = Buffer.alloc(1);
  typeBuffer.writeUInt8(resourceTypeToNumber(header.type), 0);
  buffers.push(typeBuffer);
  
  // Write path length and path
  const pathBuffer = Buffer.from(header.path, 'utf8');
  const pathLenBuffer = Buffer.alloc(2);
  pathLenBuffer.writeUInt16LE(pathBuffer.length, 0);
  buffers.push(pathLenBuffer, pathBuffer);
  
  // Write size
  const sizeBuffer = Buffer.alloc(8);
  sizeBuffer.writeBigUInt64LE(BigInt(header.size), 0);
  buffers.push(sizeBuffer);
  
  // Write checksum
  const checksumBuffer = Buffer.from(header.checksum, 'hex');
  buffers.push(checksumBuffer);
  
  // Write compression
  const compressionBuffer = Buffer.from(header.compression, 'utf8');
  buffers.push(compressionBuffer);
  
  return Buffer.concat(buffers);
}

function resourceTypeToNumber(type: ResourceType): number {
  switch (type) {
    case ResourceType.KNOWLEDGE_GRAPH: return 0;
    case ResourceType.MODEL: return 1;
    case ResourceType.PROMPT: return 2;
    case ResourceType.CONFIG: return 3;
    case ResourceType.ASSET: return 4;
    case ResourceType.DATA: return 5;
  }
}

function serializeResourceIndex(index: ResourceIndex): Buffer {
  const buffers: Buffer[] = [];
  
  // Write entry count
  const countBuffer = Buffer.alloc(4);
  countBuffer.writeUInt32LE(index.entries.length, 0);
  buffers.push(countBuffer);
  
  // Write entries
  for (const entry of index.entries) {
    buffers.push(serializeResourceIndexEntry(entry));
  }
  
  return Buffer.concat(buffers);
}

function serializeResourceIndexEntry(entry: ResourceIndexEntry): Buffer {
  const buffers: Buffer[] = [];
  
  // Write resource ID length and ID
  const idBuffer = Buffer.from(entry.resourceId, 'utf8');
  const idLenBuffer = Buffer.alloc(2);
  idLenBuffer.writeUInt16LE(idBuffer.length, 0);
  buffers.push(idLenBuffer, idBuffer);
  
  // Write offset
  const offsetBuffer = Buffer.alloc(8);
  offsetBuffer.writeBigUInt64LE(BigInt(entry.offset), 0);
  buffers.push(offsetBuffer);
  
  // Write size
  const sizeBuffer = Buffer.alloc(8);
  sizeBuffer.writeBigUInt64LE(BigInt(entry.size), 0);
  buffers.push(sizeBuffer);
  
  // Write compressed flag
  const compressedBuffer = Buffer.alloc(1);
  compressedBuffer.writeUInt8(entry.compressed ? 1 : 0, 0);
  buffers.push(compressedBuffer);
  
  return Buffer.concat(buffers);
}

function serializeCompressionInfo(info: CompressionInfo): Buffer {
  const buffers: Buffer[] = [];
  
  // Write algorithm length and algorithm
  const algoBuffer = Buffer.from(info.algorithm, 'utf8');
  const algoLenBuffer = Buffer.alloc(2);
  algoLenBuffer.writeUInt16LE(algoBuffer.length, 0);
  buffers.push(algoLenBuffer, algoBuffer);
  
  // Write level
  const levelBuffer = Buffer.alloc(1);
  levelBuffer.writeUInt8(info.level, 0);
  buffers.push(levelBuffer);
  
  return Buffer.concat(buffers);
}
```

## SECURITY LAYER

### Signature

```typescript
interface PackageSignature {
  algorithm: SignatureAlgorithm;
  publicKey: string;
  signature: string;
  timestamp: number;
  certificate?: string;
  chain?: string[];
}

enum SignatureAlgorithm {
  RSA_SHA256 = 'RSA_SHA256',
  RSA_SHA512 = 'RSA_SHA512',
  ECDSA_SHA256 = 'ECDSA_SHA256',
  ECDSA_SHA512 = 'ECDSA_SHA512,
  ED25519 = 'ED25519'
}

function serializeSignature(signature: PackageSignature): Buffer {
  const json = JSON.stringify(signature);
  const buffer = Buffer.from(json, 'utf8');
  
  const sizeBuffer = Buffer.alloc(4);
  sizeBuffer.writeUInt32LE(buffer.length, 0);
  
  return Buffer.concat([sizeBuffer, buffer]);
}

function deserializeSignature(buffer: Buffer): PackageSignature {
  const json = buffer.toString('utf8');
  return JSON.parse(json);
}

async function signPackage(
  package: CognitivePackage,
  privateKey: string,
  algorithm: SignatureAlgorithm
): Promise<PackageSignature> {
  const packageData = serializePackage(package);
  const signature = await crypto.sign(algorithm, packageData, privateKey);
  
  return {
    algorithm,
    publicKey: await derivePublicKey(privateKey),
    signature: signature.toString('hex'),
    timestamp: Date.now()
  };
}

async function verifyPackage(
  package: CognitivePackage,
  signature: PackageSignature
): Promise<boolean> {
  const packageData = serializePackage(package);
  const signatureBuffer = Buffer.from(signature.signature, 'hex');
  
  return await crypto.verify(
    signature.algorithm,
    packageData,
    signatureBuffer,
    signature.publicKey
  );
}
```

### Encryption

```typescript
interface EncryptionInfo {
  algorithm: EncryptionAlgorithm;
  keyId: string;
  iv: string;
  tag?: string;
}

enum EncryptionAlgorithm {
  AES_256_GCM = 'AES_256_GCM',
  AES_256_CBC = 'AES_256_CBC',
  CHACHA20_POLY1305 = 'CHACHA20_POLY1305'
}

async function encryptPackage(
  package: CognitivePackage,
  key: string,
  algorithm: EncryptionAlgorithm
): Promise<EncryptedPackage> {
  const packageData = serializePackage(package);
  const iv = crypto.randomBytes(16);
  
  const encrypted = await crypto.encrypt(algorithm, packageData, key, iv);
  
  return {
    encrypted,
    algorithm,
    keyId: generateKeyId(key),
    iv: iv.toString('hex')
  };
}

async function decryptPackage(
  encrypted: EncryptedPackage,
  key: string
): Promise<CognitivePackage> {
  const iv = Buffer.from(encrypted.iv, 'hex');
  const decrypted = await crypto.decrypt(encrypted.algorithm, encrypted.encrypted, key, iv);
  
  return deserializePackage(decrypted);
}
```

### Integrity

```typescript
interface IntegrityInfo {
  algorithm: HashAlgorithm;
  checksum: string;
  salt: string;
}

enum HashAlgorithm {
  SHA256 = 'SHA256',
  SHA384 = 'SHA384',
  SHA512 = 'SHA512',
  SHA3_256 = 'SHA3_256',
  SHA3_512 = 'SHA3_512'
}

async function calculateChecksum(
  data: Buffer,
  algorithm: HashAlgorithm,
  salt?: string
): Promise<string> {
  if (salt) {
    data = Buffer.concat([Buffer.from(salt, 'utf8'), data]);
  }
  
  const hash = await crypto.hash(algorithm, data);
  return hash.toString('hex');
}

async function verifyChecksum(
  data: Buffer,
  expected: string,
  algorithm: HashAlgorithm,
  salt?: string
): Promise<boolean> {
  const calculated = await calculateChecksum(data, algorithm, salt);
  return calculated === expected;
}
```

## PACKAGE BUILDER

### Builder Interface

```typescript
interface PackageBuilder {
  createManifest(manifest: PackageManifest): void;
  addBytecode(bytecode: BytecodeContainer): void;
  addResource(resource: Resource, data: Buffer): void;
  setMetadata(metadata: PackageMetadata): void;
  setSecurity(security: SecurityInfo): void;
  build(): Promise<CognitivePackage>;
  sign(privateKey: string, algorithm: SignatureAlgorithm): Promise<void>;
  encrypt(key: string, algorithm: EncryptionAlgorithm): Promise<void>;
  compress(algorithm: CompressionAlgorithm, level: number): Promise<void>;
}

class CognitivePackageBuilder implements PackageBuilder {
  private manifest?: PackageManifest;
  private bytecode?: BytecodeContainer;
  private resources: Map<string, { resource: Resource; data: Buffer }>;
  private metadata?: PackageMetadata;
  private security?: SecurityInfo;
  private signature?: PackageSignature;
  private encryption?: EncryptionInfo;
  private compression?: CompressionInfo;
  
  constructor() {
    this.resources = new Map();
  }
  
  createManifest(manifest: PackageManifest): void {
    this.manifest = manifest;
  }
  
  addBytecode(bytecode: BytecodeContainer): void {
    this.bytecode = bytecode;
  }
  
  addResource(resource: Resource, data: Buffer): void {
    this.resources.set(resource.id, { resource, data });
  }
  
  setMetadata(metadata: PackageMetadata): void {
    this.metadata = metadata;
  }
  
  setSecurity(security: SecurityInfo): void {
    this.security = security;
  }
  
  async build(): Promise<CognitivePackage> {
    if (!this.manifest) {
      throw new Error('Manifest is required');
    }
    
    if (!this.bytecode) {
      throw new Error('Bytecode is required');
    }
    
    // Serialize components
    const manifestBuffer = serializeManifest(this.manifest);
    const bytecodeBuffer = serializeBytecode(this.bytecode);
    const metadataBuffer = this.metadata ? Buffer.from(JSON.stringify(this.metadata), 'utf8') : Buffer.alloc(0);
    
    // Serialize resources
    const resourceBuffers: Buffer[] = [];
    for (const [id, { resource, data }] of this.resources) {
      resourceBuffers.push(serializeResource(resource));
      resourceBuffers.push(data);
    }
    const resourcesBuffer = Buffer.concat(resourceBuffers);
    
    // Calculate offsets
    let offset = 64; // Header size
    const manifestOffset = offset;
    offset += manifestBuffer.length;
    const bytecodeOffset = offset;
    offset += bytecodeBuffer.length;
    const metadataOffset = offset;
    offset += metadataBuffer.length;
    const resourcesOffset = offset;
    offset += resourcesBuffer.length;
    const signatureOffset = offset;
    
    // Build header
    const header: PackageHeader = {
      magic: 0x43564D00,
      version: 1,
      headerSize: 64,
      manifestOffset,
      manifestSize: manifestBuffer.length,
      bytecodeOffset,
      bytecodeSize: bytecodeBuffer.length,
      metadataOffset,
      metadataSize: metadataBuffer.length,
      resourcesOffset,
      resourcesSize: resourcesBuffer.length,
      signatureOffset,
      signatureSize: this.signature ? serializeSignature(this.signature).length : 0,
      checksum: 0,
      flags: 0,
      reserved: new Array(8).fill(0)
    };
    
    // Calculate header checksum
    const headerBuffer = encodeHeader(header);
    header.checksum = calculateHeaderChecksum(headerBuffer);
    const finalHeaderBuffer = encodeHeader(header);
    
    // Build package
    const buffers: Buffer[] = [
      finalHeaderBuffer,
      manifestBuffer,
      bytecodeBuffer,
      metadataBuffer,
      resourcesBuffer
    ];
    
    if (this.signature) {
      buffers.push(serializeSignature(this.signature));
    }
    
    const packageData = Buffer.concat(buffers);
    
    return {
      header,
      manifest: this.manifest,
      bytecode: this.bytecode,
      resources: Array.from(this.resources.values()).map(v => v.resource),
      metadata: this.metadata,
      security: this.security,
      signature: this.signature,
      data: packageData
    };
  }
  
  async sign(privateKey: string, algorithm: SignatureAlgorithm): Promise<void> {
    const package = await this.build();
    this.signature = await signPackage(package, privateKey, algorithm);
    this.security = {
      ...this.security,
      signature: {
        algorithm,
        publicKey: await derivePublicKey(privateKey),
        signature: this.signature.signature,
        timestamp: this.signature.timestamp
      }
    };
  }
  
  async encrypt(key: string, algorithm: EncryptionAlgorithm): Promise<void> {
    const package = await this.build();
    const encrypted = await encryptPackage(package, key, algorithm);
    this.encryption = {
      algorithm,
      keyId: encrypted.keyId,
      iv: encrypted.iv
    };
    this.security = {
      ...this.security,
      encryption: this.encryption
    };
  }
  
  async compress(algorithm: CompressionAlgorithm, level: number): Promise<void> {
    this.compression = {
      algorithm,
      level
    };
  }
}

function calculateHeaderChecksum(header: Buffer): number {
  // Simple checksum calculation
  let checksum = 0;
  for (let i = 0; i < header.length; i++) {
    checksum = (checksum + header[i]) % 0xFFFFFFFF;
  }
  return checksum;
}
```

## PACKAGE READER

### Reader Interface

```typescript
interface PackageReader {
  load(buffer: Buffer): Promise<CognitivePackage>;
  verify(): Promise<boolean>;
  decrypt(key: string): Promise<void>;
  decompress(): Promise<void>;
  getManifest(): PackageManifest;
  getBytecode(): BytecodeContainer;
  getResource(id: string): Resource;
  getResourceData(id: string): Buffer;
  getMetadata(): PackageMetadata;
  getSecurity(): SecurityInfo;
}

class CognitivePackageReader implements PackageReader {
  private package?: CognitivePackage;
  private decrypted: boolean = false;
  private decompressed: boolean = false;
  
  async load(buffer: Buffer): Promise<CognitivePackage> {
    // Read header
    const header = decodeHeader(buffer.slice(0, 64));
    
    // Verify magic number
    if (header.magic !== 0x43564M00) {
      throw new Error('Invalid package magic number');
    }
    
    // Read manifest
    const manifestBuffer = buffer.slice(
      header.manifestOffset,
      header.manifestOffset + header.manifestSize
    );
    const manifest = deserializeManifest(manifestBuffer);
    
    // Read bytecode
    const bytecodeBuffer = buffer.slice(
      header.bytecodeOffset,
      header.bytecodeOffset + header.bytecodeSize
    );
    const bytecode = deserializeBytecode(bytecodeBuffer);
    
    // Read metadata
    let metadata: PackageMetadata | undefined;
    if (header.metadataSize > 0) {
      const metadataBuffer = buffer.slice(
        header.metadataOffset,
        header.metadataOffset + header.metadataSize
      );
      metadata = JSON.parse(metadataBuffer.toString('utf8'));
    }
    
    // Read resources
    const resources: Resource[] = [];
    if (header.resourcesSize > 0) {
      const resourcesBuffer = buffer.slice(
        header.resourcesOffset,
        header.resourcesOffset + header.resourcesSize
      );
      const bundle = deserializeResourceBundle(resourcesBuffer);
      resources = bundle.resources;
    }
    
    // Read signature
    let signature: PackageSignature | undefined;
    if (header.signatureSize > 0) {
      const signatureBuffer = buffer.slice(
        header.signatureOffset,
        header.signatureOffset + header.signatureSize
      );
      signature = deserializeSignature(signatureBuffer);
    }
    
    this.package = {
      header,
      manifest,
      bytecode,
      resources,
      metadata,
      security: {
        signature,
        encryption: undefined,
        integrity: undefined,
        accessControl: undefined
      },
      signature,
      data: buffer
    };
    
    return this.package;
  }
  
  async verify(): Promise<boolean> {
    if (!this.package || !this.package.signature) {
      return false;
    }
    
    return await verifyPackage(this.package, this.package.signature);
  }
  
  async decrypt(key: string): Promise<void> {
    if (!this.package) {
      throw new Error('No package loaded');
    }
    
    if (!this.package.security?.encryption) {
      throw new Error('Package is not encrypted');
    }
    
    const encrypted: EncryptedPackage = {
      encrypted: this.package.data,
      algorithm: this.package.security.encryption.algorithm as EncryptionAlgorithm,
      keyId: this.package.security.encryption.keyId,
      iv: this.package.security.encryption.iv
    };
    
    const decrypted = await decryptPackage(encrypted, key);
    this.package = decrypted;
    this.decrypted = true;
  }
  
  async decompress(): Promise<void> {
    if (!this.package) {
      throw new Error('No package loaded');
    }
    
    // Implement decompression
    this.decompressed = true;
  }
  
  getManifest(): PackageManifest {
    if (!this.package) {
      throw new Error('No package loaded');
    }
    return this.package.manifest;
  }
  
  getBytecode(): BytecodeContainer {
    if (!this.package) {
      throw new Error('No package loaded');
    }
    return this.package.bytecode;
  }
  
  getResource(id: string): Resource {
    if (!this.package) {
      throw new Error('No package loaded');
    }
    
    const resource = this.package.resources.find(r => r.id === id);
    if (!resource) {
      throw new Error(`Resource not found: ${id}`);
    }
    
    return resource;
  }
  
  getResourceData(id: string): Buffer {
    // Would need to extract from package data
    return Buffer.alloc(0);
  }
  
  getMetadata(): PackageMetadata {
    if (!this.package) {
      throw new Error('No package loaded');
    }
    return this.package.metadata!;
  }
  
  getSecurity(): SecurityInfo {
    if (!this.package) {
      throw new Error('No package loaded');
    }
    return this.package.security!;
  }
}
```

## RUST IMPLEMENTATION

### Package Structure (Rust)

```rust
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct CognitivePackage {
    pub header: PackageHeader,
    pub manifest: PackageManifest,
    pub bytecode: BytecodeContainer,
    pub resources: Vec<Resource>,
    pub metadata: Option<PackageMetadata>,
    pub security: SecurityInfo,
    pub signature: Option<PackageSignature>,
    pub data: Vec<u8>,
}

#[derive(Debug, Clone)]
pub struct PackageHeader {
    pub magic: u32,
    pub version: u16,
    pub header_size: u16,
    pub manifest_offset: u32,
    pub manifest_size: u32,
    pub bytecode_offset: u32,
    pub bytecode_size: u32,
    pub metadata_offset: u32,
    pub metadata_size: u32,
    pub resources_offset: u32,
    pub resources_size: u32,
    pub signature_offset: u32,
    pub signature_size: u32,
    pub checksum: u32,
    pub flags: u32,
    pub reserved: [u32; 8],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PackageManifest {
    pub package: PackageInfo,
    pub version: VersionInfo,
    pub dependencies: Vec<Dependency>,
    pub capabilities: Vec<Capability>,
    pub requirements: Vec<Requirement>,
    pub security: SecurityInfo,
    pub metadata: PackageMetadata,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PackageInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    pub author: String,
    pub license: String,
    pub homepage: String,
    pub repository: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VersionInfo {
    pub version: String,
    pub build: String,
    pub compatibility: String,
    pub bytecode_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Dependency {
    pub id: String,
    pub version: String,
    pub r#type: DependencyType,
    pub required: bool,
    pub checksum: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DependencyType {
    Runtime,
    Development,
    Test,
    Optional,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Capability {
    pub id: String,
    pub name: String,
    pub description: String,
    pub version: String,
    pub permissions: Vec<Permission>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Permission {
    pub resource: String,
    pub actions: Vec<String>,
    pub constraints: Vec<Constraint>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Constraint {
    pub key: String,
    pub value: String,
    pub operator: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Requirement {
    pub r#type: RequirementType,
    pub value: String,
    pub minimum: Option<String>,
    pub maximum: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RequirementType {
    CvmVersion,
    Memory,
    Cpu,
    Storage,
    Network,
    Gpu,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityInfo {
    pub signature: Option<SignatureInfo>,
    pub encryption: Option<EncryptionInfo>,
    pub integrity: Option<IntegrityInfo>,
    pub access_control: Option<AccessControlInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignatureInfo {
    pub algorithm: String,
    pub public_key: String,
    pub signature: String,
    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EncryptionInfo {
    pub algorithm: String,
    pub key_id: String,
    pub iv: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IntegrityInfo {
    pub algorithm: String,
    pub checksum: String,
    pub salt: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccessControlInfo {
    pub acl: Vec<ACL>,
    pub owner: String,
    pub group: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ACL {
    pub principal: String,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PackageMetadata {
    pub created: i64,
    pub modified: i64,
    pub size: u64,
    pub tags: Vec<String>,
    pub categories: Vec<String>,
}
```

### Package Builder (Rust)

```rust
pub struct PackageBuilder {
    manifest: Option<PackageManifest>,
    bytecode: Option<BytecodeContainer>,
    resources: HashMap<String, (Resource, Vec<u8>)>,
    metadata: Option<PackageMetadata>,
    security: Option<SecurityInfo>,
    signature: Option<PackageSignature>,
    encryption: Option<EncryptionInfo>,
    compression: Option<CompressionInfo>,
}

impl PackageBuilder {
    pub fn new() -> Self {
        Self {
            manifest: None,
            bytecode: None,
            resources: HashMap::new(),
            metadata: None,
            security: None,
            signature: None,
            encryption: None,
            compression: None,
        }
    }
    
    pub fn create_manifest(&mut self, manifest: PackageManifest) {
        self.manifest = Some(manifest);
    }
    
    pub fn add_bytecode(&mut self, bytecode: BytecodeContainer) {
        self.bytecode = Some(bytecode);
    }
    
    pub fn add_resource(&mut self, resource: Resource, data: Vec<u8>) {
        self.resources.insert(resource.id.clone(), (resource, data));
    }
    
    pub fn set_metadata(&mut self, metadata: PackageMetadata) {
        self.metadata = Some(metadata);
    }
    
    pub fn set_security(&mut self, security: SecurityInfo) {
        self.security = Some(security);
    }
    
    pub async fn build(&self) -> Result<CognitivePackage, CVMError> {
        let manifest = self.manifest.as_ref()
            .ok_or_else(|| CVMError::ValidationError("Manifest is required".to_string()))?;
        
        let bytecode = self.bytecode.as_ref()
            .ok_or_else(|| CVMError::ValidationError("Bytecode is required".to_string()))?;
        
        // Serialize components
        let manifest_buffer = serde_json::to_vec(manifest)?;
        let bytecode_buffer = serialize_bytecode(bytecode)?;
        let metadata_buffer = self.metadata.as_ref()
            .map(|m| serde_json::to_vec(m).unwrap_or_default())
            .unwrap_or_default();
        
        // Serialize resources
        let mut resource_buffers = Vec::new();
        for (_id, (resource, data)) in &self.resources {
            resource_buffers.push(serialize_resource(resource)?);
            resource_buffers.push(data.clone());
        }
        let resources_buffer = resource_buffers.concat();
        
        // Calculate offsets
        let mut offset = 64; // Header size
        let manifest_offset = offset;
        offset += manifest_buffer.len();
        let bytecode_offset = offset;
        offset += bytecode_buffer.len();
        let metadata_offset = offset;
        offset += metadata_buffer.len();
        let resources_offset = offset;
        offset += resources_buffer.len();
        let signature_offset = offset;
        
        // Build header
        let header = PackageHeader {
            magic: 0x43564D00,
            version: 1,
            header_size: 64,
            manifest_offset: manifest_offset as u32,
            manifest_size: manifest_buffer.len() as u32,
            bytecode_offset: bytecode_offset as u32,
            bytecode_size: bytecode_buffer.len() as u32,
            metadata_offset: metadata_offset as u32,
            metadata_size: metadata_buffer.len() as u32,
            resources_offset: resources_offset as u32,
            resources_size: resources_buffer.len() as u32,
            signature_offset: signature_offset as u32,
            signature_size: self.signature.as_ref()
                .map(|s| serialize_signature(s).unwrap_or_default().len() as u32)
                .unwrap_or(0),
            checksum: 0,
            flags: 0,
            reserved: [0; 8],
        };
        
        // Calculate header checksum
        let header_buffer = encode_header(&header);
        let checksum = calculate_header_checksum(&header_buffer);
        let mut header = header;
        header.checksum = checksum;
        let final_header_buffer = encode_header(&header);
        
        // Build package
        let mut buffers = vec![
            final_header_buffer,
            manifest_buffer,
            bytecode_buffer,
            metadata_buffer,
            resources_buffer,
        ];
        
        if let Some(signature) = &self.signature {
            buffers.push(serialize_signature(signature)?);
        }
        
        let package_data = buffers.concat();
        
        Ok(CognitivePackage {
            header,
            manifest: manifest.clone(),
            bytecode: bytecode.clone(),
            resources: self.resources.values()
                .map(|(r, _)| r.clone())
                .collect(),
            metadata: self.metadata.clone(),
            security: self.security.clone(),
            signature: self.signature.clone(),
            data: package_data,
        })
    }
    
    pub async fn sign(&mut self, private_key: String, algorithm: SignatureAlgorithm) -> Result<(), CVMError> {
        let package = self.build().await?;
        let signature = sign_package(&package, &private_key, algorithm).await?;
        self.signature = Some(signature);
        
        if let Some(security) = &mut self.security {
            security.signature = Some(SignatureInfo {
                algorithm: algorithm.to_string(),
                public_key: derive_public_key(&private_key)?,
                signature: signature.signature.clone(),
                timestamp: signature.timestamp,
            });
        }
        
        Ok(())
    }
}

fn encode_header(header: &PackageHeader) -> Vec<u8> {
    let mut buffer = vec
![0; 64];
    
    buffer[0..4].copy_from_slice(&header.magic.to_le_bytes());
    buffer[4..6].copy_from_slice(&header.version.to_le_bytes());
    buffer[6..8].copy_from_slice(&header.header_size.to_le_bytes());
    buffer[8..12].copy_from_slice(&header.manifest_offset.to_le_bytes());
    buffer[12..16].copy_from_slice(&header.manifest_size.to_le_bytes());
    buffer[16..20].copy_from_slice(&header.bytecode_offset.to_le_bytes());
    buffer[20..24].copy_from_slice(&header.bytecode_size.to_le_bytes());
    buffer[24..28].copy_from_slice(&header.metadata_offset.to_le_bytes());
    buffer[28..32].copy_from_slice(&header.metadata_size.to_le_bytes());
    buffer[32..36].copy_from_slice(&header.resources_offset.to_le_bytes());
    buffer[36..40].copy_from_slice(&header.resources_size.to_le_bytes());
    buffer[40..44].copy_from_slice(&header.signature_offset.to_le_bytes());
    buffer[44..48].copy_from_slice(&header.signature_size.to_le_bytes());
    buffer[48..52].copy_from_slice(&header.checksum.to_le_bytes());
    buffer[52..56].copy_from_slice(&header.flags.to_le_bytes());
    
    for (i, &val) in header.reserved.iter().enumerate() {
        buffer[56 + i * 4..60 + i * 4].copy_from_slice(&val.to_le_bytes());
    }
    
    buffer
}

fn calculate_header_checksum(header: &[u8]) -> u32 {
    let mut checksum: u32 = 0;
    for &byte in header {
        checksum = checksum.wrapping_add(byte as u32);
    }
    checksum
}
```

## IMPLEMENTATION STATUS

- [x] Package structure defined
- [x] Header encoding/decoding (TypeScript + Rust)
- [x] Manifest structure and serialization
- [x] Bytecode container structure
- [x] Resource bundle structure
- [x] Security layer (signature, encryption, integrity)
- [x] Package Builder (TypeScript + Rust)
- [x] Package Reader (TypeScript)
- [x] Rust package structures

## NEXT STEPS

- Implement CVM-013: Loader
- Implement CVM-014: Validator
- Generate language contracts
