// @ts-nocheck
import prisma from "@/lib/prisma";

export interface ProgressionSnapshot {
  clarity: number;
  confidence: number;
  ownership: number;
}

export async function calculateTrend(userId: string) {
  const history = await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, createdAt: true, pressureLevel: true },
  });

  if (history.length < 2) return null;

  // Compare first 3 and last 3 sessions using pressureLevel as score proxy
  const startScore =
    history
      .slice(0, 3)
      .reduce(
        (acc: number, curr: { pressureLevel: number }) =>
          acc + curr.pressureLevel,
        0,
      ) / Math.min(3, history.length);
  const endScore =
    history
      .slice(-3)
      .reduce(
        (acc: number, curr: { pressureLevel: number }) =>
          acc + curr.pressureLevel,
        0,
      ) / Math.min(3, history.length);

  return {
    improvement: Math.round(endScore - startScore),
    isPositive: endScore > startScore,
  };
}
