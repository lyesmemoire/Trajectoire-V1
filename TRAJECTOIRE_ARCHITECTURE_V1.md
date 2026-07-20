# Trajectoire Architecture v1 — Source de Vérité

> Document de référence unique pour l'architecture du projet StudioEntretien/Intervo.
> Basé sur l'audit complet PHASE 1 (Étapes 1-9).

---

## Vue d'ensemble

### Architecture Globale
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
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                  │
│                    apps/api/ (NestJS)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    GATEWAY LAYER                             │
│                    apps/realtime-gateway/ (WebSocket)        │
└──────────────────────────┬──────────────────────────────────┘
                           │ Internal Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    RUNTIME LAYER                             │
│                    lib/runtime/, lib/orchestration/          │
└──────────────────────────┬──────────────────────────────────┘
                           │ Business Logic
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    ENGINE LAYER                              │
│                    core/, lib/interview/, lib/ai/, lib/ats/ │
└──────────────────────────┬──────────────────────────────────┘
                           │ Simulation
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SIMULATION LAYER                          │
│                    lib/behavior/, lib/emotion/, lib/engagement/│
└──────────────────────────┬──────────────────────────────────┘
                           │ Provider Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROVIDER LAYER                            │
│                    OpenAI, Mistral, Google, Supabase, etc.  │
└─────────────────────────────────────────────────────────────┘
```

---

## Diagramme des Domaines

### Domaines Métier Principaux
```
┌─────────────────────────────────────────────────────────────┐
│                    INTERVIEW DOMAIN                          │
│                    lib/interview/ (34 items)                 │
│                    Architecture: 7/10, Dette: Moyenne        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ATS DOMAIN                                 │
│                    lib/ats/ (15 items)                        │
│                    Architecture: 9/10, Dette: Faible         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AI DOMAIN                                  │
│                    lib/ai/ (12 items)                         │
│                    Architecture: 8/10, Dette: Faible         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SECURITY DOMAIN                            │
│                    lib/security/ (20 items)                   │
│                    Architecture: 8/10, Dette: Faible         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION DOMAIN                        │
│                    lib/orchestration/ (7 items)               │
│                    Architecture: 8/10, Dette: Faible         │
└─────────────────────────────────────────────────────────────┘
```

### Domaines Métier Secondaires
```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION DOMAIN                      │
│                    lib/auth/ (1 item)                        │
│                    Architecture: 5/10, Dette: Moyenne        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BILLING DOMAIN                             │
│                    domain/billing.contract.ts                  │
│                    Architecture: 7/10, Dette: Faible         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ANALYTICS DOMAIN                            │
│                    lib/analytics/ (12 items)                  │
│                    Architecture: 7/10, Dette: Moyenne        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    VOICE DOMAIN                               │
│                    lib/voice/ (1 item)                        │
│                    Architecture: 6/10, Dette: Moyenne        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    REALTIME DOMAIN                            │
│                    lib/realtime/ (6 items)                    │
│                    Architecture: 6/10, Dette: Moyenne        │
└─────────────────────────────────────────────────────────────┘
```

---

## Diagramme des Dépendances

### Dépendances Principales
```
Interview
    ↓
AI
    ↓
Provider (OpenAI/Mistral)

Interview
    ↓
Behavior
    ↓
Emotion

ATS
    ↓
AI
    ↓
Provider (Mistral)

Billing
    ↓
Stripe

Security
    ↓
Upstash

Analytics
    ↓
PostHog
```

### Cycles Identifiés
- **Interview ↔ Behavior**: Cycle acceptable (Behavior transverse)
- **AI ↔ Analytics**: Cycle acceptable (monitoring IA)
- **Interview ↔ Orchestration**: Cycle à surveiller

---

## Pipeline IA

### Architecture IA en 5 Couches
```
┌─────────────────────────────────────┐
│ Presentation Layer                 │
│ - Streaming (lib/ai/streaming.ts)   │
│ - Realtime (lib/realtime/)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Orchestration Layer                 │
│ - AI Routing (lib/ai-routing/)      │
│ - Orchestration (lib/orchestration/)│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Reasoning Layer                     │
│ - LLM Providers (OpenAI/Mistral)    │
│ - AI SDK (Vercel AI)                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Memory Layer                        │
│ - Career Memory (lib/ai/career-memory.ts)│
│ - Cache (lib/ai/cache.ts)           │
│ - Database (Prisma/Supabase)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Vector Layer                        │
│ - Embeddings (OpenAI)               │
│ - pgvector (Supabase)               │
└─────────────────────────────────────┘
```

### Pipeline IA Complet
```
Prompts (lib/prompts/, lib/interview/prompts.ts)
    ↓
