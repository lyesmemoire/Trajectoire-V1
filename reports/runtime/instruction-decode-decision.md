# InstructionDecode Decision

**Composant:** instruction-decode  
**Fichier:** compiler/cvm/instruction-decode.ts  
**Date:** 2026-07-27T00:50:00Z

---

## Décision

**Type A - Atteignable**

La branche non couverte (ligne 66) est atteignable et représente un cas d'erreur légitime. Un test doit être ajouté pour couvrir ce cas.

---

## Justification

### Preuve d'Atteignabilité

**Théorème:** La branche `true` de la ligne 66 est atteignable.

**Preuve:**
1. Pour atteindre la ligne 66, il faut que `opcodeInfo` ne soit pas null (ligne 60)
2. Si `opcodeInfo` n'est pas null, l'opcode existe dans `OpcodeTable`
3. `InstructionTable.getEncoding(opcode)` peut retourner `null` si l'encodage n'est pas défini
4. Il est possible qu'un opcode existe dans `OpcodeTable` mais pas dans `InstructionTable` (incohérence)
5. Donc `encoding` peut être `null`
6. Donc `!encoding` peut être vrai
7. Donc la branche `true` est atteignable

**QED.**

---

## Action

**Ajouter un test pour couvrir le cas où l'encodage n'est pas défini.**

### Test à ajouter

```typescript
it('should validate instruction with missing encoding', () => {
  const decoder = new InstructionDecode();
  const instruction = { opcode: 0xFF, operands: [] } as Instruction;

  // Mock OpcodeTable.getInfo to return valid opcodeInfo
  const mockGetInfo = vi.spyOn(OpcodeTable, 'getInfo').mockReturnValue({
    name: 'TEST',
    isBranch: false,
    isCall: false,
    isReturn: false,
    isTerminator: false,
    stackEffect: 0
  });

  // Mock InstructionTable.getEncoding to return null
  const mockGetEncoding = vi.spyOn(InstructionTable, 'getEncoding').mockReturnValue(null);

  const result = decoder.validate(instruction);

  expect(result.valid).toBe(false);
  expect(result.errors).toContain('No encoding for opcode: 255');

  mockGetInfo.mockRestore();
  mockGetEncoding.mockRestore();
});
```

### Test pour operand count mismatch (lignes 67-68)

```typescript
it('should validate instruction with operand count mismatch', () => {
  const decoder = new InstructionDecode();
  const instruction = { opcode: 0x00, operands: [1, 2, 3] } as Instruction;

  // Mock OpcodeTable.getInfo to return valid opcodeInfo
  const mockGetInfo = vi.spyOn(OpcodeTable, 'getInfo').mockReturnValue({
    name: 'TEST',
    isBranch: false,
    isCall: false,
    isReturn: false,
    isTerminator: false,
    stackEffect: 0
  });

  // Mock InstructionTable.getEncoding to return encoding with 2 operands
  const mockGetEncoding = vi.spyOn(InstructionTable, 'getEncoding').mockReturnValue({
    operandTypes: ['number', 'number']
  });

  const result = decoder.validate(instruction);

  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Operand count mismatch: expected 2, got 3');

  mockGetInfo.mockRestore();
  mockGetEncoding.mockRestore();
});
```

---

## Impact

- **API publique:** Aucun changement
- **Comportement:** Aucun changement
- **Couverture:** Passera de 92.86% à 100% pour les branches, et de 94.44% à 100% pour les statements
- **Tests:** 2 tests à ajouter

---

## Validation

Après ajout des tests:
1. Exécuter `pnpm vitest`
2. Exécuter `pnpm vitest --coverage`
3. Exécuter `pnpm build`
4. Exécuter `pnpm tsc --noEmit`

---

## Certification

Après ajout des tests, le composant devrait atteindre:
- Statements: 100.00%
- Branches: 100.00%
- Functions: 100.00%
- Lines: 100.00%

**Statut final attendu:** CERTIFIED
