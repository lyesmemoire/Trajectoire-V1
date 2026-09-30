# CLAUDE.md — Trajectoire / StudioEntretien

Contexte de travail pour Claude Code. Rédigé à partir de l'exploration du dépôt (code + `package.json` + configs). Les documents Markdown de la racine sont **en grande partie périmés** (voir « Sources de vérité »).

## Fichiers de contexte — lire au démarrage

- `.claude/tasks.md` — tâches en cours et terminées (mise à jour manuelle en session, ne pas déduire du seul historique git)
- `.claude/decisions.md` — décisions validées, à ne jamais remettre en question sans accord explicite

Ces deux fichiers sont un complément de suivi, pas une deuxième source de vérité sur l'architecture : en cas d'écart avec le reste de ce document, vérifier dans le code plutôt que dans l'un ou l'autre. L'état détaillé du produit reste dans « État en cours » ci-dessous.

## Produit

Plateforme SaaS francophone de préparation aux entretiens d'embauche et d'optimisation de CV, pilotée par IA :

- **Simulation d'entretien** (texte + voix) avec un recruteur IA (persona « Alexandra »), rapport détaillé en fin de session.
- **Analyse CV / ATS**, réécriture de CV, matching CV ↔ offre.
- **Opportunités** (offres suivies, workspace de candidature, banque d'histoires / mémoire de carrière) et **Discovery** (flux d'offres ingérées depuis des sources externes, score de confiance, liveness).
- **Copilot** (chat), graphe de connaissances, dashboard, historique, abonnements Stripe + crédits.

Langue du produit et du code métier : **français** (UI, prompts, commentaires). Le code technique (noms de symboles) est en anglais.

## Monorepo

pnpm 9.15.9, Node >= 22. `pnpm-workspace.yaml` : `apps/*` et `packages/*`. Le `package.json` racine (`name: studioentretien`, `type: module`) porte les scripts globaux.

```
C:\Trajectoire
├─ apps/
│  ├─ web/               ★ App Next.js 15 active (package "web") — TOUT le produit vit ici
│  ├─ api/               Backend NestJS 11 (orchestrateur, Bull, Passport/JWT, OTel) — peu/pas relié à web
│  └─ realtime-gateway/  Gateway vocale Fastify + WebSocket (Deepgram STT, ElevenLabs TTS, werift)
├─ packages/
│  ├─ realtime-core/     @trajectoire/realtime-core
│  ├─ execution-core/    @trajectoire/execution-core
│  └─ hiios-*/           (tsconfig seulement) — squelettes
├─ core/p5, core/p6      Anciens moteurs déterministes (p5/p6/p7), dupliqués aussi dans apps/web/src/core
├─ prisma/               schema.prisma (1600+ lignes) + migrations/
├─ supabase/             migrations SQL + patches (schéma historique, RLS)
├─ tests/                Tests racine (vm/, runtime/, replay/, phase-a*/, release-readiness/, e2e/…)
├─ scripts/              Centaines de scripts (audit, codemods, migrations, exec-00x…) — one-shots
├─ certification/, laboratory/  Pipeline de certification / mutation / PBT (fichiers .cjs)
├─ domain/, services/, lib/, gateway/, sil/  Vestiges racine (petits, legacy). Ne pas y ajouter de code.
├─ architecture/, api/openapi.yaml, k8s/, deploy/, docker-compose*.yml, Dockerfile.gateway
└─ .github/workflows/    ci-cd.yml, certification*.yml, runtime-cert.yml, deploy-k8s.yml, …
```

> Il n'y a **plus** de `app/` ni de `components/` à la racine, malgré ce que disent README/ARCHITECTURE. L'app Next.js est `apps/web`.

## App web (`apps/web`) — le cœur

Next.js **15.5.24** (App Router), React 19, TypeScript strict, Tailwind 3.4 (tokens sémantiques CSS `hsl(var(--…))`), Supabase SSR, Prisma (schéma partagé `../../prisma/schema.prisma`), Stripe, Upstash Redis, Sentry, PostHog, Vercel AI SDK / OpenAI.

> ⚠️ `apps/web/AGENTS.md` (importé par `apps/web/CLAUDE.md`) : cette version de Next a des changements cassants. **Lire le guide pertinent dans `apps/web/node_modules/next/dist/docs/` avant d'écrire du code Next.js.**

Alias : `@/*` → `apps/web/src/*`.

### Routage (`src/app`)

