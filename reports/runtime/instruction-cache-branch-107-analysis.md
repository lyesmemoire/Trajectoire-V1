# Vérification formelle de la branche 107 - InstructionCache

**Date:** 27 juillet 2026  
**Composant:** instruction-cache  
**Fichier:** compiler/cvm/instruction-cache.ts  
**Phase:** 3 - Vérification formelle de la branche 107

---

## Code analysé

```typescript
private evictIfNeeded(): void {
  if (this.cache.size <= this.maxSize) {
    return;
  }

  // LRU eviction
  let oldestAddress: number | null = null;
  let oldestAccess = Infinity;

  for (const [address, entry] of this.cache) {
    if (entry.lastAccess < oldestAccess) {
      oldestAccess = entry.lastAccess;
      oldestAddress = address;
    }
  }

  if (oldestAddress !== null) {  // LIGNE 107
    this.cache.delete(oldestAddress);
    this.statistics.evictions++;
    this.statistics.size = this.cache.size;
  }
}
```

## Branche analysée

**Ligne 107:** `if (oldestAddress !== null)`

**Branche à analyser:** La branche `else` (quand `oldestAddress === null`)

---

## Analyse des états possibles

### État 1: Cache vide

**Configuration:**
- `this.cache.size === 0`
- `this.maxSize >= 0`

**Chemin d'exécution:**
1. Appel de `evictIfNeeded()`
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `0 <= maxSize` → vrai
3. Ligne 93: `return`

**Résultat:** La méthode retourne avant d'atteindre la boucle.

**Conclusion:** La branche ligne 107 n'est pas atteinte.

---

### État 2: Cache plein (size == maxSize)

**Configuration:**
- `this.cache.size === this.maxSize`
- `this.maxSize > 0`

**Chemin d'exécution:**
1. Appel de `evictIfNeeded()`
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `size <= maxSize` → vrai
3. Ligne 93: `return`

**Résultat:** La méthode retourne avant d'atteindre la boucle.

**Conclusion:** La branche ligne 107 n'est pas atteinte.

---

### État 3: Cache avec une entrée (size == 1, maxSize == 0)

**Configuration:**
- `this.cache.size === 1`
- `this.maxSize === 0`

**Chemin d'exécution:**
1. Appel de `evictIfNeeded()`
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `1 <= 0` → faux
3. Ligne 97: `oldestAddress = null`
4. Ligne 98: `oldestAccess = Infinity`
5. Ligne 100: Boucle sur `this.cache` (1 itération)
   - `entry.lastAccess < Infinity` → vrai (car `lastAccess >= 0`)
   - `oldestAccess = entry.lastAccess`
   - `oldestAddress = address`
6. Ligne 107: `if (oldestAddress !== null)` → vrai
7. Ligne 108-110: Éviction exécutée

**Résultat:** La condition `oldestAddress !== null` est vraie.

**Conclusion:** La branche `else` n'est pas atteinte.

---

### État 4: Cache avec une entrée (size == 1, maxSize == 1)

**Configuration:**
- `this.cache.size === 1`
- `this.maxSize === 1`

**Chemin d'exécution:**
1. Appel de `evictIfNeeded()`
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `1 <= 1` → vrai
3. Ligne 93: `return`

**Résultat:** La méthode retourne avant d'atteindre la boucle.

**Conclusion:** La branche ligne 107 n'est pas atteinte.

---

### État 5: Cache avec n entrées (size > maxSize)

**Configuration:**
- `this.cache.size === n` où `n > this.maxSize`
- `this.maxSize >= 0`

**Chemin d'exécution:**
1. Appel de `evictIfNeeded()`
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `n <= maxSize` → faux
3. Ligne 97: `oldestAddress = null`
4. Ligne 98: `oldestAccess = Infinity`
5. Ligne 100: Boucle sur `this.cache` (n itérations)
   - À la première itération: `entry.lastAccess < Infinity` → vrai
   - `oldestAccess = entry.lastAccess`
   - `oldestAddress = address`
   - Itérations suivantes: mise à jour si `lastAccess < oldestAccess`
6. Ligne 107: `if (oldestAddress !== null)` → vrai (car au moins une itération)
7. Ligne 108-110: Éviction exécutée

