# IOS Phase 0 — Platform Core

- `[x]` 1. **Contracts**
  - `[x]` Créer `Engine.ts`
  - `[x]` Créer `EngineResult.ts`
  - `[x]` Créer `Event.ts`
  - `[x]` Créer `Reducer.ts`
- `[x]` 2. **Engine Registry**
  - `[x]` Créer `EngineRegistry.ts`
- `[x]` 3. **Cognitive Pipeline**
  - `[x]` Créer `CognitivePipeline.ts`
- `[ ]` 4. **Telemetry**
  - `[ ]` Créer l'infrastructure de télémétrie
- `[ ]` 5. **Feature Flags**
  - `[ ]` Définir `INTERVIEW_ENGINE` flag
- `[x]` 6. **Cognitive Context**
  - `[x]` Créer les entités du contexte
- `[x]` 7. **Decision Log**
  - `[x]` Créer l'entité DecisionLog
- `[x]` 8. **Cost Guard**
  - `[x]` Implémenter la vérification du budget
- `[x]` 9. **Safety Layer**
  - `[x]` Implémenter le Question Validator
- `[x]` 10. **Cognitive Domain (Part 2)**
  - `[x]` Entités Node & Edge
  - `[x]` Entité Evidence & Confidence
  - `[x]` Entités Competency, Hypothesis, Unknown, WeakSignal
  - `[x]` Entités Budget, Goal, Strategy, Decision, Risk
  - `[x]` Agrégats KnowledgeGraph & CognitiveState
  - `[x]` Tests Zod & Vitest (86 tests PASS)

# IOS Phase 1 — Perception
- `[x]` 1. **Perception Engine**
  - `[x]` Créer `PerceptionSchema.ts`
  - `[x]` Créer `PerceptionTypes.ts`
  - `[x]` Créer `PerceptionPrompt.ts`
  - `[x]` Créer `PerceptionEngine.ts`
  - `[x]` Créer les tests unitaires (Mock LLM)

# IOS Phase 2 — Evidence
- `[x]` 1. **Evidence Engine**
  - `[x]` Créer `EvidenceSchema.ts` (Dimensions, Missing, Supports, etc.)
  - `[x]` Créer `EvidenceTypes.ts`
  - `[x]` Créer `EvidencePrompt.ts`
  - `[x]` Créer `EvidenceEngine.ts`
  - `[x]` Déplacer `StructuredLLMProvider` dans `contracts`
  - `[x]` Créer 100+ tests unitaires robustes (Mock LLM)
