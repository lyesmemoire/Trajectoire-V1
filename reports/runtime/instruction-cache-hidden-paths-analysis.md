# Recherche des chemins cachés - InstructionCache

**Date:** 27 juillet 2026  
**Composant:** instruction-cache  
**Fichier:** compiler/cvm/instruction-cache.ts  
**Phase:** 5 - Recherche des chemins cachés

---

## Objectif

Déterminer s'il existe UN SEUL chemin permettant d'exécuter:
- Ligne 107: `if (oldestAddress !== null)` (branche else)
- Ligne 189: `this.statistics.hitRate = 0;` (bloc else)

Même si ce chemin nécessite:
- mutation
- mock
- reflection
- subclass
- instrumentation
- état corrompu
- objet partiellement construit
- désérialisation
- API interne
- test privé

---

## Méthodologie

Pour chaque technique, nous analysons:
1. Est-ce techniquement possible?
2. Est-ce un chemin d'exécution valide pour la certification Enterprise?
3. Si oui, peut-on créer un test?

---

## Technique 1: Reflection

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible d'atteindre la branche else de la ligne 107 via reflection?

**Analyse:**
```typescript
const cache = new InstructionCache();
// Muter le cache pour qu'il soit vide mais que la condition size > maxSize soit vraie
(cache as any).cache = new Map();
(cache as any).maxSize = -1; // Impossible car maxSize est passé au constructeur
```

**Problème:**
- `maxSize` est défini dans le constructeur
- Le constructeur initialise `this.maxSize` avec la valeur passée
- Il n'est pas possible de définir `maxSize` à une valeur négative via le constructeur
- Via reflection, on pourrait muter `this.maxSize` après construction

**Test via reflection:**
```typescript
const cache = new InstructionCache(10);
(cache as any).maxSize = -1; // Mutation via reflection
(cache as any).evictIfNeeded(); // Appel direct via reflection
```

**Chemin d'exécution:**
1. `evictIfNeeded()` est appelé via reflection
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `0 <= -1` → faux
3. Ligne 97: `oldestAddress = null`
4. Ligne 98: `oldestAccess = Infinity`
5. Ligne 100: Boucle sur `this.cache` (0 itérations car cache vide)
6. Ligne 107: `if (oldestAddress !== null)` → faux
7. Ligne 111: Fin de méthode

**Résultat:** La branche else est atteinte via reflection.

**Question:** Est-ce un chemin d'exécution valide?

**Analyse:**
- Via reflection, on peut muter `maxSize` à une valeur négative
- Mais `maxSize` est supposé être >= 0 (taille de cache)
- Une valeur négative est un état invalide
- Ce n'est pas un état normal du système

**Conclusion:** Atteignable via reflection avec état invalide, mais pas un chemin d'exécution normal.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible d'atteindre la branche else de la ligne 189 via reflection?

**Test via reflection:**
```typescript
const cache = new InstructionCache();
(cache as any).updateHitRate(); // Appel direct via reflection
```

**Chemin d'exécution:**
1. `updateHitRate()` est appelé via reflection
2. Ligne 185: `total = 0 + 0 = 0`
3. Ligne 186: `if (total > 0)` → faux
4. Ligne 189: `hitRate = 0`

**Résultat:** La branche else est atteinte via reflection.

**Question:** Est-ce un chemin d'exécution valide?

**Analyse:**
- Via reflection, on peut appeler `updateHitRate()` directement
- Mais ce n'est pas un chemin d'exécution normal
- L'API publique ne permet pas cet appel

**Conclusion:** Atteignable via reflection, mais pas un chemin d'exécution normal.

---

## Technique 2: Mock

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible de créer un mock qui atteint la branche else?

**Analyse:**
- On pourrait créer un mock de `InstructionCache`
- Mais pour atteindre la branche else, il faudrait que la boucle n'ait aucune itération
- Cela nécessiterait que `cache.size === 0` mais que la condition `size > maxSize` soit vraie
- Ce qui nécessiterait `maxSize < 0`
- Un mock pourrait simuler cet état

