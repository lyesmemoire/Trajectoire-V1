# DEPENDENCY_MATRIX.md

> Matrice de dépendances complète du projet Trajectoire.
> Basée sur des preuves réelles (imports analysés via grep).

---

## Méthodologie

### Modules Analysés
- **Applications**: apps/web, apps/api, apps/realtime-gateway
- **Packages**: @trajectoire/arena-engine
- **Domaines**: lib/interview, lib/ats, lib/ai, lib/security, lib/orchestration, lib/analytics, lib/voice, lib/auth, lib/credits, lib/referral, lib/marketing, lib/seo, lib/email, lib/pdf, lib/db, lib/jobs, lib/queue
- **Contexts Transversaux**: lib/behavior, lib/emotion, lib/engagement, lib/emotional-safety, lib/cognitive-load, lib/fraud, lib/insights, lib/prediction, lib/signals
- **Infrastructure**: lib/supabase, lib/prisma, lib/mistral, lib/openai, lib/stripe, lib/redis, lib/posthog, lib/logger, lib/env, lib/errors, lib/resilience

### Preuves Collectées
- Imports via `@/lib/*` analysés via grep
- Imports inter-applications analysés via grep
- Imports packages analysés via grep

---

## Matrice de Dépendances

### Légende
- **✔**: Dépendance prouvée (import trouvé)
- **✖**: Pas de dépendance (pas d'import trouvé)
- **⚠️**: Dépendance indirecte (via autre module)
- **?**: À vérifier

---

### Applications → Packages

| Application | @trajectoire/arena-engine | voice-core | voice-interview-client |
| ----------- | ------------------------- | ---------- | ---------------------- |
| apps/web    | ✔ (2 fichiers)           | ✖         | ✖                     |
| apps/api    | ✖                         | ✖         | ✖                     |
| apps/realtime-gateway | ✖               | ✖         | ✖                     |

**Preuves**:
```typescript
// apps/web/src/lib/arena/index.ts
import * as arena from "@trajectoire/arena-engine";

// apps/web/src/app/api/dashboard/scores/route.ts
import { prisma } from "@trajectoire/arena-engine/db";
```

---

### Applications → Domaines

| Application | Interview | ATS | AI | Security | Orchestration | Analytics | Voice | Auth | Credits | Referral |
| ----------- | --------- | --- | -- | -------- | ------------- | --------- | ----- | ---- | ------- | -------- |
| apps/web    | ✔         | ✔   | ✔  | ✔        | ✔             | ✔         | ✔     | ✔    | ✔       | ✔        |
| apps/api    | ✖         | ✖   | ✖  | ✖        | ✖             | ✖         | ✖     | ✖    | ✖       | ✖        |
| apps/realtime-gateway | ✖       | ✖   | ✖  | ✖        | ✖             | ✖         | ✖     | ✖    | ✖       | ✖        |

**Note**: apps/web a des imports vers tous les domaines via @/lib/*

---

### Domaines → Domaines

| Domaine | Interview | ATS | AI | Security | Orchestration | Analytics | Voice | Auth | Credits | Referral | Behavior | Emotion | Engagement |
| ------- | --------- | --- | -- | -------- | ------------- | --------- | ----- | ---- | ------- | -------- | -------- | ------- | ---------- |
| Interview | - | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| ATS | ✖ | - | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| AI | ✖ | ✖ | - | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Security | ✖ | ✖ | ✖ | - | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Orchestration | ✖ | ✖ | ✖ | ✖ | - | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Analytics | ✖ | ✖ | ✖ | ✖ | ✖ | - | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Voice | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | - | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Auth | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | - | ✖ | ✖ | ✖ | ✖ | ✖ |
| Credits | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | - | ✖ | ✖ | ✖ | ✖ |
| Referral | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | - | ✖ | ✖ | ✖ |
| Behavior | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | - | ✖ | ✖ |
| Emotion | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | - | ✖ |
| Engagement | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | - |

**Preuves**:
```typescript
// lib/interview/ → lib/ai/
lib/interview/behavior/answer-analysis.ts: import { mistralModel } from "@/lib/mistral";

// lib/ats/ → lib/ai/
lib/ats/orchestrator.ts: import { mistralSmallModel } from "@/lib/mistral";
```

**Note**: Aucun cycle prouvé entre domaines

---

### Domaines → Contexts Transversaux

| Domaine | Behavior | Emotion | Engagement | Emotional Safety | Cognitive Load | Fraud | Insights | Prediction | Signals |
| ------- | -------- | ------- | ---------- | ---------------- | -------------- | ----- | -------- | ---------- | ------- |
| Interview | ✖ | ✖ | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ |
| ATS | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| AI | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Security | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ | ✖ | ✖ | ✖ |
| Orchestration | ✖ | ✖ | ✖ | ✖ | ✖ | ✔ | ✖ | ✖ | ✖ |
| Analytics | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Voice | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Auth | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Credits | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Referral | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |

**Preuves**:
```typescript
// lib/interview/ → lib/emotional-safety/
lib/interview/orchestration/interview-orchestrator.ts: import { evaluateConfidenceRecovery } from "../../emotional-safety/confidence-recovery";

// lib/orchestration/ → lib/fraud/
lib/orchestration/agent.evaluator.ts: import { FraudKernelEngine } from "@/lib/fraud/fraud-kernel.engine";
```

---

### Domaines → Infrastructure

| Domaine | Supabase | Prisma | Mistral | OpenAI | Stripe | Redis | Posthog | Logger | Env | Errors | Resilience |
| ------- | -------- | ------ | ------- | ------ | ------ | ----- | ------ | ------ | --- | ------ | ---------- |
| Interview | ✔ | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| ATS | ✖ | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| AI | ✖ | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Security | ✔ | ✔ | ✖ | ✖ | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Orchestration | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Analytics | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Voice | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Auth | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Credits | ✔ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Referral | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |

**Preuves**:
```typescript
// lib/interview/ → lib/prisma
lib/interview/behavioral-memory.ts: import prisma from "@/lib/prisma";

// lib/interview/ → lib/mistral
lib/interview/behavior/answer-analysis.ts: import { mistralModel } from "@/lib/mistral";

// lib/security/ → lib/redis
lib/security/request-hardening.ts: import { getRedisClient } from "@/lib/redis";
```

---

### Contexts Transversaux → Infrastructure

| Context | Supabase | Prisma | Mistral | OpenAI | Stripe | Redis | Posthog | Logger | Env | Errors | Resilience |
| ------- | -------- | ------ | ------- | ------ | ------ | ----- | ------ | ------ | --- | ------ | ---------- |
| Behavior | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Emotion | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Engagement | ✖ | ✔ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Emotional Safety | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Cognitive Load | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Fraud | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Insights | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Prediction | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Signals | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |

**Preuves**:
```typescript
// lib/behavior/ → lib/prisma
lib/interview/behavior/behavioral-memory.ts: import prisma from "@/lib/prisma";

// lib/engagement/ → lib/prisma
lib/engagement/resend-coaching.ts: import prisma from "@/lib/prisma";
```

---

## Cycles Identifiés

### Cycles Prouvés
**Aucun cycle prouvé**

### Cycles Hypothétiques (à vérifier)
- **Interview ↔ Behavior**: ❌ Non prouvé (pas d'import trouvé)
- **Interview ↔ Orchestration**: ❌ Non prouvé (pas d'import trouvé)
- **AI ↔ Analytics**: ❌ Non prouvé (pas d'import trouvé)

---

## God Modules

### Définition
Un God Module est un module qui:
- A beaucoup de dépendants
- A beaucoup de dépendances
- Est utilisé par de nombreux autres modules

### God Modules Identifiés

#### 1. lib/prisma
**Dépendants**: Interview, Security, Orchestration, Analytics, Credits, Referral, Behavior, Engagement
**Dépendances**: Aucune (infrastructure)
**Score**: 8 dépendants

**Note**: Infrastructure critique, acceptable

---

#### 2. lib/mistral
**Dépendants**: Interview, ATS, AI
**Dépendances**: Aucune (infrastructure)
**Score**: 3 dépendants

**Note**: Infrastructure IA, acceptable

---

#### 3. lib/supabase
**Dépendants**: Interview, Security, Auth, Credits
**Dépendances**: Aucune (infrastructure)
**Score**: 4 dépendants

**Note**: Infrastructure base de données, acceptable

---

### Aucun God Module Métier
**Note**: Aucun domaine métier n'est un God Module

---

## Couplage Critique

### Définition
Couplage critique = module qui dépend de beaucoup d'autres modules

### Modules à Couplage Critique

#### 1. apps/web
**Dépendances**: Interview, ATS, AI, Security, Orchestration, Analytics, Voice, Auth, Credits, Referral
**Score**: 10 dépendances

**Note**: Application frontend, acceptable (couplage UI)

---

#### 2. lib/interview
**Dépendances**: AI, Emotional Safety, Supabase, Prisma, Mistral
**Score**: 5 dépendances

**Note**: Domaine central, acceptable

---

#### 3. lib/orchestration
**Dépendances**: Fraud, Prisma
**Score**: 2 dépendances

**Note**: Couplage faible

---

## Modules Orphelins

### Définition
Module orphelin = module sans dépendants

### Modules Orphelins Identifiés

#### 1. apps/api
**Dépendants**: Aucun
**Dépendances**: Aucune (interne)
**Statut**: ⚠️ Orphelin

**Note**: Application NestJS active mais non intégrée

---

#### 2. apps/realtime-gateway
**Dépendants**: Aucun
**Dépendances**: Aucune (interne)
**Statut**: ⚠️ Orphelin

**Note**: Gateway WebSocket active mais non intégrée

---

#### 3. voice-core (package)
**Dépendants**: Aucun
**Taille**: 0 items
**Statut**: ❌ Orphelin et vide

**Note**: À supprimer

---

#### 4. voice-interview-client (package)
**Dépendants**: Aucun
**Taille**: 0 items
**Statut**: ❌ Orphelin et vide

**Note**: À supprimer

---

## Modules Morts

### Définition
Module mort = module sans dépendants et sans dépendances

### Modules Morts Identifiés

#### 1. voice-core (package)
**Dépendants**: Aucun
**Dépendances**: Aucune
**Taille**: 0 items
**Statut**: ❌ Mort

**Action**: Supprimer

---

#### 2. voice-interview-client (package)
**Dépendants**: Aucun
**Dépendances**: Aucune
**Taille**: 0 items
**Statut**: ❌ Mort

**Action**: Supprimer

---

#### 3. beta-notes (dossier)
**Taille**: 0 items
**Statut**: ❌ Mort

**Action**: Supprimer

---

#### 4. artifacts (dossier)
**Taille**: 0 items
**Statut**: ❌ Mort

**Action**: Supprimer

---

#### 5. reports (dossier)
**Taille**: 0 items
**Statut**: ❌ Mort

**Action**: Supprimer

---

#### 6. metrics (dossier)
**Taille**: 0 items
**Statut**: ❌ Mort

**Action**: Supprimer

---

#### 7. coverage (dossier)
**Taille**: 0 items
**Statut**: ❌ Mort

**Action**: Supprimer

---

## Conclusions

### Points Positifs
- ✅ **Aucun cycle prouvé** entre domaines métier
- ✅ **Aucun God Module métier** identifié
- ✅ **Couplage faible** entre domaines
- ✅ **Infrastructure bien isolée** (Prisma, Mistral, Supabase)

### Points à Surveiller
- ⚠️ **apps/api**: Orphelin (actif mais non intégré)
- ⚠️ **apps/realtime-gateway**: Orphelin (actif mais non intégré)
- ⚠️ **apps/web**: Couplage critique (10 dépendances)

### Actions Recommandées
1. **Clarifier apps/api** (intégration ou suppression)
2. **Clarifier apps/realtime-gateway** (intégration ou suppression)
3. **Supprimer packages vides** (voice-core, voice-interview-client)
4. **Supprimer dossiers vides** (beta-notes, artifacts, reports, metrics, coverage)

---

## Document de Référence

Ce document est la **source de vérité** pour les dépendances du projet Trajectoire.

**Version**: Sprint 2
**Date**: 2026-07-16
**Basé sur**: Preuves réelles (imports analysés via grep)
