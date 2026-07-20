# Sprint 2 — Preuves Intermédiaires

> Document temporaire pour documenter les preuves trouvées pendant le Dependency Mapping.

---

## Étape 1: @trajectoire/arena-engine — Preuves

### Hypothèse Initiale
> packages/arena-engine = copie complète du projet → supprimer

### Preuves Collectées

#### 1. Est-il publié comme package?
**Réponse**: ❌ Non
**Preuve**: `"private": true` dans package.json

#### 2. Est-il workspace?
**Réponse**: ✅ Oui
**Preuve**: `"@trajectoire/arena-engine": "workspace:*"` dans apps/web/package.json

#### 3. Est-il buildé?
**Réponse**: ❌ Non (pas de script build)
**Preuve**: Pas de script "build" dans package.json

#### 4. Est-il importé?
**Réponse**: ✅ Oui (2 fichiers)
**Preuve**:
```typescript
// apps/web/src/lib/arena/index.ts
import * as arena from "@trajectoire/arena-engine";

// apps/web/src/app/api/dashboard/scores/route.ts
import { prisma } from "@trajectoire/arena-engine/db";
```

#### 5. Contient-il du code spécifique?
**Réponse**: ✅ Oui
**Preuve**: Structure spécifique:
- `src/index.ts` — Placeholder scoring engine
- `src/db/index.ts` — Singleton Prisma
- `src/ports/` — Ports (IOrchestrator, IHealing, IInfra)
- `src/analytics/`, `src/bft/`, `src/bootstrap/`, `src/chaos/`, etc.

#### Conclusion
**@trajectoire/arena-engine n'est PAS une copie complète du projet principal.**

C'est un package workspace spécifique qui:
- Exporte un singleton Prisma
- Exporte des ports (IOrchestrator, IHealing, IInfra)
- Contient un placeholder scoring engine
- Est utilisé par apps/web (2 fichiers)

**Action**: ❌ Ne pas supprimer (hypothèse fausse)

---

## Étape 2: apps/api — Preuves

### Hypothèse Initiale
> apps/api non référencé dans scripts racine → mort

### Preuves Collectées

#### 1. Est-il actif?
**Réponse**: ✅ Oui
**Preuve**: Structure NestJS complète:
- `src/main.ts` — Bootstrap NestJS
- `src/app.module.ts` — AppModule
- `src/app.controller.ts` — Controller
- `src/app.service.ts` — Service
- `src/common/` — Common modules
- `src/llm/` — LLM module
- `src/orchestrator/` — Orchestrator module
- `src/session/` — Session module
- `src/voice/` — Voice module

#### 2. Est-il buildé?
**Réponse**: ✅ Oui
**Preuve**: Script `"build": "nest build"` dans package.json

#### 3. Est-il utilisé?
**Réponse**: ⚠️ À vérifier
**Preuve**:
- Non référencé dans scripts racine
- Aucun import vers apps/api trouvé dans le codebase
- Peut être démarré manuellement: `cd apps/api && pnpm dev`

#### Conclusion
**apps/api est une application NestJS active mais isolée.**

Elle:
- Existe et a une structure complète
- Peut être buildée et démarrée
- N'est pas intégrée dans le workflow racine
- N'est pas importée par d'autres modules

**Action**: ⚠️ À clarifier (utilité et intégration)

---

## Étape 3: Cycles — Preuves (en cours)

### Hypothèse Initiale
> Interview ↔ Behavior
> Interview ↔ Orchestration
> AI ↔ Analytics

### Preuves Collectées

#### Cycle 1: Interview ↔ Behavior
**Recherche**: `from "@/lib/behavior"` dans `lib/interview/`
**Résultat**: ❌ Aucun import trouvé

**Recherche**: `from "@/lib/interview"` dans `lib/behavior/`
**Résultat**: À faire

**Conclusion**: ⚠️ Cycle non prouvé (à vérifier)

---

#### Cycle 2: Interview ↔ Orchestration
**Recherche**: `from "@/lib/orchestration"` dans `lib/interview/`
**Résultat**: À faire

**Recherche**: `from "@/lib/interview"` dans `lib/orchestration/`
**Résultat**: À faire

**Conclusion**: ⚠️ Cycle non prouvé (à vérifier)

---

#### Cycle 3: AI ↔ Analytics
**Recherche**: `from "@/lib/analytics"` dans `lib/ai/`
**Résultat**: À faire

**Recherche**: `from "@/lib/ai"` dans `lib/analytics/`
**Résultat**: À faire

**Conclusion**: ⚠️ Cycle non prouvé (à vérifier)

---

## Conclusions Intermédiaires

### Hypothèses Fausses ❌
1. **@trajectoire/arena-engine = copie complète du projet** → FAUX
   - C'est un package workspace spécifique avec du code propre

### Hypothèses à Vérifier ⚠️
1. **apps/api = mort** → À vérifier
   - Application active mais isolée

2. **Cycles** → À vérifier
   - Aucun cycle prouvé pour l'instant

### Actions Immédiates
1. Continuer la recherche des cycles
2. Produire la matrice de dépendances complète
3. Identifier les God Modules
