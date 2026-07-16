// @ts-nocheck

export async function trackSkills({
  userId,
  profileId,
  scores,
}: {
  userId: string;
  profileId: string;
  scores: Record<string, number>;
}) {
  // const entries = Object.entries(scores).map(([skill, score]) => ({
  //   userId,
  //   profileId,
  //   skillName: skill,
  //   score,
  //   source: "interview",
  // }));

  // await prisma.skillProgress.createMany({
  //   data: entries,
  // });
  console.warn("trackSkills called but SkillProgress model is missing");
}
