import prisma from "@/lib/prisma";

export async function generateCareerInsights(userId: _string) {
  // Placeholder implementation
  const insights =
    (await (prisma as unknown).careerInsight?.findMany?.({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    })) || [];

  return insights;
}
