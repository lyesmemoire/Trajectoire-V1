# PHASE 1 — Étape 3: Cartographie des Packages

## Objectif
Identifier tous les packages, leur structure, leurs dépendances et leur état.

---

## Structure des Packages

### 1. app/ (Next.js App Router)
**Emplacement**: `app/`
**Taille**: 144 items
**État**: ✅ Actif
**Responsabilités**:
- Pages Next.js (App Router)
- Routes API
- Layouts
- Marketing pages
- Admin dashboard
- Interview pages
- CV pages
- Dashboard
- Auth pages

**Sous-dossiers**:
- `(marketing)/` — Marketing pages (9 items)
- `admin/` — Admin dashboard (19 items)
- `api/` — API routes (54 items)
- `auth/` — Auth pages (6 items)
- `cv/` — CV pages (3 items)
- `cv-editor/` — CV editor (1 item)
- `cv-templates/` — CV templates (3 items)
- `dashboard/` — Dashboard (15 items)
- `debug/` — Debug (2 items)
- `interview/` — Interview pages (4 items)
- `interview-lab/` — Interview lab (2 items)
- `interviews/` — Interviews (2 items)
- `onboarding/` — Onboarding (2 items)
- `product/` — Product pages (7 items)
- `simulation/` — Simulation (3 items)
- `waitlist/` — Waitlist (1 item)

**Note**: Structure Next.js standard, bien organisée

---

### 2. apps/ (Applications Monorepo)
**Emplacement**: `apps/`
**Taille**: 368 items
**État**: ✅ Actif
**Responsabilités**:
- Applications séparées du monorepo

