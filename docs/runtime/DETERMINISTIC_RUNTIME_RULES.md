# Deterministic Runtime Rules

This document serves as the "Runtime Kernel Constitution". It explicitly outlines the architectural invariants that must never be broken to guarantee a deterministic, replay-safe, and debuggable interview engine.

## 1. Hashing Rules

- **Source of Truth:** All runtime deterministic hashing MUST use `hashObjectStable()`.
- **Forbidden:** No alternative hashing mechanisms are allowed inside the deterministic runtime infrastructure (e.g., no `crypto.createHash()`, `object-hash`, or custom `JSON.stringify` logic).
- **Consistency:** Snapshot hashes, selector step hashes, and pipeline hashes must all derive from the exact same function to guarantee replay compatibility.

## 2. Clock Rules

- **Monotonic Clocks Only:** The pipeline and all selectors MUST use `RuntimeClock` (or `MonotonicRuntimeClock`).
- **Forbidden:** NEVER use `Date.now()`, `new Date()`, or `performance.now()` anywhere in the decision-making logic.

## 3. Immutability Rules

- **Deep Freeze:** All context objects moving between selectors must be strictly immutable (using `deepFreeze`).
- **No Mutations:** Context propagation must only occur through copying and expanding previous states (e.g., `withContext`).

## 4. Selector Purity Rules

- **Pure Functions:** Selectors must be pure deterministic evaluators.
- **No Side Effects:**
  - No IO.
  - No persistence.
  - No network calls.
  - No timers.
  - No global mutations.

## 5. Replay & Tie-Break Rules

- **Stable Tie-Breaking:** Tie-breaking inside selectors must be purely functional and context-stable. Use the formula: `stableHash(selectorName + selectorVersion + candidateId + contextHash)`.
- **Sequential Async:** Even if pipeline steps become async, they MUST be executed sequentially (`await a()`, `await b()`). NEVER use `Promise.all` as it breaks determinism guarantees for replay ordering.

## 6. Trace Ownership Rules

- **Pipeline is the Writer:** Selectors NEVER directly write to the `DecisionTraceStore`.
- **Delegation:** Selectors must return their intended trace events inside the `SelectorResultEnvelope`. The `SelectorExecutionPipeline` decides what gets persisted.

## 7. Metrics Rules

- **Deterministic Approximations:** Runtime footprint metrics (e.g., `memoryFootprintEstimate`) must be deterministically approximated via serialized sizes (`serialized_context_size + serialized_trace_size`) rather than using real V8 memory inspection, which fluctuates unpredictably.
