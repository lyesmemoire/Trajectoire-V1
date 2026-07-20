# PLAN DE NETTOYAGE PRÉ-MIGRATION
**Date** : 18 juillet 2026
**Basé sur** : Audit complet des doublons

---

## RÉSUMÉ EXÉCUTIF

**Total fichiers dupliqués identifiés** : 112+

**Catégories** :
- Hooks : 35+ dupliqués
- Services : 25+ dupliqués
- Routes API : 43 dupliqués
- Pages : 8 dupliqués
- Moteurs HIIOS : 0 (DecisionEngine analysé - pas un doublon)

**Action prioritaire** : Supprimer les hooks et services morts dans `legacy/`, `lib/`, et `packages/arena-engine/`

---

## ÉTAT ACTUEL

### ✅ COMPLETÉ

1. **Script d'audit** : `scripts/audit-duplicates-simple.ps1` ✅
2. **Registre des doublons** : `REGISTRE_DOUBLONS.md` ✅
3. **Scripts de détection** :
   - `scripts/find-dead-components.ts` ✅
   - `scripts/find-dead-hooks.ts` ✅
   - `scripts/analyze-api-routes.ts` ✅
4. **Analyse DecisionEngine** : `ANALYSE_DECISION_ENGINE.md` ✅

---

## ACTIONS PRIORITAIRES

### P0 - CRITIQUE (Exécution immédiate)

#### 1. Supprimer les hooks morts
**Cible** : 35+ hooks dupliqués

**Dossiers à supprimer** :
- `hooks/` (racine) → 5 hooks
- `lib/audio/hooks/` (racine) → 3 hooks
- `lib/realtime/useAudioPlayback.ts` (racine)
- `lib/flags/use-feature.ts` (racine)
- `lib/ml/user.behavioral-memory.ts` (racine)
- `lib/progressive-disclosure/user_maturity.ts` (racine)
- `packages/arena-engine/hooks/` → 6 hooks
- `packages/arena-engine/lib/audio/hooks/` → 3 hooks
- `packages/arena-engine/lib/realtime/useAudioPlayback.ts`
- `packages/arena-engine/lib/flags/use-feature.ts`
- `packages/arena-engine/lib/ml/user.behavioral-memory.ts`
- `packages/arena-engine/lib/progressive-disclosure/user_maturity.ts`

**À garder** : `apps/web/src/hooks/` (5 hooks actifs)

**Commande** :
```powershell
# Archiver les hooks morts
New-Item -ItemType Directory -Force -Path archive/hooks
Move-Item -Path hooks/* -Destination archive/hooks/ -Force
Move-Item -Path lib/audio/hooks/* -Destination archive/hooks/ -Force
Move-Item -Path lib/realtime/useAudioPlayback.ts -Destination archive/hooks/ -Force
Move-Item -Path lib/flags/use-feature.ts -Destination archive/hooks/ -Force
Move-Item -Path lib/ml/user.behavioral-memory.ts -Destination archive/hooks/ -Force
Move-Item -Path lib/progressive-disclosure/user_maturity.ts -Destination archive/hooks/ -Force
```

#### 2. Supprimer les services morts
**Cible** : 25+ services dupliqués

**Dossiers à supprimer** :
- `lib/db/` (racine) → 9 services
- `lib/domain/` (racine) → 1 service
- `packages/arena-engine/lib/db/` → 9 services
- `packages/arena-engine/lib/domain/` → 1 service

**À garder** : `apps/web/src/lib/db/` (9 services actifs)

**Commande** :
```powershell
# Archiver les services morts
New-Item -ItemType Directory -Force -Path archive/lib/db
Move-Item -Path lib/db/* -Destination archive/lib/db/ -Force
Move-Item -Path lib/domain/* -Destination archive/lib/ -Force
Move-Item -Path packages/arena-engine/lib/db/* -Destination archive/lib/db/ -Force
Move-Item -Path packages/arena-engine/lib/domain/* -Destination archive/lib/ -Force
```

#### 3. Nettoyer les dossiers vides
```powershell
# Supprimer les dossiers vides après archivage
Remove-Item -Path hooks -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path lib/audio/hooks -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path lib/db -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path lib/domain -Recurse -Force -ErrorAction SilentlyContinue
```

---

### P1 - IMPORTANT (Court terme)

#### 4. Migrer les routes API manquantes
**Cible** : Routes Stripe, CV, Cron

**Actions** :
1. Comparer les versions legacy vs arena-engine
2. Choisir la meilleure version
3. Copier vers `apps/web/src/app/api/`
4. Mettre à jour les imports