**Résultat:** La condition `oldestAddress !== null` est vraie.

**Conclusion:** La branche `else` n'est pas atteinte.

---

### État 6: Cache corrompu (entry.lastAccess === Infinity)

**Configuration:**
- `this.cache.size > this.maxSize`
- Au moins une entrée avec `entry.lastAccess === Infinity`

**Chemin d'exécution:**
1. Appel de `evictIfNeeded()`
2. Ligne 92: Condition fausse
3. Ligne 97: `oldestAddress = null`
4. Ligne 98: `oldestAccess = Infinity`
5. Ligne 100: Boucle sur `this.cache`
   - Si `entry.lastAccess === Infinity`: `Infinity < Infinity` → faux
   - Si toutes les entrées ont `lastAccess === Infinity`: `oldestAddress` reste `null`
6. Ligne 107: `if (oldestAddress !== null)` → faux
7. Ligne 111: Fin de méthode

**Question:** Cet état est-il possible?

**Analyse:**
- `lastAccess` est initialisé à `this.accessCounter++` (ligne 79 dans `put()`)
- `accessCounter` commence à 0 et est incrémenté à chaque accès
- `lastAccess` est toujours un nombre fini (0, 1, 2, ...)
- Il est impossible d'avoir `lastAccess === Infinity` avec l'implémentation actuelle

**Conclusion:** Cet état est impossible avec l'implémentation actuelle.

---

### État 7: Appel depuis put() avec cache vide

**Configuration:**
- Appel depuis `put()`
- `this.cache.size === 0` avant appel

**Chemin d'exécution:**
1. `put()` appelle `this.cache.set(address, entry)` (ligne 82)
2. `this.cache.size` devient 1
3. `put()` appelle `evictIfNeeded()` (ligne 85)
4. Ligne 92: `if (this.cache.size <= this.maxSize)` → `1 <= maxSize`
   - Si `maxSize >= 1`: vrai → retour
   - Si `maxSize === 0`: faux → continue vers boucle

**Résultat:**
- Si `maxSize >= 1`: méthode retourne avant la boucle
- Si `maxSize === 0`: méthode atteint la boucle avec `cache.size === 1`

**Conclusion:** La branche `else` n'est pas atteinte dans les deux cas.

---

### État 8: Appel depuis setMaxSize() avec cache vide

**Configuration:**
- Appel depuis `setMaxSize()`
- `this.cache.size === 0`

**Chemin d'exécution:**
1. `setMaxSize()` appelle `evictIfNeeded()` (ligne 213)
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `0 <= maxSize` → vrai
3. Ligne 93: `return`

**Résultat:** La méthode retourne avant d'atteindre la boucle.

**Conclusion:** La branche ligne 107 n'est pas atteinte.

---

### État 9: Appel depuis setMaxSize() avec cache non vide, size <= newSize

**Configuration:**
- Appel depuis `setMaxSize()`
- `this.cache.size > 0`
- `this.cache.size <= this.maxSize` (après mise à jour)

**Chemin d'exécution:**
1. `setMaxSize()` met à jour `this.maxSize` (ligne 211)
2. `setMaxSize()` appelle `evictIfNeeded()` (ligne 213)
3. Ligne 92: `if (this.cache.size <= this.maxSize)` → vrai
4. Ligne 93: `return`

**Résultat:** La méthode retourne avant d'atteindre la boucle.

**Conclusion:** La branche ligne 107 n'est pas atteinte.

---

### État 10: Appel depuis setMaxSize() avec cache non vide, size > newSize

**Configuration:**
- Appel depuis `setMaxSize()`
- `this.cache.size > 0`
- `this.cache.size > this.maxSize` (après mise à jour)

**Chemin d'exécution:**
1. `setMaxSize()` met à jour `this.maxSize` (ligne 211)
2. `setMaxSize()` appelle `evictIfNeeded()` (ligne 213)
3. Ligne 92: `if (this.cache.size <= this.maxSize)` → faux
4. Ligne 97: `oldestAddress = null`
5. Ligne 98: `oldestAccess = Infinity`
6. Ligne 100: Boucle sur `this.cache` (au moins 1 itération car `cache.size > 0`)
   - À la première itération: `entry.lastAccess < Infinity` → vrai
   - `oldestAddress = address`
