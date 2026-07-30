# Analyse des invariants - InstructionCache

**Date:** 27 juillet 2026  
**Composant:** instruction-cache  
**Fichier:** compiler/cvm/instruction-cache.ts  
**Phase:** 2 - Analyse des invariants

---

## Méthode: get()

### Signature
```typescript
public get(address: number): Instruction | null
```

### Préconditions
- `address` est un nombre (pas de validation explicite)
- `this.cache` est initialisé (Map)
- `this.statistics` est initialisé
- `this.accessCounter` est initialisé

### Postconditions
- Retourne l'instruction si l'adresse est dans le cache
- Retourne `null` si l'adresse n'est pas dans le cache
- `this.statistics.hits` est incrémenté si l'adresse est dans le cache
- `this.statistics.misses` est incrémenté si l'adresse n'est pas dans le cache
- `this.statistics.hitRate` est mis à jour
- Si hit: `entry.accessCount` est incrémenté
- Si hit: `entry.lastAccess` est mis à jour
- `this.accessCounter` est incrémenté si hit

### États possibles
1. **Cache vide, adresse absente**
   - Pré: `this.cache.size === 0`
   - Action: `entry = null`
   - Résultat: `this.statistics.misses++`, `updateHitRate()`, retourne `null`

2. **Cache non vide, adresse présente**
   - Pré: `this.cache.has(address) === true`
   - Action: `entry !== null`
   - Résultat: `this.statistics.hits++`, `updateHitRate()`, retourne `entry.instruction`

3. **Cache non vide, adresse absente**
   - Pré: `this.cache.size > 0` et `this.cache.has(address) === false`
   - Action: `entry = null`
   - Résultat: `this.statistics.misses++`, `updateHitRate()`, retourne `null`

### États impossibles
- Aucun état impossible identifié

### Invariants
- **Invariant 1:** Après appel à `get()`, `this.statistics.hits + this.statistics.misses` est incrémenté d'exactement 1
- **Invariant 2:** `updateHitRate()` est TOUJOURS appelé après incrémentation de `hits` OU `misses`
- **Invariant 3:** `this.statistics.hits >= 0` et `this.statistics.misses >= 0` (toujours vrais car ils sont seulement incrémentés)
- **Invariant 4:** Quand `updateHitRate()` est appelé, `this.statistics.hits + this.statistics.misses >= 1`

### Transitions
```
get() → hits++ → updateHitRate() → return instruction
get() → misses++ → updateHitRate() → return null
```

### Preuve formelle de l'invariant critique
**Invariant:** Quand `updateHitRate()` est appelé, `total = hits + misses >= 1`

**Preuve:**
1. `updateHitRate()` est appelé uniquement depuis `get()` (lignes 61 et 66)
2. À la ligne 58: `this.statistics.hits++` (exécuté si `entry !== null`)
3. À la ligne 65: `this.statistics.misses++` (exécuté si `entry === null`)
4. Ces deux lignes sont mutuellement exclusives (if/else)
5. L'une d'elles est TOUJOURS exécutée avant `updateHitRate()`
6. Donc, quand `updateHitRate()` est appelé, soit `hits` a été incrémenté, soit `misses` a été incrémenté
7. Donc `total = hits + misses >= 1`

**Conclusion:** La condition `total > 0` est TOUJOURS vraie quand `updateHitRate()` est appelé depuis `get()`.

---

## Méthode: put()

### Signature
```typescript
public put(address: number, instruction: Instruction, size: number): void
```

### Préconditions
- `address` est un nombre
- `instruction` est valide
- `size` est un nombre
- `this.cache` est initialisé
- `this.statistics` est initialisé
- `this.accessCounter` est initialisé

