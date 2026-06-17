// apps/realtime-gateway/src/interview/runtime/EngineRuntimeConfig.ts
// Central configuration for the deterministic interview engine.

/**
 * Deterministic pseudo‑random number generator interface.
 * Implemented in `runtime/utils/seededRandom.ts` and injected via `RuntimeContext`.
 */
export interface SeededRandom {
  /** Return a float in the range [0, 1). */
  next(): number;
  /** Return an integer in the inclusive range [min, max]. */
  nextInt(min: number, max: number): number;
}

/**
 * Engine runtime controls.
 * All values are immutable once the context is created.
 */
export interface EngineRuntimeConfig {
  /** Exploration vs exploitation factor (0‑1). */
  explorationFactor: number;
  /** Optional deterministic seed for reproducible randomness. */
  deterministicSeed?: number;

  // runtime safety
  maxTopicNodes: number; // hard cap for TopicGraph size
  maxEventsInMemory: number; // cap for in‑memory event store

  // timing
  adaptivePhaseExtensionMs: number; // extra time per phase when high‑signal candidate

  // prompt budgeting
  maxPromptTokens: number; // max tokens allowed for a single LLM call

  // debugging flags
  enableDecisionLogging: boolean;
  enablePromptLogging: boolean;
  enableMetrics: boolean;

  // versioning for replay compatibility
  runtimeVersion: number;
}

/**
 * Confidence breakdown used in `InterviewDecision` for explainability.
 */
export interface ConfidenceBreakdown {
  topicConfidence: number;
  difficultyConfidence: number;
  policyConfidence: number;
  contradictionPenalty: number;
  communicationConfidence: number;
  finalConfidence: number; // pre‑computed final confidence (0‑1)
}

/**
 * Immutable aggregate passed to every selector.
 * All members are Readonly to prevent accidental mutation.
 */
import type { InterviewState } from "../models/InterviewState";
export interface TopicGraph {}
export interface QuestionMemory {}
export interface ConversationState {}
export interface InterviewClock {}

export interface RuntimeContext {
  readonly interviewState: Readonly<InterviewState>;
  readonly topicGraph: Readonly<TopicGraph>;
  readonly questionMemory: Readonly<QuestionMemory>;
  readonly conversationState: Readonly<ConversationState>;
  readonly clock: Readonly<InterviewClock>;
  readonly config: Readonly<EngineRuntimeConfig>;
  readonly rng: Readonly<SeededRandom>;
}
