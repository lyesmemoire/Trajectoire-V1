# InstructionDecode Branch Analysis

**Composant:** instruction-decode  
**Fichier:** compiler/cvm/instruction-decode.ts  
**Date:** 2026-07-27T00:50:00Z

---

## Branches Non Couvertes

### Branche 2 (Ligne 66)

**Emplacement:** Méthode `validate()`  
**Condition:** `if (!encoding)`  
**Sous-branche non couverte:** `true` (quand `encoding` est null)  
**Hits:** `[0, 3]` (0 hit pour true, 3 hits pour false)

---

## Code Source

```typescript
public validate(instruction: Instruction): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const opcode = instruction.opcode as Opcode;
  const opcodeInfo = OpcodeTable.getInfo(opcode);

  if (!opcodeInfo) {
    errors.push(`Unknown opcode: ${opcode}`);
    return { valid: false, errors };
  }

  const encoding = InstructionTable.getEncoding(opcode);
  if (!encoding) {
    errors.push(`No encoding for opcode: ${opcode}`);
    return { valid: false, errors };
  }

  if (instruction.operands.length !== encoding.operandTypes.length) {
    errors.push(
      `Operand count mismatch: expected ${encoding.operandTypes.length}, got ${instruction.operands.length}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

## Analyse

### Condition exacte
- `!encoding` est évalué à `true` quand `InstructionTable.getEncoding(opcode)` retourne `null`

### Expression logique
- `InstructionTable.getEncoding(opcode)` peut retourner `null` si l'opcode n'a pas d'encodage défini

### Chemin d'exécution
1. `validate()` est appelé avec une instruction
2. `OpcodeTable.getInfo(opcode)` retourne un opcodeInfo valide
3. `InstructionTable.getEncoding(opcode)` retourne `null`
4. La branche `true` est prise (erreur ajoutée)

### Fonction appelante
- Tests existants dans `tests/vm/decoder/instruction-decode.test.ts`

### Préconditions
- `instruction.opcode` est un opcode valide (déjà vérifié par `OpcodeTable.getInfo`)

### Postconditions
- Si `encoding === null`: erreur "No encoding for opcode" est ajoutée
- Si `encoding !== null`: validation continue

---

## Pourquoi cette branche n'est pas couverte

### Analyse du scénario
Pour atteindre cette branche, il faut:
1. Un opcode valide (reconnu par `OpcodeTable.getInfo`)
2. Mais sans encodage défini dans `InstructionTable.getEncoding`

### Situation possible
C'est possible si:
- L'opcode est défini dans `OpcodeTable` mais pas dans `InstructionTable`
- Il y a une incohérence entre les deux tables

### Conclusion
Cette branche est **atteignable** si l'opcode existe dans `OpcodeTable` mais pas dans `InstructionTable`. C'est un cas d'erreur légitime qui devrait être testé.

---

## Classification

**Type A - Atteignable**

Cette branche est atteignable et représente un cas d'erreur légitime (incohérence entre tables). Un test doit être ajouté pour couvrir ce cas.