**Test avec mock:**
```typescript
const mockCache = {
  cache: new Map(),
  maxSize: -1,
  statistics: { hits: 0, misses: 0, hitRate: 0, size: 0, maxSize: -1, evictions: 0 },
  evictIfNeeded: function() {
    if (this.cache.size <= this.maxSize) return;
    let oldestAddress = null;
    let oldestAccess = Infinity;
    for (const [address, entry] of this.cache) {
      if (entry.lastAccess < oldestAccess) {
        oldestAccess = entry.lastAccess;
        oldestAddress = address;
      }
    }
    if (oldestAddress !== null) {
      this.cache.delete(oldestAddress);
      this.statistics.evictions++;
      this.statistics.size = this.cache.size;
    }
  }
};
mockCache.evictIfNeeded(); // oldestAddress reste null
```

**Résultat:** La branche else est atteinte avec mock.

**Question:** Est-ce un chemin d'exécution valide?

**Analyse:**
- Un mock ne teste pas l'implémentation réelle
- Il teste une implémentation simulée
- Donc pas valide pour la certification de l'implémentation réelle

**Conclusion:** Atteignable avec mock, mais pas valide pour la certification.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible de créer un mock qui atteint la branche else?

**Test avec mock:**
```typescript
const mockCache = {
  statistics: { hits: 0, misses: 0, hitRate: 0, size: 0, maxSize: 256, evictions: 0 },
  updateHitRate: function() {
    const total = this.statistics.hits + this.statistics.misses;
    if (total > 0) {
      this.statistics.hitRate = this.statistics.hits / total;
    } else {
      this.statistics.hitRate = 0;
    }
  }
};
mockCache.updateHitRate(); // total = 0, branche else atteinte
```

**Résultat:** La branche else est atteinte avec mock.

**Conclusion:** Atteignable avec mock, mais pas valide pour la certification.

---

## Technique 3: Subclass

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible de créer une subclass qui atteint la branche else?

**Analyse:**
- `evictIfNeeded()` est privée
- Une subclass ne peut pas accéder aux méthodes privées
- Donc impossible

**Conclusion:** Impossible via subclass.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible de créer une subclass qui atteint la branche else?

**Analyse:**
- `updateHitRate()` est privée
- Une subclass ne peut pas accéder aux méthodes privées
- Donc impossible

**Conclusion:** Impossible via subclass.

---

## Technique 4: Instrumentation

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible que l'instrumentation atteigne la branche else?

**Analyse:**
- L'instrumentation pourrait intercepter les appels et modifier l'état
- Mais l'instrumentation n'est pas partie de l'implémentation normale
- Ce serait un cas de test artificiel

**Conclusion:** Possible via instrumentation, mais pas un chemin d'exécution normal.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible que l'instrumentation atteigne la branche else?

**Analyse:**
- L'instrumentation pourrait appeler `updateHitRate()` directement
- Mais l'instrumentation n'est pas partie de l'implémentation normale

**Conclusion:** Possible via instrumentation, mais pas un chemin d'exécution normal.

---

## Technique 5: État corrompu

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible d'atteindre la branche else avec un état corrompu?

**Analyse:**
- Pour atteindre la branche else, il faut que `oldestAddress === null` après la boucle
- Cela nécessiterait que la boucle n'ait aucune itération ou que toutes les entrées aient `lastAccess === Infinity`
- La boucle n'a aucune itération seulement si `cache.size === 0`, mais dans ce cas la méthode retourne avant la boucle
- Avoir `lastAccess === Infinity` est impossible avec l'implémentation actuelle (car `lastAccess` est initialisé à `accessCounter` qui commence à 0)

**Test avec état corrompu:**
```typescript
const cache = new InstructionCache();
// Corrompre le cache pour qu'il ait une entrée avec lastAccess === Infinity
const corruptedEntry = {
  address: 100,
  instruction: { opcode: 0, operands: [], size: 1 },
  size: 1,
  accessCount: 1,
  lastAccess: Infinity // Corrompu
};
(cache as any).cache.set(100, corruptedEntry);
(cache as any).maxSize = 0; // Pour forcer l'éviction
(cache as any).evictIfNeeded();
```

