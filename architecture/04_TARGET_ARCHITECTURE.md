# 04_TARGET_ARCHITECTURE.md

> Architecture cible du projet Trajectoire.
> Basée sur l'audit PHASE 1 et le Dependency Mapping SPRINT 2.

---

## Vue d'ensemble

### Objectifs de l'Architecture Cible
1. **Séparation claire des responsabilités** (DDD complet)
2. **Couplage minimal** entre bounded contexts
3. **Tests complets** pour tous les modules
4. **Infrastructure isolée** (Platform Context)
5. **Documentation explicite** (contracts, bounded contexts)

---

## Architecture Cible

### Structure Cible
```
Trajectoire/
├── apps/
│   ├── web/ (Next.js Application)
│   ├── api/ (NestJS Application)
│   └── realtime-gateway/ (WebSocket Gateway)
├── packages/
│   └── @trajectoire/arena-engine/ (Package partagé)
├── lib/
│   ├── identity/ (Identity Context)
│   ├── interview/ (Interview Context)
│   ├── career/ (Career Context)
│   ├── ats/ (ATS Context)
│   ├── voice/ (Voice Context)
│   ├── analytics/ (Analytics Context)
│   ├── ai/ (AI Context)
│   ├── security/ (Security Context)
│   └── orchestration/ (Orchestration Context)
├── platform/ (Platform Context)
│   ├── database/ (Prisma, Supabase)
│   ├── ai/ (Mistral, OpenAI)
│   ├── payments/ (Stripe)
│   ├── cache/ (Redis)
│   ├── analytics/ (PostHog)
│   ├── logging/ (Logger)
│   ├── config/ (Env)
│   ├── errors/ (Errors)
│   └── resilience/ (Resilience)
└── domain/ (Domain Contracts)
    ├── identity.contract.ts
    ├── interview.contract.ts
    ├── career.contract.ts
    ├── ats.contract.ts
    ├── voice.contract.ts
    ├── analytics.contract.ts
    ├── ai.contract.ts
    ├── security.contract.ts
    └── orchestration.contract.ts
```

---

## Bounded Contexts Cibles

### 1. Identity Context
**Emplacement**: lib/identity/
**Responsabilités**:
- Gestion des sessions utilisateur
- Contrats utilisateur
- Authentification
- Gestion des profils

**Structure**:
```
lib/identity/
├── domain/ (Domain Layer)
│   ├── user.entity.ts
│   ├── profile.entity.ts
│   └── session.entity.ts
├── application/ (Application Layer)
│   ├── authenticate.use-case.ts
│   ├── register.use-case.ts
│   └── session.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── user.repository.ts
│   ├── profile.repository.ts
│   └── session.repository.ts
└── tests/ (Tests)
    ├── authenticate.use-case.spec.ts
    ├── register.use-case.spec.ts
    └── session.use-case.spec.ts
```

