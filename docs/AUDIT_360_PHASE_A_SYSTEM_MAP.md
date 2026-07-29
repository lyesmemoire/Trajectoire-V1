# Audit 360° - Phase A : Cartographie du Code

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Structure du Projet

```
Trajectoire/
├── apps/
│   ├── api/                    # NestJS API (backend REST + WebSocket)
│   ├── realtime-gateway/       # Fastify Gateway (WebSocket vocal)
│   ├── realtime-gateway-v2/   # Gateway V2 (en développement)
│   └── web/                    # Next.js Frontend
├── libs/
│   └── domain/                 # Domain libraries (DDD)
├── packages/
│   ├── hiios-api/              # API client
│   ├── hiios-enterprise/       # Enterprise features
│   ├── hiios-runtime/          # Runtime client
│   └── hiios-sdk/              # SDK
├── scripts/                    # Scripts utilitaires
├── docs/                       # Documentation
└── infra/                      # Infrastructure (Kubernetes, Docker)
```

---

## Apps

### 1. apps/api

**Responsabilité**
- Backend REST API
- WebSocket pour communication temps réel
- Orchestrator pour coordination

**Dépendances**
- `@nestjs/common` : Framework NestJS
- `@nestjs/core` : Core NestJS
- `@nestjs/config` : Configuration
- `@nestjs/event-emitter` : Event emitter
- `@nestjs/platform-express` : Express
- `@deepgram/sdk` : STT (Speech-to-Text)
- `socket.io` : WebSocket
- `rxjs` : Reactive programming

**Points d'entrée**
- `src/main.ts` : Point d'entrée principal
- `src/app.module.ts` : Module principal
- `src/app.controller.ts` : Controller principal

**Appels externes**
- Deepgram API (STT)
- Supabase (Database)
- Redis (Cache)

**Événements produits**
- Aucun (API REST)

**Événements consommés**
- Aucun (API REST)

**Dette technique**
- Faible

**Niveau de criticité**
- **Moyen** (API REST secondaire, Gateway principal)

---

### 2. apps/realtime-gateway

**Responsabilité**
- Gateway WebSocket pour entretiens vocaux
- Session management
- Audio processing
- Communication avec OpenAI
- STT (Deepgram)
- TTS (ElevenLabs)

**Dépendances**
- `fastify` : Web framework
- `@fastify/websocket` : WebSocket
- `@fastify/cors` : CORS
- `@deepgram/sdk` : STT
- `openai` : OpenAI API
- `@discordjs/opus` : Audio codec
- `werift` : WebRTC
- `ws` : WebSocket
- `zod` : Validation
- `pino` : Logging
- `@opentelemetry/sdk-node` : Observability

**Points d'entrée**
- `src/gateway.ts` : Gateway principal
- `src/index.ts` : Point d'entrée

**Appels externes**
- Deepgram API (STT)
- OpenAI API (LLM)
- Supabase (Database)
- Redis (Cache)

**Événements produits**
- `transcript` : Transcript reçu
- `ai_chunk` : Chunk de réponse IA
- `ai_done` : Réponse IA terminée
- `ai_error` : Erreur IA
- `ai_audio_chunk` : Chunk audio IA
- `ai_audio_done` : Audio IA terminé
- `interrupt` : Interruption

