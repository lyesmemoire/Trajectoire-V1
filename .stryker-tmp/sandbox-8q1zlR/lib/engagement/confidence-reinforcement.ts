/**
 * Génère un renforcement positif basé sur l'effort, pas juste le score.
 */
// @ts-nocheck

export function getConfidenceReinforcement(session: any): string {
  if (session.pressureLevel > 75 && session.recoveryScore > 60) {
    return "Même sous une tension extrême, vous avez su garder votre cap. C'est une force rare.";
  }

  if (session.isImproving) {
    return "Vos efforts sur la structure STAR commencent à porter leurs fruits. Continuez ce travail de fond.";
  }

  return "Prenez un moment pour assimiler cette session. La progression en entretien est un marathon, pas un sprint.";
}
