# CIR-008: Metadata

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Metadata structure in Cognitive Intermediate Representation

---

## Purpose

Metadata provides additional information about CIR elements for optimization, debugging, and analysis. Metadata is not part of the executable code but is essential for tooling.

---

## Metadata Structure

```typescript
interface CIRMetadata {
  source?: {
    file: string;
    line: number;
    column: number;
  };
  debug?: {
    name: string;
    type: string;
  };
  optimization?: {
    level: number;
    passes: string[];
  };
  cognitive?: {
    type: string;
    confidence: number;
    cost: number;
  };
  runtime?: {
    latency: number;
    memory: number;
    tokens: number;
  };
  custom?: Map<string, any>;
}
```

---

## Metadata Types

### Source Metadata
Source location information.

```cir
metadata {
    source = {
        file = "example.blueprint";
        line = 42;
        column = 10;
    };
}
```

### Debug Metadata
Debug information for debugging tools.

```cir
metadata {
    debug = {
        name = "add_operation";
        type = "arithmetic";
    };
}
```

### Optimization Metadata
Optimization information for the optimizer.

```cir
metadata {
    optimization = {
        level = 3;
        passes = ["constant_folding", "inlining"];
    };
}
```

### Cognitive Metadata
Cognitive-specific metadata.

```cir
metadata {
    cognitive = {
        type = "reasoning";
        confidence = 0.95;
        cost = 100;
    };
}
```

### Runtime Metadata
Runtime performance estimates.

```cir
metadata {
    runtime = {
        latency = 50;  // milliseconds
        memory = 1024; // bytes
        tokens = 100;  // tokens
    };
}
```

---

## Metadata Properties

### Source
Source file location (file, line, column).

### Debug
Debug information (name, type).

### Optimization
Optimization level and passes applied.

### Cognitive
Cognitive type, confidence, and cost.

### Runtime
Estimated runtime characteristics (latency, memory, tokens).

### Custom
Custom key-value pairs for tool-specific metadata.

---

## Metadata Creation

```cir
%1: i32 = add %a, %b;
metadata {
    source = {
        file = "example.blueprint";
        line = 42;
    };
    debug = {
        name = "add";
    };
    runtime = {
        latency = 1;
        memory = 8;
    };
}
```

---

## Metadata Validation

Metadata must satisfy the following validation rules:

1. **Type Consistency**: Metadata types must match element types
2. **Source Validity**: Source location must be valid
3. **Debug Completeness**: Required debug fields must be present
4. **Optimization Validity**: Optimization passes must be valid
5. **Cognitive Validity**: Cognitive metadata must be within valid ranges

---

## Metadata Optimization

Metadata can be optimized through:

1. **Metadata Compression**: Compress metadata for storage
2. **Metadata Deduplication**: Remove duplicate metadata
3. **Metadata Inheritance**: Inherit metadata from parent elements
4. **Metadata Stripping**: Remove metadata for production builds

---

## Serialization

### Text Format
```cir
metadata {
    <key> = <value>;
}
```

### Binary Format
```binary
[source_present: 1 byte]
[source: variable if present]
[debug_present: 1 byte]
[debug: variable if present]
[optimization_present: 1 byte]
[optimization: variable if present]
[cognitive_present: 1 byte]
[cognitive: variable if present]
[runtime_present: 1 byte]
[runtime: variable if present]
[custom_count: 4 bytes]
[custom: custom_count * variable]
```
