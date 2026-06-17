# Runtime Migration Checklist

## Compatibility Aliases
- [x] StableHash (from `@core/types/StableHash`)
- [ ] SelectorResultEnvelope aliases (Phase 2)
- [ ] DeepFreeze aliases (Phase 5)

## Duplicate Semantic Types
- [x] StableHash (resolved)
- [x] LayoutNode (resolved, exported from contracts)
- [x] ReplaySnapshot (resolved, exported from contracts)
- [x] RuntimeContext (consolidated in contracts)

## Deprecated Import Paths
- [ ] Identify and migrate all `../utils/hash` imports to contracts
- [ ] Identify and migrate all local `types/replay` imports to contracts

## Selector Envelope Migration Status (Phase 2)
- [ ] TopicSelector envelope
- [ ] DifficultySelector envelope
- [ ] ObjectiveSelector envelope

## Determinism Safety Checks
- [x] `tsc -b` composite and incremental enabled
- [x] Immutability preservation in `interviewRuntimeReducer`
- [x] Deterministic runtime error timestamps
- [x] Deterministic prompt budget sorting and fallback strategy
