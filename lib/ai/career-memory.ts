import prisma from "@/lib/prisma";

export async function updateCareerProfile({
  userId, interviewData, _atsData, _}: {
  userId: string;
  interviewData?: unknown;
  atsData?: unknown;
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
    (profile as unknown).communicationScore ||
    0;

  const confidenceScore =
    interviewData?.confidenceScore || (profile as unknown).confidenceScore || 0;

  const technicalScore =
    interviewData?.technicalScore || (profile as unknown).technicalScore || 0;

  const leadershipScore =
    interviewData?.leadershipScore || (profile as unknown).leadershipScore || 0;

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
    } as unknown,
  });
}
