# PHASE 1 — Étape 6: Cartographie Runtime

## Objectif
Identifier le pipeline runtime complet: Web → API → Gateway → Runtime → Engine → Simulation → Provider.

---

## Pipeline Runtime Global

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                    (React/Next.js)                           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    WEB LAYER                                 │
│                    app/ (Next.js)                            │
│                    apps/web/ (Next.js)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                  │
│                    apps/api/ (NestJS)                       │
│                    app/api/ (Next.js API Routes)             │
└──────────────────────────┬──────────────────────────────────┘
                           │ WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    GATEWAY LAYER                             │
│                    apps/realtime-gateway/ (WebSocket)        │
│                    gateway/ (alternative)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ Internal Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    RUNTIME LAYER                             │
│                    lib/runtime/                              │
│                    lib/orchestration/                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ Business Logic
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    ENGINE LAYER                              │
│                    core/ (core business logic)              │
│                    lib/interview/ (interview engine)         │
│                    lib/ai/ (AI engine)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ Simulation
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SIMULATION LAYER                          │
│                    core/simulation/                          │
│                    lib/behavior/                             │
│                    lib/emotion/                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ Provider Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROVIDER LAYER                            │
│                    OpenAI, Mistral, Google                     │
│                    Supabase, Upstash, Stripe                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Web Layer

### Emplacements
- `app/` — Next.js App Router (principal)
- `apps/web/` — Next.js Application (alternative)
- `components/` — React Components
- `hooks/` — React Hooks

### app/ (Principal)
**Structure**:
- `app/` — Pages Next.js (App Router)
- `app/api/` — API Routes Next.js
- `app/(marketing)/` — Marketing pages
- `app/admin/` — Admin dashboard
- `app/auth/` — Auth pages
- `app/interview/` — Interview pages
- `app/dashboard/` — Dashboard
- `app/cv/` — CV pages

**Responsabilités**:
- UI Rendering
- Client-side logic
- API Routes (Next.js)
- Authentication (NextAuth v5)
- Routing

**Note**: Application Next.js principale, bien structurée

---

### apps/web/ (Alternative)
**Structure**:
- `apps/web/src/` — Source code
- `apps/web/public/` — Public assets
- Configuration Next.js séparée

**Responsabilités**:
- Alternative Next.js application
- Probablement ancienne version ou template

**Note**: À clarifier (voir Étape 4)

---

### components/
**Structure**:
- `components/ui/` — UI components
- `components/interview/` — Interview components
- `components/marketing/` — Marketing components
- `components/admin/` — Admin components
- `components/shared/` — Shared components

**Responsabilités**:
- Composants React réutilisables
- UI components
- Business components

**Note**: Composants bien organisés

---

### hooks/
**Structure**:
- `hooks/` — React hooks personnalisés

**Responsabilités**:
- Custom React hooks
- State management
- Side effects

**Note**: Hooks personnalisés bien isolés

---

## 2. API Layer

### Emplacements
- `apps/api/` — NestJS API
- `app/api/` — Next.js API Routes

### apps/api/ (NestJS)
**Structure**:
- `apps/api/src/` — Source code NestJS
- `apps/api/test/` — Tests
- Configuration: nest-cli.json, tsconfig.json

**Responsabilités**:
- REST API
- Webhooks (Stripe, Supabase)
- Background jobs
- Endpoints backend

**Architecture NestJS**:
- Controllers
- Services
- Modules
- Guards
- Interceptors

**Note**: API NestJS bien structurée

---

### app/api/ (Next.js API Routes)
**Structure**:
- `app/api/` — API Routes Next.js
- 54 items

**Responsabilités**:
- API Routes Next.js
- Server actions
- Edge functions

**Note**: API Routes Next.js, alternative à NestJS

---

## 3. Gateway Layer

### Emplacements
- `apps/realtime-gateway/` — WebSocket Gateway (principal)
- `gateway/` — Gateway alternative

### apps/realtime-gateway/ (Principal)
**Structure**:
- `apps/realtime-gateway/src/` — Source code
- `apps/realtime-gateway/tests/` — Tests
- `apps/realtime-gateway/apps/` — Apps internes
- `apps/realtime-gateway/scripts/` — Scripts

**Responsabilités**:
- WebSocket gateway
- Audio streaming
- Real-time communication
- Transport layer (sans logique métier)

**Architecture**:
- WebSocket server
- Audio processing
- STT (Speech-to-Text)
- TTS (Text-to-Speech)
- Barge-in support
- Event replay

**Note**: Gateway bien documentée (ARCHITECTURE.md)

---

### gateway/ (Alternative)
**Structure**:
- `gateway/` — Gateway alternative
- 19 items

**Responsabilités**:
- Gateway WebSocket alternative
- Services gateway

