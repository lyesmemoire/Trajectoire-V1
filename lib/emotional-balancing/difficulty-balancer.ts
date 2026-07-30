/**
 * Emotional Balancing Engine to prevent user fatigue.
 */
export function balanceDifficulty(consecutiveInterruptions: number, currentStressLevel: number, ): { adjustment: number; recommendation: string } {
  // Detection of excessive pressure
  if (consecutiveInterruptions >= 3 || currentStressLevel > 85) {
    return {
      adjustment: -20,
      recommendation:
        "Relâcher la pression. Le candidat sature. Poser une question plus ouverte ou bienveillante.",
    };
  }

  // Detection of lack of challenge
  if (currentStressLevel < 30) {
    return {
      adjustment: 10,
      recommendation:
        "Augmenter le challenge. Le candidat est trop confortable.",
    };
  }

  return { adjustment: 0, recommendation: "Maintenir le cap actuel." };
}
