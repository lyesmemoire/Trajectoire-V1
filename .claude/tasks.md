# Tâches Trajectoire — fichier vivant

> Mis à jour manuellement en session. Pour l'état détaillé (architecture, pièges), voir `CLAUDE.md`.

## En cours
- [ ] Committer `apps/web/src/app/reset-password/page.tsx` (fait, non commité)

## Restant — connu et documenté dans CLAUDE.md
- [ ] `/simulation` (page legacy) : décision ouverte — garder comme formulaire distinct de `/simulation/new` (niveaux Junior/Mid/Senior, durées 15/30/45, sans opportunité) ou fusionner
- [ ] `/discovery` : écarts esthétiques non traités — accent `primary` violet non surchargé en dark (`lib/theme/dark-tokens.ts`), 4 usages `bg-foreground text-background` (pastilles/boutons gris clair), `bg-success/8`/`bg-warning/8` hors échelle Tailwind, titre en `font-serif`
- [ ] Simulation Realtime (`api/interview/realtime-session`, `useRealtimeInterview`) : sessions en `Map` mémoire — non fiable en serverless/multi-instance, à persister avant prod ; pas de quota ni de rate-limit sur cette route
- [ ] `.env` — `DATABASE_URL` (pooler, utilisé par le client Prisma applicatif) a un mot de passe périmé/erroné, rejeté par le pooler (`DIRECT_URL` fonctionne) ; toute requête Prisma applicative échoue tant que ce n'est pas corrigé (diagnostic complet dans CLAUDE.md, § État en cours)
- [ ] Vitest : 49 tests en échec hors onboarding (`rate-limiting` exige Redis, `PreviewTokenManager` exige `window`, `ssrf`, hash `core/p7`) — connu, non traité

## Après redesign complet
- [ ] Audit Button violet — usages non restylés du variant par défaut/`primary` dans `components/ats/ATSFooter.tsx`, `components/interview/InterviewResults.tsx`, `components/cv-editor/CVEditorShell.tsx`, `components/cv-editor/ExperienceEditor.tsx`, `components/premium/*` (vérifié par grep, 2026-09-29)
- [ ] `check-access` (`app/api/auth/check-access/route.ts`) : ajouter la redirection vers `/onboarding` si `!onboardingCompleted` — actuellement la route lit `onboardingCompleted` mais ne redirige pas (seul `(app)/layout.tsx` le fait, voir CLAUDE.md § Onboarding)

## Terminé ✅ (vérifié par `git log`)
- [x] `route POST /api/onboarding/complete` + règle AuthorizationV2 (`61ff73cc`)
- [x] Onboarding UI — 8 fichiers, layout plein écran + wizard (`721a9c5c`)
- [x] Tests onboarding — schéma Zod + route (`8b15a37c`)
- [x] Migration Prisma `onboardingData`/`onboardingCompletedAt` appliquée à Supabase (`a3d18660`, 2026-09-28)
- [x] Redirect nouveaux utilisateurs vers `/onboarding` (`4901929a`)
- [x] `/simulation` (legacy) restylée dark, sans redirection (`34865e31`)
- [x] `/discovery` — indigo local, chips emerald/amber, font-sans (`fae6a0b8`)
- [x] Login / signup — a11y (contraste, aria) (`4d5449d7`, `1dd53533`)
- [x] Button — variantes dark + dark-ghost (`f413b9be`)
- [x] `/history`, `/report`, `/dashboard` — dark tokens (`8b3d0ad8`, `2c0ea136`, `55558ac7`)
- [x] `/api/auth/callback` — échange code → session (`7489042a`)
- [x] `/forgot-password` (`4e741111`)
- [x] `/reset-password` — formulaire nouveau mot de passe, `supabase.auth.updateUser`, redirect `/login` (session courante, non commité)
