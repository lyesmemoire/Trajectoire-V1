import prisma from "@/lib/prisma";

export interface BenchmarkResult {
  percentile: number;
  category: string;
}

/**
 * Compares a specific metric for a user against the global average.
 */
export async function computeBenchmark(userId: string, metric: "clarity" | "confidence" | "technical", ): Promise<BenchmarkResult> {
  const profile = await prisma.careerProfile.findUnique({ where: { userId } });
  if (!profile) return { percentile: 50, category: "average" };

  const userScore = (profile  as any)[`${metric}Score`] || 50;

  // Simple aggregation for the demo
  // In real life, this would be a cached global stats table
  const allProfiles = await prisma.careerProfile.findMany({
    select: { [`${metric}Score`  as any]: true },
  });

  const lowerScores = allProfiles.filter(
    (p) => (p  as any)[`${metric}Score`] < userScore,
  ).length;
  const percentile = Math.round((lowerScores / allProfiles.length) * 100);

  let category = "average";
  if (percentile > 80) category = "top_performer";
  else if (percentile < 20) category = "needs_work";

  return { percentile, category };
}
