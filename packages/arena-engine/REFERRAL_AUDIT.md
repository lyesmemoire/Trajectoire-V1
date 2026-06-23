# Referral System Audit

**Status: IMPLEMENTED (Supabase-native)**
**Prisma legacy: REMOVED**
**Anti-fraud: ACTIVE**
**Reward condition: FIRST CREDIT USAGE**

---

## Referral Generation
**Status: OK**
Le code referral est généré côté backend uniquement via la RPC `generate_referral_code(p_user_id)` au moment de l'inscription (`/api/register`). Le code est un hash SHA-256 tronqué (8 caractères, uppercase), garanti unique par contrainte `UNIQUE` sur `profiles.referral_code`. Idempotent : si le code existe déjà, il est retourné sans modification.

## Attribution Security
**Status: OK**
L'attribution est résolue **exclusivement côté backend** via la RPC `process_referral_attribution`. Le query param `?ref=CODE` est capturé dans le formulaire de signup, transmis au backend, puis validé par la fonction SQL. Le frontend ne peut pas truquer l'attribution.

## Fraud Resistance
**Status: OK**
Protections implémentées dans la fonction SQL :
- **Auto-referral bloqué** : `IF v_referrer_id = p_new_user_id`
- **Double attribution bloquée** : `IF referred_by IS NOT NULL`
- **Code invalide rejeté** : lookup `WHERE referral_code = p_referral_code` renvoie `invalid_code`
- **Reward idempotent** : le reward est tracé dans `credit_ledger` avec `reference_id = filleul_id`, empêchant le double crédit.

## Reward Logic
**Status: OK**
Le reward n'est **pas** donné au signup. Il est déclenché uniquement lorsque le filleul consomme son **premier crédit** (ATS ou Optimize). La RPC `reward_referrer_on_first_usage` vérifie dans `credit_ledger` qu'aucun reward n'a déjà été donné pour ce filleul avant de créditer le parrain (+2 crédits).

## Data Model Integrity
**Status: OK**
Source de vérité unique : `profiles` (Supabase).
- `profiles.referral_code TEXT UNIQUE` — code du parrain
- `profiles.referred_by UUID` — FK vers le parrain
- `profiles.referral_count INT` — compteur atomique

Le modèle Prisma `User` conserve les anciens champs (`referralCode`, `referredBy`, `referralCount`) dans le schéma mais ils ne sont plus utilisés par aucun code applicatif. Le `referral-engine.ts` a été entièrement réécrit pour utiliser Supabase exclusivement.

## Critical Risks
Aucun risque critique restant.

## Fichiers modifiés
1. **[NEW]** `supabase/migrations/015_referral_migration.sql` — Schéma + fonctions RPC atomiques
2. **[REWRITTEN]** `lib/referral/referral-engine.ts` — Engine 100% Supabase
3. **[MODIFIED]** `app/api/register/route.ts` — Hook referral dans le signup
4. **[MODIFIED]** `app/auth/signup/page.tsx` — Capture `?ref=CODE`
5. **[REWRITTEN]** `app/dashboard/referral/page.tsx` — UI réelle depuis profiles
6. **[MODIFIED]** `app/api/ats/route.ts` — Hook reward conditionnel
7. **[MODIFIED]** `app/api/optimize/route.ts` — Hook reward conditionnel
