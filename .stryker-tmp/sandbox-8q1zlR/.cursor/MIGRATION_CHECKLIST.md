# Checklist de Migration — Trajectoire Cursor Rules V2

Ordre par impact sécurité décroissant.

## Priorité 1 — Bloquant Sécurité ✅

- [x] `apps/web/src/app/api/interviews/[id]/report/route.ts`
  - Remplacer `createClient(serviceRoleKey)` par `createClient()` cookie-based
  - Le service role ne doit jamais lire des données user-facing
- [x] Créer `apps/web/src/lib/billing/get-user-subscription.ts`
  - Centralise les vérifications de droits
  - Source : Stripe webhooks → `user_usage` → retour typé Zod
  - Remplacer progressivement les vérifications inline ad hoc

## Priorité 2 — LLM Output sans Zod ✅

- [x] `app/api/interview/premium/report/route.ts`
  - `generateObject` + `PremiumReportSchema`
  - `readiness_level` calculé par `computeReadinessLevel()` (TypeScript pur)
  - `overall_score` calculé par `computeOverallScore()` (TypeScript pur)
  - Cible : `interview_sessions` + `interview_responses` (RLS cookie-based)

- [x] `app/api/interview/premium/continue/route.ts`
  - `generateObject` + `ContinueSessionSchema`
  - Historique d'échanges passé en contexte
  - Suppression du streaming SSE + `JSON.parse` dans `updateMemory`

- [x] `app/api/ats/route.ts`
  - `generateObject` + `AtsAnalysisSchema` (analyse CV vs offre — contrat API préservé)
  - `normalizeSkills()` appliqué post-extraction (déterministe)
  - Input validé avec Zod (`cvId`, `jobDescription`)

## Nouveaux fichiers créés

- `lib/interview/schemas/premium-report.schema.ts`
- `lib/interview/schemas/continue-session.schema.ts`
- `lib/ats/schemas/job-extraction.schema.ts` (extraction offre — prêt pour routes futures)
- `lib/ats/schemas/ats-analysis.schema.ts` (sortie LLM `/api/ats`)

## Priorité 3 — Scoring LLM Numérique (suivant)

- [ ] `app/api/interview/feedback/route.ts`
  - `parsed.overallScore` (LLM) → calcul TypeScript
  - Référence : `packages/arena-engine/lib/analytics/interview.engine.ts`
- [ ] Audit complet des routes qui lisent un score numérique depuis LLM
  - `grep "overallScore\|overall_score" app/api/`

## Priorité 4 — Variables d'Environnement

- [ ] `grep -r "process\.env\." apps/web/src/app/api/`
  - Chaque occurrence → import depuis `lib/env.server.ts`
- [ ] Ajouter dans `lib/env.server.ts` les vars manquantes avec Zod

## Priorité 5 — Input Zod Manquant

- [ ] `grep -rL "safeParse\|parseAsync" app/api/`
  - Lister les routes sans validation Zod input
  - Ajouter `RequestSchema.safeParse()` en tête de chaque handler
