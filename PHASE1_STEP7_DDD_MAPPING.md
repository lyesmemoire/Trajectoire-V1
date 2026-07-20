# PHASE 1 — Étape 7: Cartographie DDD

## Objectif
Analyser chaque dossier selon les principes DDD: Domain, Application, Infrastructure, Presentation.

---

## Méthodologie DDD

### Couches DDD
- **Domain Layer**: Logique métier pure, entités, value objects, domain services
- **Application Layer**: Use cases, orchestration, application services
- **Infrastructure Layer**: Base de données, APIs externes, frameworks
- **Presentation Layer**: UI, controllers, API routes

### Critères d'Évaluation
- **Architecture DDD**: Respect des couches DDD
- **Séparation des responsabilités**: Chaque couche a une responsabilité claire
- **Dépendances**: Les dépendances vont vers l'extérieur (Domain ← Application ← Infrastructure ← Presentation)

---

## 1. Interview Domain (lib/interview/)

### Structure Actuelle
```
lib/interview/
├── adaptive-pressure.ts
├── answer-analysis.ts
├── behavioral-memory.ts
├── engine.ts
├── followup-strategy.ts
├── generate-questions.ts
├── interview-state-machine.ts
├── latency-masker.ts
├── persona-config.ts
├── personas.ts
├── premium-prompt.ts
├── progression-engine.ts
├── prompt-builder.ts
├── prompts.ts
├── question-bank.ts
├── recovery-logic.ts
├── session-recovery.ts
├── behavior/ (3 items)
├── failure-recovery/ (1 item)
├── fairness/ (1 item)
├── orchestration/ (3 items)
├── personas/ (1 item)
├── prompts/ (1 item)
├── replay/ (1 item)
├── schemas/ (2 items)
└── types/ (2 items)
```

### Analyse DDD

#### Domain Layer ✅
**Fichiers**:
- `engine.ts` — Interview engine (domain logic)
- `interview-state-machine.ts` — State machine (domain logic)
- `personas.ts` — Personas (domain entities)
- `question-bank.ts` — Question bank (domain entities)
- `behavioral-memory.ts` — Behavioral memory (domain logic)
- `progression-engine.ts` — Progression logic (domain logic)
- `behavior/` — Behavior logic (domain)
- `fairness/` — Fairness logic (domain)
- `types/` — Domain types

**Note**: Domain layer bien représentée

---

#### Application Layer ⚠️
**Fichiers**:
- `orchestration/` — Orchestration (application layer)
- `generate-questions.ts` — Use case (application)
- `followup-strategy.ts` — Use case (application)
- `session-recovery.ts` — Use case (application)
- `recovery-logic.ts` — Use case (application)

**Note**: Application layer partiellement représentée

---

#### Infrastructure Layer ❌
**Fichiers**:
- Aucun fichier infrastructure dédié

**Note**: Infrastructure layer manquante

---

#### Presentation Layer ❌
**Fichiers**:
- Aucun fichier presentation dédié

**Note**: Presentation layer manquante (probablement dans app/)

---

### Architecture DDD: ⚠️ Partielle
**Score**: 6/10
**Note**: Domain layer bien représentée, mais Application layer partielle et Infrastructure/Presentation manquantes

---

## 2. ATS Domain (lib/ats/)

### Structure Actuelle
```
lib/ats/
├── orchestrator.ts
├── premium-orchestrator.ts
├── behavioral-logic/ (1 item)
├── contracts/ (1 item)
├── enrichment/ (1 item)
├── extraction/ (1 item)
├── normalization/ (1 item)
├── recruiter-signals/ (2 items)
├── schemas/ (4 items)
└── scoring/ (2 items)
```

### Analyse DDD

#### Domain Layer ✅
**Dossiers**:
- `contracts/` — Domain contracts
- `schemas/` — Domain schemas
- `scoring/` — Scoring logic (domain)
- `behavioral-logic/` — Behavioral logic (domain)
- `recruiter-signals/` — Recruiter signals (domain)

**Note**: Domain layer bien représentée

---

#### Application Layer ✅
**Fichiers**:
- `orchestrator.ts` — Orchestrator (application service)
- `premium-orchestrator.ts` — Premium orchestrator (application service)

**Dossiers**:
- `extraction/` — Extraction use case (application)
- `normalization/` — Normalization use case (application)
- `enrichment/` — Enrichment use case (application)

**Note**: Application layer bien représentée

---

#### Infrastructure Layer ⚠️
**Fichiers**:
- Probablement dans extraction/ (PDF parsing, Mistral API)

**Note**: Infrastructure layer implicite

---

#### Presentation Layer ❌
**Fichiers**:
- Aucun fichier presentation dédié

