# InstructionFetch Branch Analysis

**Composant:** instruction-fetch  
**Fichier:** compiler/cvm/instruction-fetch.ts  
**Date:** 2026-07-27T00:35:00Z

---

## Branche Non Couverte

### Branche 8 (Ligne 124)

**Emplacement:** Méthode `evictIfNeeded()`  
**Condition:** `if (firstKey !== undefined)`  
**Sous-branche non couverte:** `else` (quand `firstKey === undefined`)  
**Hits:** `[1, 0]` (1 hit pour true, 0 hit pour false)

---

## Code Source

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

---

## Analyse

### Condition exacte
- `firstKey !== undefined` est évalué à `false` quand `firstKey === undefined`

### Expression logique
- `iterator.next().value` retourne `undefined` quand le cache est vide

### Chemin d'exécution
1. `evictIfNeeded()` est appelé
2. La condition `this.cache.size <= this.cacheSize` est fausse (cache plein)
3. `iterator.next().value` retourne `undefined` (cache vide)
4. La branche `else` est prise (rien n'est supprimé)

### Fonction appelante
- `fetch()` - ligne 57
- `prefetch()` - ligne 89
- `setCacheSize()` - ligne 180

### Préconditions
- `this.cache.size > this.cacheSize` (cache plein)

### Postconditions
- Si `firstKey !== undefined`: une entrée est supprimée du cache
- Si `firstKey === undefined`: rien n'est supprimé (cache vide)

---

## Pourquoi cette branche n'est pas couverte

### Analyse du scénario
Pour atteindre cette branche, il faut:
1. Le cache doit être plein (`this.cache.size > this.cacheSize`)
2. Le cache doit être vide (`iterator.next().value === undefined`)

### Contradiction
Ces deux conditions sont mutuellement exclusives:
- Si le cache est plein, il contient des entrées
- Si le cache est vide, il ne contient pas d'entrées

### Conclusion
Cette branche est **inatteignable** dans le code actuel car:
- La condition `this.cache.size > this.cacheSize` garantit que le cache n'est pas vide
- Si le cache n'est pas vide, `iterator.next().value` ne peut pas être `undefined`

---

## Classification

**Type C - Code Mort**

Cette branche est inatteignable car les conditions préalables sont contradictoires.
