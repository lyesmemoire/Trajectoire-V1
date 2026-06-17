// runtime/contracts/RuntimeDeterminismContract.ts

/**
 * The Runtime Kernel Constitution.
 * This interface defines the absolute invariants required for the
 * conversational engine to remain deterministic and replay-safe.
 *
 * Any feature or integration that breaks one of these contracts
 * is fundamentally incompatible with the engine.
 */
export interface RuntimeDeterminismContract {
  /** All runtime deterministic hashing MUST use hashObjectStable(). */
  readonly deterministicHashing: true;

  /** Context propagation MUST only happen via deep frozen immutable objects. */
  readonly immutableContexts: true;

  /** The entire execution pipeline must be replay-compatible and trace-verified. */
  readonly replayCompatible: true;

  /** Timestamps MUST only come from an injected MonotonicRuntimeClock. */
  readonly monotonicClockOnly: true;

  /** Selectors MUST execute sequentially even if the pipeline supports async. */
  readonly stableSelectorOrdering: true;

  /** Tie-breaking MUST be purely functional (e.g. via hash), not via insertion order or PRNG. */
  readonly stableTieBreaking: true;

  /** No hidden coupling, singletons, or global states are permitted inside selectors. */
  readonly noMutableGlobalState: true;

  /** Direct usage of Date.now() or new Date() is strictly forbidden. */
  readonly noDateNowUsage: true;

  /** Direct usage of Math.random() is strictly forbidden. */
  readonly noMathRandomUsage: true;

  /** Selectors MUST be pure evaluators without side effects (no IO, network, or DB writes). */
  readonly pureSelectors: true;
}
