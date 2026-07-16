// @ts-nocheck
import prisma from "@/lib/prisma";

export async function updateCareerProfile({
  userId,
  interviewData,
  atsData,
}: {
  userId: string;
  interviewData?: any;
  atsData?: any;
}) {
  let profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.careerProfile.create({
      data: {
        userId,
      },
    });
  }

  const communicationScore =
    interviewData?.communicationScore ||
    (profile as any).communicationScore ||
    0;

  const confidenceScore =
    interviewData?.confidenceScore || (profile as any).confidenceScore || 0;

  const technicalScore =
    interviewData?.technicalScore || (profile as any).technicalScore || 0;

  const leadershipScore =
    interviewData?.leadershipScore || (profile as any).leadershipScore || 0;

  const globalScore = Math.round(
    (communicationScore + confidenceScore + technicalScore + leadershipScore) /
      4,
  );

  return prisma.careerProfile.update({
    where: { userId },
    data: {
      communicationScore,
      confidenceScore,
      technicalScore,
      leadershipScore,
      globalScore,
    } as any,
  });
}
