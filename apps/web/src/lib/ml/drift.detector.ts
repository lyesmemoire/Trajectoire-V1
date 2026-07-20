import { InterviewAnalyticsProjection } from "@/domain/interview.contract";

export function detectDrift(
  current: InterviewAnalyticsProjection,
  previous: InterviewAnalyticsProjection[]
): { driftScore: number; anomaly: boolean } {
  if (!previous || previous.length === 0) {
    return { driftScore: 0, anomaly: false };
  }

  const prevConfs = previous.map(p => p.behavioralScores.confidence);
  const avgConf = prevConfs.reduce((a,b)=>a+b, 0) / prevConfs.length;

  const currentConf = current.behavioralScores.confidence;
  const driftScore = Math.abs(currentConf - avgConf);

  // If score changes by more than 0.5 (on a 0-1 scale) suddenly, flag as anomaly
  const anomaly = driftScore > 0.5;

  return { driftScore, anomaly };
}