**Chemin d'exécution:**
1. `evictIfNeeded()` est appelé
2. Ligne 92: `if (this.cache.size <= this.maxSize)` → `1 <= 0` → faux
3. Ligne 97: `oldestAddress = null`
4. Ligne 98: `oldestAccess = Infinity`
5. Ligne 100: Boucle sur `this.cache` (1 itération)
   - `entry.lastAccess < Infinity` → `Infinity < Infinity` → faux
   - `oldestAddress` reste `null`
6. Ligne 107: `if (oldestAddress !== null)` → faux
7. Ligne 111: Fin de méthode

**Résultat:** La branche else est atteinte avec état corrompu.

**Question:** Est-ce un chemin d'exécution valide?

**Analyse:**
- L'état `lastAccess === Infinity` est impossible avec l'implémentation normale
- C'est un état corrompu qui ne peut pas se produire normalement
- Donc pas valide pour la certification

**Conclusion:** Atteignable avec état corrompu, mais pas un chemin d'exécution normal.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible d'atteindre la branche else avec un état corrompu?

**Analyse:**
- Pour atteindre la branche else, il faut que `total === 0` quand `updateHitRate()` est appelé
- `updateHitRate()` est appelé uniquement depuis `get()`
- `get()` incrémente toujours `hits` ou `misses` avant d'appeler `updateHitRate()`
- Même avec un état corrompu, l'ordre d'exécution est le même
- Donc impossible

**Conclusion:** Impossible même avec état corrompu.

---

## Technique 6: Objet partiellement construit

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible d'atteindre la branche else avec un objet partiellement construit?

**Analyse:**
- Le constructeur initialise tous les champs
- Il n'est pas possible d'avoir un objet partiellement construit
- Le constructeur appelle `initializeStatistics()` qui initialise toutes les statistiques
- Donc impossible

**Conclusion:** Impossible.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible d'atteindre la branche else avec un objet partiellement construit?

**Analyse:**
- Le constructeur initialise tous les champs
- Il n'est pas possible d'avoir un objet partiellement construit
- Donc impossible

**Conclusion:** Impossible.

---

## Technique 7: Désérialisation

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible d'atteindre la branche else via désérialisation?

**Analyse:**
- Il n'y a pas de mécanisme de sérialisation/désérialisation dans le code
- Donc impossible

**Conclusion:** Impossible.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible d'atteindre la branche else via désérialisation?

**Analyse:**
- Il n'y a pas de mécanisme de sérialisation/désérialisation dans le code
- Donc impossible

**Conclusion:** Impossible.

---

## Technique 8: API interne

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible d'atteindre la branche else via une API interne?

**Analyse:**
- `evictIfNeeded()` est privée
- Il n'y a pas d'API interne qui l'expose
- Donc impossible

**Conclusion:** Impossible.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible d'atteindre la branche else via une API interne?

**Analyse:**
- `updateHitRate()` est privée
- Il n'y a pas d'API interne qui l'expose
- Donc impossible

**Conclusion:** Impossible.

---

## Technique 9: Test privé

### Branche 107 (evictIfNeeded)

**Question:** Est-il possible d'atteindre la branche else via un test privé?

**Analyse:**
- Un test privé pourrait utiliser reflection pour appeler `evictIfNeeded()`
- Mais pour atteindre la branche else, il faudrait un état invalide (maxSize < 0 ou lastAccess === Infinity)
- Ce n'est pas un état normal du système

**Test privé:**
```typescript
it('should handle evictIfNeeded with empty cache and negative maxSize', () => {
  const cache = new InstructionCache(10);
  (cache as any).maxSize = -1;
  (cache as any).cache.clear();
  (cache as any).evictIfNeeded();
  // oldestAddress reste null
});
```

**Résultat:** La branche else est atteinte via test privé avec état invalide.

**Question:** Est-ce valide pour la certification?