Embeddings (OpenAI text-embedding-3-small)
    ↓
Matching (pgvector)
    ↓
Scoring (déterministe)
    ↓
Reasoning (LLM: OpenAI/Mistral/Google)
    ↓
Orchestration (lib/orchestration/)
    ↓
Streaming (lib/ai/streaming.ts)
    ↓
Output
```

---

## Pipeline Runtime

### Pipeline Interview
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

---

## Couche UI

### Structure UI
```
app/ (Next.js App Router)
├── (marketing)/ — Marketing pages
├── admin/ — Admin dashboard
├── api/ — API routes
├── auth/ — Auth pages
├── cv/ — CV pages
├── dashboard/ — Dashboard
├── interview/ — Interview pages
└── waitlist/ — Waitlist

components/ (React Components)
├── ui/ — UI components (16 items)
├── interview/ — Interview components (6 items)
├── marketing/ — Marketing components (34 items)
├── admin/ — Admin components (16 items)
├── shared/ — Shared components
└── providers/ — React providers
```

---

## Couche Domain

### Domain Contracts
```
domain/
├── billing.contract.ts
├── decision-graph.contract.ts
├── fraud-kernel.contract.ts
├── interview.contract.ts
├── orchestration.contract.ts
└── user.contract.ts
```

### Domain Logic
```
core/ (Core Business Logic)
├── audio/ — Audio core
├── interview-preparation/ — Interview preparation
├── p5/ — Phase 5 implementation
├── p6/ — Phase 6 implementation
└── p7/ — Phase 7 implementation

lib/interview/ (Interview Domain)
├── engine.ts — Interview engine
├── personas.ts — Personas
├── question-bank.ts — Question bank
├── behavior/ — Behavior logic
├── pressure/ — Pressure management
└── fairness/ — Fairness logic

