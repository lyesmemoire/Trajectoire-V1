# Tâches Trajectoire — fichier vivant

> Mis à jour manuellement en session. Pour l'état détaillé (architecture, pièges), voir `CLAUDE.md`.

## En cours
_(rien — dernier item traité : commit `ef30a9a7`)_

## Restant — connu et documenté dans CLAUDE.md
- [ ] 🔴 **Décision requise** — `/simulation` (`(app)/simulation/page.tsx`, déjà restylée dark, `34865e31`) : garder comme formulaire distinct de `/simulation/new` (niveaux Junior/Mid/Senior, durées 15/30/45, sans opportunité) ou fusionner. Question de produit/architecture, pas de design — à trancher explicitement avant tout refactor (~10 min de décision, ~2h de refacto si fusion). Pas de page "liste" séparée : `/simulation` est cette page.
- [ ] Simulation Realtime (`api/interview/realtime-session`, `useRealtimeInterview`) : sessions en `Map` mémoire — non fiable en serverless/multi-instance, à persister avant prod ; pas de quota ni de rate-limit sur cette route
- [ ] `.env` — `DATABASE_URL` (pooler, utilisé par le client Prisma applicatif) a un mot de passe périmé/erroné, rejeté par le pooler (`DIRECT_URL` fonctionne) ; toute requête Prisma applicative échoue tant que ce n'est pas corrigé (diagnostic complet dans CLAUDE.md, § État en cours)
- [ ] Vitest : 49 tests en échec hors onboarding (`rate-limiting` exige Redis, `PreviewTokenManager` exige `window`, `ssrf`, hash `core/p7`) — connu, non traité

## Terminé ✅ (vérifié par `git log`)
- [x] `route POST /api/onboarding/complete` + règle AuthorizationV2 (`61ff73cc`)
- [x] Onboarding UI — 8 fichiers, layout plein écran + wizard (`721a9c5c`)
- [x] Tests onboarding — schéma Zod + route (`8b15a37c`)
- [x] Migration Prisma `onboardingData`/`onboardingCompletedAt` appliquée à Supabase (`a3d18660`, 2026-09-28)
- [x] Redirect nouveaux utilisateurs vers `/onboarding` (`4901929a`)
- [x] `/simulation` (legacy) restylée dark, sans redirection (`34865e31`)
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