### Postconditions
- Une entrée est ajoutée au cache à l'adresse spécifiée
- `this.cache.size` est incrémenté de 1 (ou reste le même si l'adresse existait déjà)
- `this.statistics.size` est mis à jour
- `evictIfNeeded()` est appelé
- `this.accessCounter` est incrémenté

### États possibles
1. **Cache vide, nouvelle adresse**
   - Pré: `this.cache.size === 0`
   - Action: `this.cache.set(address, entry)`
   - Résultat: `this.cache.size === 1`, `evictIfNeeded()` appelé

2. **Cache non vide, nouvelle adresse**
   - Pré: `this.cache.size > 0` et `!this.cache.has(address)`
   - Action: `this.cache.set(address, entry)`
   - Résultat: `this.cache.size` incrémenté, `evictIfNeeded()` appelé

3. **Cache non vide, adresse existante**
   - Pré: `this.cache.has(address) === true`
   - Action: `this.cache.set(address, entry)` (remplace l'ancienne)
   - Résultat: `this.cache.size` inchangé, `evictIfNeeded()` appelé

### États impossibles
- Aucun état impossible identifié

### Invariants
- **Invariant 1:** Après appel à `put()`, `this.cache.size >= 1` (au moins l'entrée ajoutée)
- **Invariant 2:** `evictIfNeeded()` est TOUJOURS appelé après insertion
- **Invariant 3:** Quand `evictIfNeeded()` est appelé depuis `put()`, `this.cache.size >= 1`

### Transitions
```
put() → cache.set() → statistics.size = cache.size → evictIfNeeded() → return
```

### Preuve formelle de l'invariant critique
**Invariant:** Quand `evictIfNeeded()` est appelé depuis `put()`, `this.cache.size >= 1`

**Preuve:**
1. `put()` appelle `this.cache.set(address, entry)` à la ligne 82
2. `Map.set()` ajoute ou remplace une entrée
3. Si l'adresse n'existait pas, `this.cache.size` est incrémenté
4. Si l'adresse existait déjà, `this.cache.size` reste inchangé
5. Dans les deux cas, après `this.cache.set()`, l'adresse existe dans le cache
6. Donc `this.cache.size >= 1` après la ligne 82
7. `evictIfNeeded()` est appelé à la ligne 85
8. Donc quand `evictIfNeeded()` est appelé depuis `put()`, `this.cache.size >= 1`

**Conclusion:** Quand `evictIfNeeded()` est appelé depuis `put()`, le cache contient au moins une entrée.

---

## Méthode: evictIfNeeded()

### Signature
```typescript
private evictIfNeeded(): void
```

### Préconditions (depuis put())
- `this.cache.size >= 1` (au moins l'entrée ajoutée)
- `this.maxSize` est défini
- `this.statistics` est initialisé

### Préconditions (depuis setMaxSize())
- `this.maxSize` a été mis à jour
- `this.cache.size` peut être 0 ou plus
- `this.statistics` est initialisé

### Postconditions
- Si `this.cache.size <= this.maxSize`: retourne immédiatement
- Si `this.cache.size > this.maxSize`: l'entrée LRU est supprimée
- `this.statistics.evictions` est incrémenté si une entrée est supprimée
- `this.statistics.size` est mis à jour si une entrée est supprimée

### États possibles
1. **Appel depuis put(), cache.size <= maxSize**
   - Pré: `this.cache.size >= 1` et `this.cache.size <= this.maxSize`
   - Action: retourne à la ligne 93
   - Résultat: aucune éviction

2. **Appel depuis put(), cache.size > maxSize**
   - Pré: `this.cache.size >= 1` et `this.cache.size > this.maxSize`
   - Action: boucle pour trouver LRU, suppression
   - Résultat: une entrée est supprimée

3. **Appel depuis setMaxSize(), cache vide**
   - Pré: `this.cache.size === 0`
   - Action: retourne à la ligne 93 (car `0 <= maxSize`)
   - Résultat: aucune éviction

4. **Appel depuis setMaxSize(), cache non vide, size <= newSize**
   - Pré: `this.cache.size > 0` et `this.cache.size <= this.maxSize`
   - Action: retourne à la ligne 93
   - Résultat: aucune éviction

5. **Appel depuis setMaxSize(), cache non vide, size > newSize**
   - Pré: `this.cache.size > 0` et `this.cache.size > this.maxSize`
   - Action: boucle pour trouver LRU, suppression
   - Résultat: une entrée est supprimée

### États impossibles
- **État impossible:** Appel depuis `put()` avec `this.cache.size === 0`
  - **Preuve:** `put()` insère toujours une entrée avant d'appeler `evictIfNeeded()`
  - Donc `this.cache.size >= 1` quand `evictIfNeeded()` est appelé depuis `put()`

### Invariants
- **Invariant 1:** Si `this.cache.size <= this.maxSize`, la méthode retourne sans éviction
- **Invariant 2:** Si la méthode atteint la boucle (ligne 100), alors `this.cache.size > this.maxSize`
- **Invariant 3:** Si la méthode atteint la boucle, alors `this.cache.size >= 1`
- **Invariant 4:** Après la boucle, `oldestAddress` est défini si `this.cache.size > 0`

### Transitions
```
evictIfNeeded() → if (size <= maxSize) → return
evictIfNeeded() → if (size > maxSize) → loop → if (oldestAddress !== null) → delete → return
```

### Preuve formelle de l'invariant critique
**Invariant:** Si `evictIfNeeded()` atteint la boucle (ligne 100), alors `oldestAddress` sera défini (non null)

**Preuve:**
1. Pour atteindre la boucle, il faut que `this.cache.size > this.maxSize` (condition ligne 92 est fausse)
2. Si `this.cache.size > this.maxSize`, alors `this.cache.size >= 1`
3. La boucle itère sur `this.cache` (ligne 100)
4. Si `this.cache.size >= 1`, la boucle a au moins une itération
5. Dans la première itération, `entry.lastAccess < Infinity` est vrai (car `lastAccess` est initialisé à 0 ou plus)
6. Donc `oldestAddress` est défini à la première itération
7. Donc après la boucle, `oldestAddress !== null`

**Conclusion:** Si `evictIfNeeded()` atteint la boucle, `oldestAddress` sera toujours non null.

---

## Méthode: updateHitRate()

### Signature
```typescript
private updateHitRate(): void
```

### Préconditions
- `this.statistics` est initialisé
- `this.statistics.hits >= 0`
- `this.statistics.misses >= 0`
- Appelé depuis `get()` après incrémentation de `hits` ou `misses`

### Postconditions
- `this.statistics.hitRate` est mis à jour
- Si `total > 0`: `hitRate = hits / total`
- Si `total === 0`: `hitRate = 0`

### États possibles
1. **Appel depuis get() après hit**
   - Pré: `this.statistics.hits` incrémenté
   - Action: `total = hits + misses >= 1`
   - Résultat: `hitRate = hits / total`

2. **Appel depuis get() après miss**
   - Pré: `this.statistics.misses` incrémenté
   - Action: `total = hits + misses >= 1`
   - Résultat: `hitRate = hits / total`

### États impossibles
- **État impossible:** Appel avec `total === 0`
  - **Preuve:** `updateHitRate()` est appelé uniquement depuis `get()`
  - `get()` incrémente toujours `hits` ou `misses` avant d'appeler `updateHitRate()`
  - Donc quand `updateHitRate()` est appelé, `total = hits + misses >= 1`
  - Donc `total === 0` est impossible

### Invariants
- **Invariant 1:** Quand `updateHitRate()` est appelé, `total = hits + misses >= 1`
- **Invariant 2:** La condition `total > 0` est TOUJOURS vraie quand `updateHitRate()` est appelé
- **Invariant 3:** La branche `else` (ligne 189) est inatteignable

### Transitions
```
updateHitRate() → total = hits + misses → if (total > 0) → hitRate = hits / total
updateHitRate() → total = hits + misses → if (total <= 0) → hitRate = 0 [IMPOSSIBLE]
```

### Preuve formelle de l'invariant critique
**Invariant:** La branche `else` (ligne 189) est inatteignable

**Preuve:**
1. `updateHitRate()` est appelé uniquement depuis `get()` (lignes 61 et 66)
2. À la ligne 58: `this.statistics.hits++` (exécuté si `entry !== null`)
3. À la ligne 65: `this.statistics.misses++` (exécuté si `entry === null`)
4. Ces deux lignes sont mutuellement exclusives (if/else)
5. L'une d'elles est TOUJOURS exécutée avant `updateHitRate()`
6. Donc, quand `updateHitRate()` est appelé, `total = hits + misses >= 1`
7. Donc la condition `total > 0` (ligne 186) est TOUJOURS vraie
8. Donc la branche `else` (ligne 189) n'est JAMAIS exécutée

**Conclusion:** La ligne 189 est du code mort inatteignable.

---

## Résumé des invariants critiques

### Invariant pour branche 107 (evictIfNeeded)
**Invariant:** Si `evictIfNeeded()` atteint la boucle (ligne 100), alors `oldestAddress !== null`

**Preuve:**
- Pour atteindre la boucle: `this.cache.size > this.maxSize`
- Si `this.cache.size > this.maxSize`, alors `this.cache.size >= 1`
- La boucle itère sur `this.cache`
- Si `this.cache.size >= 1`, la boucle a au moins une itération
- Dans la première itération, `oldestAddress` est défini
- Donc après la boucle, `oldestAddress !== null`

**Conclusion:** La branche `else` de `if (oldestAddress !== null)` (ligne 107) est inatteignable quand `evictIfNeeded()` est appelé depuis `put()`.

**ATTENTION:** Quand `evictIfNeeded()` est appelé depuis `setMaxSize()`, il est possible que `this.cache.size === 0`. Dans ce cas, la méthode retourne à la ligne 93 et n'atteint jamais la boucle. Donc la branche `else` reste inatteignable.

### Invariant pour branche 189 (updateHitRate)
**Invariant:** Quand `updateHitRate()` est appelé, `total = hits + misses >= 1`

**Preuve:**
- `updateHitRate()` est appelé uniquement depuis `get()`
- `get()` incrémente toujours `hits` ou `misses` avant d'appeler `updateHitRate()`
- Donc quand `updateHitRate()` est appelé, `total >= 1`
- Donc la condition `total > 0` est toujours vraie
- Donc la branche `else` (ligne 189) est inatteignable

**Conclusion:** La ligne 189 est du code mort inatteignable.

---

## Analyse des chemins d'appel

### Chemin vers updateHitRate()
```
External → get() → [hits++ OR misses++] → updateHitRate()
```

**Propriété:** Ce chemin garantit que `total >= 1` quand `updateHitRate()` est appelé.

### Chemin vers evictIfNeeded() depuis put()
```
External → put() → cache.set() → evictIfNeeded()
```

**Propriété:** Ce chemin garantit que `cache.size >= 1` quand `evictIfNeeded()` est appelé depuis `put()`.

### Chemin vers evictIfNeeded() depuis setMaxSize()
```
External → setMaxSize() → evictIfNeeded()
```

**Propriété:** Ce chemin ne garantit pas que `cache.size >= 1`. Le cache peut être vide.

**Analyse:** Si le cache est vide quand `evictIfNeeded()` est appelé depuis `setMaxSize()`, la condition `cache.size <= maxSize` est vraie (car `0 <= maxSize`), donc la méthode retourne à la ligne 93 et n'atteint jamais la boucle. Donc la branche `else` de la ligne 107 reste inatteignable.
