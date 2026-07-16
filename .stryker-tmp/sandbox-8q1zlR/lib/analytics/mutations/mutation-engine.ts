/**
 * Mutation Engine : Analyse les trajectoires pour extraire des récits de changement.
 */
// @ts-nocheck


export interface UserMutation {
  id: string;
  userRole: string;
  sessionNumber: number;
  mutation: string;
  turningPoint: string;
  trend: string;
  timestamp: string;
}

/**
 * Simule l'extraction d'une mutation narrative à partir d'une série de sessions.
 */
export function extractNarrativeMutation(
  user: any,
  sessions: any[],
): UserMutation {
  const lastSession = sessions[sessions.length - 1];
  const previousSession = sessions[sessions.length - 2];

  const currentConfidence = lastSession.confidenceScore || 50;
  const previousConfidence = previousSession?.confidenceScore || 50;

  const currentClarity = lastSession.clarityScore || 50;
  const previousClarity = previousSession?.clarityScore || 50;

  // Logique de détection de mutation
  if (currentConfidence > previousConfidence + 15) {
    return {
      id: user.id,
      userRole: user.name || "Candidat",
      sessionNumber: sessions.length,
      mutation: "L'assurance verbale devient le pilier du discours.",
      turningPoint:
        "A cessé de s'excuser après la deuxième interruption de Victor.",
      trend: "Confidence en hausse constante (+18pts).",
      timestamp: lastSession.createdAt,
    };
  }

  if (currentClarity > previousClarity + 10) {
    return {
      id: user.id,
      userRole: user.name || "Candidat",
      sessionNumber: sessions.length,
      mutation: "Capacité de synthèse en forte progression.",
      turningPoint:
        "Victor a validé la structure STAR sur la question complexe.",
      trend: "Temps de réponse réduit de 20s en moyenne.",
      timestamp: lastSession.createdAt,
    };
  }

  return {
    id: user.id,
    userRole: user.name || "Candidat",
    sessionNumber: sessions.length,
    mutation: "Stabilisation du profil professionnel.",
    turningPoint: "Réponses cohérentes sur l'ensemble de la session.",
    trend: "Régularité confirmée sur 3 sessions.",
    timestamp: lastSession.createdAt,
  };
}
