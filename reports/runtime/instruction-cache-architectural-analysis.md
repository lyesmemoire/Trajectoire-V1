# Vérification architecturale - InstructionCache

**Date:** 27 juillet 2026  
**Composant:** instruction-cache  
**Fichier:** compiler/cvm/instruction-cache.ts  
**Phase:** 6 - Vérification architecturale

---

## Branche 107 - Analyse architecturale

### Code analysé

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

### Pourquoi la branche est-elle impossible?

**Règle de conception 1: Garde-fou précoce (Early Guard)**
- La ligne 92 implémente un garde-fou précoce: `if (this.cache.size <= this.maxSize) return;`
- Cette règle garantit que si le cache n'est pas plein, la méthode retourne immédiatement
- Pour atteindre la boucle, il faut que `cache.size > maxSize`
- Si `cache.size > maxSize`, alors `cache.size >= 1` (car `maxSize >= 0`)

**Règle de conception 2: Invariant de taille minimale**
- Le cache est conçu pour avoir une taille >= 0
- `maxSize` est conçu pour être >= 0 (taille de cache ne peut pas être négative)
- Donc si `cache.size > maxSize`, alors `cache.size >= 1`

**Règle de conception 3: Invariant de boucle**
- La boucle itère sur `this.cache`
- Si `cache.size >= 1`, la boucle a au moins une itération
- Dans la première itération, `oldestAddress` est défini
- Donc après la boucle, `oldestAddress !== null`

### Règle de conception qui rend la branche impossible

**Règle:** Garde-fou précoce combiné avec invariant de taille

Cette règle stipule que:
1. Si le cache n'est pas plein, retourner immédiatement (ligne 92)
2. Si le cache est plein, il contient au moins une entrée
3. La boucle trouvera toujours au moins une entrée
4. Donc `oldestAddress` sera toujours défini

### Est-ce volontaire ou un défaut de conception?

**Analyse:**

**Arguments pour "volontaire":**
- Le garde-fou précoce est un pattern de conception courant
- Il évite des calculs inutiles si le cache n'est pas plein
- La validation `if (oldestAddress !== null)` est une défense défensive
- Elle protège contre des états impossibles (par ex. si `lastAccess` était corrompu)

**Arguments pour "défaut de conception":**
- La validation `if (oldestAddress !== null)` est redondante
- Elle ne peut jamais être fausse avec l'implémentation actuelle
- Elle ajoute de la complexité sans valeur ajoutée
- Elle suggère que le développeur n'a pas complètement analysé les invariants

**Conclusion:** C'est un **défaut de conception mineur**.

**Justification:**
- Le garde-fou précoce est volontaire et correct
- La validation défensive est bien intentionnée mais mal analysée
- Le développeur a ajouté une validation sans réaliser qu'elle est inatteignable
- C'est un cas de "défensive programming excessif" où la validation n'est pas nécessaire

---

## Branche 189 - Analyse architecturale

### Code analysé

```typescript
private updateHitRate(): void {
  const total = this.statistics.hits + this.statistics.misses;
  if (total > 0) {
    this.statistics.hitRate = this.statistics.hits / total;
  } else {
    this.statistics.hitRate = 0;  // LIGNE 189
  }
}
```

### Pourquoi la branche est-elle impossible?

**Règle de conception 1: Couplage étroit entre get() et updateHitRate()**
- `updateHitRate()` est appelé uniquement depuis `get()`
- `get()` incrémente toujours `hits` ou `misses` avant d'appeler `updateHitRate()`
- Donc quand `updateHitRate()` est appelé, `total >= 1`

**Règle de conception 2: Invariant d'incrémentation**
- `get()` a deux branches mutuellement exclusives:
  - Si hit: `hits++`
  - Si miss: `misses++`
- L'une de ces branches est TOUJOURS exécutée
- Donc au moins une incrémentation se produit avant `updateHitRate()`

**Règle de conception 3: Initialisation des statistiques**
- Les statistiques sont initialisées à 0 dans le constructeur
- Elles sont réinitialisées à 0 dans `clear()`
- Mais `updateHitRate()` n'est jamais appelé directement après initialisation
- Il est toujours appelé après incrémentation

### Règle de conception qui rend la branche impossible

**Règle:** Couplage étroit avec incrémentation garantie

Cette règle stipule que:
1. `updateHitRate()` est une méthode privée couplée à `get()`
2. `get()` garantit une incrémentation avant d'appeler `updateHitRate()`
3. Donc `total` est toujours >= 1 quand `updateHitRate()` est appelé
4. Donc la branche `else` n'est jamais exécutée

### Est-ce volontaire ou un défaut de conception?

**Analyse:**

