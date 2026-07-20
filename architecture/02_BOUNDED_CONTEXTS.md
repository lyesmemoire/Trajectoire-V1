# 02_BOUNDED_CONTEXTS.md

> Bounded Contexts du projet Trajectoire.
> Basés sur les audits PHASE 1 et SPRINT 2.

---

## Méthodologie

### Définition d'un Bounded Context
Un Bounded Context est une limite contextuelle dans laquelle un modèle de domaine a un sens spécifique.

### Critères d'Identification
- Responsabilités clairement définies
- Langage ubiquitaire spécifique
- Frontières explicites
- Dépendances minimales avec d'autres contexts

---

## Bounded Contexts Identifiés

### 1. Identity Context ✅
**Emplacement**: lib/auth/, domain/user.contract.ts
**Taille**: 1.7 KB
**Fichiers**: 1
**Santé**: 49.8% (Critique)

**Responsabilités**:
- Gestion des sessions utilisateur
- Contrats utilisateur
- Authentification
- Gestion des profils

**Langage Ubiquitaire**:
- User, Profile, Session, Authentication, Authorization

**Dépendances**:
- Supabase (infrastructure)

**Frontières**:
- Frontière explicite via domain/user.contract.ts
- Dépendance minimale (1 infrastructure)

**Statut**: ✅ Bounded Context clair

---

### 2. Interview Context ✅
**Emplacement**: lib/interview/
**Taille**: 47.3 KB
**Fichiers**: 17
**Santé**: 47.3% (Critique)

**Responsabilités**:
- Gestion des entretiens
- Moteur d'entretien
- Stratégies de suivi
- Génération de questions
- Personas et configuration
- Analyse des réponses
- Récupération et reprise
- Pression adaptative
- Équité (fairness)
- Comportement

**Langage Ubiquitaire**:
- Interview, Session, Question, Answer, Persona, Pressure, Fairness, Recovery

**Dépendances**:
- AI (domaine)
- Emotional Safety (context transverse)
- Supabase (infrastructure)
- Prisma (infrastructure)
- Mistral (infrastructure)

**Frontières**:
- Frontière explicite via lib/interview/
- Dépendances minimales (1 domaine, 1 context transverse, 3 infrastructures)

**Statut**: ✅ Bounded Context clair

---

### 3. Career Context ✅
**Emplacement**: lib/credits/, domain/billing.contract.ts
**Taille**: 3.2 KB
**Fichiers**: 3
**Santé**: 49.7% (Critique)

**Responsabilités**:
- Gestion des crédits
- Transactions
- Contrats de facturation
- Facturation
- Abonnements

**Langage Ubiquitaire**:
- Credit, Transaction, Billing, Subscription, Payment

**Dépendances**:
- Stripe (infrastructure)
- Supabase (infrastructure)
- Prisma (infrastructure)

**Frontières**:
- Frontière explicite via domain/billing.contract.ts
- Dépendances minimales (3 infrastructures)

**Statut**: ✅ Bounded Context clair

---

### 4. ATS Context ✅
**Emplacement**: lib/ats/
**Taille**: 23.7 KB
**Fichiers**: 2
**Santé**: 47.6% (Critique)

**Responsabilités**:
- Traitement de CV
- Optimisation ATS
- Extraction de profils
- Normalisation
- Enrichissement
- Scoring

**Langage Ubiquitaire**:
- CV, ATS, Profile, Extraction, Normalization, Scoring, Enrichment

**Dépendances**:
- AI (domaine)
- Mistral (infrastructure)

**Frontières**:
- Frontière explicite via lib/ats/
- Dépendances minimales (1 domaine, 1 infrastructure)

**Statut**: ✅ Bounded Context clair

---

### 5. Voice Context ✅
**Emplacement**: lib/voice/, lib/audio/, lib/realtime/
**Taille**: 12.2 KB
**Fichiers**: 1
**Santé**: 48.8% (Critique)

**Responsabilités**:
- Client voix WebSocket
- Traitement audio
- Microphone
- Encodage PCM
- Lecture audio
- Streaming audio

