# 00_CURRENT_ARCHITECTURE.md

> Architecture actuelle du projet Trajectoire.
> Basée sur les audits PHASE 1 et SPRINT 2.

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
│                    apps/web/ (Next.js)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                  │
│                    apps/api/ (NestJS)                        │
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

## Applications

### apps/web ✅
**Type**: Next.js Application
**Version**: 0.1.0
**Taille**: 110.1 KB
**Statut**: ✅ Actif

**Dépendances internes**:
- @trajectoire/arena-engine (workspace:*)
- Interview, ATS, AI, Security, Orchestration, Analytics, Voice, Auth, Credits, Referral

**Dépendances externes**:
- Next.js 16.2.9
- React 19.2.4
- Supabase (@supabase/ssr, @supabase/supabase-js)

**Santé**: 40% (Critique)

---

### apps/api ⚠️
**Type**: NestJS Application
**Version**: 0.0.1
**Taille**: ?
**Statut**: ⚠️ Actif mais orphelin

**Dépendances internes**:
- Aucune

**Dépendances externes**:
- NestJS 11.0.1
- Socket.io 4.8.3
- @deepgram/sdk 3.13.0

**Santé**: 50% (Moyen)

---

### apps/realtime-gateway ⚠️
**Type**: WebSocket Gateway (Fastify)
**Version**: 0.1.0
**Taille**: ?
**Statut**: ⚠️ Actif mais orphelin

**Dépendances internes**:
- Aucune

**Dépendances externes**:
- Fastify 5
- @deepgram/sdk 3.13.0
- OpenAI 6.39.0
- Werift 0.22 (WebRTC)

**Santé**: 50% (Moyen)

---

## Packages

### @trajectoire/arena-engine ✅
**Type**: Package partagé
**Version**: 1.0.0
**Taille**: ?
**Statut**: ✅ Actif

**Exports**:
- `.`: ./src/index.ts
- `./db`: ./src/db/index.ts

**Contenu**:
- `src/index.ts`: Placeholder scoring engine
- `src/db/index.ts`: Singleton Prisma
- `src/ports/`: Ports (IOrchestrator, IHealing, IInfra)

**Utilisateurs**:
- apps/web (via @trajectoire/arena-engine)

**Santé**: 60% (Faible)

---

### voice-core ❌
**Type**: Package partagé
**Taille**: 0 items
**Statut**: ❌ Vide

**Action**: Supprimer

---

### voice-interview-client ❌
**Type**: Package partagé
**Taille**: 0 items
**Statut**: ❌ Vide

**Action**: Supprimer

---

## Domaines Métier

### Interview ✅
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

**Dépendances**:
- AI, Emotional Safety, Supabase, Prisma, Mistral

---

### ATS ✅
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

**Dépendances**:
- AI, Mistral

---

### AI ✅
**Emplacement**: lib/ai/
**Taille**: 9.1 KB
**Fichiers**: 11
**Santé**: 49.1% (Critique)

**Responsabilités**:
- Routage des modèles IA
- Monitoring IA
- Génération d'insights
- RAG
- Streaming IA
- Cache IA

**Dépendances**:
- Mistral

---

### Security ✅
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

**Dépendances**:
- Fraud, Prisma, Redis

---

### Orchestration ✅
**Emplacement**: lib/orchestration/
**Taille**: 8.7 KB
**Fichiers**: 6
**Santé**: 49.1% (Critique)

**Responsabilités**:
- Évaluation d'agents
- Moteur de consensus
- Routage de signaux
- Construction de graphes de décision

**Dépendances**:
- Fraud, Prisma

---

### Analytics ✅
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

**Dépendances**:
- Prisma

---

### Voice ✅
**Emplacement**: lib/voice/
**Taille**: 12.2 KB
**Fichiers**: 1
**Santé**: 48.8% (Critique)

**Responsabilités**:
- Client voix WebSocket
- Traitement audio
- Microphone
- Encodage PCM
- Lecture audio

**Dépendances**:
- Aucune

---

### Auth ✅
**Emplacement**: lib/auth/
**Taille**: 1.7 KB
**Fichiers**: 1
**Santé**: 49.8% (Critique)

**Responsabilités**:
- Gestion des sessions utilisateur
- Contrats utilisateur
- Authentification

**Dépendances**:
- Supabase

---

### Credits ✅
**Emplacement**: lib/credits/
**Taille**: 3.2 KB
**Fichiers**: 3
**Santé**: 49.7% (Critique)

**Responsabilités**:
- Gestion des crédits
- Transactions
- Contrats de facturation

**Dépendances**:
- Stripe, Supabase

---

### Referral ✅
**Emplacement**: lib/referral/
**Taille**: 1.5 KB
**Fichiers**: 1
**Santé**: 49.8% (Critique)

**Responsabilités**:
- Moteur de parrainage
- Boucle de croissance

**Dépendances**:
- Prisma

---