**Arguments pour "volontaire":**
- La validation `else` pourrait être là pour la robustesse
- Si `updateHitRate()` était appelé depuis un autre endroit dans le futur, la validation serait utile
- C'est une forme de "programmation défensive pour l'extensibilité"

**Arguments pour "défaut de conception":**
- `updateHitRate()` est privée et n'est pas conçue pour être appelée depuis ailleurs
- Si elle devait être appelée depuis ailleurs, elle devrait être publique ou protégée
- La validation est inutile avec l'architecture actuelle
- Elle suggère que le développeur n'a pas complètement analysé le graphe d'appel

**Conclusion:** C'est un **défaut de conception mineur**.

**Justification:**
- Le couplage étroit est volontaire (méthode privée)
- La validation défensive est bien intentionnée mais mal analysée
- Le développeur a ajouté une validation sans réaliser qu'elle est inatteignable
- C'est un cas de "défensive programming excessif" où la validation n'est pas nécessaire

---

## Analyse des invariants architecturaux

### Invariant 1: evictIfNeeded() ne peut être appelé avec cache vide et size > maxSize

**Preuve:**
- Si appelé depuis `put()`: `put()` insère toujours une entrée avant d'appeler `evictIfNeeded()`
- Si appelé depuis `setMaxSize()`: Si cache vide, `size <= maxSize` est vrai, donc retourne avant la boucle

**Conclusion:** Cet invariant est garanti par l'architecture.

---

### Invariant 2: updateHitRate() ne peut être appelé avec total === 0

**Preuve:**
- `updateHitRate()` est appelé uniquement depuis `get()`
- `get()` incrémente toujours `hits` ou `misses` avant d'appeler `updateHitRate()`
- Donc `total >= 1` quand `updateHitRate()` est appelé

**Conclusion:** Cet invariant est garanti par l'architecture.

---

## Analyse des alternatives architecturales

### Alternative 1: Rendre updateHitRate() publique

**Description:**
- Rendre `updateHitRate()` publique
- Permettre aux appelants externes de mettre à jour le hit rate

**Avantages:**
- La validation `else` deviendrait utile
- Plus flexible pour les cas d'utilisation avancés

**Inconvénients:**
- Brise l'encapsulation
- Nécessiterait une documentation supplémentaire
- Pourrait être utilisé incorrectement
- Augmente la surface API sans valeur ajoutée claire

**Conclusion:** Non recommandé.

---

### Alternative 2: Séparer l'incrémentation de la mise à jour

**Description:**
- Créer une méthode publique pour incrémenter hits/misses
- Créer une méthode publique pour mettre à jour le hit rate
- Permettre aux appelants de contrôler l'ordre

**Avantages:**
- Plus flexible
- La validation `else` deviendrait utile

**Inconvénients:**
- Augmente la complexité
- Nécessiterait une synchronisation
- Pourrait introduire des bugs si l'ordre n'est pas respecté
- Sur-ingénierie pour le cas d'utilisation actuel

**Conclusion:** Non recommandé.

---

### Alternative 3: Supprimer la validation inutile

**Description:**
- Supprimer le bloc `else` de `updateHitRate()`
- Supprimer la validation `if (oldestAddress !== null)` de `evictIfNeeded()`

**Avantages:**
- Réduit la complexité
- Élimine le code mort
- Améliore la lisibilité
- Réduit la confusion

**Inconvénients:**
- Perte de la défensive (mais la défensive est inutile)

**Conclusion:** Recommandé.

---

## Conclusion architecturale

### Branche 107

**Règle de conception:** Garde-fou précoce combiné avec invariant de taille

**Classification:** Défaut de conception mineur (défensive programming excessif)

**Volontaire ou défaut:** Défaut

**Justification:** La validation défensive est bien intentionnée mais inutile car l'invariant architectural garantit que `oldestAddress` sera toujours défini quand la ligne 107 est atteinte.

---

### Branche 189

**Règle de conception:** Couplage étroit avec incrémentation garantie

**Classification:** Défaut de conception mineur (défensive programming excessif)

**Volontaire ou défaut:** Défaut

**Justification:** La validation défensive est bien intentionnée mais inutile car l'invariant architectural garantit que `total >= 1` quand `updateHitRate()` est appelé.

---

## Recommandation

**Action:** Supprimer le code mort inutile.

**Justification:**
- Les validations défensives sont inutiles avec l'architecture actuelle
- Elles ajoutent de la complexité sans valeur ajoutée
- Elles peuvent créer de la confusion pour les futurs mainteneurs
- La suppression améliorera la lisibilité et réduira la complexité

**Impact:**
- Aucun changement fonctionnel
- Aucun changement de l'API publique
- Amélioration de la couverture de branches (100%)
- Réduction de la complexité cyclomatique
