# Cognitive Intermediate Representation (CIR) - Phase 2 Blueprint V3 Enterprise

## Document Metadata

**Document ID** : PHASE2-CIR  
**Title** : Cognitive Intermediate Representation  
**Version** : 1.0.0  
**Status** : Production  
**Type** : Compiler IR Specification  
**Category** : Cognitive Runtime  
**Created** : 2024-01-23  
**Author** : Distinguished Systems Architect, Chief Scientist  
**Purpose** : Define the complete intermediate representation for Blueprint V3 cognitive compiler pipeline  

---

## Table of Contents

1. [Vision and Principles](#1-vision-and-principles)
2. [CIR Architecture](#2-cir-architecture)
3. [IR Structure](#3-ir-structure)
4. [Type System](#4-type-system)
5. [Value Representation](#5-value-representation)
6. [Control Flow](#6-control-flow)
7. [Operations](#7-operations)
8. [Functions](#8-functions)
9. [Modules](#9-modules)
10. [Metadata](#10-metadata)
11. [Validation](#11-validation)
12. [Optimization](#12-optimization)
13. [Lowering](#13-lowering)
14. [Serialization](#14-serialization)
15. [Interfaces](#15-interfaces)
16. [Examples](#16-examples)
17. [Reference Implementation](#17-reference-implementation)

---

## 1. Vision and Principles

### Core Vision

The Cognitive Intermediate Representation (CIR) is a high-level, typed intermediate representation used in the Blueprint V3 compiler pipeline. It sits between the source language and the Cognitive Bytecode (CBS), providing a platform-independent representation that enables powerful optimizations and analyses.

### Design Principles

**PRINCIPLE 1: Explicit Control Flow**
CIR MUST have explicit control flow representation. All branches, loops, and calls MUST be explicit.

**PRINCIPLE 2: Static Single Assignment**
CIR MUST use Static Single Assignment (SSA) form for values. Each variable MUST be assigned exactly once.

**PRINCIPLE 3: Type Safety**
CIR MUST be fully typed. All operations MUST be type-safe at the IR level.

**PRINCIPLE 4: Explicit Side Effects**
CIR MUST explicitly represent side effects. All side-effecting operations MUST be explicit.

**PRINCIPLE 5: Cognitive-Aware**
CIR MUST have first-class support for cognitive operations (observation, reasoning, knowledge, memory).

**PRINCIPLE 6: Analyzable**
CIR MUST be designed for easy analysis and transformation.

**PRINCIPLE 7: Verifiable**
CIR MUST support verification and validation passes.

**PRINCIPLE 8: Extensible**
CIR MUST support extension through custom operations and attributes.

### Architecture Philosophy

The CIR follows a modern IR design similar to LLVM IR and MLIR:
- SSA-based value representation
- Explicit basic blocks and control flow
- Rich type system with cognitive types
- First-class functions and modules
- Rich metadata for optimization

### CIR in Compiler Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│              Compiler Pipeline                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Source Code → Parsing → AST → CIR → Optimizations → CBS    │
│                                                               │
│  CIR Stages:                                                  │
│  1. Frontend: Source → CIR                                    │
│  2. Analysis: Type checking, validation                       │
│  3. Optimization: Transformations, simplifications           │
│  4. Lowering: CIR → CBS                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. CIR Architecture

### Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     CIR Architecture                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Module                                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Functions  │  │  Globals    │  │  Types      │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Metadata   │  │  Attributes │  │  Annotations│  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Function                                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Signature  │  │  Parameters │  │  Return Type│  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Basic Blocks│ │  Values     │  │  Operations │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Basic Block                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Name       │  │  Operations │  │  Successors │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Operation                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Opcode     │  │  Operands   │  │  Result     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Type       │  │  Attributes │  │  Region     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Descriptions

**Module:** Top-level compilation unit containing functions, globals, types, and metadata.

**Function:** Callable unit with signature, parameters, return type, and basic blocks.

**Basic Block:** Sequence of operations with single entry and single exit.

**Operation:** Individual instruction with opcode, operands, result, and attributes.

**Value:** SSA value with type and defining operation.

**Type:** Type definition for values and operations.

---

## 3. IR Structure

### Module Structure

```typescript
interface CIRModule {
  // Identification
  id: string;                // Module ID
  name: string;              // Module name
  version: string;           // Module version
  
  // Contents
  functions: Map<string, CIRFunction>;  // Functions
  globals: Map<string, CIRGlobal>;      // Global variables
  types: Map<string, CIRType>;          // Type definitions
  
  // Metadata
  metadata: CIRMetadata;     // Module metadata
  attributes: CIRAttribute[]; // Module attributes
  annotations: CIRAnnotation[]; // Module annotations
  
  // Source information
  sourceFiles: SourceFile[]; // Source files
  debugInfo: DebugInfo;      // Debug information
}
```

### Function Structure

```typescript
interface CIRFunction {
  // Identification
  id: string;                // Function ID
  name: string;              // Function name
  linkage: LinkageType;      // Linkage type
  
  // Signature
  signature: CIRFunctionSignature;
  
  // Body
  parameters: CIRParameter[]; // Parameters
  returnType: CIRType;       // Return type
  basicBlocks: CIRBasicBlock[]; // Basic blocks
  
  // Metadata
  attributes: CIRAttribute[]; // Function attributes
  annotations: CIRAnnotation[]; // Function annotations
  sourceLocation: SourceLocation; // Source location
}

interface CIRFunctionSignature {
  parameters: CIRType[];     // Parameter types
  returnType: CIRType;      // Return type
  variadic: boolean;         // Variadic function
  callingConvention: CallingConvention; // Calling convention
}

enum LinkageType {
  PRIVATE = 'private',
  INTERNAL = 'internal',
  PUBLIC = 'public',
  EXTERNAL = 'external',
}

enum CallingConvention {
  COGNITIVE = 'cognitive',
  C = 'c',
  SYSTEM = 'system',
}
```

### Basic Block Structure

```typescript
interface CIRBasicBlock {
  // Identification
  id: string;                // Block ID
  name: string;              // Block name
  
  // Contents
  operations: CIROperation[]; // Operations in block
  
  // Control flow
  predecessors: string[];    // Predecessor block IDs
  successors: string[];      // Successor block IDs
  
  // Metadata
  sourceLocation: SourceLocation; // Source location
}
```

### Operation Structure

```typescript
interface CIROperation {
  // Identification
  id: string;                // Operation ID
  opcode: CIROpcode;         // Operation opcode
  
  // Operands
  operands: CIRValue[];      // Operand values
  
  // Result
  result?: CIRValue;         // Result value (if any)
  
  // Type
  type: CIRType;             // Operation type
  
  // Metadata
  attributes: CIRAttribute[]; // Operation attributes
  annotations: CIRAnnotation[]; // Operation annotations
  sourceLocation: SourceLocation; // Source location
}
```

### Value Structure

```typescript
interface CIRValue {
  // Identification
  id: string;                // Value ID
  name: string;              // Value name
  
  // Type
  type: CIRType;             // Value type
  
  // Definition
  definingOp?: CIROperation; // Defining operation
  
  // Uses
  uses: CIROperation[];      // Using operations
  
  // Constant
  isConstant: boolean;       // Is constant value
  constantValue?: any;       // Constant value
}
```

---

## 4. Type System

### Type Hierarchy

```typescript
abstract class CIRType {
  id: string;                // Type ID
  name: string;              // Type name
  kind: TypeKind;            // Type kind
}

enum TypeKind {
  VOID = 'void',
  INTEGER = 'integer',
  FLOAT = 'float',
  BOOLEAN = 'boolean',
  STRING = 'string',
  ARRAY = 'array',
  VECTOR = 'vector',
  STRUCT = 'struct',
  UNION = 'union',
  FUNCTION = 'function',
  POINTER = 'pointer',
  OBSERVATION = 'observation',
  REASONING = 'reasoning',
  KNOWLEDGE = 'knowledge',
  MEMORY = 'memory',
  CONVERSATION = 'conversation',
  GRAPH = 'graph',
  EVIDENCE = 'evidence',
  DECISION = 'decision',
  PLAN = 'plan',
}
```

### Primitive Types

```typescript
interface CIRVoidType extends CIRType {
  kind: TypeKind.VOID;
}

interface CIRIntegerType extends CIRType {
  kind: TypeKind.INTEGER;
  width: number;             // Bit width (8, 16, 32, 64)
  signed: boolean;           // Signed or unsigned
}

interface CIRFloatType extends CIRType {
  kind: TypeKind.FLOAT;
  width: number;             // Bit width (32, 64)
}

interface CIRBooleanType extends CIRType {
  kind: TypeKind.BOOLEAN;
}

interface CIRStringType extends CIRType {
  kind: TypeKind.STRING;
}
```

### Composite Types

```typescript
interface CIRArrayType extends CIRType {
  kind: TypeKind.ARRAY;
  elementType: CIRType;      // Element type
  size: number | 'dynamic';  // Array size
}

interface CIRVectorType extends CIRType {
  kind: TypeKind.VECTOR;
  elementType: CIRType;      // Element type
  size: number;              // Vector size
}

interface CIRStructType extends CIRType {
  kind: TypeKind.STRUCT;
  fields: StructField[];     // Struct fields
}

interface StructField {
  name: string;              // Field name
  type: CIRType;             // Field type
  offset: number;            // Field offset
}

interface CIRUnionType extends CIRType {
  kind: TypeKind.UNION;
  variants: CIRType[];       // Union variants
}
```

### Function Type

```typescript
interface CIRFunctionType extends CIRType {
  kind: TypeKind.FUNCTION;
  parameters: CIRType[];     // Parameter types
  returnType: CIRType;       // Return type
  variadic: boolean;         // Variadic
}
```

### Pointer Type

```typescript
interface CIRPointerType extends CIRType {
  kind: TypeKind.POINTER;
  pointeeType: CIRType;      // Pointed-to type
  addressSpace: number;      // Address space
}
```

### Cognitive Types

```typescript
interface CIRObservationType extends CIRType {
  kind: TypeKind.OBSERVATION;
  schema: string;            // Observation schema
}

interface CIRReasoningType extends CIRType {
  kind: TypeKind.REASONING;
  method: string;            // Reasoning method
}

interface CIRKnowledgeType extends CIRType {
  kind: TypeKind.KNOWLEDGE;
  domain: string;            // Knowledge domain
}

interface CIRMemoryType extends CIRType {
  kind: TypeKind.MEMORY;
  memoryType: string;        // Memory type
}

interface CIRConversationType extends CIRType {
  kind: TypeKind.CONVERSATION;
  protocol: string;          // Conversation protocol
}

interface CIRGraphType extends CIRType {
  kind: TypeKind.GRAPH;
  graphType: string;         // Graph type
}

interface CIREvidenceType extends CIRType {
  kind: TypeKind.EVIDENCE;
  evidenceType: string;      // Evidence type
}

interface CIRDecisionType extends CIRType {
  kind: TypeKind.DECISION;
  decisionType: string;      // Decision type
}

interface CIRPlanType extends CIRType {
  kind: TypeKind.PLAN;
  planType: string;          // Plan type
}
```

---

## 5. Value Representation

### Constant Values

```typescript
interface CIRConstantValue {
  type: CIRType;             // Constant type
  value: ConstantData;       // Constant data
}

type ConstantData =
  | { kind: 'null' }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'integer'; value: bigint; width: number; signed: boolean }
  | { kind: 'float'; value: number; width: number }
  | { kind: 'string'; value: string }
  | { kind: 'array'; elements: CIRConstantValue[] }
  | { kind: 'struct'; fields: Map<string, CIRConstantValue> }
  | { kind: 'undefined' };
```

### SSA Values

SSA values are defined by operations:

```typescript
interface CIRSSAValue extends CIRValue {
  isConstant: false;
  definingOp: CIROperation;
}
```

### Parameter Values

Function parameters are SSA values with no defining operation:

```typescript
interface CIRParameterValue extends CIRValue {
  isConstant: false;
  definingOp: undefined;
  isParameter: true;
  parameterIndex: number;
}
```

### Global Values

Global variables are represented as pointer values:

```typescript
interface CIRGlobalValue extends CIRValue {
  isConstant: true;
  constantValue: bigint;     // Global address
  isGlobal: true;
  globalName: string;
}
```

---

## 6. Control Flow

### Basic Block Terminators

Each basic block ends with a terminator operation:

```typescript
enum TerminatorOpcode {
  RET = 'ret',               // Return
  BR = 'br',                 // Unconditional branch
  COND_BR = 'cond_br',       // Conditional branch
  SWITCH = 'switch',         // Switch
  INVOKE = 'invoke',         // Invoke with exception handling
  UNREACHABLE = 'unreachable', // Unreachable
}
```

### Return Operation

```typescript
interface CIRRetOp extends CIROperation {
  opcode: TerminatorOpcode.RET;
  operands: [CIRValue?];     // Return value (optional)
  result: undefined;
  type: CIRVoidType;
}
```

### Unconditional Branch

```typescript
interface CIRBrOp extends CIROperation {
  opcode: TerminatorOpcode.BR;
  operands: [CIRBasicBlock]; // Target block
  result: undefined;
  type: CIRVoidType;
}
```

### Conditional Branch

```typescript
interface CIRCondBrOp extends CIROperation {
  opcode: TerminatorOpcode.COND_BR;
  operands: [CIRValue, CIRBasicBlock, CIRBasicBlock]; // Condition, true block, false block
  result: undefined;
  type: CIRVoidType;
}
```

### Switch Operation

```typescript
interface CIRSwitchOp extends CIROperation {
  opcode: TerminatorOpcode.SWITCH;
  operands: [CIRValue, CIRBasicBlock, SwitchCase[]]; // Value, default, cases
  result: undefined;
  type: CIRVoidType;
}

interface SwitchCase {
  value: CIRConstantValue;   // Case value
  block: CIRBasicBlock;      // Case block
}
```

### Invoke Operation

```typescript
interface CIRInvokeOp extends CIROperation {
  opcode: TerminatorOpcode.INVOKE;
  operands: [CIRFunction, ...CIRValue[]]; // Function, arguments
  result: CIRValue;           // Return value
  type: CIRType;              // Return type
  normalBlock: CIRBasicBlock; // Normal continuation
  exceptionBlock: CIRBasicBlock; // Exception handler
}
```

### PHI Nodes

PHI nodes implement SSA phi functions:

```typescript
interface CIRPhiOp extends CIROperation {
  opcode: 'phi';
  operands: [PhiIncoming[]]; // Incoming values
  result: CIRValue;           // Result value
  type: CIRType;              // Result type
}

interface PhiIncoming {
  value: CIRValue;           // Incoming value
  block: CIRBasicBlock;      // Incoming block
}
```

---

## 7. Operations

### Operation Categories

```typescript
enum OperationCategory {
  // Arithmetic
  ARITHMETIC = 'arithmetic',
  
  // Bitwise
  BITWISE = 'bitwise',
  
  // Comparison
  COMPARISON = 'comparison',
  
  // Memory
  MEMORY = 'memory',
  
  // Control flow
  CONTROL_FLOW = 'control_flow',
  
  // Aggregate
  AGGREGATE = 'aggregate',
  
  // Conversion
  CONVERSION = 'conversion',
  
  // Cognitive
  COGNITIVE = 'cognitive',
  
  // Other
  OTHER = 'other',
}
```

### Arithmetic Operations

```typescript
enum ArithmeticOpcode {
  ADD = 'add',
  SUB = 'sub',
  MUL = 'mul',
  DIV = 'div',
  REM = 'rem',
  NEG = 'neg',
  ABS = 'abs',
}

interface CIRAddOp extends CIROperation {
  opcode: ArithmeticOpcode.ADD;
  operands: [CIRValue, CIRValue]; // Left, right
  result: CIRValue;
  type: CIRIntegerType | CIRFloatType;
  attributes: ['no_overflow' | 'nuw' | 'nsw'];
}
```

### Bitwise Operations

```typescript
enum BitwiseOpcode {
  AND = 'and',
  OR = 'or',
  XOR = 'xor',
  NOT = 'not',
  SHL = 'shl',
  SHR = 'shr',
}

interface CIRAndOp extends CIROperation {
  opcode: BitwiseOpcode.AND;
  operands: [CIRValue, CIRValue]; // Left, right
  result: CIRValue;
  type: CIRIntegerType;
}
```

### Comparison Operations

```typescript
enum ComparisonOpcode {
  EQ = 'eq',
  NE = 'ne',
  LT = 'lt',
  LE = 'le',
  GT = 'gt',
  GE = 'ge',
}

interface CIREqOp extends CIROperation {
  opcode: ComparisonOpcode.EQ;
  operands: [CIRValue, CIRValue]; // Left, right
  result: CIRValue;
  type: CIRBooleanType;
}
```

### Memory Operations

```typescript
enum MemoryOpcode {
  ALLOC = 'alloc',
  LOAD = 'load',
  STORE = 'store',
  GET_ELEMENT_PTR = 'get_element_ptr',
  FREE = 'free',
}

interface CIRAllocOp extends CIROperation {
  opcode: MemoryOpcode.ALLOC;
  operands: [CIRType, CIRValue?]; // Type, size (optional)
  result: CIRValue;
  type: CIRPointerType;
}

interface CIRLoadOp extends CIROperation {
  opcode: MemoryOpcode.LOAD;
  operands: [CIRValue]; // Pointer
  result: CIRValue;
  type: CIRType;
  attributes: ['volatile' | 'atomic' | 'unaligned'];
}

interface CIRStoreOp extends CIROperation {
  opcode: MemoryOpcode.STORE;
  operands: [CIRValue, CIRValue]; // Value, pointer
  result: undefined;
  type: CIRVoidType;
  attributes: ['volatile' | 'atomic' | 'unaligned'];
}
```

### Cognitive Operations

```typescript
enum CognitiveOpcode {
  // Observation
  OBSERVE_INIT = 'observe_init',
  OBSERVE_COLLECT = 'observe_collect',
  OBSERVE_ANALYZE = 'observe_analyze',
  OBSERVE_CLOSE = 'observe_close',
  
  // Reasoning
  REASON_INIT = 'reason_init',
  REASON_DEDUCE = 'reason_deduce',
  REASON_INDUCE = 'reason_induce',
  REASON_ABDUCE = 'reason_abduce',
  REASON_EXPLAIN = 'reason_explain',
  REASON_CLOSE = 'reason_close',
  
  // Knowledge
  KNOWLEDGE_QUERY = 'knowledge_query',
  KNOWLEDGE_STORE = 'knowledge_store',
  KNOWLEDGE_RETRIEVE = 'knowledge_retrieve',
  KNOWLEDGE_UPDATE = 'knowledge_update',
  
  // Memory
  MEMORY_STORE = 'memory_store',
  MEMORY_RECALL = 'memory_recall',
  MEMORY_CLUSTER = 'memory_cluster',
  MEMORY_EXPORT = 'memory_export',
  
  // Conversation
  CONVERSATION_START = 'conversation_start',
  CONVERSATION_SEND = 'conversation_send',
  CONVERSATION_RECEIVE = 'conversation_receive',
  CONVERSATION_END = 'conversation_end',
  
  // Graph
  GRAPH_CREATE = 'graph_create',
  GRAPH_ADD_NODE = 'graph_add_node',
  GRAPH_ADD_EDGE = 'graph_add_edge',
  GRAPH_QUERY = 'graph_query',
  GRAPH_TRAVERSE = 'graph_traverse',
}

interface CIRObserveInitOp extends CIROperation {
  opcode: CognitiveOpcode.OBSERVE_INIT;
  operands: [CIRValue]; // Configuration
  result: CIRValue;
  type: CIRObservationType;
}

interface CIRReasonDeduceOp extends CIROperation {
  opcode: CognitiveOpcode.REASON_DEDUCE;
  operands: [CIRValue, CIRValue, CIRValue]; // Context, premises, method
  result: CIRValue;
  type: CIRReasoningType;
}

interface CIRKnowledgeQueryOp extends CIROperation {
  opcode: CognitiveOpcode.KNOWLEDGE_QUERY;
  operands: [CIRValue, CIRValue]; // Query, limit
  result: CIRValue;
  type: CIRKnowledgeType;
}
```

---

## 8. Functions

### Function Definition

```typescript
interface CIRFunctionDefinition {
  id: string;
  name: string;
  linkage: LinkageType;
  signature: CIRFunctionSignature;
  basicBlocks: CIRBasicBlock[];
  attributes: CIRAttribute[];
  annotations: CIRAnnotation[];
}
```

### Function Attributes

```typescript
enum FunctionAttribute {
  ALWAYS_INLINE = 'always_inline',
  INLINE = 'inline',
  NO_INLINE = 'no_inline',
  PURE = 'pure',
  CONST = 'const',
  NO_RETURN = 'no_return',
  NO_UNWIND = 'no_unwind',
  READ_NONE = 'read_none',
  READ_ONLY = 'read_only',
  NO_RECURSE = 'no_recurse',
}
```

### Function Annotations

```typescript
interface CIRAnnotation {
  name: string;              // Annotation name
  arguments: CIRValue[];     // Annotation arguments
}
```

### External Functions

External functions are declared but not defined:

```typescript
interface CIRExternalFunction extends CIRFunction {
  linkage: LinkageType.EXTERNAL;
  basicBlocks: [];
}
```

---

## 9. Modules

### Module Definition

```typescript
interface CIRModuleDefinition {
  id: string;
  name: string;
  version: string;
  functions: Map<string, CIRFunction>;
  globals: Map<string, CIRGlobal>;
  types: Map<string, CIRType>;
  metadata: CIRMetadata;
}
```

### Global Variables

```typescript
interface CIRGlobal {
  id: string;
  name: string;
  type: CIRType;
  linkage: LinkageType;
  isConstant: boolean;
  initialValue?: CIRConstantValue;
  addressSpace: number;
}
```

### Module Metadata

```typescript
interface CIRMetadata {
  // Identification
  author: string;
  description: string;
  license: string;
  
  // Compilation
  sourceLanguage: string;
  compilerVersion: string;
  compilationFlags: string[];
  
  // Target
  targetTriple: string;
  targetFeatures: string[];
  
  // Custom
  custom: Map<string, any>;
}
```

---

## 10. Metadata

### Debug Metadata

```typescript
interface CIRDebugMetadata {
  // Source locations
  sourceLocations: Map<string, SourceLocation>;
  
  // Variable information
  variables: Map<string, VariableDebugInfo>;
  
  // Line table
  lineTable: LineTable;
}

interface SourceLocation {
  file: string;
  line: number;
  column: number;
}

interface VariableDebugInfo {
  name: string;
  type: CIRType;
  scope: string;
  location: SourceLocation;
}

interface LineTable {
  entries: LineTableEntry[];
}

interface LineTableEntry {
  address: string;          // IR value ID
  line: number;
  column: number;
  file: string;
}
```

### Optimization Metadata

```typescript
interface CIROptimizationMetadata {
  // Hot spots
  hotSpots: HotSpot[];
  
  // Inline hints
  inlineHints: InlineHint[];
  
  // Loop hints
  loopHints: LoopHint[];
  
  // Alias analysis
  aliasAnalysis: AliasAnalysisResult;
}

interface HotSpot {
  operationId: string;
  frequency: number;
}

interface InlineHint {
  functionId: string;
  confidence: number;
}

interface LoopHint {
  blockId: string;
  expectedIterations: number;
  unroll: boolean;
}
```

### Security Metadata

```typescript
interface CIRSecurityMetadata {
  // Capabilities
  requiredCapabilities: Capability[];
  
  // Permissions
  requiredPermissions: Permission[];
  
  // Restrictions
  restrictions: Restriction[];
  
  // Sandbox
  sandboxProfile: string;
}
```

---

## 11. Validation

### Structural Validation

```typescript
interface CIRValidationResult {
  valid: boolean;
  errors: CIRValidationError[];
  warnings: CIRValidationWarning[];
}

interface CIRValidationError {
  kind: ValidationErrorKind;
  message: string;
  location: SourceLocation;
}

enum ValidationErrorKind {
  TYPE_MISMATCH = 'type_mismatch',
  UNDEFINED_VALUE = 'undefined_value',
  UNDEFINED_TYPE = 'undefined_type',
  INVALID_OPERATION = 'invalid_operation',
  SSA_VIOLATION = 'ssa_violation',
  CONTROL_FLOW_ERROR = 'control_flow_error',
  MEMORY_ERROR = 'memory_error',
}
```

### Type Checking

```typescript
function checkTypes(module: CIRModule): CIRValidationResult {
  const errors: CIRValidationError[] = [];
  
  // Check function signatures
  for (const func of module.functions.values()) {
    errors.push(...checkFunctionTypes(func));
  }
  
  // Check operations
  for (const func of module.functions.values()) {
    for (const block of func.basicBlocks) {
      for (const op of block.operations) {
        errors.push(...checkOperationTypes(op));
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

### SSA Validation

```typescript
function checkSSA(module: CIRModule): CIRValidationResult {
  const errors: CIRValidationError[] = [];
  
  // Each value defined exactly once
  const definedValues = new Set<string>();
  
  for (const func of module.functions.values()) {
    for (const block of func.basicBlocks) {
      for (const op of block.operations) {
        if (op.result) {
          if (definedValues.has(op.result.id)) {
            errors.push({
              kind: ValidationErrorKind.SSA_VIOLATION,
              message: `Value ${op.result.id} defined multiple times`,
              location: op.sourceLocation
            });
          }
          definedValues.add(op.result.id);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

### Control Flow Validation

```typescript
function checkControlFlow(module: CIRModule): CIRValidationResult {
  const errors: CIRValidationError[] = [];
  
  for (const func of module.functions.values()) {
    // Check entry block
    if (func.basicBlocks.length === 0) {
      errors.push({
        kind: ValidationErrorKind.CONTROL_FLOW_ERROR,
        message: 'Function has no basic blocks',
        location: { file: '', line: 0, column: 0 }
      });
    }
    
    // Check terminators
    for (const block of func.basicBlocks) {
      const lastOp = block.operations[block.operations.length - 1];
      if (!isTerminator(lastOp)) {
        errors.push({
          kind: ValidationErrorKind.CONTROL_FLOW_ERROR,
          message: `Block ${block.id} does not end with terminator`,
          location: block.sourceLocation
        });
      }
    }
    
    // Check successor references
    for (const block of func.basicBlocks) {
      for (const succId of block.successors) {
        if (!func.basicBlocks.find(b => b.id === succId)) {
          errors.push({
            kind: ValidationErrorKind.CONTROL_FLOW_ERROR,
            message: `Invalid successor reference: ${succId}`,
            location: block.sourceLocation
          });
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

---

## 12. Optimization

### Constant Folding

```typescript
function constantFold(op: CIROperation): CIROperation | null {
  if (!isAllConstants(op.operands)) {
    return null;
  }
  
  switch (op.opcode) {
    case ArithmeticOpcode.ADD:
      return foldAdd(op);
    case ArithmeticOpcode.SUB:
      return foldSub(op);
    case ArithmeticOpcode.MUL:
      return foldMul(op);
    default:
      return null;
  }
}

function foldAdd(op: CIROperation): CIROperation {
  const left = op.operands[0].constantValue;
  const right = op.operands[1].constantValue;
  const result = left + right;
  
  return {
    ...op,
    operands: [],
    result: {
      id: generateUUID(),
      name: `const_${result}`,
      type: op.type,
      isConstant: true,
      constantValue: result
    }
  };
}
```

### Dead Code Elimination

```typescript
function eliminateDeadCode(module: CIRModule): CIRModule {
  for (const func of module.functions.values()) {
    // Mark live values
    const liveValues = markLiveValues(func);
    
    // Remove dead operations
    for (const block of func.basicBlocks) {
      block.operations = block.operations.filter(op => {
        if (op.result) {
          return liveValues.has(op.result.id);
        }
        return true; // Keep operations without results (terminators, stores)
      });
    }
  }
  
  return module;
}

function markLiveValues(func: CIRFunction): Set<string> {
  const live = new Set<string>();
  const worklist: CIRValue[] = [];
  
  // Add return values
  for (const block of func.basicBlocks) {
    const term = block.operations[block.operations.length - 1];
    if (term.opcode === TerminatorOpcode.RET && term.operands[0]) {
      worklist.push(term.operands[0]);
    }
  }
  
  // Process worklist
  while (worklist.length > 0) {
    const value = worklist.pop()!;
    if (live.has(value.id)) continue;
    live.add(value.id);
    
    if (value.definingOp) {
      for (const operand of value.definingOp.operands) {
        worklist.push(operand);
      }
    }
  }
  
  return live;
}
```

### Common Subexpression Elimination

```typescript
function eliminateCommonSubexpressions(module: CIRModule): CIRModule {
  for (const func of module.functions.values()) {
    const valueMap = new Map<string, CIRValue>();
    
    for (const block of func.basicBlocks) {
      for (const op of block.operations) {
        if (!op.result) continue;
        
        const key = computeOperationKey(op);
        if (valueMap.has(key)) {
          // Replace with existing value
          const existing = valueMap.get(key)!;
          op.result = existing;
          replaceUses(op.result, existing);
        } else {
          valueMap.set(key, op.result);
        }
      }
    }
  }
  
  return module;
}

function computeOperationKey(op: CIROperation): string {
  const parts = [op.opcode, op.type.id];
  for (const operand of op.operands) {
    parts.push(operand.id);
  }
  return parts.join('|');
}
```

### Inline Expansion

```typescript
function inlineFunctions(module: CIRModule): CIRModule {
  for (const func of module.functions.values()) {
    for (const block of func.basicBlocks) {
      for (let i = 0; i < block.operations.length; i++) {
        const op = block.operations[i];
        
        if (shouldInline(op)) {
          const inlined = inlineCall(op, module);
          block.operations.splice(i, 1, ...inlined);
          i += inlined.length - 1;
        }
      }
    }
  }
  
  return module;
}

function shouldInline(op: CIROperation): boolean {
  if (op.opcode !== 'call') return false;
  
  const func = op.operands[0] as CIRFunction;
  
  // Check attributes
  if (func.attributes.includes(FunctionAttribute.NO_INLINE)) {
    return false;
  }
  
  if (func.attributes.includes(FunctionAttribute.ALWAYS_INLINE)) {
    return true;
  }
  
  // Check size
  if (countInstructions(func) > 10) {
    return false;
  }
  
  return true;
}
```

---

## 13. Lowering

### Lowering to Bytecode

```typescript
function lowerToBytecode(module: CIRModule): Bytecode {
  const bytecode: Bytecode = {
    header: createBytecodeHeader(),
    constantPool: createConstantPool(),
    metadata: createMetadata(),
    code: [],
    debug: createDebugInfo()
  };
  
  // Lower functions
  for (const func of module.functions.values()) {
    const code = lowerFunction(func);
    bytecode.code.push(...code);
  }
  
  // Lower globals
  for (const global of module.globals.values()) {
    lowerGlobal(global, bytecode);
  }
  
  return bytecode;
}

function lowerFunction(func: CIRFunction): Uint8Array[] {
  const code: Uint8Array[] = [];
  
  for (const block of func.basicBlocks) {
    for (const op of block.operations) {
      code.push(lowerOperation(op));
    }
  }
  
  return code;
}

function lowerOperation(op: CIROperation): Uint8Array {
  const encoder = new BytecodeEncoder();
  
  // Map CIR opcode to bytecode opcode
  const bytecodeOpcode = mapOpcode(op.opcode);
  
  // Encode operands
  const operands = op.operands.map(o => lowerOperand(o));
  
  // Encode instruction
  encoder.writeUint32(bytecodeOpcode);
  for (const operand of operands) {
    encoder.encodeOperand(operand);
  }
  
  return encoder.getBuffer();
}
```

### Type Lowering

```typescript
function lowerType(type: CIRType): string {
  switch (type.kind) {
    case TypeKind.VOID:
      return 'V';
    case TypeKind.BOOLEAN:
      return 'Z';
    case TypeKind.INTEGER:
      return type.signed ? 'I' : 'J';
    case TypeKind.FLOAT:
      return type.width === 32 ? 'F' : 'D';
    case TypeKind.STRING:
      return 'Ljava/lang/String;';
    case TypeKind.ARRAY:
      return `[${lowerType((type as CIRArrayType).elementType)}`;
    case TypeKind.STRUCT:
      return `L${type.name};`;
    case TypeKind.POINTER:
      return 'J';
    case TypeKind.OBSERVATION:
      return 'Lcognitive/Observation;';
    case TypeKind.REASONING:
      return 'Lcognitive/Reasoning;';
    case TypeKind.KNOWLEDGE:
      return 'Lcognitive/Knowledge;';
    default:
      throw new Error(`Unknown type kind: ${type.kind}`);
  }
}
```

### Value Lowering

```typescript
function lowerOperand(value: CIRValue): Operand {
  if (value.isConstant) {
    return {
      type: 'constant',
      value: value.constantValue,
      size: 8,
      alignment: 8
    };
  }
  
  if (value.isParameter) {
    return {
      type: 'register',
      value: `r${value.parameterIndex + 1}`,
      size: 8,
      alignment: 8
    };
  }
  
  // Regular SSA value - assign to register
  return {
    type: 'register',
    value: `r${getRegisterIndex(value)}`,
    size: 8,
    alignment: 8
  };
}
```

---

## 14. Serialization

### Binary Format

CIR can be serialized to a binary format for efficient storage and transmission:

```typescript
interface CIRBinaryHeader {
  magic: Uint8Array;         // Magic number "CIRIR   "
  version: uint32;           // Format version
  moduleSize: uint64;        // Module data size
  metadataSize: uint64;      // Metadata size
  debugSize: uint64;         // Debug info size
}
```

### Text Format

CIR can also be serialized to a human-readable text format:

```
; Module definition
module "example" version "1.0.0"

; Type definitions
type %int = i32
type %float = f64
type %string = string

; Function definition
define @add(%int %a, %int %b) -> %int {
entry:
  %result = add %a, %b
  ret %result
}

; Global variable
global @counter : %int = 0
```

### JSON Format

CIR can be serialized to JSON for interoperability:

```typescript
interface CIRJSONModule {
  id: string;
  name: string;
  version: string;
  functions: CIRJSONFunction[];
  globals: CIRJSONGlobal[];
  types: CIRJSONType[];
  metadata: CIRJSONMetadata;
}
```

---

## 15. Interfaces

### CIR Builder Interface

```typescript
interface CIRBuilder {
  // Module
  createModule(name: string, version: string): CIRModule;
  
  // Types
  createVoidType(): CIRVoidType;
  createIntegerType(width: number, signed: boolean): CIRIntegerType;
  createFloatType(width: number): CIRFloatType;
  createArrayType(elementType: CIRType, size: number): CIRArrayType;
  createStructType(fields: StructField[]): CIRStructType;
  createPointerType(pointeeType: CIRType): CIRPointerType;
  
  // Functions
  createFunction(name: string, signature: CIRFunctionSignature): CIRFunction;
  
  // Basic blocks
  createBasicBlock(name: string): CIRBasicBlock;
  
  // Operations
  createAdd(left: CIRValue, right: CIRValue): CIROperation;
  createSub(left: CIRValue, right: CIRValue): CIROperation;
  createMul(left: CIRValue, right: CIRValue): CIROperation;
  createLoad(pointer: CIRValue): CIROperation;
  createStore(value: CIRValue, pointer: CIRValue): CIROperation;
  createCall(function: CIRFunction, args: CIRValue[]): CIROperation;
  createRet(value?: CIRValue): CIROperation;
  createBr(target: CIRBasicBlock): CIROperation;
  createCondBr(cond: CIRValue, trueBlock: CIRBasicBlock, falseBlock: CIRBasicBlock): CIROperation;
  
  // Cognitive operations
  createObserveInit(config: CIRValue): CIROperation;
  createReasonDeduce(context: CIRValue, premises: CIRValue, method: CIRValue): CIROperation;
  createKnowledgeQuery(query: CIRValue, limit: CIRValue): CIROperation;
}
```

### CIR Analyzer Interface

```typescript
interface CIRAnalyzer {
  // Validation
  validate(module: CIRModule): CIRValidationResult;
  checkTypes(module: CIRModule): CIRValidationResult;
  checkSSA(module: CIRModule): CIRValidationResult;
  checkControlFlow(module: CIRModule): CIRValidationResult;
  
  // Analysis
  analyzeDataFlow(module: CIRModule): DataFlowAnalysis;
  analyzeControlFlow(module: CIRModule): ControlFlowAnalysis;
  analyzeAlias(module: CIRModule): AliasAnalysis;
  analyzeMemory(module: CIRModule): MemoryAnalysis;
  
  // Metrics
  countInstructions(module: CIRModule): number;
  countFunctions(module: CIRModule): number;
  estimateComplexity(module: CIRModule): number;
}
```

### CIR Optimizer Interface

```typescript
interface CIROptimizer {
  // Optimizations
  constantFold(module: CIRModule): CIRModule;
  eliminateDeadCode(module: CIRModule): CIRModule;
  eliminateCommonSubexpressions(module: CIRModule): CIRModule;
  inlineFunctions(module: CIRModule): CIRModule;
  propagateConstants(module: CIRModule): CIRModule;
  simplifyCFG(module: CIRModule): CIRModule;
  
  // Optimization passes
  runPass(module: CIRModule, pass: OptimizationPass): CIRModule;
  runAllPasses(module: CIRModule): CIRModule;
}
```

### CIR Lowerer Interface

```typescript
interface CIRLowerer {
  // Lowering
  lowerToBytecode(module: CIRModule): Bytecode;
  lowerToAssembly(module: CIRModule): string;
  lowerToMachineCode(module: CIRModule): Uint8Array;
  
  // Target-specific
  setTarget(target: TargetTriple): void;
  getTarget(): TargetTriple;
}
```

---

## 16. Examples

### Example 1: Simple Function

```typescript
// Create module
const builder = new CIRBuilder();
const module = builder.createModule('example', '1.0.0');

// Define types
const intType = builder.createIntegerType(32, true);
const floatType = builder.createFloatType(64);

// Define function
const addFunc = builder.createFunction('add', {
  parameters: [intType, intType],
  returnType: intType,
  variadic: false,
  callingConvention: CallingConvention.COGNITIVE
});

// Create basic block
const entryBlock = builder.createBasicBlock('entry');
addFunc.basicBlocks.push(entryBlock);

// Create parameters
const paramA = builder.createParameter('a', intType, 0);
const paramB = builder.createParameter('b', intType, 1);

// Create add operation
const addOp = builder.createAdd(paramA, paramB);
entryBlock.operations.push(addOp);

// Create return operation
const retOp = builder.createRet(addOp.result);
entryBlock.operations.push(retOp);

// Add function to module
module.functions.set('add', addFunc);
```

### Example 2: Cognitive Operation

```typescript
// Create observation function
const observeFunc = builder.createFunction('observe_data', {
  parameters: [intType],
  returnType: intType,
  variadic: false,
  callingConvention: CallingConvention.COGNITIVE
});

const entryBlock = builder.createBasicBlock('entry');
observeFunc.basicBlocks.push(entryBlock);

// Create observation config
const configType = builder.createStructType([
  { name: 'source', type: builder.createStringType(), offset: 0 },
  { name: 'filter', type: builder.createStringType(), offset: 8 }
]);

const config = builder.createConstant(configType, {
  source: 'sensor',
  filter: 'temperature'
});

// Initialize observation
const initOp = builder.createObserveInit(config);
entryBlock.operations.push(initOp);

// Collect observations
const collectOp = builder.createObserveCollect(initOp.result, builder.createConstant(intType, 10));
entryBlock.operations.push(collectOp);

// Return count
const retOp = builder.createRet(collectOp.result);
entryBlock.operations.push(retOp);
```

### Example 3: Reasoning Chain

```typescript
// Create reasoning function
const reasonFunc = builder.createFunction('reason', {
  parameters: [builder.createStringType()],
  returnType: builder.createStringType(),
  variadic: false,
  callingConvention: CallingConvention.COGNITIVE
});

const entryBlock = builder.createBasicBlock('entry');
reasonFunc.basicBlocks.push(entryBlock);

// Initialize reasoning
const initOp = builder.createReasonInit(builder.createConstant(builder.createStringType(), 'deductive'));
entryBlock.operations.push(initOp);

// Load premises (simulated)
const premises = builder.createConstant(builder.createArrayType(builder.createStringType(), 3), [
  'All humans are mortal',
  'Socrates is human',
  ''
]);

// Perform deduction
const deduceOp = builder.createReasonDeduce(initOp.result, premises, builder.createConstant(builder.createStringType(), 'syllogism'));
entryBlock.operations.push(deduceOp);

// Return conclusion
const retOp = builder.createRet(deduceOp.result);
entryBlock.operations.push(retOp);
```

---

## 17. Reference Implementation

### CIR Builder Implementation

```typescript
class CIRBuilderImpl implements CIRBuilder {
  private module: CIRModule;
  private currentFunction: CIRFunction | null = null;
  private currentBlock: CIRBasicBlock | null = null;
  private valueCounter = 0;
  
  constructor(name: string, version: string) {
    this.module = {
      id: generateUUID(),
      name,
      version,
      functions: new Map(),
      globals: new Map(),
      types: new Map(),
      metadata: {
        author: '',
        description: '',
        license: '',
        sourceLanguage: '',
        compilerVersion: '',
        compilationFlags: [],
        targetTriple: '',
        targetFeatures: [],
        custom: new Map()
      }
    };
  }
  
  createModule(name: string, version: string): CIRModule {
    return this.module;
  }
  
  createVoidType(): CIRVoidType {
    const type: CIRVoidType = {
      id: generateUUID(),
      name: 'void',
      kind: TypeKind.VOID
    };
    this.module.types.set(type.id, type);
    return type;
  }
  
  createIntegerType(width: number, signed: boolean): CIRIntegerType {
    const type: CIRIntegerType = {
      id: generateUUID(),
      name: `i${width}`,
      kind: TypeKind.INTEGER,
      width,
      signed
    };
    this.module.types.set(type.id, type);
    return type;
  }
  
  createFloatType(width: number): CIRFloatType {
    const type: CIRFloatType = {
      id: generateUUID(),
      name: `f${width}`,
      kind: TypeKind.FLOAT,
      width
    };
    this.module.types.set(type.id, type);
    return type;
  }
  
  createArrayType(elementType: CIRType, size: number): CIRArrayType {
    const type: CIRArrayType = {
      id: generateUUID(),
      name: `array_${elementType.id}_${size}`,
      kind: TypeKind.ARRAY,
      elementType,
      size
    };
    this.module.types.set(type.id, type);
    return type;
  }
  
  createStructType(fields: StructField[]): CIRStructType {
    const type: CIRStructType = {
      id: generateUUID(),
      name: `struct_${generateUUID()}`,
      kind: TypeKind.STRUCT,
      fields
    };
    this.module.types.set(type.id, type);
    return type;
  }
  
  createPointerType(pointeeType: CIRType): CIRPointerType {
    const type: CIRPointerType = {
      id: generateUUID(),
      name: `ptr_${pointeeType.id}`,
      kind: TypeKind.POINTER,
      pointeeType,
      addressSpace: 0
    };
    this.module.types.set(type.id, type);
    return type;
  }
  
  createFunction(name: string, signature: CIRFunctionSignature): CIRFunction {
    const func: CIRFunction = {
      id: generateUUID(),
      name,
      linkage: LinkageType.PUBLIC,
      signature,
      parameters: signature.parameters.map((type, i) => ({
        id: generateUUID(),
        name: `param_${i}`,
        type,
        isConstant: false,
        isParameter: true,
        parameterIndex: i
      })),
      returnType: signature.returnType,
      basicBlocks: [],
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    this.module.functions.set(func.id, func);
    this.currentFunction = func;
    return func;
  }
  
  createBasicBlock(name: string): CIRBasicBlock {
    if (!this.currentFunction) {
      throw new Error('No current function');
    }
    
    const block: CIRBasicBlock = {
      id: generateUUID(),
      name,
      operations: [],
      predecessors: [],
      successors: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    this.currentFunction.basicBlocks.push(block);
    this.currentBlock = block;
    return block;
  }
  
  private createValue(type: CIRType): CIRValue {
    return {
      id: generateUUID(),
      name: `v${this.valueCounter++}`,
      type,
      isConstant: false,
      uses: []
    };
  }
  
  createAdd(left: CIRValue, right: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const result = this.createValue(left.type);
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: ArithmeticOpcode.ADD,
      operands: [left, right],
      result,
      type: left.type,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    result.definingOp = op;
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createSub(left: CIRValue, right: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const result = this.createValue(left.type);
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: ArithmeticOpcode.SUB,
      operands: [left, right],
      result,
      type: left.type,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    result.definingOp = op;
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createMul(left: CIRValue, right: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const result = this.createValue(left.type);
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: ArithmeticOpcode.MUL,
      operands: [left, right],
      result,
      type: left.type,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    result.definingOp = op;
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createLoad(pointer: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const pointeeType = (pointer.type as CIRPointerType).pointeeType;
    const result = this.createValue(pointeeType);
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: MemoryOpcode.LOAD,
      operands: [pointer],
      result,
      type: pointeeType,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    result.definingOp = op;
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createStore(value: CIRValue, pointer: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: MemoryOpcode.STORE,
      operands: [value, pointer],
      result: undefined,
      type: this.createVoidType(),
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createCall(function: CIRFunction, args: CIRValue[]): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const result = function.returnType.kind !== TypeKind.VOID 
      ? this.createValue(function.returnType)
      : undefined;
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: 'call',
      operands: [function as any, ...args],
      result,
      type: function.returnType,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    if (result) {
      result.definingOp = op;
    }
    
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createRet(value?: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: TerminatorOpcode.RET,
      operands: value ? [value] : [],
      result: undefined,
      type: this.createVoidType(),
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createBr(target: CIRBasicBlock): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: TerminatorOpcode.BR,
      operands: [target as any],
      result: undefined,
      type: this.createVoidType(),
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    this.currentBlock.operations.push(op);
    this.currentBlock.successors.push(target.id);
    target.predecessors.push(this.currentBlock.id);
    return op;
  }
  
  createCondBr(cond: CIRValue, trueBlock: CIRBasicBlock, falseBlock: CIRBasicBlock): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: TerminatorOpcode.COND_BR,
      operands: [cond, trueBlock as any, falseBlock as any],
      result: undefined,
      type: this.createVoidType(),
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    this.currentBlock.operations.push(op);
    this.currentBlock.successors.push(trueBlock.id, falseBlock.id);
    trueBlock.predecessors.push(this.currentBlock.id);
    falseBlock.predecessors.push(this.currentBlock.id);
    return op;
  }
  
  createObserveInit(config: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const obsType: CIRObservationType = {
      id: generateUUID(),
      name: 'observation',
      kind: TypeKind.OBSERVATION,
      schema: 'default'
    };
    
    const result = this.createValue(obsType);
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: CognitiveOpcode.OBSERVE_INIT,
      operands: [config],
      result,
      type: obsType,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    result.definingOp = op;
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createReasonDeduce(context: CIRValue, premises: CIRValue, method: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const reasonType: CIRReasoningType = {
      id: generateUUID(),
      name: 'reasoning',
      kind: TypeKind.REASONING,
      method: 'deductive'
    };
    
    const result = this.createValue(reasonType);
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: CognitiveOpcode.REASON_DEDUCE,
      operands: [context, premises, method],
      result,
      type: reasonType,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    result.definingOp = op;
    this.currentBlock.operations.push(op);
    return op;
  }
  
  createKnowledgeQuery(query: CIRValue, limit: CIRValue): CIROperation {
    if (!this.currentBlock) {
      throw new Error('No current block');
    }
    
    const knowledgeType: CIRKnowledgeType = {
      id: generateUUID(),
      name: 'knowledge',
      kind: TypeKind.KNOWLEDGE,
      domain: 'general'
    };
    
    const result = this.createValue(knowledgeType);
    
    const op: CIROperation = {
      id: generateUUID(),
      opcode: CognitiveOpcode.KNOWLEDGE_QUERY,
      operands: [query, limit],
      result,
      type: knowledgeType,
      attributes: [],
      annotations: [],
      sourceLocation: { file: '', line: 0, column: 0 }
    };
    
    result.definingOp = op;
    this.currentBlock.operations.push(op);
    return op;
  }
  
  getModule(): CIRModule {
    return this.module;
  }
}
```

---

## Version History

**Version 1.0.0** (2024-01-23)
- Initial release
- Complete IR structure definition
- Type system with cognitive types
- Value representation (SSA)
- Control flow representation
- Operation definitions
- Function and module structure
- Metadata and debug information
- Validation framework
- Optimization passes
- Lowering to bytecode
- Serialization formats
- Reference builder implementation