**Note**: À clarifier (voir Étape 4)

---

## 4. Runtime Layer

### Emplacements
- `lib/runtime/` — Runtime utilities
- `lib/orchestration/` — Orchestration runtime

### lib/runtime/
**Structure**:
- `lib/runtime/` — Runtime utilities
- 1 item

**Responsabilités**:
- Runtime utilities
- Execution context

**Note**: Runtime layer minimal

---

### lib/orchestration/
**Structure**:
- `lib/orchestration/agent.evaluator.ts` — Agent evaluation
- `lib/orchestration/consensus.engine.ts` — Consensus engine
- `lib/orchestration/signal.router.ts` — Signal routing
- `lib/orchestration/decision-graph.builder.ts` — Decision graph builder
- `lib/orchestration/decision-graph.repository.ts` — Decision graph repository
- `lib/orchestration/trace.context.ts` — Trace context

**Responsabilités**:
- Orchestration runtime
- Multi-agent coordination
- Decision graph execution
- Signal routing

**Note**: Orchestration sophistiquée

---

## 5. Engine Layer

### Emplacements
- `core/` — Core business logic
- `lib/interview/` — Interview engine
- `lib/ai/` — AI engine
- `lib/ats/` — ATS engine

### core/ (Core Business Logic)
**Structure**:
- `core/audio/` — Audio core
- `core/interview-preparation/` — Interview preparation
- `core/p5/` — Phase 5 implementation
- `core/p6/` — Phase 6 implementation
- `core/p7/` — Phase 7 implementation

**Responsabilités**:
- Core business logic
- Phased implementation
- Pure business logic

**Note**: Core layer bien isolé

---

### lib/interview/ (Interview Engine)
**Structure**:
- `lib/interview/engine.ts` — Interview engine
- `lib/interview/generate-questions.ts` — Question generation
- `lib/interview/prompts.ts` — Prompt builder
- `lib/interview/personas.ts` — Personas
- `lib/interview/behavior/` — Behavior logic
- `lib/interview/pressure/` — Pressure management
- `lib/interview/fairness/` — Fairness logic
- `lib/interview/failure-recovery/` — Failure recovery

**Responsabilités**:
- Interview orchestration
- Question generation
- Persona management
- Pressure simulation
- Fairness enforcement
- Failure recovery

**Note**: Interview engine très complet

---

### lib/ai/ (AI Engine)
**Structure**:
- `lib/ai/model-router.ts` — Model routing
- `lib/ai/rag.ts` — RAG implementation
- `lib/ai/streaming.ts` — Streaming
- `lib/ai/career-memory.ts` — Career memory
- `lib/ai/cache.ts` — AI cache

**Responsabilités**:
- AI orchestration
- Model routing
- RAG (Retrieval-Augmented Generation)
- Streaming
- Memory management

**Note**: AI engine bien structuré

---

### lib/ats/ (ATS Engine)
**Structure**:
- `lib/ats/orchestrator.ts` — ATS orchestrator
- `lib/ats/premium-orchestrator.ts` — Premium orchestrator
- `lib/ats/extraction/` — CV extraction
- `lib/ats/normalization/` — Skills normalization
- `lib/ats/scoring/` — ATS scoring
- `lib/ats/enrichment/` — Feedback enrichment

**Responsabilités**:
- CV processing
- Skills extraction
- ATS scoring
- Feedback generation

**Note**: ATS engine complet

---

## 6. Simulation Layer

### Emplacements
- `core/simulation/` — Simulation core (non trouvé, probablement dans core/)
- `lib/behavior/` — Behavior simulation
- `lib/emotion/` — Emotion simulation
- `lib/engagement/` — Engagement simulation

### lib/behavior/
**Structure**:
- `lib/behavior/` — Behavior logic

**Responsabilités**:
- Behavior simulation
- User behavior modeling

**Note**: Behavior simulation transverse

---

### lib/emotion/
**Structure**:
- `lib/emotion/` — Emotion logic

**Responsabilités**:
- Emotion simulation
- Sentiment analysis

**Note**: Emotion simulation transverse

---

### lib/engagement/
**Structure**:
- `lib/engagement/` — Engagement logic

**Responsabilités**:
- Engagement simulation
- User engagement tracking

**Note**: Engagement simulation transverse

---

## 7. Provider Layer

### Emplacements
- `lib/openai.ts` — OpenAI provider
- `lib/mistral.ts` — Mistral provider
- `lib/stripe.ts` — Stripe provider
- `lib/supabase.ts` — Supabase provider
- `lib/redis.ts` — Redis provider
- `lib/posthog.ts` — PostHog provider

### OpenAI Provider
**Models**:
- GPT-4
- GPT-4o
- GPT-4o-mini
- text-embedding-3-small

