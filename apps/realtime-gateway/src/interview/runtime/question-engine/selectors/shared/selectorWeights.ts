// runtime/question-engine/selectors/shared/selectorWeights.ts
/**
 * Central place for weighting constants used by selectors.
 * Keeping the values in a single module avoids duplication and
 * ensures that any change propagates uniformly across all selectors.
 */
export const DEFAULT_SELECTOR_WEIGHTS = {
  // TopicSelector weights
  explorationFactor: 1.0, // multiplier for novelty score

  // DifficultySelector weights (default values, can be overridden per run)
  topicConfidenceWeight: 1.0,
  hesitationWeight: 1.0,
  communicationWeight: 1.0,
  contradictionWeight: 1.0,
  fatigueWeight: 1.0,
  // Threshold for fatigue guard policy (0-1)
  fatigueThreshold: 0.8,
  momentumWeight: 1.0,
  timePressureWeight: 1.0,
  difficultyMomentumWeight: 1.0, // weight for previous difficulty influence

  // ObjectiveSelector weights (hard‑coded, later overrideable)
  emotionalRecoveryWeight: 1.0, // pushes recover_candidate when negative signals high
  // other future weights can be added here
};

/**
 * Typed interface for weight overrides injected via EngineRuntimeConfig.
 * All properties are optional to allow partial overrides.
 */
export interface SelectorWeightsOverride {
  explorationFactor?: number;
  topicConfidenceWeight?: number;
  hesitationWeight?: number;
  communicationWeight?: number;
  contradictionWeight?: number;
  fatigueWeight?: number;
  momentumWeight?: number;
  timePressureWeight?: number;
  difficultyMomentumWeight?: number;
  emotionalRecoveryWeight?: number;
}
