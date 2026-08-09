import prisma from "@/lib/prisma";
/**
 * Compares a specific metric for a user against the global average.
 */
export async function computeBenchmark(userId, metric) {
    const profile = await prisma.careerProfile.findUnique({ where: { userId } });
    if (!profile)
        return { percentile: 50, category: "average" };
    const userScore = profile[`${metric}Score`] || 50;
    // Simple aggregation for the demo
    // In real life, this would be a cached global stats table
    const allProfiles = await prisma.careerProfile.findMany({
        select: { [`${metric}Score`]: true },
    });
    const lowerScores = allProfiles.filter((p) => p[`${metric}Score`] < userScore).length;
    const percentile = Math.round((lowerScores / allProfiles.length) * 100);
    let category = "average";
    if (percentile > 80)
        category = "top_performer";
    else if (percentile < 20)
        category = "needs_work";
    return { percentile, category };
}
//# sourceMappingURL=benchmark-engine.js.map