# Sprint 1 — Architecture Actuelle du Monorepo

> Audit complet du workspace PNPM, applications, packages, dépendances, imports, cycles et bounded contexts.

---

## Étape 1: Workspace PNPM/Turbo/Nx

### Configuration Workspace
**Fichier**: `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Type de workspace**: PNPM (pas de Turbo, pas de Nx)
**Package manager**: pnpm@9.15.9
**Node version**: >=18

### Structure du Workspace
```
Trajectoire/
├── apps/
│   ├── web/ (Next.js)
│   ├── api/ (NestJS)
│   └── realtime-gateway/ (WebSocket)
└── packages/
    ├── arena-engine/ (1546 items)
    ├── voice-core/ (vide)
    └── voice-interview-client/ (vide)
```

### Scripts Racine
**Package.json racine**:
- `build`: pnpm --filter web build
- `build:web`: pnpm --filter web build
- `build:gateway`: pnpm --filter realtime-gateway build
- `build:all`: pnpm --filter web build && pnpm --filter realtime-gateway build
- `dev`: pnpm --filter web dev
- `dev:gateway`: pnpm --filter realtime-gateway dev
- `typecheck`: pnpm --filter web exec tsc --noEmit && pnpm --filter realtime-gateway exec tsc --noEmit

**Note**: Les scripts ciblent explicitement `web` et `realtime-gateway`, mais pas `api`.

---

## Étape 2: Applications Réellement Utilisées

### Applications Identifiées

#### 1. apps/web/ ✅
**Type**: Next.js Application
**Version**: 0.1.0
**Taille**: 154 items
**Statut**: ✅ Actif

**Dépendances internes**:
- `@trajectoire/arena-engine`: workspace:*

**Dépendances externes**:
- Next.js 16.2.9
- React 19.2.4
- Supabase (@supabase/ssr, @supabase/supabase-js)

**Scripts**:
- `dev`: next dev
- `build`: next build
- `start`: next start
- `lint`: eslint

**Utilisation de @trajectoire/arena-engine**:
- `lib/arena/index.ts`: import * as arena from "@trajectoire/arena-engine"
- `app/api/dashboard/scores/route.ts`: import { prisma } from "@trajectoire/arena-engine/db"

**Note**: Application Next.js principale, dépend de arena-engine

---

#### 2. apps/api/ ⚠️
**Type**: NestJS Application
**Version**: 0.0.1
**Taille**: 26 items
**Statut**: ⚠️ Actif mais non utilisé dans les scripts racine

**Dépendances internes**:
- Aucune

**Dépendances externes**:
- NestJS 11.0.1
- Socket.io 4.8.3
- @deepgram/sdk 3.13.0

**Scripts**:
- `build`: nest build
- `start:dev`: nest start --watch
- `test`: jest

**Note**: Application NestJS mais non référencée dans les scripts racine

---

#### 3. apps/realtime-gateway/ ✅
**Type**: WebSocket Gateway (Fastify)
**Version**: 0.1.0
**Taille**: 188 items
**Statut**: ✅ Actif

**Dépendances internes**:
- Aucune

**Dépendances externes**:
- Fastify 5
- @deepgram/sdk 3.13.0
- OpenAI 6.39.0
- Werift 0.22 (WebRTC)

**Scripts**:
- `dev`: node --loader ts-node/esm src/index.ts
- `build`: tsc
- `cert:*`: Scripts de certification

**Note**: Gateway WebSocket, référencée dans les scripts racine

---

### Applications Non Utilisées ❌
- **Aucune** — Toutes les applications sont actives

### Applications à Clarifier ⚠️
- **apps/api/** — Non référencée dans les scripts racine

---

## Étape 3: Packages et Dépendances Internes

### Packages Identifiés

#### 1. @trajectoire/arena-engine ✅
**Type**: Package partagé
**Version**: 1.0.0
**Taille**: 1546 items
**Statut**: ✅ Actif

**Exports**:
- `.`: ./src/index.ts
- `./db`: ./src/db/index.ts

**Contenu**:
- `src/index.ts`: Placeholder scoring engine
- `src/ports/`: Ports (IOrchestrator, IHealing, IInfra)
- Copie complète du projet principal (app/, apps/, components/, core/, lib/, domain/, etc.)

**Dépendances**:
- Aucune dépendance interne
- DevDependencies: @types/node, @vitest/coverage-v8, vitest

**Utilisateurs**:
- apps/web (via @trajectoire/arena-engine)

**Note**: Package énorme (1546 items), copie complète du projet principal

---

#### 2. voice-core ❌
**Type**: Package partagé
**Taille**: 0 items
**Statut**: ❌ Vide

**Note**: Package vide, à supprimer

---

#### 3. voice-interview-client ❌
**Type**: Package partagé
**Taille**: 0 items
**Statut**: ❌ Vide

**Note**: Package vide, à supprimer

---

### Dépendances Internes

#### Graphique des Dépendances
```
apps/web
    ↓
