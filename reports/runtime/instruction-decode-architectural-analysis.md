# InstructionDecode Architectural Analysis

**Composant:** instruction-decode  
**Fichier:** compiler/cvm/instruction-decode.ts  
**Date:** 2026-07-27T00:50:00Z

---

## Branche Non Couverte

### Branche 2 (Ligne 66)

**Emplacement:** Méthode `validate()`  
**Condition:** `if (!encoding)`  
**Sous-branche non couverte:** `true` (quand `encoding` est null)

---

## Investigation

### Invariants

1. **Opcode table invariant:**
   - `OpcodeTable.getInfo(opcode)` retourne des informations sur l'opcode
   - Si l'opcode est inconnu, retourne `null`

2. **Instruction table invariant:**
   - `InstructionTable.getEncoding(opcode)` retourne l'encodage de l'instruction
   - Si l'encodage n'est pas défini, retourne `null`

3. **Table consistency invariant:**
   - Normalement, si un opcode existe dans `OpcodeTable`, il devrait exister dans `InstructionTable`
   - Mais il peut y avoir des incohérences (opcode défini mais sans encodage)

### Call Graph

```
validate() est appelé par:
  - Tests dans tests/vm/decoder/instruction-decode.test.ts

Conditions d'appel:
  - instruction avec un opcode valide
```

### État Mémoire

**État avant appel à `InstructionTable.getEncoding(opcode)`:**
- `opcodeInfo` est non-null (ligne 60-63)
- L'opcode est reconnu par `OpcodeTable`

**État après appel:**
- `encoding` peut être null si l'encodage n'est pas défini dans `InstructionTable`

### Chemins Possibles

**Chemin 1: Opcode inconnu**
```typescript
if (!opcodeInfo) {
  errors.push(`Unknown opcode: ${opcode}`);
  return { valid: false, errors };
}
```
- Si l'opcode est inconnu, la fonction retourne immédiatement
- La branche 66 n'est jamais atteinte

**Chemin 2: Opcode connu, encodage défini**
```typescript
const encoding = InstructionTable.getEncoding(opcode);
if (!encoding) {
  errors.push(`No encoding for opcode: ${opcode}`);
  return { valid: false, errors };
}
```
- Si l'encodage est défini, la branche `false` est prise
- La validation continue

**Chemin 3: Opcode connu, encodage non défini**
```typescript
const encoding = InstructionTable.getEncoding(opcode);
if (!encoding) {
  errors.push(`No encoding for opcode: ${opcode}`);
  return { valid: false, errors };
}
```
- Si l'encodage n'est pas défini, la branche `true` est prise
- Une erreur est ajoutée et la fonction retourne

### Chemins Impossibles

Aucun chemin impossible. La branche est atteignable si:
- L'opcode existe dans `OpcodeTable`
- Mais l'encodage n'existe pas dans `InstructionTable`

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

## Conclusion

La branche `true` de la ligne 66 est **atteignable**. Elle représente un cas d'erreur légitime où un opcode existe dans `OpcodeTable` mais n'a pas d'encodage défini dans `InstructionTable`. C'est une incohérence entre les deux tables qui doit être détectée et signalée.

---

## Recommandation

**Type A - Atteignable**

Ajouter un test qui:
1. Mock `OpcodeTable.getInfo` pour retourner un opcodeInfo valide
2. Mock `InstructionTable.getEncoding` pour retourner `null`
3. Appelle `validate()` et vérifie que l'erreur "No encoding for opcode" est retournée
