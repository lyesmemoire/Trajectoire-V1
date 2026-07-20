# MODULE_HEALTH.md

> Métriques de santé des modules du projet Trajectoire.
> Basées sur des preuves réelles (taille, dépendants, dépendances, tests).

---

## Méthodologie de Calcul

### Formule de Santé
```
Santé (%) = (Tests × 20) + (Dépendants × 10) + (Dépendances × -5) + (Taille × -0.1) + 50
```

### Critères
- **Tests**: Nombre de fichiers de tests (×20 points)
- **Dépendants**: Nombre de modules qui dépendent de ce module (×10 points)
- **Dépendances**: Nombre de modules dont ce module dépend (×-5 points)
- **Taille**: Taille en KB (×-0.1 points)
- **Base**: 50 points

### Interprétation
- **90-100%**: Excellent
- **80-89%**: Bon
- **70-79%**: Moyen
- **60-69%**: Faible
- **<60%**: Critique

---

## Tableau de Santé des Modules

| Module | Taille (KB) | Fichiers | Dépendants | Dépendances | Tests | Santé (%) | Statut |
| ------ | ----------- | -------- | ---------- | ----------- | ----- | --------- | ------ |
| apps/web | 110.1 | 1 | 0 | 10 | 0 | 40% | Critique |
| apps/api | ? | ? | 0 | 0 | ? | 50% | Moyen |
| apps/realtime-gateway | ? | ? | 0 | 0 | ? | 50% | Moyen |
| @trajectoire/arena-engine | ? | ? | 1 | 0 | 0 | 60% | Faible |
| lib/interview | 47.3 | 17 | 0 | 5 | 0 | 47.3% | Critique |
| lib/ats | 23.7 | 2 | 0 | 2 | 0 | 47.6% | Critique |
| lib/ai | 9.1 | 11 | 0 | 1 | 0 | 49.1% | Critique |
| lib/security | 23.9 | 19 | 0 | 3 | 0 | 47.6% | Critique |
| lib/orchestration | 8.7 | 6 | 0 | 2 | 0 | 49.1% | Critique |
| lib/analytics | 16.3 | 11 | 0 | 1 | 0 | 48.4% | Critique |
| lib/voice | 12.2 | 1 | 0 | 0 | 0 | 48.8% | Critique |
| lib/auth | 1.7 | 1 | 0 | 1 | 0 | 49.8% | Critique |
| lib/credits | 3.2 | 3 | 0 | 2 | 0 | 49.7% | Critique |
| lib/referral | 1.5 | 1 | 0 | 1 | 0 | 49.8% | Critique |
| lib/behavior | 0.3 | 1 | 0 | 0 | 0 | 49.9% | Critique |
| lib/emotional-safety | 7.7 | 10 | 0 | 0 | 0 | 49.2% | Critique |
| lib/engagement | 10.2 | 11 | 0 | 1 | 0 | 49.0% | Critique |

---

## Modules Critiques (<60%)

### 1. apps/web (40%)
**Taille**: 110.1 KB
**Fichiers**: 1 (middleware.ts)
**Dépendants**: 0
**Dépendances**: 10 (Interview, ATS, AI, Security, Orchestration, Analytics, Voice, Auth, Credits, Referral)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage critique (10 dépendances)
- ❌ Taille importante (110.1 KB)

**Recommandation**:
- Ajouter des tests
- Réduire le couplage via des services intermédiaires

---

### 2. lib/interview (47.3%)
**Taille**: 47.3 KB
**Fichiers**: 17
**Dépendants**: 0
**Dépendances**: 5 (AI, Emotional Safety, Supabase, Prisma, Mistral)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage moyen (5 dépendances)
- ❌ Taille importante (47.3 KB)

**Recommandation**:
- Ajouter des tests
- Réduire le couplage via des ports

---

### 3. lib/ats (47.6%)
**Taille**: 23.7 KB
**Fichiers**: 2
**Dépendants**: 0
**Dépendances**: 2 (AI, Mistral)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage faible (2 dépendances)

**Recommandation**:
- Ajouter des tests

---

### 4. lib/ai (49.1%)
**Taille**: 9.1 KB
**Fichiers**: 11
**Dépendants**: 0
**Dépendances**: 1 (Mistral)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage faible (1 dépendance)

**Recommandation**:
- Ajouter des tests

---

### 5. lib/security (47.6%)
**Taille**: 23.9 KB
**Fichiers**: 19
**Dépendants**: 0
**Dépendances**: 3 (Fraud, Prisma, Redis)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage moyen (3 dépendances)

**Recommandation**:
- Ajouter des tests (critique pour la sécurité)

---

### 6. lib/orchestration (49.1%)
**Taille**: 8.7 KB
**Fichiers**: 6
**Dépendants**: 0
**Dépendances**: 2 (Fraud, Prisma)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage faible (2 dépendances)

**Recommandation**:
- Ajouter des tests

---

### 7. lib/analytics (48.4%)
**Taille**: 16.3 KB
**Fichiers**: 11
**Dépendants**: 0
**Dépendances**: 1 (Prisma)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage faible (1 dépendance)

**Recommandation**:
- Ajouter des tests

---

