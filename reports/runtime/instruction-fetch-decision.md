# InstructionFetch Decision

**Composant:** instruction-fetch  
**Fichier:** compiler/cvm/instruction-fetch.ts  
**Date:** 2026-07-27T00:35:00Z

---

## Décision

**Type C - Code Mort**

La branche non couverte (ligne 124) est inatteignable et doit être supprimée.

---

## Justification

### Preuve Formelle

**Théorème:** La branche `else` de la ligne 124 est inatteignable.

**Preuve:**
1. Pour atteindre la ligne 124, il faut que `this.cache.size > this.cacheSize` (ligne 117)
2. Si `this.cache.size > this.cacheSize`, alors `this.cache.size >= 1` (car `cacheSize >= 0`)
3. Si `this.cache.size >= 1`, le cache contient au moins une entrée
4. Si le cache contient au moins une entrée, `iterator.next().value` retourne la clé de la première entrée
5. Donc `iterator.next().value !== undefined`
6. Donc `firstKey !== undefined` est toujours vrai
7. Donc la branche `else` n'est jamais prise

**QED.**

---

## Action

**Supprimer la condition `if (firstKey !== undefined)` car elle est toujours vraie.**

### Code avant

```typescript
private evictIfNeeded(): void {
  if (this.cache.size <= this.cacheSize) {
    return;
  }

  // Simple LRU: remove oldest entry
  const iterator = this.cache.keys();
  const firstKey = iterator.next().value;
  if (firstKey !== undefined) {
    this.cache.delete(firstKey);
  }
}
```

### Code après

```typescript
private evictIfNeeded(): void {
  if (this.cache.size <= this.cacheSize) {
    return;
  }

  // Simple LRU: remove oldest entry
  const iterator = this.cache.keys();
  const firstKey = iterator.next().value;
  this.cache.delete(firstKey);
}
```

---

## Impact

- **API publique:** Aucun changement
- **Comportement:** Aucun changement (la condition était toujours vraie)
- **Couverture:** Passera de 96.00% à 100.00%
- **Tests:** Aucun test à ajouter

---

## Validation

Après refactoring:
1. Exécuter `pnpm vitest`
2. Exécuter `pnpm vitest --coverage`
3. Exécuter `pnpm build`
4. Exécuter `pnpm tsc --noEmit`

---

## Certification

Après refactoring, le composant devrait atteindre:
- Statements: 100.00%
- Branches: 100.00%
- Functions: 100.00%
- Lines: 100.00%

**Statut final attendu:** CERTIFIED AFTER REFACTOR
