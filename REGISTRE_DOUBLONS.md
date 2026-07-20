# REGISTRE DES DOUBLONS - TRAJECTOIRE
**Date** : 18 juillet 2026
**Basé sur** : scripts/audit-duplicates-simple.ps1

---

## RÉSUMÉ EXÉCUTIF

- **Pages dupliquées** : 4 zones (dashboard, interview, simulation, report)
- **Routes API dupliquées** : 58 routes réparties sur 3 codebases
- **Moteurs HIIOS dupliqués** : 1 moteur (DecisionEngine)
- **Hooks dupliqués** : 40+ hooks répartis sur 4 emplacements
- **Services dupliqués** : 30+ services répartis sur 3 emplacements

---

## PAGES DUPLIQUÉES

### Dashboard
- **Version A** : `legacy/dashboard/page.tsx`
- **Version B** : `packages/arena-engine/apps/web/src/app/dashboard/page.tsx`
- **Version C** : `apps/web/src/app/dashboard/page.tsx`
- **Version à garder** : C (apps/web)
- **Statut** : ⏳ À comparer

### Interview
- **Version A** : `legacy/interview/page.tsx`
- **Version B** : `legacy/interviews/[slug]/page.tsx`
- **Version C** : `packages/arena-engine/app/interview/page.tsx`
- **Version D** : `apps/web/src/app/simulation/page.tsx` (renommé ?)
- **Version à garder** : D (apps/web)
- **Statut** : ⏳ À comparer

### Simulation
- **Version A** : `legacy/simulation/result/page.tsx`
- **Version B** : `packages/arena-engine/app/simulation/result/page.tsx`
- **Version C** : `apps/web/src/app/simulation/page.tsx`
- **Version à garder** : C (apps/web)
- **Statut** : ⏳ À comparer

### Report
- **Version A** : `legacy/dashboard/interview/session/page.tsx`
- **Version B** : `apps/web/src/app/report/[id]/page.tsx`
- **Version à garder** : B (apps/web)
- **Statut** : ⏳ À comparer

---

## ROUTES API DUPLIQUÉES

### Stripe (ABSENT dans apps/web)
- **Version A** : `legacy/api/stripe/checkout/route.ts`
- **Version B** : `legacy/api/stripe/customer-portal/route.ts`
- **Version C** : `legacy/api/stripe/webhook/route.ts`
- **Version apps/web** : ABSENTE
- **Action** : Récupérer la meilleure version → apps/web/src/app/api/stripe/

### CV Analyze (ABSENT dans apps/web)
- **Version A** : `legacy/api/cv/analyze/route.ts`
- **Version B** : `legacy/api/cv/export/route.ts`
- **Version C** : `legacy/api/cv/export-docx/route.ts`
- **Version D** : `legacy/api/cv/rewrite/route.ts`
- **Version apps/web** : ABSENTE
- **Action** : Récupérer la meilleure version → apps/web/src/app/api/cv/

### Auth Callback
- **Version A** : `legacy/auth/callback/route.ts`
- **Version B** : `packages/arena-engine/app/auth/callback/route.ts`
- **Version C** : `apps/web/src/app/api/auth/callback/route.ts`
- **Version à garder** : C (apps/web)
- **Statut** : ⏳ À comparer

