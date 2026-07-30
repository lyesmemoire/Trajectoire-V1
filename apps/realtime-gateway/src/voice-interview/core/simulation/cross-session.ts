/**
 * core/simulation/cross-session.ts — Continuité inter-entretien (P3.8). PURE.
 *
 * Donne la sensation « on se souvient de toi », avec une distorsion contrôlée
 * (humain simulé, pas DB parfaite).
 */

export interface PreviousSession {
  summary: string;
  contradictions: number;
  score: number;
}

export interface CrossSessionState {
  previousSessions: PreviousSession[];
}

export function createCrossSessionState(previous: PreviousSession[] = [], ): CrossSessionState {
  return { previousSessions: previous };
}

/** Y a-t-il un historique à exploiter ? */
export function hasHistory(state: CrossSessionState): boolean {
  return state.previousSessions.length > 0;
}

/**
 * Construit une accroche mémoire, reformulée et parfois incomplète
 * (distorsion contrôlée) à partir de la dernière session.
 */
export function buildMemoryHook(state: CrossSessionState): string | null {
  const last = state.previousSessions[state.previousSessions.length - 1];
  if (!last) return null;

  // Distorsion : on ne ressort pas le résumé brut, on le reformule grossièrement.
  if (last.contradictions > 0) {
    return "Lors de notre dernier échange, certains points méritaient d'être clarifiés. Reprenons.";
  }
  if (last.score >= 70) {
    return "La dernière fois, tu avais plutôt bien défendu ton parcours. Voyons si ça se confirme.";
  }
  return "On a déjà échangé précédemment. On va creuser un peu plus aujourd'hui.";
}