**Routes à migrer** :
- `/api/stripe/checkout` → `apps/web/src/app/api/stripe/checkout/route.ts`
- `/api/stripe/webhook` → `apps/web/src/app/api/stripe/webhook/route.ts`
- `/api/stripe/customer-portal` → `apps/web/src/app/api/stripe/customer-portal/route.ts`
- `/api/cv/analyze` → `apps/web/src/app/api/cv/analyze/route.ts`
- `/api/cron/check-costs` → `apps/web/src/app/api/cron/check-costs/route.ts`
- `/api/cron/cleanup-transactions` → `apps/web/src/app/api/cron/cleanup-transactions/route.ts`

#### 5. Analyser les 12 routes interview legacy
**Cible** : `legacy/api/interview/*`

**Actions** :
1. Lancer `scripts/analyze-api-routes.ts`
2. Identifier les routes uniques
3. Migrer celles qui manquent dans apps/web

#### 6. Comparer les pages dupliquées
**Cible** : Dashboard, Interview, Simulation, Report

**Actions** :
1. Comparer le contenu de chaque version
2. Garder la version apps/web si elle est plus complète
3. Sinon, extraire les fonctions manquantes

---

### P2 - CONFORT (Moyen terme)

#### 7. Nettoyer legacy/ après migration
**Actions** :
1. Attendre la fin de toutes les migrations
2. Archiver le dossier `legacy/` complet
3. Supprimer les références dans package.json

#### 8. Nettoyer packages/arena-engine/
**Actions** :
1. Vérifier si arena-engine est utilisé comme dépendance
2. Si oui, migrer le code utile vers apps/web
3. Sinon, archiver le package complet

---

## ORDRE D'EXÉCUTION

### Phase 1 - Nettoyage immédiat (1-2 heures)
1. ✅ Scripts d'audit créés
2. ⏳ Archiver hooks morts
3. ⏳ Archiver services morts
4. ⏳ Nettoyer dossiers vides

### Phase 2 - Migration API (2-3 heures)
5. ⏳ Migrer routes Stripe
6. ⏳ Migrer routes CV
7. ⏳ Migrer routes Cron
8. ⏳ Analyser routes interview

### Phase 3 - Comparaison pages (1-2 heures)
9. ⏳ Comparer pages Dashboard
10. ⏳ Comparer pages Interview
11. ⏳ Comparer pages Simulation
12. ⏳ Comparer pages Report

### Phase 4 - Nettoyage final (1 heure)
13. ⏳ Archiver legacy/
14. ⏳ Archiver packages/arena-engine/
15. ⏳ Mettre à jour package.json
16. ⏳ Vérifier build

---

## RISQUES ET MITIGATIONS

### Risque 1 : Imports cassés après suppression
**Mitigation** :
- Rechercher tous les imports avant suppression
- Mettre à jour les imports vers apps/web
- Tester le build après chaque phase

### Risque 2 : Code utile dans legacy/arena-engine
**Mitigation** :
- Lancer les scripts de détection avant suppression
- Comparer le contenu des fichiers
- Extraire les fonctions uniques avant suppression

### Risque 3 : Dépendances cassées
**Mitigation** :
- Vérifier package.json avant suppression
- Mettre à jour les dépendances si nécessaire
- Tester l'application après nettoyage

---

## MÉTRIQUES DE SUCCÈS

### Avant nettoyage
- Total fichiers : 137+ dupliqués
- Hooks : 40+ (35+ morts)
- Services : 30+ (25+ morts)
- Routes API : 58 (43 dupliquées)
- Pages : 12 (8 dupliquées)

### Après nettoyage (objectif)
- Total fichiers : 37 uniques dans apps/web
- Hooks : 5 actifs dans apps/web
- Services : 9 actifs dans apps/web
- Routes API : 15-20 uniques dans apps/web
- Pages : 4 uniques dans apps/web

### Réduction attendue
- Fichiers supprimés : 100+
- Lignes de code supprimées : ~10,000+
- Dossiers supprimés : 10+

---

## VALIDATION

### Tests à effectuer après nettoyage
1. Build TypeScript : `npx tsc --noEmit`
2. Build Next.js : `npm run build`
3. Tests unitaires : `npm run test`
4. Lint : `npm run lint`

### Rollback en cas d'erreur
- Restaurer depuis `archive/`
- Git revert si nécessaire
- Documenter les problèmes rencontrés

---

## PROCHAINES ÉTAPES

1. **Immédiat** : Exécuter les commandes de suppression P0
2. **Court terme** : Migrer les routes API manquantes
3. **Moyen terme** : Comparer et nettoyer les pages
4. **Long terme** : Archiver legacy/ et arena-engine/

---

**Statut du plan** : ✅ PRÊT POUR EXÉCUTION
**Estimation temps total** : 4-8 heures
**Risque** : FAIBLE (avec rollback possible)
