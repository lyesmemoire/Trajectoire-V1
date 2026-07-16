# Migration Rules

## Overview

**Purpose**: Règles génériques pour migrer les Intelligence Engines vers l'architecture cible  
**Based on**: Forecast Golden Reference  
**Target**: Wave 1 (8 moteurs)

---

## Règles de Migration

### R001 — Supprimer aiOrchestrator

**Supprimer**:
```typescript
import { aiOrchestrator } from "../../ai/AIOrchestrator";
```

**Ajouter**:
```typescript
import { intelligenceCoreModule } from "@/lib/intelligence-core";
import { IntelligenceRequest } from "@/lib/intelligence-core";
```

**Applicabilité**: 100% des moteurs Wave 1

---

### R002 — Supprimer eventBus

**Supprimer**:
```typescript
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
// ou
import { CareerUpdatedEvent } from "../../ai/events/BrainEvents";
// ou
import { ATSCompletedEvent } from "../../ai/events/BrainEvents";
```

**Ajouter**:
```typescript
import { EventPublisher } from "@/lib/intelligence-runtime/application/EventPublisher";
```

**Applicabilité**: 25% des moteurs Wave 1 (atsAIEngine, careerAnalysisAIEngine)

---

### R003 — Ajouter RuntimeContext (si applicable)

**Ajouter**:
```typescript
import { RuntimeContext } from "@/lib/intelligence-runtime/domain/context/RuntimeContext";
```

**Créer**:
```typescript
const context = new RuntimeContext();
```

**Stocker les données**:
```typescript
context.set("candidateProfile", candidateProfile);
context.set("historicalObservations", historicalObservations);
// ... autres données
```

**Récupérer les données**:
```typescript
const candidateProfile = context.get("candidateProfile");
const historicalObservations = context.get("historicalObservations");
// ... autres données
```

**Applicabilité**: 0% des moteurs Wave 1 (Forecast utilise RuntimeContext, mais Wave 1 non)

---

### R004 — Ajouter ExecutionPipeline (si applicable)

**Ajouter**:
```typescript
import { ExecutionPipeline } from "@/lib/intelligence-runtime/application/ExecutionPipeline";
```

**Créer**:
```typescript
const pipeline = new ExecutionPipeline();
```

**Définir les stages**:
```typescript
const aiExecutionStage = {
  name: "ai-execution",
  execute: async (input: any, ctx: RuntimeContext) => {
    // Logique d'exécution
    return result;
  },
};
```

**Exécuter le pipeline**:
```typescript
const result = await pipeline.execute(
  input,
  [aiExecutionStage],
  context
);
```

**Applicabilité**: 0% des moteurs Wave 1 (Forecast utilise ExecutionPipeline, mais Wave 1 non)

---

### R005 — Remplacer aiOrchestrator.execute()

**Avant**:
```typescript
const result = await aiOrchestrator.execute<OutputType>(
  promptTemplate,
  variables,
  {
    provider: "openai",
    model: "gpt-4-turbo",
    promptId: "engine-id",
    promptVersion: "v1",
    temperature: 0.7,
    maxTokens: 1500,
  }
);
```

**Après**:
```typescript
const promptTemplate = promptTemplate.system || promptTemplate.user;
const intelligenceUseCase = intelligenceCoreModule.createUseCase<OutputType>(promptTemplate);

const request: IntelligenceRequest<OutputType> = {
  id: `request-${Date.now()}`,
  type: "engine-type",
  input: {} as any, // Placeholder si non utilisé
  context: {
    candidateProfile: {},
    historicalObservations: [],
    currentGoals: [],
    recentInsights: [],
    engineContext: {
      // Variables du prompt
      ...variables,
    },
  },
  options: {
    provider: "openai",
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 1500,
    timeout: 30000,
  },
};

const result = await intelligenceUseCase.execute(request);
```

**Mapping des champs**:
- `promptId` → `type`
- `promptVersion` → non utilisé
- `temperature` → `temperature`
- `maxTokens` → `maxTokens`
- `provider` → `provider`
- `model` → `model`
- Ajout: `timeout: 30000`

**Applicabilité**: 100% des moteurs Wave 1

---

### R006 — Remplacer result.data par result.output