- `(marketing)/` : `analyze`, `contact`, `privacy`, `terms`, layout marketing. `page.tsx` = landing.
- `(app)/` : espace authentifié — `dashboard`, `simulation` (`new`, `[id]`), `interview`, `history`, `report/[id]`, `opportunities` (`new`, `[id]`, `[id]/workspace`), `discovery`, `knowledge`, `matching`, `settings`. Layout `(app)/layout.tsx` (sidebar/topbar).
- Hors groupes : `admin/*` (adaptive-intelligence, ai-operating-system, ai-quality, analytics, cognitive), `copilot`, `recruiter`, `search`, `monitoring`, `signup-conversion`, `dashboard/`, `login`, `logout`, `__qa__`.
- `api/*` (Route Handlers) : `auth`, `account`, `analytics`, `career-memory`, `cv` (`analyze`/`rewrite`/`upload`), `discovery` (+`sources`, `ingest`, `[id]/promote`), `health` (`liveness`/`readiness`), `interview` (`realtime-session`, `realtime-message`), `knowledge`, `matching`, `opportunities/[id]/*` (analyze, memories, stories, workspace, application-context), `public/preview` + `public/analyze-preview` (tunnel anonyme → claim après signup), `quota`, `report/generate`, `simulation` (`create`, `message`, `end`, `audio-upload`, `audio-replay`, `[id]`), `stories`, `stripe` (`checkout`, `webhook`, `customer-portal`), `user/subscription`.

### Middleware (`src/middleware.ts`, ~900 lignes)

Supabase SSR + `AuthorizationV2` (rôles/plans), CORS, contrôle d'`Origin` des écritures `/api/*` (`lib/security/origin-guard`, webhook Stripe exempté), CSRF (`lib/security/csrf-middleware`), nonce CSP, correlation-id. Listes explicites : `PUBLIC_PAGE_ROUTES`, `PUBLIC_API_PREFIXES` (`/api/auth`, `/api/public`, `/api/health`) et `AUTHENTICATED_PAGE_PREFIXES` (`/dashboard`, `/history`, `/simulation`, `/report`, `/interview`, `/knowledge`, `/matching`, `/settings`, `/onboarding`, `/copilot`, `/opportunities`, `/discovery`). **Toute nouvelle page ou route API doit recevoir une règle explicite dans `ROUTE_RULES` de `lib/authorization/AuthorizationV2.ts`** (PUBLIC / AUTHENTICATED / ADMIN), sinon elle répond 404 : le test `route-coverage.test.ts` échoue tant qu'elle n'en a pas. Une page privée s'ajoute aussi à `AUTHENTICATED_PAGE_PREFIXES`. La CSP est construite par `lib/security/csp.ts`.

### Couches (`src/`)

| Dossier | Rôle |
|---|---|
| `app/` | Pages + Route Handlers (fins : validation → service → réponse) |
| `application/` | Services applicatifs : `services/` (`SimulationService`, `ConversationService`, `ReportService`, `AccountService`), `hiios/`, `interview-context/`, `interview-strategy/`, `adaptive-*`, `ai-quality/`, `ai-operating-system/`, `human-presence/`, `cognitive-intelligence/`, `analytics/`, … |
| `domain/` | Entités (`Session`, `ConversationState`, …), contrats (`*.contract.ts`), modèle `cognitive/` (Fact, Evidence, Hypothesis, KnowledgeGraph…) |
| `infrastructure/` | `di/` (Container + `bootstrap.ts`, tokens `ServiceTokens`), `repositories/` (Session/Message/Report/Profile), `transactions/SupabaseTransactionManager` |
| `core/` | `interfaces`, `errors` (`AppError`, `ErrorCode`), `http` (`ApiResponseBuilder`), `idempotency`, et moteurs `p6/` (voice, transport, orchestrator) / `p7/` (scoring, ranking, report, explainability) |
| `lib/` | Infra + domaines : `auth`, `authorization`, `security` (CSRF, SSRF, rate-limit, fraud, sanitizers, audit), `supabase` (client/server/service), `prisma`, `stripe`, `redis`, `ai` (client, model-router, rag, cv-rewriter), `interview` (engine, personas, prompts, state machine), `opportunities`, `discovery`, `ats`, `credits`, `quota`, `preview*`, `resilience` (circuit breaker, clients résilients), `performance`, `monitoring`, `analytics`, `realtime`/`voice`/`audio`, `env.server.ts`/`env.client.ts` (validation zod) |
| `components/` | UI par domaine : `ui/` (primitives), `app/`, `dashboard/`, `interview/`, `ats/`, `analyze/`, `opportunities/`, `discovery/`, `matching/`, `copilot/`, `recruiter/`, `search/`, `marketing/`, `report/`, `replay/`, `cv-editor/`… |
| `hooks/`, `services/`, `types/`, `validation/` (schémas zod), `emails/` (react-email), `i18n/fr.ts`, `styles/`, `e2e/` | |

