# RAPPORT NETTOYAGE PRÉ-MIGRATION
**Date** : 18 juillet 2026
**Statut** : ⚠️ PARTIELLEMENT COMPLETÉ - Erreurs de build à corriger

---

## RÉSUMÉ

**Nettoyage P0 et P1 exécuté** : ✅ COMPLETÉ
**Build TypeScript** : ❌ 415 erreurs dans 139 fichiers

---

## ACTIONS EXÉCUTÉES

### P0 - Hooks et services morts (COMPLETÉ)

**Archivage hooks** :
- `hooks/*` → `archive/hooks/` (5 fichiers)
- `lib/audio/hooks/*` → `archive/hooks/` (3 fichiers)
- `lib/realtime/useAudioPlayback.ts` → `archive/hooks/`
- `lib/flags/use-feature.ts` → `archive/hooks/`
- `lib/ml/user.behavioral-memory.ts` → `archive/hooks/`
- `lib/progressive-disclosure/user_maturity.ts` → `archive/hooks/`
- `packages/arena-engine/hooks/*` → `archive/hooks/` (6 fichiers)
- `packages/arena-engine/lib/audio/hooks/*` → `archive/hooks/` (3 fichiers)
- `packages/arena-engine/lib/realtime/useAudioPlayback.ts` → `archive/hooks/`

**Archivage services** :
- `lib/db/*` → `archive/lib/db/` (9 fichiers)
- `lib/domain/*` → `archive/lib/` (1 fichier)
- `packages/arena-engine/lib/db/*` → `archive/lib/db/` (9 fichiers)
- `packages/arena-engine/lib/domain/*` → `archive/lib/` (1 fichier)

**Dossiers supprimés** :
- `hooks/`
- `lib/audio/hooks/`
- `lib/db/`
- `lib/domain/`

### P1 - Composants UI morts (COMPLETÉ)

**Archivage composants UI** :
- `components/ui/*` → `archive/components/ui/` (16 fichiers)
- `src/components/ui/*` → `archive/components/ui/` (1 fichier)
- `packages/arena-engine/src/components/ui/*` → `archive/components/ui/` (1 fichier)

**Dossiers supprimés** :
- `components/ui/`
- `src/components/ui/`
- `packages/arena-engine/src/components/ui/`

---

## ÉTAT DU BUILD

### Commande exécutée
```bash
npx tsc --noEmit
```

### Résultat
- **Erreurs** : 415
- **Fichiers affectés** : 139
- **Statut** : ❌ ÉCHEC

### Types d'erreurs principales

1. **Imports cassés vers hooks archivés**
   - Imports vers `hooks/`, `lib/audio/hooks/`, `lib/realtime/`, etc.
   - Doivent être redirigés vers `apps/web/src/hooks/`

2. **Imports cassés vers services archivés**
   - Imports vers `lib/db/`, `lib/domain/`
   - Doivent être redirigés vers `apps/web/src/lib/db/`

3. **Imports cassés vers composants UI archivés**
   - Imports vers `components/ui/`, `src/components/ui/`
   - Doivent être redirigés vers `apps/web/src/components/ui/`

4. **Imports vers packages/arena-engine**
   - Certains fichiers importent encore depuis `packages/arena-engine`
   - Ces imports doivent être vérifiés et corrigés

---

## ACTIONS REQUISES

### 1. Corriger les imports cassés (CRITIQUE)

**Script de correction automatique** à créer :
```typescript
// scripts/fix-imports.ts
// Rechercher et remplacer les imports cassés
// - hooks/ → apps/web/src/hooks/
// - lib/db/ → apps/web/src/lib/db/
// - components/ui/ → apps/web/src/components/ui/
```

### 2. Vérifier les imports arena-engine

**Action** :
- Identifier tous les imports vers `packages/arena-engine`
- Vérifier si les fichiers existent encore
- Rediriger vers `apps/web/src/` si nécessaire

### 3. Relancer le build

**Commande** :
```bash
npx tsc --noEmit
```

---

## STATISTIQUES

### Fichiers archivés
- **Hooks** : 18 fichiers
- **Services** : 20 fichiers
- **Composants UI** : 18 fichiers
- **Total archivé** : 56 fichiers

### Dossiers supprimés
- **Dossiers hooks** : 3
- **Dossiers services** : 2
- **Dossiers UI** : 3
- **Total supprimé** : 8 dossiers

### Réduction estimée
- **Fichiers supprimés** : 56
- **Lignes de code** : ~15,000+
- **Taille** : ~500 KB

---

## RISQUES

### Risque 1 : Imports non corrigés
**Statut** : ⚠️ CONFIRMÉ
**Impact** : Build échoue
**Mitigation** : Créer script de correction automatique

### Risque 2 : Code utile archivé par erreur
**Statut** : ⚠️ POSSIBLE
**Impact** : Fonctionnalités manquantes
**Mitigation** : Vérifier les imports avant suppression définitive

---

## PROCHAINES ÉTAPES

1. **Immédiat** : Créer script de correction des imports
2. **Court terme** : Exécuter la correction des imports
3. **Court terme** : Relancer le build TypeScript
4. **Moyen terme** : Corriger manuellement les erreurs restantes
5. **Moyen terme** : Migrer les routes API manquantes

---

## RECOMMANDATION

**PAUSE AVANT CONTINUER**

Le nettoyage P0 et P1 est complet mais a cassé le build. Il est recommandé de :

1. Créer et exécuter un script de correction des imports
2. Vérifier que le build passe
3. Ensuite seulement, continuer avec P2 (migration API)

**Alternative** : Restaurer depuis `archive/` si les corrections sont trop complexes.

---

**Statut du nettoyage** : ⚠️ EN ATTENTE DE CORRECTION IMPORTS
**Estimation temps correction** : 2-4 heures