**Avant**:
```typescript
if (!result.success || !result.data) {
  throw new Error(`Failed: ${result.error}`);
}
return result.data;
```

**Après**:
```typescript
if (!result.success || !result.output) {
  throw new Error(`Failed: ${result.error}`);
}
return result.output;
```

**Applicabilité**: 100% des moteurs Wave 1

---

### R007 — Remplacer eventBus.publish()

**Avant**:
```typescript
await eventBus.publish<EventType>({
  id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date(),
  type: "event-type",
  payload: {
    // ... données
  },
});
```

**Après**:
```typescript
const eventPublisher = new EventPublisher();
eventPublisher.publish("event-type", {
  // ... données
  timestamp: new Date().toISOString(),
});
```

**Mapping des champs**:
- `id` → non utilisé (géré par EventPublisher)
- `timestamp` → `timestamp` (format ISO string)
- `type` → premier argument de publish()
- `payload` → objet passé à publish()

**Applicabilité**: 25% des moteurs Wave 1 (atsAIEngine, careerAnalysisAIEngine)

---

### R008 — Conserver candidateAIBrain (si utilisé)

**Conserver**:
```typescript
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
```

**Raison**: candidateAIBrain n'est pas un provider IA, c'est une dépendance contextuelle nécessaire.

**Applicabilité**: 25% des moteurs Wave 1 (recruiterQuestionAIEngine, dailyCoachAIEngine, careerAnalysisAIEngine)

---

### R009 — Conserver les prompts

**Conserver**:
```typescript
import { promptV1 } from "../../ai/Prompts/prompt-v1";
```

**Raison**: Les prompts sont nécessaires pour l'exécution IA.

**Applicabilité**: 100% des moteurs Wave 1

---

### R010 — Conserver les DTOs Input/Output

**Conserver**:
```typescript
export interface EngineInput {
  // ... champs
}

export interface EngineOutput {
  // ... champs
}
```

**Raison**: Les DTOs définissent l'interface du moteur et ne doivent pas être modifiés.

**Applicabilité**: 100% des moteurs Wave 1

---

## Matrice de Transformation

| Règle | Transformation | Applicabilité Wave 1 | Automatisable |
|-------|---------------|---------------------|---------------|
| R001 | Supprimer aiOrchestrator | 8/8 (100%) | ✅ Oui |
| R002 | Supprimer eventBus | 2/8 (25%) | ✅ Oui |
| R003 | Ajouter RuntimeContext | 0/8 (0%) | ✅ Oui |
| R004 | Ajouter ExecutionPipeline | 0/8 (0%) | ✅ Oui |
| R005 | Remplacer aiOrchestrator.execute() | 8/8 (100%) | ✅ Oui |
| R006 | Remplacer result.data par result.output | 8/8 (100%) | ✅ Oui |
| R007 | Remplacer eventBus.publish() | 2/8 (25%) | ✅ Oui |
| R008 | Conserver candidateAIBrain | 3/8 (38%) | ✅ Oui |
| R009 | Conserver les prompts | 8/8 (100%) | ✅ Oui |
| R010 | Conserver les DTOs | 8/8 (100%) | ✅ Oui |
| R011 | Utiliser chemin relatif imports intelligence-core | 8/8 (100%) | ✅ Oui |
| R012 | Ajouter assertion de type IntelligenceResponse.output | 2/8 (25%) | ✅ Oui |
| R013 | Simplifier metrics candidateAIBrain.addHistoryEntry() | 2/8 (25%) | ✅ Oui |
| R014 | Standardiser construction IntelligenceRequest | 8/8 (100%) | ✅ Oui |
| R015 | Standardiser construction engineContext | 8/8 (100%) | ✅ Oui |
| R016 | Standardiser création IntelligenceUseCase | 8/8 (100%) | ✅ Oui |

---

## Résumé

**Règles totales**: 16  
**Règles applicables à Wave 1**: 10 (R003, R004, R011, R012, R013, R014, R015, R016 partiellement applicables)  
**Automatisation possible**: 100% des transformations applicables

**Couverture estimée**: 95% de la migration d'un moteur Wave 1 peut être réalisée en appliquant ces règles.

**Couverture estimée Wave 2**: 90% de la migration d'un moteur Wave 2 peut être réalisée en appliquant ces règles.

