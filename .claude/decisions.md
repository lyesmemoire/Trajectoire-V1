# Décisions validées — Trajectoire

> Ne pas remettre en question sans accord explicite de l'utilisateur. Source : CLAUDE.md + historique de commits.

## Design system « Calm » (2026-10-07) — remplace les règles « premium dark » et « public clair / connecté sombre »
- **Une seule ambiance claire, palette Sauge, sur tout le produit** (site public + espace connecté). Plus de mode sombre : aucune classe `dark:`, plus de `zinc-950` / `indigo-500` / violet `#7C3AED`.
- Palette (variables `--calm-*` dans `globals.css`, classes Tailwind `calm-*`) : fond #FAFAF8, surface #FFFFFF, bordures #E6E4DE / #ECEBE6, encre #1F2A37, secondaire #4B5563, tertiaire #3F4855, accent #2F6B5E, accent-deep #245247, accent-soft #E3EFE9, accent-wash #F1F7F3, accent-line #B9D3C8, avertissement #8A4B16.
- Polices (next/font) : **Figtree** (texte) et **Newsreader italique** (accents, classe `font-accent`) ; remplace « police unique Inter ». Titres en `clamp()` (`text-calm-display/h1/h2/h3`). Rayons 14 / 20 / 30 px.
- **Jamais de rouge vif** : l'avertissement est un brun ambré doux (`calm-warn`). Contraste ≥ 4,5:1, focus visible, cibles ≥ 44 px, Framer Motion doux et coupé sous `prefers-reduced-motion`, typographie française (espaces insécables).
- `lib/theme/dark-tokens.ts` est **déprécié** (retiré au fil de la migration des écrans). Le test `lib/design-invariants.test.ts` impose la palette sur les écrans migrés ; sa liste `PENDING` se vide à chaque lot.
- Les échelles héritées (`primary-*`, `violet`, `ivoire`, `ink`, `bronze`…) sont remappées sur Calm pour ne rien casser : ne pas les utiliser dans du nouveau code.
- **`/signup-conversion` reste une page distincte de `/signup`** (parcours venant de l'aperçu ATS).

## Design (anciennes règles — remplacées par Calm ci-dessus)
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
- Analyse complète enregistrée dans `CVAnalysis` (`atsScoreAfter`, `improvements`, `keywords` = résultat complet) ; `atsScoreBefore` reste `null` tant qu'aucune optimisation n'est appliquée. Une ligne antérieure au moteur n'affiche que son score.

## Thème (validé le 2026-10-02)
- **Site public (marketing, `/analyze`, landing, navbar, footer) : thème clair.** Pas de bascule sombre.
- **Espace connecté (`(app)/*`, `/pricing`, `/onboarding`) : thème sombre zinc-950 / indigo-500**, ne pas y toucher.

## Données personnelles (validé le 2026-10-02)
- **Rétention (option A)** : le texte des CV et les analyses sont conservés tant que le compte existe, supprimés avec lui (`lib/account/purge-user-data.ts`) ; la politique de confidentialité le dit. Pas de purge automatique.
- Suppression de compte : Stripe (abonnement annulé) → données applicatives (transaction) → compte Auth. Les factures restent chez Stripe.
- Realtime : un jeton n'est délivré que pour une session `interview_sessions` en cours de l'utilisateur (créée, donc décomptée, par `/api/simulation/create`).

## Paiement, auth et marque (validé le 2026-10-02)
- **Paiement échoué : période de grâce.** `past_due` conserve les droits PRO ; les relances Stripe suivent leur cours et `customer.subscription.deleted` ramène à FREE. Implémenté dans `plan-access` ; la **durée** de la grâce est réglée par Stripe (relances automatiques), pas par le code.
- **`/signup-conversion` reste une page distincte de `/signup`** : `/signup` = inscription directe (sombre) ; `/signup-conversion` = parcours venant de l'aperçu ATS (clair, OAuth Google/GitHub, contexte de conversion). Ne pas fusionner.
- **Navbar violet = couleur de marque du site public** (token `primary`) : ne pas la passer en indigo. L'indigo est la couleur de l'espace connecté.
- Règles d'authentification communes : mot de passe 8 caractères minimum, e-mail normalisé (`lib/auth/credentials.ts`) ; erreurs Supabase toujours traduites (`lib/auth/auth-errors.ts`), jamais le texte brut.
- `cv_rewrites.analysis_id` relie une réécriture à son analyse (facultatif, cascade) ; `expires_at` ne gouverne que le rejeu idempotent, pas la conservation.

## Sécurité web (validé le 2026-10-02)
- **Middleware fermé par défaut** : `AuthorizationV2` renvoie `NOT_FOUND` (404) pour tout chemin sans règle ; la règle `/` ne couvre que l'accueil ; correspondance à la frontière de segment. `/monitoring`, `/recruiter`, `/__qa__` sont fermés (404) ; `/api/performance/*` est réservé aux administrateurs.
- **CSP : `style-src-attr 'unsafe-inline'`** (option A) : les attributs `style` rendus côté serveur (largeurs de barres) sont autorisés ; `<style>` et scripts restent protégés par nonce. Pas de réécriture des ~51 `style={{}}`. `connect-src` autorise Sentry et PostHog. PostHog n'a pas besoin d'entrée `script-src` (`'strict-dynamic'`).
- **Contrôle d'`Origin`** sur les écritures `/api/*` (webhook Stripe exempté) ; **RLS** activée sur toutes les tables de `public` (`CVAnalysis` : lecture de ses propres lignes).

## Design (validé le 2026-10-02)
- **Police unique : Inter**, chargée par `next/font` (`app/layout.tsx`, variable `--font-inter`), site public et espace connecté. Plus de serif : Fraunces retirée, `font-serif` remplacé par `font-sans`.
- **`/pricing` en thème clair** (site public, violet de marque, tokens sémantiques). `/login` et `/signup` restent en sombre (décision du 2026-10-02 inchangée : à rouvrir seulement sur demande).
- **Navigation de l'espace connecté** : barre latérale à partir de 1024 px, en-tête + tiroir (`AppMobileNav`) en dessous.
