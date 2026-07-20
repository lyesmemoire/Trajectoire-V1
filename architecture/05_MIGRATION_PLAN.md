# 05_MIGRATION_PLAN.md

> Plan de migration de l'architecture actuelle vers l'architecture cible.
> Basé sur l'audit PHASE 1 et le Dependency Mapping SPRINT 2.

---

## Vue d'ensemble

### Objectifs de la Migration
1. **Restructurer** tous les domaines en DDD complet
2. **Ajouter des tests** à tous les modules (90% de couverture)
3. **Isoler Platform Context** (infrastructure)
4. **Documenter les contracts** pour tous les domaines
5. **Réduire le couplage** entre domaines

### Principe de Migration
- **Aucune régression** fonctionnelle
- **Migration incrémentale** par bounded context
- **Tests avant migration** (sécurité)
- **Documentation avant migration** (clarté)

---

## Phase 1: Préparation (1 semaine)

### Objectifs
- Préparer l'environnement de migration
- Documenter l'état actuel
- Préparer les outils de migration

### Tâches

#### 1.1 Créer le dossier architecture/ ✅
**Statut**: Complété

**Action**: Dossier architecture/ créé avec les documents:
- 00_CURRENT_ARCHITECTURE.md
- 01_DEPENDENCY_MATRIX.md
- 02_DEPENDENCY_GRAPH.md
- 03_MODULE_HEALTH.md
- 02_BOUNDED_CONTEXTS.md
- 04_TARGET_ARCHITECTURE.md

---

#### 1.2 Créer le dossier architecture/06_DECISIONS/
**Statut**: À faire

**Action**: Créer le dossier pour les Architecture Decision Records (ADRs)

**Livrable**: architecture/06_DECISIONS/

---

#### 1.3 Créer ADR-001: Restructuration DDD
**Statut**: À faire

**Action**: Créer l'ADR pour la restructuration DDD

**Contenu**:
- Contexte: Architecture actuelle partiellement DDD
- Décision: Restructurer tous les domaines en DDD complet
- Conséquences: Meilleure séparation des responsabilités, tests plus faciles
- Alternatives: Garder l'architecture actuelle, refactoring complet

**Livrable**: architecture/06_DECISIONS/ADR-001.md

---

#### 1.4 Créer ADR-002: Isolation Platform Context
**Statut**: À faire

**Action**: Créer l'ADR pour l'isolation du Platform Context

**Contenu**:
- Contexte: Infrastructure mélangée avec les domaines
- Décision: Isoler Platform Context (infrastructure)
- Conséquences: Meilleure séparation, tests plus faciles
- Alternatives: Garder l'infrastructure mélangée

**Livrable**: architecture/06_DECISIONS/ADR-002.md

---

#### 1.5 Créer ADR-003: Couverture de Tests 90%
**Statut**: À faire

**Action**: Créer l'ADR pour la couverture de tests 90%

**Contenu**:
- Contexte: Aucun test dans le projet
- Décision: Atteindre 90% de couverture de tests
- Conséquences: Meilleure qualité, moins de régressions
- Alternatives: Couverture partielle, pas de tests

**Livrable**: architecture/06_DECISIONS/ADR-003.md

---

#### 1.6 Préparer les outils de migration
**Statut**: À faire

**Action**: Préparer les scripts de migration

**Outils**:
- Script de restructuration DDD
- Script de génération de tests
- Script de validation de migration

**Livrable**: scripts/migration/

---

## Phase 2: Migration Platform Context (1 semaine)

### Objectifs
- Isoler Platform Context (infrastructure)
- Déplacer les modules d'infrastructure vers platform/
- Mettre à jour les imports

### Tâches

#### 2.1 Créer le dossier platform/
**Statut**: À faire

**Action**: Créer le dossier platform/ avec la structure:
- platform/database/
- platform/ai/
- platform/payments/
- platform/cache/
- platform/analytics/
- platform/logging/
- platform/config/
- platform/errors/
- platform/resilience/

**Livrable**: platform/

---

#### 2.2 Déplacer lib/prisma vers platform/database/prisma/
**Statut**: À faire

**Action**: Déplacer lib/prisma vers platform/database/prisma/