**Langage Ubiquitaire**:
- Voice, Audio, Microphone, PCM, Streaming, WebSocket

**Dépendances**:
- Aucune

**Frontières**:
- Frontière explicite via lib/voice/
- Dépendances nulles

**Statut**: ✅ Bounded Context clair

---

### 6. Analytics Context ✅
**Emplacement**: lib/analytics/
**Taille**: 16.3 KB
**Fichiers**: 11
**Santé**: 48.4% (Critique)

**Responsabilités**:
- Analytics comportementaux
- Stabilité comportementale
- Charge cognitive
- Fiabilité audio
- Sentinelle beta
- Vérité produit
- Time-to-wow

**Langage Ubiquitaire**:
- Analytics, Behavioral, Stability, Cognitive Load, Reliability, Product Truth, Time-to-wow

**Dépendances**:
- Prisma (infrastructure)

**Frontières**:
- Frontière explicite via lib/analytics/
- Dépendances minimales (1 infrastructure)

**Statut**: ✅ Bounded Context clair

---

### 7. AI Context ✅
**Emplacement**: lib/ai/
**Taille**: 9.1 KB
**Fichiers**: 11
**Santé**: 49.1% (Critique)

**Responsabilités**:
- Routage des modèles IA
- Monitoring IA
- Génération d'insights
- RAG (Retrieval-Augmented Generation)
- Streaming IA
- Cache IA
- Chunking de texte
- Réécriture de CV

**Langage Ubiquitaire**:
- AI, Model, Routing, Monitoring, RAG, Streaming, Cache, Chunking, Rewriting

**Dépendances**:
- Mistral (infrastructure)

**Frontières**:
- Frontière explicite via lib/ai/
- Dépendances minimales (1 infrastructure)

**Statut**: ✅ Bounded Context clair

---

### 8. Security Context ✅
**Emplacement**: lib/security/
**Taille**: 23.9 KB
**Fichiers**: 19
**Santé**: 47.6% (Critique)

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

**Langage Ubiquitaire**:
- Security, Audit, Fraud, Bot, Clone, Rate Limit, Sanitization, Hardening

**Dépendances**:
- Fraud (context transverse)
- Prisma (infrastructure)
- Redis (infrastructure)

**Frontières**:
- Frontière explicite via lib/security/
- Dépendances minimales (1 context transverse, 2 infrastructures)

**Statut**: ✅ Bounded Context clair

---

### 9. Orchestration Context ✅
**Emplacement**: lib/orchestration/
**Taille**: 8.7 KB
**Fichiers**: 6
**Santé**: 49.1% (Critique)

**Responsabilités**:
- Évaluation d'agents
- Moteur de consensus
- Routage de signaux
- Construction de graphes de décision
- Trace context

**Langage Ubiquitaire**:
- Orchestration, Agent, Consensus, Signal, Decision Graph, Trace

**Dépendances**:
- Fraud (context transverse)
- Prisma (infrastructure)

**Frontières**:
- Frontière explicite via lib/orchestration/
- Dépendances minimales (1 context transverse, 1 infrastructure)

**Statut**: ✅ Bounded Context clair

---

### 10. Platform Context ✅ (Proposition)

**Emplacement**: lib/prisma, lib/mistral, lib/supabase, lib/redis, lib/stripe, lib/posthog, lib/logger, lib/env, lib/errors, lib/resilience

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

**Langage Ubiquitaire**:
- Database, AI, Payment, Cache, Analytics, Logging, Configuration, Error, Resilience

**Dépendances**:
- Aucune (infrastructure)

**Frontières**:
- Frontière explicite via infrastructure/
- Dépendances nulles

**Statut**: ✅ Bounded Context clair (proposition)

---

## Contexts Transversaux

### Behavior Context ✅
**Emplacement**: lib/behavior/
**Taille**: 0.3 KB
**Fichiers**: 1
**Santé**: 49.9% (Critique)

**Responsabilités**:
- Comportement transverse
- Analyse de réponses

