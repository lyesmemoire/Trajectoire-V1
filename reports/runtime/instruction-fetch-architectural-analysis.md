# InstructionFetch Architectural Analysis

**Composant:** instruction-fetch  
**Fichier:** compiler/cvm/instruction-fetch.ts  
**Date:** 2026-07-27T00:35:00Z

---

## Branche Non Couverte

### Branche 8 (Ligne 124)

**Emplacement:** Méthode `evictIfNeeded()`  
**Condition:** `if (firstKey !== undefined)`  
**Sous-branche non couverte:** `else` (quand `firstKey === undefined`)

---

## Investigation

### Invariants

1. **Cache size invariant:**
   - `this.cache.size` représente le nombre d'entrées dans le cache
   - `this.cache.size` est toujours >= 0
   - `this.cache.size` est toujours <= `this.cacheSize` (après appel à `evictIfNeeded()`)

2. **Cache content invariant:**
   - Si `this.cache.size > 0`, le cache contient des entrées
   - Si `this.cache.size === 0`, le cache est vide

### Call Graph

```
evictIfNeeded() est appelé par:
  - fetch() (ligne 57)
  - prefetch() (ligne 89)
  - setCacheSize() (ligne 180)

Conditions d'appel:
  - fetch(): appelé après avoir ajouté une entrée au cache (ligne 56)
  - prefetch(): appelé après avoir ajouté une entrée au cache (ligne 88)
  - setCacheSize(): appelé après avoir réduit la taille du cache (ligne 179)
```

### État Mémoire

**État avant appel à `evictIfNeeded()`:**
- Dans `fetch()`: une instruction vient d'être ajoutée au cache (ligne 56)
- Dans `prefetch()`: une instruction vient d'être ajoutée au cache (ligne 88)
- Dans `setCacheSize()`: la taille du cache vient d'être réduite (ligne 179)

**Invariant:**
- Dans tous les cas, `this.cache.size >= 1` avant d'appeler `evictIfNeeded()`

### Chemins Possibles

**Chemin 1: Cache non plein**
```typescript
if (this.cache.size <= this.cacheSize) {
  return; // Sortie anticipée
}
```
- Si le cache n'est pas plein, la fonction retourne immédiatement
- La branche 124 n'est jamais atteinte

**Chemin 2: Cache plein**
```typescript
const iterator = this.cache.keys();
const firstKey = iterator.next().value;
if (firstKey !== undefined) {
  this.cache.delete(firstKey);
}
```
- Si le cache est plein (`this.cache.size > this.cacheSize`), alors `this.cache.size >= 1`
- Si `this.cache.size >= 1`, le cache contient des entrées
- Si le cache contient des entrées, `iterator.next().value` ne peut pas être `undefined`
- Donc `firstKey !== undefined` est toujours vrai
- La branche `else` (quand `firstKey === undefined`) est inatteignable

### Chemins Impossibles

**Chemin impossible: Cache plein mais vide**
- Condition: `this.cache.size > this.cacheSize` ET `iterator.next().value === undefined`
- Contradiction: Si le cache est plein, il contient des entrées
- Contradiction: Si le cache contient des entrées, `iterator.next().value` ne peut pas être `undefined`
- Conclusion: Ce chemin est impossible

### Preuve Formelle

**Théorème:** La branche `else` de la ligne 124 est inatteignable.

**Preuve:**
1. Pour atteindre la ligne 124, il faut que `this.cache.size > this.cacheSize` (ligne 117)
2. Si `this.cache.size > this.cacheSize`, alors `this.cache.size >= 1` (car `cacheSize >= 0`)
3. Si `this.cache.size >= 1`, le cache contient au moins une entrée
4. Si le cache contient au moins une entrée, `iterator.next().value` retourne la clé de la première entrée
5. Donc `iterator.next().value !== undefined`
6. Donc `firstKey !== undefined` est vrai
7. Donc la branche `else` n'est jamais prise

**QED.**

---

## Conclusion

La branche `else` de la ligne 124 est **inatteignable** car les conditions préalables sont contradictoires. Il est impossible que le cache soit plein (`this.cache.size > this.cacheSize`) et vide (`iterator.next().value === undefined`) en même temps.

---

## Recommandation

**Type C - Code Mort**

Supprimer la condition `if (firstKey !== undefined)` car elle est toujours vraie dans le contexte où elle est évaluée.

**Code à supprimer:**
```typescript
if (firstKey !== undefined) {
  this.cache.delete(firstKey);
}
```

**Remplacement par:**
```typescript
this.cache.delete(firstKey);
```