7. Ligne 107: `if (oldestAddress !== null)` → vrai
8. Ligne 108-110: Éviction exécutée

**Résultat:** La condition `oldestAddress !== null` est vraie.

**Conclusion:** La branche `else` n'est pas atteinte.

---

## Analyse des chemins cachés

### Mutation via reflection

**Question:** Est-il possible de muter `this.cache` pour que la boucle n'ait aucune itération?

**Analyse:**
- Pour que la boucle n'ait aucune itération, il faut que `this.cache.size === 0`
- Mais si `this.cache.size === 0`, la condition `this.cache.size <= this.maxSize` est vraie
- Donc la méthode retourne à la ligne 93 avant d'atteindre la boucle
- Même avec reflection, il est impossible d'atteindre la boucle avec un cache vide

**Conclusion:** Impossible via reflection.

---

### Appel concurrent

**Question:** Est-il possible qu'un appel concurrent modifie le cache pendant l'exécution de `evictIfNeeded()`?

**Analyse:**
- JavaScript est single-threadé (sauf Web Workers)
- Même avec async/await, il n'y a pas de véritable concurrence
- Il n'y a pas de mécanisme de verrouillage dans le code
- Donc pas d'appel concurrent possible

**Conclusion:** Impossible.

---

### Suppression pendant éviction

**Question:** Est-il possible que `this.cache.delete()` soit appelé pendant la boucle?

**Analyse:**
- `evictIfNeeded()` est la seule méthode qui supprime des entrées
- La suppression se produit après la boucle (ligne 108)
- Il n'y a pas de suppression pendant la boucle
- Donc impossible

**Conclusion:** Impossible.

---

## Preuve formelle d'impossibilité

**Théorème:** La branche `else` de `if (oldestAddress !== null)` (ligne 107) est inatteignable.

**Preuve:**

1. Pour atteindre la ligne 107, il faut que la boucle (ligne 100) soit exécutée.
2. Pour que la boucle soit exécutée, il faut que la condition `this.cache.size <= this.maxSize` (ligne 92) soit fausse.
3. Si `this.cache.size <= this.maxSize` est fausse, alors `this.cache.size > this.maxSize`.
4. Si `this.cache.size > this.maxSize`, alors `this.cache.size >= 1` (car `maxSize >= 0`).
5. Si `this.cache.size >= 1`, alors la boucle a au moins une itération.
6. Dans la première itération de la boucle:
   - `entry.lastAccess` est un nombre fini (initialisé à `accessCounter` qui commence à 0)
   - `entry.lastAccess < Infinity` est vrai
   - Donc `oldestAddress` est défini à une valeur non-null
7. Après la boucle, `oldestAddress !== null` est vrai.
8. Donc la branche `else` n'est jamais exécutée.

**Conclusion:** La branche `else` de la ligne 107 est inatteignable.

---

## Test possible ?

**Question:** Existe-t-il un test qui pourrait atteindre cette branche?

**Réponse:** Non.

**Justification:**
- Pour atteindre la branche `else`, il faudrait que `oldestAddress === null` après la boucle
- Cela nécessiterait que la boucle n'ait aucune itération ou que toutes les entrées aient `lastAccess === Infinity`
- La boucle n'a aucune itération seulement si `cache.size === 0`, mais dans ce cas la méthode retourne avant la boucle
- Avoir `lastAccess === Infinity` est impossible avec l'implémentation actuelle
- Donc aucun test ne peut atteindre cette branche

---

## Conclusion

**Classification:** Type C - Code mort (branche impossible)

**Preuve:** La branche `else` de `if (oldestAddress !== null)` (ligne 107) est inatteignable car:
1. Pour atteindre cette ligne, la boucle doit être exécutée
2. Pour exécuter la boucle, `cache.size > maxSize` doit être vrai
3. Si `cache.size > maxSize`, alors `cache.size >= 1`
4. Si `cache.size >= 1`, la boucle a au moins une itération
5. Dans la première itération, `oldestAddress` est défini
6. Donc `oldestAddress !== null` est toujours vrai quand la ligne 107 est atteinte

**Décision:** Cette branche est du code mort inatteignable et peut être supprimée sans modifier le comportement fonctionnel.
