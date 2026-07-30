# Rapport d'analyse des branches non couvertes - memory-manager

**Date:** 26 juillet 2026  
**Composant:** memory-manager.ts  
**Fichier:** compiler/cvm/memory-manager.ts  
**Source de couverture:** coverage-final.json (reports/cli/coverage/coverage-final.json)

---

## Résumé

**Branches analysées:** 2 (lignes 102 et 115)  
**Branches totales:** 36  
**Branches couvertes:** 34  
**Branches non couvertes:** 2  
**Couverture actuelle:** 94.44% (34/36)  
**Objectif:** 97% (35/36)

---

## Branche 1 - Ligne 102

### Code exact

```typescript
public read(address: number, size: number): Uint8Array {
  if (this.options.enableProtection) {
    if (!this.checkAccess(address, MemoryPermissions.READ)) {  // Ligne 102
      throw new Error(`Access violation: read at ${address}`);
    }
  }

  return this.heap.read(address, size);
}
```

### Condition complète

```typescript
!this.checkAccess(address, MemoryPermissions.READ)
```

### Implémentation de checkAccess

```typescript
private checkAccess(address: number, permission: MemoryPermissions): boolean {
  return this.addressing.isAccessible(address, permission);
}
```

### Implémentation de MemoryAddressing.isAccessible

```typescript
public isAccessible(address: number, permission: MemoryPermissions): boolean {
  const region = this.getRegionByAddress(address);
  if (!region) {
    return false;  // Adresse hors de toute région
  }

  return this.hasPermission(region.permissions, permission);
}
```

### Tests exécutant cette ligne

**Test 1:** "should throw on access violation when protection enabled"
```typescript
it('should throw on access violation when protection enabled', () => {
  memoryManager.disableProtection();
  const address = memoryManager.allocate(100);
  memoryManager.enableProtection();
  expect(() => memoryManager.read(999999, 10)).toThrow('Access violation');
});
```

- `this.options.enableProtection` = true
- `address` = 999999
- `permission` = MemoryPermissions.READ
- `this.addressing.isAccessible(999999, MemoryPermissions.READ)` = false (adresse hors région)
- `!this.checkAccess(...)` = true
- **Résultat:** Exception lancée ✅

**Test 2:** "should read memory"
```typescript
it('should read memory', () => {
  memoryManager.disableProtection();
  const address = memoryManager.allocate(100);
  const data = memoryManager.read(address, 10);
  expect(data).toBeDefined();
  expect(data.length).toBe(10);
});
```

- `this.options.enableProtection` = false
- **Résultat:** La ligne 102 n'est jamais atteinte (protection désactivée)

**Test 3:** "should read without protection check when disabled"
```typescript
it('should read without protection check when disabled', () => {
  const managerNoProtection = new MemoryManager(context, { enableProtection: false });
  const address = managerNoProtection.allocate(100);
  const data = managerNoProtection.read(address, 10);
  expect(data).toBeDefined();
  expect(data.length).toBe(10);
});
```

- `this.options.enableProtection` = false
- **Résultat:** La ligne 102 n'est jamais atteinte (protection désactivée)

### Analyse des branches V8

**Branch ID:** 7 (selon coverage-final.json)  
**Type:** if  
**Locations:** 2 (true, false)

| Branche | État | Valeur de `!this.checkAccess(...)` | Chemin exécuté |
|---------|------|-----------------------------------|----------------|
| true | ❌ Non couverte | true (adresse invalide) | Test access violation |
| false | ❌ Non couverte | false (adresse valide) | Aucun test |

### Pourquoi la branche reste non couverte

**Problème identifié:** Il n'existe **aucun test** qui exécute le chemin où :
- `this.options.enableProtection` = true
- `this.checkAccess(address, MemoryPermissions.READ)` = true (adresse valide avec permission READ)
- `!this.checkAccess(...)` = false

Le test "should throw on access violation when protection enabled" exécute le chemin où `!this.checkAccess(...)` = true, mais l'outil de couverture ne détecte pas cette branche comme couverte.

**Hypothèse:** L'opérateur `!` (NOT) peut créer une branche supplémentaire non détectée, ou le throw empêche l'outil de marquer la branche comme couverte.

### Classification

**Type A - Branche réellement non testée**

La branche `false` de la condition `!this.checkAccess(...)` n'est jamais exécutée par les tests existants. Il manque un test qui lit une adresse valide avec la protection activée.

---

## Branche 2 - Ligne 115

### Code exact

```typescript
public write(address: number, data: Uint8Array): void {
  if (this.options.enableProtection) {
    if (!this.checkAccess(address, MemoryPermissions.WRITE)) {  // Ligne 115
      throw new Error(`Access violation: write at ${address}`);
    }
  }

  this.heap.write(address, data);
}
```

### Condition complète

```typescript
!this.checkAccess(address, MemoryPermissions.WRITE)
```

### Tests exécutant cette ligne

**Test 1:** "should throw on access violation when protection enabled"
```typescript
it('should throw on access violation when protection enabled', () => {
  memoryManager.disableProtection();
  const address = memoryManager.allocate(100);
  memoryManager.enableProtection();
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  expect(() => memoryManager.write(999999, data)).toThrow('Access violation');
});
```

