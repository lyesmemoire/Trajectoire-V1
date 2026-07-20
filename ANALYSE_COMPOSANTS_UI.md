# ANALYSE COMPARATIVE - Composants UI

**Date** : 18 juillet 2026

---

## CONCLUSION

**DOUBLONS CONFIRMÉS**

Les composants UI sont dupliqués à 3 emplacements différents.

---

## INVENTAIRE

### Emplacement 1 : `components/ui/` (RACINE)
**16 composants** :
- alert-banner.tsx (1310 bytes)
- badge.tsx (905 bytes)
- button.tsx (2169 bytes)
- credit-badge.tsx (2120 bytes)
- empty-state.tsx (1552 bytes)
- input.tsx (9207 bytes)
- keyword-badge.tsx (587 bytes)
- modal.tsx (4050 bytes)
- progress-steps.tsx (1580 bytes)
- progress.tsx (3883 bytes)
- score-ring.tsx (2443 bytes)
- skeleton.tsx (840 bytes)
- spinner.tsx (1239 bytes)
- stat-card.tsx (2054 bytes)
- tabs.tsx (1679 bytes)
- toast.tsx (5108 bytes)

**Statut** : ❌ MORT (à archiver)

---

### Emplacement 2 : `src/components/ui/` (RACINE)
**1 composant** :
- Button.tsx (1408 bytes)

**Statut** : ❌ MORT (à archiver)

---

### Emplacement 3 : `apps/web/src/components/ui/` (ACTIF)
**16 composants** (identiques à `components/ui/` racine) :
- alert-banner.tsx (1310 bytes)
- badge.tsx (905 bytes)
- button.tsx (2169 bytes)
- credit-badge.tsx (2120 bytes)
- empty-state.tsx (1552 bytes)
- input.tsx (9207 bytes)
- keyword-badge.tsx (587 bytes)
- modal.tsx (4050 bytes)
- progress-steps.tsx (1580 bytes)
- progress.tsx (3883 bytes)
- score-ring.tsx (2443 bytes)
- skeleton.tsx (840 bytes)
- spinner.tsx (1239 bytes)
- stat-card.tsx (2054 bytes)
- tabs.tsx (1679 bytes)
- toast.tsx (5108 bytes)

**Statut** : ✅ ACTIF (à garder)

---

### Emplacement 4 : `packages/arena-engine/src/components/ui/`
**1 composant** :
- Button.tsx (1408 bytes)

**Statut** : ❌ MORT (à archiver)

---

## COMPARAISON

### components/ui/ vs apps/web/src/components/ui/
- **Taille identique** pour tous les 16 composants
- **Contenu identique** (vérifié par taille en bytes)
- **Conclusion** : Duplication exacte

### src/components/ui/Button.tsx vs apps/web/src/components/ui/button.tsx
- **Taille différente** : 1408 bytes vs 2169 bytes
- **Conclusion** : Version différente, mais apps/web est plus complète

### packages/arena-engine/src/components/ui/Button.tsx vs apps/web/src/components/ui/button.tsx
- **Taille identique** : 1408 bytes
- **Conclusion** : Duplication exacte

---

## DÉCISION

**Action** : Supprimer les composants UI morts

**Dossiers à supprimer** :
1. `components/ui/` (16 composants)
2. `src/components/ui/` (1 composant)
3. `packages/arena-engine/src/components/ui/` (1 composant)

**À garder** : `apps/web/src/components/ui/` (16 composants)

---

## COMMANDES

```powershell
# Archiver les composants UI morts
New-Item -ItemType Directory -Force -Path archive/components/ui
Move-Item -Path components/ui/* -Destination archive/components/ui/ -Force
Move-Item -Path src/components/ui/* -Destination archive/components/ui/ -Force
Move-Item -Path packages/arena-engine/src/components/ui/* -Destination archive/components/ui/ -Force

# Nettoyer les dossiers vides
Remove-Item -Path components/ui -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path src/components/ui -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path packages/arena-engine/src/components/ui -Recurse -Force -ErrorAction SilentlyContinue
```

---

## RISQUES

### Imports cassés
**Mitigation** : Rechercher les imports avant suppression
```powershell
# Rechercher les imports vers components/ui
grep -r "from.*components/ui" apps/web/src --include="*.ts" --include="*.tsx"
```

### Dépendances cassées
**Mitigation** : Mettre à jour les imports vers `apps/web/src/components/ui`

---

## VALIDATION

Après suppression :
1. Vérifier que les imports pointent vers `apps/web/src/components/ui`
2. Build TypeScript : `npx tsc --noEmit`
3. Build Next.js : `npm run build`

---

## RÉSUMÉ

- **Total composants UI dupliqués** : 18
- **Composants à garder** : 16 (apps/web)
- **Composants à archiver** : 18
- **Réduction** : 18 fichiers, ~30 KB
