# CBS-005: Heap

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the heap in Cognitive Bytecode

---

## Purpose

The heap provides dynamic memory allocation for objects, arrays, and complex data structures.

---

## Heap Structure

### Heap Layout
```
[Low Addresses]
    [Allocated Blocks]
    [Free Blocks]
[High Addresses]
```

### Heap Block
Each heap block contains:

```
[size: 8 bytes]
[flags: 1 byte]
[data: size bytes]
```

---

## Heap Operations

### ALLOC
Allocate memory on the heap.

```
ALLOC <size> -> <ptr>
```

### FREE
Free allocated memory.

```
FREE <ptr>
```

### REALLOC
Resize allocated memory.

```
REALLOC <ptr>, <new_size> -> <new_ptr>
```

---

## Heap Management

### Allocation Strategy
First-fit allocation strategy for simplicity.

### Garbage Collection
Reference counting for automatic memory management.

### Memory Pooling
Memory pooling for performance optimization.

---

## Heap Safety

### Double Free Detection
Double free is detected and reported.

### Use After Free Detection
Use after free is detected and reported.

### Memory Leak Detection
Memory leaks are tracked and reported.

---

## Heap Operations Encoding

### ALLOC
```
Opcode: 0x32
Operands: 1 (size)
Encoding: 32 01 02 <size>
```

### FREE
```
Opcode: 0x33
Operands: 1 (ptr)
Encoding: 33 01 03 <ptr>
```

### REALLOC
```
Opcode: 0x3A
Operands: 2 (ptr, new_size)
Encoding: 3A 02 03 <ptr> 02 <new_size>
```