**Note**: Presentation layer manquante (probablement dans app/)

---

### Architecture DDD: ✅ Bonne
**Score**: 8/10
**Note**: Domain et Application layers bien représentées, Infrastructure implicite, Presentation manquante

---

## 3. Security Domain (lib/security/)

### Structure Actuelle
```
lib/security/
├── admin-audit.ts
├── audit-log.ts
├── behavioral-entropy.ts
├── behavioral-moat.ts
├── bot-shield.ts
├── clone-detection.ts
├── detectors/ (1 item)
├── fraud-engine.ts
├── integrity-engine.ts
├── prompt-sanitizer.ts
├── rate-limit.ts
├── request-hardening.ts
├── request-id.ts
├── request-scrubber.ts
├── request-signer.ts
├── require-cv-editor.ts
├── route-mapper.ts
├── sanitize-cv.ts
├── upstash-client.ts
├── url-guard.ts
```

### Analyse DDD

#### Domain Layer ✅
**Fichiers**:
- `fraud-engine.ts` — Fraud detection (domain logic)
- `integrity-engine.ts` — Integrity logic (domain)
- `behavioral-entropy.ts` — Behavioral entropy (domain)
- `behavioral-moat.ts` — Behavioral moat (domain)
- `detectors/` — Detectors (domain)

**Note**: Domain layer bien représentée

---

#### Application Layer ⚠️
**Fichiers**:
- `bot-shield.ts` — Bot shield use case (application)
- `clone-detection.ts` — Clone detection use case (application)
- `prompt-sanitizer.ts` — Prompt sanitization use case (application)
- `rate-limit.ts` — Rate limiting use case (application)
- `request-hardening.ts` — Request hardening use case (application)
- `url-guard.ts` — URL guard use case (application)

**Note**: Application layer partiellement représentée

---

#### Infrastructure Layer ✅
**Fichiers**:
- `upstash-client.ts` — Upstash client (infrastructure)
- `audit-log.ts` — Audit logging (infrastructure)
- `request-id.ts` — Request ID generation (infrastructure)
- `request-signer.ts` — Request signing (infrastructure)

**Note**: Infrastructure layer bien représentée

---

#### Presentation Layer ❌
**Fichiers**:
- Aucun fichier presentation dédié

**Note**: Presentation layer manquante (probablement dans app/)

---

### Architecture DDD: ✅ Bonne
**Score**: 8/10
**Note**: Domain, Application et Infrastructure layers bien représentées, Presentation manquante

---

## 4. AI Domain (lib/ai/)

### Structure Actuelle
```
lib/ai/
├── ats-heuristic.ts
├── cache.ts
├── career-memory.ts
├── chunker.ts
├── cv-rewriter.ts
├── generate-insights.ts
├── model-router.ts
├── rag.ts
├── streaming.ts
├── track-skills.ts
└── trimmer.ts
```

### Analyse DDD

#### Domain Layer ✅
**Fichiers**:
- `model-router.ts` — Model routing (domain logic)
- `rag.ts` — RAG logic (domain)
- `career-memory.ts` — Career memory (domain logic)
- `ats-heuristic.ts` — ATS heuristics (domain logic)

**Note**: Domain layer bien représentée

---

#### Application Layer ⚠️
**Fichiers**:
- `generate-insights.ts` — Insights generation use case (application)
- `cv-rewriter.ts` — CV rewriting use case (application)
- `track-skills.ts` — Skills tracking use case (application)

**Note**: Application layer partiellement représentée

---

#### Infrastructure Layer ✅
**Fichiers**:
- `cache.ts` — Cache (infrastructure)
- `streaming.ts` — Streaming (infrastructure)
- `chunker.ts` — Text chunking (infrastructure)
- `trimmer.ts` — Text trimming (infrastructure)

**Note**: Infrastructure layer bien représentée

---

#### Presentation Layer ❌
**Fichiers**:
- Aucun fichier presentation dédié

**Note**: Presentation layer manquante (probablement dans app/)

---

### Architecture DDD: ✅ Bonne
**Score**: 7/10
**Note**: Domain, Application et Infrastructure layers bien représentées, Presentation manquante

---

## 5. Analytics Domain (lib/analytics/)

### Structure Actuelle
```
lib/analytics/
├── audio-reliability.ts
├── behavioral-analytics.ts
├── behavioral-stability.ts
├── beta-sentinel.ts
├── cognitive-load.ts
├── interview.engine.ts
├── mutations/ (1 item)
├── product-truth.ts
├── recovery-analytics.ts
├── recovery-audit.ts
├── share-analytics.ts
└── time-to-wow.ts
```

### Analyse DDD

