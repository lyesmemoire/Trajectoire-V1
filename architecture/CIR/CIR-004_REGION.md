# CIR-004: Region

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Region structure in Cognitive Intermediate Representation

---

## Purpose

A Region is a hierarchical grouping of blocks for optimization and analysis. Regions enable loop optimizations, parallelization, and cognitive region analysis.

---

## Region Structure

```typescript
interface CIRRegion {
  id: string;              // Unique region identifier
  name: string;            // Region name
  type: RegionType;       // Region type
  blocks: string[];       // Block IDs in the region
  subregions: string[];   // Subregion IDs
  metadata: CIRMetadata;   // Region metadata
}
```

---

## Region Types

### Loop Region
Represents a loop construct.

```cir
region loop_region {
    blocks: [loop_entry, loop_body, loop_exit];
    type: loop;
}
```

### Function Region
Represents an entire function.

```cir
region function_region {
    blocks: [entry, block1, block2, exit];
    type: function;
}
```

### Cognitive Region
Represents a cognitive operation.

```cir
region cognitive_region {
    blocks: [observe, perceive, reason, decide];
    type: cognitive;
}
```

### Parallel Region
Represents a parallelizable region.

```cir
region parallel_region {
    blocks: [task1, task2, task3];
    type: parallel;
}
```

---

## Region Properties

### ID
Unique identifier for the region.

### Name
Human-readable name for the region.

### Type
The type of region (loop, function, cognitive, parallel).

### Blocks
List of block IDs in the region.

### Subregions
List of subregion IDs (for hierarchical regions).

### Metadata
Additional metadata for optimization and debugging.

---

## Region Creation

```cir
region reasoning_loop {
    type: loop;
    blocks: [loop_entry, reasoning_block, loop_condition, loop_exit];
    subregions: [];
    metadata {
        iterations = "unknown";
        parallelizable = false;
    }
}
```

---

## Region Validation

Regions must satisfy the following validation rules:

1. **Unique ID**: Each region ID must be unique within the module
2. **Block Existence**: All blocks must exist
3. **Type Consistency**: Region type must match block structure
4. **No Overlap**: Blocks cannot be in multiple regions at the same level
5. **Hierarchy**: Subregions must be properly nested

---

## Region Optimization

Regions can be optimized through:

1. **Loop Unrolling**: Unroll loop regions
2. **Loop Vectorization**: Vectorize loop regions
3. **Parallelization**: Parallelize parallel regions
4. **Region Fusion**: Merge adjacent regions
5. **Cognitive Optimization**: Optimize cognitive regions

---

## Serialization

### Text Format
```cir
region <name> {
    type: <type>;
    blocks: [<blocks>];
    subregions: [<subregions>];
    metadata {
        <key> = <value>;
    }
}
```

### Binary Format
```binary
[id: 8 bytes]
[name_length: 4 bytes]
[name: name_length bytes]
[type: 4 bytes]
[block_count: 4 bytes]
[blocks: block_count * 8 bytes]
[subregion_count: 4 bytes]
[subregions: subregion_count * 8 bytes]
[metadata_length: 4 bytes]
[metadata: metadata_length bytes]
```
