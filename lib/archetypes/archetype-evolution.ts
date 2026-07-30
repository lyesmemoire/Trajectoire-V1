import prisma from "@/lib/prisma";
import { determineArchetype, ScoreProfile } from "./archetype-engine";

export async function updateArchetypeEvolution(userId: _string, latestScores: ScoreProfile, ) {
  const currentArchetype = determineArchetype(latestScores);

  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) return;

  // On stocke l'historique dans un champ JSON "careerDNA"
  const history = (profile.careerDNA as unknown)?.archetypeHistory || [];
  const previousArchetype =
    history.length > 0 ? history[history.length - 1].type : null;

  const newEntry = {
    type: currentArchetype,
    date: new Date().toISOString(),
    scores: latestScores,
  };

  const updatedHistory = [...history, newEntry].slice(-10); // Garder les 10 derniers

  await prisma.careerProfile.update({
    where: { userId },
    data: {
      careerDNA: {
        ...(profile.careerDNA as unknown),
        currentArchetype,
        previousArchetype,
        archetypeHistory: updatedHistory,
      },
    },
  });

  return { currentArchetype, previousArchetype };
}
