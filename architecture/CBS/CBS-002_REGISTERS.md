# CBS-002: Registers

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the register file in Cognitive Bytecode

---

## Purpose

The register file provides fast access to frequently used values. CBS uses a register-based architecture for performance.

---

## Register Types

### General Purpose Registers (R0-R31)
32 general purpose registers for arbitrary use.

```
R0-R31: General purpose (32-bit or 64-bit)
```

### Special Purpose Registers
Special registers for specific purposes.

```
FP: Frame pointer
SP: Stack pointer
PC: Program counter
FLAGS: Condition flags
```

### Cognitive Registers
Registers for cognitive operations.

```
CR0-CR7: Cognitive registers (observation, perception, evidence, confidence, knowledge, belief, hypothesis, reasoning)
```

---

## Register Encoding

### General Purpose Register
```binary
[0x01: 1 byte]  // Register marker
[reg: 1 byte]   // Register number (0-31)
```

### Special Purpose Register
```binary
[0x02: 1 byte]  // Special register marker
[reg: 1 byte]   // Register number (0-3)
```

### Cognitive Register
```binary
[0x03: 1 byte]  // Cognitive register marker
[reg: 1 byte]   // Register number (0-7)
```

---

## Register Width

Registers support multiple widths:

- **8-bit**: i8, u8
- **16-bit**: i16, u16
- **32-bit**: i32, u32, f32
- **64-bit**: i64, u64, f64

---

## Register Aliases

Common register aliases for convenience:

```
A = R0
B = R1
C = R2
D = R3
```

---

## Register Preservation

Calling convention:

- **Caller-saved**: R0-R7 (may be modified by callee)
- **Callee-saved**: R8-R15 (must be preserved by callee)
