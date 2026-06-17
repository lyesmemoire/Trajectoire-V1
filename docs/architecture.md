# Architecture Overview

## High‑level diagram

```
[Frontend] <--WebSocket--> [Voice Gateway] <--Events--> [Interview Engine] <--Events--> [Scoring Engine] <--DB--> Supabase
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

## Feature flags (env)

```env
USE_ELEVENLABS=true
USE_OPENAI_REALTIME=false
USE_DEEPGRAM=true
```

## Logging (example)

All critical steps log latency, token usage and errors via `LoggerService`.
