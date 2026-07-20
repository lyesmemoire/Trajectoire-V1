# PHASE 1 — Étape 1: Cartographie des Domaines Métier

## Objectif
Identifier tous les domaines métier réels, leur emplacement, leur état et leurs relations.

---

## Domaines Métier Identifiés

### 1. Authentication & Users
**Emplacement**: `lib/auth/`, `domain/user.contract.ts`
**État**: ✅ Actif
**Responsabilités**:
- Gestion des sessions utilisateur
- Contrats utilisateur
- Authentification (NextAuth v5)

**Note**: Domaine central, bien structuré avec contrats dans `domain/`

---

### 2. Interview
**Emplacement**: `lib/interview/`, `domain/interview.contract.ts`
**État**: ✅ Actif (34 items)
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

**Sous-domaines**:
- `behavior/` — Comportement de l'entretien
- `orchestration/` — Orchestration de l'entretien
- `failure-recovery/` — Récupération des échecs
- `fairness/` — Équité
- `pressure/` — Gestion de la pression
- `replay/` — Relecture
- `schemas/` — Schémas de données
- `types/` — Types TypeScript
- `prompts/` — Prompts IA

**Note**: Domaine très complet, bien structuré

---

### 3. AI (Artificial Intelligence)
**Emplacement**: `lib/ai/`, `lib/ai-routing/`, `lib/ai-monitoring/`, `lib/prompts/`
**État**: ✅ Actif
**Responsabilités**:
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
- Tracking des compétences

**Sous-domaines**:
- `ai/` — Core IA
- `ai-routing/` — Routage des modèles
- `ai-monitoring/` — Monitoring IA
- `prompts/` — Gestion des prompts

**Note**: Domaine critique, bien structuré avec sous-domaines spécialisés

---

### 4. Voice & Audio
**Emplacement**: `lib/voice/`, `lib/audio/`, `lib/realtime/audio/`, `core/audio/`
**État**: ✅ Actif
**Responsabilités**:
- Client voix WebSocket
- Traitement audio
- Microphone
- Encodage PCM
- Lecture audio
- Streaming audio

**Sous-domaines**:
- `voice/` — Client voix
- `audio/` — Traitement audio
- `realtime/audio/` — Audio temps réel
- `core/audio/` — Audio core

**Note**: Domaine bien structuré, séparation claire entre client et core

---

### 5. Realtime
**Emplacement**: `lib/realtime/`, `gateway/`
**État**: ✅ Actif
**Responsabilités**:
- Communication temps réel
- WebSocket
- Transcript store
- Playback audio
- Microphone

**Sous-domaines**:
- `realtime/` — Core temps réel
- `gateway/` — Gateway WebSocket

**Note**: Domaine critique pour l'interactivité

---

### 6. CV (Curriculum Vitae)
**Emplacement**: `lib/cv/`, `lib/ats/`
**État**: ⚠️ Partiel (cv/ vide sauf application/)
**Responsabilités**:
- Traitement de CV
- Optimisation ATS
- Extraction de profils
- Normalisation
- Enrichissement
- Scoring
- Signaux recruteur

**Sous-domaines**:
- `cv/` — Core CV (vide)
- `ats/` — ATS (très complet)

**Note**: CV core vide, délégué à ATS. Architecture à clarifier.

---

### 7. ATS (Applicant Tracking System)
**Emplacement**: `lib/ats/`
**État**: ✅ Actif
**Responsabilités**:
- Logique comportementale
- Contrats
- Enrichissement
- Extraction
- Normalisation
- Orchestrateur
- Orchestrateur premium
- Signaux recruteur
- Schémas
- Scoring

**Sous-domaines**:
- `behavioral-logic/` — Logique comportementale
- `contracts/` — Contrats
- `enrichment/` — Enrichissement
- `extraction/` — Extraction
- `normalization/` — Normalisation
- `recruiter-signals/` — Signaux recruteur
- `schemas/` — Schémas
- `scoring/` — Scoring

**Note**: Domaine très complet, remplace CV core

---

