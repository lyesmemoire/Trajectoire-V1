// @ts-nocheck
import prisma from "@/lib/prisma";

export async function generateCareerInsights(userId: string) {
  // Placeholder implementation
  const insights =
    (await (prisma as any).careerInsight?.findMany?.({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    })) || [];

  return insights;
}