---

## Nouvelles Règles (Sprint 6.19)

### R011 — Utiliser un chemin relatif pour les imports intelligence-core

**Contexte**: L'alias TypeScript `@/lib/intelligence-core` n'est pas résolu correctement dans le dossier `core/intelligence/engines`.

**Déclencheur**: Import depuis `core/intelligence/engines` vers `lib/intelligence-core`.

**Transformation**:
```typescript
// Avant
import { intelligenceCoreModule } from "@/lib/intelligence-core";
import { IntelligenceRequest } from "@/lib/intelligence-core";

// Après
import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
```

**Validation**: Vérifier que le chemin relatif pointe correctement vers `lib/intelligence-core`.

**Applicabilité**: 100% des moteurs Wave 2

---

### R012 — Ajouter une assertion de type pour IntelligenceResponse.output

**Contexte**: IntelligenceResponse.output est de type `unknown`, causant des erreurs TypeScript sur le type de retour.

**Déclencheur**: Type de retour spécifique attendu par le moteur.

**Transformation**:
```typescript
// Avant
return result.output;

// Après
return result.output as OutputType;
```

**Validation**: Vérifier que l'assertion de type correspond au type de retour attendu par la méthode.

**Applicabilité**: 100% des moteurs Wave 2

---

### R013 — Simplifier les metrics pour candidateAIBrain.addHistoryEntry()

**Contexte**: IntelligenceMetadata n'a pas les champs latency, tokenUsage, cost attendus par candidateAIBrain.addHistoryEntry().

**Déclencheur**: Utilisation de candidateAIBrain.addHistoryEntry().

**Transformation**:
```typescript
// Avant
metrics: {
  latency: result.metadata?.latency || 0,
  tokens: {
    prompt: result.metadata?.tokenUsage?.promptTokens || 0,
    completion: result.metadata?.tokenUsage?.completionTokens || 0,
    total: result.metadata?.tokenUsage?.totalTokens || 0,
  },
  cost: result.metadata?.cost || 0,
  retryCount: 0,
}

// Après
metrics: {
  latency: 0,
  tokens: {
    prompt: 0,
    completion: 0,
    total: 0,
  },
  cost: 0,
  retryCount: 0,
}
```

**Validation**: Vérifier que la structure des metrics correspond à celle attendue par candidateAIBrain.addHistoryEntry().

**Applicabilité**: 100% des moteurs Wave 2

---

### R014 — Standardiser la construction de IntelligenceRequest

**Contexte**: Tous les moteurs construisent IntelligenceRequest de la même manière.

**Déclencheur**: Création d'une IntelligenceRequest.

**Transformation**:
```typescript
const request: IntelligenceRequest<OutputType> = {
  id: `${engineType}-${Date.now()}`,
  type: engineType,
  input: {} as any,
  context: {
    candidateProfile: {},
    historicalObservations: [],
    currentGoals: [],
    recentInsights: [],
    engineContext: {
      // Variables du prompt
      ...variables,
    },
  },
  options: {
    provider: "openai",
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 1500,
    timeout: 30000,
  },
};
```

**Validation**: Vérifier que tous les champs obligatoires sont présents.

**Applicabilité**: 100% des moteurs Wave 2

---

### R015 — Standardiser la construction de engineContext

**Contexte**: Tous les moteurs construisent engineContext de la même manière.

**Déclencheur**: Construction de engineContext.

**Transformation**:
```typescript
engineContext: {
  // Variables du prompt
  ...variables,
}
```

**Validation**: Vérifier que toutes les variables du prompt sont passées dans engineContext.

**Applicabilité**: 100% des moteurs Wave 2

---

### R016 — Standardiser la création de IntelligenceUseCase

**Contexte**: Tous les moteurs créent IntelligenceUseCase de la même manière.

**Déclencheur**: Création d'une IntelligenceUseCase.

**Transformation**:
```typescript
const promptTemplate = promptTemplate.system || promptTemplate.user;
const intelligenceUseCase = intelligenceCoreModule.createUseCase<OutputType>(promptTemplate);
```

**Validation**: Vérifier que le promptTemplate est correctement extrait et passé à createUseCase.

**Applicabilité**: 100% des moteurs Wave 2