### 8. Billing & Payments
**Emplacement**: `domain/billing.contract.ts`, `lib/credits/`, `lib/stripe.ts`
**État**: ✅ Actif
**Responsabilités**:
- Contrats de facturation
- Gestion des crédits
- Intégration Stripe
- Transactions

**Sous-domaines**:
- `credits/` — Crédits
- `stripe.ts` — Integration Stripe

**Note**: Domaine bien structuré avec contrats

---

### 9. Analytics & Monitoring
**Emplacement**: `lib/analytics/`, `lib/monitoring/`, `lib/observability/`, `lib/metrics/`
**État**: ✅ Actif
**Responsabilités**:
- Analytics comportementaux
- Stabilité comportementale
- Charge cognitive
- Fiabilité audio
- Sentinelle beta
- Vérité produit
- Analytics de récupération
- Analytics de partage
- Time-to-wow
- Monitoring (Sentry)
- Observabilité
- Métriques

**Sous-domaines**:
- `analytics/` — Core analytics
- `monitoring/` — Monitoring
- `observability/` — Observabilité
- `metrics/` — Métriques

**Note**: Domaine très complet, bien structuré

---

### 10. Security
**Emplacement**: `lib/security/`
**État**: ✅ Actif (20 items)
**Responsabilités**:
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
- Durcissement des requêtes
- ID de requête
- Nettoyage des requêtes
- Signature des requêtes
- Éditeur CV requis
- Mapping des routes
- Sanitisation CV
- Client Upstash
- Garde URL

**Sous-domaines**:
- `detectors/` — Détecteurs

**Note**: Domaine très complet, sécurité multicouche

---

### 11. Fraud Detection
**Emplacement**: `lib/fraud/`, `domain/fraud-kernel.contract.ts`
**État**: ✅ Actif
**Responsabilités**:
- Détection de fraude
- Noyau de fraude

**Note**: Domaine spécialisé, intégré à Security

---

### 12. Orchestration
**Emplacement**: `lib/orchestration/`, `domain/orchestration.contract.ts`
**État**: ✅ Actif
**Responsabilités**:
- Évaluateur d'agents
- Moteur de consensus
- Routeur de signaux
- Constructeur de graphes de décision
- Repository de graphes de décision
- Contexte de trace

**Sous-domaines**:
- `core/` — Core orchestration

**Note**: Domaine bien structuré avec contrats

---

### 13. Decision Graph
**Emplacement**: `domain/decision-graph.contract.ts`, `lib/orchestration/decision-graph.*`
**État**: ✅ Actif
**Responsabilités**:
- Graphes de décision
- Construction de graphes
- Repository de graphes

**Note**: Sous-domaine d'Orchestration

---

### 14. Queue & Jobs
**Emplacement**: `lib/queue/`, `lib/jobs/`
**État**: ⚠️ Minimal
**Responsabilités**:
- File d'attente
- Jobs

**Note**: Domaine minimal, à développer

---

### 15. Referral
**Emplacement**: `lib/referral/`
**État**: ✅ Actif
**Responsabilités**:
- Moteur de parrainage

**Note**: Domaine simple, bien isolé

---

### 16. Marketing
**Emplacement**: `lib/marketing/`
**État**: ✅ Actif
**Responsabilités**:
- Marketing

**Note**: Domaine simple

---

### 17. SEO
**Emplacement**: `lib/seo/`
**État**: ✅ Actif
**Responsabilités**:
- SEO

**Note**: Domaine simple

---

### 18. Email
**Emplacement**: `lib/email.ts`
**État**: ✅ Actif
**Responsabilités**:
- Gestion des emails

**Note**: Fichier unique, bien isolé

---

### 19. PDF
**Emplacement**: `lib/pdf/`
**État**: ✅ Actif
**Responsabilités**:
- Génération PDF

**Note**: Domaine simple

---

### 20. Database
**Emplacement**: `lib/db/`
**État**: ✅ Actif (14 items)
**Responsabilités**:
- Utilitaires de base de données
- Prisma client

**Note**: Infrastructure, pas domaine métier

---