#### Domain Layer ✅
**Fichiers**:
- `behavioral-analytics.ts` — Behavioral analytics (domain logic)
- `behavioral-stability.ts` — Behavioral stability (domain logic)
- `cognitive-load.ts` — Cognitive load (domain logic)
- `product-truth.ts` — Product truth (domain logic)
- `time-to-wow.ts` — Time-to-wow (domain logic)

**Note**: Domain layer bien représentée

---

#### Application Layer ⚠️
**Fichiers**:
- `audio-reliability.ts` — Audio reliability use case (application)
- `recovery-analytics.ts` — Recovery analytics use case (application)
- `recovery-audit.ts` — Recovery audit use case (application)
- `share-analytics.ts` — Share analytics use case (application)
- `beta-sentinel.ts` — Beta sentinel use case (application)

**Note**: Application layer partiellement représentée

---

#### Infrastructure Layer ❌
**Fichiers**:
- Probablement via PostHog (infrastructure implicite)

**Note**: Infrastructure layer implicite

---

#### Presentation Layer ❌
**Fichiers**:
- Aucun fichier presentation dédié

**Note**: Presentation layer manquante (probablement dans app/)

---

### Architecture DDD: ⚠️ Partielle
**Score**: 6/10
**Note**: Domain layer bien représentée, Application layer partielle, Infrastructure implicite, Presentation manquante

---

## 6. Domain Contracts (domain/)

### Structure Actuelle
```
domain/
├── billing.contract.ts
├── decision-graph.contract.ts
├── fraud-kernel.contract.ts
├── interview.contract.ts
├── orchestration.contract.ts
└── user.contract.ts
```

### Analyse DDD

#### Domain Layer ✅
**Fichiers**:
- `billing.contract.ts` — Billing domain contract
- `decision-graph.contract.ts` — Decision graph domain contract
- `fraud-kernel.contract.ts` — Fraud kernel domain contract
- `interview.contract.ts` — Interview domain contract
- `orchestration.contract.ts` — Orchestration domain contract
- `user.contract.ts` — User domain contract

**Note**: Domain layer excellente avec contracts

---

#### Application Layer ❌
**Fichiers**:
- Aucun fichier application dédié

**Note**: Application layer manquante

---

#### Infrastructure Layer ❌
**Fichiers**:
- Aucun fichier infrastructure dédié

**Note**: Infrastructure layer manquante

---

#### Presentation Layer ❌
**Fichiers**:
- Aucun fichier presentation dédié

**Note**: Presentation layer manquante

---

### Architecture DDD: ⚠️ Partielle
**Score**: 4/10
**Note**: Seul Domain layer représenté, autres couches manquantes

---

## 7. Orchestration Domain (lib/orchestration/)

### Structure Actuelle
```
lib/orchestration/
├── agent.evaluator.ts
├── consensus.engine.ts
├── core/ (1 item)
├── decision-graph.builder.ts
├── decision-graph.repository.ts
├── signal-router.ts
└── trace.context.ts
```

### Analyse DDD

#### Domain Layer ✅
**Fichiers**:
- `consensus.engine.ts` — Consensus engine (domain logic)
- `signal-router.ts` — Signal routing (domain logic)
- `decision-graph.builder.ts` — Decision graph building (domain logic)
- `trace.context.ts` — Trace context (domain logic)

**Note**: Domain layer bien représentée

---

#### Application Layer ✅
**Fichiers**:
- `agent.evaluator.ts` — Agent evaluation use case (application)
- `decision-graph.repository.ts` — Repository (application/infrastructure)

**Note**: Application layer bien représentée

---

#### Infrastructure Layer ⚠️
**Fichiers**:
- `decision-graph.repository.ts` — Repository (infrastructure)

**Note**: Infrastructure layer implicite

---

#### Presentation Layer ❌
**Fichiers**:
- Aucun fichier presentation dédié

**Note**: Presentation layer manquante

---

### Architecture DDD: ✅ Bonne
**Score**: 7/10
**Note**: Domain et Application layers bien représentées, Infrastructure implicite, Presentation manquante

---

## 8. Synthèse DDD

### Domaines avec Architecture DDD Complète ✅
- **ATS** (8/10) — Domain, Application, Infrastructure bien représentées
- **Security** (8/10) — Domain, Application, Infrastructure bien représentées
- **AI** (7/10) — Domain, Application, Infrastructure bien représentées
- **Orchestration** (7/10) — Domain, Application bien représentées

### Domaines avec Architecture DDD Partielle ⚠️
- **Interview** (6/10) — Domain bien représentée, Application partielle
- **Analytics** (6/10) — Domain bien représentée, Application partielle
- **Domain Contracts** (4/10) — Seul Domain représenté

