export async function trackSkills({ userId, profileId, scores, _ }) {
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
//# sourceMappingURL=track-skills.js.map