### 21. Infrastructure (Transverse)
**Emplacement**: `lib/env/`, `lib/errors/`, `lib/logger/`, `lib/resilience/`, `lib/redis.ts`, `lib/supabase/`
**État**: ✅ Actif
**Responsabilités**:
- Configuration environnement
- Gestion des erreurs
- Logging
- Résilience
- Redis
- Supabase

**Note**: Infrastructure transverse

---

### 22. Behavior (Transverse)
**Emplacement**: `lib/behavior/`, `lib/emotion/`, `lib/engagement/`, `lib/insights/`, `lib/prediction/`
**État**: ✅ Actif
**Responsabilités**:
- Comportement
- Émotion
- Engagement
- Insights
- Prédiction

**Note**: Domaines transversaux utilisés par plusieurs contextes

---

### 23. Emotional Safety
**Emplacement**: `lib/emotional-safety/`, `lib/emotional-balancing/`, `lib/cognitive-load/`
**État**: ✅ Actif
**Responsabilités**:
- Sécurité émotionnelle
- Équilibrage émotionnel
- Charge cognitive

**Note**: Domaine critique pour l'expérience utilisateur

---

### 24. Learning & Coaching
**Emplacement**: `lib/coaching/`, `lib/habits/`, `lib/challenges/`
**État**: ✅ Actif
**Responsabilités**:
- Coaching
- Habitudes
- Défis

**Note**: Domaines d'apprentissage

---

### 25. Admin
**Emplacement**: `lib/admin/`
**État**: ✅ Actif
**Responsabilités**:
- Administration

**Note**: Domaine admin

---

### 26. Activation
**Emplacement**: `lib/activation/`
**État**: ✅ Actif
**Responsabilités**:
- Activation utilisateur

**Note**: Domaine simple

---

### 27. Flags
**Emplacement**: `lib/flags/`
**État**: ✅ Actif
**Responsabilités**:
- Feature flags

**Note**: Domaine simple

---

### 28. Privacy
**Emplacement**: `lib/privacy/`
**État**: ✅ Actif
**Responsabilités**:
- Confidentialité

**Note**: Domaine simple

---

### 29. Progressive Disclosure
**Emplacement**: `lib/progressive-disclosure/`
**État**: ✅ Actif
**Responsabilités**:
- Divulgation progressive

**Note**: Domaine simple

---

### 30. Share
**Emplacement**: `lib/share/`
**État**: ✅ Actif
**Responsabilités**:
- Partage

**Note**: Domaine simple

---

### 31. Signals
**Emplacement**: `lib/signals/`
**État**: ✅ Actif
**Responsabilités**:
- Signaux

**Note**: Domaine simple

---

### 32. UX
**Emplacement**: `lib/ux/`
**État**: ✅ Actif
**Responsabilités**:
- Expérience utilisateur

**Note**: Domaine simple

---

### 33. Types
**Emplacement**: `lib/types/`, `types/`
**État**: ✅ Actif
**Responsabilités**:
- Types TypeScript

**Note**: Infrastructure, pas domaine métier

---

### 34. Utils
**Emplacement**: `lib/utils.ts`
**État**: ✅ Actif
**Responsabilités**:
- Utilitaires

**Note**: Infrastructure, pas domaine métier

---

### 35. Core (Phased Implementation)
**Core**: `core/audio/`, `core/interview-preparation/`, `core/p5/`, `core/p6/`, `core/p7/`
**État**: ✅ Actif
**Responsabilités**:
- Audio core
- Préparation d'entretien
- Implémentation phased (P5, P6, P7)

**Note**: Core business logic, phased implementation

---

### 36. Agents
**Emplacement**: `lib/agents/`
**État**: ✅ Actif
**Responsabilités**:
- Agents IA

**Note**: Domaine agents IA

---

### 37. Archetypes
**Emplacement**: `lib/archetypes/`
**État**: ✅ Actif
**Responsabilités**:
- Archétypes

**Note**: Domaine archétypes

---

### 38. Benchmark
**Emplacement**: `lib/benchmark/`
**État**: ✅ Actif
**Responsabilités**:
- Benchmarking