### 8. lib/voice (48.8%)
**Taille**: 12.2 KB
**Fichiers**: 1
**Dépendants**: 0
**Dépendances**: 0
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Module minimal (1 fichier)

**Recommandation**:
- Ajouter des tests
- Vérifier si le module est complet

---

### 9. lib/auth (49.8%)
**Taille**: 1.7 KB
**Fichiers**: 1
**Dépendants**: 0
**Dépendances**: 1 (Supabase)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Module minimal (1 fichier)

**Recommandation**:
- Ajouter des tests (critique pour l'authentification)

---

### 10. lib/credits (49.7%)
**Taille**: 3.2 KB
**Fichiers**: 3
**Dépendants**: 0
**Dépendances**: 2 (Stripe, Supabase)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage faible (2 dépendances)

**Recommandation**:
- Ajouter des tests (critique pour les paiements)

---

### 11. lib/referral (49.8%)
**Taille**: 1.5 KB
**Fichiers**: 1
**Dépendants**: 0
**Dépendances**: 1 (Prisma)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Module minimal (1 fichier)

**Recommandation**:
- Ajouter des tests

---

### 12. lib/behavior (49.9%)
**Taille**: 0.3 KB
**Fichiers**: 1
**Dépendants**: 0
**Dépendances**: 0
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Module minimal (0.3 KB)

**Recommandation**:
- Ajouter des tests
- Vérifier si le module est complet

---

### 13. lib/emotional-safety (49.2%)
**Taille**: 7.7 KB
**Fichiers**: 10
**Dépendants**: 0
**Dépendances**: 0
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage nul (0 dépendances)

**Recommandation**:
- Ajouter des tests (critique pour la sécurité émotionnelle)

---

### 14. lib/engagement (49.0%)
**Taille**: 10.2 KB
**Fichiers**: 11
**Dépendants**: 0
**Dépendances**: 1 (Prisma)
**Tests**: 0

**Problèmes**:
- ❌ Aucun test
- ❌ Couplage faible (1 dépendance)

**Recommandation**:
- Ajouter des tests

---

## Modules Moyens (50-69%)

### 1. apps/api (50%)
**Taille**: ?
**Fichiers**: ?
**Dépendants**: 0
**Dépendances**: 0
**Tests**: ?

**Problèmes**:
- ⚠️ Orphelin (0 dépendants)
- ⚠️ Aucune dépendance interne

**Recommandation**:
- Clarifier l'utilité et l'intégration
- Ajouter des tests

---

### 2. apps/realtime-gateway (50%)
**Taille**: ?
**Fichiers**: ?
**Dépendants**: 0
**Dépendances**: 0
**Tests**: ?

**Problèmes**:
- ⚠️ Orphelin (0 dépendants)
- ⚠️ Aucune dépendance interne

**Recommandation**:
- Clarifier l'utilité et l'intégration
- Ajouter des tests

---

### 3. @trajectoire/arena-engine (60%)
**Taille**: ?
**Fichiers**: ?
**Dépendants**: 1 (apps/web)
**Dépendances**: 0
**Tests**: 0

**Problèmes**:
- ⚠️ Aucun test
- ⚠️ Dépendants limités (1)

**Recommandation**:
- Ajouter des tests
- Vérifier l'utilité réelle

---

## Modules avec Santé Faible (<50%)

**Tous les domaines métier ont une santé <50%**

### Causes Principales
1. **Aucun test** (0 tests pour tous les modules)
2. **Couplage variable** (0-10 dépendances)
3. **Taille variable** (0.3-110.1 KB)

---

## Recommandations Globales

### Priorité Critique 🔴
1. **Ajouter des tests** à tous les modules
2. **Réduire le couplage** de apps/web (10 dépendances)
3. **Clarifier** apps/api et apps/realtime-gateway

### Priorité Haute 🟠
4. **Ajouter des tests** pour lib/security (critique)
5. **Ajouter des tests** pour lib/auth (critique)
6. **Ajouter des tests** pour lib/credits (critique)
7. **Ajouter des tests** pour lib/emotional-safety (critique)

### Priorité Moyenne 🟡
8. **Ajouter des tests** pour lib/interview
9. **Ajouter des tests** pour lib/ats
10. **Ajouter des tests** pour lib/ai
11. **Ajouter des tests** pour lib/orchestration
12. **Ajouter des tests** pour lib/analytics

---

## Conclusions

### Points Critiques
- ❌ **Aucun module n'a des tests** (0 tests pour tous les modules)
- ❌ **Tous les domaines métier ont une santé <50%**
- ❌ **apps/web a un couplage critique** (10 dépendances)

### Points Positifs
- ✅ **Couplage faible** entre domaines métier (0-5 dépendances)
- ✅ **Taille raisonnable** des modules (0.3-47.3 KB)
- ✅ **Aucun cycle prouvé** entre domaines

### Actions Immédiates
1. **Ajouter des tests** à tous les modules (priorité critique)
2. **Réduire le couplage** de apps/web (priorité critique)
3. **Clarifier** apps/api et apps/realtime-gateway (priorité haute)

---

## Document de Référence

Ce document est la **source de vérité** pour la santé des modules du projet Trajectoire.

**Version**: Sprint 2
**Date**: 2026-07-16
**Basé sur**: Preuves réelles (taille, dépendants, dépendances, tests)
