# PHASE 1 — Étape 2: Cartographie des Dépendances

## Objectif
Construire une matrice de dépendances entre domaines pour identifier les cycles et les couplages.

---

## Méthodologie
Analyse des imports et des relations entre domaines basée sur:
- Imports directs dans les fichiers TypeScript
- Appels de fonctions inter-domaines
- Partage de types et interfaces
- Dépendances externes (OpenAI, Mistral, Stripe, etc.)

---

## Matrice de Dépendances Principales

### 1. Interview Domain Dependencies

```
Interview
    ↓
questionBank (interne)
    ↓
Interview Engine (interne)
    ↓
Personas (interne)
    ↓
Prompts (interne)
    ↓
Behavior (transverse)
    ↓
Pressure (interne)
    ↓
Fairness (interne)
    ↓
Failure Recovery (interne)
    ↓
Orchestration (transverse)
```

**Dépendances externes**:
- Aucune dépendance externe directe
- Domaine relativement autonome

**Note**: Interview est bien isolé, dépend principalement de sous-domaines internes

---

### 2. ATS Domain Dependencies

```
ATS
    ↓
Extraction (interne ATS)
    ↓
Normalization (interne ATS)
    ↓
Scoring (interne ATS)
    ↓
Enrichment (interne ATS)
    ↓
Mistral (lib/mistral)
    ↓
AI SDK (ai)
    ↓
Schemas (interne ATS)
    ↓
Behavioral Logic (interne ATS)
    ↓
Recruiter Signals (interne ATS)
```

**Dépendances externes**:
- Mistral AI (via lib/mistral)
- AI SDK (via ai)
- PDF parsing (via extraction)

**Note**: ATS dépend fortement de l'IA pour le parsing et l'enrichissement

---

### 3. AI Domain Dependencies

```
AI
    ↓
Mistral (lib/mistral)
    ↓
OpenAI (lib/openai)
    ↓
AI SDK (ai)
    ↓
Cache (interne AI)
    ↓
RAG (interne AI)
    ↓
Streaming (interne AI)
    ↓
Chunker (interne AI)
    ↓
Career Memory (interne AI)
    ↓
ATS Heuristic (interne AI)
```

**Dépendances externes**:
- Mistral AI
- OpenAI
- AI SDK (Vercel AI)

**Note**: AI est un domaine central qui sert plusieurs autres domaines

---

### 4. Voice Domain Dependencies

```
Voice
    ↓
WebSocket (navigateur)
    ↓
MediaRecorder (navigateur)
    ↓
AudioContext (navigateur)
    ↓
Realtime (lib/realtime)
    ↓
Audio (lib/audio)
```

**Dépendances externes**:
- WebSocket API (navigateur)
- MediaRecorder API (navigateur)
- Web Audio API (navigateur)

**Note**: Voice dépend principalement des APIs navigateur et de Realtime

---

### 5. Realtime Domain Dependencies

```
Realtime
    ↓
WebSocket (lib/realtime/websocket)
    ↓
Audio (lib/realtime/audio)
    ↓
Microphone (interne)
    ↓
PCM Encoder (interne)
    ↓
Transcript Store (interne)
    ↓
Audio Playback (interne)
```

**Dépendances externes**:
- WebSocket
- Audio APIs

**Note**: Realtime est relativement autonome, focalisé sur la communication temps réel

---

### 6. Authentication Domain Dependencies

```
Authentication
    ↓
NextAuth (framework)
    ↓
Supabase Auth (infrastructure)
    ↓
Session Logic (interne)
    ↓
User Contract (domain)
```

**Dépendances externes**:
- NextAuth v5
- Supabase Auth

**Note**: Authentication dépend de frameworks d'authentification externes

---

### 7. Billing Domain Dependencies

```
Billing
    ↓
Stripe (lib/stripe)
    ↓
Credits (lib/credits)
    ↓
Billing Contract (domain)
    ↓
User Contract (domain)
```