**Imports à mettre à jour**:
- lib/interview/behavioral-memory.ts
- lib/security/admin-audit.ts
- lib/db/*.ts
- lib/analytics/*.ts
- lib/habits/*.ts
- lib/events/*.ts
- lib/engagement/*.ts
- lib/orchestration/*.ts

**Livrable**: platform/database/prisma/

---

#### 2.3 Déplacer lib/mistral vers platform/ai/mistral/
**Statut**: À faire

**Action**: Déplacer lib/mistral vers platform/ai/mistral/

**Imports à mettre à jour**:
- lib/interview/behavior/*.ts
- lib/ats/orchestrator.ts
- lib/ats/enrichment/*.ts
- lib/ats/behavioral-logic/*.ts
- lib/ats/recruiter-signals/*.ts
- lib/ai-routing/*.ts

**Livrable**: platform/ai/mistral/

---

#### 2.4 Déplacer lib/stripe vers platform/payments/stripe/
**Statut**: À faire

**Action**: Déplacer lib/stripe vers platform/payments/stripe/

**Imports à mettre à jour**:
- lib/credits/*.ts

**Livrable**: platform/payments/stripe/

---

#### 2.5 Déplacer lib/redis vers platform/cache/redis/
**Statut**: À faire

**Action**: Déplacer lib/redis vers platform/cache/redis/

**Imports à mettre à jour**:
- lib/security/request-hardening.ts
- lib/security/upstash-client.ts

**Livrable**: platform/cache/redis/

---

#### 2.6 Déplacer lib/posthog vers platform/analytics/posthog/
**Statut**: À faire

**Action**: Déplacer lib/posthog vers platform/analytics/posthog/

**Imports à mettre à jour**:
- (à vérifier)

**Livrable**: platform/analytics/posthog/

---

#### 2.7 Déplacer lib/logger vers platform/logging/logger/
**Statut**: À faire

**Action**: Déplacer lib/logger vers platform/logging/logger/

**Imports à mettre à jour**:
- (à vérifier)

**Livrable**: platform/logging/logger/

---

#### 2.8 Déplacer lib/env vers platform/config/env/
**Statut**: À faire

**Action**: Déplacer lib/env vers platform/config/env/

**Imports à mettre à jour**:
- lib/supabase/service.ts
- lib/security/request-hardening.ts

**Livrable**: platform/config/env/

---

#### 2.9 Déplacer lib/errors vers platform/errors/errors/
**Statut**: À faire

**Action**: Déplacer lib/errors vers platform/errors/errors/

**Imports à mettre à jour**:
- (à vérifier)

**Livrable**: platform/errors/errors/

---

#### 2.10 Déplacer lib/resilience vers platform/resilience/resilience/
**Statut**: À faire

**Action**: Déplacer lib/resilience vers platform/resilience/resilience/

**Imports à mettre à jour**:
- (à vérifier)

**Livrable**: platform/resilience/resilience/

---

#### 2.11 Mettre à jour les imports
**Statut**: À faire

**Action**: Mettre à jour tous les imports vers platform/

**Imports à mettre à jour**:
- Tous les imports lib/prisma → platform/database/prisma
- Tous les imports lib/mistral → platform/ai/mistral
- Tous les imports lib/stripe → platform/payments/stripe
- Tous les imports lib/redis → platform/cache/redis
- Tous les imports lib/posthog → platform/analytics/posthog
- Tous les imports lib/logger → platform/logging/logger
- Tous les imports lib/env → platform/config/env
- Tous les imports lib/errors → platform/errors/errors
- Tous les imports lib/resilience → platform/resilience/resilience

**Livrable**: Imports mis à jour

---

#### 2.12 Tester la migration Platform Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test

**Livrable**: Tests passés

---

## Phase 3: Migration Identity Context (1 semaine)

### Objectifs
- Restructurer lib/auth/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 3.1 Créer la structure DDD lib/identity/
**Statut**: À faire

**Action**: Créer la structure:
- lib/identity/domain/
- lib/identity/application/
- lib/identity/infrastructure/
- lib/identity/tests/

**Livrable**: lib/identity/domain/, lib/identity/application/, lib/identity/infrastructure/, lib/identity/tests/

---

#### 3.2 Déplacer lib/auth/session-logic.ts vers lib/identity/application/
**Statut**: À faire

**Action**: Déplacer lib/auth/session-logic.ts vers lib/identity/application/session.use-case.ts

**Livrable**: lib/identity/application/session.use-case.ts

---

#### 3.3 Créer les entities dans lib/identity/domain/
**Statut**: À faire

**Action**: Créer:
- lib/identity/domain/user.entity.ts
- lib/identity/domain/profile.entity.ts
- lib/identity/domain/session.entity.ts

**Livrable**: lib/identity/domain/user.entity.ts, lib/identity/domain/profile.entity.ts, lib/identity/domain/session.entity.ts

---

#### 3.4 Créer les repositories dans lib/identity/infrastructure/
**Statut**: À faire

**Action**: Créer:
- lib/identity/infrastructure/user.repository.ts
- lib/identity/infrastructure/profile.repository.ts
- lib/identity/infrastructure/session.repository.ts

**Livrable**: lib/identity/infrastructure/user.repository.ts, lib/identity/infrastructure/profile.repository.ts, lib/identity/infrastructure/session.repository.ts

---

#### 3.5 Créer les use cases dans lib/identity/application/
**Statut**: À faire

**Action**: Créer:
- lib/identity/application/authenticate.use-case.ts
- lib/identity/application/register.use-case.ts
- lib/identity/application/session.use-case.ts

**Livrable**: lib/identity/application/authenticate.use-case.ts, lib/identity/application/register.use-case.ts, lib/identity/application/session.use-case.ts

---

#### 3.6 Créer les tests dans lib/identity/tests/
**Statut**: À faire

**Action**: Créer:
- lib/identity/tests/authenticate.use-case.spec.ts
- lib/identity/tests/register.use-case.spec.ts
- lib/identity/tests/session.use-case.spec.ts

**Livrable**: lib/identity/tests/authenticate.use-case.spec.ts, lib/identity/tests/register.use-case.spec.ts, lib/identity/tests/session.use-case.spec.ts

---

#### 3.7 Documenter le contract domain/identity.contract.ts
**Statut**: À faire

**Action**: Documenter le contract Identity

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/identity.contract.ts

---

#### 3.8 Mettre à jour les imports vers lib/identity/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/auth → lib/identity

**Livrable**: Imports mis à jour

---

#### 3.9 Tester la migration Identity Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/identity/tests/

**Livrable**: Tests passés

---

## Phase 4: Migration Interview Context (2 semaines)

### Objectifs
- Restructurer lib/interview/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 4.1 Créer la structure DDD lib/interview/
**Statut**: À faire

**Action**: Créer la structure:
- lib/interview/domain/
- lib/interview/application/
- lib/interview/infrastructure/
- lib/interview/tests/

**Livrable**: lib/interview/domain/, lib/interview/application/, lib/interview/infrastructure/, lib/interview/tests/

---

#### 4.2 Déplacer les fichiers vers lib/interview/domain/
**Statut**: À faire

**Action**: Déplacer:
- lib/interview/engine.ts → lib/interview/domain/interview.entity.ts
- lib/interview/personas.ts → lib/interview/domain/persona.entity.ts
- lib/interview/question-bank.ts → lib/interview/domain/question.entity.ts
- lib/interview/interview-state-machine.ts → lib/interview/domain/state.entity.ts

**Livrable**: lib/interview/domain/interview.entity.ts, lib/interview/domain/persona.entity.ts, lib/interview/domain/question.entity.ts, lib/interview/domain/state.entity.ts

---

#### 4.3 Déplacer les fichiers vers lib/interview/application/
**Statut**: À faire

**Action**: Déplacer:
- lib/interview/generate-questions.ts → lib/interview/application/generate-questions.use-case.ts
- lib/interview/followup-strategy.ts → lib/interview/application/followup-strategy.use-case.ts
- lib/interview/session-recovery.ts → lib/interview/application/session-recovery.use-case.ts
- lib/interview/recovery-logic.ts → lib/interview/application/recovery.use-case.ts

**Livrable**: lib/interview/application/generate-questions.use-case.ts, lib/interview/application/followup-strategy.use-case.ts, lib/interview/application/session-recovery.use-case.ts, lib/interview/application/recovery.use-case.ts

---

#### 4.4 Déplacer les fichiers vers lib/interview/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/interview/infrastructure/interview.repository.ts, lib/interview/infrastructure/question.repository.ts, lib/interview/infrastructure/state.repository.ts

---

#### 4.5 Créer les tests dans lib/interview/tests/
**Statut**: À faire

**Action**: Créer:
- lib/interview/tests/generate-questions.use-case.spec.ts
- lib/interview/tests/followup-strategy.use-case.spec.ts
- lib/interview/tests/session-recovery.use-case.spec.ts
- lib/interview/tests/recovery.use-case.spec.ts

**Livrable**: lib/interview/tests/generate-questions.use-case.spec.ts, lib/interview/tests/followup-strategy.use-case.spec.ts, lib/interview/tests/session-recovery.use-case.spec.ts, lib/interview/tests/recovery.use-case.spec.ts

---

#### 4.6 Documenter le contract domain/interview.contract.ts
**Statut**: À faire

**Action**: Documenter le contract Interview

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/interview.contract.ts

---

#### 4.7 Mettre à jour les imports vers lib/interview/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/interview/* vers la nouvelle structure

**Livrable**: Imports mis à jour

---

#### 4.8 Tester la migration Interview Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/interview/tests/

**Livrable**: Tests passés

---

## Phase 5: Migration Career Context (1 semaine)

### Objectifs
- Restructurer lib/credits/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 5.1 Créer la structure DDD lib/career/
**Statut**: À faire

**Action**: Créer la structure:
- lib/career/domain/
- lib/career/application/
- lib/career/infrastructure/
- lib/career/tests/

**Livrable**: lib/career/domain/, lib/career/application/, lib/career/infrastructure/, lib/career/tests/

---

#### 5.2 Déplacer les fichiers vers lib/career/domain/
**Statut**: À faire

**Action**: Déplacer:
- lib/credits/index.ts → lib/career/domain/credit.entity.ts
- lib/credits/legacy.ts → lib/career/domain/transaction.entity.ts
- lib/credits/transactional.ts → lib/career/domain/subscription.entity.ts

**Livrable**: lib/career/domain/credit.entity.ts, lib/career/domain/transaction.entity.ts, lib/career/domain/subscription.entity.ts

---

#### 5.3 Déplacer les fichiers vers lib/career/application/
**Statut**: À faire

**Action**: Déplacer:
- (créer des use cases)

**Livrable**: lib/career/application/deduct-credits.use-case.ts, lib/career/application/add-credits.use-case.ts, lib/career/application/manage-subscription.use-case.ts

---

#### 5.4 Déplacer les fichiers vers lib/career/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/career/infrastructure/credit.repository.ts, lib/career/infrastructure/transaction.repository.ts, lib/career/infrastructure/subscription.repository.ts

---

#### 5.5 Créer les tests dans lib/career/tests/
**Statut**: À faire

**Action**: Créer:
- lib/career/tests/deduct-credits.use-case.spec.ts
- lib/career/tests/add-credits.use-case.spec.ts
- lib/career/tests/manage-subscription.use-case.spec.ts

**Livrable**: lib/career/tests/deduct-credits.use-case.spec.ts, lib/career/tests/add-credits.use-case.spec.ts, lib/career/tests/manage-subscription.use-case.spec.ts

---

#### 5.6 Documenter le contract domain/career.contract.ts
**Statut**: À faire

**Action**: Documenter le contract Career

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/career.contract.ts

---

#### 5.7 Mettre à jour les imports vers lib/career/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/credits → lib/career

**Livrable**: Imports mis à jour

---

#### 5.8 Tester la migration Career Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/career/tests/

**Livrable**: Tests passés

---

## Phase 6: Migration ATS Context (1 semaine)

### Objectifs
- Restructurer lib/ats/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 6.1 Créer la structure DDD lib/ats/
**Statut**: À faire

**Action**: Créer la structure:
- lib/ats/domain/
- lib/ats/application/
- lib/ats/infrastructure/
- lib/ats/tests/

**Livrable**: lib/ats/domain/, lib/ats/application/, lib/ats/infrastructure/, lib/ats/tests/

---

#### 6.2 Déplacer les fichiers vers lib/ats/domain/
**Statut**: À faire

**Action**: Déplacer:
- (créer des entities)

**Livrable**: lib/ats/domain/cv.entity.ts, lib/ats/domain/profile.entity.ts, lib/ats/domain/score.entity.ts

---

#### 6.3 Déplacer les fichiers vers lib/ats/application/
**Statut**: À faire

**Action**: Déplacer:
- lib/ats/orchestrator.ts → lib/ats/application/orchestrator.use-case.ts
- lib/ats/premium-orchestrator.ts → lib/ats/application/premium-orchestrator.use-case.ts

**Livrable**: lib/ats/application/orchestrator.use-case.ts, lib/ats/application/premium-orchestrator.use-case.ts

---

#### 6.4 Déplacer les fichiers vers lib/ats/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/ats/infrastructure/cv.repository.ts, lib/ats/infrastructure/profile.repository.ts, lib/ats/infrastructure/score.repository.ts

---

#### 6.5 Créer les tests dans lib/ats/tests/
**Statut**: À faire

**Action**: Créer:
- lib/ats/tests/orchestrator.use-case.spec.ts
- lib/ats/tests/premium-orchestrator.use-case.spec.ts

**Livrable**: lib/ats/tests/orchestrator.use-case.spec.ts, lib/ats/tests/premium-orchestrator.use-case.spec.ts

---

#### 6.6 Documenter le contract domain/ats.contract.ts
**Statut**: À faire

**Action**: Documenter le contract ATS

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/ats.contract.ts

---

#### 6.7 Mettre à jour les imports vers lib/ats/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/ats/* vers la nouvelle structure

**Livrable**: Imports mis à jour

---

#### 6.8 Tester la migration ATS Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/ats/tests/

**Livrable**: Tests passés

---

## Phase 7: Migration Voice Context (1 semaine)

### Objectifs
- Restructurer lib/voice/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 7.1 Créer la structure DDD lib/voice/
**Statut**: À faire

**Action**: Créer la structure:
- lib/voice/domain/
- lib/voice/application/
- lib/voice/infrastructure/
- lib/voice/tests/

**Livrable**: lib/voice/domain/, lib/voice/application/, lib/voice/infrastructure/, lib/voice/tests/

---

#### 7.2 Déplacer les fichiers vers lib/voice/domain/
**Statut**: À faire

**Action**: Déplacer:
- lib/voice/client.ts → lib/voice/domain/audio.entity.ts

**Livrable**: lib/voice/domain/audio.entity.ts

---

#### 7.3 Déplacer les fichiers vers lib/voice/application/
**Statut**: À faire

**Action**: Déplacer:
- (créer des use cases)

**Livrable**: lib/voice/application/start-audio.use-case.ts, lib/voice/application/stop-audio.use-case.ts, lib/voice/application/stream-audio.use-case.ts

---

#### 7.4 Déplacer les fichiers vers lib/voice/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/voice/infrastructure/audio.repository.ts, lib/voice/infrastructure/stream.repository.ts

---

#### 7.5 Créer les tests dans lib/voice/tests/
**Statut**: À faire

**Action**: Créer:
- lib/voice/tests/start-audio.use-case.spec.ts
- lib/voice/tests/stop-audio.use-case.spec.ts
- lib/voice/tests/stream-audio.use-case.spec.ts

**Livrable**: lib/voice/tests/start-audio.use-case.spec.ts, lib/voice/tests/stop-audio.use-case.spec.ts, lib/voice/tests/stream-audio.use-case.spec.ts

---

#### 7.6 Documenter le contract domain/voice.contract.ts
**Statut**: À faire

**Action**: Documenter le contract Voice

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/voice.contract.ts

---

#### 7.7 Mettre à jour les imports vers lib/voice/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/voice → la nouvelle structure

**Livrable**: Imports mis à jour

---

#### 7.8 Tester la migration Voice Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/voice/tests/

**Livrable**: Tests passés

---

## Phase 8: Migration Analytics Context (1 semaine)

### Objectifs
- Restructurer lib/analytics/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 8.1 Créer la structure DDD lib/analytics/
**Statut**: À faire

**Action**: Créer la structure:
- lib/analytics/domain/
- lib/analytics/application/
- lib/analytics/infrastructure/
- lib/analytics/tests/

**Livrable**: lib/analytics/domain/, lib/analytics/application/, lib/analytics/infrastructure/, lib/analytics/tests/

---

#### 8.2 Déplacer les fichiers vers lib/analytics/domain/
**Statut**: À faire

**Action**: Déplacer:
- (créer des entities)

**Livrable**: lib/analytics/domain/analytics.entity.ts, lib/analytics/domain/stability.entity.ts, lib/analytics/domain/reliability.entity.ts

---

#### 8.3 Déplacer les fichiers vers lib/analytics/application/
**Statut**: À faire

**Action**: Déplacer:
- (créer des use cases)

**Livrable**: lib/analytics/application/compute-analytics.use-case.ts, lib/analytics/application/compute-stability.use-case.ts, lib/analytics/application/compute-reliability.use-case.ts

---

#### 8.4 Déplacer les fichiers vers lib/analytics/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/analytics/infrastructure/analytics.repository.ts, lib/analytics/infrastructure/stability.repository.ts

---

#### 8.5 Créer les tests dans lib/analytics/tests/
**Statut**: À faire

**Action**: Créer:
- lib/analytics/tests/compute-analytics.use-case.spec.ts
- lib/analytics/tests/compute-stability.use-case.spec.ts
- lib/analytics/tests/compute-reliability.use-case.spec.ts

**Livrable**: lib/analytics/tests/compute-analytics.use-case.spec.ts, lib/analytics/tests/compute-stability.use-case.spec.ts, lib/analytics/tests/compute-reliability.use-case.spec.ts

---

#### 8.6 Documenter le contract domain/analytics.contract.ts
**Statut**: À faire

**Action**: Documenter le contract Analytics

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/analytics.contract.ts

---

#### 8.7 Mettre à jour les imports vers lib/analytics/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/analytics/* vers la nouvelle structure

**Livrable**: Imports mis à jour

---

#### 8.8 Tester la migration Analytics Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/analytics/tests/

**Livrable**: Tests passés

---

## Phase 9: Migration AI Context (1 semaine)

### Objectifs
- Restructurer lib/ai/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 9.1 Créer la structure DDD lib/ai/
**Statut**: À faire

**Action**: Créer la structure:
- lib/ai/domain/
- lib/ai/application/
- lib/ai/infrastructure/
- lib/ai/tests/

**Livrable**: lib/ai/domain/, lib/ai/application/, lib/ai/infrastructure/, lib/ai/tests/

---

#### 9.2 Déplacer les fichiers vers lib/ai/domain/
**Statut**: À faire

**Action**: Déplacer:
- (créer des entities)

**Livrable**: lib/ai/domain/model.entity.ts, lib/ai/domain/prompt.entity.ts, lib/ai/domain/embedding.entity.ts

---

#### 9.3 Déplacer les fichiers vers lib/ai/application/
**Statut**: À faire

**Action**: Déplacer:
- (créer des use cases)

**Livrable**: lib/ai/application/route-model.use-case.ts, lib/ai/application/generate-insights.use-case.ts, lib/ai/application/stream-response.use-case.ts

---

#### 9.4 Déplacer les fichiers vers lib/ai/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/ai/infrastructure/model.repository.ts, lib/ai/infrastructure/embedding.repository.ts

---

#### 9.5 Créer les tests dans lib/ai/tests/
**Statut**: À faire

**Action**: Créer:
- lib/ai/tests/route-model.use-case.spec.ts
- lib/ai/tests/generate-insights.use-case.spec.ts
- lib/ai/tests/stream-response.use-case.spec.ts

**Livrable**: lib/ai/tests/route-model.use-case.spec.ts, lib/ai/tests/generate-insights.use-case.spec.ts, lib/ai/tests/stream-response.use-case.spec.ts

---

#### 9.6 Documenter le contract domain/ai.contract.ts
**Statut**: À faire

**Action**: Documenter le contract AI

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/ai.contract.ts

---

#### 9.7 Mettre à jour les imports vers lib/ai/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/ai/* vers la nouvelle structure

**Livrable**: Imports mis à jour

---

#### 9.8 Tester la migration AI Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/ai/tests/

**Livrable**: Tests passés

---

## Phase 10: Migration Security Context (1 semaine)

### Objectifs
- Restructurer lib/security/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 10.1 Créer la structure DDD lib/security/
**Statut**: À faire

**Action**: Créer la structure:
- lib/security/domain/
- lib/security/application/
- lib/security/infrastructure/
- lib/security/tests/

**Livrable**: lib/security/domain/, lib/security/application/, lib/security/infrastructure/, lib/security/tests/

---

#### 10.2 Déplacer les fichiers vers lib/security/domain/
**Statut**: À faire

**Action**: Déplacer:
- (créer des entities)

**Livrable**: lib/security/domain/audit.entity.ts, lib/security/domain/fraud.entity.ts, lib/security/domain/bot.entity.ts

---

#### 10.3 Déplacer les fichiers vers lib/security/application/
**Statut**: À faire

**Action**: Déplacer:
- (créer des use cases)

**Livrable**: lib/security/application/log-audit.use-case.ts, lib/security/application/detect-fraud.use-case.ts, lib/security/application/block-bot.use-case.ts

---

#### 10.4 Déplacer les fichiers vers lib/security/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/security/infrastructure/audit.repository.ts, lib/security/infrastructure/fraud.repository.ts

---

#### 10.5 Créer les tests dans lib/security/tests/
**Statut**: À faire

**Action**: Créer:
- lib/security/tests/log-audit.use-case.spec.ts
- lib/security/tests/detect-fraud.use-case.spec.ts
- lib/security/tests/block-bot.use-case.spec.ts

**Livrable**: lib/security/tests/log-audit.use-case.spec.ts, lib/security/tests/detect-fraud.use-case.spec.ts, lib/security/tests/block-bot.use-case.spec.ts

---

#### 10.6 Documenter le contract domain/security.contract.ts
**Statut**: À faire

**Action**: Documenter le contract Security

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/security.contract.ts

---

#### 10.7 Mettre à jour les imports vers lib/security/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/security/* vers la nouvelle structure

**Livrable**: Imports mis à jour

---

#### 10.8 Tester la migration Security Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/security/tests/

**Livrable**: Tests passés

---

## Phase 11: Migration Orchestration Context (1 semaine)

### Objectifs
- Restructurer lib/orchestration/ en DDD complet
- Ajouter des tests (90% de couverture)
- Documenter le contract

### Tâches

#### 11.1 Créer la structure DDD lib/orchestration/
**Statut**: À faire

**Action**: Créer la structure:
- lib/orchestration/domain/
- lib/orchestration/application/
- lib/orchestration/infrastructure/
- lib/orchestration/tests/

**Livrable**: lib/orchestration/domain/, lib/orchestration/application/, lib/orchestration/infrastructure/, lib/orchestration/tests/

---

#### 11.2 Déplacer les fichiers vers lib/orchestration/domain/
**Statut**: À faire

**Action**: Déplacer:
- (créer des entities)

**Livrable**: lib/orchestration/domain/agent.entity.ts, lib/orchestration/domain/consensus.entity.ts, lib/orchestration/domain/decision-graph.entity.ts

---

#### 11.3 Déplacer les fichiers vers lib/orchestration/application/
**Statut**: À faire

**Action**: Déplacer:
- (créer des use cases)

**Livrable**: lib/orchestration/application/evaluate-agent.use-case.ts, lib/orchestration/application/resolve-consensus.use-case.ts, lib/orchestration/application/route-signal.use-case.ts

---

#### 11.4 Déplacer les fichiers vers lib/orchestration/infrastructure/
**Statut**: À faire

**Action**: Déplacer:
- (créer des repositories)

**Livrable**: lib/orchestration/infrastructure/agent.repository.ts, lib/orchestration/infrastructure/decision-graph.repository.ts

---

#### 11.5 Créer les tests dans lib/orchestration/tests/
**Statut**: À faire

**Action**: Créer:
- lib/orchestration/tests/evaluate-agent.use-case.spec.ts
- lib/orchestration/tests/resolve-consensus.use-case.spec.ts
- lib/orchestration/tests/route-signal.use-case.spec.ts

**Livrable**: lib/orchestration/tests/evaluate-agent.use-case.spec.ts, lib/orchestration/tests/resolve-consensus.use-case.spec.ts, lib/orchestration/tests/route-signal.use-case.spec.ts

---

#### 11.6 Documenter le contract domain/orchestration.contract.ts
**Statut**: À faire

**Action**: Documenter le contract Orchestration

**Contenu**:
- Entities
- Value Objects
- Services
- Repositories

**Livrable**: domain/orchestration.contract.ts

---

#### 11.7 Mettre à jour les imports vers lib/orchestration/
**Statut**: À faire

**Action**: Mettre à jour tous les imports lib/orchestration/* vers la nouvelle structure

**Livrable**: Imports mis à jour

---

#### 11.8 Tester la migration Orchestration Context
**Statut**: À faire

**Action**: Tester que l'application fonctionne après la migration

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test lib/orchestration/tests/

**Livrable**: Tests passés

---

## Phase 12: Nettoyage (1 semaine)

### Objectifs
- Supprimer les modules morts
- Supprimer les dossiers vides
- Nettoyer la documentation obsolète

### Tâches

#### 12.1 Supprimer voice-core (package)
**Statut**: À faire

**Action**: Supprimer packages/voice-core/

**Livrable**: packages/voice-core/ supprimé

---

#### 12.2 Supprimer voice-interview-client (package)
**Statut**: À faire

**Action**: Supprimer packages/voice-interview-client/

**Livrable**: packages/voice-interview-client/ supprimé

---

#### 12.3 Supprimer beta-notes (dossier)
**Statut**: À faire

**Action**: Supprimer beta-notes/

**Livrable**: beta-notes/ supprimé

---

#### 12.4 Supprimer artifacts (dossier)
**Statut**: À faire

**Action**: Supprimer artifacts/

**Livrable**: artifacts/ supprimé

---

#### 12.5 Supprimer reports (dossier)
**Statut**: À faire

**Action**: Supprimer reports/

**Livrable**: reports/ supprimé

---

#### 12.6 Supprimer metrics (dossier)
**Statut**: À faire

**Action**: Supprimer metrics/

**Livrable**: metrics/ supprimé

---

#### 12.7 Supprimer coverage (dossier)
**Statut**: À faire

**Action**: Supprimer coverage/

**Livrable**: coverage/ supprimé

---

#### 12.8 Supprimer depth.txt (fichier)
**Statut**: À faire

**Action**: Supprimer depth.txt

**Livrable**: depth.txt supprimé

---

#### 12.9 Supprimer tsc (fichier)
**Statut**: À faire

**Action**: Supprimer tsc

**Livrable**: tsc supprimé

---

#### 12.10 Supprimer scratch/providers.json (fichier)
**Statut**: À faire

**Action**: Supprimer scratch/providers.json

**Livrable**: scratch/providers.json supprimé

---

#### 12.11 Supprimer components/marketing-old/ (dossier)
**Statut**: À faire

**Action**: Supprimer components/marketing-old/

**Livrable**: components/marketing-old/ supprimé

---

#### 12.12 Archiver documentation obsolète
**Statut**: À faire

**Action**: Archiver:
- architecture-v1.md
- architecture-v1.json
- RELEASE_NOTES_v1.md

**Livrable**: Documentation obsolète archivée

---

## Phase 13: Validation Finale (1 semaine)

### Objectifs
- Valider que l'application fonctionne
- Valider que les tests passent
- Valider que la documentation est à jour

### Tâches

#### 13.1 Tester l'application complète
**Statut**: À faire

**Action**: Tester que l'application fonctionne

**Tests**:
- Build: pnpm build
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Tests: pnpm test

**Livrable**: Tests passés

---

#### 13.2 Valider la couverture de tests
**Statut**: À faire

**Action**: Valider que la couverture de tests est ≥90%

**Tests**:
- Couverture de tests: pnpm test:coverage

**Livrable**: Couverture ≥90%

---

#### 13.3 Mettre à jour la documentation
**Statut**: À faire

**Action**: Mettre à jour:
- architecture/00_CURRENT_ARCHITECTURE.md
- architecture/01_DEPENDENCY_MATRIX.md
- architecture/02_DEPENDENCY_GRAPH.md
- architecture/03_MODULE_HEALTH.md
- architecture/02_BOUNDED_CONTEXTS.md

**Livrable**: Documentation à jour

---

#### 13.4 Créer le rapport de migration
**Statut**: À faire

**Action**: Créer le rapport de migration

**Contenu**:
- Résumé de la migration
- Problèmes rencontrés
- Solutions appliquées
- Recommandations

**Livrable**: architecture/MIGRATION_REPORT.md

---

## Conclusions

### Durée Totale Estimée
- **Phase 1**: 1 semaine
- **Phase 2**: 1 semaine
- **Phase 3**: 1 semaine
- **Phase 4**: 2 semaines
- **Phase 5**: 1 semaine
- **Phase 6**: 1 semaine
- **Phase 7**: 1 semaine
- **Phase 8**: 1 semaine
- **Phase 9**: 1 semaine
- **Phase 10**: 1 semaine
- **Phase 11**: 1 semaine
- **Phase 12**: 1 semaine
- **Phase 13**: 1 semaine

**Total**: 15 semaines

### Risques
- **Régression fonctionnelle**: Atténuation par tests avant migration
- **Import cassés**: Atténuation par mise à jour systématique
- **Temps estimé**: Atténuation par itérations courtes

### Recommandations
1. **Commencer par Phase 1** (préparation)
2. **Migrer un bounded context à la fois** (itérations courtes)
3. **Tester après chaque phase** (validation continue)
4. **Documenter les décisions** (ADRs)
5. **Communiquer régulièrement** (transparence)

---

## Document de Référence

Ce document est la **source de vérité** pentru le plan de migration du projet Trajectoire.

**Version**: Sprint 2
**Date**: 2026-07-16
**Basé sur**: PHASE 1 Audit d'Architecture + SPRINT 2 Dependency Mapping
