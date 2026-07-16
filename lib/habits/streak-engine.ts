import prisma from "@/lib/prisma";

export interface StreakInfo {
  currentStreak: number;
  lastActivityDate: string;
  isActive: boolean;
}

type CareerDNA = {
  lastActivityDate?: string;
  currentStreak?: number;
};

function isCareerDNA(data: unknown): data is CareerDNA {
  return (
    typeof data === "object" &&
    data !== null
  );
}

/**
 * Updates and returns the user's training streak.
 */
export async function updateStreak(userId: string): Promise<StreakInfo> {
  const profile = await prisma.careerProfile.findUnique({ where: { userId } });
  if (!profile)
    return { currentStreak: 0, lastActivityDate: "", isActive: false };

  const dna = isCareerDNA(profile.careerDNA) ? profile.careerDNA : {};
  const lastDate = dna.lastActivityDate ? new Date(dna.lastActivityDate) : null;
  const today = new Date();

  let streak = dna.currentStreak || 0;

  if (lastDate) {
    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24),
    );

    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1; // Reset if gap > 1 day
    }
  } else {
    streak = 1;
  }

  await prisma.careerProfile.update({
    where: { userId },
    data: {
      careerDNA: {
        ...dna,
        lastActivityDate: today.toISOString(),
        currentStreak: streak,
      } as any,
    },
  });

  return {
    currentStreak: streak,
    lastActivityDate: today.toISOString(),
    isActive: true,
  };
}