**Événements consommés**
- Aucun (Gateway est producteur d'événements)

**Dette technique**
- **Moyenne** : Code legacy dans voice-interview/core
- **Haute** : Simulation layer complexe

**Niveau de criticité**
- **Critique** (Gateway principal pour entretiens vocaux)

---

### 3. apps/realtime-gateway-v2

**Responsabilité**
- Gateway V2 (en développement)
- Architecture refondue

**Dépendances**
- À définir

**Points d'entrée**
- À définir

**Appels externes**
- À définir

**Événements produits**
- À définir

**Événements consommés**
- À définir

**Dette technique**
- N/A

**Niveau de criticité**
- **Moyen** (en développement)

---

### 4. apps/web

**Responsabilité**
- Frontend Next.js
- UI pour entretiens
- Dashboard admin
- Replay UI
- Analytics

**Dépendances**
- `next` : Framework Next.js
- `react` : UI framework
- `react-dom` : React DOM
- `@supabase/supabase-js` : Supabase client
- `@supabase/ssr` : Supabase SSR
- `@upstash/redis` : Redis client
- `openai` : OpenAI API
- `framer-motion` : Animations
- `recharts` : Charts
- `lucide-react` : Icons
- `zod` : Validation

**Points d'entrée**
- `src/app/page.tsx` : Page principale
- `src/middleware.ts` : Middleware

**Appels externes**
- API (apps/api)
- Gateway (apps/realtime-gateway)
- Supabase (Database)
- Redis (Cache)
- OpenAI (LLM)

**Événements produits**
- Aucun (Frontend)

**Événements consommés**
- WebSocket messages du Gateway

**Dette technique**
- **Moyenne** : Beaucoup de composants dupliqués
- **Haute** : Code mort dans lib/

**Niveau de criticité**
- **Critique** (Frontend principal)

---

## Libs

### 1. libs/domain

**Responsabilité**
- Domain libraries (DDD)
- Entités du domaine
- Value objects
- Aggregates

**Dépendances**
- `zod` : Validation

**Points d'entrée**
- `src/director/` : Director domain
- `src/evaluation/` : Evaluation domain
- `src/interview/` : Interview domain
- `src/memory/` : Memory domain
- `src/persona/` : Persona domain
- `src/planner/` : Planner domain

**Appels externes**
- Aucun (domain pur)

**Événements produits**
- Aucun (domain pur)

**Événements consommés**
- Aucun (domain pur)

**Dette technique**
- Faible

**Niveau de criticité**
- **Critique** (Domain core)

---

## Packages

### 1. packages/hiios-api

**Responsabilité**
- API client pour HIIOS

**Dépendances**
- À définir

**Points d'entrée**
- `src/` : API client

**Appels externes**
- API HIIOS

**Événements produits**
- Aucun

**Événements consommés**
- Aucun

**Dette technique**
- Faible

**Niveau de criticité**
- **Moyen** (API client)

---

### 2. packages/hiios-enterprise

**Responsabilité**
- Enterprise features

**Dépendances**
- À définir

**Points d'entrée**
- À définir

**Appels externes**
- À définir

**Événements produits**
- À définir

**Événements consommés**
- À définir

**Dette technique**
- Faible

**Niveau de criticité**
- **Moyen** (Enterprise features)

---

### 3. packages/hiios-runtime

**Responsabilité**
- Runtime client

**Dépendances**
- À définir

**Points d'entrée**
- `src/` : Runtime client

**Appels externes**
- Gateway

**Événements produits**
- À définir

**Événements consommés**
- À définir

**Dette technique**
- Faible

**Niveau de criticité**
- **Critique** (Runtime client)

---

### 4. packages/hiios-sdk

**Responsabilité**
- SDK HIIOS

**Dépendances**
- À définir

**Points d'entrée**
- À définir

**Appels externes**
- À définir

**Événements produits**
- Aucun

**Événements consommés**
- Aucun

**Dette technique**
- Faible

**Niveau de criticité**
- **Moyen** (SDK)

---

## Scripts

**Responsabilité**
- Scripts utilitaires
- Tests
- Migrations
- Audits

**Dépendances**
- TypeScript
- Node.js

**Points d'entrée**
- Multiples scripts

**Appels externes**
- API
- Database

**Événements produits**
- Aucun

**Événements consommés**
- Aucun

**Dette technique**
- Faible

**Niveau de criticité**
- **Faible** (Scripts utilitaires)

---

## Infra

**Responsabilité**
- Infrastructure as code
- Kubernetes manifests
- Docker configurations

**Dépendances**
- Kubernetes
- Docker

**Points d'entrée**
- Kubernetes manifests

**Appels externes**
- Cloud providers

**Événements produits**
- Aucun

**Événements consommés**
- Aucun

**Dette technique**
- Faible

**Niveau de criticité**
- **Critique** (Infrastructure)

---

## Modules Détaillés

### apps/api/src

**Modules**
- `orchestrator/` : Orchestrator service
- `voice/` : Voice providers
- `session/` : Session management
- `llm/` : LLM integration
- `common/` : Common utilities

**Responsabilités**
- Coordination des entretiens
- Gestion des sessions
- Intégration LLM

**Dépendances**
- NestJS
- Deepgram
- Socket.io

**Dette technique**
- Faible

**Niveau de criticité**
- **Moyen**

---

### apps/realtime-gateway/src

**Modules**
- `gateway.ts` : Gateway principal
- `voice-interview/` : Logique entretien vocal
- `runtime/` : Runtime management
- `ai/` : AI integration
- `llm-strict.ts` : LLM strict calls
- `events/` : Event bus
- `contracts/` : Contrats
- `session-manager.ts` : Session management
- `stt.ts` : STT adapter
- `tts.ts` : TTS adapter
- `telemetry/` : Observability

**Responsabilités**
- Gateway WebSocket
- Session management
- Audio processing
- LLM integration
- Event bus

**Dépendances**
- Fastify
- Deepgram
- OpenAI
- Redis
- Supabase

**Dette technique**
- **Moyenne** : Simulation layer complexe
- **Haute** : Code legacy dans voice-interview/core

**Niveau de criticité**
- **Critique**

---

### apps/realtime-gateway/src/voice-interview

**Modules**
- `core/` : Core logic
  - `simulation/` : Simulation layer (22 modules)
  - `v2/` : V2 engine (15 modules)
  - `v3/` : V3 engine (12 modules)
  - `strategies/` : Strategies
  - `state.ts` : State machine
- `adapters/` : Adapters
  - `deepgram.ts` : Deepgram adapter
  - `tts/` : TTS adapters
  - `voice-websocket.ts` : WebSocket adapter
  - `websocket.ts` : WebSocket
- `runtime/` : Runtime
  - `collector/` : Event collector
  - `runtime-bootstrap.ts` : Bootstrap
  - `runtime-container.ts` : Container
  - `session-registry.ts` : Registry
- `persistence/` : Persistence
- `sessions/` : Sessions
- `stress/` : Stress testing

**Responsabilités**
- Logique entretien vocal
- Simulation comportementale
- Adapters pour services externes
- Runtime management

**Dépendances**
- Deepgram
- OpenAI
- Redis
- Supabase

**Dette technique**
- **Haute** : Simulation layer complexe
- **Moyenne** : Code legacy

**Niveau de criticité**
- **Critique**

---

### apps/web/src

**Modules**
- `app/` : Next.js app router
- `application/` : Application services
  - `adaptive-feedback/` : Adaptive feedback
  - `adaptive-intelligence/` : Adaptive intelligence (25 modules)
  - `ai-operating-system/` : AI OS (20 modules)
  - `services/` : Services (6 modules)
- `components/` : UI components
- `lib/` : Utilities
  - `ai/` : AI utilities (33 modules)
  - `interview/` : Interview logic (33 modules)
  - `ats/` : ATS (15 modules)
  - `analytics/` : Analytics (12 modules)
  - `security/` : Security (27 modules)
  - `replay/` : Replay (4 modules)
- `infrastructure/` : Infrastructure
- `domain/` : Domain
- `types/` : Types

**Responsabilités**
- Frontend UI
- Application logic
- AI integration
- Analytics
- Security

**Dépendances**
- Next.js
- React
- Supabase
- Redis
- OpenAI

**Dette technique**
- **Moyenne** : Beaucoup de composants dupliqués
- **Haute** : Code mort dans lib/

**Niveau de criticité**
- **Critique**

---

## Résumé

### Total Modules

- **Apps** : 4 (api, realtime-gateway, realtime-gateway-v2, web)
- **Libs** : 1 (domain)
- **Packages** : 4 (hiios-api, hiios-enterprise, hiios-runtime, hiios-sdk)
- **Scripts** : 49 scripts
- **Infra** : Infrastructure as code

### Criticité

**Critique**
- apps/realtime-gateway
- apps/web
- libs/domain
- packages/hiios-runtime
- infra/

**Moyen**
- apps/api
- apps/realtime-gateway-v2
- packages/hiios-api
- packages/hiios-enterprise
- packages/hiios-sdk
- scripts/

**Faible**
- Aucun

### Dette Technique

**Haute**
- apps/realtime-gateway/src/voice-interview/core/simulation (22 modules)
- apps/web/src/lib (code mort)

**Moyenne**
- apps/realtime-gateway/src/voice-interview/core (code legacy)
- apps/web/src (composants dupliqués)

**Faible**
- apps/api
- libs/domain
- packages/
- scripts/
- infra/

---

## Prochaines Étapes

Phase B : Architecture Runtime
Phase C : Audit OpenAI
Phase D : Audit Audio
Phase E : Audit Domaine
Phase F : Audit Événements
Phase G : Audit Données
Phase H : Audit Performance
Phase I : Audit Sécurité
Phase J : Audit Technique