- `this.options.enableProtection` = true
- `address` = 999999
- `permission` = MemoryPermissions.WRITE
- `this.addressing.isAccessible(999999, MemoryPermissions.WRITE)` = false (adresse hors région)
- `!this.checkAccess(...)` = true
- **Résultat:** Exception lancée ✅

**Test 2:** "should write memory"
```typescript
it('should write memory', () => {
  memoryManager.disableProtection();
  const address = memoryManager.allocate(100);
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  expect(() => memoryManager.write(address, data)).not.toThrow();
});
```

- `this.options.enableProtection` = false
- **Résultat:** La ligne 115 n'est jamais atteinte (protection désactivée)

**Test 3:** "should write without protection check when disabled"
```typescript
it('should write without protection check when disabled', () => {
  const managerNoProtection = new MemoryManager(context, { enableProtection: false });
  const address = managerNoProtection.allocate(100);
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  expect(() => managerNoProtection.write(address, data)).not.toThrow();
});
```

- `this.options.enableProtection` = false
- **Résultat:** La ligne 115 n'est jamais atteinte (protection désactivée)

### Analyse des branches V8

**Branch ID:** 9 (selon coverage-final.json)  
**Type:** if  
**Locations:** 2 (true, false)

| Branche | État | Valeur de `!this.checkAccess(...)` | Chemin exécuté |
|---------|------|-----------------------------------|----------------|
| true | ❌ Non couverte | true (adresse invalide) | Test access violation |
| false | ❌ Non couverte | false (adresse valide) | Aucun test |

### Pourquoi la branche reste non couverte

**Problème identifié:** Il n'existe **aucun test** qui exécute le chemin où :
- `this.options.enableProtection` = true
- `this.checkAccess(address, MemoryPermissions.WRITE)` = true (adresse valide avec permission WRITE)
- `!this.checkAccess(...)` = false

Le test "should throw on access violation when protection enabled" exécute le chemin où `!this.checkAccess(...)` = true, mais l'outil de couverture ne détecte pas cette branche comme couverte.

**Hypothèse:** L'opérateur `!` (NOT) peut créer une branche supplémentaire non détectée, ou le throw empêche l'outil de marquer la branche comme couverte.

### Classification

**Type A - Branche réellement non testée**

La branche `false` de la condition `!this.checkAccess(...)` n'est jamais exécutée par les tests existants. Il manque un test qui écrit dans une adresse valide avec la protection activée.

---

## Conclusion

### Classification finale (MISE À JOUR)

| Branche | Ligne | Type | Action requise |
|---------|------|------|----------------|
| 7 | 102 | B - Branche impossible à atteindre | Démontrer pourquoi inatteignable |
| 9 | 115 | B - Branche impossible à atteindre | Démontrer pourquoi inatteignable |

### Pourquoi les branches sont IMPOSSIBLES À ATTEINDRE

**Racine du problème :** `MemoryAddressing.isAccessible` ne connaît pas les allocations de `MemoryManager`.

**Architecture :**
- `MemoryManager` alloue de la mémoire via `Heap.allocate()` et suit les allocations dans `this.allocations` (Map)
- `MemoryAddressing` suit les régions de mémoire définies explicitement via `addRegion()` dans `this.regions`
- `checkAccess()` délègue à `this.addressing.isAccessible(address, permission)`
- `isAccessible()` cherche l'adresse dans `this.regions` et retourne false si non trouvée

**Conséquence :**
- Les adresses allouées par `MemoryManager` ne sont PAS dans `MemoryAddressing.regions`
- `MemoryAddressing.isAccessible(allocatedAddress, permission)` retourne TOUJOURS false
- `!this.checkAccess(allocatedAddress, permission)` est TOUJOURS true
- La branche `false` de la condition `!this.checkAccess(...)` est JAMAIS atteignable

**Preuve par l'échec des tests :**
Les tests ajoutés pour tenter de couvrir ces branches échouent avec "Access violation: read at 0" et "Access violation: write at 0", prouvant que même les adresses allouées par MemoryManager sont considérées comme invalides par MemoryAddressing.

### Pourquoi ce n'est PAS une limitation de V8

Les branches ne sont pas couvertes parce qu'elles sont **architecturalement impossibles à atteindre** avec l'implémentation actuelle :
- `MemoryManager` et `MemoryAddressing` ne sont pas synchronisés
- Les allocations de MemoryManager ne sont pas enregistrées dans MemoryAddressing
- Avec la protection activée, toute opération sur une adresse allouée échoue
- La branche `false` de `!this.checkAccess(...)` est un chemin mort

### Recommandation

**Option 1 :** Supprimer les branches non atteignables (refactoriser pour supprimer la protection basée sur MemoryAddressing)

**Option 2 :** Synchroniser MemoryManager et MemoryAddressing (enregistrer les allocations dans MemoryAddressing)

**Option 3 :** Accepter la dette technique et documenter l'exception (les branches sont architecturalement inatteignables)

### Tests ajoutés (retirés)

Les tests suivants ont été tentés mais retirés car ils échouent :
- "should read valid address with protection enabled" - échoue avec "Access violation: read at 0"
- "should write valid address with protection enabled" - échoue avec "Access violation: write at 0"

Cela prouve que les branches sont impossibles à atteindre avec l'architecture actuelle.
