# CLAUDE.md — Trajectoire / StudioEntretien

Contexte de travail pour Claude Code. Rédigé à partir de l'exploration du dépôt (code + `package.json` + configs). Les documents Markdown de la racine sont **en grande partie périmés** (voir « Sources de vérité »).

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
- `api/*` (Route Handlers) : `auth`, `account`, `analytics`, `career-memory`, `cv` (`analyze`/`rewrite`/`upload`), `discovery` (+`sources`, `ingest`, `[id]/promote`), `health` (`liveness`/`readiness`), `interview` (`route`, `evaluate`, `questions`, `transcribe`, `speak`, `realtime-session`), `knowledge`, `matching`, `opportunities/[id]/*` (analyze, memories, stories, workspace, application-context), `public/preview` + `public/analyze-preview` (tunnel anonyme → claim après signup), `quota`, `report/generate`, `simulation` (`create`, `message`, `end`, `audio-upload`, `audio-replay`, `[id]`), `stories`, `stripe` (`checkout`, `webhook`, `customer-portal`), `user/subscription`, `product/upload`.

### Middleware (`src/middleware.ts`, ~900 lignes)

Supabase SSR + `AuthorizationV2` (rôles/plans), CORS, CSRF (`lib/security/csrf-middleware`), nonce CSP, correlation-id. Listes explicites : `PUBLIC_PAGE_ROUTES`, `PUBLIC_API_PREFIXES` (`/api/auth`, `/api/public`, `/api/health`) et `AUTHENTICATED_PAGE_PREFIXES` (`/dashboard`, `/history`, `/simulation`, `/report`, `/interview`, `/knowledge`, `/matching`, `/settings`, `/onboarding`, `/copilot`, `/opportunities`, `/discovery`). **Toute nouvelle page privée doit être ajoutée à `AUTHENTICATED_PAGE_PREFIXES`.**

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
   - **Routes Next** `/api/interview/transcribe` + `/speak` (déprécié selon la doc gateway).
   - **OpenAI Realtime WebRTC** (en cours, non commité) : `POST /api/interview/realtime-session` (token éphémère + kernel HIIOS) + hook `useRealtimeInterview`.
4. `POST /api/simulation/end` → `POST /api/report/generate` → page `report/[id]`.

## Base de données

- **PostgreSQL Supabase**, accès via **Prisma 6.1** (`DATABASE_URL` pooler 6543, `DIRECT_URL` 5432 pour migrations) **et** `@supabase/supabase-js` (RLS, RPC). Les deux coexistent.
- `prisma/schema.prisma` inclut le schéma `auth` de Supabase (modèles `users`, `sessions`, `identities`, MFA/SSO…) — ne pas y toucher.
- Modèles applicatifs : `User`, `CareerProfile`, `InterviewSession`/`interview_sessions`/`interview_messages`/`reports`, `SimulationSession`, `PremiumInterviewSession`, `CVAnalysis`, `CvRewrite`, `PreviewAnalysis`, `Subscription`, `UserPurchase`, `CreditTransaction`/`CreditUsage`/`credits_ledger`, `StripeEvent`/`ProcessedWebhook`/`Idempotency`, `Opportunity`, `ApplicationWorkspace`, `CareerStory`, `OpportunityStory`, `CareerMemory`, `OpportunityMemory`, `DiscoverySource`, `DiscoveredJob`, `Graph*` (knowledge graph, pgvector), `DataLineage`, `AIUsageLog`, `AdminAuditLog`, `Behavior*`/`User*Profile`, `PublicChallenge*`, `WaitlistEntry`, `badges`/`user_badges`/`user_goals`.
- Enums : `OpportunityStatus`, `UserRole`, `Plan`, `WorkspaceReadiness`, `CareerMemoryOrigin/Status`, `DiscoveryProvider`, `DiscoveryJobStatus`.
- Migrations récentes dans `prisma/migrations/` (2026-09) ; SQL historique dans `supabase/` (`consolidated-migration.sql`, `patches-v*.sql`).

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

## État en cours (working tree au moment de l'exploration)

Branche `main` ; dernier commit `c507d5ef feat(design): refonte UI simulation, dashboard, discovery, opportunities`. Modifications non commitées :

- `apps/web/src/app/(app)/simulation/[id]/page.tsx` (modifié) + nouveau `layout.tsx` (plein écran `fixed inset-0 z-50`).
- Nouveau `api/interview/realtime-session/route.ts` : crée une session OpenAI Realtime (`gpt-4o-realtime-preview-2025-06-03`, voix `alloy`, VAD serveur) + `KernelState` HIIOS. ⚠️ Les sessions sont stockées dans une `Map` **en mémoire** (`realtimeSessions`) : non fiable en serverless/multi-instance, à persister avant prod. Pas de quota/rate-limit sur cette route.
- Nouveau hook `hooks/useRealtimeInterview.ts` (WebRTC + DataChannel, transcripts partiels) et une copie parasite `.ts.txt` à supprimer.

## Sources de vérité (et ce qui est périmé)

À jour / utiles : `apps/web/package.json`, `apps/web/src/lib/env.server.ts`, `prisma/schema.prisma`, `src/middleware.ts`, `apps/realtime-gateway/ARCHITECTURE.md` (flux vocal), `architecture/00_CURRENT_ARCHITECTURE.md` (vue par domaines, *dates de juillet 2026*), `ENV.md`.

Périmés ou contradictoires — **vérifier dans le code avant d'y croire** : `README.md` et `ARCHITECTURE.md` (décrivent `app/` racine, « Intervo », P3.11), `TRAJECTOIRE_ARCHITECTURE_V1.md` (cite `packages/arena-engine`, absent aujourd'hui), `architecture/00_CURRENT_ARCHITECTURE.md` (annonce Next 16.2.9 ; le code est en 15.5.24), `architecture-v1.md`, `PROJECT_SNAPSHOT.md`, et la masse des rapports d'audit.