### Interview API (12 routes dans legacy)
- **legacy/api/interview/** :
  - analyze/route.ts
  - feedback/route.ts
  - generate/route.ts
  - history/route.ts
  - orchestrate/route.ts
  - premium/continue/route.ts
  - premium/report/route.ts
  - start/route.ts
  - transcribe/route.ts
- **apps/web/src/app/api/interview/** : 1 route
- **Action** : Analyser les 12 routes, garder ce qui manque

### Health Check
- **Version A** : `legacy/api/health/route.ts`
- **Version B** : `packages/arena-engine/app/api/health/route.ts`
- **Version C** : `apps/web/src/app/api/health/route.ts`
- **Version D** : `apps/web/src/app/api/liveness/route.ts`
- **Version E** : `apps/web/src/app/api/readiness/route.ts`
- **Version à garder** : C, D, E (apps/web)
- **Statut** : ⏳ À comparer

### Cron Jobs (ABSENT dans apps/web)
- **Version A** : `legacy/api/cron/check-costs/route.ts`
- **Version B** : `legacy/api/cron/cleanup-transactions/route.ts`
- **Version apps/web** : ABSENTE
- **Action** : Migrer vers apps/web/src/app/api/cron/

### Autres routes legacy (43 au total)
- exec/session
- exec/simulate
- metrics
- optimize
- product/analyze
- product/interview/evaluate
- product/upload
- recovery/send
- register
- speech/transcribe
- test-sentry
- upload
- user/export-data
- user/set-cv-editor-completed
- user-cvs
- waitlist/apply
- robots.txt
- sitemap.xml

---

## MOTEURS HIIOS DUPLIQUÉS

### DecisionEngine (PAS UN DOUBLON - ANALYSÉ)
- **Version A** : `apps/web/src/application/adaptive-intelligence/DecisionEngine.ts`
- **Version B** : `apps/web/src/hiios/engines/DecisionEngine.ts`
- **Statut** : ✅ PAS UN DOUBLON - Objectifs différents
- **Version A** : Orchestrateur UX (Adaptive Intelligence) - 630 lignes
- **Version B** : Décision de recrutement (HIIOS Core) - 669 lignes
- **Action** : AUCUNE - Garder les deux versions
- **Voir analyse détaillée** : `ANALYSE_DECISION_ENGINE.md`

### Autres moteurs (UNIQUES dans apps/web)
- **EvidenceEngine** : `apps/web/src/hiios/engines/EvidenceEngine.ts` ✅
- **HypothesisEngine** : `apps/web/src/hiios/engines/HypothesisEngine.ts` ✅
- **QuestionPlanner** : `apps/web/src/hiios/engines/QuestionPlanner.ts` ✅
- **ReportGenerator** : `apps/web/src/hiios/reporting/ReportGenerator.ts` ✅

---

## HOOKS DUPLIQUÉS

### Hooks racine (hooks/)
- `hooks/use-billing-state.ts`
- `hooks/useCVAnalysis.ts`
- `hooks/useMobileViewport.ts`
- `hooks/useSpeechAnalysis.ts`
- `hooks/useUXFingerprint.ts`
- **Statut** : ❌ MORTS (à archiver)

### Hooks lib/ (lib/)
- `lib/audio/hooks/useAudioRecovery.ts`
- `lib/audio/hooks/useMicrophoneManager.ts`
- `lib/audio/hooks/useSilenceDetection.ts`
- `lib/realtime/useAudioPlayback.ts`
- `lib/flags/use-feature.ts`
- `lib/ml/user.behavioral-memory.ts`
- `lib/progressive-disclosure/user_maturity.ts`
- **Statut** : ❌ MORTS (à archiver)

### Hooks apps/web/src/hooks/ (ACTIFS)
- `apps/web/src/hooks/use-billing-state.ts`
- `apps/web/src/hooks/useCVAnalysis.ts`
- `apps/web/src/hooks/useMobileViewport.ts`
- `apps/web/src/hooks/useSpeechAnalysis.ts`
- `apps/web/src/hooks/useUXFingerprint.ts`
- **Statut** : ✅ ACTIFS (à garder)

### Hooks packages/arena-engine/ (DUPLICATS)
- `packages/arena-engine/hooks/use-billing-state.ts`
- `packages/arena-engine/hooks/useCVAnalysis.ts`
- `packages/arena-engine/hooks/useMobileViewport.ts`
- `packages/arena-engine/hooks/useSpeechAnalysis.ts`
- `packages/arena-engine/hooks/useUXFingerprint.ts`
- `packages/arena-engine/hooks/useAudioRecorder.ts`
- **Statut** : ❌ MORTS (à archiver)

---

## SERVICES DUPLIQUÉS

### Services lib/db/ (RACINE)
- `lib/db/ai-usage.service.ts`
- `lib/db/audit.service.ts`
- `lib/db/billing.service.ts`
- `lib/db/career-profile.service.ts`
- `lib/db/cv.service.ts`
- `lib/db/interview.service.ts`
- `lib/db/prompt.service.ts`
- `lib/db/user.service.ts`
- **Statut** : ❌ MORTS (à archiver)

### Services apps/web/src/lib/db/ (ACTIFS)
- `apps/web/src/lib/db/ai-usage.service.ts`
- `apps/web/src/lib/db/audit.service.ts`
- `apps/web/src/lib/db/billing.service.ts`
- `apps/web/src/lib/db/career-profile.service.ts`
- `apps/web/src/lib/db/cv.service.ts`
- `apps/web/src/lib/db/interview.service.ts`
- `apps/web/src/lib/db/prompt.service.ts`
- `apps/web/src/lib/db/user.service.ts`
- **Statut** : ✅ ACTIFS (à garder)

### Services packages/arena-engine/lib/db/ (DUPLICATS)
- `packages/arena-engine/lib/db/ai-usage.service.ts`
- `packages/arena-engine/lib/db/audit.service.ts`
- `packages/arena-engine/lib/db/billing.service.ts`
- `packages/arena-engine/lib/db/career-profile.service.ts`
- `packages/arena-engine/lib/db/cv.service.ts`
- `packages/arena-engine/lib/db/interview.service.ts`
- `packages/arena-engine/lib/db/prompt.service.ts`
- `packages/arena-engine/lib/db/user.service.ts`
- **Statut** : ❌ MORTS (à archiver)

### Services domain/ (RACINE)
- `domain/user.contract.ts`
- **Statut** : ❌ MORT (à archiver)

### Services apps/web/src/domain/ (ACTIFS)
- `apps/web/src/domain/user.contract.ts`
- **Statut** : ✅ ACTIF (à garder)

### Services packages/arena-engine/domain/ (DUPLICAT)
- `packages/arena-engine/domain/user.contract.ts`
- **Statut** : ❌ MORT (à archiver)

---

## COMPOSANTS UI (DUPLICATS - ANALYSÉS)

### Composants UI - 18 composants dupliqués
- **Version A** : `components/ui/` (16 composants)
- **Version B** : `src/components/ui/` (1 composant Button.tsx)
- **Version C** : `apps/web/src/components/ui/` (16 composants)
- **Version D** : `packages/arena-engine/src/components/ui/` (1 composant Button.tsx)
- **Statut** : ❌ DOUBLONS CONFIRMÉS
- **Version à garder** : C (apps/web/src/components/ui/)
- **Action** : Archiver A, B, D
- **Voir analyse détaillée** : `ANALYSE_COMPOSANTS_UI.md`

**Détails** :
- `components/ui/` et `apps/web/src/components/ui/` sont identiques (16 composants, même taille)
- `src/components/ui/Button.tsx` et `packages/arena-engine/src/components/ui/Button.tsx` sont identiques
- `apps/web/src/components/ui/button.tsx` est plus complet (2169 bytes vs 1408 bytes)

---

## ACTIONS PRIORITAIRES

### P0 - CRITIQUE (Immédiat)
1. **Supprimer hooks racine** : `hooks/` → archiver dans `archive/hooks/`
2. **Supprimer services racine** : `lib/db/` → archiver dans `archive/lib/db/`
3. **Supprimer services arena-engine** : `packages/arena-engine/lib/db/` → archiver
4. **Supprimer hooks arena-engine** : `packages/arena-engine/hooks/` → archiver

### P1 - IMPORTANT (Court terme)
1. **Supprimer composants UI morts** : `components/ui/`, `src/components/ui/`, `packages/arena-engine/src/components/ui/` → archiver
2. **Migrer Stripe routes** : depuis legacy vers apps/web
3. **Migrer CV routes** : depuis legacy vers apps/web
4. **Migrer Cron jobs** : depuis legacy vers apps/web

### P2 - CONFORT (Moyen terme)
1. **Comparer pages** : dashboard, interview, simulation, report
2. **Analyser interview API** : 12 routes legacy vs 1 route apps/web
3. **Nettoyer legacy/** : après migration complète

---

## STATISTIQUES

| Catégorie | Total | Doublons | Uniques apps/web | À archiver |
|-----------|-------|---------|------------------|------------|
| Pages | 4 zones | 4 | 4 | 8 |
| Routes API | 58 | 43 | 15 | 43 |
| Moteurs HIIOS | 5 | 0 | 5 | 0 |
| Hooks | 40+ | 35+ | 5 | 35+ |
| Services | 30+ | 25+ | 8 | 25+ |
| Composants UI | 18 | 18 | 16 | 18 |
| **TOTAL** | **155+** | **125+** | **48** | **129+** |

---

**Prochaine étape** : Créer les scripts de détection automatisée pour confirmer ces doublons et exécuter le nettoyage.
