import { WorldSnapshot } from "../ports/ISnapshot";

export type RiskStrategyType = 
  | "WORST_CASE"       // Strict Min (Phase 6.8)
  | "EXPECTED_VALUE"   // Mean
  | "CVAR_30"          // Mean of worst 30% runs
  | "CVAR_50";         // Mean of worst 50% runs

export interface PolicyGenome {
  version: number;
  parameters: Record<string, number>;
}

export interface FitnessResult {
  genome: PolicyGenome;
  score: number;
  metrics: Record<string, number>;
}

export interface EvolutionConfig {
  populationSize: number;
  generations: number;
  mutationRate: number; // 0.0 to 1.0
  crossoverRate: number; // 0.0 to 1.0
  eliteCount: number;
  baseSnapshot: WorldSnapshot;
  simulationDurationMs: number;
  seed: number;
  riskStrategy?: RiskStrategyType; // Defaults to WORST_CASE
}

export interface ChaosGenome {
  version: number;
  parameters: {
    dropRate: number;
    reorderRate: number;
    duplicationRate: number;
    maxJitterMs: number;
    partitionDurationRatio: number; // e.g., 0.0 to 0.5 (up to 50% of the simulation duration)
  };
}

export interface AdversarialEvolutionConfig extends EvolutionConfig {
  chaosPopulationSize: number;
  chaosMutationRate: number;
  chaosCrossoverRate: number;
  chaosEliteCount: number;
  chaosCostLambda: number; // Penalty weight for chaos cost
}