@trajectoire/arena-engine
    ↓
(rien)
```

**Note**: Seule apps/web dépend de @trajectoire/arena-engine

---

## Étape 4: Imports et Cycles

### Imports Inter-Applications

#### apps/web → @trajectoire/arena-engine
**Fichiers**:
- `lib/arena/index.ts`
- `app/api/dashboard/scores/route.ts`

**Imports**:
```typescript
import * as arena from "@trajectoire/arena-engine"
import { prisma } from "@trajectoire/arena-engine/db"
```

**Note**: Imports directs vers arena-engine

---

#### apps/api → (aucun)
**Note**: apps/api n'a aucune dépendance interne

---

#### apps/realtime-gateway → (aucun)
**Note**: apps/realtime-gateway n'a aucune dépendance interne

---

### Imports Intra-Application

#### apps/web → lib/ (via @/)
**Imports trouvés**:
- `lib/arena/index.ts` → `@/lib/prisma`
- `lib/db/*.ts` → `@/lib/prisma`, `@/lib/db/client`, `@/domain/billing.contract`
- `lib/ats/*.ts` → `@/lib/mistral`
- `lib/interview/*.ts` → `@/lib/mistral`
- `lib/analytics/*.ts` → `@/lib/prisma`
- `lib/fraud/*.ts` → `@/domain/fraud-kernel.contract`, `@/domain/orchestration.contract`

**Note**: Imports internes massifs via @/

---

### Cycles Identifiés

#### Cycle 1: Interview ↔ Behavior
```
lib/interview/ → lib/behavior/ → lib/interview/
```
**Sévérité**: Faible
**Note**: Cycle acceptable (Behavior transverse)

---

#### Cycle 2: AI ↔ Analytics
```
lib/ai/ → lib/analytics/ → lib/ai/
```
**Sévérité**: Faible
**Note**: Cycle acceptable (monitoring IA)

---

#### Cycle 3: Interview ↔ Orchestration
```
lib/interview/ → lib/orchestration/ → lib/interview/
```
**Sévérité**: Moyenne
**Note**: Cycle à surveiller

---

#### Aucun Cycle Inter-Applications
**Note**: Aucun cycle entre applications

---

## Étape 5: Modules Morts

### Packages Morts ❌
1. **voice-core/** — Vide (0 items)
2. **voice-interview-client/** — Vide (0 items)

### Dossiers Morts ❌
1. **beta-notes/** — Vide (0 items)
2. **artifacts/** — Vide (0 items)
3. **reports/** — Vide (0 items)
4. **metrics/** — Vide (0 items)
5. **coverage/** — Vide (0 items)

### Fichiers Morts ❌
1. **depth.txt** — Vide
2. **tsc** — Fichier binaire
3. **scratch/providers.json** — Temporaire

### Composants Morts ⚠️
1. **components/marketing-old/** — Code legacy (15 items)

### Documentation Obsolète ⚠️
1. **architecture-v1.md**
2. **architecture-v1.json**
3. **RELEASE_NOTES_v1.md**

---

## Étape 6: Bounded Contexts

### Bounded Contexts Identifiés

#### 1. Interview Context ✅
**Emplacement**: lib/interview/
**Taille**: 34 items
**Responsabilités**:
- Gestion des entretiens
- Moteur d'entretien
- Stratégies de suivi
- Génération de questions
- Personas et configuration

**Dépendances**:
- lib/behavior/
- lib/ai/
- lib/prompts/

---

#### 2. ATS Context ✅
**Emplacement**: lib/ats/
**Taille**: 15 items
**Responsabilités**:
- Traitement de CV
- Optimisation ATS
- Extraction de profils
- Normalisation
- Enrichissement
- Scoring

**Dépendances**:
- lib/ai/
- lib/mistral/

---

#### 3. AI Context ✅
**Emplacement**: lib/ai/
**Taille**: 12 items
**Responsabilités**:
- Routage des modèles IA
- Monitoring IA
- Génération d'insights
- RAG
- Streaming IA
- Cache IA

**Dépendances**:
- lib/mistral/
- lib/openai.ts
- lib/db/

---

#### 4. Security Context ✅
**Emplacement**: lib/security/
**Taille**: 20 items
**Responsabilités**:
- Audit admin
- Journal d'audit
- Entropie comportementale
- Bouclier anti-bot
- Détection de clones
- Moteur de fraude
- Rate limiting

**Dépendances**:
- lib/upstash-client.ts
- lib/db/

---

#### 5. Orchestration Context ✅
**Emplacement**: lib/orchestration/
**Taille**: 7 items
**Responsabilités**:
- Évaluation d'agents
- Moteur de consensus
- Routage de signaux
- Construction de graphes de décision

**Dépendances**:
- domain/orchestration.contract.ts
- domain/decision-graph.contract.ts

---

#### 6. Billing Context ✅
**Emplacement**: domain/billing.contract.ts, lib/credits/
**Taille**: 3 items
**Responsabilités**:
- Gestion des crédits
- Transactions
- Contrats de facturation

**Dépendances**:
- lib/stripe.ts
- lib/db/

---

#### 7. Identity Context ✅
**Emplacement**: lib/auth/, domain/user.contract.ts
**Taille**: 1 item
**Responsabilités**:
- Gestion des sessions utilisateur
- Contrats utilisateur
- Authentification

**Dépendances**:
- NextAuth v5
- lib/supabase/

---

#### 8. Analytics Context ✅
**Emplacement**: lib/analytics/
**Taille**: 12 items
**Responsabilités**:
- Analytics comportementaux
- Stabilité comportementale
- Charge cognitive
- Fiabilité audio
- Sentinelle beta
- Vérité produit

**Dépendances**:
- lib/db/
- lib/posthog.ts

---

#### 9. Voice Context ✅
**Emplacement**: lib/voice/, lib/audio/, lib/realtime/
**Taille**: 9 items
**Responsabilités**:
- Client voix WebSocket
- Traitement audio
- Microphone
- Encodage PCM
- Lecture audio

**Dépendances**:
- lib/realtime/
- apps/realtime-gateway/

---

#### 10. Emotional Safety Context ✅
**Emplacement**: lib/emotional-safety/, lib/emotional-balancing/, lib/cognitive-load/
**Taille**: 3 items
**Responsabilités**:
- Sécurité émotionnelle
- Équilibrage émotionnel
- Charge cognitive

**Dépendances**:
- lib/engagement/
- lib/db/

---

### Bounded Contexts Transversaux

#### Behavior Context ✅
**Emplacement**: lib/behavior/
**Responsabilités**: Comportement transverse
**Utilisé par**: Interview, Analytics, Security

---

#### Emotion Context ✅
**Emplacement**: lib/emotion/
**Responsabilités**: Émotion transverse
**Utilisé par**: Interview, Analytics, Emotional Safety

---

#### Engagement Context ✅
**Emplacement**: lib/engagement/
**Responsabilités**: Engagement transverse
**Utilisé par**: Interview, Analytics

---

---

## Étape 7: Document d'Architecture Actuelle

### Architecture Actuelle

```
Architecture actuelle
│
├── Applications
│   ├── Web ✅ (apps/web/ — Next.js, dépend de @trajectoire/arena-engine)
│   ├── API ⚠️ (apps/api/ — NestJS, non référencée dans scripts racine)
│   ├── Gateway ✅ (apps/realtime-gateway/ — WebSocket, référencée)
│   └── Legacy ❌ (aucune application legacy identifiée)
│
├── Packages
│   ├── arena-engine ✅ (@trajectoire/arena-engine — 1546 items, copie du projet)
│   ├── voice-core ❌ (vide)
│   └── voice-interview-client ❌ (vide)
│
├── Domaines (Bounded Contexts)
│   ├── Interview ✅ (lib/interview/ — 34 items)
│   ├── ATS ✅ (lib/ats/ — 15 items)
│   ├── AI ✅ (lib/ai/ — 12 items)
│   ├── Security ✅ (lib/security/ — 20 items)
│   ├── Orchestration ✅ (lib/orchestration/ — 7 items)
│   ├── Billing ✅ (domain/billing.contract.ts, lib/credits/)
│   ├── Identity ✅ (lib/auth/, domain/user.contract.ts)
│   ├── Analytics ✅ (lib/analytics/ — 12 items)
│   ├── Voice ✅ (lib/voice/, lib/audio/, lib/realtime/)
│   └── Emotional Safety ✅ (lib/emotional-safety/, lib/emotional-balancing/, lib/cognitive-load/)
│
├── Contexts Transversaux
│   ├── Behavior ✅ (lib/behavior/)
│   ├── Emotion ✅ (lib/emotion/)
│   └── Engagement ✅ (lib/engagement/)
│
├── Dépendances
│   ├── apps/web → @trajectoire/arena-engine
│   ├── apps/api → (aucune)
│   ├── apps/realtime-gateway → (aucune)
│   └── lib/* → lib/* (via @/)
│
├── Cycles
│   ├── Interview ↔ Behavior (faible)
│   ├── AI ↔ Analytics (faible)
│   └── Interview ↔ Orchestration (moyenne)
│
└── Dette technique
    ├── Énorme 🔴: packages/arena-engine (1546 items), lib/cv/ (vide), lib/jobs/, lib/queue/
    ├── Élevée 🟠: gateway/, apps/ (confusion apps/web vs app)
    ├── Moyenne 🟡: lib/interview/, lib/analytics/, lib/voice/, lib/realtime/, lib/auth/
    └── Faible 🟢: lib/ats/, lib/security/, lib/ai/, lib/orchestration/, domain/
```

---

## Conclusions Sprint 1

### Points Positifs
- ✅ **Workspace PNPM bien configuré**: pnpm-workspace.yaml simple
- ✅ **Applications actives**: web, api, realtime-gateway
- ✅ **Bounded contexts clairs**: 10 contexts identifiés
- ✅ **Aucun cycle inter-applications**: Séparation propre
- ✅ **Contexts transversaux bien isolés**: Behavior, Emotion, Engagement

### Points Critiques
- ❌ **packages/arena-engine/**: Copie complète du projet (1546 items)
- ❌ **apps/api/**: Non référencée dans les scripts racine
- ❌ **packages vides**: voice-core, voice-interview-client
- ❌ **dossiers vides**: beta-notes, artifacts, reports, metrics, coverage
- ❌ **components/marketing-old/**: Code legacy

### Recommandations Sprint 2
1. **Supprimer packages/arena-engine/** (🔴 Critique)
2. **Clarifier apps/api/** (🟠 Haute)
3. **Supprimer packages vides** (🟠 Haute)
4. **Supprimer dossiers vides** (🟡 Moyenne)
5. **Supprimer components/marketing-old/** (🟡 Moyenne)

---

## Document de Référence

Ce document est la **source de vérité** pour l'architecture actuelle du monorepo.

**Version**: Sprint 1
**Date**: 2026-07-16
**Basé sur**: Audit complet du workspace PNPM, applications, packages, dépendances, imports, cycles et bounded contexts
