# CBS-012: Linker

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the linker in Cognitive Bytecode

---

## Purpose

The linker links multiple bytecode modules together, resolving external references and creating an executable.

---

## Linking Process

### Link Sequence
```
1. Load all modules
2. Collect external references
3. Resolve external references
4. Apply relocations
5. Optimize linked code
6. Generate executable
7. Verify executable
```

---

## Linker Operations

### LINK_MODULES
Link multiple modules into an executable.

```
LINK_MODULES <module_ids> -> <executable_id>
```

### RESOLVE_SYMBOL
Resolve an external symbol.

```
RESOLVE_SYMBOL <symbol> -> <address>
```

### APPLY_RELOCATION
Apply a relocation.

```
APPLY_RELOCATION <relocation>
```

---

## Relocation Types

### Absolute Relocation
Relocate to absolute address.

```
RELOC_ABSOLUTE <offset>, <symbol>
```

### Relative Relocation
Relocate to relative address.

```
RELOC_RELATIVE <offset>, <symbol>
```

### GOT Relocation
Relocate to Global Offset Table.

```
RELOC_GOT <offset>, <symbol>
```

---

## Linker Operations Encoding

### LINK_MODULES
```
Opcode: 0x90
Operands: 1 (module_ids)
Encoding: 90 01 04 <module_ids>
```

### RESOLVE_SYMBOL
```
Opcode: 0x91
Operands: 1 (symbol)
Encoding: 91 01 04 <symbol>
```

### APPLY_RELOCATION
```
Opcode: 0x92
Operands: 1 (relocation)
Encoding: 92 01 04 <relocation>
```

---

## Linker Safety

### Symbol Resolution
All symbols must be resolved.

### Circular Dependencies
Circular dependencies are detected.

### Memory Layout
Memory layout is verified.

### Export/Import Consistency
Export/import consistency is verified.
