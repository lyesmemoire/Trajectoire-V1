# Architecture Map — StudioEntretien / Intervo

## Modules

### Core Modules
- **core/v2/** — AI decision engine (pure logic, ~1,270 lines)
- **core/simulation/** — Behavioral simulation layer (~980 lines)
- **core/audio/** — Audio processing pipeline
- **core/interview-preparation/** — Interview preparation logic
- **core/p7/, core/p6/, core/p5/** — Phased implementation modules

### Application Modules (lib/)
- **lib/ai/** — AI orchestration and routing
- **lib/interview/** — Interview management (34 items)
- **lib/cv/** — CV processing and analysis
- **lib/auth/** — Authentication and authorization
- **lib/analytics/** — Analytics and tracking
- **lib/voice/** — Voice processing and WebSocket client
- **lib/realtime/** — Real-time communication
- **lib/security/** — Security utilities (20 items)
- **lib/monitoring/** — Observability and monitoring
- **lib/queue/** — Job queue management
- **lib/credits/** — Credits and billing
- **lib/referral/** — Referral system
- **lib/email/** — Email handling
- **lib/pdf/** — PDF generation
- **lib/stripe/** — Stripe integration
- **lib/supabase/** — Supabase client utilities

### Infrastructure Modules
- **lib/db/** — Database utilities (14 items)
- **lib/redis/** — Redis integration
- **lib/env/** — Environment configuration
- **lib/errors/** — Error handling
- **lib/logger/** — Logging utilities
- **lib/resilience/** — Resilience patterns

### UI Modules
- **components/ui/** — Reusable UI components
- **components/shared/** — Shared components
- **components/providers/** — React context providers
- **app/** — Next.js app router pages (144 items)

---

## Bounded Contexts

### 1. Interview Context
- **Domain**: Interview simulation and management
- **Modules**: lib/interview/, core/simulation/, core/v2/
- **Responsibilities**: 
  - Interview orchestration
  - AI recruiter behavior
  - Voice interaction
  - Question generation

### 2. CV Context
- **Domain**: CV processing and analysis
- **Modules**: lib/cv/, lib/ats/, lib/pdf/
- **Responsibilities**:
  - CV parsing
  - ATS optimization
  - PDF generation
  - Profile extraction

### 3. User Context
- **Domain**: User management and authentication
- **Modules**: lib/auth/, lib/users/, lib/referral/
- **Responsibilities**:
  - Authentication (NextAuth v5)
  - User profiles
  - Referral system
  - Waitlist management

### 4. Billing Context
- **Domain**: Payments and credits
- **Modules**: lib/credits/, lib/stripe/, lib/referral/
- **Responsibilities**:
  - Stripe integration
  - Credit management
  - Subscription handling
  - Billing events

### 5. Analytics Context
- **Domain**: Analytics and monitoring
- **Modules**: lib/analytics/, lib/monitoring/, lib/posthog/
- **Responsibilities**:
  - Event tracking
  - User behavior analysis
  - Performance monitoring
  - Error tracking (Sentry)

### 6. AI Context
- **Domain**: AI orchestration
- **Modules**: lib/ai/, lib/ai-routing/, lib/ai-monitoring/
- **Responsibilities**:
  - LLM routing (OpenAI, Mistral, Google)
  - AI safety
  - Cost optimization
  - Prompt management

---

## Dependencies

### External Dependencies
- **AI**: OpenAI, Mistral AI, Google Generative AI
- **Database**: Prisma ORM, Supabase (PostgreSQL)
- **Cache**: Redis (Upstash)
- **Auth**: NextAuth v5, Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **Monitoring**: Sentry, PostHog
- **Voice**: ElevenLabs, Deepgram
- **Real-time**: Socket.io, WebSocket
- **PDF**: @react-pdf/renderer, docx

### Internal Dependencies
```
apps/web → lib/* → core/*
apps/realtime-gateway → core/v2/ → core/simulation/
apps/api → lib/* → prisma client
```

---

## Cycles

### Verified Cycles: None
- **V2 Engine**: No dependencies on simulation layer (verified by grep)
- **Simulation**: No dependencies on transport layer (verified by grep)
- **MindState**: Read-only, no business logic depends on it

### Potential Cycles
- **lib/interview/** ↔ **lib/ai/** (orchestration cycle)
- **lib/analytics/** ↔ **lib/monitoring/** (monitoring cycle)

### Anti-Patterns Avoided
- **No circular dependencies** between V2 and Simulation
- **No UI coupling** to core business logic
- **No direct database access** from core modules

---

## Features

### Core Features
1. **AI Interview Simulation**
   - V2 decision engine
   - Behavioral simulation
   - Voice interaction
   - Real-time feedback

2. **CV Processing**
   - CV parsing and analysis
   - ATS optimization
   - PDF export
   - Profile extraction

3. **User Management**
   - Authentication (NextAuth v5)
   - User profiles
   - Referral system
   - Waitlist management

4. **Billing**
   - Stripe integration
   - Credit system
   - Subscription management
   - Usage tracking

5. **Analytics**
   - Event tracking (PostHog)
   - User behavior analysis
   - Performance monitoring
   - Error tracking (Sentry)

### Advanced Features
1. **AI Safety**
   - Content moderation
   - Rate limiting
   - Cost optimization
   - Model routing

2. **Real-time Communication**
   - WebSocket gateway
   - Voice streaming
   - Barge-in support
   - Event replay

3. **Monitoring**
   - OpenTelemetry tracing
   - Performance metrics
   - Error tracking
   - Health checks

---

## Providers

### React Context Providers
- **components/providers/** — React context providers
  - AuthProvider
  - ThemeProvider
  - MonitoringProvider
  - AIProvider

### Service Providers
- **lib/supabase/** — Supabase client
- **lib/openai.ts** — OpenAI client
- **lib/mistral.ts** — Mistral client
- **lib/stripe.ts** — Stripe client
- **lib/redis.ts** — Redis client

### Infrastructure Providers
- **Supabase** — Database and Auth
- **Upstash** — Redis and Rate Limiting
- **Stripe** — Payments
- **Sentry** — Error tracking
- **PostHog** — Analytics
- **ElevenLabs** — TTS
- **Deepgram** — STT

---

## Runtime

### Applications
1. **apps/web/** — Next.js web application
   - Pages: app/
   - API routes: app/api/
   - Middleware: middleware.ts

2. **apps/realtime-gateway/** — WebSocket gateway
   - Voice streaming: ws.voice.ts
   - Real-time processing
   - Transport layer (no business logic)

3. **apps/api/** — REST API
   - API endpoints
   - Background jobs
   - Webhooks

### Runtime Services
- **lib/runtime/** — Runtime utilities
- **lib/queue/** — Job queue processing
- **lib/realtime/** — Real-time communication
- **lib/orchestration/** — Workflow orchestration

### Deployment
- **Vercel** — Web application
- **Docker** — Gateway deployment
- **Kubernetes** — Infrastructure (planned)

---

## AI

### AI Engines
1. **V2 Engine** (core/v2/)
   - Decision logic
   - Question generation
   - Scoring
   - Path management
   - ~1,270 lines

2. **Simulation Engine** (core/simulation/)
   - Behavioral simulation
   - Pressure management
   - Memory tracking
   - Persona reactivity
   - ~980 lines

3. **Recruiter Mind** (recruiter-mind.ts)
   - Emotion tracking
   - Trust calculation
   - Suspicion detection
   - Engagement metrics
   - Derived state (read-only)

### AI Routing
- **lib/ai-routing/** — Model selection
- **lib/ai-monitoring/** — AI performance tracking
- **lib/prompts/** — Prompt management

### AI Providers
- **OpenAI** — GPT-4
- **Mistral AI** — Mistral models
- **Google Generative AI** — Gemini models

### AI Safety
- **lib/emotional-safety/** — Content moderation
- **lib/cognitive-load/** — Load management
- **lib/ai-monitoring/** — Performance monitoring

---

## Dashboard

### Admin Dashboard
- **ADMIN_DASHBOARD_AUDIT.md** — Dashboard audit
- **Admin features**:
  - User management
  - Analytics viewing
  - System monitoring
  - Billing oversight

### Monitoring Dashboard
- **PRODUCTION_SURVIVAL_DASHBOARD.md** — Survival dashboard
- **FINOPS_DASHBOARD_ARCHITECTURE.md** — FinOps dashboard
- **Metrics**:
  - Performance metrics
  - Error rates
  - Usage statistics
  - Cost tracking

### Analytics Dashboard
- **lib/analytics/** — Analytics implementation
- **PostHog integration** — Event tracking
- **Custom dashboards** — Business metrics

---

## API

### REST API (apps/api/)
- **API routes** — RESTful endpoints
- **Webhooks** — Stripe, Supabase
- **Background jobs** — Async processing
- **Authentication** — NextAuth v5

### WebSocket API (apps/realtime-gateway/)
- **Voice streaming** — /api/voice
- **Real-time events** — WebSocket
- **Barge-in support** — Interrupt handling
- **Event replay** — Debugging

### API Architecture
```
UI Layer → Transport Layer → Orchestration → V2/Simulation
```

### API Security
- **Rate limiting** — Upstash
- **Authentication** — NextAuth v5
- **Authorization** — Role-based
- **Input validation** — Zod schemas

---

## Database

### Database Technology
- **ORM**: Prisma 6.1.0
- **Database**: PostgreSQL (Supabase)
- **Schemas**: auth, public
- **Connection**: Pooler (6543) + Direct (5432)

### Database Models (Prisma)
- **User** — User accounts
- **Account** — OAuth accounts
- **Session** — User sessions
- **CVAnalysis** — CV analyses
- **InterviewSession** — Interview sessions
- **CareerProfile** — Career profiles
- **Subscription** — Subscriptions
- **WaitlistEntry** — Waitlist
- **CandidateGraph** — Candidate intelligence (newly restored)
- **CandidateGraphSnapshot** — Graph snapshots (newly restored)
- **StorageFile** — File storage (newly restored)
- **43 models total** — Introspected from database

### Database Migrations
- **7 migrations** in prisma/migrations/
- **Applied**: 20260703_init
- **Pending**: 6 migrations (including rls_helper, storage_metadata, candidate_graph)

### Database Features
- **Row Level Security (RLS)** — Enabled on sensitive tables
- **Foreign Keys** — Cascade deletes
- **Indexes** — Performance optimization
- **Triggers** — Auto-updates (updated_at)

---

## Tests

### Test Structure
- **tests/replay/** — Replay tests (V2 engine)
- **tests/voice-interview/** — Voice interview tests
- **tests/product/** — Product tests
- **tests/mobile/** — Mobile tests
- **tests/load/** — Load tests

### Test Coverage
- **V2 Engine**: 132 tests (ratio test/code ≈ 0.64)
- **Voice**: ~1,450 lines of tests
- **Integration**: tests/integration/
- **E2E**: Playwright tests

### Test Tools
- **Vitest** — Unit tests
- **Playwright** — E2E tests
- **Fast-check** — Property-based testing
- **Golden diff** — Snapshot testing

### Test Scripts
```json
"test": "npm run test:run && npm run test:replay && npm run test:verify"
"test:replay": "vitest run --globals tests/replay"
"test:coverage": "vitest run --globals --coverage tests/replay"
```

---

## Coverage

### Code Coverage
- **V2 Engine**: ~64% coverage (1449/2254 lines)
- **Simulation**: Good coverage for deterministic logic
- **Voice**: Comprehensive test suite
- **Integration**: Partial coverage

### Coverage Tools
- **Vitest coverage** — Unit test coverage
- **Playwright** — E2E coverage
- **ESLint** — Code quality coverage
- **TypeScript** — Type coverage

### Coverage Reports
- **coverage/** — Coverage reports
- **eslint-report.json** — Linting report
- **test-results/** — Test results

### Coverage Goals
- **V2 Engine**: >70% coverage
- **Simulation**: >60% coverage
- **Critical paths**: >80% coverage
- **Overall**: >50% coverage

---

## Architecture Health Metrics

### Verified Invariants
1. **V2 replaceable**: No dependencies on simulation layer
2. **Simulation replaceable**: No dependencies on transport layer
3. **MindState derived**: Read-only, no business logic dependencies
4. **Pipeline = unique boundary**: V2 ↔ Simulation via SimulationContract
5. **Runtime decoupling**: Remove simulation → V2 still works

### Quality Metrics
- **132 tests** passing
- **0 lint errors**
- **Gateway tsc strict**: EXIT 0
- **pnpm -r build**: EXIT 0

### Module Sizes
- **V2 core**: ~1,270 lines
- **Simulation**: ~980 lines
- **Voice adapters**: ~1,030 lines
- **Voice tests**: ~1,450 lines

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.18
- **UI**: React 19.2.6
- **Styling**: Tailwind CSS 3.4.17
- **State**: Zustand 5.0.13
- **Forms**: React Hook Form 7.54.2

### Core
- **Language**: TypeScript 5.8.3
- **Runtime**: Node.js >=18
- **Package Manager**: pnpm 9.15.9
- **Build**: TypeScript compiler (tsc -b)

### Backend
- **API**: NestJS 11.1.24
- **Real-time**: Socket.io 4.8.3
- **Database**: Prisma 6.1.0
- **Cache**: ioredis 5.6.0

### Infrastructure
- **Hosting**: Vercel (web)
- **Database**: Supabase (PostgreSQL)
- **Cache**: Upstash (Redis)
- **Monitoring**: Sentry, PostHog
- **Payments**: Stripe

---

## Deployment Architecture

### Environments
- **Development**: Local development
- **Staging**: Beta testing
- **Production**: Live deployment

### Deployment Pipeline
```
Build (pnpm -r build) → Type Check → Test → Deploy
```

### Infrastructure
- **Vercel** — Web application
- **Docker** — Gateway deployment
- **Kubernetes** — Planned infrastructure
- **Supabase** — Managed database

---

## Security Architecture

### Authentication
- **NextAuth v5** — OAuth provider
- **Supabase Auth** — Supabase authentication
- **Role-based access** — Admin/User roles

### Security Features
- **Rate limiting** — Upstash
- **Input validation** — Zod schemas
- **Content moderation** — AI safety
- **Row Level Security** — Database-level security
- **HTTPS only** — SSL/TLS encryption

### Monitoring
- **Sentry** — Error tracking
- **PostHog** — User behavior
- **Custom alerts** — Security events

---

## Performance Architecture

### Optimization
- **Connection pooling** — PgBouncer
- **Caching** — Redis (Upstash)
- **CDN** — Static assets
- **Lazy loading** — Code splitting

### Monitoring
- **OpenTelemetry** — Distributed tracing
- **Performance metrics** — Custom monitoring
- **Load testing** — Stress tests
- **Profiling** — Performance profiling

---

## Scalability Architecture

### Horizontal Scaling
- **Stateless services** — Easy scaling
- **Load balancing** — Vercel
- **Database pooling** — PgBouncer
- **Cache layer** — Redis

### Vertical Scaling
- **Optimized queries** — Database indexes
- **Efficient algorithms** — V2 engine
- **Memory management** — LRU cache
- **Resource limits** — Container limits

---

## Disaster Recovery

### Backup Strategy
- **Database backups** — Supabase automated
- **Code backups** — Git version control
- **Asset backups** — Cloud storage
- **Configuration backups** — Environment variables

### Recovery Procedures
- **Database restore** — Point-in-time recovery
- **Rollback** — Git revert
- **Failover** — Multi-region deployment
- **Monitoring** — Health checks

---

## Documentation

### Architecture Documentation
- **ARCHITECTURE.md** — Main architecture document
- **C4-ARCHITECTURE.md** — C4 model diagrams
- **P0-*.md** — Priority 0 architecture documents
- **INFRASTRUCTURE_ROADMAP.md** — Infrastructure roadmap

### Audit Documentation
- **AUDIT_*.md** — Various audit reports
- **QA_CHECKLIST.md** — Quality assurance checklist
- **MIGRATION_CHECKLIST.md** — Migration procedures

### Operational Documentation
- **PRODUCTION_OPERATIONS_MANUAL.md** — Operations manual
- **GO_LIVE_*.md** — Go-live procedures
- **ENV.md** — Environment configuration

---

## Conclusion

The architecture follows a clean, layered approach with clear separation of concerns:

1. **UI Layer** — Pure presentation, no business logic
2. **Transport Layer** — Communication, no decisions
3. **Orchestration Layer** — Workflow coordination
4. **Core Layer** — Pure business logic (V2 + Simulation)

The system is designed for:
- **Replaceability** — Each layer can be swapped
- **Testability** — High test coverage
- **Scalability** — Horizontal and vertical scaling
- **Security** — Multi-layer security approach
- **Observability** — Comprehensive monitoring

Current health: **132 tests passing**, **0 lint errors**, **build successful**.