Pattern d'une requête typique : Route Handler → `getVerifiedUserWithRetry()` (`lib/auth/verified-user`) → validation zod (`@/validation`) → quota/rate-limit/idempotence → service applicatif résolu via `Container` (`initializeContainer`/`bootstrapContainer`) → repository Supabase/Prisma → `ApiResponseBuilder`. Réponses d'erreur au format `{ success:false, data:null, error:{code,message} }`.

### HIIOS (moteur cognitif d'entretien) — `src/application/hiios/`

Kernel par couches : `layer0-kernel` (KernelState, Bayesian/Confidence/Contradiction/Evidence/Hypothesis/Bias/Memory/Timeline engines, `QuestionPlanner`, `SkillGraph`), `layer1-identity`, `layer2-reasoning`, `layer3-competence`, `layer4-state` (InterviewStateMachine), `layer5-decision`, `layer6-growth`, `layer7-explainability`, `layer8-learning`, `formatters/ReportFormatter.fr.ts`. Interfaces dans `hiios/interfaces/`. `CVHIIOSBridge` relie l'analyse CV au kernel.

### Flux d'entretien

1. `POST /api/simulation/create` → `SimulationService` (validation, rate-limit, quota, audit, transaction) → session `SimulationSession`/`InterviewSession`.
2. Texte : `POST /api/simulation/message` → `ConversationService` → `InterviewService`/`AIClient` (OpenAI/Mistral via `lib/ai`), `UnifiedInterviewContextService` injecte CV/offre/opportunité.
3. Voix (3 chemins coexistent) :
   - **Gateway** `apps/realtime-gateway` (WS binaire PCM 16 kHz, Deepgram + ElevenLabs), hook `useVoiceInterview`, rewrite `/api/gateway/*` → `NEXT_PUBLIC_GATEWAY_URL` (défaut `http://localhost:3001`).
   - ~~Routes Next `/api/interview/transcribe`, `/speak`, `/realtime-transcription`~~ **supprimées le 2026-10-02** (audit de sécurité : accessibles à tout utilisateur connecté, sans plan ni limite, coût non borné). Le hook `useVoiceInterview` (intact) et `useSpeechAnalysis` les appellent encore mais aucune page ne les importe.
   - **OpenAI Realtime WebRTC** (commit `8cdcad24`) : `POST /api/interview/realtime-session` (token éphémère + kernel HIIOS) + hook `useRealtimeInterview`, utilisé par `simulation/[id]/page.tsx`.
4. `POST /api/simulation/end` → `POST /api/report/generate` → page `report/[id]`.

### Onboarding (`/onboarding`)

Parcours plein écran en 3 étapes, **hors** de `(app)/` (pas de sidebar) : poste visé (intitulé, secteur, niveau) → profil (nom, CV optionnel) → premier objectif (type d'entretien) avec récapitulatif modifiable avant envoi.

- **Page** `app/onboarding/page.tsx` (serveur) : session Supabase (`/login` si absente) ; garde inverse `/dashboard` si `users.onboardingCompleted` ; préremplit le nom. **Layout** `app/onboarding/layout.tsx` : plein écran zinc-950 avec les tokens sombres partagés `lib/theme/dark-tokens.ts` (aussi utilisés par `(app)/layout.tsx`).
- **Composants** `components/onboarding/` : `OnboardingWizard` (état, `AnimatePresence`, barre de progression `role="progressbar"`, soumission puis `router.push("/dashboard")`), `StepTargetJob`, `StepProfile`, `StepGoal`, `constants.ts` (enums réexportés du schéma Zod, classes partagées, formulation CV). Framer Motion sous `MotionConfig reducedMotion="user"` ; radios HTML natives ; zinc-950 / indigo-500.
- **CV** : upload seul via `/api/cv/upload` (extraction du texte), **rien n'est stocké ni analysé** ; seul l'indicateur `cvProvided` est enregistré. Formulation validée, à conserver telle quelle : « Votre CV est lu pour personnaliser votre expérience. Vous pourrez lancer l'analyse complète depuis votre tableau de bord. »
- **API** `POST /api/onboarding/complete` : corps `{ targetJob: { title, sector, level }, name, goal: { interviewType }, cvProvided }` validé par `validation/CompleteOnboardingSchema.ts` (`strict()` : un `userId` client est rejeté). L'identité vient **uniquement** de la session ; écriture par `prisma.user.updateMany({ where: { id: session } })`. Réponses 200 `{ success: true }`, 400, 401, 409 (profil absent), 500. Règle `AuthorizationV2` : `/api/onboarding` → AUTHENTICATED (depuis le 2026-10-02 le défaut d'`AuthorizationV2` est **fermé** : toute page ou route sans règle explicite répond 404).
- **Données** : `users.onboardingCompleted` (existant), `users.onboardingData` (JSONB `{ version: 1, targetJob, goal, cvProvided }`), `users.onboardingCompletedAt`. Migration `prisma/migrations/20260927_add_onboarding_data_to_users/` (`ADD COLUMN IF NOT EXISTS`) : **appliquée** à la base Supabase le 2026-09-28 (`prisma migrate deploy`, colonnes vérifiées par introspection).
- **Tests** : `validation/CompleteOnboardingSchema.test.ts`, `app/api/onboarding/complete/route.test.ts` (Supabase, Prisma et logger mockés).
- **Redirection** : `(app)/layout.tsx` (Server Component asynchrone) renvoie vers `/onboarding` un utilisateur connecté dont `onboardingCompleted = false` **et** dont le compte a moins de 30 jours (`createdAt`). La règle est la fonction pure `lib/onboarding/shouldRedirectToOnboarding.ts` (testée). Les comptes plus anciens ne sont pas concernés (tous les comptes existants ont `onboardingCompleted = false` par défaut). Pas de boucle possible : `/onboarding` est un dossier **frère** de `(app)/`, ce layout ne s'y exécute jamais ; `redirect()` est appelé **hors** du `try/catch` (il lève une exception Next). En cas d'erreur (base ou Supabase indisponible) le garde **laisse passer** et journalise : c'est un confort d'usage, pas une barrière de sécurité, et un layout ne se ré-exécute pas à chaque navigation douce entre pages.
- `lib/onboarding/*` (hors `shouldRedirectToOnboarding.ts`) et `types/onboarding.ts` sont un ancien moteur jamais utilisé, indépendant du parcours ci-dessus.

