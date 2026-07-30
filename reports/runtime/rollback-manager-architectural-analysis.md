# RollbackManager Architectural Analysis

**Composant:** rollback-manager  
**Fichier:** compiler/cvm/rollback-manager.ts  
**Date:** 2026-07-27T01:05:00Z

---

## Statements Non Couverts

### Ligne 88 - Call frame creation in restoreSnapshot

**Emplacement:** Méthode `restoreSnapshot()`  
**Code:** `this.context.getCallFrames().createFrame(...)`  
**Hits:** 0

### Ligne 129 - Snapshot copy in getAllSnapshots

**Emplacement:** Méthode `getAllSnapshots()`  
**Code:** `return Array.from(this.snapshots.values()).map(s => ({ ...s }));`  
**Hits:** 0

### Ligne 164 - Snapshot deletion in evictIfNeeded

**Emplacement:** Méthode `evictIfNeeded()`  
**Code:** `this.snapshots.delete(oldestId);`  
**Hits:** 0

### Ligne 249 - Snapshot ID mismatch validation

**Emplacement:** Méthode `validate()`  
**Code:** `errors.push(\`Snapshot ID mismatch at ${id}\`);`  
**Hits:** 0

---

## Investigation

### Invariants

1. **Snapshot invariant:**
   - `snapshot.id` doit être unique et correspond à la clé dans `snapshots`
   - `snapshot.programCounter` doit être >= 0
   - `snapshot.stack` ne doit pas être vide

2. **Eviction invariant:**
   - `snapshots.size <= maxSnapshots` (enforcé par `evictIfNeeded`)
   - Le snapshot le plus ancien est supprimé en premier

### Call Graph

```
getAllSnapshots() est appelé par:
  - Aucun test existant

evictIfNeeded() est appelé par:
  - createSnapshot()
  - setMaxSnapshots()
```

### État Mémoire

**État avant appel à `getAllSnapshots()`:**
- `snapshots` contient des snapshots

**État après appel:**
- Retourne une copie de tous les snapshots

**État avant appel à `evictIfNeeded()`:**
- `snapshots.size > maxSnapshots`

**État après appel:**
- Le snapshot le plus ancien est supprimé

### Chemins Possibles

**Chemin 1: getAllSnapshots()**
- Appel direct depuis un test
- Retourne une copie de tous les snapshots
- Atteignable

**Chemin 2: evictIfNeeded() - suppression**
- `snapshots.size > maxSnapshots`
- Le snapshot le plus ancien est supprimé
- Atteignable

**Chemin 3: validate() - ID mismatch**
- Un snapshot a un ID différent de sa clé dans la Map
- Condition: `snapshot.id !== id`
- Atteignable (corruption d'état)

### Chemins Impossibles

Aucun chemin impossible. Tous les cas sont atteignables.

### Preuve d'Atteignabilité

**Théorème:** Tous les statements non couverts sont atteignables.

**Preuve:**
1. `getAllSnapshots()` est une méthode publique qui peut être appelée directement
2. `evictIfNeeded()` est appelé quand `snapshots.size > maxSnapshots`, ce qui est atteignable en créant plus de snapshots que `maxSnapshots`
3. `validate()` détecte les incohérences d'ID, ce qui est atteignable en corrompant manuellement un snapshot
4. La restauration de call frames est atteignable en créant un snapshot avec des call frames

**QED.**

---

## Conclusion

Tous les statements non couverts sont atteignables. Ils nécessitent des tests supplémentaires pour couvrir:
- L'appel à `getAllSnapshots()`
- L'éviction de snapshots
- La validation d'incohérences d'ID
- La restauration de call frames

---

## Recommandation

**Type A - Atteignable**

Ajouter des tests pour couvrir:
1. Appel à `getAllSnapshots()`
2. Éviction de snapshots (créer plus de snapshots que maxSnapshots)
3. Validation d'incohérences d'ID
4. Restauration de call frames
