import { InterviewAnalyticsProjection } from "@/domain/interview.contract";
import { InterviewFeatures } from "@/lib/ml/interview.feature-engine";
import { ModelVersion, INTERVIEW_MODEL_V1 } from "@/lib/ml/model.registry";

/**
 * PURE FUNCTION: Scoring Engine V2 (Deterministic)
 * Computes analytics projection from ML features and a specific model version.
 */
export const AnalyticsEngine = {
  computeScoreWithModel(
    features: InterviewFeatures,
    userId: string,
    model: ModelVersion = INTERVIEW_MODEL_V1
  ): InterviewAnalyticsProjection {
    
    // Calculate base behavioral scores using features and model weights
    const clarity = Math.max(0, Math.min(1, features.linguistic.complexityScore * model.weights.clarity * 4));
    const confidence = Math.max(0, Math.min(1, (1 - features.behavioral.hesitationIndex) * model.weights.confidence * 4));
    const ownership = Math.max(0, Math.min(1, features.linguistic.vocabularyRichness * model.weights.ownership * 4));
    const specificity = Math.max(0, Math.min(1, (1 - features.temporal.pauseRatio) * model.weights.specificity * 4));
    const authenticity = Math.max(0, Math.min(1, (1 - features.linguistic.repetitionRate)));

    let archetype = "builder";
    if (confidence > 0.8 && clarity > 0.8) archetype = "leader";
    else if (specificity > 0.8) archetype = "specialist";

    const progressionIndex = features.temporal.answerLength.reduce((a,b) => a+b, 0) / (features.temporal.answerLength.length * 100);

    return {
      sessionId: features.sessionId,
      userId,
      behavioralScores: {
        clarity,
        confidence,
        ownership,
        specificity,
        authenticity,
      },
      archetype,
      pressureCurve: features.behavioral.assertivenessCurve.map(v => v * 100),
      progressionIndex,
      modelVersion: model.version
    };
  }
};