**Langage Ubiquitaire**:
- Behavior, Answer Analysis

**Dépendances**:
- Aucune

**Frontières**:
- Frontière explicite via lib/behavior/
- Dépendances nulles

**Statut**: ✅ Context Transverse clair

---

### Emotional Safety Context ✅
**Emplacement**: lib/emotional-safety/
**Taille**: 7.7 KB
**Fichiers**: 10
**Santé**: 49.2% (Critique)

**Responsabilités**:
- Sécurité émotionnelle
- Équilibrage émotionnel
- Charge cognitive
- Détection de freeze
- Détection de frustration
- Détection de rumination
- Fatigue de session

**Langage Ubiquitaire**:
- Emotional Safety, Balance, Cognitive Load, Freeze, Frustration, Rumination, Fatigue

**Dépendances**:
- Aucune

**Frontières**:
- Frontière explicite via lib/emotional-safety/
- Dépendances nulles

**Statut**: ✅ Context Transverse clair

---

### Engagement Context ✅
**Emplacement**: lib/engagement/
**Taille**: 10.2 KB
**Fichiers**: 11
**Santé**: 49.0% (Critique)

**Responsabilités**:
- Engagement transverse
- Coaching par email
- Analyse d'inactivité
- Momentum
- Return intent

**Langage Ubiquitaire**:
- Engagement, Coaching, Inactivity, Momentum, Return Intent

**Dépendances**:
- Prisma (infrastructure)

**Frontières**:
- Frontière explicite via lib/engagement/
- Dépendances minimales (1 infrastructure)

**Statut**: ✅ Context Transverse clair

---

### Fraud Context ✅
**Emplacement**: lib/fraud/
**Taille**: ?
**Fichiers**: ?
**Santé**: ?

**Responsabilités**:
- Détection de fraude
- Moteur de fraude
- Kernel de fraude

**Langage Ubiquitaire**:
- Fraud, Detection, Kernel

**Dépendances**:
- Aucune

**Frontières**:
- Frontière explicite via lib/fraud/
- Dépendances nulles

**Statut**: ✅ Context Transverse clair

---

## Graphe des Bounded Contexts

```
                Platform (Infrastructure)
                │
                ├─ Prisma
                ├─ Mistral
                ├─ Supabase
                ├─ Redis
                ├─ Stripe
                └─ PostHog
                │
     ┌──────────┼──────────┬──────────┬──────────┐
     │          │          │          │          │
 Identity   Interview    ATS       Voice     Career
     │          │          │          │          │
     │          ├─ AI      │          │          │
     │          │          │          │          │
     │          ├─ Emotional Safety          │
     │          │          │          │          │
     │          └─ Behavior │          │          │
     │                     │          │          │
     └────────────────────┼──────────┼──────────┘
                          │          │
                     Analytics  Security
                          │          │
                          │          ├─ Fraud
                          │          │
                          │          └─ Engagement
                          │
                     Orchestration
                          │
                          └─ Fraud
```

---

## Conclusions

### Points Positifs
- ✅ **10 Bounded Contexts clairs** identifiés
- ✅ **4 Contexts Transversaux** identifiés
- ✅ **Langage ubiquitaire** spécifique pour chaque context
- ✅ **Frontières explicites** pour chaque context
- ✅ **Dépendances minimales** entre contexts

### Points à Améliorer
- ⚠️ **Platform Context** non formellement défini (proposition)
- ⚠️ **Tous les contexts ont une santé <50%** (critique)
- ⚠️ **Aucun test** dans les contexts

### Recommandations
1. **Formaliser le Platform Context** (priorité haute)
2. **Ajouter des tests** à tous les contexts (priorité critique)
3. **Documenter le langage ubiquitaire** pour chaque context (priorité moyenne)

---

## Document de Référence

Ce document est la **source de vérité** pour les Bounded Contexts du projet Trajectoire.

**Version**: Sprint 2
**Date**: 2026-07-16
**Basé sur**: PHASE 1 Audit d'Architecture + SPRINT 2 Dependency Mapping
