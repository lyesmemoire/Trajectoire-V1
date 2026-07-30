export type ReturnIntent = "reflection" | "repair" | "growth" | "unknown";

/**
 * Détecte la motivation psychologique d'un utilisateur à revenir.
 */
export function detectReturnIntent(sessionData: unknown, engagementLogs: unknown[], ): ReturnIntent {
  // 1. Cas "Reflection" : Replay ouvert plusieurs fois, lecture longue
  const replayRewatches = engagementLogs.filter(
    (l) => l.event === "moment_rewatched",
  ).length;
  if (replayRewatches > 3) return "reflection";

  // 2. Cas "Repair" : Session difficile (score < 50) + abandon ou frustration détectée
  if (sessionData.score < 50 && sessionData.pressureLevel > 70) return "repair";

  // 3. Cas "Growth" : Score en hausse + consultation des benchmarks
  if (sessionData.isImproving) return "growth";

  return "unknown";
}
