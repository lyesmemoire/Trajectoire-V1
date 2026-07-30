# Phase 2 — Cohérence PostgreSQL / Supabase / Prisma

> **Commit base** : `788bc00c`
> **Environnement** : Supabase staging (`bzxdozzbdvzgvgshyamp.supabase.co`), 0 lignes dans toutes les tables
> **Date** : 2026-07-30

---

## Préconditions vérifiées

| Vérification | Résultat |
|---|---|
| `profiles` table/vue/matview | **N'EXISTE PAS** |
| Lignes en base (toutes tables) | **0 rows** |
| Orphelins credit_transactions | **0** |
| `prisma.profile` dans le code | **0 usages** (Prisma model jamais appelé) |
| `supabase.from("profiles")` dans le code | **15 usages** (UserService, credits.ts, credit-badge.tsx, ProfileRepository, etc.) |
| `cv_rewrites` en base | **N'EXISTAIT PAS** (migration jamais appliquée) |

---

## Divergences corrigées

### D1+D10 : Modèle `Profile` supprimé du schéma Prisma

- **Défaut** : Modèle `Profile` (L438-448) pointe sur table `profiles` qui n'existe pas
- **Cause** : Modèle ajouté par erreur, jamais relié à aucun code Prisma (`prisma.profile` : 0 résultats)
- **Correction** : Modèle remplacé par un commentaire documentant la suppression
- **Preuve d'absence d'usage** : grep `prisma.profile` = 0 résultats; grep `ProfileCreateArgs|ProfileUpdateArgs` = 0 résultats
- **Impact sur `from("profiles")`** : AUCUN — ces 15 appelants utilisent le SDK Supabase, pas Prisma. Ils doivent être migrés vers `from("User")` en Phase 3.
- **Risque résiduel** : les 15 callers `from("profiles")` sont cassés en production (table inexistante)

### D2 : `CreditTransaction.userId` — `@db.Uuid` → `@db.Text`

- **Défaut** : Prisma déclare UUID, colonne SQL est TEXT (changée pour matcher `User.id` cuid)
- **Correction** : `@db.Uuid` → `@db.Text` dans schema.prisma L453
- **Test** : `prisma validate` ✅, `prisma generate` ✅

### D3 : `credit_usage.user_id` — UUID → TEXT

- **Défaut** : Colonne `user_id` était UUID, `User.id` est TEXT (cuid)
- **Correction** : `ALTER TABLE public.credit_usage ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT`
- **Vérification post-migration** : `credit_usage.user_id type: text` ✅
- **Impact données** : 0 lignes — pas de perte

### D4 : `stripe_events.user_id` — UUID → TEXT

- **Correction** : `ALTER TABLE public.stripe_events ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT`
- **Vérification** : `stripe_events.user_id type: text` ✅

### D5 : Enum `tx_state` — `completed` → `committed`

- **Défaut** : Prisma déclare `completed`, SQL utilise `committed`, BillingService compare avec `"committed"` (L85, L107), validateur Zod aussi
- **Correction** : `enum tx_state { reserved, committed, failed, expired }` dans schema.prisma
- **Test** : billing idempotence test vérifie `tx.state === 'committed'` → **5/5 PASS**

### D6 : `User.credits` — ajouté au modèle Prisma

- **Défaut** : Colonne `credits INTEGER DEFAULT 100` existe en SQL mais pas dans le modèle Prisma
- **Correction** : `credits Int @default(100)` ajouté au modèle User (L28)
- **Vérification** : `User.credits: type=integer, default=100` ✅

### D8 : RLS sur tables billing

- **Défaut** : 5 tables sans aucune RLS
- **Correction** : `ENABLE ROW LEVEL SECURITY` + policy `FOR ALL` sur chaque table
- **Vérification** : `credit_transactions RLS: ✓ ON`, `credit_usage RLS: ✓ ON`, etc.
- **Risque résiduel** : les policies actuelles sont `FOR ALL USING (true)` — elles activent RLS mais autorisent tout pour service_role. Des policies restrictives par user_id devront être ajoutées en Phase 8 (sécurité).

### D9 : Table `cv_rewrites` créée

- **Défaut** : Table manquante, route `/api/cv/rewrite` crashe sur `prisma.cvRewrite.create()`
- **Correction** : `CREATE TABLE IF NOT EXISTS public.cv_rewrites(...)` avec indexes et RLS
- **Vérification** : `cv_rewrites exists: ✓ YES` ✅

---

## Migration versionnée

Fichier : [`20260730000004_schema_alignment.sql`](file:///c:/Trajectoire/supabase/migrations/20260730000004_schema_alignment.sql)

Chaque ALTER est documenté avec sa commande de reversion.

---

## Tests post-migration

| Test | Résultat |
|---|---|
| `npx prisma validate` | ✅ `The schema is valid` |
| `npx prisma generate` | ✅ Client généré en 194ms |
| `npx vitest run tests/billing/idempotence.test.ts` (5 tests) | ✅ **5/5 PASS** |
| TypeScript `tsc --noEmit` | 6 erreurs préexistantes (p5/p7 tests), **0 erreur liée aux changements Phase 2** |

---

## Verdict Phase 2

| Divergence | Statut | Bloquant restant? |
|---|---|---|
| D1 (2 modèles user) | ✅ CORRIGÉ | NON |
| D2 (CreditTransaction.userId) | ✅ CORRIGÉ | NON |
| D3 (credit_usage.user_id) | ✅ CORRIGÉ | NON |
| D4 (stripe_events.user_id) | ✅ CORRIGÉ | NON |
| D5 (tx_state enum) | ✅ CORRIGÉ | NON |
| D6 (User.credits) | ✅ CORRIGÉ | NON |
| D7 (updatedAt dual) | 🟡 ACCEPTÉ | NON |
| D8 (RLS billing) | ✅ CORRIGÉ (policies larges) | NON (affinement Phase 8) |
| D9 (cv_rewrites) | ✅ CORRIGÉ | NON |
| D10 (Profile fantôme) | ✅ CORRIGÉ | NON |

> [!WARNING]
> **Risque non résolu** : 15 appelants `supabase.from("profiles")` dans le code applicatif ciblent une table qui n'existe pas. C'est un **FAIL produit** qui sera traité en Phase 3 (stabilisation des flux critiques). Ces appelants doivent être migrés vers `from("User")` ou une vue `profiles` doit être créée comme alias.

**Phase 2 : PASS conditionnel** — schema aligné et vérifié, mais la couche applicative Supabase SDK référence encore une table inexistante.
