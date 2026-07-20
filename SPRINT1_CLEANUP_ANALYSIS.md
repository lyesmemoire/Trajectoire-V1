# Sprint 1 — Nettoyage de l'Application

> Analyse des routes en double et éléments manquants
> Date: 2026-07-17

---

## Objectif

Fusionner définitivement `app/` dans `apps/web/src/app/`.
Supprimer les routes en double.
Corriger toutes les importations et les liens.

---

## Analyse des Routes en Double

### Comparaison app/ vs apps/web/src/app/

| Route | app/ (ancienne) | apps/web/src/app/ (nouvelle) | Statut |
|-------|-----------------|-------------------------------|--------|
| **dashboard** | ✅ (15 items) | ✅ (8 items) | ⚠️ Double |
| **interview** | ✅ (4 items) | ✅ (2 items) | ⚠️ Double |
| **simulation** | ✅ (3 items) | ✅ (1 item dans dashboard/) | ⚠️ Double |
| **onboarding** | ✅ (2 items) | ❌ | 🔴 Manquant |
| **auth** | ✅ (6 items) | ✅ (1 item) | ⚠️ Partiel |
| **cv** | ✅ (3 items) | ✅ (1 item) | ⚠️ Partiel |
| **admin** | ✅ (19 items) | ✅ (6 items) | ⚠️ Partiel |
| **api** | ✅ (54 items) | ✅ (4 items) | ⚠️ Partiel |

---

## Éléments Manquants dans apps/web/src/app/

### Dashboard (app/dashboard/)

| Élément | Fichiers | Priorité |
|---------|----------|----------|
| dashboard/ats/ | client.tsx (50KB), page.tsx | 🟠 |
| dashboard/career-dna/ | (1 item) | 🟢 |
| dashboard/credits/ | (2 items) | 🟠 |
| dashboard/interview/ | (3 items) | 🔴 |
| dashboard/optimize/ | (1 item) | 🟢 |
| dashboard/progress/ | (1 item) | 🟢 |
| dashboard/referral/ | (1 item) | 🟢 |
| dashboard/upload/ | (1 item) | 🟢 |

### Simulation (app/simulation/)

| Élément | Fichiers | Priorité |
|---------|----------|----------|
| simulation/result/ | page.tsx (6KB) | 🔴 |
| simulation/reveal/ | (1 item) | 🟢 |

### Autres (app/)

| Élément | Fichiers | Priorité |
|---------|----------|----------|
| onboarding/ | layout.tsx, page.tsx (11KB) | 🔴 |
| cv-editor/ | (1 item) | 🟢 |
| cv-templates/ | (3 items) | 🟢 |

---

## Routes en Double à Nettoyer

### 1. Dashboard

**app/dashboard/** (ancienne):
- ats/, career-dna/, credits/, interview/, optimize/, progress/, referral/, upload/
- layout.tsx, loading.tsx, page.tsx

**apps/web/src/app/dashboard/** (nouvelle):
- evaluation/, plan/, rapport/, report/, simulation/
- layout.tsx, page.tsx

**Action**: Fusionner les éléments manquants de app/dashboard/ vers apps/web/src/app/dashboard/

---

### 2. Interview

**app/interview/** (ancienne):
- [sessionId]/ (3 items)
- page.tsx

**apps/web/src/app/interview/** (nouvelle):
- [sessionId]/ (1 item)
- page.tsx

**Action**: Fusionner les éléments manquants de app/interview/ vers apps/web/src/app/interview/

---

### 3. Simulation

**app/simulation/** (ancienne):
- page.tsx
- result/ (page.tsx)
- reveal/ (1 item)

**apps/web/src/app/dashboard/simulation/** (nouvelle):
- page.tsx (54KB)

**Action**: Fusionner app/simulation/result/ vers apps/web/src/app/dashboard/result/

---

## Plan de Fusion

### Étape 1: Fusionner les éléments manquants (priorité 🔴)

1. **onboarding/** → apps/web/src/app/onboarding/
2. **dashboard/interview/** → apps/web/src/app/dashboard/interview/
3. **simulation/result/** → apps/web/src/app/dashboard/result/

### Étape 2: Fusionner les éléments manquants (priorité 🟠)

4. **dashboard/ats/** → apps/web/src/app/dashboard/ats/
5. **dashboard/credits/** → apps/web/src/app/dashboard/credits/

### Étape 3: Fusionner les éléments manquants (priorité 🟢)

6. **dashboard/career-dna/** → apps/web/src/app/dashboard/career-dna/
7. **dashboard/optimize/** → apps/web/src/app/dashboard/optimize/
8. **dashboard/progress/** → apps/web/src/app/dashboard/progress/
9. **dashboard/referral/** → apps/web/src/app/dashboard/referral/
10. **dashboard/upload/** → apps/web/src/app/dashboard/upload/
11. **simulation/reveal/** → apps/web/src/app/dashboard/reveal/
12. **cv-editor/** → apps/web/src/app/cv-editor/
13. **cv-templates/** → apps/web/src/app/cv-templates/

### Étape 4: Nettoyer les routes en double

14. Supprimer dashboard/rapport/ (garder dashboard/report/)
15. Nettoyer les imports et liens

### Étape 5: Archiver l'ancienne structure

16. Renommer app/ en legacy/

---

## Livrables Attendus

✅ Une seule arborescence Next.js (apps/web/src/app/)
✅ Aucune route dupliquée
✅ Toutes les pages accessibles
✅ Plus de confusion entre ancienne et nouvelle structure

---

## Statut

**En cours**: Analyse des routes en double
**Prochaine étape**: Fusionner les éléments manquants (priorité 🔴)
