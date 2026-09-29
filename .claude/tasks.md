# Tâches Trajectoire — fichier vivant

> Mis à jour manuellement en session. Pour l'état détaillé (architecture, pièges), voir `CLAUDE.md`.

## En cours
_(rien — dernier item traité : commit `ef30a9a7`)_

## Restant — connu et documenté dans CLAUDE.md
- [ ] Simulation Realtime (`api/interview/realtime-session`, `useRealtimeInterview`) : sessions en `Map` mémoire — non fiable en serverless/multi-instance, à persister avant prod ; pas de quota ni de rate-limit sur cette route

## Terminé ✅ (vérifié par `git log`)
- [x] `route POST /api/onboarding/complete` + règle AuthorizationV2 (`61ff73cc`)
- [x] Onboarding UI — 8 fichiers, layout plein écran + wizard (`721a9c5c`)
- [x] Tests onboarding — schéma Zod + route (`8b15a37c`)
- [x] Migration Prisma `onboardingData`/`onboardingCompletedAt` appliquée à Supabase (`a3d18660`, 2026-09-28)
- [x] Redirect nouveaux utilisateurs vers `/onboarding` (`4901929a`)
- [x] `/simulation` — résolu par `2bb297b8` (postérieur à `34865e31`) : `(app)/simulation/page.tsx` n'a plus de contenu propre, simple `redirect("/simulation/new")` ; la barrière `careerProfile` est devenue un bandeau non bloquant dans `/simulation/new`. Vérifié dans le code le 2026-09-29 : la note « décision ouverte » (garder distinct vs fusionner) documentait un état déjà dépassé avant le début de cette session.
- [x] `/discovery` — indigo local, chips emerald/amber, font-sans (`fae6a0b8`) ; 4 pastilles `bg-zinc-100 text-zinc-900` → `bg-zinc-700 text-zinc-100` (2026-09-29)
- [x] Login / signup — a11y (contraste, aria) (`4d5449d7`, `1dd53533`)
- [x] Button — variantes dark + dark-ghost (`f413b9be`)
- [x] `/history`, `/report`, `/dashboard` — dark tokens (`8b3d0ad8`, `2c0ea136`, `55558ac7`)
- [x] `/api/auth/callback` — échange code → session (`7489042a`)
- [x] `/forgot-password` (`4e741111`)
- [x] `/reset-password` — formulaire nouveau mot de passe, `supabase.auth.updateUser`, redirect `/login` (`ef30a9a7`)
- [x] Audit "Button violet" : sur les 4 fichiers listés, 3 étaient du code mort (jamais importés sous `app/`) → supprimés avec leur cluster complet (`components/ats/*` 11 fichiers + `types/ats.ts`, `components/interview/InterviewResults.tsx` + `CommitteeDecisionReveal.tsx` (dépendance devenue orpheline), `components/cv-editor/CVEditorShell.tsx` + `ExperienceEditor.tsx` + `types/cv.ts`), vérifié par grep récursif avant suppression. Le vrai bug live n'était pas un bouton violet mais `components/premium/PremiumModal.tsx` + `UpgradeCTA.tsx` (rendus 4× sur `/report/[id]`, page déjà dark) : entièrement en thème clair (`bg-white`, `ivoire`, `ink`, `bronze`) — réécrits en JSX + tokens zinc-900/indigo-500/`text-white/80` cohérents avec le reste de `/report`. `tsc --noEmit` et ESLint à 0 sur les deux fichiers. Non vérifié visuellement en navigateur (DB applicative cassée, voir `.env` ci-dessus) : à confirmer visuellement quand la connexion sera rétablie.
- [x] `check-access` — vérifié le 2026-09-29 : **pas d'action nécessaire**. La route (`app/api/auth/check-access/route.ts`) est une API JSON interne (garde `x-internal-request === 'middleware'`), jamais appelée par `middleware.ts` ni par aucun composant client (grep récursif sur `apps/web/src`) — son commentaire d'en-tête ("Appelée par le middleware") est obsolète. Ses seuls appelants sont des tests e2e qui attendent du JSON. Y ajouter un `redirect()` casserait ce contrat sans jamais atteindre le navigateur. La redirection `/onboarding` demandée existe déjà, correctement, via `(app)/layout.tsx` + `lib/onboarding/shouldRedirectToOnboarding.ts` (`4901929a`).
- [x] `components/premium/BlurOverlay.tsx` supprimé — confirmé mort par grep récursif (aucun importeur), ne cassait rien d'autre (`7619b60e`)
- [x] `.env` `DATABASE_URL`/`DIRECT_URL` — corrigés par l'utilisateur le 2026-09-29 : mot de passe pooler mis à jour dans `DATABASE_URL`, et `DIRECT_URL` repointé de l'hôte direct (DNS injoignable depuis cet environnement) vers le pooler en mode session (`aws-0-eu-west-1.pooler.supabase.com:5432`). `prisma migrate status` confirme : connecté, 8 migrations, schéma à jour.
- [x] Vitest groupe A — 2 suites bloquées par la garde `[SAFETY]` localhost-only : comportement voulu, confirmé une fois la DB distante reconnectée (la garde se déclenche exactement comme prévu). Rien à corriger.
- [x] Vitest groupe D — 2 bugs réels corrigés (`7eb87810`) : `sanitizeUrl` (`lib/security/ssrf.ts`) validait l'URL brute avant de retirer `user:pass@`, or `validateUrl` rejette tout `@` (anti-redirection) → toujours `null` dès qu'il y avait des identifiants à nettoyer. Fix : nettoyer d'abord, valider le résultat nettoyé. `report-generator.test.ts` (R5) attendait que le hash sha256 du PDF contienne le score en clair, structurellement impossible pour un vrai hash — c'est le test qui avait tort, pas `generatePDF` ; remplacé par une vraie vérification de cohérence inter-formats (`summary.globalScore` == `exports.json.evaluation.score` == `input.evaluation.score`). Les deux fichiers passent à 100 % (60/60) après fix.
- [x] Vitest groupe B — `PreviewTokenManager.test.ts` (6/6, `f3d557ce`) : `jsdom` n'est pas une dépendance du projet (`@vitest-environment jsdom` aurait échoué au chargement) ; le code source ne touche jamais au DOM (juste `typeof window !== 'undefined'` + le global `sessionStorage` nu), donc stubbé `window`/`sessionStorage` via `vi.stubGlobal` plutôt que d'ajouter jsdom pour un besoin qui n'existe pas.
- [x] Vitest groupe C — `centralized-rate-limit.service.test.ts` (20/20, `469cfc5d`) : 3 bugs empilés, révélés un par un. (1) `initializeRedis()` n'appelait jamais `new Redis(...)` faute de `UPSTASH_REDIS_REST_URL`/`TOKEN` → `vi.stubEnv`. (2) le mock `Redis` utilisait une fonction fléchée, non constructible → fonction classique. (3) **bug réel de production** : une fois `burstCount >= burstLimit`, `slidingWindowCheck()` ne bloquait pas, il retombait sur la vérification de la fenêtre principale qui autorisait si elle n'était pas pleine — le burst limit n'avait donc aucun effet une fois dépassé ; fix dans `centralized-rate-limit.service.ts` (bloquer immédiatement). Le test utilisait aussi un burst (75) ne correspondant pas au vrai `burstLimit` de `RouteType.API` (150) — corrigé. Enfin, `should log errors when Redis fails` espionnait `console.error` au lieu de `logger.error` (pino n'écrit jamais via `console.error`) — corrigé.

**Suite Vitest complète : 608/608 tests passent** (hors les 2 suites du groupe A, bloquées par la garde `[SAFETY]` localhost-only par design).
