// @ts-nocheck
import prisma from "@/lib/prisma";

/**
 * Challenge Engine - Core Logic for Public Events
 */
export async function getActiveChallenges() {
  return await prisma.publicChallenge.findMany({
    where: {
      isActive: true,
      endDate: { gte: new Date() },
    },
    include: {
      _count: {
        select: { PublicChallengeEntry: true },
      },
    },
  });
}

export async function joinChallenge(userId: string, challengeId: string) {
  return await prisma.publicChallengeEntry.upsert({
    where: {
      challengeId_userId: {
        challengeId,
        userId,
      },
    },
    update: {},
    create: {
      challengeId,
      userId,
    },
  });
}

export async function updateChallengeProgress(
  sessionId: string,
  score: number,
  pressure: number,
  interruptions: number,
) {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    select: { challengeEntryId: true, userId: true },
  });

  if (!session?.challengeEntryId) return;

  const entry = await prisma.publicChallengeEntry.findUnique({
    where: { id: session.challengeEntryId },
  });

  if (!entry) return;

  await prisma.publicChallengeEntry.update({
    where: { id: entry.id },
    data: {
      bestScore: Math.max(entry.bestScore, score),
      maxPressure: Math.max(entry.maxPressure, pressure),
      interruptions: { increment: interruptions },
    },
  });
}

export async function getChallengeLeaderboard(challengeId: string) {
  return await prisma.publicChallengeEntry.findMany({
    where: { challengeId },
    orderBy: [{ bestScore: "desc" }, { maxPressure: "desc" }],
    take: 10,
    include: {
      User: {
        select: { name: true, image: true },
      },
    },
  });
}