**Note**: Domaine benchmark

---

### 39. Executive
**Emplacement**: `lib/executive/`
**État**: ✅ Actif
**Responsabilités**:
- Fonctions exécutives

**Note**: Domaine executive

---

### 40. Events
**Emplacement**: `lib/events/`
**État**: ✅ Actif
**Responsabilités**:
- Gestion d'événements

**Note**: Domaine events

---

### 41. Latency
**Emplacement**: `lib/latency/`
**État**: ✅ Actif
**Responsabilités**:
- Gestion de latence

**Note**: Domaine latency

---

### 42. ML (Machine Learning)
**Emplacement**: `lib/ml/`
**État**: ✅ Actif
**Responsabilités**:
- Machine Learning

**Note**: Domaine ML

---

### 43. Scoring
**Emplacement**: `lib/scoring/`
**État**: ✅ Actif
**Responsabilités**:
- Scoring

**Note**: Domaine scoring

---

### 44. Replay
**Emplacement**: `lib/replay/`, `lib/replay-analytics/`
**État**: ✅ Actif
**Responsabilités**:
- Relecture
- Analytics de relecture

**Note**: Domaine replay

---

## Synthèse des Domaines

### Domaines Métier Principaux (Core Business)
1. **Interview** — Entretiens IA
2. **CV/ATS** — Traitement de CV
3. **AI** — Intelligence Artificielle
4. **Voice/Audio** — Interaction vocale
5. **Realtime** — Communication temps réel
6. **Authentication/Users** — Gestion utilisateurs
7. **Billing/Payments** — Facturation
8. **Analytics/Monitoring** — Analytics
9. **Security** — Sécurité
10. **Orchestration** — Orchestration

### Domaines Métier Secondaires
1. **Referral** — Parrainage
2. **Marketing** — Marketing
3. **SEO** — SEO
4. **Email** — Emails
5. **PDF** — PDF
6. **Admin** — Administration
7. **Activation** — Activation
8. **Coaching** — Coaching
9. **Habits** — Habitudes
10. **Challenges** — Défis

### Domaines Transversaux (Cross-cutting)
1. **Behavior** — Comportement
2. **Emotion** — Émotion
3. **Engagement** — Engagement
4. **Insights** — Insights
5. **Prediction** — Prédiction
6. **Emotional Safety** — Sécurité émotionnelle
7. **Cognitive Load** — Charge cognitive
8. **Fraud Detection** — Détection de fraude
9. **Decision Graph** — Graphes de décision
10. **Signals** — Signaux

### Infrastructure (Non-Business)
1. **Database** — Base de données
2. **Queue/Jobs** — File d'attente
3. **Redis** — Cache
4. **Supabase** — Backend
5. **Env** — Configuration
6. **Errors** — Erreurs
7. **Logger** — Logging
8. **Resilience** — Résilience
9. **Types** — Types
10. **Utils** — Utilitaires

### Domaines Obsolètes ou Vides
1. **CV (core)** — Vide, délégué à ATS
2. **Career** — Non trouvé (peut-être fusionné)
3. **Learning** — Partiel (coaching/habits/challenges)

---

## Conclusions de l'Étape 1

### Points Positifs
- ✅ **Domaines bien structurés**: Interview, AI, Security, Analytics
- ✅ **Contrats dans domain/**: user, billing, interview, orchestration, decision-graph, fraud
- ✅ **Séparation claire**: Core vs lib vs infrastructure
- ✅ **Domaines transversaux**: Behavior, Emotion, Engagement bien isolés

### Points à Clarifier
- ⚠️ **CV core vide**: Pourquoi CV/ est vide alors que ATS/ est complet ?
- ⚠️ **Career non trouvé**: Domaine Career mentionné mais non trouvé
- ⚠️ **Architecture parallèle**: core/ vs lib/ pour audio, interview
- ⚠️ **Domaines fragmentés**: AI split en ai/, ai-routing/, ai-monitoring/
- ⚠️ **Queue minimal**: Queue/Jobs très minimal

### Prochaine Étape
Étape 2: Cartographie des dépendances entre domaines
