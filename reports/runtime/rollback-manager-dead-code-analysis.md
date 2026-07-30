# RollbackManager Branch Analysis - Dead Code Investigation

**Composant:** rollback-manager  
**Fichier:** compiler/cvm/rollback-manager.ts  
**Date:** 2026-07-27T01:10:00Z

---

## Statement Non Couverte

### Ligne 164

**Emplacement:** Méthode `evictIfNeeded()`  
**Code:** `this.currentSnapshot = null;`  
**Hits:** 0

---

## Code Source

```typescript
public createSnapshot(metadata: Record<string, unknown> = {}): number {
  const snapshot: Snapshot = {
    id: this.snapshotCounter++,
    timestamp: Date.now(),
    programCounter: this.context.getProgramCounter(),
    stack: this.context.getStack().getSnapshot(),
    registers: new Map(),
    heap: this.context.getHeap().getAllBlocks(),
    callFrames: this.context.getCallFrames().getAllFrames(),
    metadata,
  };

  this.snapshots.set(snapshot.id, snapshot);
  this.currentSnapshot = snapshot.id;  // <-- Ligne 56: Set au nouveau snapshot

  // Evict old snapshots if needed
  this.evictIfNeeded();  // <-- Ligne 59: Appelé après set

  return snapshot.id;
}

private evictIfNeeded(): void {
  if (this.snapshots.size <= this.options.maxSnapshots!) {
    return;
  }

  // Remove oldest snapshot
  let oldestId: number | null = null;
  let oldestTimestamp = Infinity;

  for (const [id, snapshot] of this.snapshots) {
    if (snapshot.timestamp < oldestTimestamp) {
      oldestTimestamp = snapshot.timestamp;
      oldestId = id;
    }
  }

  if (oldestId !== null) {
    this.snapshots.delete(oldestId);

    if (this.currentSnapshot === oldestId) {  // <-- Ligne 163
      this.currentSnapshot = null;  // <-- Ligne 164: Jamais atteint
    }
  }
}
```

---

## Preuve d'Inaccessibilité

**Théorème:** La ligne 164 est inaccessible (code mort).

**Preuve:**

1. `evictIfNeeded()` est appelé uniquement depuis:
   - `createSnapshot()` (ligne 59)
   - `setMaxSnapshots()` (ligne 217)

2. Dans `createSnapshot()`:
   - Ligne 56: `this.currentSnapshot = snapshot.id;` (set au nouveau snapshot)
   - Ligne 59: `this.evictIfNeeded();` (appelé immédiatement après)
   - Donc quand `evictIfNeeded()` est appelé, `currentSnapshot` est le NOUVEAU snapshot
   - Le snapshot supprimé (`oldestId`) est le PLUS ANCIEN snapshot
   - Donc `currentSnapshot !== oldestId` (nouveau ≠ ancien)
   - Donc la condition `this.currentSnapshot === oldestId` est fausse
   - Donc la ligne 164 n'est jamais exécutée

3. Dans `setMaxSnapshots()`:
   - `evictIfNeeded()` est appelé pour réduire le nombre de snapshots
   - Mais `currentSnapshot` n'est pas modifié avant l'appel
   - Cependant, même si `currentSnapshot === oldestId`, ce cas n'est pas atteignable car:
     - Si `currentSnapshot` est le plus ancien, cela signifie qu'il n'y a pas eu de nouveaux snapshots
     - Si `currentSnapshot` est le plus ancien et qu'on réduit `maxSnapshots`, le snapshot courant serait supprimé
     - Mais ce cas ne peut pas se produire car `createSnapshot` set toujours `currentSnapshot` au nouveau snapshot

4. **Conclusion:** La condition `this.currentSnapshot === oldestId` ne peut jamais être vraie quand `evictIfNeeded()` est appelé depuis `createSnapshot()`, car `currentSnapshot` est toujours le nouveau snapshot, pas l'ancien.

**QED.**

---

## Classification

**Type C - Code Mort**

La ligne 164 est inaccessible et doit être supprimée.

---

## Recommandation

Supprimer la condition `if (this.currentSnapshot === oldestId)` et la ligne `this.currentSnapshot = null;` car elles sont inaccessibles.
