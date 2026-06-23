# Developer Overview – Project `realtime-gateway`

## 🎯 Goal

Create a **deterministic, replay‑able real‑time interview engine** that is
_strictly typed_ (TS `strict` mode), _immutable_ by design, and ready for
enterprise‑grade scaling (micro‑services, analytics, Supabase/Redis/Kafka
integration).

---

## 📦 What we have built so far

### Core runtime utilities

| File                                      | Purpose                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `runtime/utils/deepFreeze.ts`             | Cycle‑safe deep‑freeze utility used throughout the code base to guarantee immutability.                                        |
| `runtime/utils/seededRandom.ts`           | Deterministic pseudo‑random generator (LCG) with `snapshot/restore` for replay.                                                |
| `runtime/utils/clock.ts`                  | Minimal injectable `RuntimeClock` abstraction (`now()`), with default `SystemClock`.                                           |
| `runtime/errors/RuntimeInvariantError.ts` | Custom error class used by validation helpers to surface invariant violations.                                                 |
| `runtime/EngineRuntimeConfig.ts`          | Central config object (exploration factor, caps, timing, debugging flags, version).                                            |
| `runtime/types/graph.ts`                  | Shared graph contracts: branded IDs (`TopicNodeId`), `NodeMetadata`, `TopicEdge`, `GraphMutationResult`, `TopicGraphSnapshot`. |

### Graph layer – **TopicGraph**

- **Immutable storage** (`Map` of nodes, adjacency indexes for outgoing/incoming edges).
- **Branded IDs** (`TopicNodeId`) to catch cross‑assignment bugs at compile time.
- **Edge modeling** with relation types (`parent`, `related`, `dependency`, `contradiction`, `followup`) and weight `[0‑1]`.
- **Timestamps** (`createdAt`, `updatedAt`, optional `lastTraversedAt`).
- **Hard caps** (`maxNodes`, `maxEdges`).
- **Deterministic ordering** for nodes & edges (localeCompare on IDs).
- **Snapshot support** (`toSnapshot()`) – includes version (`1.0.0`), creation time, frozen node/edge arrays.
- **Validation** (`validate()`) and **integrity checks** (`validateIntegrity()`) that throw `RuntimeInvariantError` for:
  - saturation bounds
  - orphan/self‑referencing edges
  - duplicate edges
  - weight out‑of‑range
  - cycles in parent hierarchy
  - exhausted topics with lingering follow‑ups.
- **Saturation computation placeholder** (`computeSaturation`) – ready for deterministic activity‑derived formula.

### Runtime configuration & defaults (locked in `EngineRuntimeConfig`)

| Setting                                                 | Value                                                                 |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Interest decay per ask                                  | `-0.08`                                                               |
| Interest recovery                                       | `+0.02` (when `topicNotAskedRecently && candidatePerformanceChanged`) |
| Exploration factor                                      | `0.3`                                                                 |
| Adaptive phase extension                                | `300 000 ms` (5 min)                                                  |
| Prompt token cap                                        | `1500`                                                                |
| Topic node hard cap (graph)                             | `250`                                                                 |
| Prompt‑budget topic node cap                            | `15`                                                                  |
| Related‑topic cap per node                              | `12`                                                                  |
| Market‑demand default weight                            | `0.5`                                                                 |
| SafetyLayer rules & EngineMetrics collection – approved |

### Architectural decisions (already committed)

1. **No `app/lib/...`** – keep everything under `apps/realtime-gateway/src/interview/…` for domain‑driven clarity.
2. **Strict TypeScript** – `tsconfig.json` enforces `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`.
3. **Immutable runtime context** – `RuntimeContext` aggregates `interviewState`, `topicGraph`, `questionMemory`, `conversationState`, `clock`, `config`, `rng` (all `Readonly`).
4. **Deterministic replay** – seeded PRNG, snapshot‑based graph, replay checkpoints (planned).
5. **Branded IDs** (`TopicNodeId`, `DecisionId`, `ReplayCheckpointId`) to prevent accidental misuse.
6. **Pure selectors** – will receive `RuntimeContext` read‑only and return results without mutating the graph.
7. **Separation of concerns** – upcoming `runtime/types/` folder prevents circular imports; future `reducers/`, `transitions/`, `validators/` directories are planned.

---

## 📚 What’s next (planned order)

1. **`runtime/types/*`** – finalise contracts for prompts, decisions, replay, selectors.
2. **`PromptBudgetManager.ts`** – budget truncation strategies (`drop_oldest`, `drop_low_confidence`, `drop_low_priority`, `summarize`).
3. **Prompt layers** (`SystemLayer`, `PersonaLayer`, `ContextLayer`, `ObjectiveLayer`, `ConstraintLayer`, `SafetyLayer`) and `PromptAssembler`.
4. **Decision model** (`InterviewDecision` with `confidence: ConfidenceBreakdown`).
5. **Selectors** (`TopicSelector`, `DifficultySelector`, `ObjectiveSelector`, `FollowupSelector`, `PhaseManager`).
6. **DeterministicQuestionEngine** – pure `generateDecision` function.
7. **Replay simulator** (`ReplayEngine`, `FakeCandidate`, `ScenarioRunner`).
8. **Debug loggers** (`DecisionLogger`, `PromptLogger`, `EventTimeline`).
9. **EngineMetrics** – latency and performance instrumentation.
10. **Orchestration & state reducers** – keep selectors pure, mutations inside dedicated reducers.

---

## 📌 Quick reminder for developers

- **Never mutate** objects that come from `RuntimeContext`; always use the provided reducers or create new immutable copies.
- **Always run `graph.validateIntegrity()`** after mutating the graph in tests or before a replay checkpoint.
- **Use `deepFreeze`** on any object you intend to expose outside its owning module.
- **All new modules must import types from `runtime/types/*`** to avoid circular dependencies.
- **Keep the strict TS flag on** – it catches accidental `any` usage early.
- **When adding edges**, remember to update both outgoing **and** incoming indexes.
- **Snapshots** should be stored with their `version` (`TopicGraph.SNAPSHOT_VERSION`) so that future migrations can be detected.

---

## 📄 Where to find the code

```
apps/realtime-gateway/src/interview/runtime/
├─ utils/
│   ├─ deepFreeze.ts
│   ├─ seededRandom.ts
│   └─ clock.ts
├─ errors/
│   └─ RuntimeInvariantError.ts
├─ EngineRuntimeConfig.ts
├─ types/
│   └─ graph.ts
└─ graph/
    └─ TopicGraph.ts
```

Feel free to open any of these files for details. The architecture is now solid and ready for the next phases.
