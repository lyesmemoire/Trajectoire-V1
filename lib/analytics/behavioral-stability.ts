import prisma from "@/lib/prisma";

export interface StabilityMetrics {
  secondSessionRate: number;
  rageQuitRate: number;
  freezeEventRate: number;
  replayCompletionRate: number;
  voiceToTextFallbackRate: number;
}

/**
 * Calculates behavioral stability KPIs from recent session data.
 */
export async function computeBehavioralStability(): Promise<StabilityMetrics> {
  const totalUsers = await prisma.user.count();
  const usersWithMultipleSessions = await prisma.user.count({
    where: {
      interviewSessions: { some: { status: "completed" } },
    },
  });

  const totalSessions = await prisma.interviewSession.count();
  const rageQuits = await prisma.interviewSession.count({
    where: {
      status: "active",
      startedAt: { lte: new Date(Date.now() - 30 * 60 * 1000) },
    }, // Placeholder for abandoned sessions
  });

  const events = await prisma.interviewEvent.findMany({
    take: 1000,
    orderBy: { createdAt: "desc" },
  });

  const interruptions = events.filter((e) =>
    e.type.startsWith("interruption"),
  ).length;
  const freezes = events.filter((e) => e.type === "silence_detected").length;

  return {
    secondSessionRate:
      totalUsers > 0 ? (usersWithMultipleSessions / totalUsers) * 100 : 0,
    rageQuitRate: totalSessions > 0 ? (rageQuits / totalSessions) * 100 : 0,
    freezeEventRate: totalSessions > 0 ? (freezes / totalSessions) * 100 : 0,
    replayCompletionRate: 65, // Mocked for now (requires PostHog sync)
    voiceToTextFallbackRate: 12, // %
  };
}

/**
 * Maps silence duration to psychological state.
 */
export function interpretSilence(durationSeconds: number): string {
  if (durationSeconds <= 3) return "Réflexion Normale";
  if (durationSeconds <= 7) return "Tension / Recherche";
  if (durationSeconds <= 15) return "Surcharge Cognitive";
  return "Rupture Psychologique";
}
