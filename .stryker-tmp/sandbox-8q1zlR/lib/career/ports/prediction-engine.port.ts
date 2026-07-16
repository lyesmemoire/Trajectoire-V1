// @ts-nocheck
import { ReturnProbability } from "../domain/value-objects/return-probability.vo";

export interface PredictionEnginePort {
  computeReturnProbability(metrics: {
    victorInterrupts: number;
    claraRecoveries: number;
    freezes: number;
    replays: number;
    hesitationIndex: number;
    scrollEntropy: number;
    clickDelayAvg: number;
  }): Promise<{
    probability: ReturnProbability;
    segment: string;
    primaryDriver: string;
  }>;
}
