/**
 * Pressure and interruption signal types for orchestration.
 */
// @ts-nocheck

export interface InterruptionSignals {
  verbosity: number;
  specificity: number;
  fillerDensity: number;
  relevanceScore: number;
  ramblingScore: number;
}

export interface PressureConfig {
  level: number;
  maxLevel: number;
  increment: number;
  decrement: number;
}