**Sous-applications**:
- **api/** — NestJS API (26 items)
- **realtime-gateway/** — WebSocket gateway (188 items)
- **web/** — Application web (154 items)

**Note**: Structure monorepo standard avec 3 applications

---

### 3. apps/api/ (NestJS API)
**Emplacement**: `apps/api/`
**Taille**: 26 items
**État**: ✅ Actif
**Responsabilités**:
- API REST
- Webhooks
- Background jobs
- Endpoints backend

**Structure**:
- `src/` — Source code (15 items)
- `test/` — Tests (2 items)
- Configuration: nest-cli.json, tsconfig.json, eslint.config.mjs

**Note**: Application NestJS standard

---

### 4. apps/realtime-gateway/ (WebSocket Gateway)
**Emplacement**: `apps/realtime-gateway/`
**Taille**: 188 items
**État**: ✅ Actif
**Responsabilités**:
- Gateway WebSocket
- Streaming audio
- Communication temps réel
- Transport layer (sans logique métier)

**Structure**:
- `src/` — Source code (156 items)
- `tests/` — Tests (9 items)
- `apps/` — Apps internes (7 items)
- `scripts/` — Scripts (7 items)

**Note**: Gateway bien isolée, architecture documentée (ARCHITECTURE.md)

---

### 5. apps/web/ (Application Web)
**Emplacement**: `apps/web/`
**Taille**: 154 items
**État**: ✅ Actif
**Responsabilités**:
- Application web Next.js
- Pages web
- Components
- Configuration

**Structure**:
- `src/` — Source code (132 items)
- `public/` — Assets publics (7 items)
- Configuration: next.config.ts, tailwind.config.ts, tsconfig.json

**Note**: Application Next.js standard, semble être une alternative à app/

---

### 6. components/ (Composants React)
**Emplacement**: `components/`
**Taille**: 115 items
**État**: ✅ Actif
**Responsabilités**:
- Composants React réutilisables
- Composants UI
- Composants partagés

**Sous-dossiers**:
- `admin/` — Composants admin (16 items)
- `audio/` — Composants audio (2 items)
- `career-dna/` — Career DNA (1 item)
- `challenges/` — Défis (2 items)
- `cv/` — Composants CV (2 items)
- `cv-editor/` — CV editor (2 items)
- `dashboard/` — Dashboard (2 items)
- `interview/` — Composants interview (6 items)
- `landing/` — Landing page (1 item)
- `layouts/` — Layouts (2 items)
- `marketing/` — Marketing (34 items)
- `marketing-old/` — Marketing old (15 items) ⚠️
- `onboarding/` — Onboarding (1 item)
- `pressure/` — Pressure (1 item)
- `progress/` — Progress (4 items)
- `providers/` — Providers (1 item)
- `replay/` — Replay (4 items)
- `share/` — Share (2 items)
- `shared/` — Shared (1 item)
- `ui/` — UI components (16 items)

**Note**: Structure bien organisée, présence de marketing-old (à nettoyer)

---

### 7. core/ (Core Business Logic)
**Emplacement**: `core/`
**Taille**: 227 items
**État**: ✅ Actif
**Responsabilités**:
- Logique métier core
- Moteurs business
- Simulation
- Audio core

**Sous-dossiers**:
- `audio/` — Audio core
- `interview-preparation/` — Préparation d'entretien
- `p5/` — Phase 5 implementation
- `p6/` — Phase 6 implementation
- `p7/` — Phase 7 implementation

**Note**: Core business logic, phased implementation

---

### 8. lib/ (Library Modules)
**Emplacement**: `lib/`
**Taille**: 303 items
**État**: ✅ Actif
**Responsabilités**:
- Modules réutilisables
- Logique d'application
- Infrastructure
- Utilitaires

**Sous-dossiers**: 59 domaines (voir Étape 1)

**Note**: Library très complète, bien structurée

---

### 9. packages/ (Packages Monorepo)
**Emplacement**: `packages/`
**Taille**: 1552 items
**État**: ⚠️ Suspicious
**Responsabilités**:
- Packages partagés du monorepo

**Sous-packages**:
- **arena-engine/** — Package principal (1546 items) ⚠️
- **voice-core/** — Vide (0 items)
- **voice-interview-client/** — Vide (0 items)

**Note**: arena-engine est énorme (1546 items) et semble être une copie du projet principal

---

### 10. packages/arena-engine/ (⚠️ Suspicious Package)
**Emplacement**: `packages/arena-engine/`
**Taille**: 1546 items
**État**: ⚠️ Suspicious
**Responsabilités**:
- ???

**Structure**:
- Contient une copie complète du projet:
  - `app/` — 143 items
  - `apps/` — 276 items
  - `components/` — 117 items
  - `core/` — 122 items
  - `lib/` — 307 items
  - `domain/` — 6 items
  - `gateway/` — 19 items
  - `services/` — 5 items
  - `sil/` — 108 items
  - `src/` — 108 items
  - `tests/` — 79 items
  - Toute la documentation (.md files)
  - Toute la configuration

**Note**: Ce package est une copie complète du projet principal. Probablement une erreur ou une architecture parallèle non documentée.

---

### 11. domain/ (Domain Contracts)
**Emplacement**: `domain/`
**Taille**: 6 items
**État**: ✅ Actif
**Responsabilités**:
- Contrats de domaine
- Interfaces de domaine

**Fichiers**:
- `billing.contract.ts`
- `decision-graph.contract.ts`
- `fraud-kernel.contract.ts`
- `interview.contract.ts`
- `orchestration.contract.ts`
- `user.contract.ts`

**Note**: Contrats bien définis, architecture DDD

---

### 12. gateway/ (Gateway)
**Emplacement**: `gateway/`
**Taille**: 19 items
**État**: ✅ Actif
**Responsabilités**:
- Gateway WebSocket
- Services gateway

**Note**: Gateway, probablement redondant avec apps/realtime-gateway/

---

### 13. services/ (Services)
**Emplacement**: `services/`
**Taille**: 5 items
**État**: ✅ Actif
**Responsabilités**:
- Services backend

**Note**: Services backend, à clarifier

---

### 14. sil/ (SIL)
**Emplacement**: `sil/`
**Taille**: 108 items
**État**: ✅ Actif
**Responsabilités**:
- SIL (System Integration Layer?)

**Note**: À clarifier, acronyme non documenté

---

### 15. src/ (Source)
**Emplacement**: `src/`
**Taille**: 86 items
**État**: ✅ Actif
**Responsabilités**:
- Source code

**Note**: Source code, probablement redondant avec app/ ou lib/

---

### 16. tests/ (Tests)
**Emplacement**: `tests/`
**Taille**: 50 items
**État**: ✅ Actif
**Responsabilités**:
- Tests E2E
- Tests unitaires
- Tests d'intégration

**Sous-dossiers**:
- `replay/` — Tests replay
- `voice-interview/` — Tests voice interview
- `product/` — Tests product
- `mobile/` — Tests mobile
- `load/` — Tests de charge

**Note**: Structure de tests bien organisée

---

### 17. providers/ (React Providers)
**Emplacement**: `providers/`
**Taille**: 1 item
**État**: ✅ Actif
**Responsabilités**:
- Providers React

**Fichiers**:
- `posthog-provider.tsx`

**Note**: Provider PostHog, bien isolé

---

### 18. hooks/ (React Hooks)
**Emplacement**: `hooks/`
**Taille**: 5 items
**État**: ✅ Actif
**Responsabilités**:
- Hooks React personnalisés

**Note**: Hooks personnalisés, bien isolés

---

### 19. scripts/ (Scripts)
**Emplacement**: `scripts/`
**Taille**: 40 items
**État**: ✅ Actif
**Responsabilités**:
- Scripts de build
- Scripts de migration
- Scripts d'audit
- Scripts utilitaires

**Note**: Scripts bien organisés

---

### 20. tools/ (Tools)
**Emplacement**: `tools/`
**Taille**: 2 items
**État**: ✅ Actif
**Responsabilités**:
- Outils de développement

**Note**: Outils de développement

---

## Dépendances entre Packages

### app/ → lib/
```
app/ → lib/
```
**Note**: app/ dépend de lib/ pour la logique métier

---

### app/ → components/
```
app/ → components/
```
**Note**: app/ utilise components/ pour l'UI

---

### apps/web/ → lib/
```
apps/web/ → lib/
```
**Note**: apps/web/ dépend de lib/ (si utilisé)

---

### apps/api/ → lib/
```
apps/api/ → lib/
```
**Note**: apps/api/ dépend de lib/ pour la logique métier

---

### apps/realtime-gateway/ → core/
```
apps/realtime-gateway/ → core/
```
**Note**: Gateway dépend de core/ pour la logique métier

---

### components/ → lib/
```
components/ → lib/
```
**Note**: Components utilisent lib/ pour la logique

---

## Packages à Supprimer

### 1. packages/arena-engine/
**Raison**: Copie complète du projet principal (1546 items)
**Action**: Supprimer ou clarifier son utilité
**Priorité**: Haute

---

### 2. components/marketing-old/
**Raison**: Anciens composants marketing (15 items)
**Action**: Supprimer si non utilisés
**Priorité**: Moyenne

---

### 3. packages/voice-core/
**Raison**: Vide (0 items)
**Action**: Supprimer
**Priorité**: Faible

---

### 4. packages/voice-interview-client/
**Raison**: Vide (0 items)
**Action**: Supprimer
**Priorité**: Faible

---

## Packages à Clarifier

### 1. apps/web/ vs app/
**Raison**: Deux applications Next.js (apps/web/ et app/)
**Action**: Clarifier laquelle est l'application principale
**Priorité**: Haute

---

### 2. gateway/ vs apps/realtime-gateway/
**Raison**: Deux gateways (gateway/ et apps/realtime-gateway/)
**Action**: Clarifier laquelle est la gateway principale
**Priorité**: Haute

---

### 3. src/
**Raison**: Source code non documenté
**Action**: Clarifier son utilité
**Priorité**: Moyenne

---

### 4. sil/
**Raison**: Acronyme non documenté
**Action**: Clarifier son utilité
**Priorité**: Moyenne

---

### 5. services/
**Raison**: Services backend non documentés
**Action**: Clarifier leur utilité
**Priorité**: Moyenne

---

## Packages à Conserver

### 1. app/
**Raison**: Application Next.js principale
**Action**: Conserver
**Priorité**: Haute

---

### 2. apps/api/
**Raison**: API NestJS
**Action**: Conserver
**Priorité**: Haute

---

### 3. apps/realtime-gateway/
**Raison**: Gateway WebSocket
**Action**: Conserver
**Priorité**: Haute

---

### 4. components/
**Raison**: Composants React
**Action**: Conserver
**Priorité**: Haute

---

### 5. core/
**Raison**: Core business logic
**Action**: Conserver
**Priorité**: Haute

---

### 6. lib/
**Raison**: Library modules
**Action**: Conserver
**Priorité**: Haute

---

### 7. domain/
**Raison**: Domain contracts
**Action**: Conserver
**Priorité**: Haute

---

### 8. tests/
**Raison**: Tests
**Action**: Conserver
**Priorité**: Haute

---

### 9. providers/
**Raison**: React providers
**Action**: Conserver
**Priorité**: Haute

---

### 10. hooks/
**Raison**: React hooks
**Action**: Conserver
**Priorité**: Haute

---

### 11. scripts/
**Raison**: Scripts utilitaires
**Action**: Conserver
**Priorité**: Haute

---

## Recommandations

### 1. Supprimer packages/arena-engine/
**Action**: Supprimer ce package qui est une copie du projet principal
**Priorité**: Haute
**Impact**: Réduction significative de la taille du projet

---

### 2. Clarifier apps/web/ vs app/
**Action**: Déterminer quelle application Next.js est la principale
**Priorité**: Haute
**Impact**: Clarification de l'architecture

---

### 3. Clarifier gateway/ vs apps/realtime-gateway/
**Action**: Déterminer quelle gateway est la principale
**Priorité**: Haute
**Impact**: Clarification de l'architecture

---

### 4. Supprimer components/marketing-old/
**Action**: Supprimer les anciens composants marketing
**Priorité**: Moyenne
**Impact**: Nettoyage du code

---

### 5. Clarifier src/, sil/, services/
**Action**: Documenter ou supprimer ces dossiers
**Priorité**: Moyenne
**Impact**: Clarification de l'architecture

---

### 6. Supprimer packages vides
**Action**: Supprimer voice-core/ et voice-interview-client/
**Priorité**: Faible
**Impact**: Nettoyage mineur

---

## Conclusions de l'Étape 3

### Points Positifs
- ✅ **Structure monorepo claire**: apps/, packages/, lib/
- ✅ **Séparation des responsabilités**: core/, lib/, components/
- ✅ **Tests bien organisés**: tests/ avec sous-dossiers
- ✅ **Scripts utilitaires**: scripts/ bien fournis

### Points Critiques
- ❌ **packages/arena-engine/**: Copie complète du projet (1546 items)
- ❌ **apps/web/ vs app/**: Deux applications Next.js
- ❌ **gateway/ vs apps/realtime-gateway/**: Deux gateways
- ❌ **components/marketing-old/**: Anciens composants

### Points à Clarifier
- ⚠️ **src/**: Source code non documenté
- ⚠️ **sil/**: Acronyme non documenté
- ⚠️ **services/**: Services non documentés

### Prochaine Étape
Étape 4: Identifier les architectures parallèles (générations multiples)