lib/ats/ (ATS Domain)
├── orchestrator.ts — ATS orchestrator
├── extraction/ — CV extraction
├── normalization/ — Skills normalization
├── scoring/ — ATS scoring
└── enrichment/ — Feedback enrichment
```

---

## Couche Infrastructure

### Infrastructure Layer
```
lib/db/ — Database utilities (14 items)
lib/env/ — Environment configuration
lib/errors/ — Error handling
lib/logger/ — Logging
lib/resilience/ — Resilience patterns
lib/redis.ts — Redis integration
lib/supabase.ts — Supabase client
lib/stripe.ts — Stripe integration
lib/openai.ts — OpenAI client
lib/mistral.ts — Mistral client
```

### Providers Externes
```
OpenAI — GPT-4, GPT-4o-mini, text-embedding-3-small
Mistral AI — Mistral Small
Google Generative AI — Gemini
Supabase — Database, Auth, Storage, Realtime
Upstash — Redis, Rate Limiting
Stripe — Payments, Subscriptions
PostHog — Analytics, Event Tracking
Sentry — Error Tracking
ElevenLabs — TTS
Deepgram — STT
```

---

## Liste des Packages

### Packages Principaux
```
app/ — Next.js App Router (144 items) ✅
apps/api/ — NestJS API (26 items) ✅
apps/realtime-gateway/ — WebSocket Gateway (188 items) ✅
components/ — React Components (115 items) ✅
core/ — Core Business Logic (227 items) ✅
lib/ — Library Modules (303 items) ✅
domain/ — Domain Contracts (6 items) ✅
tests/ — Tests (50 items) ✅
hooks/ — React Hooks (5 items) ✅
scripts/ — Scripts (40 items) ✅
```

### Packages à Supprimer
```
packages/arena-engine/ — Copie complète du projet (1546 items) ❌
packages/voice-core/ — Vide ❌
packages/voice-interview-client/ — Vide ❌
components/marketing-old/ — Code legacy (15 items) ❌
```

### Packages à Clarifier
```
apps/web/ vs app/ — Deux applications Next.js ⚠️
gateway/ vs apps/realtime-gateway/ — Deux gateways ⚠️
src/ — Non documenté (86 items) ⚠️
sil/ — Non documenté (108 items) ⚠️
services/ — Non documenté (5 items) ⚠️
runtime/ — Non documenté (1 item) ⚠️
```

---

## Liste des Domaines

### Domaines Métier (44 identifiés)
```
1. Interview (lib/interview/) — Architecture: 7/10, Dette: Moyenne
2. ATS (lib/ats/) — Architecture: 9/10, Dette: Faible
3. AI (lib/ai/) — Architecture: 8/10, Dette: Faible
4. Security (lib/security/) — Architecture: 8/10, Dette: Faible
5. Orchestration (lib/orchestration/) — Architecture: 8/10, Dette: Faible
6. Authentication (lib/auth/) — Architecture: 5/10, Dette: Moyenne
7. Billing (domain/billing.contract.ts) — Architecture: 7/10, Dette: Faible
8. Analytics (lib/analytics/) — Architecture: 7/10, Dette: Moyenne
9. Voice (lib/voice/) — Architecture: 6/10, Dette: Moyenne
10. Realtime (lib/realtime/) — Architecture: 6/10, Dette: Moyenne
11. CV (lib/cv/) — Architecture: 2/10, Dette: Énorme
12. Credits (lib/credits/) — Architecture: 5/10, Dette: Moyenne
13. Referral (lib/referral/) — Architecture: 6/10, Dette: Faible
14. Marketing (lib/marketing/) — Architecture: 5/10, Dette: Moyenne
15. SEO (lib/seo/) — Architecture: 5/10, Dette: Moyenne
16. Email (lib/email.ts) — Architecture: 6/10, Dette: Faible
17. PDF (lib/pdf/) — Architecture: 6/10, Dette: Faible
18. Database (lib/db/) — Architecture: 7/10, Dette: Faible
19. Queue/Jobs (lib/jobs/, lib/queue/) — Architecture: 3/10, Dette: Élevée
20. Core (core/) — Architecture: 8/10, Dette: Faible
```

### Domaines Transversaux
```
Behavior (lib/behavior/) — Architecture: 7/10, Dette: Faible
Emotion (lib/emotion/) — Architecture: 7/10, Dette: Faible
Engagement (lib/engagement/) — Architecture: 7/10, Dette: Faible
Insights (lib/insights/) — Architecture: 7/10, Dette: Faible
Prediction (lib/prediction/) — Architecture: 7/10, Dette: Faible
Emotional Safety (lib/emotional-safety/) — Architecture: 7/10, Dette: Faible
Cognitive Load (lib/cognitive-load/) — Architecture: 7/10, Dette: Faible
Fraud Detection (lib/fraud/) — Architecture: 7/10, Dette: Faible
Decision Graph (lib/orchestration/) — Architecture: 8/10, Dette: Faible
Signals (lib/signals/) — Architecture: 7/10, Dette: Faible
```

---

## Liste des Responsabilités

### Interview Domain
- Gestion des entretiens IA
- Moteur d'entretien
- Stratégies de suivi
- Génération de questions
- Personas et configuration
- Analyse des réponses
- Récupération et reprise
- Pression adaptative
- Équité (fairness)
- Comportement

### ATS Domain
- Traitement de CV
- Optimisation ATS
- Extraction de profils
- Normalisation
- Enrichissement
- Scoring
- Signaux recruteur

### AI Domain
- Routage des modèles IA
- Monitoring IA
- Génération d'insights
- RAG (Retrieval-Augmented Generation)
- Streaming IA
- Cache IA
- Chunking de texte
- Réécriture de CV
- Heuristiques ATS
- Mémoire carrière

### Security Domain
- Audit admin
- Journal d'audit
- Entropie comportementale
- Moat comportemental
- Bouclier anti-bot
- Détection de clones
- Moteur de fraude
- Moteur d'intégrité
- Sanitisation de prompts
- Rate limiting

### Orchestration Domain
- Évaluation d'agents
- Moteur de consensus
- Routage de signaux
- Construction de graphes de décision
- Repository de graphes
- Contexte de trace

---

## Liste de la Dette Technique

### Dette Énorme 🔴
1. **packages/** (1/10) — Copie complète du projet (1546 items)
2. **lib/cv/** (2/10) — Dossier vide, architecture inexistante
3. **lib/jobs/, lib/queue/** (3/10) — Implementation très limitée
4. **src/, sil/, services/, runtime/** (2/10) — Non documentés

### Dette Élevée 🟠
5. **gateway/** (3/10) — Architecture parallèle
6. **apps/** (5/10) — Confusion apps/web/ vs app/

### Dette Moyenne 🟡
7. **lib/interview/** (7/10) — DDD partiel
8. **lib/analytics/** (7/10) — DDD partiel
9. **lib/voice/** (6/10) — Structure minimale
10. **lib/realtime/** (6/10) — Structure minimale
11. **lib/auth/** (5/10) — Structure minimale
12. **components/** (7/10) — marketing-old legacy

### Dette Faible 🟢
13. **lib/ats/** (9/10) — Architecture excellente
14. **lib/security/** (8/10) — Architecture bonne
15. **lib/ai/** (8/10) — Architecture bonne
16. **lib/orchestration/** (8/10) — Architecture bonne
17. **domain/** (9/10) — Contracts excellents
18. **core/** (8/10) — Core business logic bonne
19. **app/** (8/10) — Structure Next.js bonne

---

## Liste des Composants Obsolètes

### Obsolètes Confirmés ❌
- `packages/arena-engine/` — Copie complète du projet (1546 items)
- `packages/voice-core/` — Vide
- `packages/voice-interview-client/` — Vide
- `components/marketing-old/` — Code legacy (15 items)
- `beta-notes/` — Vide
- `artifacts/` — Vide
- `reports/` — Vide
- `metrics/` — Vide
- `coverage/` — Vide
- `depth.txt` — Vide
- `tsc` — Fichier binaire

### Non Documentés ❌
- `src/` — Non documenté (86 items)
- `sil/` — Non documenté (108 items)
- `services/` — Non documenté (5 items)
- `runtime/` — Non documenté (1 item)

### Documentation Obsolète ⚠️
- `architecture-v1.md`
- `architecture-v1.json`
- `RELEASE_NOTES_v1.md`
- `patches-v2.sql` (indique l'existence de patches v1)

---

## Feuille de Route de Refactorisation

### Phase 1: Nettoyage Critique (🔴 Priorité Maximale)
1. **Supprimer packages/arena-engine/**
   - Impact: Réduction de 1546 items
   - Durée: 1 jour

2. **Clarifier apps/web/ vs app/**
   - Action: Déterminer l'application principale
   - Impact: Clarification de l'architecture
   - Durée: 1 jour

3. **Clarifier gateway/ vs apps/realtime-gateway/**
   - Action: Déterminer la gateway principale
   - Impact: Clarification de l'architecture
   - Durée: 1 jour

4. **Documenter ou supprimer src/, sil/, services/, runtime/**
   - Action: Documenter ou supprimer
   - Impact: Clarification de l'architecture
   - Durée: 2 jours

### Phase 2: Nettoyage Standard (🟠 Priorité Haute)
5. **Supprimer components/marketing-old/**
   - Impact: Réduction de 15 items
   - Durée: 0.5 jour

6. **Supprimer packages vides**
   - Impact: Nettoyage mineur
   - Durée: 0.5 jour

7. **Restructurer lib/cv/**
   - Action: Fusion avec ATS ou supprimer
   - Impact: Clarification de l'architecture
   - Durée: 1 jour

8. **Implémenter lib/jobs/, lib/queue/**
   - Action: Implémenter correctement
   - Impact: Fonctionnalité complète
   - Durée: 3 jours

### Phase 3: Amélioration DDD (🟡 Priorité Moyenne)
9. **Restructurer lib/interview/**
   - Action: Séparer les couches DDD explicitement
   - Impact: Architecture DDD complète
   - Durée: 2 jours

10. **Restructurer lib/analytics/**
    - Action: Séparer les couches DDD explicitement
    - Impact: Architecture DDD complète
    - Durée: 2 jours

11. **Restructurer lib/voice/**
    - Action: Restructurer et documenter
    - Impact: Architecture claire
    - Durée: 1 jour

12. **Restructurer lib/realtime/**
    - Action: Restructurer et documenter
    - Impact: Architecture claire
    - Durée: 1 jour

13. **Restructurer lib/auth/**
    - Action: Restructurer et ajouter des tests
    - Impact: Architecture claire
    - Durée: 1 jour

### Phase 4: Documentation et Tests (🟢 Priorité Faible)
14. **Archiver documentation v1**
    - Action: Archiver architecture-v1.md, architecture-v1.json
    - Impact: Documentation à jour
    - Durée: 0.5 jour

15. **Consolider documentation**
    - Action: Consolidation des documents d'architecture, audit, rapports
    - Impact: Documentation organisée
    - Durée: 2 jours

16. **Ajouter des tests**
    - Action: Tests pour tous les domaines
    - Impact: Couverture de tests
    - Durée: 5 jours

17. **Documenter les domaines**
    - Action: Documentation pour tous les domaines
    - Impact: Documentation complète
    - Durée: 3 jours

---

## Métriques de Santé

### Architecture
- **Domaines avec Architecture DDD Complète**: 4 (ATS, Security, AI, Orchestration)
- **Domaines avec Architecture DDD Partielle**: 2 (Interview, Analytics)
- **Domaines avec Architecture DDD Minimale**: 1 (Domain Contracts)
- **Architecture moyenne globale**: 7/10

### Dette Technique
- **Dette Énorme**: 4 domaines
- **Dette Élevée**: 2 domaines
- **Dette Moyenne**: 6 domaines
- **Dette Faible**: 19 domaines

### Taille du Projet
- **Items totaux**: ~3000 items
- **Items à supprimer**: ~1600 items (packages/arena-engine/)
- **Items à clarifier**: ~200 items (src/, sil/, services/, runtime/)
- **Items à restructurer**: ~100 items (lib/interview/, lib/analytics/, etc.)

### Tests
- **Tests actuels**: 50 items
- **Couverture de tests**: Partielle
- **Tests manquants**: La plupart des domaines

---

## Conclusion

### Points Forts
- ✅ **Architecture en couches claire**: Web → API → Gateway → Runtime → Engine → Simulation → Provider
- ✅ **Domaines bien structurés**: ATS, Security, AI, Orchestration (8-9/10)
- ✅ **Pipeline IA sophistiqué**: 5 couches (Presentation, Orchestration, Reasoning, Memory, Vector)
- ✅ **Contracts Pattern**: Excellente implémentation dans domain/
- ✅ **Multi-provider support**: OpenAI, Mistral, Google
- ✅ **Séparation des responsabilités**: Chaque layer a une responsabilité claire

### Points Critiques
- ❌ **packages/arena-engine/**: Copie complète du projet (1546 items)
- ❌ **lib/cv/**: Dossier vide, architecture inexistante
- ❌ **lib/jobs/, lib/queue/**: Implementation très limitée
- ❌ **src/, sil/, services/, runtime/**: Non documentés
- ❌ **gateway/**: Architecture parallèle
- ❌ **apps/**: Confusion apps/web/ vs app/

### Recommandations Principales
1. **Supprimer packages/arena-engine/** (🔴 Critique)
2. **Clarifier apps/web/ vs app/** (🔴 Critique)
3. **Clarifier gateway/ vs apps/realtime-gateway/** (🔴 Critique)
4. **Documenter ou supprimer src/, sil/, services/, runtime/** (🔴 Critique)
5. **Standardiser l'architecture DDD** (🟠 Haute)
6. **Ajouter des tests** (🟡 Moyenne)

---

## Document de Référence

Ce document est la **source de vérité** pour l'architecture du projet StudioEntretien/Intervo.

Toute modification de l'architecture doit être reflétée dans ce document.

**Version**: v1
**Date**: 2026-07-16
**Basé sur**: PHASE 1 Audit d'Architecture (Étapes 1-9)
