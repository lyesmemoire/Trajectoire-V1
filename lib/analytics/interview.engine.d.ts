import { InterviewAnalyticsProjection } from "@/domain/interview.contract";
import { InterviewFeatures } from "@/lib/ml/interview.feature-engine";
import { ModelVersion } from "@/lib/ml/model.registry";
/**
 * PURE FUNCTION: Scoring Engine V2 (Deterministic)
 * Computes analytics projection from ML features and a specific model version.
 */
export declare const AnalyticsEngine: {
    computeScoreWithModel(features: InterviewFeatures, userId: string, model?: ModelVersion): InterviewAnalyticsProjection;
};
//# sourceMappingURL=interview.engine.d.ts.map