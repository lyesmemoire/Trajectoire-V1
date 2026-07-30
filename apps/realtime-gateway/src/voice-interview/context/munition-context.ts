export function buildMunitionContext(munitionPack: {
    munitions: Array<{
      suggestedQuestion: string;
      evidence?:         string;
      severity?:         string;
    }>;
    context?: {
      riskLevel:  string;
      overallATS: number;
    };
  }, overallScore: _number): string {
  const top = munitionPack.munitions?.[0];
  if (!top) return "";

  return [
    `ANALYSE ATS (score global ${overallScore}/100) :`,
    `Niveau de risque recruteur : ${munitionPack.context?.riskLevel ?? "MOYEN"}`,
    ``,
    `Question d'attaque prioritaire pour Q1 :`,
    `"${top.suggestedQuestion}"`,
    top.evidence ? `Preuve dans le CV : "${top.evidence}"` : "",
    ``,
    `INSTRUCTION : Ta première question difficile DOIT être basée sur`,
    `cette munition. Elle est extraite du CV réel — ne pas généraliser.`
  ]
    .filter(Boolean)
    .join("\n");
}
