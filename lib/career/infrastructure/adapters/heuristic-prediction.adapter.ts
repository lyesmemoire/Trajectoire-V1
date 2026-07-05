import { PredictionEnginePort } from "../../ports/prediction-engine.port";
import { ReturnProbability } from "../../domain/value-objects/return-probability.vo";
import { computeReturnScore } from "@/lib/prediction/return-model-v1";

export class HeuristicPredictionAdapter implements PredictionEnginePort {
  async computeReturnProbability(metrics: {
    victorInterrupts: number;
    claraRecoveries: number;
    freezes: number;
    replays: number;
    hesitationIndex: number;
    scrollEntropy: number;
    clickDelayAvg: number;
  }): Promise<{ probability: ReturnProbability; segment: string; primaryDriver: string }> {
    const rawPrediction = computeReturnScore({
      behavior: {
        victorInterrupts: metrics.victorInterrupts,
        claraRecoveries: metrics.claraRecoveries,
        freezes: metrics.freezes,
        replays: metrics.replays,
        retries: 0,
      },
      ux: {
        hesitationIndex: metrics.hesitationIndex,
        scrollEntropy: metrics.scrollEntropy,
        clickDelayAvg: metrics.clickDelayAvg,
        typingSpeed: 2.0, // fallback
      },
    });

    return {
      probability: ReturnProbability.create(rawPrediction.returnProbability),
      segment: rawPrediction.returnSegment,
      primaryDriver: rawPrediction.primaryDriver,
    };
  }
}