**Dépendances**:
- platform/database (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 2. Interview Context
**Emplacement**: lib/interview/
**Responsabilités**:
- Gestion des entretiens
- Moteur d'entretien
- Stratégies de suivi
- Génération de questions
- Personas et configuration

**Structure**:
```
lib/interview/
├── domain/ (Domain Layer)
│   ├── interview.entity.ts
│   ├── question.entity.ts
│   ├── persona.entity.ts
│   └── state.entity.ts
├── application/ (Application Layer)
│   ├── start-interview.use-case.ts
│   ├── next-question.use-case.ts
│   ├── submit-answer.use-case.ts
│   └── end-interview.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── interview.repository.ts
│   ├── question.repository.ts
│   └── state.repository.ts
└── tests/ (Tests)
    ├── start-interview.use-case.spec.ts
    ├── next-question.use-case.spec.ts
    ├── submit-answer.use-case.spec.ts
    └── end-interview.use-case.spec.ts
```

**Dépendances**:
- lib/ai (domaine)
- platform/database (infrastructure)
- platform/ai (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 3. Career Context
**Emplacement**: lib/career/
**Responsabilités**:
- Gestion des crédits
- Transactions
- Contrats de facturation
- Facturation
- Abonnements

**Structure**:
```
lib/career/
├── domain/ (Domain Layer)
│   ├── credit.entity.ts
│   ├── transaction.entity.ts
│   └── subscription.entity.ts
├── application/ (Application Layer)
│   ├── deduct-credits.use-case.ts
│   ├── add-credits.use-case.ts
│   └── manage-subscription.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── credit.repository.ts
│   ├── transaction.repository.ts
│   └── subscription.repository.ts
└── tests/ (Tests)
    ├── deduct-credits.use-case.spec.ts
    ├── add-credits.use-case.spec.ts
    └── manage-subscription.use-case.spec.ts
```

**Dépendances**:
- platform/payments (infrastructure)
- platform/database (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 4. ATS Context
**Emplacement**: lib/ats/
**Responsabilités**:
- Traitement de CV
- Optimisation ATS
- Extraction de profils
- Normalisation
- Enrichissement
- Scoring

**Structure**:
```
lib/ats/
├── domain/ (Domain Layer)
│   ├── cv.entity.ts
│   ├── profile.entity.ts
│   └── score.entity.ts
├── application/ (Application Layer)
│   ├── extract-cv.use-case.ts
│   ├── normalize-profile.use-case.ts
│   ├── score-ats.use-case.ts
│   └── enrich-feedback.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── cv.repository.ts
│   ├── profile.repository.ts
│   └── score.repository.ts
└── tests/ (Tests)
    ├── extract-cv.use-case.spec.ts
    ├── normalize-profile.use-case.spec.ts
    ├── score-ats.use-case.spec.ts
    └── enrich-feedback.use-case.spec.ts
```

**Dépendances**:
- lib/ai (domaine)
- platform/ai (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 5. Voice Context
**Emplacement**: lib/voice/
**Responsabilités**:
- Client voix WebSocket
- Traitement audio
- Microphone
- Encodage PCM
- Lecture audio
- Streaming audio

**Structure**:
```
lib/voice/
├── domain/ (Domain Layer)
│   ├── audio.entity.ts
│   ├── microphone.entity.ts
│   └── stream.entity.ts
├── application/ (Application Layer)
│   ├── start-audio.use-case.ts
│   ├── stop-audio.use-case.ts
│   └── stream-audio.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── audio.repository.ts
│   └── stream.repository.ts
└── tests/ (Tests)
    ├── start-audio.use-case.spec.ts
    ├── stop-audio.use-case.spec.ts
    └── stream-audio.use-case.spec.ts
```

**Dépendances**:
- apps/realtime-gateway (application)

**Santé Cible**: 90% (Excellent)

---

### 6. Analytics Context
**Emplacement**: lib/analytics/
**Responsabilités**:
- Analytics comportementaux
- Stabilité comportementale
- Charge cognitive
- Fiabilité audio
- Sentinelle beta
- Vérité produit
- Time-to-wow

**Structure**:
```
lib/analytics/
├── domain/ (Domain Layer)
│   ├── analytics.entity.ts
│   ├── stability.entity.ts
│   └── reliability.entity.ts
├── application/ (Application Layer)
│   ├── compute-analytics.use-case.ts
│   ├── compute-stability.use-case.ts
│   └── compute-reliability.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── analytics.repository.ts
│   └── stability.repository.ts
└── tests/ (Tests)
    ├── compute-analytics.use-case.spec.ts
    ├── compute-stability.use-case.spec.ts
    └── compute-reliability.use-case.spec.ts
```

**Dépendances**:
- platform/database (infrastructure)
- platform/analytics (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 7. AI Context
**Emplacement**: lib/ai/
**Responsabilités**:
- Routage des modèles IA
- Monitoring IA
- Génération d'insights
- RAG (Retrieval-Augmented Generation)
- Streaming IA
- Cache IA
- Chunking de texte
- Réécriture de CV

**Structure**:
```
lib/ai/
├── domain/ (Domain Layer)
│   ├── model.entity.ts
│   ├── prompt.entity.ts
│   └── embedding.entity.ts
├── application/ (Application Layer)
│   ├── route-model.use-case.ts
│   ├── generate-insights.use-case.ts
│   └── stream-response.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── model.repository.ts
│   └── embedding.repository.ts
└── tests/ (Tests)
    ├── route-model.use-case.spec.ts
    ├── generate-insights.use-case.spec.ts
    └── stream-response.use-case.spec.ts
```

**Dépendances**:
- platform/ai (infrastructure)
- platform/cache (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 8. Security Context
**Emplacement**: lib/security/
**Responsabilités**:
- Audit admin
- Journal d'audit
- Entropie comportementale
- Bouclier anti-bot
- Détection de clones
- Moteur de fraude
- Rate limiting
- Sanitisation de prompts
- Hardening des requêtes

**Structure**:
```
lib/security/
├── domain/ (Domain Layer)
│   ├── audit.entity.ts
│   ├── fraud.entity.ts
│   └── bot.entity.ts
├── application/ (Application Layer)
│   ├── log-audit.use-case.ts
│   ├── detect-fraud.use-case.ts
│   └── block-bot.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── audit.repository.ts
│   └── fraud.repository.ts
└── tests/ (Tests)
    ├── log-audit.use-case.spec.ts
    ├── detect-fraud.use-case.spec.ts
    └── block-bot.use-case.spec.ts
```

**Dépendances**:
- platform/database (infrastructure)
- platform/cache (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 9. Orchestration Context
**Emplacement**: lib/orchestration/
**Responsabilités**:
- Évaluation d'agents
- Moteur de consensus
- Routage de signaux
- Construction de graphes de décision
- Trace context

**Structure**:
```
lib/orchestration/
├── domain/ (Domain Layer)
│   ├── agent.entity.ts
│   ├── consensus.entity.ts
│   └── decision-graph.entity.ts
├── application/ (Application Layer)
│   ├── evaluate-agent.use-case.ts
│   ├── resolve-consensus.use-case.ts
│   └── route-signal.use-case.ts
├── infrastructure/ (Infrastructure Layer)
│   ├── agent.repository.ts
│   └── decision-graph.repository.ts
└── tests/ (Tests)
    ├── evaluate-agent.use-case.spec.ts
    ├── resolve-consensus.use-case.spec.ts
    └── route-signal.use-case.spec.ts
```

**Dépendances**:
- lib/security (domaine)
- platform/database (infrastructure)

**Santé Cible**: 90% (Excellent)

---

### 10. Platform Context
**Emplacement**: platform/
**Responsabilités**:
- Base de données (Prisma, Supabase)
- IA (Mistral, OpenAI)
- Paiements (Stripe)
- Cache (Redis)
- Analytics (PostHog)
- Logging (Logger)
- Configuration (Env)
- Gestion des erreurs (Errors)
- Résilience (Resilience)

**Structure**:
```
platform/
├── database/
│   ├── prisma/
│   └── supabase/
├── ai/
│   ├── mistral/
│   └── openai/
├── payments/
│   └── stripe/
├── cache/
│   └── redis/
├── analytics/
│   └── posthog/
├── logging/
│   └── logger/
├── config/
│   └── env/
├── errors/
│   └── errors/
└── resilience/
    └── resilience/
```

**Dépendances**:
- Aucune (infrastructure)

**Santé Cible**: 90% (Excellent)

---

## Dépendances Cibles

### Dépendances Inter-Applications
- apps/web → @trajectoire/arena-engine
- apps/web → lib/identity
- apps/web → lib/interview
- apps/web → lib/career
- apps/web → lib/ats
- apps/web → lib/voice
- apps/web → lib/analytics
- apps/api → lib/identity
- apps/api → lib/security
- apps/realtime-gateway → lib/voice

### Dépendances Inter-Domaines
- Interview → AI
- ATS → AI
- Orchestration → Security
- Voice → apps/realtime-gateway

### Dépendances Domaines → Platform
- Identity → platform/database
- Interview → platform/database, platform/ai
- Career → platform/database, platform/payments
- ATS → platform/ai
- Voice → (aucune)
- Analytics → platform/database, platform/analytics
- AI → platform/ai, platform/cache
- Security → platform/database, platform/cache
- Orchestration → platform/database

---

## Cycles Cibles

### Cycles Cibles
**Aucun cycle cible**

### Stratégie Anti-Cycle
- **Dépendances unidirectionnelles**: Domain → Platform uniquement
- **Pas de dépendances inter-domaines** (sauf cas justifiés)
- **Ports et Adapters**: Isolation via interfaces

---

## Tests Cibles

### Couverture de Tests Cible
- **90%** de couverture pour tous les domaines
- **100%** de couverture pour les use cases critiques
- **100%** de couverture pour la sécurité

### Stratégie de Tests
- **Unit Tests**: Tests des use cases
- **Integration Tests**: Tests des repositories
- **E2E Tests**: Tests des applications

---

## Santé Cible

### Santé Cible des Modules
- **Tous les domaines**: 90% (Excellent)
- **Toutes les applications**: 80% (Bon)
- **Platform**: 90% (Excellent)

### Métriques Cibles
- **Tests**: 90% de couverture
- **Dépendants**: 0-5 par module
- **Dépendances**: 0-3 par module
- **Taille**: <50 KB par module

---

## Conclusions

### Objectifs Principaux
1. **Architecture DDD complète** pour tous les domaines
2. **Tests complets** (90% de couverture)
3. **Couplage minimal** (0-3 dépendances par module)
4. **Platform Context isolé** (infrastructure)
5. **Documentation explicite** (contracts)

### Actions Prioritaires
1. **Restructurer** tous les domaines en DDD (domain/application/infrastructure/tests)
2. **Ajouter des tests** à tous les modules (90% de couverture)
3. **Isoler Platform Context** (infrastructure)
4. **Documenter les contracts** pour tous les domaines
5. **Réduire le couplage** entre domaines

---

## Document de Référence

Ce document est la **source de vérité** pour l'architecture cible du projet Trajectoire.

**Version**: Sprint 2
**Date**: 2026-07-16
**Basé sur**: PHASE 1 Audit d'Architecture + SPRINT 2 Dependency Mapping