### Module CV / ATS (état au 2026-10-01)

- **Routes** : `api/cv/upload` (extraction PDF/DOCX/TXT, rien de stocké, rate-limit), `api/cv/analyze` (extraction structurée + analyse ATS du moteur, avec offre optionnelle ; PACK/PRO, CSRF, rate-limit ; stocke le texte du CV tant que le compte existe), `api/cv/rewrite` (PACK/PRO, CSRF, rate-limit, prompts assainis), `api/public/analyze-preview` (aperçu gratuit anonyme : score, 2 forces, 1 faiblesse ; 3/h par IP), `api/public/preview/{[token],claim}`.
- **Aperçu** : un seul chemin — création par `analyze-preview` (`PreviewAnalysisService.savePreviewAnalysis`, résultat seul, jamais le texte du CV), relecture par `/api/public/preview/[token]` (`normalizePreviewResult` lit les formes plate et enveloppée), rattachement au compte par `preview/claim` ou par le cookie `preview_token` lu dans `/api/auth/callback` (`PreviewTransferService` : **lien seulement**, rien n'est copié dans le profil).
- **Règles** : ne jamais afficher de valeur non calculée (pas de percentile, radar ou probabilité d'entretien inventés) ; entrées envoyées à l'IA assainies par `sanitizeForPrompt(texte, maxLength)` (pas `sanitize-cv`, qui supprime œ, €, l'arabe).
- **Moteur d'analyse** : `lib/cv-analysis/` (déterministe, sans IA) — `analyzeCv(cvText, jobText?)` → dimensions `keywordCoverage`, `experienceFit`, `impact`, `format` (les `null` sont exclues du score), mots-clés détectés/manquants, recommandations, avertissements ; mode `job_match` ou `cv_only`. Utilisé par l'aperçu gratuit (`buildFreePreview`, 2 forces + 1 faiblesse) et par `api/cv/analyze` (PACK/PRO), qui l'enregistre dans `CVAnalysis` (`atsScoreAfter`, `improvements`, `keywords` = résultat complet ; `lib/cv-analysis/persistence.ts`). Pages `(app)/cv` (liste) et `(app)/cv/[id]` (détail), lecture par `lib/cv/queries.ts`. `lib/ats/*` reste mort ; le `premium-orchestrator` a été évalué et **rejeté** (2026-10-01). Garder `doubt-engine`, `recruiter-grade`, `contracts/munitions`.

## Base de données

- **PostgreSQL Supabase**, accès via **Prisma 6.1** (`DATABASE_URL` pooler 6543, `DIRECT_URL` 5432 pour migrations) **et** `@supabase/supabase-js` (RLS, RPC). Les deux coexistent. ⚠️ La base référencée par le `.env` est la base Supabase **distante** (pooler `aws-0-eu-west-1`) : toute commande Prisma (`migrate`, `db pull`) et tout test non mocké agit sur elle.
- `prisma/schema.prisma` inclut le schéma `auth` de Supabase (modèles `users`, `sessions`, `identities`, MFA/SSO…) — ne pas y toucher.
- Modèles applicatifs : `User`, `CareerProfile`, `InterviewSession`/`interview_sessions`/`interview_messages`/`reports`, `SimulationSession`, `PremiumInterviewSession`, `CVAnalysis`, `CvRewrite`, `PreviewAnalysis`, `Subscription`, `UserPurchase`, `CreditTransaction`/`CreditUsage`/`credits_ledger`, `StripeEvent`/`ProcessedWebhook`/`Idempotency`, `Opportunity`, `ApplicationWorkspace`, `CareerStory`, `OpportunityStory`, `CareerMemory`, `OpportunityMemory`, `DiscoverySource`, `DiscoveredJob`, `Graph*` (knowledge graph, pgvector), `DataLineage`, `AIUsageLog`, `AdminAuditLog`, `Behavior*`/`User*Profile`, `PublicChallenge*`, `WaitlistEntry`, `badges`/`user_badges`/`user_goals`.
- Enums : `OpportunityStatus`, `UserRole`, `Plan`, `WorkspaceReadiness`, `CareerMemoryOrigin/Status`, `DiscoveryProvider`, `DiscoveryJobStatus`.
- Migrations récentes dans `prisma/migrations/` (2026-09) ; SQL historique dans `supabase/` (`consolidated-migration.sql`, `patches-v*.sql`).
- **Ordre de déploiement** : appliquer une migration additive à Supabase **avant** de déployer le code dont le client Prisma la connaît, sinon toute requête `prisma.<modèle>.*` sans `select` échoue. La migration `20260927_add_onboarding_data_to_users` a été appliquée le 2026-09-28. `20260915215555_add_opportunity_id_to_interview_session` avait été appliquée à la main hors historique Prisma : elle a été enregistrée par `prisma migrate resolve --applied` (DDL non rejoué). **Ne pas la rejouer** : sa clé étrangère n'est pas idempotente. Avant tout `migrate deploy`, lancer `prisma migrate status` ; `prisma db pull` **réécrit `schema.prisma`** : utiliser `db pull --print`.

## Tarification et quotas

Source de vérité unique : `apps/web/src/lib/plans.ts` (prix, limites, fonctionnalités, helpers `canSimulate`, `getRemainingSimulations`, `isExpired`, `getEffectivePlanId`, `computePackExpiry`). **Aucun prix ni limite en dur ailleurs.**

- **FREE** 0 € : aperçu de l'analyse de CV (score + forces + 1 faiblesse), **aucune simulation**. **PACK** 29 € TTC, paiement unique : 5 simulations valables 3 mois. **PRO** 19 €/mois, sans essai : simulations illimitées. PACK débloque exactement les mêmes fonctionnalités que PRO ; seul le quota diffère.
- **Base** : enum `Plan` = `FREE | PACK | PRO` ; `users.packExpiresAt`, `users.simulationsUsed` (migration `20260930_pricing_plans_pack_pro`, **appliquée**).
- **Plan effectif** : `lib/quota/plan-access.ts` (`loadPlanAccess`) — PRO seulement si `Subscription.status` vaut `active` ou `past_due` (période de grâce : la fin est décidée par les relances Stripe ; `canceled` / `unpaid` / `incomplete*` → FREE immédiatement) ; PACK seulement avant `packExpiresAt` ; sinon FREE. Utilisé par `lib/quota/simulation-quota.ts` (consommation **atomique** `consumeSimulation` / `releaseSimulation` dans `api/simulation/create`), `lib/subscription/check-subscription.ts` et la garde `requireFullCvAnalysis` (routes `cv/analyze` et `cv/rewrite`, 403 `PLAN_REQUIRED`).
- **Stripe** : `api/stripe/checkout` (corps `{ plan: "PACK" | "PRO" }`, variables `STRIPE_PRICE_INTERVIEW_PACK` et `STRIPE_PRO_PRICE_ID`, `STRIPE_PRICE_EARLY` = ancien prix PRO), `api/stripe/webhook` (PACK : achat + droits dans une transaction, idempotent par `stripeCheckoutSessionId` ; prix inconnu : erreur journalisée, plan inchangé), `api/stripe/customer-portal`. Page `/settings` : plan, simulations restantes, expiration, portail.
- **Mise en ligne** : voir `.claude/tasks.md` (prix Stripe, webhook, CLI, portail, E2E).

## Services externes

Supabase (auth/DB/storage), OpenAI (chat, Realtime, embeddings), Mistral, Google GenAI, Deepgram (STT), ElevenLabs (TTS), Stripe (checkout, webhook, portal, crédits), Upstash Redis (cache + rate-limit), Resend (emails), Sentry, PostHog, OpenTelemetry/Prometheus.

Variables : voir `ENV.md`, `.env.example`, et le schéma zod `apps/web/src/lib/env.server.ts` (source de vérité de la validation). Les fichiers `.env*` sont **gitignorés** — ne jamais les lire ni les committer, ne jamais coller de clés dans le code.

## Commandes

Depuis la racine :

```bash
pnpm install
pnpm dev                 # apps/web (next dev, port 3000)
pnpm dev:gateway         # realtime-gateway (port 3001)
pnpm build               # build web (build:all = web + gateway)
pnpm typecheck           # tsc apps/web --noEmit
pnpm typecheck:gateway
pnpm lint                # eslint (apps/web)
pnpm test:replay         # vitest tests/replay
pnpm test                # harness runtime + replay + verify
pnpm test:e2e            # Playwright (smoke : pnpm test:e2e:smoke)
pnpm db:migrate          # prisma migrate dev  |  db:push  |  db:studio
pnpm stripe:listen       # webhook Stripe → localhost:3000/api/stripe/webhook
pnpm email:dev           # prévisualisation react-email (port 3001)
```

Dans `apps/web` : `pnpm test:e2e`, `pnpm test:api`, et Vitest (`vitest run`, config locale avec alias `@`, tests `src/**/*.{test,spec}.{ts,tsx}`, ex. `lib/discovery/*.test.ts`, `lib/opportunities/*.test.ts`, `lib/authorization/*.test.ts`).
API NestJS : `cd apps/api && pnpm start:dev | test | test:e2e`.

CI (`.github/workflows/ci-cd.yml`, Node 22, pnpm 9.15.9) : lint → typecheck → tests (`test:run`, `test:verify`, `tests/architecture-invariant.test.ts`, `test:cov`) sur `main`/`develop`.

## Tests

- **Vitest** (`apps/web`) : `pnpm --dir apps/web exec vitest run <fichier>`. Les tests de l'onboarding : `src/validation/CompleteOnboardingSchema.test.ts`, `src/app/api/onboarding/complete/route.test.ts`, `src/lib/onboarding/shouldRedirectToOnboarding.test.ts`. Les fichiers `.tsx` (layouts, composants) ne sont pas testables tels quels avec la config Vitest actuelle (JSX en `preserve`, Vitest 4 / oxc) : les vérifier par rendu ponctuel avec `oxc: { jsx: { runtime: "automatic" } }`. Le `pnpm test` de la **racine** est un autre harnais (`test:run` + `test:replay` + `test:verify`, il écrit des fichiers `artifacts/trace-<runId>.json`) : ce n'est pas la suite Vitest d'`apps/web`.
- **La base configurée est distante.** Prisma charge le `.env` tout seul, y compris dans un worker Vitest : `DATABASE_URL` y pointe vers la base Supabase distante, il n'y a pas de base locale par défaut. Tout test qui appelle Prisma sans mock atteint donc cette base.
- **`PreviewStorageService.test.ts` et `PreviewAnalysisRepository.test.ts` appellent Prisma sans mock** (`deleteMany` avant/après chaque test). Une garde au sommet de chaque fichier bloque l'exécution si l'**hôte** de `DATABASE_URL` n'est pas `localhost`, `127.0.0.1` ou `[::1]` (le message n'affiche que l'hôte, jamais l'URL complète ni le mot de passe). **Ne jamais supprimer cette garde.** Conséquence : sans base locale fournie, ces deux fichiers sont en erreur de suite. C'est voulu. Tout nouveau test qui écrit sur Prisma doit soit mocker `@/lib/prisma`, soit porter la même garde.
- **Les 14 fichiers de `src/e2e/**`** (13 `*.e2e.test.ts` + `base.test.ts`) sont des specs Playwright, **exclus de Vitest** par `exclude: ["src/e2e/**"]` dans `apps/web/vitest.config.ts`. Ne pas les déplacer ni retirer l'exclusion ; ils se lancent avec `pnpm test:e2e` (dans `apps/web`).
- Autres échecs Vitest connus, hors onboarding : `rate-limiting` (exige Redis), `PreviewTokenManager` (exige `window`), `ssrf`, hash `core/p7`.

## Conventions et pièges

- **`next.config.ts` ignore les erreurs TypeScript et ESLint au build** (`ignoreBuildErrors`, `ignoreDuringBuilds`). Un build vert ne prouve rien : lancer `pnpm typecheck` et `pnpm lint` explicitement.
- `output: "standalone"` sauf sous Windows (EPERM symlinks). `pdf-parse`, `pdfjs-dist`, `@napi-rs/canvas`, `pino` sont `serverExternalPackages` : importer pdfjs en lazy, runtime Node uniquement.
- Headers de sécurité globaux (X-Frame-Options DENY, Permissions-Policy micro bloqué **dans les headers Next** — vérifier avant de toucher à la voix navigateur).
- **Design system** : utiliser les tokens sémantiques (`bg-background`, `text-foreground`, `bg-surface`, `border-border`, `primary-*` violet `#7C3AED`) définis dans `tailwind.config.ts` / `src/lib/design-tokens.ts`. Les couleurs « old-school » (ivoire, ink, bronze, terracotta, forest) ne servent qu'au marketing/landing. Branche de base de la refonte : `design-system-v2`.
- Sécurité : URLs externes via `lib/security/ssrf-fetch` / `url-guard`; sanitisation CV/prompt (`sanitize-cv`, `prompt-sanitizer`); rate-limit Upstash (`lib/rate-limit`, `lib/security/rateLimiter*`); idempotence Stripe (`ProcessedWebhook`, `Idempotency`).
- Ne pas supposer un pattern unique : `lib/` mélange ancien (fichiers plats) et nouveau (DI + services). Suivre le voisinage du fichier modifié.
- **Bruit dans le dépôt** : nombreux `*.bak-*`, `*.bak`, `*.txt` (ex. `useRealtimeInterview.ts.txt`, `layout.tsx.txt`), `tsconfig.tsbuildinfo`, rapports d'audit `.md/.json` à la racine (`AUDIT-*`, `BLUEPRINT_*`, `RC*-`, `P*_RAPPORT_*`, `FIX-*`, `EXEC-*`…). Ce sont des artefacts d'audits/codemods passés : **ne pas les éditer ni s'y fier**, et les exclure des recherches (`*.bak*`).
- Les recherches larges à la racine sont très lentes (≈170 000 fichiers avec `node_modules`) : cibler `apps/web/src/...`.
- `scripts/` contient surtout des one-shots historiques (codemods `fix-*`, `codemod-*`, `phase*`, `exec-00*`) — ne pas les relancer sans les lire.

## État en cours

- ⚠️ **Simulation Realtime** : le pipeline de rapport est raccordé (`93329526` transcripts via `/api/interview/realtime-message`, `a3c98841` fin via `/api/simulation/end`, `94253685` Map supprimée) mais **non testé de bout en bout** avec un entretien vocal réel. `/api/interview/realtime-session` exige une session en cours de l'utilisateur (déjà décomptée du quota) et a un rate-limit (`da95b917`) ; `POST /api/interview` renvoie 404 en production (legacy). Détail : `.claude/tasks.md`.
- **Tarification** : grille FREE/PACK/PRO implémentée et migration **appliquée** (voir « Tarification et quotas »). Reste : prix Stripe, webhook, CLI, portail, E2E — rien n'a été encaissé ni testé avec un vrai paiement.
- **Auth** : correctifs callback / login / reset / signup faits (`1ccd567f`…`16a09a10`) puis erreurs en français, renvoi de confirmation et règles communes (`873ad098`) ; **non testés à la main** de bout en bout (envoi réel d'e-mails).
- **Module CV / ATS** : Phases 0 à 3 faites (moteur `lib/cv-analysis/`, analyse complète enregistrée, pages `/cv`). Reste : réécritures liées à une analyse (colonne `analysis_id` à créer).
- **Onboarding** : commits 1 à 4 sur `main` (colonnes + schéma Zod, route + autorisation, UI, tests). Migration **appliquée** à la base le 2026-09-28 (`a3d18660`) ; redirection des nouveaux utilisateurs branchée dans `(app)/layout.tsx` (voir « Onboarding »).
- ✅ **Identifiants de base — résolu le 2026-09-29** (root cause constatée le 2026-09-28, jamais lu `.env`) : l'utilisateur a corrigé le mot de passe de `DATABASE_URL` puis remplacé l'hôte de `DIRECT_URL` (`db.<project-ref>.supabase.co:5432`, introuvable en DNS depuis cet environnement — direct connect exige IPv6/add-on IPv4) par le pooler en mode session (`aws-0-eu-west-1.pooler.supabase.com:5432`, sans `pgbouncer=true`). `prisma migrate status` confirme la connexion : 8 migrations trouvées, schéma à jour. Si l'erreur `P1001: Can't reach database server` revient avec l'hôte `db.<ref>.supabase.co`, c'est que `DIRECT_URL` a été repointé sur l'hôte direct — repasser sur le pooler:5432 session.
- **`/discovery`** : la page et ses deux composants (`DiscoveryFeed`, `DiscoverySourcesPanel`) n'utilisent aucune classe claire ou héritée (`bg-white`, `slate`, `ivoire`…) : uniquement des tokens sémantiques et de l'indigo en dur, qui basculent en sombre via `(app)/layout`. Dernier écart corrigé le 2026-09-29 : 4 pastilles/boutons `bg-zinc-100 text-zinc-900` → `bg-zinc-700 text-zinc-100`. (Les autres écarts listés précédemment ici — accent `primary` violet, `bg-success/8`/`bg-warning/8`, titre `font-serif` — n'existent plus dans le code ; ils avaient déjà été corrigés par `fae6a0b8` sans mise à jour de cette note.)
- **`/simulation`** : **résolu** par `2bb297b8` (« feat(routing): /simulation → redirect, bandeau CV doux, liens corrigés »), postérieur à `34865e31` — `(app)/simulation/page.tsx` n'a plus de contenu propre, c'est un simple `redirect("/simulation/new")`. L'ancienne barrière « `careerProfile` requis » est devenue un bandeau non bloquant dans `/simulation/new` (l'API de création ne l'a jamais exigé). Vérifié dans le code le 2026-09-29 : cette note documentait encore l'état pré-`2bb297b8` ("décision ouverte" entre garder distinct ou fusionner) — obsolète, ne plus la citer.
- **TypeScript** : `pnpm typecheck` à 0 erreur.
- **Vitest** : voir la section « Tests ». Mesure à jour (2026-10-02, après Auth et `analysis_id`) : **750/750 tests passent** sur `apps/web` (les 2 fichiers en échec sont les suites du groupe A ci-dessous, 0 test chacune ; précédemment 608/608 le 2026-09-29 — les 2 restants sont les suites du groupe A ci-dessous, 0 test chacune, pas un échec réel). Le chiffre « 579/49 » (commit `8b15a37c`) était antérieur à l'exclusion des e2e et aux gardes — obsolète, ne plus le citer. Historique des 4 groupes de la session du 2026-09-29 : (A) `PreviewStorageService.test.ts`/`PreviewAnalysisRepository.test.ts` bloqués par la garde `[SAFETY]` localhost-only — voulu, ne pas toucher ; (B) `PreviewTokenManager.test.ts` corrigé (`f3d557ce`) : jsdom absent du projet, stub `window`/`sessionStorage` via `vi.stubGlobal` plutôt qu'ajouter la dépendance ; (C) `centralized-rate-limit.service.test.ts` corrigé (`469cfc5d`) — révélait un **vrai bug de production** dans `centralized-rate-limit.service.ts` : une fois le burst dépassé, `slidingWindowCheck()` ne bloquait pas, il retombait sur la fenêtre principale qui autorisait si elle n'était pas pleine (burst limit sans effet une fois dépassé) ; (D) `sanitizeUrl` (`lib/security/ssrf.ts`) + `report-generator.test.ts` corrigés (`7eb87810`) : `sanitizeUrl` validait l'URL avant de retirer les identifiants alors que `validateUrl` rejette tout `@` ; le test `report-generator` attendait qu'un hash sha256 contienne le score en clair, structurellement impossible — assertion remplacée.

## Thème et données personnelles

- **Site public clair, espace connecté sombre** (zinc-950 / indigo-500) : ne pas basculer le public en sombre (décision du 2026-10-02).
- **Suppression de compte** : `AccountService.deleteAccount` → Stripe, puis `lib/account/purge-user-data.ts` (transaction : `public.users` et cascades + tables sans FK), puis Supabase Auth. `public.users` n'a aucune FK vers `auth.users`. Les CV sont conservés tant que le compte existe (politique de confidentialité alignée).
- **Chiffres inventés retirés** (dashboard, `/interview` + `evaluate`, `executive-result-engine`, `career-dna-card`, `evolution-card`, `analysis-recap`) : ne jamais réintroduire de valeur non calculée ni de `Math.random()` dans un score.

## Sources de vérité (et ce qui est périmé)

À jour / utiles : `apps/web/package.json`, `apps/web/src/lib/env.server.ts`, `prisma/schema.prisma`, `src/middleware.ts`, `apps/realtime-gateway/ARCHITECTURE.md` (flux vocal), `architecture/00_CURRENT_ARCHITECTURE.md` (vue par domaines, *dates de juillet 2026*), `ENV.md`.

Périmés ou contradictoires — **vérifier dans le code avant d'y croire** : `README.md` et `ARCHITECTURE.md` (décrivent `app/` racine, « Intervo », P3.11), `TRAJECTOIRE_ARCHITECTURE_V1.md` (cite `packages/arena-engine`, absent aujourd'hui), `architecture/00_CURRENT_ARCHITECTURE.md` (annonce Next 16.2.9 ; le code est en 15.5.24), `architecture-v1.md`, `PROJECT_SNAPSHOT.md`, et la masse des rapports d'audit.
