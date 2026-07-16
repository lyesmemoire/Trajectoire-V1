// @ts-nocheck
import { CareerPipelineStep, CareerPipelineContext } from "../career-pipeline";
import { PredictionEnginePort } from "../../../../ports/prediction-engine.port";
import { PredictionSnapshotEntity } from "../../../../domain/entities/prediction-snapshot.entity";
import { IdGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";

export class ComputePredictionStep implements CareerPipelineStep {
  constructor(
    private readonly engine: PredictionEnginePort,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock
  ) {}

  async execute(context: CareerPipelineContext): Promise<CareerPipelineContext> {
    if (!context.profile) {
      throw new Error("Profile must be loaded before computing predictions");
    }

    const iv = context.dto.interviewAnalysis;
    const ux = context.dto.uxFingerprint;

    const predictionData = await this.engine.computeReturnProbability({
      victorInterrupts: iv.interruptionCount || 0,
      claraRecoveries: iv.recoveryCount || 0,
      freezes: iv.freezeCount || 0,
      replays: 1, // static for now
      hesitationIndex: ux?.hesitationIndex || 0.5,
      scrollEntropy: ux?.scrollEntropy || 50,
      clickDelayAvg: ux?.clickDelayAvg || 500,
    });

    const sessionId = context.sessionId || this.idGenerator.generate();
    const snapshotId = this.idGenerator.generate();

    const snapshot = new PredictionSnapshotEntity({
      id: snapshotId,
      userId: context.userId,
      sessionId: sessionId,
      returnProbability: predictionData.probability,
      returnSegment: predictionData.segment,
      primaryDriver: predictionData.primaryDriver,
      stressScore: (iv.interruptionCount || 0) * 10,
      recoveryScore: (iv.recoveryCount || 0) * 20,
      engagementScore: (1 - (ux?.hesitationIndex || 0.5)) * 100,
      createdAt: this.clock.now(),
    });

    // Record the prediction event on the aggregate
    context.profile.attachPrediction(sessionId, snapshotId);

    return {
      ...context,
      prediction: snapshot,
    };
  }
}