## Contexts Transversaux

### Behavior ✅
**Emplacement**: lib/behavior/
**Taille**: 0.3 KB
**Fichiers**: 1
**Santé**: 49.9% (Critique)

**Responsabilités**:
- Comportement transverse
- Analyse de réponses

**Dépendances**:
- Aucune

---

### Emotional Safety ✅
**Emplacement**: lib/emotional-safety/
**Taille**: 7.7 KB
**Fichiers**: 10
**Santé**: 49.2% (Critique)

**Responsabilités**:
- Sécurité émotionnelle
- Équilibrage émotionnel
- Charge cognitive

**Dépendances**:
- Aucune

---

### Engagement ✅
**Emplacement**: lib/engagement/
**Taille**: 10.2 KB
**Fichiers**: 11
**Santé**: 49.0% (Critique)

**Responsabilités**:
- Engagement transverse
- Coaching par email
- Analyse d'inactivité

**Dépendances**:
- Prisma

---

## Infrastructure

### Platform ✅
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

---

## Dépendances

### Dépendances Inter-Applications
- apps/web → @trajectoire/arena-engine
- apps/api → (aucune)
- apps/realtime-gateway → (aucune)

### Dépendances Inter-Domaines
- Interview → AI
- ATS → AI
- Orchestration → Fraud
- Security → Fraud
- Analytics → Prisma
- Voice → (aucune)
- Auth → Supabase
- Credits → Stripe, Supabase
- Referral → Prisma

### Dépendances Domaines → Infrastructure
- Interview → Prisma, Mistral, Supabase
- ATS → Mistral
- AI → Mistral
- Security → Prisma, Redis
- Orchestration → Prisma
- Analytics → Prisma
- Voice → (aucune)
- Auth → Supabase
- Credits → Prisma, Supabase
- Referral → Prisma

---

## Cycles

### Cycles Prouvés
**Aucun cycle prouvé**

### Cycles Hypothétiques (non prouvés)
- Interview ↔ Behavior: ❌ Non prouvé
- Interview ↔ Orchestration: ❌ Non prouvé
- AI ↔ Analytics: ❌ Non prouvé

---

## God Modules

### God Modules Identifiés
1. **lib/prisma** (8 dépendants) — Infrastructure critique, acceptable
2. **lib/mistral** (3 dépendants) — Infrastructure IA, acceptable
3. **lib/supabase** (4 dépendants) — Infrastructure base de données, acceptable

### Aucun God Module Métier
**Note**: Aucun domaine métier n'est un God Module

---

## Modules Orphelins

### Modules Orphelins Identifiés
1. **apps/api** — Orphelin (actif mais non intégré)
2. **apps/realtime-gateway** — Orphelin (actif mais non intégré)
3. **voice-core** — Orphelin et vide
4. **voice-interview-client** — Orphelin et vide

---

## Modules Morts

### Modules Morts Identifiés
1. **voice-core** — Mort (vide)
2. **voice-interview-client** — Mort (vide)
3. **beta-notes** — Mort (vide)
4. **artifacts** — Mort (vide)
5. **reports** — Mort (vide)
6. **metrics** — Mort (vide)
7. **coverage** — Mort (vide)

---

## Santé Globale

### Santé des Modules
- **apps/web**: 40% (Critique)
- **apps/api**: 50% (Moyen)
- **apps/realtime-gateway**: 50% (Moyen)
- **@trajectoire/arena-engine**: 60% (Faible)
- **Tous les domaines métier**: <50% (Critique)

### Causes Principales
1. **Aucun test** (0 tests pour tous les modules)
2. **Couplage variable** (0-10 dépendances)
3. **Taille variable** (0.3-110.1 KB)

---

## Conclusions

### Points Positifs
- ✅ **Aucun cycle prouvé** entre domaines métier
- ✅ **Aucun God Module métier** identifié
- ✅ **Couplage faible** entre domaines
- ✅ **Infrastructure bien isolée**

### Points Critiques
- ❌ **Aucun module n'a des tests** (0 tests pour tous les modules)
- ❌ **Tous les domaines métier ont une santé <50%**
- ❌ **apps/web a un couplage critique** (10 dépendances)
- ❌ **apps/api et apps/realtime-gateway sont orphelins**

### Actions Recommandées
1. **Ajouter des tests** à tous les modules (priorité critique)
2. **Réduire le couplage** de apps/web (priorité critique)
3. **Clarifier** apps/api et apps/realtime-gateway (priorité haute)
4. **Supprimer** packages vides (voice-core, voice-interview-client)
5. **Supprimer** dossiers vides (beta-notes, artifacts, reports, metrics, coverage)

---

## Document de Référence

Ce document est la **source de vérité** pour l'architecture actuelle du projet Trajectoire.

**Version**: Sprint 2
**Date**: 2026-07-16
**Basé sur**: PHASE 1 Audit d'Architecture + SPRINT 2 Dependency Mapping