**Dépendances externes**:
- Stripe

**Note**: Billing dépend fortement de Stripe

---

### 8. Analytics Domain Dependencies

```
Analytics
    ↓
PostHog (lib/posthog)
    ↓
Behavioral Analytics (interne)
    ↓
Behavioral Stability (interne)
    ↓
Cognitive Load (interne)
    ↓
Audio Reliability (interne)
    ↓
Product Truth (interne)
    ↓
Recovery Analytics (interne)
    ↓
Share Analytics (interne)
    ↓
Time-to-Wow (interne)
    ↓
Beta Sentinel (interne)
```

**Dépendances externes**:
- PostHog

**Note**: Analytics dépend de PostHog pour le tracking

---

### 9. Security Domain Dependencies

```
Security
    ↓
Rate Limit (interne)
    ↓
Fraud Engine (interne)
    ↓
Bot Shield (interne)
    ↓
Clone Detection (interne)
    ↓
Integrity Engine (interne)
    ↓
Prompt Sanitizer (interne)
    ↓
Request Hardening (interne)
    ↓
URL Guard (interne)
    ↓
Upstash (infrastructure)
    ↓
Fraud Contract (domain)
```

**Dépendances externes**:
- Upstash (Redis)

**Note**: Security dépend d'Upstash pour le rate limiting

---

### 10. Orchestration Domain Dependencies

```
Orchestration
    ↓
Agent Evaluator (interne)
    ↓
Consensus Engine (interne)
    ↓
Signal Router (interne)
    ↓
Decision Graph Builder (interne)
    ↓
Decision Graph Repository (interne)
    ↓
Trace Context (interne)
    ↓
Orchestration Contract (domain)
    ↓
Decision Graph Contract (domain)
```

**Dépendances externes**:
- Aucune dépendance externe directe

**Note**: Orchestration est un domaine purement interne

---

## Dépendances Transversales

### Behavior Domain
```
Behavior
    ↓
Interview (utilisé par)
    ↓
Analytics (utilisé par)
    ↓
Security (utilisé par)
```

**Note**: Behavior est un domaine transversal utilisé par plusieurs domaines

---

### Emotion Domain
```
Emotion
    ↓
Interview (utilisé par)
    ↓
Analytics (utilisé par)
    ↓
Emotional Safety (utilisé par)
```

**Note**: Emotion est un domaine transversal pour l'analyse émotionnelle

---

### Engagement Domain
```
Engagement
    ↓
Interview (utilisé par)
    ↓
Analytics (utilisé par)
```

**Note**: Engagement est utilisé pour mesurer l'engagement utilisateur

---

### Insights Domain
```
Insights
    ↓
Interview (utilisé par)
    ↓
Analytics (utilisé par)
    ↓
AI (utilisé par)
```

**Note**: Insights est généré par plusieurs domaines

---

### Prediction Domain
```
Prediction
    ↓
Interview (utilisé par)
    ↓
Analytics (utilisé par)
```

**Note**: Prediction est utilisé pour la prédiction comportementale

---

## Dépendances Infrastructure

### Database
```
Database
    ↓
Prisma (ORM)
    ↓
Supabase (PostgreSQL)
    ↓
Tous les domaines (utilisé par)
```

**Note**: Database est une dépendance critique pour tous les domaines

---

### Redis
```
Redis
    ↓
Upstash (provider)
    ↓
Security (rate limiting)
    ↓
Queue (file d'attente)
    ↓
Cache (AI)
```

**Note**: Redis est utilisé pour le cache et le rate limiting

---

### Supabase
```
Supabase
    ↓
Authentication
    ↓
Database
    ↓
Storage
    ↓
Realtime
```

**Note**: Supabase est une dépendance multi-fonctionnelle

---

## Cycles Identifiés