**Responsabilités**:
- LLM inference
- Embeddings
- Streaming

**Note**: Provider principal pour l'IA

---

### Mistral Provider
**Models**:
- Mistral Small

**Responsabilités**:
- LLM inference (économique)
- Schema validation

**Note**: Provider économique pour les tâches simples

---

### Google Generative AI
**Models**:
- Gemini

**Responsabilités**:
- LLM inference (alternative)

**Note**: Provider alternatif

---

### Stripe Provider
**Responsabilités**:
- Payments
- Subscriptions
- Webhooks

**Note**: Provider pour la monétisation

---

### Supabase Provider
**Responsabilités**:
- Database
- Authentication
- Storage
- Realtime

**Note**: Provider multi-fonctionnel

---

### Upstash (Redis) Provider
**Responsabilités**:
- Cache
- Rate limiting
- Queue

**Note**: Provider pour le cache et le rate limiting

---

### PostHog Provider
**Responsabilités**:
- Analytics
- Event tracking

**Note**: Provider pour l'analytics

---

## 8. Pipeline Runtime Détaillé

### Interview Pipeline
```
User Browser
    ↓ (HTTP)
Web Layer (app/)
    ↓ (API Call)
API Layer (app/api/ ou apps/api/)
    ↓ (WebSocket)
Gateway Layer (apps/realtime-gateway/)
    ↓ (Internal Call)
Runtime Layer (lib/orchestration/)
    ↓ (Business Logic)
Engine Layer (lib/interview/)
    ↓ (Simulation)
Simulation Layer (lib/behavior/, lib/emotion/)
    ↓ (Provider Call)
Provider Layer (OpenAI/Mistral)
    ↓ (Response)
Simulation Layer (behavior update)
    ↓ (Result)
Engine Layer (interview state update)
    ↓ (Response)
Runtime Layer (orchestration result)
    ↓ (Response)
Gateway Layer (streaming)
    ↓ (WebSocket)
Web Layer (UI update)
    ↓ (Render)
User Browser
```

**Note**: Pipeline interview bien structuré en couches

---

### ATS Pipeline
```
User Browser
    ↓ (HTTP)
Web Layer (app/cv/)
    ↓ (API Call)
API Layer (app/api/ ou apps/api/)
    ↓ (Business Logic)
Engine Layer (lib/ats/)
    ↓ (Extraction)
Extraction Layer (lib/ats/extraction/)
    ↓ (Provider Call)
Provider Layer (Mistral)
    ↓ (Parsing)
Normalization Layer (lib/ats/normalization/)
    ↓ (Scoring)
Scoring Layer (lib/ats/scoring/)
    ↓ (Enrichment)
Enrichment Layer (lib/ats/enrichment/)
    ↓ (Provider Call)
Provider Layer (Mistral)
    ↓ (Response)
Engine Layer (ATS result)
    ↓ (Response)
API Layer (JSON response)
    ↓ (HTTP)
Web Layer (UI update)
    ↓ (Render)
User Browser
```

**Note**: Pipeline ATS bien structuré

---

### Voice Pipeline
```
User Browser
    ↓ (WebSocket)
Web Layer (lib/voice/client.ts)
    ↓ (Audio Stream)
Gateway Layer (apps/realtime-gateway/)
    ↓ (STT)
Provider Layer (Deepgram)
    ↓ (Transcript)
Runtime Layer (lib/orchestration/)
    ↓ (Business Logic)
Engine Layer (lib/interview/)
    ↓ (Provider Call)
Provider Layer (OpenAI/Mistral)
    ↓ (Response)
    ↓ (TTS)
Provider Layer (ElevenLabs)
    ↓ (Audio Stream)
Gateway Layer (streaming)
    ↓ (WebSocket)
Web Layer (audio playback)
    ↓ (Render)
User Browser
```

**Note**: Pipeline voice bien structuré

---

## 9. Architecture Runtime

### Séparation des Responsabilités
```
┌─────────────────────────────────────┐
│ Presentation Layer                 │
│ - app/ (Next.js)                   │
│ - components/ (React)              │
│ - hooks/ (React Hooks)             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ API Layer                          │
│ - apps/api/ (NestJS)              │
│ - app/api/ (Next.js API Routes)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Gateway Layer                      │
│ - apps/realtime-gateway/ (WS)      │
│ - gateway/ (alternative)           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Runtime Layer                      │
│ - lib/runtime/                     │
│ - lib/orchestration/               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Engine Layer                       │
│ - core/ (core logic)               │
│ - lib/interview/ (interview)       │
│ - lib/ai/ (AI)                     │
│ - lib/ats/ (ATS)                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Simulation Layer                   │
│ - lib/behavior/                    │
│ - lib/emotion/                     │
│ - lib/engagement/                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Provider Layer                     │
│ - OpenAI, Mistral, Google          │
│ - Supabase, Upstash, Stripe        │
└─────────────────────────────────────┘
```

