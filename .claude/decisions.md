# Décisions validées — Trajectoire

> Ne pas remettre en question sans accord explicite de l'utilisateur. Source : CLAUDE.md + historique de commits.

## Design
- Fond `zinc-950`, accent `indigo-500` (formulaires auth, onboarding). Ailleurs : tokens sémantiques (`bg-background`, `text-foreground`, `bg-surface`, `border-border`, `primary-*` violet `#7C3AED`) définis dans `tailwind.config.ts` / `src/lib/design-tokens.ts`.
- Couleurs « old-school » (ivoire, ink, bronze, terracotta, forest) réservées au marketing/landing — jamais dans l'app authentifiée.
- Framer Motion sous `MotionConfig reducedMotion="user"` quand utilisé (onboarding).
- Branche de base de la refonte design : `design-system-v2`.
- `tsc --noEmit` après chaque fichier modifié — un build vert ne prouve rien (`next.config.ts` ignore les erreurs TS/ESLint au build).

## Architecture
- Layout onboarding : plein écran, **hors** de `(app)/` (pas de sidebar) — dossier frère, évite toute boucle de redirection avec le layout `(app)`.
- CV à l'onboarding : upload seul via `/api/cv/upload` (extraction texte), **aucune analyse IA** à l'inscription — seul l'indicateur `cvProvided` est enregistré. Formulation UI à conserver telle quelle (voir CLAUDE.md § Onboarding).
- Tokens sombres partagés : `lib/theme/dark-tokens.ts` (utilisé par `(app)/layout.tsx` et `app/onboarding/layout.tsx`).
- AuthorizationV2 : **fail-open** par défaut (route non listée = publique). `/api/onboarding` → explicitement AUTHENTICATED.
- Sessions Realtime (voix WebRTC) : stockées en `Map` mémoire — accepté temporairement, ticket ouvert pour persister avant prod (voir tasks.md).

## Migrations / base de données
- Toute migration additive : `ADD COLUMN IF NOT EXISTS`, jamais destructive sans accord explicite.
- Migration additive à appliquer à Supabase **avant** de déployer le code dont le client Prisma la connaît.
- Toujours `prisma migrate status` avant tout `migrate deploy`. `prisma db pull` réécrit `schema.prisma` : utiliser `db pull --print`.
- Ne jamais rejouer `20260915215555_add_opportunity_id_to_interview_session` (appliquée à la main, résolue via `migrate resolve --applied`, DDL non rejoué, FK non idempotente).
- Ne jamais appliquer de migration sans accord explicite de l'utilisateur.

## Sécurité
- `userId` toujours dérivé de la session serveur (`getVerifiedUserWithRetry`), jamais d'un `userId` envoyé par le client (ex. `CompleteOnboardingSchema` est `strict()` et rejette un `userId` client).
- `prisma.user.updateMany({ where: { id: session } })` — toute écriture utilisateur filtrée par l'id de session, pas par un id de body.
- Ne jamais supprimer la garde `localhost`-only en tête de `PreviewStorageService.test.ts` / `PreviewAnalysisRepository.test.ts` (bloque l'exécution si `DATABASE_URL` ne pointe pas vers une base locale).
- Ne jamais retirer `src/e2e/**` de l'exclusion Vitest (`vitest.config.ts`) ni déplacer ces specs Playwright.

## Intouchable
- `hooks/useVoiceInterview.ts`
- `lib/realtime/`
- `supabase/migrations/*.disabled`

## Tarification (validée le 2026-09-30)
- Grille : FREE 0 € (aperçu CV uniquement, 0 simulation) · PACK 29 € TTC unique (5 simulations, 3 mois) · PRO 19 €/mois (illimité, paiement immédiat, sans essai). Société bulgare, prix TTC.
- PACK = mêmes routes et fonctionnalités que PRO ; seul le quota (5, 3 mois) diffère. `lib/plans.ts` est la source unique.
- Un abonné PRO ne peut pas acheter de Pack ; un Pack actif avec des simulations restantes ne peut pas être racheté.
- Un prix Stripe inconnu ne change jamais le plan (erreur journalisée).
- Toute migration est appliquée **avant** le code qui en dépend, avec accord explicite.

## Module CV / ATS (validé le 2026-10-01)
- Ne jamais afficher de donnée non calculée (pas de valeur par défaut affichée comme un résultat).
- Aperçu gratuit : on ne persiste que le résultat, jamais le texte du CV ; le rattachement au compte est un **lien**, sans copie dans le profil (Option B).
- Analyse complète et réécriture : réservées PACK/PRO, refus (403) avant tout appel IA ; CSRF + rate-limit ; entrées de prompt assainies avec `sanitizeForPrompt`.
- Le `premium-orchestrator` est rejeté ; l'analyse ATS est reconstruite (noyau déterministe + IA pour le qualitatif). Un test de régression impose que « dev senior ↔ offre infirmier » obtienne un score très inférieur à « dev ↔ offre dev ».