**Analyse:**
- Un test privé avec état invalide n'est pas accepté pour la certification Enterprise
- La certification exige une couverture via les chemins d'exécution normaux
- Les états invalides ne sont pas considérés comme des chemins normaux

**Conclusion:** Atteignable via test privé avec état invalide, mais pas valide pour la certification.

---

### Branche 189 (updateHitRate)

**Question:** Est-il possible d'atteindre la branche else via un test privé?

**Test privé:**
```typescript
it('should call updateHitRate with zero total', () => {
  const cache = new InstructionCache();
  (cache as any).updateHitRate();
  // total = 0, branche else atteinte
});
```

**Résultat:** La branche else est atteinte via test privé.

**Question:** Est-ce valide pour la certification?

**Analyse:**
- Un test privé qui appelle directement une méthode privée n'est pas accepté pour la certification Enterprise
- La certification exige une couverture via l'API publique
- Les appels directs aux méthodes privées ne sont pas considérés comme des chemins normaux

**Conclusion:** Atteignable via test privé, mais pas valide pour la certification.

---

## Synthèse des chemins cachés

### Branche 107 (evictIfNeeded)

| Technique | Atteignable | Valide pour certification | Justification |
|-----------|-------------|---------------------------|----------------|
| Reflection | ✅ Oui | ❌ Non | Nécessite état invalide (maxSize < 0) |
| Mock | ✅ Oui | ❌ Non | Teste une implémentation simulée |
| Subclass | ❌ Non | N/A | Méthode privée |
| Instrumentation | ✅ Oui | ❌ Non | Pas un chemin normal |
| État corrompu | ✅ Oui | ❌ Non | lastAccess === Infinity impossible normalement |
| Objet partiellement construit | ❌ Non | N/A | Impossible |
| Désérialisation | ❌ Non | N/A | Pas de mécanisme |
| API interne | ❌ Non | N/A | Méthode privée |
| Test privé | ✅ Oui | ❌ Non | Appel direct + état invalide |

**Conclusion:** La branche 107 est atteignable via plusieurs techniques, mais aucune n'est valide pour la certification Enterprise car elles nécessitent soit un état invalide, soit un appel direct à une méthode privée, soit une implémentation simulée.

---

### Branche 189 (updateHitRate)

| Technique | Atteignable | Valide pour certification | Justification |
|-----------|-------------|---------------------------|----------------|
| Reflection | ✅ Oui | ❌ Non | Appel direct à méthode privée |
| Mock | ✅ Oui | ❌ Non | Teste une implémentation simulée |
| Subclass | ❌ Non | N/A | Méthode privée |
| Instrumentation | ✅ Oui | ❌ Non | Pas un chemin normal |
| État corrompu | ❌ Non | N/A | Impossible même avec état corrompu |
| Objet partiellement construit | ❌ Non | N/A | Impossible |
| Désérialisation | ❌ Non | N/A | Pas de mécanisme |
| API interne | ❌ Non | N/A | Méthode privée |
| Test privé | ✅ Oui | ❌ Non | Appel direct à méthode privée |

**Conclusion:** La branche 189 est atteignable via plusieurs techniques, mais aucune n'est valide pour la certification Enterprise car elles nécessitent soit un appel direct à une méthode privée, soit une implémentation simulée.

---

## Conclusion générale

**Existe-t-il UN SEUL chemin valide pour la certification permettant d'exécuter les lignes 107 et 189?**

**Réponse:** NON.

**Justification:**
- Les branches 107 et 189 sont atteignables via reflection, mock, instrumentation, et test privé
- Cependant, aucun de ces chemins n'est valide pour la certification Enterprise car:
  1. Ils nécessitent des états invalides (maxSize < 0, lastAccess === Infinity)
  2. Ils nécessitent des appels directs aux méthodes privées
  3. Ils testent des implémentations simulées plutôt que l'implémentation réelle
  4. Ils ne sont pas des chemins d'exécution normaux via l'API publique

**Décision:** Les branches 107 et 189 sont du code mort inatteignable via les chemins d'exécution normaux et peuvent être supprimées sans modifier le comportement fonctionnel.