**Note**: Architecture runtime bien structurée en couches

---

## 10. Communication Patterns

### HTTP Communication
- **Web → API**: HTTP/REST
- **API → Engine**: Internal calls
- **Engine → Provider**: HTTP API

### WebSocket Communication
- **Web → Gateway**: WebSocket
- **Gateway → Runtime**: Internal calls
- **Gateway → Provider**: WebSocket/HTTP

### Internal Communication
- **Runtime → Engine**: Direct function calls
- **Engine → Simulation**: Direct function calls
- **Simulation → Provider**: HTTP API

---

## 11. Data Flow

### Request Flow
```
User Request
    ↓
Web Layer (validation)
    ↓
API Layer (authentication)
    ↓
Gateway Layer (routing)
    ↓
Runtime Layer (orchestration)
    ↓
Engine Layer (business logic)
    ↓
Simulation Layer (behavior)
    ↓
Provider Layer (external API)
    ↓
Response (reverse path)
```

### Event Flow
```
User Event
    ↓
Web Layer (event handling)
    ↓
Gateway Layer (event routing)
    ↓
Runtime Layer (event processing)
    ↓
Engine Layer (event handling)
    ↓
Simulation Layer (state update)
    ↓
Provider Layer (event logging)
```

---

## 12. Error Handling

### Error Propagation
```
Provider Error
    ↓
Simulation Layer (error handling)
    ↓
Engine Layer (error recovery)
    ↓
Runtime Layer (error orchestration)
    ↓
Gateway Layer (error response)
    ↓
Web Layer (error display)
    ↓
User (error message)
```

### Error Handling Strategies
- **Provider Layer**: Retry logic, fallback
- **Simulation Layer**: Graceful degradation
- **Engine Layer**: Error recovery
- **Runtime Layer**: Error orchestration
- **Gateway Layer**: Error response formatting
- **Web Layer**: User-friendly error messages

---

## 13. Performance Optimization

### Caching Strategy
- **Web Layer**: Browser cache
- **API Layer**: Response cache
- **Runtime Layer**: In-memory cache
- **Engine Layer**: Result cache
- **Provider Layer**: API cache

### Load Balancing
- **Web Layer**: Vercel CDN
- **API Layer**: Load balancer
- **Gateway Layer**: Connection pooling
- **Provider Layer**: Rate limiting

### Async Processing
- **API Layer**: Background jobs
- **Runtime Layer**: Async orchestration
- **Engine Layer**: Parallel processing
- **Provider Layer**: Concurrent requests

---

## 14. Security Layers

### Authentication
- **Web Layer**: NextAuth v5
- **API Layer**: JWT validation
- **Gateway Layer**: WebSocket auth
- **Runtime Layer**: Session validation
- **Engine Layer**: Authorization checks
- **Provider Layer**: API key validation

### Authorization
- **Web Layer**: Role-based access
- **API Layer**: Permission checks
- **Gateway Layer**: Resource access
- **Runtime Layer**: Policy enforcement
- **Engine Layer**: Business rules
- **Provider Layer**: Scope validation

### Security Measures
- **Rate Limiting**: Upstash
- **Input Validation**: Zod schemas
- **Output Sanitization**: Content filters
- **Encryption**: TLS/SSL
- **Audit Logging**: Security logs

---

## Conclusions de l'Étape 6

### Points Positifs
- ✅ **Architecture en couches claire**: Web → API → Gateway → Runtime → Engine → Simulation → Provider
- ✅ **Séparation des responsabilités**: Chaque layer a une responsabilité claire
- ✅ **Communication patterns bien définis**: HTTP, WebSocket, Internal calls
- ✅ **Error handling structuré**: Propagation et recovery à chaque layer
- ✅ **Performance optimization**: Caching, load balancing, async processing
- ✅ **Security multicouche**: Authentication, authorization, rate limiting

### Points à Clarifier
- ⚠️ **apps/web/ vs app/**: Deux applications Next.js
- ⚠️ **gateway/ vs apps/realtime-gateway/**: Deux gateways
- ⚠️ **core/simulation/**: Non trouvé, probablement intégré ailleurs

### Recommandations
1. **Clarifier apps/web/ vs app/**
2. **Clarifier gateway/ vs apps/realtime-gateway/**
3. Documenter la simulation layer
4. Ajouter des monitors de performance par layer

### Prochaine Étape
Étape 7: Cartographie DDD (Domain, Application, Infrastructure, Presentation par dossier)
