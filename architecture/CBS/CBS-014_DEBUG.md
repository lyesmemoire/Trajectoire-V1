# CBS-014: Debug

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the debug information in Cognitive Bytecode

---

## Purpose

Debug information enables source-level debugging, profiling, and analysis of bytecode execution.

---

## Debug Information Types

### Source Mapping
Map bytecode instructions to source locations.

```typescript
interface SourceMapping {
  instructionOffset: number;
  sourceFile: string;
  sourceLine: number;
  sourceColumn: number;
}
```

### Variable Information
Information about variables.

```typescript
interface VariableInfo {
  name: string;
  type: string;
  register: number;
  scope: string;
  lifetime: [number, number];  // [start, end]
}
```

### Function Information
Information about functions.

```typescript
interface FunctionInfo {
  name: string;
  startOffset: number;
  endOffset: number;
  parameters: VariableInfo[];
  locals: VariableInfo[];
}
```

### Line Number Table
Line number information for debugging.

```typescript
interface LineNumberEntry {
  address: number;
  line: number;
  column: number;
}
```

---

## Debug Operations

### DEBUG_BREAK
Insert a breakpoint.

```
DEBUG_BREAK
```

### DEBUG_TRACE
Trace execution.

```
DEBUG_TRACE <message>
```

### DEBUG_PRINT
Print debug information.

```
DEBUG_PRINT <value>
```

### DEBUG_WATCH
Watch a variable.

```
DEBUG_WATCH <variable>
```

---

## Debug Information Encoding

### Debug Section
```binary
[debug_magic: 4 bytes]     // "DBG\0"
[version: 4 bytes]
[source_mapping_count: 4 bytes]
[source_mappings: source_mapping_count * variable]
[variable_info_count: 4 bytes]
[variable_infos: variable_info_count * variable]
[function_info_count: 4 bytes]
[function_infos: function_info_count * variable]
[line_number_count: 4 bytes]
[line_numbers: line_number_count * variable]
```

### Source Mapping Entry
```binary
[instruction_offset: 4 bytes]
[source_file_length: 4 bytes]
[source_file: source_file_length bytes]
[source_line: 4 bytes]
[source_column: 4 bytes]
```

---

## Debug Operations Encoding

### DEBUG_BREAK
```
Opcode: 0xA0
Operands: 0
Encoding: A0 00
```

### DEBUG_TRACE
```
Opcode: 0xA1
Operands: 1 (message)
Encoding: A1 01 04 <message>
```

### DEBUG_PRINT
```
Opcode: 0xA2
Operands: 1 (value)
Encoding: A2 01 <value>
```

### DEBUG_WATCH
```
Opcode: 0xA3
Operands: 1 (variable)
Encoding: A3 01 04 <variable>
```

---

## Debug Features

### Breakpoints
Set breakpoints at specific instructions.

### Step Execution
Step through execution instruction by instruction.

### Variable Inspection
Inspect variable values at runtime.

### Call Stack
View the current call stack.

### Source Mapping
Map bytecode to source code.

### Profiling
Profile execution time and memory usage.

---

## Debug Safety

### Performance Impact
Debug information has minimal performance impact when disabled.

### Memory Overhead
Debug information increases memory usage.

### Security
Debug information can be stripped for production builds.