### Cycle 1: Interview ↔ Behavior
```
Interview → Behavior → Interview
```
**Sévérité**: Faible
**Note**: Cycle acceptable car Behavior est un domaine transversal

---

### Cycle 2: AI ↔ Analytics
```
AI → Analytics → AI
```
**Sévérité**: Faible
**Note**: Cycle acceptable pour le monitoring IA

---

### Cycle 3: Interview ↔ Orchestration
```
Interview → Orchestration → Interview
```
**Sévérité**: Moyenne
**Note**: Cycle à surveiller, pourrait indiquer un couplage

---

### Aucun Cycle Critique
**Note**: Aucun cycle critique identifié qui empêcherait la maintenance

---

## Dépendances Externes Critiques

### AI Providers
- **OpenAI**: GPT-4, GPT-4o-mini
- **Mistral AI**: Mistral Small
- **Google Generative AI**: Gemini

**Impact**: Critique pour le fonctionnement de l'application

---

### Payment Provider
- **Stripe**: Paiements et abonnements

**Impact**: Critique pour la monétisation

---

### Analytics Provider
- **PostHog**: Analytics et tracking

**Impact**: Important pour le monitoring

---

### Error Tracking
- **Sentry**: Error tracking

**Impact**: Important pour la stabilité

---

### Infrastructure Providers
- **Supabase**: Database, Auth, Storage, Realtime
- **Upstash**: Redis, Rate Limiting

**Impact**: Critique pour l'infrastructure

---

## Matrice de Couplage

### Couplage Fort
- **ATS ↔ AI**: ATS dépend fortement de l'IA pour le parsing
- **Billing ↔ Stripe**: Billing dépend fortement de Stripe
- **Authentication ↔ NextAuth**: Authentication dépend de NextAuth
- **Security ↔ Upstash**: Security dépend d'Upstash

**Note**: Ces couplages sont acceptables car ils sont avec des providers externes stables

---

### Couplage Moyen
- **Interview ↔ Behavior**: Interview utilise Behavior pour l'analyse
- **Analytics ↔ PostHog**: Analytics dépend de PostHog
- **Voice ↔ Realtime**: Voice dépend de Realtime pour la communication

**Note**: Ces couplages sont gérables

---

### Couplage Faible
- **Orchestration**: Domaine relativement autonome
- **Referral**: Domaine simple et isolé
- **Marketing**: Domaine simple et isolé
- **SEO**: Domaine simple et isolé

**Note**: Ces domaines sont bien isolés

---

## Recommandations

### 1. Réduire le Couplage Interview ↔ Orchestration
**Action**: Clarifier la frontière entre Interview et Orchestration
**Priorité**: Moyenne

---

### 2. Standardiser les Dépendances IA
**Action**: Créer une couche d'abstraction unifiée pour les providers IA
**Priorité**: Haute

---

### 3. Isoler Behavior Transverse
**Action**: Clarifier l'interface de Behavior pour éviter les dépendances circulaires
**Priorité**: Faible

---

### 4. Documenter les Dépendances Externes
**Action**: Créer un document de référence pour les dépendances externes
**Priorité**: Moyenne

---

## Conclusions de l'Étape 2

### Points Positifs
- ✅ **Aucun cycle critique**: Les cycles identifiés sont acceptables
- ✅ **Domaines bien isolés**: Orchestration, Referral, Marketing, SEO
- ✅ **Dépendances externes stables**: OpenAI, Mistral, Stripe, Supabase
- ✅ **Couplage gérable**: La plupart des couplages sont avec des providers externes

### Points à Surveiller
- ⚠️ **Couplage Interview ↔ Orchestration**: À clarifier
- ⚠️ **Dépendance forte ATS ↔ AI**: À surveiller
- ⚠️ **Dépendance forte Billing ↔ Stripe**: À surveiller

### Prochaine Étape
Étape 3: Cartographie des packages (app, apps, components, core, lib, modules, providers)
