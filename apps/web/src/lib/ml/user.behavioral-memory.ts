import { InterviewAnalyticsProjection } from "@/domain/interview.contract";

export interface UserBehaviorProfile {
  userId: string;
  trends: {
    confidenceTrend: number[];
    clarityTrend: number[];
    improvementRate: number;
  };
  archetypeEvolution: string[];
  stabilityScore: number;
}

export function updateUserBehaviorProfile(
  previous: UserBehaviorProfile | null,
  session: InterviewAnalyticsProjection
): UserBehaviorProfile {
  if (!previous) {
    return {
      userId: session.userId,
      trends: {
        confidenceTrend: [session.behavioralScores.confidence],
        clarityTrend: [session.behavioralScores.clarity],
        improvementRate: 0,
      },
      archetypeEvolution: [session.archetype],
      stabilityScore: 1.0,
    };
  }

  const newConfidenceTrend = [...previous.trends.confidenceTrend, session.behavioralScores.confidence].slice(-10);
  const newClarityTrend = [...previous.trends.clarityTrend, session.behavioralScores.clarity].slice(-10);
  
  const avgConf = newConfidenceTrend.reduce((a,b)=>a+b, 0) / newConfidenceTrend.length;
  const oldAvgConf = previous.trends.confidenceTrend.reduce((a,b)=>a+b, 0) / previous.trends.confidenceTrend.length || avgConf;
  const improvementRate = avgConf - oldAvgConf;

  // Simple stability calculation based on variance
  const variance = newConfidenceTrend.reduce((acc, val) => acc + Math.pow(val - avgConf, 2), 0) / newConfidenceTrend.length;
  const stabilityScore = Math.max(0, 1 - Math.sqrt(variance));

  const archetypeEvolution = [...previous.archetypeEvolution, session.archetype].slice(-5);

  return {
    userId: session.userId,
    trends: {
      confidenceTrend: newConfidenceTrend,
      clarityTrend: newClarityTrend,
      improvementRate,
    },
    archetypeEvolution,
    stabilityScore,
  };
}
