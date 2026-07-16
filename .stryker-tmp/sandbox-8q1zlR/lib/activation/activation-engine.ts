// @ts-nocheck
import prisma from "@/lib/prisma";

/**
 * Calculates the activation score of a user (0-100).
 * Thresholds: Profile setup (20), First CV (20), First Session (40), First Result (20).
 */
export async function computeActivationScore(userId: string): Promise<number> {
  let score = 0;

  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        include: {
          CVAnalysis: { take: 1 },
          interviewSessions: { take: 1, where: { status: "completed" } },
        },
      },
    },
  });

  if (!profile) return 0;

  // 1. Profile Setup / Onboarding (20 pts)
  score += 20;

  // 2. First CV Upload (20 pts)
  if (profile.user.CVAnalysis.length > 0) score += 20;

  // 3. First Interview Session Started/Completed (40 pts)
  if (profile.user.interviewSessions.length > 0) score += 40;

  // 4. Results Viewed (20 pts)
  // Logic to check if results page was visited (could be a flag in Session)
  score += 20;

  return score;
}

/**
 * Returns triggers for UI nudges based on activation stage.
 */
export async function getActivationTriggers(userId: string) {
  const score = await computeActivationScore(userId);

  if (score < 40) return "UPLOAD_CV_NUDGE";
  if (score < 80) return "START_FIRST_INTERVIEW_NUDGE";
  if (score < 100) return "VIEW_RESULTS_NUDGE";

  return null;
}
