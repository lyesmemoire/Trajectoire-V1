# Architecture Overview

## High‑level diagram

```
[Frontend] <--WebSocket--> [Voice Gateway] <--Events--> [Interview Engine] <--Events--> [Scoring Engine] <--DB--> Supabase
```

## Infrastructure Layers

### Observability Layer
```
lib/core/observability/
├─ logger/           # Logger interface, ConsoleLogger, PinoLogger, LoggerProvider
├─ telemetry/        # MetricsProvider interface, PrometheusMetricsProvider
├─ performance/      # PerformanceTracker, API middleware, DB/AI tracking
└─ context/          # RequestContext for correlationId, requestId, userId propagation
```

### Cache Layer
```
lib/cache/
├─ cache-provider.ts # CacheProvider interface
├─ memory-cache.ts   # In-memory cache implementation
├─ redis-cache.ts    # Upstash Redis implementation
├─ cache-manager.ts  # Unified cache manager with auto provider selection
└─ cache-keys.ts     # Centralized cache key definitions
```

### Queue Layer
```
lib/queue/
├─ job-types.ts      # Job type definitions and payloads
├─ queue-client.ts   # Upstash QStash client
├─ job-processor.ts  # Job processing logic
└─ worker.ts         # Background worker
```

### Monitoring Layer
```
lib/core/monitoring/
├─ health-check.ts   # Health check infrastructure
├─ readiness-check.ts # Readiness checks (DB, Redis, Supabase, AI)
└─ liveness-check.ts # Lightweight liveness probe
```

## Core runtime layout

```
src/interview/runtime/core/
├─ types/            # Shared type definitions
├─ hash/             # Stable hashing utilities
├─ freeze/           # Deep‑freeze helpers
├─ assertions/       # Runtime assertions
├─ events/           # Event definitions (EventEmitter2 / RxJS)
├─ state/            # Interview session state machines
└─ orchestration/    # Orchestrator coordinating events
```

## Voice layer

```
src/interview/runtime/voice/
├─ deepgram/        # Deepgram STT integration
├─ elevenlabs/       # ElevenLabs TTS streaming
├─ openai/           # Optional OpenAI realtime (future)
└─ gateway/          # WebSocket gateway exposing binary audio
```

## Interview engine

```
src/interview/runtime/interview/
├─ question-engine/  # Question generation & selectors
├─ state-machine/    # Interview flow and difficulty handling
└─ session/          # Session persistence helpers
```

## Scoring engine

```
src/interview/runtime/scoring/
├─ analytics/       # Metric extraction (latency, filler words…)
├─ score-calculator/ # Business logic for ATS & technical scores
└─ persistence/     # DB writes via Prisma
```

## Analytics

```
src/interview/runtime/analytics/
├─ telemetry/        # Logs, latency, cost tracking
├─ event‑tracker/     # Emits ai_usage_logs events
└─ dashboards/       # Future ClickHouse integration
```

## Event‑driven flow

1. **Voice Event** – audio chunk received → `VoiceGateway` emits `AudioChunkEvent`.
2. **Transcript Event** – Deepgram returns transcript → `TranscriptEvent`.
3. **LLM Response Event** – Gemini generates answer → `LlmResponseEvent`.
4. **Scoring Event** – Scoring service processes answer → `ScoringEvent`.
5. **Persistence Event** – Prisma writes transcript, scores, usage logs.

## Background Job Flow

1. **Enqueue** – API routes enqueue jobs via `QueueClient`
2. **Process** – Worker polls QStash and processes jobs
3. **Retry** – Failed jobs are retried up to 3 times
4. **Dead Letter** – Permanently failed jobs moved to dead letter queue

## Cache Strategy

- **User Profile** – 5 minutes TTL
- **Subscription** – 10 minutes TTL
- **Credits** – 1 minute TTL
- **System Prompts** – 1 hour TTL
- **CV Data** – 15 minutes TTL

## Feature flags (env)

```env
USE_ELEVENLABS=true
USE_OPENAI_REALTIME=false
USE_DEEPGRAM=true
USE_PRISMA_PROMPTS=true
USE_PRISMA_AUDIT=true
USE_PRISMA_AI_USAGE=true
```

## Logging (example)

All critical steps log latency, token usage and errors via `LoggerProvider`. Logs include:
- correlationId (for distributed tracing)
- requestId (for request tracking)
- userId (for user context)
- timestamp
- level (info, warn, error, debug)

## Health Check Endpoints

- `/api/health` – Full health check (database, redis, supabase, ai_providers)
- `/api/health/readiness` – Readiness probe (application ready to accept traffic)
- `/api/health/liveness` – Liveness probe (application is running)

## Performance Monitoring

- **API Time** – Tracked via `withPerformanceTracking` middleware
- **Prisma Queries** – Tracked via `trackPrismaQuery` wrapper
- **Supabase Calls** – Tracked via `trackSupabaseQuery` wrapper
- **AI Calls** – Tracked via `trackAICall` wrapper with token usage

## Security

- All environment variables accessed via `envServer` or `envClient` Configuration Providers
- Schema validation using Zod
- No direct `process.env` access in main application code
- Sentry integration for error tracking
- PostHog integration for analytics