### Domaines sans Architecture DDD ❌
- **Voice** — Structure non analysée
- **Realtime** — Structure non analysée
- **Auth** — Structure non analysée
- **Billing** — Structure non analysée
- **Credits** — Structure non analysée
- **Referral** — Structure non analysée
- **Marketing** — Structure non analysée
- **SEO** — Structure non analysée
- **Email** — Structure non analysée
- **PDF** — Structure non analysée

---

## 9. Patterns DDD Identifiés

### Contracts Pattern ✅
**Emplacement**: `domain/`

**Description**: Contrats de domaine définissant les interfaces

**Domaines**:
- Billing
- Decision Graph
- Fraud Kernel
- Interview
- Orchestration
- User

**Note**: Pattern DDD excellent pour la définition des interfaces

---

### Repository Pattern ⚠️
**Emplacement**: `lib/orchestration/decision-graph.repository.ts`

**Description**: Pattern repository pour l'accès aux données

**Note**: Repository pattern partiellement implémenté

---

### Orchestrator Pattern ✅
**Emplacement**: `lib/ats/orchestrator.ts`, `lib/ats/premium-orchestrator.ts`

**Description**: Pattern orchestrator pour la coordination des use cases

**Note**: Pattern orchestrator bien implémenté

---

### Engine Pattern ✅
**Emplacement**: `lib/interview/engine.ts`, `lib/security/fraud-engine.ts`, `lib/security/integrity-engine.ts`

**Description**: Pattern engine pour la logique métier complexe

**Note**: Pattern engine bien implémenté

---

### Service Pattern ✅
**Emplacement**: Multiples domaines

**Description**: Pattern service pour la logique métier

**Note**: Pattern service largement utilisé

---

## 10. Recommandations DDD

### 1. Standardiser l'Architecture DDD
**Action**: Appliquer la structure DDD à tous les domaines
**Priorité**: Haute
**Impact**: Cohérence de l'architecture

**Structure recommandée**:
```
lib/{domain}/
├── domain/          — Domain layer
├── application/     — Application layer
├── infrastructure/  — Infrastructure layer
└── presentation/    — Presentation layer (si nécessaire)
```

---

### 2. Séparer les Couches
**Action**: Séparer explicitement les couches DDD dans chaque domaine
**Priorité**: Haute
**Impact**: Clarté de l'architecture

**Exemple pour Interview**:
```
lib/interview/
├── domain/          — engine.ts, personas.ts, question-bank.ts
├── application/     — orchestration/, generate-questions.ts
├── infrastructure/  — repositories, external APIs
└── types/           — Domain types
```

---

### 3. Implémenter le Repository Pattern
**Action**: Implémenter le repository pattern pour tous les domaines
**Priorité**: Moyenne
**Impact**: Abstraction de l'infrastructure

**Exemple**:
```
lib/interview/infrastructure/
├── interview.repository.ts
├── session.repository.ts
└── question.repository.ts
```

---

### 4. Créer des Use Cases Explicites
**Action**: Créer des use cases explicites dans la couche Application
**Priorité**: Moyenne
**Impact**: Clarté des use cases

**Exemple**:
```
lib/interview/application/
├── start-interview.use-case.ts
├── next-question.use-case.ts
├── submit-answer.use-case.ts
└── end-interview.use-case.ts
```

---

### 5. Documenter les Contracts
**Action**: Documenter tous les contracts de domaine
**Priorité**: Moyenne
**Impact**: Clarté des interfaces

**Exemple**:
```
domain/interview.contract.ts
domain/ats.contract.ts
domain/analytics.contract.ts
```

---

## 11. Conclusions de l'Étape 7

### Points Positifs
- ✅ **Contracts Pattern**: Excellente implémentation dans `domain/`
- ✅ **ATS Domain**: Architecture DDD bien structurée
- ✅ **Security Domain**: Architecture DDD bien structurée
- ✅ **AI Domain**: Architecture DDD bien structurée
- ✅ **Orchestration Domain**: Architecture DDD bien structurée

### Points à Améliorer
- ⚠️ **Interview Domain**: Architecture DDD partielle
- ⚠️ **Analytics Domain**: Architecture DDD partielle
- ⚠️ **Domain Contracts**: Seul Domain layer représenté
- ❌ **Autres Domaines**: Architecture DDD non analysée ou non implémentée

### Recommandations Principales
1. **Standardiser l'architecture DDD** (Haute)
2. **Séparer les couches explicitement** (Haute)
3. **Implémenter le repository pattern** (Moyenne)
4. **Créer des use cases explicites** (Moyenne)
5. **Documenter les contracts** (Moyenne)

### Prochaine Étape
Étape 8: Cartographie de la dette technique (notation par dossier)
